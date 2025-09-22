export const finovaData = {
  // ==================================================
  // Navegación principal
  // ==================================================
 
  navigation: [
    { name: 'Inicio', href: '#inicio', isButton: false },
    { name: 'Alianzas', href: '#alianzas', isButton: false },
    { name: 'Créditos', href: '#creditos', isButton: false },
    { name: 'Beneficios', href: '#beneficios', isButton: false },
    { name: 'Nosotros', href: '#nosotros', isButton: false },
    { name: 'Preguntas frecuentes', href: '#preguntas', isButton: false },
    { name: 'Contacto', href: '#contacto', isButton: false },
    { name: 'Registrarse', href: '/registro', isButton: true },
    { name: 'Iniciar sesión', href: '/login', isButton: true }
  ],

  // ==================================================
  // Sección Hero
  // ==================================================
    hero: {
    title: "Créditos de libre inversión",
    subtitle: "100% online, sin filas y con respaldo legal",
    ctaButton: "Solicita tu crédito ahora",
    ctaLink: "/assets/images/imagenesfinova/hero-finova.png"
    },

  // ==================================================
  // Sección Alianzas
  // ==================================================
  alianzas: {
    title: "Nuestras Alianzas",
    subtitle: "Trabajamos con las mejores entidades financieras",
    logos: [
      "/assets/images/alianzas/bancolombia.png",
      "/assets/images/alianzas/nequi.png", 
      "/assets/images/alianzas/davivienda.png",
      "/assets/images/alianzas/daviplata.png",
      "/assets/images/alianzas/bbva.png",
      "/assets/images/alianzas/av-villas.png"
    ]
  },

  // ==================================================
  // Sección Nosotros
  // ==================================================
  nosotros: {
    title: "Somos Finova",
    description: "Una entidad registrada y legalmente vigilada ante la RUES y la Cámara de Comercio de Pereira. Nuestro equipo de trabajo está listo para escucharte, orientarte y acompañarte en cada paso.",
    mision: "Finova es una empresa especializada en la financiación de créditos comerciales a corto plazo. Su propósito es acompañar a los clientes de manera ética y profesional en el cumplimiento de sus objetivos empresariales, generando valor sostenible para los colaboradores, accionistas y la sociedad en general.",
    vision: "Somos una empresa comprometida con transformar la manera en que se accede al crédito de libre inversión a corto y largo plazo. Aspiramos a ser reconocidos por construir relaciones duraderas basadas en la confianza, la cercanía y la agilidad, acompañando a cada cliente en su crecimiento, con soluciones financieras claras y responsables.",
    team: [
      { 
        name: "Viviana", 
        position: "Directora General", 
        image: "/assets/images/team/viviana.jpg"
      },
      { 
        name: "Melissa", 
        position: "Gerente Comercial", 
        image: "/assets/images/team/melissa.jpg"
      },
      { 
        name: "Sara", 
        position: "Analista de Crédito", 
        image: "/assets/images/team/sara.jpg"
      },
      { 
        name: "Daniela", 
        position: "Asesora Financiera", 
        image: "/assets/images/team/daniela.jpg"
      }
    ],
    valores: [
      {
        title: "Cercanía",
        description: "Trato directo y empático. La marca se comunica con las personas de manera clara, sencilla y respetuosa, sin tecnicismos innecesarios ni barreras."
      },
      {
        title: "Confianza", 
        description: "Actuamos con integridad, seriedad y responsabilidad en cada interacción."
      },
      {
        title: "Integridad",
        description: "Este valor se refleja en una gestión ética, en la claridad de sus condiciones y en el respeto por cada cliente."
      },
      {
        title: "Calidad",
        description: "Cada parte del servicio, desde la atención hasta los canales digitales, está pensada para funcionar bien, verse bien y resolverse fácil."
      }
    ]
  },

  // ==================================================
  // Preguntas frecuentes
  // ==================================================
  faq: [
    {
      question: "¿Debo pagar cuota inicial para solicitar un crédito?",
      answer: "¡NO! En Finova nunca pedimos pagos por adelantado."
    },
    {
      question: "¿Me prestan si estoy reportado?",
      answer: "Claro que sí, te prestamos con un codeudor que te respalde."
    },
    {
      question: "¿Puedo hacer todo el proceso desde el celular?",
      answer: "¡Claro que sí! Solo necesitas conexión a internet."
    },
    {
      question: "¿En cuánto tiempo desembolsan mi crédito?",
      answer: "En Finova recibes tu dinero en menos de 24 horas."
    }
  ],

  // ==================================================
  // Contacto
  // ==================================================
  contact: {
    title: "¿Listo para empezar?",
    subtitle: "Estamos aquí para ayudarte a hacer realidad tus proyectos",
    phone: "+57 322 696 2139",
    email: "info@finova.com.co",
    address: "Calle 24 # 7 - 29, Oficina 613, Pereira, Colombia.",
    socialMedia: {
      facebook: "#",
      twitter: "#", 
      instagram: "#",
      linkedin: "#"
    }
  },

  // ==================================================
  // Footer
  // ==================================================
  footer: {
    logo: "/assets/images/logo/finova-logo.png",
    description: "Créditos financieros justos, transparentes y diseñados para impulsar tus proyectos.",
    services: [
      "Créditos personales",
      "Asesoría financiera", 
      "Refinanciación"
    ],
    legal: [
      { name: "Términos y condiciones", href: "/terminos" },
      { name: "Políticas de privacidad", href: "/privacidad" }
    ],
    legalText: "Vigilado por la Superintendencia Financiera de Colombia"
  },

  // ==================================================
  // Colores de marca (según manual)
  // ==================================================
  colors: {
    primary: '#1468B1',    // Azul principal
    secondary: '#2A7ABF',  // Azul secundario
    dark: '#12274B',       // Azul oscuro (títulos, logo)
    light: '#4C97D2',      // Azul claro
    lighter: '#D0EDFC'     // Azul muy claro (fondos, acentos)
  }
};

export default finovaData;