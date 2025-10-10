import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '10px' }}>Página no encontrada</h2>
      <p style={{ marginBottom: '20px' }}>La página que buscas no existe.</p>
      <Link 
        href="/"
        style={{
          padding: '10px 20px',
          backgroundColor: '#0033A0',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}