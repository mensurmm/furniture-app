import createMiddleware from 'next-intl/middleware';

// Create the next-intl handler
const intlProxy = createMiddleware({
  // Our supported locales
  locales: ['en', 'am'],
  // Default locale if none is matched
  defaultLocale: 'en'
});

// Next.js 16 uses the "proxy" naming convention
export default intlProxy;

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(am|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};