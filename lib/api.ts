// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Authentication APIs
const authAPI = {
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    apiCall('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    
  login: (email: string, password: string) =>
    apiCall('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    
  logout: () =>
    apiCall('/api/auth/logout', { method: 'POST' }),
    
  refreshToken: (refreshToken: string) =>
    apiCall('/api/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
};

// Tax Calculation APIs
const taxAPI = {
  calculate: (data: {
    income: number;
    deductions?: number;
    hasPrivateHealth?: boolean;
    isResident?: boolean;
  }) => apiCall('/api/tax/calculate', { method: 'POST', body: JSON.stringify(data) }),
  
  getReturns: () => apiCall('/api/tax/returns'),
  
  saveReturn: (data: any) =>
    apiCall('/api/tax/returns', { method: 'POST', body: JSON.stringify(data) }),
    
  getReturn: (id: string) => apiCall(`/api/tax/returns/${id}`),
};

// User APIs
const userAPI = {
  getProfile: () => apiCall('/api/users/profile'),
  
  updateProfile: (data: any) =>
    apiCall('/api/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
    
  changePassword: (currentPassword: string, newPassword: string) =>
    apiCall('/api/users/password', { 
      method: 'PUT', 
      body: JSON.stringify({ currentPassword, newPassword }) 
    }),
};

// Payment APIs
const paymentAPI = {
  createCheckout: (priceId: string) =>
    apiCall('/api/payments/checkout', { method: 'POST', body: JSON.stringify({ priceId }) }),
    
  getHistory: () => apiCall('/api/payments/history'),
};

// Token management
const tokenManager = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// Enhanced API client with TypeScript types and error handling
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface TaxCalculationInput {
  income: number;
  deductions?: number;
  hasPrivateHealth?: boolean;
  isResident?: boolean;
  taxYear?: number;
  state?: string;
  dependents?: number;
  superContributions?: number;
}

export interface TaxCalculationResult {
  taxableIncome: number;
  incomeTax: number;
  medicareLevy: number;
  medicareSurcharge?: number;
  totalTax: number;
  netIncome: number;
  effectiveRate: number;
  marginalRate: number;
  breakdown: {
    federalTax: number;
    stateTax?: number;
    medicare: number;
    surcharge?: number;
  };
}

export interface TaxReturn {
  id: string;
  userId: string;
  taxYear: number;
  status: 'draft' | 'completed' | 'submitted' | 'processed';
  data: TaxCalculationInput;
  result: TaxCalculationResult;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced API client class
export class TaxEndAPI {
  private static instance: TaxEndAPI;
  
  static getInstance(): TaxEndAPI {
    if (!TaxEndAPI.instance) {
      TaxEndAPI.instance = new TaxEndAPI();
    }
    return TaxEndAPI.instance;
  }

  // Enhanced tax calculation with proper error handling
  async calculateTax(input: TaxCalculationInput): Promise<ApiResponse<TaxCalculationResult>> {
    try {
      const result = await taxAPI.calculate(input);
      return {
        data: result,
        success: true,
        message: 'Tax calculation completed successfully'
      };
    } catch (error) {
      console.error('Tax calculation error:', error);
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Tax calculation failed'
      };
    }
  }

  // Enhanced authentication methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: UserProfile; tokens: { accessToken: string; refreshToken: string } }>> {
    try {
      const result = await authAPI.login(email, password);
      
      if (result.tokens) {
        tokenManager.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
      }
      
      return {
        data: result,
        success: true,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  async logout(): Promise<ApiResponse<null>> {
    try {
      await authAPI.logout();
      tokenManager.clearTokens();
      
      return {
        data: null,
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      // Clear tokens even if API call fails
      tokenManager.clearTokens();
      console.error('Logout error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed'
      };
    }
  }

  // Tax return management
  async saveTaxReturn(data: TaxCalculationInput, result: TaxCalculationResult): Promise<ApiResponse<TaxReturn>> {
    try {
      const taxReturn = await taxAPI.saveReturn({
        data,
        result,
        taxYear: data.taxYear || new Date().getFullYear(),
        status: 'completed'
      });
      
      return {
        data: taxReturn,
        success: true,
        message: 'Tax return saved successfully'
      };
    } catch (error) {
      console.error('Save tax return error:', error);
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save tax return'
      };
    }
  }

  async getTaxReturns(): Promise<ApiResponse<TaxReturn[]>> {
    try {
      const returns = await taxAPI.getReturns();
      
      return {
        data: returns,
        success: true,
        message: 'Tax returns retrieved successfully'
      };
    } catch (error) {
      console.error('Get tax returns error:', error);
      return {
        data: [],
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve tax returns'
      };
    }
  }

  // User profile management
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const profile = await userAPI.getProfile();
      
      return {
        data: profile,
        success: true,
        message: 'Profile retrieved successfully'
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve profile'
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!tokenManager.getAccessToken();
  }

  // Auto-refresh token if needed
  async refreshTokenIfNeeded(): Promise<boolean> {
    const refreshToken = tokenManager.getRefreshToken();
    
    if (!refreshToken) {
      return false;
    }

    try {
      const result = await authAPI.refreshToken(refreshToken);
      
      if (result.tokens) {
        tokenManager.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      tokenManager.clearTokens();
      return false;
    }
  }
}

// Export singleton instance
export const taxEndAPI = TaxEndAPI.getInstance();

// Export individual APIs for direct use
export { authAPI, taxAPI, userAPI, paymentAPI, tokenManager };
