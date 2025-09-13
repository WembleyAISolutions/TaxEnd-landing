import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 === STRIPE TEST API START ===');
    
    const secretKey = process.env.STRIPE_SECRET_KEY;
    console.log('🔑 Secret Key exists:', !!secretKey);
    console.log('🔑 Secret Key format:', secretKey ? `${secretKey.substring(0, 20)}...${secretKey.substring(secretKey.length - 4)}` : 'NOT SET');
    console.log('🔑 Secret Key length:', secretKey?.length);
    console.log('🔑 Secret Key starts with sk_test_:', secretKey?.startsWith('sk_test_'));
    
    if (!secretKey) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY not found' }, { status: 500 });
    }
    
    // Test 1: Initialize Stripe
    console.log('🔌 Initializing Stripe...');
    const stripe = new Stripe(secretKey, {
      typescript: true,
    });
    console.log('✅ Stripe initialized successfully');
    
    // Test 2: Try to retrieve account info (simplest API call)
    console.log('🏢 Testing account retrieval...');
    const account = await stripe.accounts.retrieve();
    console.log('✅ Account retrieved successfully:', account.id);
    
    // Test 3: Try to list products (to verify price IDs exist)
    console.log('📦 Testing product listing...');
    const products = await stripe.products.list({ limit: 10 });
    console.log('✅ Products retrieved successfully:', products.data.length, 'products found');
    
    // List all products with details
    console.log('📋 === PRODUCT DETAILS ===');
    for (const product of products.data) {
      console.log(`🏷️ Product: ${product.name} (${product.id})`);
      console.log(`   Description: ${product.description || 'No description'}`);
      console.log(`   Active: ${product.active}`);
      console.log(`   Created: ${new Date(product.created * 1000).toISOString()}`);
    }
    
    // Test 4: List all prices to find the correct ones
    console.log('💰 === PRICE LISTING ===');
    const prices = await stripe.prices.list({ limit: 20 });
    console.log('✅ Prices retrieved successfully:', prices.data.length, 'prices found');
    
    for (const price of prices.data) {
      const amount = price.unit_amount ? (price.unit_amount / 100) : 'N/A';
      const currency = price.currency?.toUpperCase() || 'N/A';
      const interval = price.recurring?.interval || 'one-time';
      console.log(`💵 Price: ${price.id}`);
      console.log(`   Amount: ${amount} ${currency} per ${interval}`);
      console.log(`   Product: ${price.product}`);
      console.log(`   Active: ${price.active}`);
      console.log(`   Created: ${new Date(price.created * 1000).toISOString()}`);
      console.log('   ---');
    }
    
    console.log('🧪 === STRIPE TEST API SUCCESS ===');
    return NextResponse.json({ 
      success: true, 
      accountId: account.id,
      productsCount: products.data.length,
      pricesCount: prices.data.length,
      message: 'Stripe connection successful'
    });
    
  } catch (error: any) {
    console.error('❌ === STRIPE TEST API ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    
    if (error && typeof error === 'object' && 'type' in error) {
      console.error('Stripe error type:', error.type);
      console.error('Stripe error code:', error.code);
    }
    
    console.error('Full error:', error);
    
    return NextResponse.json({ 
      error: 'Stripe test failed',
      details: error?.message || 'Unknown error',
      type: error?.constructor?.name
    }, { status: 500 });
  }
}
