// Simple i18n implementation without external dependencies
export type Locale = 'en' | 'zh';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'zh'];

export async function getMessages(locale: Locale) {
  try {
    const messages = await import(`../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    // Fallback to English if locale not found
    const messages = await import(`../messages/en.json`);
    return messages.default;
  }
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// Helper function to get nested translation values
export function getTranslation(messages: any, key: string): string {
  const keys = key.split('.');
  let value = messages;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}
