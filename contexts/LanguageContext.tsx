'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, defaultLocale, getMessages, getTranslation } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  messages: any;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LanguageProvider({ children, initialLocale = defaultLocale }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load messages when locale changes
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const newMessages = await getMessages(locale);
        setMessages(newMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to English messages
        const fallbackMessages = await getMessages('en');
        setMessages(fallbackMessages);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [locale]);

  // Load initial locale from localStorage or browser preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
        setLocaleState(savedLocale);
      } else {
        // Detect browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('zh')) {
          setLocaleState('zh');
        } else {
          setLocaleState('en');
        }
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  };

  const t = (key: string): string => {
    return getTranslation(messages, key);
  };

  const value: LanguageContextType = {
    locale,
    messages,
    setLocale,
    t,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
