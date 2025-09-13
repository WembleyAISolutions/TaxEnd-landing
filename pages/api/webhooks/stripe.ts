// pages/api/webhooks/stripe.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import Stripe from 'stripe'
import { supabase } from '../../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret)
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message)
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout session completed:', session.id)
  
  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    await handleSubscriptionChange(subscription)
  }
  
  // Create payment record
  if (session.payment_intent) {
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string)
    
    await supabase.from('payments').insert({
      stripe_payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'succeeded',
      description: session.metadata?.description || 'Subscription payment',
    } as any)
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('Processing subscription change:', subscription.id)
  
  const customer = await stripe.customers.retrieve(subscription.customer as string)
  if (!customer || customer.deleted) return
  
  const customerEmail = (customer as Stripe.Customer).email
  if (!customerEmail) return
  
  // Find user by email
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', customerEmail)
    .single()
  
  if (!user) return
  
  // Find subscription plan by Stripe price ID
  const priceId = subscription.items.data[0]?.price.id
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('id')
    .or(`stripe_price_id_monthly.eq.${priceId},stripe_price_id_yearly.eq.${priceId}`)
    .single()
  
  if (!plan) return
  
  // Upsert user subscription
  await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: user.id,
      plan_id: plan.id,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      status: subscription.status as any,
      billing_cycle: subscription.items.data[0]?.price.recurring?.interval === 'month' ? 'monthly' : 'yearly',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    } as any, {
      onConflict: 'stripe_subscription_id'
    })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing subscription deleted:', subscription.id)
  
  await supabase
    .from('user_subscriptions')
    .update({ 
      status: 'canceled',
      cancel_at_period_end: true 
    } as any)
    .eq('stripe_subscription_id', subscription.id)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing payment succeeded:', invoice.id)
  
  if (invoice.subscription) {
    const customer = await stripe.customers.retrieve(invoice.customer as string)
    if (!customer || customer.deleted) return
    
    const customerEmail = (customer as Stripe.Customer).email
    if (!customerEmail) return
    
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', customerEmail)
      .single()
    
    if (!user) return
    
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('stripe_subscription_id', invoice.subscription)
      .single()
    
    await supabase.from('payments').insert({
      user_id: user.id,
      subscription_id: subscription?.id,
      stripe_payment_intent_id: invoice.payment_intent as string,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      description: `Invoice ${invoice.number}`,
    } as any)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing payment failed:', invoice.id)
  
  if (invoice.subscription) {
    await supabase
      .from('user_subscriptions')
      .update({ status: 'past_due' } as any)
      .eq('stripe_subscription_id', invoice.subscription)
  }
}
