/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Opportunity, Institution, Modality, CostType } from "./types";

export const CATEGORIES = [
  "Música", "Artes Visuales", "Artes Escénicas", "Danza", "Teatro",
  "Tecnología", "Programación", "Robótica", "Inteligencia Artificial",
  "Técnico Profesional", "Lenguaje y Comunicación", "Matemáticas",
  "Historia", "Geografía", "Formación Ciudadana", "Inglés",
  "Ciencias Naturales", "Física", "Química", "Biología",
  "Educación Ambiental", "Deportes", "Educación Física",
  "Innovación", "Emprendimiento", "Patrimonio", "Cultura",
  "Derechos Humanos", "Medio Ambiente", "Astronomía",
  "Investigación", "Liderazgo", "Inclusión", "Otros"
];

export const REGIONS_AND_COMUNAS: Record<string, string[]> = {
  "Región Metropolitana de Santiago": [
    "Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Puente Alto", "Recoleta", "La Florida", "Vitacura"
  ],
  "Región de Valparaíso": [
    "Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "San Felipe", "Los Andes"
  ],
  "Región del Biobío": [
    "Concepción", "Talcahuano", "San Pedro de la Paz", "Los Ángeles", "Chiguayante", "Coronel"
  ],
  "Región de la Araucanía": [
    "Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"
  ],
  "Región de los Lagos": [
    "Puerto Montt", "Osorno", "Castro", "Puerto Varas", "Ancud"
  ],
  "Región de Coquimbo": [
    "La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña"
  ],
  "Región de Antofagasta": [
    "Antofagasta", "Calama", "Tocopilla", "Mejillones"
  ],
  "Región de los Ríos": [
    "Valdivia", "La Unión", "Río Bueno", "Panguipulli"
  ],
  "Región de Tarapacá": [
    "Iquique", "Alto Hospicio", "Pozo Almonte"
  ],
  "Región de Atacama": [
    "Copiapó", "Vallenar", "Caldera"
  ],
  "Región de O'Higgins": [
    "Rancagua", "San Fernando", "Santa Cruz", "Pichilemu"
  ],
  "Región del Maule": [
    "Talca", "Curicó", "Linares", "Constitución"
  ],
  "Región de Aysén": [
    "Coyhaique", "Puerto Aisén", "Chile Chico"
  ],
  "Región de Magallanes": [
    "Punta Arenas", "Puerto Natales", "Porvenir"
  ],
  "Región de Arica y Parinacota": [
    "Arica", "Camarones", "Putre"
  ],
  "Región de Ñuble": [
    "Chillán", "San Carlos", "Quirihue"
  ]
};

export const TARGET_AUDIENCES = [
  "Estudiantes Enseñanza Básica",
  "Estudiantes Enseñanza Media",
  "Estudiantes Técnico-Profesionales",
  "Universitarios",
  "Docentes",
  "Equipos Directivos",
  "Padres y Apoderados",
  "Profesionales",
  "Público General"
];

export const INSTITUTION_TYPES = [
  "Universidad",
  "Museo",
  "Fundación",
  "Empresa",
  "Corporación",
  "Colegio",
  "Instituto Profesional",
  "CFT",
  "Biblioteca",
  "Centro Cultural",
  "Municipalidad",
  "Ministerio",
  "ONG",
  "Organización Social"
];

