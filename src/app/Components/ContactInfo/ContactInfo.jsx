"use client"
import FinovaButton from '../Common/FinovaButton';

const ContactInfo = () => {
    return (
        <div>
            <section className="contact-section section-padding fix">
                <div className="container">
                    <div className="contact-wrapper style1">
                        <div className="row gy-5">
                            {/* CARD 1: Dirección */}
                            <div className="col-xl-4 col-md-6">
                                <div className="contact-info-box style1">
                                    <div className="contact-content">
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                                                <path d="M40.1533 6.25004C39.2892 6.24379 38.5845 6.9391 38.5783 7.8016C38.572 8.6641 39.2658 9.36879 40.1298 9.37504C40.9923 9.38129 41.697 8.68754 41.7033 7.82504C41.7095 6.96254 41.0158 6.25785 40.1533 6.25004ZM40.0822 15.6249C34.0492 15.5821 29.1084 20.4491 29.0628 26.4802C29.0173 32.511 33.887 37.4541 39.9181 37.4996L40.0019 37.4999C45.9945 37.4999 50.8922 32.6474 50.9375 26.6443C50.983 20.6138 46.1134 15.6704 40.0822 15.6249ZM40.0016 34.375L39.9416 34.3747C35.6336 34.3422 32.1552 30.8113 32.1877 26.5036C32.22 22.2154 35.7181 18.7494 39.9988 18.7494L40.0588 18.7497C44.3667 18.7822 47.8452 22.3132 47.8127 26.6208C47.7802 30.9091 44.2822 34.375 40.0016 34.375ZM46.8175 7.43504C46.0047 7.1466 45.1111 7.57239 44.8227 8.38582C44.5344 9.19926 44.9602 10.0922 45.7734 10.3807C52.6558 12.8199 57.2425 19.3747 57.1875 26.6914C57.1811 27.5543 57.8753 28.2591 58.7383 28.2657H58.7503C59.6075 28.2657 60.3059 27.5738 60.3125 26.7149C60.3775 18.0669 54.9542 10.3189 46.8175 7.43504Z" fill="#1468B1"/>
                                                <path d="M49.5876 58.8191C59.9803 45.4417 66.4751 38.4659 66.5628 26.7622C66.6728 12.0367 54.7225 0 39.9981 0C25.4456 0 13.549 11.7856 13.4384 26.3638C13.349 38.3848 19.9645 45.3511 30.4289 58.8169C20.0187 60.3725 13.4384 64.2814 13.4384 69.0625C13.4384 72.2652 16.3987 75.1391 21.7742 77.1547C26.6668 78.9894 33.1398 79.9998 40.0006 79.9998C46.8614 79.9998 53.3343 78.9894 58.227 77.1547C63.6025 75.1389 66.5628 72.265 66.5628 69.0623C66.5628 64.2839 59.9885 60.3759 49.5876 58.8191ZM16.5632 26.3873C16.6607 13.5234 27.1568 3.125 39.9984 3.125C52.992 3.125 63.5348 13.7481 63.4379 26.7389C63.3548 37.8536 56.467 44.7031 45.4706 59.038C43.5092 61.5936 41.7079 64.0098 40.0029 66.3734C38.3029 64.0084 36.5376 61.6355 34.5468 59.037C23.0959 44.102 16.4786 37.7702 16.5632 26.3873ZM40.0006 76.875C26.5864 76.875 16.5632 72.7505 16.5632 69.0625C16.5632 66.3275 22.5551 62.8725 32.6298 61.6761C34.8568 64.5981 36.8093 67.2528 38.7243 69.9641C38.8685 70.1682 39.0595 70.3347 39.2813 70.4497C39.5031 70.5647 39.7493 70.6248 39.9992 70.625H40.0006C40.2502 70.625 40.4963 70.5652 40.718 70.4505C40.9398 70.3359 41.1309 70.1698 41.2753 69.9661C43.1721 67.2902 45.1781 64.57 47.3861 61.6778C57.4514 62.8755 63.4379 66.3294 63.4379 69.0627C63.4378 72.7505 53.4148 76.875 40.0006 76.875Z" fill="#1468B1"/>
                                            </svg>
                                        </div>
                                        <div className="title">Nuestra Dirección</div>
                                        <a className="text" href="https://maps.app.goo.gl/8vYx8KqHfZ8A9sJd9" target="_blank" rel="noopener noreferrer">
                                            Calle 24 # 7-29 oficina 613<br />
                                            Pereira, Risaralda, Colombia
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* CARD 2: WhatsApp */}
                            <div className="col-xl-4 col-md-6">
                                <div className="contact-info-box style1">
                                    <div className="contact-content">
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                                                <path d="M68.125 11.5625C60.5625 3.9375 50.5625 0 40 0C18.0625 0 0.25 17.8125 0.25 39.75C0.25 46.75 2.125 53.5625 5.6875 59.5625L0 80L21 74.4375C26.8125 77.6875 33.375 79.375 40 79.375C62 79.375 79.75 61.5625 79.75 39.625C79.75 29.0625 75.75 19.1875 68.125 11.5625ZM40 72.625C34.0625 72.625 28.25 71.0625 23.125 68.125L22 67.4375L9.5 70.6875L12.8125 58.5L12.0625 57.3125C8.8125 52 7.125 45.9375 7.125 39.75C7.125 21.625 21.875 6.875 40 6.875C48.875 6.875 57.1875 10.3125 63.4375 16.625C69.6875 22.9375 73.0625 31.25 73.0625 40.125C73.0625 57.875 58.125 72.625 40 72.625ZM58 47.875C57 47.375 52 44.9375 51.0625 44.5625C50.125 44.25 49.4375 44.0625 48.75 45C48.0625 46 46.1875 48.3125 45.5625 49C44.9375 49.6875 44.3125 49.75 43.3125 49.25C42.3125 48.75 39.125 47.625 35.3125 44.25C32.3125 41.625 30.25 38.375 29.625 37.375C29 36.375 29.5625 35.8125 30.0625 35.3125C30.5 34.875 31.0625 34.1875 31.5625 33.5625C32.0625 32.9375 32.25 32.5 32.5625 31.8125C32.875 31.125 32.6875 30.5 32.4375 30C32.1875 29.5 30.125 24.5 29.25 22.5C28.375 20.5625 27.5 20.8125 26.875 20.75H24.875C24.1875 20.75 23.1875 21 22.25 22C21.3125 23 18.75 25.4375 18.75 30.4375C18.75 35.4375 22.3125 40.25 22.8125 40.9375C23.3125 41.625 30.25 52.0625 40.75 56.5C43.125 57.5625 45 58.1875 46.4375 58.6875C48.8125 59.4375 50.9375 59.3125 52.625 59.0625C54.5 58.75 58.5 56.625 59.375 54.25C60.25 51.875 60.25 49.875 60 49.375C59.75 48.875 59 48.625 58 47.875Z" fill="#1468B1"/>
                                            </svg>
                                        </div>
                                        <div className="title">WhatsApp</div>
                                        <a className="text" href="https://wa.me/573226962139" target="_blank" rel="noopener noreferrer">
                                            +57 322 696 2139
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* CARD 3: Email */}
                            <div className="col-xl-4 col-md-6">
                                <div className="contact-info-box style1">
                                    <div className="contact-content">
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                                                <path d="M70 10H10C4.5 10 0 14.5 0 20V60C0 65.5 4.5 70 10 70H70C75.5 70 80 65.5 80 60V20C80 14.5 75.5 10 70 10ZM70 20L40 38.75L10 20H70ZM70 60H10V30L40 48.75L70 30V60Z" fill="#1468B1"/>
                                            </svg>
                                        </div>
                                        <div className="title">Correo Electrónico</div>
                                        <a className="text" href="mailto:contacto@finova.com.co">
                                            contacto@finova.com.co
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact-form-section section-padding pt-0 fix">
                <div className="container">
                    <div className="contact-form-wrapper style1">
                        <div className="row gy-5 gx-60 align-items-center">
                            <div className="col-xl-12">
                                <div className="contact-map" style={{ height: '500px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(20, 104, 177, 0.15)' }}>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.289086827557!2d-75.70080789999999!4d4.8149196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38874f174e859f%3A0x1004f17cdad95f25!2sCl.%2024%20%237-29%20oficina%20613%2C%20Pereira%2C%20Risaralda!5e0!3m2!1ses!2sco!4v1632847261234!5m2!1ses!2sco"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                                
                                <div className="text-center mt-5">
                                    <h2 className="contact-title" style={{ color: '#12274B', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
                                        ¿Listo para empezar?
                                    </h2>
                                    <p className="desc" style={{ color: '#555', fontSize: '1.2rem', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>
                                        Solicita tu crédito de libre inversión de manera rápida y segura. Nuestro equipo te acompañará en cada paso del proceso.
                                    </p>
                                    
                                    <FinovaButton 
                                        variant="secondary"
                                        location="contacto"
                                        customText="Solicitar Crédito"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactInfo;