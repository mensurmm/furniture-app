import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'am'], // Change these strings to match your project's actual locales
  
  // Used when no locale matches
  defaultLocale: 'en'
});

// Export navigation utilities configured for your locales
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
