import React, { useState } from "react";
import { Newspaper, Calendar, ArrowRight, X, Heart, Share2, ExternalLink, Sparkles, BookOpen } from "lucide-react";

import { NewsArticle } from "../types";

export const REALISTIC_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    title: "Mineduc anuncia inicio de postulaciones para Becas TIC 2026",
    excerpt: "El Ministerio de Educación junto a Junaeb abrirán el período de postulación para la entrega de computadores con internet gratuita para estudiantes de educación pública.",
    content: `El Ministerio de Educación de Chile, en conjunto con la Junta Nacional de Auxilio Escolar y Becas (Junaeb), ha anunciado de manera oficial el calendario de postulación e inicio de asignaciones para el programa "Becas Acceso a Tecnología, Información y Comunicaciones (Becas TIC)" correspondiente al ciclo escolar 2026.\n\nEste programa tiene por objetivo principal disminuir la brecha digital de acceso y uso de las Tecnologías de la Información y Comunicación, a través de la entrega de un set de herramientas tecnológicas para el estudio que consiste en un computador portátil de última generación, un año de conexión gratuita a Internet de banda ancha móvil y softwares de apoyo escolar interactivos.\n\n¿Quiénes son los beneficiarios?\n- Estudiantes matriculados en 7° básico de establecimientos públicos.\n- Estudiantes de establecimientos particulares subvencionados clasificados en el tramo de mayor vulnerabilidad socioeconómica.\n- Estudiantes de educación especial y educación de adultos que cumplan con las bases correspondientes.\n\nEl ministro de Educación destacó: "Este esfuerzo representa no sólo la entrega de un computador físico, sino una puerta de entrada al conocimiento universal y el desarrollo de habilidades clave del siglo XXI para miles de niños y niñas de todas las comunas del país". Las consultas y el validador online estarán disponibles a partir de la próxima semana en el portal oficial de Junaeb.`,
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&fit=crop&q=80",
    category: "Becas Estatales",
    publishDate: "2026-06-25",
    readingTime: "3 min de lectura",
    author: "Comité de Prensa Junaeb",
    source: "Ministerio de Educación",
    tag: "Importante"
  },
  {
    id: "news-2",
    title: "Alianza Nacional impulsa 15,000 becas en Inteligencia Artificial",
    excerpt: "Una coalición de universidades chilenas y empresas tecnológicas globales presentan un programa formativo gratuito de nivel inicial y avanzado.",
    content: `En una histórica colaboración público-privada, el Senado de Chile, a través de la Comisión de Desafíos del Futuro, junto a un conglomerado de cinco universidades nacionales y líderes de la industria tecnológica, han lanzado formalmente el "Plan Nacional de Alfabetización y Especialización en Inteligencia Artificial 2026".\n\nEl programa financiará un total de 15,000 becas completas de arancel para cursos modulares online, enfocados en dos perfiles distintos:\n\n1. Perfil Ciudadano y de Gestión: Dirigido a profesionales, docentes y ciudadanos comunes que busquen comprender los fundamentos éticos, el uso diario y las herramientas generativas para mejorar su productividad.\n2. Perfil Técnico y de Desarrollo: Orientado a profesionales de la ingeniería, estudiantes de computación y desarrolladores que deseen especializarse en modelos de lenguaje grande (LLMs), machine learning y despliegue de soluciones inteligentes.\n\nTodos los cursos contarán con certificación universitaria respaldada y tutorías activas de profesionales de la industria. Las inscripciones se mantendrán abiertas durante todo el mes de julio, y los módulos darán inicio de forma asíncrona la primera semana de agosto.\n\nComo parte de este programa, se promoverán enfoques prácticos de diseño de prompts, automatización ética de flujos de trabajo, y se facilitarán plantillas listas para su uso.`,
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop&q=80",
    category: "Tecnología",
    publishDate: "2026-06-22",
    readingTime: "4 min de lectura",
    author: "Red de Universidades Unidas",
    source: "Comisión Desafíos del Futuro",
    tag: "Especialización"
  },
  {
    id: "news-3",
    title: "Guía Práctica: Cómo postular con éxito a fondos concursables",
    excerpt: "Te entregamos los mejores consejos de expertos del sector social para optimizar tu postulación a talleres y actividades comunitarias.",
    content: `Postular a un fondo concursable o beca de financiamiento puede ser un proceso abrumador. En el portal de Oportunidades Públicas analizamos los principales motivos de rechazo y consultamos con evaluadores institucionales para entregarte esta guía definitiva.\n\n1. Lee las Bases de Postulación con Detalle\nPuede sonar redundante, pero el 40% de los proyectos presentados quedan inadmisibles en la etapa de preevaluación formal. Asegúrate de cumplir con la residencia requerida, los tramos de edad y la documentación obligatoria antes de escribir una sola línea del proyecto.\n\n2. Justifica el Impacto Local de tu Iniciativa\nLos evaluadores buscan un impacto social tangible. No indiques solamente qué vas a hacer, sino por qué es vital para tu comunidad o establecimiento educacional. Usa estadísticas locales reales de tu comuna.\n\n3. Elabora un Presupuesto Realista y Detallado\nLos fondos mal distribuidos son una alerta roja para los auditores. Desglosa los ítems claramente (materiales, logística, honorarios) y mantente dentro de los rangos máximos estipulados.\n\n4. Redacta de forma Sencilla pero Convincente\nEvita tecnicismos innecesarios. Sé directo y explica de forma apasionada y clara el fin último de tu proyecto. ¡Mucho éxito en tus próximas postulaciones de la temporada!`,
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&fit=crop&q=80",
    category: "Orientación",
    publishDate: "2026-06-18",
    readingTime: "5 min de lectura",
    author: "Eduardo Bravo (Editor)",
    source: "Consejos Editorial",
    tag: "Guía"
  }
];

