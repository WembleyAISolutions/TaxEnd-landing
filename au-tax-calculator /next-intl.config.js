import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
 
const locales = ['en', 'zh', 'ar', 'vi', 'zh-HK', 'pa', 'el', 'it', 'hi', 'es', 'tl', 'th', 'ko', 'fil', 'de', 'fr', 'ru', 'pt', 'ja', 'sr', 'hr', 'yi', 'ur', 'ne', 'tr'];
 
export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale)) notFound();
 
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
