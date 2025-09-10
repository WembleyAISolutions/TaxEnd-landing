'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLocale, isLoading } = useLanguage();

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'zh' : 'en';
    setLocale(newLocale);
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Globe className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">
        {locale === 'en' ? '中文' : 'English'}
      </span>
    </Button>
  );
}
