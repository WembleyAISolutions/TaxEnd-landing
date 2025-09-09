import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh', 'ar', 'vi', 'zh-HK', 'pa', 'el', 'it', 'hi', 'es', 'tl', 'th', 'ko', 'fil', 'de', 'fr', 'ru', 'pt', 'ja', 'sr', 'hr', 'yi', 'ur', 'ne', 'tr'],
 
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Always show the locale prefix
  localePrefix: 'always'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(zh|ar|vi|zh-HK|pa|el|it|hi|es|tl|th|ko|fil|de|fr|ru|pt|ja|sr|hr|yi|ur|ne|tr|en)/:path*']
};
