/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Compass, Eye, Lightbulb, Users, CheckCircle2, ShieldAlert, Award, ArrowRight,
  BookOpen, Landmark, Sparkles, Building, Globe, ShieldCheck
} from "lucide-react";

interface AboutPanelProps {
  onRegisterClick?: () => void;
  onExploreClick?: () => void;
  institutionsCount?: number;
  opportunitiesCount?: number;
}

export default function AboutPanel({
  onRegisterClick,
  onExploreClick,
  institutionsCount = 12,
  opportunitiesCount = 35
}: AboutPanelProps) {
  return (
    <div id="about-us-container" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-12 animate-in fade-in duration-300 text-left">
      
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#E2B13C]/10 via-[#F7F9FA] to-[#C87A53]/5 text-slate-900 rounded-[2.5rem] p-8 sm:p-12 border border-slate-150 shadow-xs">
        {/* Decorative elements */}
        <div className="absolute top-2 right-4 text-3xl opacity-15 select-none">✨</div>
        <div className="absolute bottom-4 right-12 text-3xl opacity-10 select-none">🎨</div>
        
        <div className="relative max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C87A53]/15 text-[#C87A53] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C87A53]" />
            Nuestra Esencia
          </span>
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-slate-900 leading-tight">
            Conectando el talento de Chile con su futuro cultural y formativo
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            El Portal Único de Oportunidades es una iniciativa federal diseñada para centralizar, validar y visibilizar programas formativos, talleres culturales, becas académicas y fondos concursables promovidos por instituciones públicas, privadas y de educación superior en todo el territorio chileno.
          </p>
        </div>
      </div>

      {/* Mission & Vision Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mission Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-[#C87A53] border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center">
              <Compass className="w-6 h-6 text-[#C87A53]" />
            </div>
            <h3 className="font-display font-medium text-xl text-slate-900 dark:text-white tracking-tight">
              Nuestra Misión 🧭
            </h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
              Democratizar el acceso a la educación y a las manifestaciones culturales en Chile, proveyendo a toda la ciudadanía de un canal transparente, verificado y de alta usabilidad donde descubrir oportunidades que potencien su desarrollo personal, técnico y profesional. Nos comprometemos a eliminar la brecha de información descentralizando las convocatorias regionales.
            </p>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center text-xs text-[#C87A53] font-bold gap-1.5">
            <span>Orientación al desarrollo social</span>
            <span className="w-1.5 h-1.5 bg-[#C87A53] rounded-full" />
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-[#C87A53] border border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-[#C87A53]" />
            </div>
            <h3 className="font-display font-medium text-xl text-slate-900 dark:text-white tracking-tight">
              Nuestra Visión 👁️
            </h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
              Consolidarnos para el año 2030 como la infraestructura digital de referencia nacional para la difusión de oportunidades formativas y culturales chilenas. Aspiramos a ser un ecosistema autosostenible donde cada universidad, centro de formación técnica, municipalidad y corporación cultural colabore de manera activa y ágil bajo estrictos estándares de transparencia de datos.
            </p>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center text-xs text-[#E2B13C] font-bold gap-1.5">
            <span>Innovación pública y transparencia</span>
            <span className="w-1.5 h-1.5 bg-[#E2B13C] rounded-full" />
          </div>
        </div>

      </div>

      {/* How the Portal Works (Función de la página) */}
      <div className="bg-slate-50/50 dark:bg-slate-900/40 rounded-3xl p-8 sm:p-10 border border-slate-100 dark:border-slate-800/30 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-display font-medium text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            ¿Cómo funciona el Portal Único?
          </h2>
          <p className="text-xs sm:text-sm text-slate-450 dark:text-slate-450 leading-relaxed font-normal">
            Nuestro portal actúa como un puente de confianza entre la ciudadanía y las entidades que proveen oportunidades formativas y culturales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Step 1: Discover */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3 relative">
            <span className="absolute top-4 right-4 text-2xl font-bold text-[#C87A53]/30">01</span>
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#C87A53] flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <Users className="w-5 h-5 text-[#C87A53]" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-white">Para la Ciudadanía</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Los usuarios pueden explorar de manera gratuita cientos de cursos, talleres y becas. Con filtros de costo (gratuito o de pago), modalidad (online o presencial), comunas, regiones y grupos de destino específicos. No se requiere registro obligatorio para buscar.
            </p>
          </div>

          {/* Step 2: Publish & Verify */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3 relative">
            <span className="absolute top-4 right-4 text-2xl font-bold text-[#C87A53]/30">02</span>
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#C87A53] flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <Building className="w-5 h-5 text-[#C87A53]" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-white">Para las Instituciones</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Universidades, municipalidades y ONGs postulan con sus datos legales (RUT institucional y actas). Un administrador evalúa minuciosamente su legitimidad antes de habilitarles un panel autogestionado para la publicación directa de sus convocatorias.
            </p>
          </div>

          {/* Step 3: Moderation */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-3 relative">
            <span className="absolute top-4 right-4 text-2xl font-bold text-[#C87A53]/30">03</span>
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-[#C87A53] flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <ShieldCheck className="w-5 h-5 text-[#C87A53]" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-white">Garantía & Moderación</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Garantizamos la calidad de la información. Un equipo de moderadores certifica que los links de postulación estén funcionales, gestiona alertas comunitarias e impulsa convenios educativos a nivel nacional para expandir la cobertura del portal.
            </p>
          </div>

        </div>
      </div>

      {/* Values & Core Priorities */}
      <div className="space-y-6">
        <div className="border-l-4 border-[#C87A53] pl-4 text-left">
          <h3 className="font-display font-medium text-lg text-slate-900 dark:text-white uppercase tracking-wider">
            Nuestros Pilares de Confianza
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">Los valores éticos y técnicos que rigen la operación de nuestra plataforma.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-slate-700 dark:text-slate-300 shrink-0" />
              <h4 className="font-bold text-xs text-slate-800 dark:text-white">Veracidad y Control</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-550 dark:text-slate-400 font-normal">
              Todas las instituciones son auditadas rigurosamente, evitando estafas y garantizando que las becas y cursos publicados sean reales y respaldados legalmente.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-slate-700 dark:text-slate-300 shrink-0" />
              <h4 className="font-bold text-xs text-slate-800 dark:text-white">Descentralización Real</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-550 dark:text-slate-400 font-normal">
              Priorizamos e incentivamos la difusión de oportunidades en regiones fuera de la Metropolitana, apoyando activamente a comunas rurales o vulnerables.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Globe className="w-4.5 h-4.5 text-slate-700 dark:text-slate-300 shrink-0" />
              <h4 className="font-bold text-xs text-slate-800 dark:text-white">Inclusión y Accesibilidad</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-550 dark:text-slate-400 font-normal">
              Diseño web centrado en el usuario móvil y de escritorio, cumpliendo con contrastes legibles WCAG 2.2 y reduciendo el consumo de datos para conexiones limitadas.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4.5 h-4.5 text-slate-700 dark:text-slate-300 shrink-0" />
              <h4 className="font-bold text-xs text-slate-800 dark:text-white">Gratuidad Transparente</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-550 dark:text-slate-400 font-normal">
              Un alto porcentaje de nuestro catálogo son opciones 100% financiadas o gratuitas, respaldadas por becas del Mineduc, Corfo y becas universitarias directas.
            </p>
          </div>

        </div>
      </div>

      {/* Statistics Indicator */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-800 text-center grid grid-cols-2 md:grid-cols-4 gap-6 shadow-xs">
        <div>
          <span className="font-display font-medium text-2xl sm:text-4xl text-[#C87A53] block">+{opportunitiesCount}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Convocatorias Activas</span>
        </div>
        <div>
          <span className="font-display font-medium text-2xl sm:text-4xl text-[#E2B13C] block">+{institutionsCount}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Entidades Afiliadas</span>
        </div>
        <div>
          <span className="font-display font-medium text-2xl sm:text-4xl text-[#C87A53] block">100%</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Instituciones Auditadas</span>
        </div>
        <div>
          <span className="font-display font-medium text-2xl sm:text-4xl text-slate-800 dark:text-slate-100 block">16 Regiones</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Cobertura Nacional</span>
        </div>
      </div>

      {/* Call To Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 text-left md:max-w-xl">
          <h4 className="font-display font-medium text-xl text-slate-900 dark:text-white">¿Eres parte de una institución formativa? 🏫</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Únete a nuestra Red Federal de Vinculación. Si dictas cursos de extensión, talleres artísticos o posees becas abiertas, registra tu entidad hoy mismo y llega a miles de postulantes en todo el país de forma gratuita.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          {onExploreClick && (
            <button
              onClick={onExploreClick}
              className="px-4.5 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-full transition-all cursor-pointer"
            >
              Explorar Catálogo
            </button>
          )}
          {onRegisterClick && (
            <button
              onClick={onRegisterClick}
              className="px-5 py-2.5 bg-[#C87A53] hover:bg-[#b0653f] text-white font-bold text-xs rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span>Registrar Institución</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
