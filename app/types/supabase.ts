// app/types/supabase.ts
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      subscription_plans: {
        Row: SubscriptionPlan
        Insert: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>>
      }
      user_subscriptions: {
        Row: UserSubscription
        Insert: Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserSubscription, 'id' | 'created_at' | 'updated_at'>>
      }
      payments: {
        Row: Payment
        Insert: Omit<Payment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Payment, 'id' | 'created_at' | 'updated_at'>>
      }
      tax_returns: {
        Row: TaxReturn
        Insert: Omit<TaxReturn, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<TaxReturn, 'id' | 'created_at' | 'updated_at'>>
      }
      user_usage: {
        Row: UserUsage
        Insert: Omit<UserUsage, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserUsage, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  description?: string
  price_monthly: number
  price_yearly?: number
  max_tax_returns: number
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  subscription_plan_id: string
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  current_period_start: string
  current_period_end: string
  stripe_subscription_id?: string
  created_at: string
  updated_at: string
  subscription_plans?: SubscriptionPlan
}

export interface Payment {
  id: string
  user_id: string
  subscription_id?: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  stripe_payment_intent_id?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface TaxReturn {
  id: string
  user_id: string
  tax_year: number
  status: 'draft' | 'completed' | 'submitted' | 'processed'
  data: Record<string, any>
  calculated_tax?: number
  calculated_refund?: number
  created_at: string
  updated_at: string
}

export interface UserUsage {
  id: string
  user_id: string
  month_year: string
  tax_returns_used: number
  created_at: string
  updated_at: string
}
