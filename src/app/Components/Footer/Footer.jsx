import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer-section" style={{ padding: '60px 20px 20px' }}>
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="single-footer-widget">
              <Link href="/">
                <Image src="/assets/images/logo/logo.svg" alt="Finova" width={140} height={42} />
              </Link>
              <p style={{ fontSize: '14px', color: '#ffffff', marginTop: '15px' }}>
                Créditos financieros justos, transparentes y diseñados para impulsar tus proyectos.
              </p>
            </div>
          </div>
          
          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="single-footer-widget">
              <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#ffffff'}}>Servicios</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '8px' }}>Créditos personales</li>
                <li style={{ marginBottom: '8px' }}>Asesoría financiera</li>
                <li style={{ marginBottom: '8px' }}>Refinanciación</li>
              </ul>
            </div>
          </div>
          
          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="single-footer-widget">
              <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#ffffff' }}>Empresa</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '8px' }}>Términos y condiciones</li>
                <li style={{ marginBottom: '8px' }}>Políticas de privacidad</li>
              </ul>
            </div>
          </div>
          
          <div className="col-xl-3 col-lg-3 col-md-6">
            <div className="single-footer-widget">
              <h3 style={{ fontSize: '16px', marginBottom: '15px', color: '#ffffff' }}>Contacto</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '8px' }}>+57 3226962139</li>
                <li style={{ marginBottom: '8px' }}>info@finova.com.co</li>
                <li style={{ marginBottom: '8px' }}>Calle 24 # 7 - 29 oficina 613 Pereira, Colombia.</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '40px', 
          paddingTop: '20px', 
          borderTop: '1px solid #ddd', 
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <Image 
            src="/assets/images/logo/superintendencia.png" 
            alt="Superintendencia de industria y comercio - SIC" 
            width={100} 
            height={100}
            style={{ objectFit: 'contain' }}
          />
          <p style={{ fontSize: '12px', color: '#ffffff', margin: 0 }}>
            Vigilado por la Superintendencia de industria y Comercio - SIC
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;