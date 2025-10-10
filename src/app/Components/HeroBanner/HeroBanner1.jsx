import parse from 'html-react-parser';
import Image from 'next/image';
import Link from 'next/link';
import FinovaButton from '../Common/FinovaButton';
import styles from './HeroBanner1.module.css';

const HeroBanner1 = ({subtitle, title, content, btnname, btnurl, btntwo, btn2url, cusimg, cusnumber, cuscontent, rating, ratingcon, img}) => {
    return (
        <section className="intro-section">
            <div className="intro-container-wrapper style1">
                <div className="container">
                    <div className="intro-wrapper style1 fix">
                        <div className="shape1"><Image src="/assets/images/shape/introShape1_1.png" alt="img" width={1149} height={854} /></div>
                        <div className="shape2"><Image src="/assets/images/shape/introShape1_2.png" alt="img" width={983} height={954} /></div>
                        <div className="row align-items-center">
                            {/* Columna del texto - CENTRADO */}
                            <div className="col-xl-7 order-2 order-xl-1">
                                <div className="intro-content" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    padding: '0 40px'
                                }}>
                                    <div className="intro-section-title" style={{ maxWidth: '500px' }}>
                                        <div className="intro-subtitle">
                                            {/* {parse(subtitle)} <Image src="/assets/images/icon/fireIcon.svg" alt="img" width={16} height={17} /> */}
                                        </div>
                                        <h1 className="intro-title wow fadeInUp" data-wow-delay=".2s">{title}</h1>
                                        <p className="intro-desc wow fadeInUp" data-wow-delay=".4s">{content}</p>
                                    </div>
                                    <div className="btn-wrapper style1 wow fadeInUp" data-wow-delay=".6s">
                                        <FinovaButton 
                                            variant="secondary"
                                            location="hero_principal"
                                            customText="Solicita tu crédito ahora"
                                        />
                                        {btn2url && (
                                            <Link className="theme-btn style2 wow fadeInUp" data-wow-delay=".2s" href={btn2url}>
                                                {btntwo}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <g clipPath="url(#clip0_11_27)">
                                                        <path d="M11.6118 3.61182L10.8991 4.32454L14.0706 7.49603H0V8.50398H14.0706L10.8991 11.6754L11.6118 12.3882L16 7.99997L11.6118 3.61182Z" fill="#282C32" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_11_27">
                                                            <rect width="16" height="16" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </Link>
                                        )}
                                    </div>
                                    <div className="fancy-box-wrapper style1"></div>
                                </div>
                            </div>


                          {/* Columna de la imagen - MEJORADA Y MÁS GRANDE */}
                            <div className="col-xl-5 order-1 order-xl-2">
                                <div className="intro-thumb" style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '20px'
                                }}>
                                    {/* Shapes animados de fondo */}
                                    <div style={{
                                        position: 'absolute',
                                        width: '200px',
                                        height: '200px',
                                        borderRadius: '50%',
                                        background: 'rgba(20, 104, 177, 0.1)',
                                        right: '-50px',
                                        top: '20%',
                                        zIndex: 1,
                                        animation: 'float 6s ease-in-out infinite'
                                    }} />
                                    
                                    <div style={{
                                        position: 'absolute',
                                        width: '150px',
                                        height: '150px',
                                        borderRadius: '50%',
                                        background: 'rgba(18, 39, 75, 0.08)',
                                        left: '-30px',
                                        top: '60%',
                                        zIndex: 1,
                                        animation: 'float 8s ease-in-out infinite reverse'
                                    }} />
                                    
                                    <div style={{
                                        position: 'absolute',
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        background: 'rgba(20, 104, 177, 0.15)',
                                        right: '20%',
                                        bottom: '10%',
                                        zIndex: 1,
                                        animation: 'pulse 4s ease-in-out infinite'
                                    }} />
                                    
                                    {/* Círculo de fondo principal con transparencia */}
                                    <div style={{
                                        position: 'absolute',
                                        width: '650px',
                                        height: '650px',
                                        borderRadius: '50%',
                                        background: 'radial-gradient(circle, rgba(20, 104, 177, 0.12) 0%, rgba(20, 104, 177, 0.06) 40%, transparent 70%)',
                                        right: '-100px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        zIndex: 1,
                                        filter: 'blur(60px)',
                                        animation: 'breathe 10s ease-in-out infinite'
                                    }} />
                                    
                                    {/* Contenedor con bordes redondeados y efecto glassmorphism */}
                                    <div style={{
                                        position: 'relative',
                                        zIndex: 2,
                                        borderRadius: '50px',
                                        padding: '30px',
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 50%, rgba(20,104,177,0.05) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        boxShadow: '0 25px 70px rgba(20, 104, 177, 0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
                                        width: '100%',
                                        maxWidth: '600px',
                                        animation: 'cardFloat 12s ease-in-out infinite'
                                    }}>
                                        <Image 
                                            className="main-thumb img-custom-anim-right wow fadeInUp" 
                                            src={img} 
                                            alt="Finova App" 
                                            width={726} 
                                            height={709}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                borderRadius: '35px',
                                                filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.15))'
                                            }}
                                            priority
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner1;