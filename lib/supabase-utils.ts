// lib/supabase-utils.ts
import { supabase } from './supabase'
import { User, SubscriptionPlan, UserSubscription, Payment, TaxReturn, UserUsage } from '../types/supabase'

export class SupabaseService {
  // User Management
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  }

  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }

    return data
  }

  // Subscription Management
  static async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true })

    if (error) {
      console.error('Error fetching subscription plans:', error)
      return []
    }

    return data || []
  }

  static async getActiveSubscription(userId: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error) {
      console.error('Error fetching active subscription:', error)
      return null
    }

    return data
  }

  static async createSubscription(subscriptionData: Partial<UserSubscription>): Promise<UserSubscription | null> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert(subscriptionData)
      .select()
      .single()

    if (error) {
      console.error('Error creating subscription:', error)
      return null
    }

    return data
  }

  static async updateSubscription(subscriptionId: string, updates: Partial<UserSubscription>): Promise<UserSubscription | null> {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single()

    if (error) {
      console.error('Error updating subscription:', error)
      return null
    }

    return data
  }

  // Payment Management
  static async getPaymentHistory(userId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching payment history:', error)
      return []
    }

    return data || []
  }

  static async createPayment(paymentData: Partial<Payment>): Promise<Payment | null> {
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single()

    if (error) {
      console.error('Error creating payment record:', error)
      return null
    }

    return data
  }

  // Tax Return Management
  static async getTaxReturns(userId: string): Promise<TaxReturn[]> {
    const { data, error } = await supabase
      .from('tax_returns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tax returns:', error)
      return []
    }

    return data || []
  }

  static async createTaxReturn(taxReturnData: Partial<TaxReturn>): Promise<TaxReturn | null> {
    const { data, error } = await supabase
      .from('tax_returns')
      .insert(taxReturnData)
      .select()
      .single()

    if (error) {
      console.error('Error creating tax return:', error)
      return null
    }

    return data
  }

  static async updateTaxReturn(taxReturnId: string, updates: Partial<TaxReturn>): Promise<TaxReturn | null> {
    const { data, error } = await supabase
      .from('tax_returns')
      .update(updates)
      .eq('id', taxReturnId)
      .select()
      .single()

    if (error) {
      console.error('Error updating tax return:', error)
      return null
    }

    return data
  }

  // Usage Tracking
  static async getCurrentUsage(userId: string): Promise<UserUsage | null> {
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format

    const { data, error } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('month_year', currentMonth)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching current usage:', error)
      return null
    }

    return data
  }

  static async checkUsageLimit(userId: string): Promise<boolean> {
    const subscription = await this.getActiveSubscription(userId)
    if (!subscription) return false

    const usage = await this.getCurrentUsage(userId)
    const usedReturns = usage?.tax_returns_used || 0
    const maxReturns = subscription?.subscription_plans?.max_tax_returns || 0

    return usedReturns < maxReturns
  }

  static async incrementUsage(userId: string): Promise<UserUsage | null> {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const currentUsage = await this.getCurrentUsage(userId)

    if (currentUsage) {
      // Update existing usage
      const { data, error } = await supabase
        .from('user_usage')
        .update({ 
          tax_returns_used: (currentUsage.tax_returns_used || 0) + 1 
        } as any)
        .eq('id', currentUsage.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating usage:', error)
        return null
      }

      return data
    } else {
      // Create new usage record
      const { data, error } = await supabase
        .from('user_usage')
        .insert({
          user_id: userId,
          tax_returns_used: 1,
          month_year: currentMonth
        } as any)
        .select()
        .single()

      if (error) {
        console.error('Error creating usage record:', error)
        return null
      }

      return data
    }
  }
}
