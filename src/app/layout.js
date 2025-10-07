import { Urbanist, Nunito } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "slick-carousel/slick/slick.css";
import "./assets/main.css";
import { GoogleTagManager } from './components/GoogleTagManager';
import Script from 'next/script';

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

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="author" content="Finova" />
        <link rel="icon" href="./assets/images/logo/favicon.png" sizes="any" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
   
        {/* Google Tag Manager */}
        <GoogleTagManager />

        {/* Meta Pixel */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
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
            `,
          }}
        />

        {/* Google Ads Tag */}
        <Script
          id="google-ads"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-17534959511"
        />
        <Script
          id="google-ads-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17534959511');
            `,
          }}
        />
      </head>
      <body className={`${urbanist.variable} ${nunito.variable}`}>
      
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