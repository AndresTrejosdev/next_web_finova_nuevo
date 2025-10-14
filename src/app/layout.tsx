import './globals.css';
import { Urbanist, Nunito, Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "slick-carousel/slick/slick.css";
import "./assets/main.css";
import { GoogleTagManager } from './Components/GoogleTagManager';
import Script from 'next/script';
import { ReactNode } from 'react';
import FloatingButtons from './Components/FloatingButtons';

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--body-color-font',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--heading-font',
  display: 'swap',
});

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    absolute: '',
    default: 'Finova - Créditos de libre inversión online en Colombia',
    template: '%s | Finova - Tu Aliado Financiero',
  },
  description: 'Créditos 100% en línea con desembolso en 24 horas. Entidad registrada y vigilada. Solicita tu préstamo personal fácil, rápido y seguro.',
  keywords: [
    'créditos de libre inversión online',
    'Préstamos en colombia',
    'Préstamos personales en Colombia',
    'crédito personal fácil y seguro',
    'créditos online',
    'asesoría financiera',
    'créditos en línea sin papeleos',
    'créditos Pereira',
    'Finova'
  ],
  authors: [{ name: 'Finova' }],
  
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1468B1' },
    { media: '(prefers-color-scheme: dark)', color: '#12274B' },
  ],

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Finova',
  },
  
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  
  openGraph: {
    title: 'Finova - Créditos de libre inversión online en Colombia',
    description: '+5000 personas ya eligieron Finova para sus créditos online',
    url: 'https://www.finova.com.co',
    siteName: 'Finova',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: '/assets/images/logo/finova-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Finova - Créditos Online',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Finova - Créditos de libre inversión online en Colombia',
    description: '+5000 personas ya eligieron Finova para sus créditos online',
    images: ['/assets/images/logo/finova-og-image.jpg'],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  manifest: '/manifest.json', 
  alternates: {
    canonical: 'https://www.finova.com.co',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="author" content="Finova" />
        <link rel="icon" href="./assets/images/logo/favicon.png" sizes="any" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

         {/* Font Awesome para íconos */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        
        {/* Bootstrap Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
        />
   
        {/* Google Tag Manager */}
        <GoogleTagManager />
      </head>
      <body className={`${urbanist.variable} ${nunito.variable} ${inter.className}`}>
      
        {/* GTM noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T7VPCJ6J"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {children}

        {/* Botones flotantes unificados */}
        <FloatingButtons />

        {/* Widget de Zadarma */}
        <Script id="zadarma-callback" strategy="afterInteractive">
          {`
            var ZCallbackWidgetLinkId = "f20046233c06bf54d18d5056c8866695";
            var ZCallbackWidgetDomain = "my.zadarma.com";
            (function () {
              var lt = document.createElement("script");
              lt.type = "text/javascript";
              lt.charset = "utf-8";
              lt.async = true;
              lt.src = "https://" + ZCallbackWidgetDomain + "/callbackWidget/js/main.min.js";
              var sc = document.getElementsByTagName("script")[0];
              if (sc) sc.parentNode.insertBefore(lt, sc);
              else document.documentElement.firstChild.appendChild(lt);
            })();
          `}
        </Script>

        {/* Scripts de vendor */}
        <Script src="/assets/vendor/purecounter/purecounter_vanilla.js" strategy="afterInteractive" />
        <Script src="/assets/vendor/aos/aos.js" strategy="afterInteractive" />
        <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="/assets/vendor/glightbox/js/glightbox.min.js" strategy="afterInteractive" />
        <Script src="/assets/vendor/isotope-layout/isotope.pkgd.min.js" strategy="afterInteractive" />
        <Script src="/assets/vendor/swiper/swiper-bundle.min.js" strategy="afterInteractive" />
        <Script src="/assets/vendor/php-email-form/validate.js" strategy="afterInteractive" />
        <Script src="/assets/js/main.js" strategy="afterInteractive" />

        {/* Google Ads + GA4 - CARGA AL FINAL DEL BODY */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17534959511"
          strategy="afterInteractive"
        />
        <Script id="gtag-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17534959511');
            gtag('config', 'G-M5Z5EYF1ZZ');
          `}
        </Script>

        {/* Google Ads Conversion */}
        <Script id="gtag-conversion" strategy="afterInteractive">
          {`
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                'send_to': 'AW-17534959511/Y24WCJLwyZUbEJf_qKlB',
                'value': 1.0,
                'currency': 'COP',
                'event_callback': callback
              });
              return false;
            }
          `}
        </Script>

        {/* Meta Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '767787196141415');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Meta Pixel noscript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=767787196141415&ev=PageView&noscript=1"
            alt="Meta Pixel"
          />
        </noscript>
          
      </body>
    </html>
  );
}