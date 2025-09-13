import { NextRequest, NextResponse } from 'next/server';
import { getStripe, PRICING_PLANS, PricingPlan, getPriceId } from '@/src/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 === CHECKOUT API DEBUG START ===');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    // Log request headers
    console.log('📋 Request Headers:');
    console.log('- Content-Type:', request.headers.get('content-type'));
    console.log('- User-Agent:', request.headers.get('user-agent'));
    console.log('- Origin:', request.headers.get('origin'));
    console.log('- Referer:', request.headers.get('referer'));
    
    // Parse request body
    const body = await request.json();
    const { plan, billingCycle = 'monthly' } = body;
    
    console.log('📥 Request received:');
    console.log('- Full request body:', JSON.stringify(body, null, 2));
    console.log('- Plan requested:', plan);
    console.log('- Billing cycle:', billingCycle);
    console.log('- Plan type:', typeof plan);
    console.log('- Billing cycle type:', typeof billingCycle);

    // Enhanced Environment variables check
    console.log('🔑 Environment Variables (masked):');
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    console.log('- STRIPE_SECRET_KEY exists:', !!stripeSecretKey);
    console.log('- STRIPE_SECRET_KEY format:', stripeSecretKey ? `${stripeSecretKey.substring(0, 7)}...${stripeSecretKey.substring(stripeSecretKey.length - 4)}` : 'NOT SET');
    console.log('- STRIPE_SECRET_KEY starts with sk_test_:', stripeSecretKey?.startsWith('sk_test_'));
    console.log('- NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
    
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    console.log('- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY exists:', !!publishableKey);
    console.log('- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY format:', publishableKey ? `${publishableKey.substring(0, 7)}...${publishableKey.substring(publishableKey.length - 4)}` : 'NOT SET');
    
    console.log('💰 Price ID Environment Variables:');
    const basicPriceId = process.env.STRIPE_BASIC_PRICE_ID;
    const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
    const enterprisePriceId = process.env.STRIPE_ENTERPRISE_PRICE_ID;
    
    console.log('- STRIPE_BASIC_PRICE_ID:', basicPriceId || 'NOT SET');
    console.log('- STRIPE_BASIC_PRICE_ID valid format:', basicPriceId?.startsWith('price_'));
    console.log('- STRIPE_PRO_PRICE_ID:', proPriceId || 'NOT SET');
    console.log('- STRIPE_PRO_PRICE_ID valid format:', proPriceId?.startsWith('price_'));
    console.log('- STRIPE_ENTERPRISE_PRICE_ID:', enterprisePriceId || 'NOT SET');
    console.log('- STRIPE_ENTERPRISE_PRICE_ID valid format:', enterprisePriceId?.startsWith('price_'));
    
    // Log yearly price IDs too
    console.log('📅 Yearly Price ID Environment Variables:');
    console.log('- STRIPE_BASIC_YEARLY_PRICE_ID:', process.env.STRIPE_BASIC_YEARLY_PRICE_ID || 'NOT SET');
    console.log('- STRIPE_PRO_YEARLY_PRICE_ID:', process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'NOT SET');
    console.log('- STRIPE_ENTERPRISE_YEARLY_PRICE_ID:', process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID || 'NOT SET');

    // Validate plan
    if (!plan) {
      console.log('❌ No plan provided');
      return NextResponse.json({ error: 'Plan is required' }, { status: 400 });
    }

    if (!['basic', 'pro', 'professional', 'enterprise'].includes(plan)) {
      console.log('❌ Invalid plan:', plan);
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Validate billing cycle
    if (!['monthly', 'yearly'].includes(billingCycle)) {
      console.log('❌ Invalid billing cycle:', billingCycle);
      return NextResponse.json({ error: 'Invalid billing cycle' }, { status: 400 });
    }

    // Map plan to price ID with support for both 'pro' and 'professional'
    let priceId: string;
    let planName: string;

    console.log('🗺️ Mapping plan to Price ID...');
    
    switch (plan) {
      case 'basic':
        priceId = billingCycle === 'yearly' 
          ? process.env.STRIPE_BASIC_YEARLY_PRICE_ID || 'MISSING_BASIC_YEARLY'
          : process.env.STRIPE_BASIC_PRICE_ID || 'MISSING_BASIC';
        planName = 'Basic';
        break;
      case 'pro':
      case 'professional':
        priceId = billingCycle === 'yearly'
          ? process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'MISSING_PRO_YEARLY'
          : process.env.STRIPE_PRO_PRICE_ID || 'MISSING_PRO';
        planName = 'Pro';
        break;
      case 'enterprise':
        priceId = billingCycle === 'yearly'
          ? process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID || 'MISSING_ENTERPRISE_YEARLY'
          : process.env.STRIPE_ENTERPRISE_PRICE_ID || 'MISSING_ENTERPRISE';
        planName = 'Enterprise';
        break;
      default:
        console.log('❌ Unhandled plan in switch:', plan);
        return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    console.log('✅ Plan mapping result:');
    console.log('- Plan name:', planName);
    console.log('- Mapped Price ID:', priceId);
    console.log('- Billing cycle:', billingCycle);

    // Check if Price ID is missing or placeholder
    if (!priceId || priceId.includes('MISSING_') || priceId.includes('REPLACE_WITH_') || priceId.includes('NEED_TO_CREATE_')) {
      console.log('❌ Price ID is missing or placeholder:', priceId);
      return NextResponse.json(
        { 
          error: 'Stripe products not configured',
          details: `Please create the ${planName} plan in your Stripe Dashboard and update the corresponding environment variable in .env.local`
        },
        { status: 400 }
      );
    }

    // Get Stripe instance
    console.log('🔌 Initializing Stripe...');
    const stripe = getStripe();
    console.log('✅ Stripe initialized successfully');

    console.log('🚀 Creating Stripe checkout session...');
    console.log('- Using Price ID:', priceId);
    console.log('- Success URL:', `${process.env.NEXT_PUBLIC_APP_URL}/en/success?session_id={CHECKOUT_SESSION_ID}`);
    console.log('- Cancel URL:', `${process.env.NEXT_PUBLIC_APP_URL}/en/pricing`);

    // Prepare session parameters (subscription mode compatible)
    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/pricing`,
      metadata: {
        plan: plan,
        billingCycle: billingCycle,
      },
      subscription_data: {
        metadata: {
          plan: plan,
          billingCycle: billingCycle,
        },
      },
      allow_promotion_codes: true,
    } as any;

    console.log('📋 Session parameters:', JSON.stringify(sessionParams, null, 2));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log('✅ Stripe session created successfully:');
    console.log('- Session ID:', session.id);
    console.log('- Session URL:', session.url);
    console.log('- Session mode:', session.mode);
    console.log('- Session status:', session.status);

    console.log('🔍 === CHECKOUT API DEBUG END ===');
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('❌ === CHECKOUT API ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    
    // Log Stripe-specific error details
    if (error && typeof error === 'object' && 'type' in error) {
      console.error('Stripe error type:', error.type);
      console.error('Stripe error code:', error.code);
      console.error('Stripe error param:', error.param);
      console.error('Stripe error detail:', error.detail);
    }
    
    console.error('Full error object:', error);
    console.error('Error stack:', error?.stack);
    
    // Return more detailed error information
    const errorMessage = error?.message || 'Failed to create checkout session';
    const errorDetails = error && typeof error === 'object' && 'type' in error 
      ? `Stripe Error: ${error.type} - ${error.message}`
      : errorMessage;
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
