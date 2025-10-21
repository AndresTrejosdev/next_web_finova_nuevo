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
    { name: 'Preguntas frecuentes', href: '#preguntas-frecuentes', isButton: false },
    { name: 'Contacto', href: '/contact', isButton: false }, 
    { name: 'Registrarse', href: 'https://app.finova.com.co/auth/register', isButton: true },
    { name: 'Iniciar sesión', href: 'https://app.finova.com.co/auth/boxed-signin', isButton: true }
  ],

  // ==================================================
  // Sección Hero
  // ==================================================
  hero: {
    title: "Créditos De Libre Inversión",
    subtitle: "100% online, sin filas y con respaldo legal",
    ctaButton: "Solicita tu crédito ahora",
    ctaLink: "https://app.finova.com.co/auth/register" 
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

  // // ==================================================
  // // Preguntas frecuentes
  // // ==================================================
  faq: [
    {
      question: "¿Cómo solicito un crédito?",
      answer: "Debes ingresar a nuestra página web y hacer clic en Registrarse (parte superior). Después de registrarte, iniciaremos tu estudio y te daremos respuesta en 1 día hábil."
    },
    {
      question: "¿Debo pagar un anticipo o una póliza para solicitar un crédito?",
      answer: "No. En Finova no pedimos ningún dinero por adelantado para ningún trámite."
    },
    {
      question: "¿Puedo solicitar un crédito si estoy reportado?",
      answer: "Sí, puedes hacerlo con un codeudor. Ambos deben registrarse en la página y avisarnos por WhatsApp quién será el codeudor. Importante: el codeudor no debe estar reportado en centrales de riesgo."
    },
    {
      question: "¿De cuánto es el cupo?",
      answer: "El cupo se asigna según el estudio que se te realice. Si mantienes un buen historial de pago, puedes solicitar un aumento más adelante."
    },
    {
      question: "¿Si estoy en mora, qué puedo hacer?",
      answer: "Puedes pagar directamente desde la página web, Si tienes una mora mayor a 90 días, ingresa con tu usuario y usa el chat para solicitar un acuerdo de pago con un asesor."
    },
    {
      question: "¿Debo subir fotos para solicitar el crédito?",
      answer: "Sí, una selfie actual y foto de tu cédula por ambos lados, claras y legibles."
    },
    {
      question: "¿Cuánto tarda en llegar el dinero?",
      answer: "En máximo 24 horas hábiles. Si es fin de semana, llega el siguiente día hábil."
    }
  ],
  
  // ==================================================
  // Contacto
  // ==================================================
  contact: {
    title: "¿Listo para empezar?",
    subtitle: "Estamos aquí para ayudarte a hacer realidad tus proyectos",
    phone: "+57 322 696 2139",
    email: "contacto@finova.com.co",
    address: "Calle 24 # 7-29, Oficina 613, Pereira, Risaralda, Colombia",
    whatsapp: "https://wa.me/573226962139",
    googleMaps: "https://maps.app.goo.gl/8vYx8KqHfZ8A9sJd9",
    socialMedia: {
      facebook: "https://facebook.com/finova",
      twitter: "https://twitter.com/finova", 
      instagram: "https://instagram.com/finova",
      linkedin: "https://linkedin.com/company/finova"
    }
  },

  // ==================================================
  // Footer
  // ==================================================
  footer: {
    logo: "/assets/images/logo/logo.svg",
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
    legalText: "Vigilado por la Superintendencia de industria y Comercio - SIC"
  },

  // ==================================================
  // Colores de marca (según manual)
  // ==================================================
  colors: {
    primary: '#1468B1',
    secondary: '#2A7ABF',
    dark: '#12274B',
    light: '#4C97D2',
    lighter: '#D0EDFC'
  }
};