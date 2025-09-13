// types/supabase.ts
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string | null
          price_monthly: number | null
          price_yearly: number | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          features: Json | null
          max_tax_returns: number | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price_monthly?: number | null
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          features?: Json | null
          max_tax_returns?: number | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price_monthly?: number | null
          price_yearly?: number | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          features?: Json | null
          max_tax_returns?: number | null
          is_active?: boolean | null
          created_at?: string
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string | null
          plan_id: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | null
          billing_cycle: 'monthly' | 'yearly' | null
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          plan_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | null
          billing_cycle?: 'monthly' | 'yearly' | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          plan_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | null
          billing_cycle?: 'monthly' | 'yearly' | null
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string | null
          subscription_id: string | null
          stripe_payment_intent_id: string | null
          amount: number | null
          currency: string | null
          status: 'succeeded' | 'pending' | 'failed' | null
          payment_method: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          subscription_id?: string | null
          stripe_payment_intent_id?: string | null
          amount?: number | null
          currency?: string | null
          status?: 'succeeded' | 'pending' | 'failed' | null
          payment_method?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          subscription_id?: string | null
          stripe_payment_intent_id?: string | null
          amount?: number | null
          currency?: string | null
          status?: 'succeeded' | 'pending' | 'failed' | null
          payment_method?: string | null
          description?: string | null
          created_at?: string
        }
      }
      tax_returns: {
        Row: {
          id: string
          user_id: string | null
          tax_year: number | null
          status: 'draft' | 'in_progress' | 'completed' | 'filed' | null
          data: Json | null
          file_urls: string[] | null
          total_refund: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          tax_year?: number | null
          status?: 'draft' | 'in_progress' | 'completed' | 'filed' | null
          data?: Json | null
          file_urls?: string[] | null
          total_refund?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          tax_year?: number | null
          status?: 'draft' | 'in_progress' | 'completed' | 'filed' | null
          data?: Json | null
          file_urls?: string[] | null
          total_refund?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_usage: {
        Row: {
          id: string
          user_id: string | null
          tax_returns_used: number | null
          month_year: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          tax_returns_used?: number | null
          month_year?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          tax_returns_used?: number | null
          month_year?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_subscription_status: {
        Args: {
          p_stripe_subscription_id: string
          p_status: string
          p_current_period_start: string
          p_current_period_end: string
        }
        Returns: undefined
      }
      check_usage_limit: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type User = Database['public']['Tables']['users']['Row']
export type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row']
export type UserSubscription = Database['public']['Tables']['user_subscriptions']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type TaxReturn = Database['public']['Tables']['tax_returns']['Row']
export type UserUsage = Database['public']['Tables']['user_usage']['Row']
