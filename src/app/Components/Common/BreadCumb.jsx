"use client"
import { useEffect } from "react";
import loadBackgroudImages from "./loadBackgroudImages";
import Link from "next/link";
import Image from "next/image";

const BreadCumb = ({
  Title,
  bgimg,
  subtitle = null,
  showShapes = true,
  customClass = "",
  homeText = "Inicio"
}) => {
  useEffect(() => {
    loadBackgroudImages();
  }, []);

  return (
    <div className={`breadcumb-section fix ${customClass}`}>
      <div className="breadcumb-container-wrapper" data-background={bgimg} style={{ position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {showShapes && (
            <>
              <div className="shape1" style={{ 
                position: 'absolute',
                top: '20%',
                left: '5%',
                opacity: 0.25,
                zIndex: 0
              }}>
                <Image
                  src="/assets/images/shape/breadCumbShape1_1.webp"
                  alt="img"
                  width={669}
                  height={848}
                />
              </div>
              <div className="shape2" style={{ 
                position: 'absolute',
                bottom: '10%',
                right: '8%',
                opacity: 0.25,
                zIndex: 0
              }}>
                <Image
                  src="/assets/images/shape/breadCumbShape1_2.webp"
                  alt="img"
                  width={698}
                  height={877}
                />
              </div>
            </>
          )}
          <div className="breadcumb-wrapper">
            <div className="page-heading">
              <h1>{Title}</h1>
              {subtitle && (
                <p className="page-subtitle">{subtitle}</p>
              )}
              <div className="links">
                <Link href="/">
                  {homeText}
                  <span className="slash">/</span>
                </Link>
                {Title}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadCumb;