import parse from 'html-react-parser';
import Image from 'next/image';
import Link from 'next/link';

const HeroBanner1 = ({subtitle,title,content,btnname,btnurl,btntwo,btn2url,cusimg,cusnumber,cuscontent,rating,ratingcon,img}) => {
    return (
        <section className="intro-section">
        <div className="intro-container-wrapper style1">
            <div className="container">
                <div className="intro-wrapper style1 fix">
                    {/* <div className="shape1"><Image src="/assets/images/shape/introShape1_1.png" alt="img" width={1149} height={854}   /></div> */}
                    <div className="shape2"><Image src="/assets/images/shape/introShape1_2.png" alt="img" width={983} height={954}   /></div>
                    <div className="shape3 d-none d-xxl-block cir36"><Image src="/assets/images/shape/introShape1_3.png" alt="img" width={58} height={58}   /></div>
                    <div className="shape4 d-none d-xxl-block cir36"><Image src="/assets/images/shape/introShape1_4.png" alt="img" width={58} height={58}   /></div>
                    <div className="shape5 d-none d-xxl-block cir36"><Image src="/assets/images/shape/introShape1_5.png" alt="img" width={57} height={58}   /></div>
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-7 order-2 order-xl-1">
                                <div className="intro-content">
                                    <div className="intro-section-title">
                                        <div className="intro-subtitle">
                                            {parse(subtitle)} <Image src="/assets/images/icon/fireIcon.svg" alt="img" width={16} height={17}   /> 
                                        </div>
                                        <h1 className="intro-title wow fadeInUp" data-wow-delay=".2s">{title}</h1>
                                        <p className="intro-desc wow fadeInUp" data-wow-delay=".4s">{content}</p>
                                    </div>
                                    <div className="btn-wrapper style1 wow fadeInUp" data-wow-delay=".6s">





                                        {/* PRIMER BOTÓN - Solo renderiza si btnurl existe */}
                                        {btnurl && (
                                                btnurl.startsWith('http') ? (
                                                    <a
                                                    className="theme-btn"
                                                    href={btnurl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    >
                                                    {btnname}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <g clipPath="url(#clip0_11_22)">
                                                        <path d="M11.6118 3.61182L10.8991 4.32454L14.0706 7.49603H0V8.50398H14.0706L10.8991 11.6754L11.6118 12.3882L16 7.99997L11.6118 3.61182Z" fill="white" />
                                                        </g>
                                                        <defs>
                                                        <clipPath id="clip0_11_22">
                                                            <rect width="16" height="16" fill="white" />
                                                        </clipPath>
                                                        </defs>
                                                    </svg>
                                                    </a>
                                                ) : (
                                                    <Link className="theme-btn" href={btnurl}>
                                                    {btnname}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <g clipPath="url(#clip0_11_22)">
                                                        <path d="M11.6118 3.61182L10.8991 4.32454L14.0706 7.49603H0V8.50398H14.0706L10.8991 11.6754L11.6118 12.3882L16 7.99997L11.6118 3.61182Z" fill="white" />
                                                        </g>
                                                        <defs>
                                                        <clipPath id="clip0_11_22">
                                                            <rect width="16" height="16" fill="white" />
                                                        </clipPath>
                                                        </defs>
                                                    </svg>
                                                    </Link>
                                                )
                                                )}






                                        {/* SEGUNDO BOTÓN - Solo renderiza si btn2url existe */}
                                        {btn2url && (
                                            <Link className="theme-btn style2 wow fadeInUp" data-wow-delay=".2s"
                                                href={btn2url}>{btntwo}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                    viewBox="0 0 16 16" fill="none">
                                                    <g clipPath="url(#clip0_11_27)">
                                                        <path
                                                            d="M11.6118 3.61182L10.8991 4.32454L14.0706 7.49603H0V8.50398H14.0706L10.8991 11.6754L11.6118 12.3882L16 7.99997L11.6118 3.61182Z"
                                                            fill="#282C32" />
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
                                    <div className="fancy-box-wrapper style1">
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-5 order-1 order-xl-2">
                                <div className="intro-thumb">
                                    <div className="thumbShape1"><Image src="/assets/images/shape/introThumbShape1_1.webp" alt="img" width={624} height={624}   /></div>
                                    <div className="thumbShape2"><Image src="/assets/images/shape/wcuThumbShape1_1.webp" alt="img" width={536} height={537}   /></div>
                                            <Image className="main-thumb img-custom-anim-right wow fadeInUp"  src={img} alt="img" width={726} height={709}   />
                                   
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