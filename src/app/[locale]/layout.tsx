import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar'; // Changed from ../../../ to ../../
import Footer from '../../components/Footer'; // Changed from ../../../ to ../../
import './globals.css'; 

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!['en', 'am'].includes(locale)) {
    notFound();
  }

  // Retrieve translation messages for the active locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased bg-[#fcfcfc]">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}