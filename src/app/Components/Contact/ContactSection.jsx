// Components/Contact/ContactSection.jsx
export default function ContactSection() {
  return (
    <section id="contacto" style={{ padding: '80px 20px', backgroundColor: '#f8f9fa' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ color: '#12274B', marginBottom: '40px' }}>Contacto</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <strong style={{ color: '#1468B1' }}>Teléfono:</strong>
          <p>+57 3226962139</p>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <strong style={{ color: '#1468B1' }}>Email:</strong>
          <p>info@finova.com.co</p>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <strong style={{ color: '#1468B1' }}>Dirección:</strong>
          <p>Calle 24 # 7 - 29 oficina 613 Pereira, Colombia</p>
        </div>
      </div>
    </section>
  );
}