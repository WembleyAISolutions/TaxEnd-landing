import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['en', 'zh', 'ar', 'vi', 'zh-HK', 'pa', 'el', 'it', 'hi', 'es', 'tl', 'th', 'ko', 'fil', 'de', 'fr', 'ru', 'pt', 'ja', 'sr', 'hr', 'yi', 'ur', 'ne', 'tr'] as const;

export type Locale = (typeof locales)[number];
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();
 
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
