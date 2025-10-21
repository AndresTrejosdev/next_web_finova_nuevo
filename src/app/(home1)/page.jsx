import React from 'react';
import HeroBanner1 from '../Components/HeroBanner/HeroBanner1';
import { finovaData } from '../Data/finovaData';
import Brand1 from '../Components/Brand/Brand1';
import CreditCalculator from '../Components/Credit/CreditCalculator';
import BenefitsSection from '../Components/Benefits/BenefitsSection';
import TeamSection from '../Components/Team/TeamSection';
import FAQAccordion from '../Components/FAQ/FAQAccordion';
import ContactSection from '../Components/Contact/ContactSection';
const page = () => {
  return (
    <div>
      {/* Página 1: INICIO */}
      <div id="inicio">
        <HeroBanner1
          subtitle={finovaData.hero.subtitle}
          title={finovaData.hero.title}
          content={finovaData.hero.subtitle}
          btnname={finovaData.hero.ctaButton}
          btnurl={finovaData.hero.ctaLink}
           img="/assets/images/imagenesfinova/hero-finova.svg"
        />
      </div>

      {/* Página 2: ALIANZAS */}
      <div id="alianzas">
        <Brand1 />
      </div>

      {/* Página 3: CRÉDITOS */}
      <div id="creditos">
        <CreditCalculator />
      </div>

      {/* Página 4: BENEFICIOS */}
      <BenefitsSection />

      {/* Página 5: NOSOTROS */}
      <div id="nosotros">
        <TeamSection />
      </div>

      {/* Página 7: PREGUNTAS FRECUENTES */}
      <div id="preguntas-frecuentes">
        <FAQAccordion faqs={finovaData.faq} />
      </div>

    </div>
  );
};

export default page;