interface NewsPanelProps {
  articles?: NewsArticle[];
}

export default function NewsPanel({ articles }: NewsPanelProps) {
  const currentArticles = articles || REALISTIC_NEWS;
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({});

  const mainArticle = currentArticles[0] || null;
  const sideArticles = currentArticles.slice(1);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleLike = (id: string) => {
    setLikesCount(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parts[0];
      const monthNames = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun", 
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
      ];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parts[2];
      return `${day} de ${monthNames[monthIdx] || parts[1]}, ${year}`;
    }
    return dateStr;
  };

  return (
    <div className="md:col-span-4 md:row-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 overflow-hidden flex flex-col group shadow-sm">
      
      {/* Header of News Section */}
      <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#E2B13C]/10 rounded-lg text-[#C87A53]">
            <Newspaper className="w-4 h-4 text-[#C87A53]" />
          </div>
          <div>
            <h3 className="font-display font-medium text-sm text-slate-800 dark:text-white uppercase tracking-wider">
              Noticias & Educación 📰
            </h3>
            <span className="text-[10px] text-slate-400 font-medium block leading-none mt-0.5">Actualizaciones educativas del ecosistema</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 px-2.5 py-0.5 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E2B13C] animate-pulse" />
          <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">En Directo</span>
        </div>
      </div>

      {/* Grid: Left Main News (3/5), Right small News list (2/5) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800/60">
        
        {/* Main Article Highlight (Lg: 7 cols) */}
        <div 
          onClick={() => setSelectedArticle(mainArticle)}
          className="lg:col-span-7 p-6 flex flex-col justify-between hover:bg-slate-50/20 dark:hover:bg-slate-950/10 cursor-pointer group/main transition-colors text-left"
        >
          <div className="space-y-3.5">
            {/* Thumbnail */}
            <div className="h-44 rounded-2xl overflow-hidden relative bg-slate-950">
              <img 
                src={mainArticle.imageUrl} 
                alt={mainArticle.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90 group-hover/main:scale-101.5 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-60" />
              <span className="absolute top-3 left-3 bg-[#E2B13C]/95 text-slate-900 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                {mainArticle.category}
              </span>
              {mainArticle.tag && (
                <span className="absolute top-3 right-3 bg-[#C87A53]/95 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" />
                  {mainArticle.tag}
                </span>
              )}
            </div>

            {/* Info Row */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
              <span>{mainArticle.author}</span>
              <span>•</span>
              <span>{formatDate(mainArticle.publishDate)}</span>
            </div>

            {/* Title */}
            <h4 className="font-display font-medium text-base sm:text-lg text-slate-800 dark:text-white group-hover/main:text-[#C87A53] transition-colors leading-snug line-clamp-2">
              {mainArticle.title}
            </h4>

            {/* Excerpt */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {mainArticle.excerpt}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40 pt-4 mt-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {mainArticle.readingTime}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C87A53] hover:text-[#b0653f] transition-all group-hover/main:translate-x-0.5">
              <span>Leer Artículo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Side News List (Lg: 5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-slate-100 dark:divide-slate-800/40">
          {sideArticles.map((article) => (
            <div 
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="p-5 flex-1 flex flex-col justify-between hover:bg-slate-50/20 dark:hover:bg-slate-950/10 cursor-pointer group/side transition-colors text-left"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {article.category}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">
                    {formatDate(article.publishDate)}
                  </span>
                </div>

                <h5 className="font-medium text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover/side:text-[#C87A53] line-clamp-2 leading-snug transition-colors">
                  {article.title}
                </h5>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-normal">
                  {article.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 text-[10px] text-slate-400 font-semibold">
                <span>{article.readingTime}</span>
                <span className="text-[#C87A53] font-bold uppercase text-[10px] tracking-wider group-hover/side:underline">
                  Leer →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ARTICLE READER POPUP MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-98 duration-200">
            
            {/* Header Image */}
            <div className="relative h-44 sm:h-56 shrink-0 bg-slate-950">
              <img 
                src={selectedArticle.imageUrl} 
                alt={selectedArticle.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60" />
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
                aria-label="Cerrar artículo"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title & Category over Image */}
              <div className="absolute bottom-4 left-5 right-5 text-left">
                <span className="bg-[#E2B13C] text-slate-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 inline-block shadow-xs">
                  {selectedArticle.category}
                </span>
                <h3 className="font-display font-medium text-lg sm:text-xl text-white tracking-tight leading-tight drop-shadow-md">
                  {selectedArticle.title}
                </h3>
              </div>
            </div>

            {/* Author and Date Row */}
            <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">Escrito por:</span>
                <span>{selectedArticle.author}</span>
                <span>•</span>
                <span>{selectedArticle.source}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(selectedArticle.publishDate)}</span>
                <span>({selectedArticle.readingTime})</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4 text-left">
              {selectedArticle.content.split("\n\n").map((para, idx) => {
                if (para.startsWith("-") || para.startsWith("1.")) {
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed my-2">
                      {para.split("\n").map((li, liIdx) => (
                        <li key={liIdx}>{li.replace(/^-\s*|^[0-9]+\.\s*/, "")}</li>
                      ))}
                    </ul>
                  );
                }
                if (para.includes("¿Quiénes son") || para.includes("1. Lee las Bases") || para.includes("2. Justifica") || para.includes("3. Elabora") || para.includes("4. Redacta")) {
                  return (
                    <h4 key={idx} className="font-semibold text-sm text-[#1E293B] dark:text-white pt-2">
                      {para}
                    </h4>
                  );
                }
                return (
                  <p key={idx} className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {para}
                  </p>
                );
              })}
            </div>

            {/* Action Row */}
            <div className="px-6 py-4.5 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleLike(selectedArticle.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#C87A53] bg-[#C87A53]/10 hover:bg-[#C87A53]/20 px-3.5 py-2 rounded-full transition-all cursor-pointer font-bold"
                >
                  <Heart className={`w-4 h-4 ${likesCount[selectedArticle.id] ? "fill-[#C87A53] text-[#C87A53]" : "text-[#C87A53]"}`} />
                  <span>{likesCount[selectedArticle.id] ? `Me gusta (${likesCount[selectedArticle.id]})` : "Me gusta"}</span>
                </button>
                <button 
                  onClick={() => {
                    alert("¡Gracias por compartir esta noticia educacional!");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-full transition-all cursor-pointer font-bold"
                >
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Compartir</span>
                </button>
              </div>

              <button 
                onClick={() => setSelectedArticle(null)}
                className="bg-slate-950 text-white hover:bg-slate-800 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                Cerrar Artículo
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
