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
    default: 'Finova - Créditos de Libre Inversión 100% Online',
    template: '%s | Finova - Tu Aliado Financiero',
  },
  description: 'Créditos de libre inversión 100% online, sin filas y con respaldo legal. Desembolso en 24 horas. Entidad registrada y vigilada por la Superintendencia Financiera de Colombia.',
  keywords: ['créditos online', 'préstamos personales', 'créditos de libre inversión', 'créditos rápidos', 'préstamos en línea Colombia', 'créditos Pereira', 'Finova'],
  authors: [{ name: 'Finova' }],
  openGraph: {
    title: 'Finova - Créditos de Libre Inversión 100% Online',
    description: 'Solicita tu crédito en minutos. Desembolso en 24 horas, sin filas y con respaldo legal. +5000 personas nos eligieron.',
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
    title: 'Finova - Créditos de Libre Inversión 100% Online',
    description: 'Solicita tu crédito en minutos. Desembolso en 24 horas.',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${urbanist.variable} ${nunito.variable}`}>
        {children}
      </body>
    </html>
  );
}