export const INITIAL_INSTITUTIONS: Institution[] = [
  {
    id: "inst-1",
    name: "Universidad de Chile",
    rut: "70.012.300-6",
    website: "https://www.uchile.cl",
    email: "extension@uchile.cl",
    contactName: "Dra. Elisa Neira",
    contactRole: "Directora de Vinculación con el Medio",
    verified: true,
    logo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80",
    description: "La Universidad de Chile es una institución de educación superior estatal y nacional, fundada en 1842, que asume con compromiso y excelencia la formación de profesionales.",
    history: "Fundada el 19 de noviembre de 1842 bajo el gobierno del presidente Manuel Bulnes, es la más antigua del país y heredera de la Real Universidad de San Felipe.",
    phone: "+56 2 2978 2000",
    socials: {
      facebook: "uchile",
      twitter: "uchile",
      instagram: "uchile",
      linkedin: "universidad-de-chile"
    }
  },
  {
    id: "inst-2",
    name: "Museo Nacional de Bellas Artes",
    rut: "65.099.400-K",
    website: "https://www.mnba.gob.cl",
    email: "contacto@mnba.gob.cl",
    contactName: "Felipe Baeza",
    contactRole: "Coordinador de Mediación y Educación",
    verified: true,
    logo: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&h=150&fit=crop&q=80",
    description: "El MNBA es uno de los principales centros de difusión de las artes visuales en Chile, ofreciendo talleres gratuitos y exposiciones de alto nivel cultural.",
    history: "Establecido el 18 de septiembre de 1880 bajo el nombre de Museo Nacional de Pinturas, es el primer museo de arte de Latinoamérica.",
    phone: "+56 2 2499 1600",
    socials: {
      instagram: "mnbachile",
      facebook: "MNBAChile"
    }
  },
  {
    id: "inst-3",
    name: "Fundación Chile Tecnológico",
    rut: "76.884.220-4",
    website: "https://www.chiletecnologico.cl",
    email: "formacion@chiletecnologico.org",
    contactName: "Valentina Rojas",
    contactRole: "Gerente de Programas Educativos",
    verified: true,
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&q=80",
    description: "Organización sin fines de lucro dedicada a estrechar la brecha digital en Chile, enseñando programación, robótica e inteligencia artificial a estudiantes y profesores.",
    phone: "+56 9 8765 4321",
    socials: {
      linkedin: "fundacion-chile-tecnologico",
      instagram: "chile_tecnologico"
    }
  },
  {
    id: "inst-4",
    name: "Centro Cultural Gabriela Mistral (GAM)",
    rut: "72.450.900-5",
    website: "https://www.gam.cl",
    email: "audiencias@gam.cl",
    contactName: "Rodrigo Muñoz",
    contactRole: "Jefe de Gestión de Públicos",
    verified: true,
    logo: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=150&h=150&fit=crop&q=80",
    description: "Centro cultural y de espectáculos de renombre internacional ubicado en Santiago, enfocado en el teatro, la danza, la música clásica y popular, y el debate cívico.",
    phone: "+56 2 2566 5500",
    socials: {
      facebook: "centroGAM",
      instagram: "centrogam",
      twitter: "centroGAM"
    }
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Bootcamp Infantil de Programación y Robótica con Micro:bit",
    institutionId: "inst-3",
    institutionName: "Fundación Chile Tecnológico",
    institutionLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&q=80",
    isInstitutionVerified: true,
    categories: ["Tecnología", "Programación", "Robótica", "Innovación"],
    modality: Modality.Hibrida,
    cost: CostType.Gratuito,
    region: "Región Metropolitana de Santiago",
    comuna: "Providencia",
    address: "Av. Providencia 1240, Providencia (Sesiones presenciales los sábados)",
    targetAudience: ["Estudiantes Enseñanza Básica", "Estudiantes Enseñanza Media"],
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop&q=80",
    imageGallery: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&fit=crop&q=80",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&fit=crop&q=80"
    ],
    briefDescription: "Aprende a programar placas Micro:bit desde cero y dale vida a tus propios inventos tecnológicos. Un taller práctico de 5 semanas.",
    fullDescription: "El Bootcamp de Programación y Robótica con Micro:bit es una experiencia de aprendizaje inmersiva de 5 semanas estructurada para niños y adolescentes de entre 10 y 16 años. El programa combina clases virtuales interactivas durante la semana y laboratorios prácticos grupales los días sábados en Providencia. Los estudiantes aprenderán sobre sensores, motores y lógica de programación mediante bloques de MakeCode, para luego pasar a JavaScript o Python básico.",
    objectives: "• Comprender los conceptos fundamentales del pensamiento computacional.\n• Diseñar soluciones de hardware programable usando placas Micro:bit.\n• Desarrollar habilidades de trabajo en equipo y resolución creativa de problemas.",
    programDetails: "Semana 1: Introducción a Micro:bit y encendido de matrices LED.\nSemana 2: Uso de sensores incorporados (acelerómetro, compás, temperatura).\nSemana 3: Conexión de actuadores externos (servomotores, luces RGB).\nSemana 4: Diseño de un proyecto de innovación social enfocado en Smart Home.\nSemana 5: Presentación grupal (Feria de Robótica) ante apoderados y docentes.",
    requirements: "• Tener entre 10 y 16 años.\n• Disponibilidad para asistir a clases virtuales los martes de 17:30 a 19:00 y talleres presenciales los sábados de 10:00 a 13:00.\n• No requiere conocimientos previos de programación.",
    benefits: "• Se entregará un kit de robótica Micro:bit gratis a cada alumno que complete al menos el 80% de asistencia.\n• Diploma de participación certificado por Fundación Chile Tecnológico.\n• Colación saludable durante los talleres presenciales.",
    applicationDeadline: "2026-07-15",
    eventDate: "2026-07-25",
    officialWebsite: "https://www.chiletecnologico.cl/microbit-bootcamp",
    contactEmail: "talleres@chiletecnologico.cl",
    contactPhone: "+56 9 8765 4321",
    registrationLink: "https://www.chiletecnologico.cl/inscripciones/microbit",
    documents: [
      { name: "Bases del Bootcamp 2026.pdf", url: "#" },
      { name: "Ficha de Autorización Apoderado.docx", url: "#" }
    ],
    faqs: [
      { question: "¿Tiene algún costo el material?", answer: "No, todo el material de estudio, placas Micro:bit y accesorios son provistos sin costo alguno por la fundación gracias a nuestros auspiciadores." },
      { question: "¿Pueden postular estudiantes de regiones?", answer: "Sí, pero deben considerar que las sesiones de los sábados son estrictamente presenciales en Santiago de Chile." }
    ],
    status: "Published",
    isFeatured: true,
    views: 1245,
    clicks: 430,
    registrations: 185
  },
  {
    id: "opp-2",
    title: "Escuela de Invierno: Astronomía Moderna para Docentes de Ciencias",
    institutionId: "inst-1",
    institutionName: "Universidad de Chile",
    institutionLogo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80",
    isInstitutionVerified: true,
    categories: ["Astronomía", "Ciencias Naturales", "Física", "Docentes", "Investigación"],
    modality: Modality.Online,
    cost: CostType.Gratuito,
    region: "Región Metropolitana de Santiago",
    comuna: "Santiago",
    targetAudience: ["Docentes", "Equipos Directivos"],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop&q=80",
    briefDescription: "Capacitación intensiva online para profesores de ciencias enfocada en metodologías activas para enseñar astronomía y cosmología moderna.",
    fullDescription: "La Facultad de Ciencias Físicas y Matemáticas de la Universidad de Chile invita a todos los docentes de física, química y ciencias naturales de enseñanza básica y media al programa intensivo 'Astronomía Moderna en el Aula'. A lo largo de este curso de 4 días de duración, destacados astrónomos nacionales compartirán las últimas novedades en la investigación exoplanetaria, ondas gravitacionales, agujeros negros e instrumentación astronómica en el norte de Chile.",
    objectives: "• Actualizar el conocimiento de los docentes en materias de astronomía escolar de acuerdo a las Bases Curriculares.\n• Facilitar herramientas didácticas y maquetas virtuales para su uso directo en clases virtuales o presenciales.\n• Formar una red de colaboración pedagógica a nivel nacional.",
    programDetails: "Día 1: Sistema Solar e instrumentación óptica moderna.\nDía 2: Vida y muerte estelar, supernovas y remanentes.\nDía 3: Cosmología, expansión del universo y materia oscura.\nDía 4: Talleres prácticos y softwares de simulación astronómica (Stellarium).",
    requirements: "• Ejercer como docente de ciencias en cualquier establecimiento educacional del país (colegios municipales, subvencionados o particulares).\n• Conexión a internet estable para videoconferencias de Zoom.",
    benefits: "• Certificado oficial emitido por el Departamento de Astronomía de la Universidad de Chile.\n• Kit digital de material pedagógico para descarga directa.",
    applicationDeadline: "2026-07-08",
    eventDate: "2026-07-12",
    officialWebsite: "https://das.uchile.cl/escuela-invierno-docentes",
    contactEmail: "docencia.das@uchile.cl",
    registrationLink: "https://das.uchile.cl/registro-docentes",
    status: "Published",
    isFeatured: true,
    views: 840,
    clicks: 220,
    registrations: 95
  },
  {
    id: "opp-3",
    title: "Taller Práctico de Grabado y Patrimonio en el Palacio de Bellas Artes",
    institutionId: "inst-2",
    institutionName: "Museo Nacional de Bellas Artes",
    institutionLogo: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&h=150&fit=crop&q=80",
    isInstitutionVerified: true,
    categories: ["Artes Visuales", "Patrimonio", "Cultura"],
    modality: Modality.Presencial,
    cost: CostType.Gratuito,
    region: "Región Metropolitana de Santiago",
    comuna: "Santiago",
    address: "Parque Forestal s/n, Santiago Centro (Metro Bellas Artes)",
    targetAudience: ["Estudiantes Enseñanza Media", "Universitarios", "Público General"],
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=450&fit=crop&q=80",
    briefDescription: "Aprende las técnicas tradicionales del grabado en linóleo y xilografía inspiradas en la colección histórica del Museo Nacional de Bellas Artes.",
    fullDescription: "El área de mediación del Museo Nacional de Bellas Artes abre la convocatoria para el taller presencial de grabado. Los participantes realizarán un recorrido guiado por las exposiciones temporales de grabado chileno y posteriormente crearán sus propias matrices en el taller de educación del Palacio. Al final del curso se montará una mini-exposición colectiva con las obras creadas.",
    objectives: "• Conocer la historia del grabado y su impacto social y artístico en Chile.\n• Manejar herramientas de corte como gubias y procesos de entintado y prensado manual.\n• Fomentar la apreciación del patrimonio mueble arquitectónico nacional.",
    programDetails: "Sesión 1: Visita comentada y esbozo de ideas sobre papel.\nSesión 2: Grabado sobre matriz de linóleo (procesos de tallado seguro).\nSesión 3: Entintado y experimentación con diversos soportes de papel.\nSesión 4: Impresión final y montaje de la exposición colectiva.",
    requirements: "• Mayor de 14 años.\n• Compromiso de asistir a las 4 sesiones presenciales.\n• No requiere experiencia previa.",
    benefits: "• Todos los materiales (tintas, linóleos, papeles de algodón, gubias de uso en sala) están cubiertos íntegramente por el museo.\n• Acceso gratuito certificado por el Servicio Nacional del Patrimonio Cultural.",
    applicationDeadline: "2026-07-20",
    eventDate: "2026-08-01",
    officialWebsite: "https://www.mnba.gob.cl/talleres-mediacion",
    contactEmail: "mediacion.educacion@mnba.gob.cl",
    status: "Published",
    isFeatured: false,
    views: 1950,
    clicks: 640,
    registrations: 340
  },
  {
    id: "opp-4",
    title: "Laboratorio de IA y Creatividad: Creación de Cortometrajes Digitales",
    institutionId: "inst-4",
    institutionName: "Centro Cultural Gabriela Mistral (GAM)",
    institutionLogo: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=150&h=150&fit=crop&q=80",
    isInstitutionVerified: true,
    categories: ["Inteligencia Artificial", "Cultura", "Artes Escénicas", "Teatro", "Innovación"],
    modality: Modality.Presencial,
    cost: CostType.Pagado,
    price: "$20.000",
    region: "Región Metropolitana de Santiago",
    comuna: "Santiago",
    address: "Av. Libertador Bernardo O'Higgins 227, Santiago Centro (Metro Universidad de Católica)",
    targetAudience: ["Universitarios", "Profesionales", "Público General"],
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=450&fit=crop&q=80",
    briefDescription: "Explora las herramientas de IA generativa para guion, diseño sonoro y edición de cortometrajes. Ideal para jóvenes artistas y programadores.",
    fullDescription: "El Laboratorio de Inteligencia Artificial y Creatividad del GAM es un taller de co-creación artística tecnológica. A través de este programa intensivo de tres fines de semana, directores de cine, actores y tecnólogos se reúnen para experimentar con inteligencias artificiales generativas (Midjourney, Runway, ElevenLabs) para escribir guiones, producir storyboards dinámicos e integrar secuencias sintéticas en cortometrajes que reflexionan sobre el futuro de la sociedad.",
    objectives: "• Cuestionar de manera ética e innovadora la relación entre creación artística e Inteligencia Artificial.\n• Aprender a redactar prompts avanzados aplicados al diseño escénico, narrativo y cinematográfico.\n• Generar un portafolio de piezas audiovisuales híbridas de corta duración.",
    requirements: "• Mayor de 18 años.\n• Traer laptop propio con capacidad para navegar fluidamente (se entregarán accesos a las licencias de IA durante el taller).\n• Interés en el cine, el diseño visual o la programación.",
    benefits: "• Acceso gratuito a plataformas de IA premium por un mes.\n• Proyección de los cortometrajes finalistas en la sala de cine del GAM.\n• Certificado de participación por el Área de Educación y Tecnología GAM.",
    applicationDeadline: "2026-07-30",
    eventDate: "2026-08-07",
    officialWebsite: "https://www.gam.cl/ia-creatividad",
    contactEmail: "lab.creativo@gam.cl",
    registrationLink: "https://www.gam.cl/comprar/ia-creatividad",
    status: "Published",
    isFeatured: false,
    views: 1120,
    clicks: 310,
    registrations: 45
  },
  {
    id: "opp-5",
    title: "Seminario Regional de Innovación y Liderazgo Juvenil Maule 2026",
    institutionId: "inst-1",
    institutionName: "Universidad de Chile",
    institutionLogo: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80",
    isInstitutionVerified: true,
    categories: ["Innovación", "Liderazgo", "Emprendimiento", "Formación Ciudadana"],
    modality: Modality.Presencial,
    cost: CostType.Gratuito,
    region: "Región del Maule",
    comuna: "Talca",
    address: "Teatro Regional del Maule, Talca",
    targetAudience: ["Estudiantes Enseñanza Media", "Universitarios"],
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop&q=80",
    briefDescription: "Un encuentro inspirador para jóvenes líderes de la Región del Maule que buscan resolver problemas comunitarios mediante tecnología e innovación.",
    fullDescription: "La Universidad de Chile, a través de su Dirección de Vinculación con el Medio, se traslada a la Región del Maule para realizar el 5° Seminario de Liderazgo e Innovación Juvenil. Con la participación de jóvenes charlistas de todo el Cono Sur, se abordarán temáticas como el cambio climático regional, el emprendimiento circular y la formulación de proyectos comunitarios para postular a fondos públicos.",
    applicationDeadline: "2026-07-02",
    eventDate: "2026-07-05",
    officialWebsite: "https://www.uchile.cl/seminario-liderazgo-maule",
    contactEmail: "vinculacion@uchile.cl",
    status: "Published",
    isFeatured: true,
    views: 520,
    clicks: 140,
    registrations: 88
  }
];
