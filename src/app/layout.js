import { Urbanist, Nunito } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "slick-carousel/slick/slick.css";
import "./assets/main.css";

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--body-color-font',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--heading-font',
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="author" content="Finova" />
        <link rel="icon" href="./assets/images/favicon.png" sizes="any" />
      </head>
      <body className={`${urbanist.variable} ${nunito.variable}`}>
        {children}
      </body>
    </html>
  );
}