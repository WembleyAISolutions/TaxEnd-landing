// lib/hooks/useAuth.ts
'use client'

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { taxEndAPI, tokenManager, UserProfile } from '../api'

interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<boolean>
  refreshToken: () => Promise<boolean>
  clearError: () => void
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

      // Check if user has valid token
      if (taxEndAPI.isAuthenticated()) {
        // Try to refresh token if needed
        const refreshed = await taxEndAPI.refreshTokenIfNeeded()
        
        if (refreshed || taxEndAPI.isAuthenticated()) {
          // Get user profile
          const profileResponse = await taxEndAPI.getUserProfile()
          
          if (profileResponse.success && profileResponse.data) {
            setAuthState({
              user: profileResponse.data,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            return
          }
        }
      }

      // No valid authentication
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      })
    }
  }

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await taxEndAPI.login(email, password)

      if (response.success && response.data) {
        setAuthState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
        return true
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Login failed',
        }))
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      return false
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

      await taxEndAPI.logout()

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Logout error:', error)
      // Clear state even if API call fails
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }, [])

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

      // Use the authAPI directly for registration
      const { authAPI } = await import('../api')
      const response = await authAPI.register(data)

      if (response) {
        // After successful registration, log the user in
        const loginSuccess = await login(data.email, data.password)
        return loginSuccess
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Registration failed',
        }))
        return false
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))
      return false
    }
  }, [login])

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const success = await taxEndAPI.refreshTokenIfNeeded()
      
      if (success) {
        // Get updated user profile
        const profileResponse = await taxEndAPI.getUserProfile()
        
        if (profileResponse.success && profileResponse.data) {
          setAuthState(prev => ({
            ...prev,
            user: profileResponse.data,
            isAuthenticated: true,
            error: null,
          }))
          return true
        }
      }

      // Token refresh failed
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired',
      })
      return false
    } catch (error) {
      console.error('Token refresh error:', error)
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Session expired',
      })
      return false
    }
  }, [])

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...authState,
    login,
    logout,
    register,
    refreshToken,
    clearError,
  }
}

// Auth Provider Component (Note: This should be used in a .tsx file)
export function createAuthProvider() {
  return function AuthProvider({ children }: { children: React.ReactNode }) {
    const auth = useAuthState()

    return React.createElement(
      AuthContext.Provider,
      { value: auth },
      children
    )
  }
}

// Higher-order component for protected routes (Note: This should be used in a .tsx file)
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return React.createElement(
        'div',
        { className: 'flex items-center justify-center min-h-screen' },
        React.createElement(
          'div',
          { className: 'animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600' }
        )
      )
    }

    if (!isAuthenticated) {
      return React.createElement(
        'div',
        { className: 'flex items-center justify-center min-h-screen' },
        React.createElement(
          'div',
          { className: 'text-center' },
          React.createElement(
            'h2',
            { className: 'text-2xl font-bold text-gray-900 mb-4' },
            'Authentication Required'
          ),
          React.createElement(
            'p',
            { className: 'text-gray-600' },
            'Please log in to access this page.'
          )
        )
      )
    }

    return React.createElement(Component, props)
  }
}

// Hook for checking authentication status
export function useAuthStatus() {
  const { isAuthenticated, isLoading, user } = useAuth()
  
  return {
    isAuthenticated,
    isLoading,
    user,
    isLoggedIn: isAuthenticated && !isLoading,
  }
}

// Hook for auth actions only
export function useAuthActions() {
  const { login, logout, register, refreshToken, clearError } = useAuth()
  
  return {
    login,
    logout,
    register,
    refreshToken,
    clearError,
  }
}

// Token management utilities
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: () => taxEndAPI.isAuthenticated(),
  
  // Get current access token
  getAccessToken: () => tokenManager.getAccessToken(),
  
  // Get current refresh token
  getRefreshToken: () => tokenManager.getRefreshToken(),
  
  // Clear all tokens
  clearTokens: () => tokenManager.clearTokens(),
  
  // Set tokens manually (useful for testing or external auth)
  setTokens: (accessToken: string, refreshToken: string) => {
    tokenManager.setTokens(accessToken, refreshToken)
  },
}

export default useAuth
