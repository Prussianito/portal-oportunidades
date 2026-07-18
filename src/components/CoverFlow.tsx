import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Monitor, Sparkles, GraduationCap, ArrowRight } from "lucide-react";
import { Opportunity } from "../types";

interface CoverFlowProps {
  opportunities: Opportunity[];
  onViewDetails: (opp: Opportunity) => void;
  isEmbedded?: boolean;
  onViewProfile?: (id: string, type: "user" | "institution") => void;
}

export default function CoverFlow({ opportunities, onViewDetails, isEmbedded = false, onViewProfile }: CoverFlowProps) {
  // Use provided featured opportunities, or fallback to any available
  const items = opportunities && opportunities.length > 0 ? opportunities : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen size for mobile adjustments
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto play carousel every 6 seconds unless user interacts
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return dateStr;
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${day} ${months[parseInt(month, 10) - 1]}`;
  };

  const renderContent = () => (
    <div className={`${isEmbedded ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}>
      
      {/* Header Title Section - Only if not embedded */}
      {!isEmbedded && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-3 md:space-y-0">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3 animate-pulse" />
              Recomendado por el Comité
            </span>
            <h2 className="font-display font-black text-xl sm:text-2xl text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
              Selección Especial
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Explora las convocatorias con mayor protagonismo y postulación abierta en todo el país.
            </p>
          </div>

          {/* Quick navigation arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cover Flow Stage */}
      <div 
        className="relative w-full h-[360px] sm:h-[400px] md:h-[440px] flex items-center justify-center overflow-visible"
        style={{ perspective: "1200px" }}
      >
        {/* Floating absolute navigation buttons for embedded view */}
        {isEmbedded && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-1 sm:left-4 z-40 p-2.5 rounded-full bg-slate-900/70 border border-slate-700 text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-xs"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-1 sm:right-4 z-40 p-2.5 rounded-full bg-slate-900/70 border border-slate-700 text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-xs"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="relative w-full h-full flex items-center justify-center">
          {items.map((opp, idx) => {
            // Calculate index difference in a circular array
            let diff = idx - activeIndex;
            const len = items.length;
            
            // Wrap index differences for circular looping
            if (diff < -len / 2) diff += len;
            if (diff > len / 2) diff -= len;

            // If diff is outside [-2, 2], do not render/hide it
            const isVisible = Math.abs(diff) <= 2;
            if (!isVisible) return null;

            // Styles for visual cards based on diff (-2, -1, 0, 1, 2)
            const positionStyles = {
              "0": { // Center card (Main protagonist)
                x: "0%",
                scale: isMobile ? 1.02 : 1.1,
                zIndex: 10,
                opacity: 1,
                rotateY: 0,
                brightness: "brightness(100%)",
                shadow: "0 25px 50px -12px rgba(37, 99, 235, 0.35), 0 0 25px 5px rgba(59, 130, 246, 0.15)"
              },
              "-1": { // Left card 1
                x: isMobile ? "-28%" : "-36%",
                scale: isMobile ? 0.85 : 0.9,
                zIndex: 5,
                opacity: 0.75,
                rotateY: isMobile ? 22 : 32,
                brightness: "brightness(60%)",
                shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.15)"
              },
              "1": { // Right card 1
                x: isMobile ? "28%" : "36%",
                scale: isMobile ? 0.85 : 0.9,
                zIndex: 5,
                opacity: 0.75,
                rotateY: isMobile ? -22 : -32,
                brightness: "brightness(60%)",
                shadow: "0 10px 15px -3px rgba(0, 0, 0, 0.15)"
              },
              "-2": { // Left card 2
                x: isMobile ? "-52%" : "-64%",
                scale: isMobile ? 0.72 : 0.78,
                zIndex: 2,
                opacity: 0.4,
                rotateY: isMobile ? 38 : 52,
                brightness: "brightness(40%)",
                shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.15)"
              },
              "2": { // Right card 2
                x: isMobile ? "52%" : "64%",
                scale: isMobile ? 0.72 : 0.78,
                zIndex: 2,
                opacity: 0.4,
                rotateY: isMobile ? -38 : -52,
                brightness: "brightness(40%)",
                shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.15)"
              }
            };

            // Cast diff to string to match key
            const key = diff.toString() as "-2" | "-1" | "0" | "1" | "2";
            const currentStyle = positionStyles[key] || {
              x: diff < 0 ? "-100%" : "100%",
              scale: 0.6,
              zIndex: 1,
              opacity: 0,
              rotateY: 0,
              brightness: "brightness(20%)",
              shadow: "none"
            };

            const isCenter = diff === 0;

            return (
              <motion.div
                key={opp.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(e, info) => {
                  const threshold = 55; // Pixels required to trigger navigation
                  if (info.offset.x < -threshold) {
                    handleNext();
                  } else if (info.offset.x > threshold) {
                    handlePrev();
                  }
                }}
                animate={{
                  x: currentStyle.x,
                  scale: currentStyle.scale,
                  zIndex: currentStyle.zIndex,
                  opacity: currentStyle.opacity,
                  rotateY: currentStyle.rotateY,
                  filter: currentStyle.brightness,
                }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 24
                }}
                onTap={() => {
                  if (isCenter) {
                    onViewDetails(opp);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                style={{
                  transformStyle: "preserve-3d",
                  boxShadow: currentStyle.shadow,
                }}
                className={`absolute w-[280px] sm:w-[350px] md:w-[380px] h-[320px] sm:h-[360px] md:h-[390px] rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 cursor-pointer select-none`}
              >
                {/* Image Header Background */}
                <div className="h-40 sm:h-44 md:h-48 relative overflow-hidden bg-slate-950">
                  <img
                    src={opp.imageUrl || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&fit=crop&q=80"}
                    alt={opp.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85 transition-transform duration-500 hover:scale-103"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Institution Label */}
                  <div 
                    onClick={(e) => {
                      if (onViewProfile) {
                        e.stopPropagation();
                        onViewProfile(opp.institutionId, "institution");
                      }
                    }}
                    className={`absolute bottom-3 left-4 right-4 flex items-center gap-2 z-30 ${
                      onViewProfile ? "hover:text-blue-400 cursor-pointer" : ""
                    }`}
                  >
                    {opp.institutionLogo && (
                      <img 
                        src={opp.institutionLogo} 
                        alt={opp.institutionName}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover border border-white/20 shadow-xs" 
                      />
                    )}
                    <span className="text-white text-xs font-semibold tracking-wide drop-shadow-sm truncate hover:underline">
                      {opp.institutionName}
                    </span>
                  </div>

                  {/* Modality Tag */}
                  <span className="absolute top-3 right-3 bg-blue-600/90 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-xs">
                    {opp.modality}
                  </span>

                  {/* Categories Badge on top left */}
                  <div className="absolute top-3 left-3 flex gap-1">
                    {opp.categories.slice(0, 1).map(c => (
                      <span key={c} className="bg-slate-900/85 text-orange-400 border border-orange-500/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-xs">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Body Info */}
                <div className="p-4 flex flex-col justify-between h-[calc(100%-10rem)] sm:h-[calc(100%-11rem)] md:h-[calc(100%-12rem)] space-y-1.5">
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-xs sm:text-sm md:text-base text-slate-800 dark:text-white leading-snug line-clamp-2">
                      {opp.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {opp.briefDescription}
                    </p>
                  </div>

                  {/* Bottom Metadata & Button */}
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2.5 flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">
                        Fecha Límite
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(opp.applicationDeadline)}
                      </span>
                    </div>

                    {/* View Details Call to Action (only visible/interactable on center card) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(opp);
                      }}
                      className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
                        isCenter
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                      }`}
                      disabled={!isCenter}
                    >
                      <span>Postular</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Indicator dots for manual navigation */}
      <div className="flex justify-center items-center gap-1.5 mt-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === activeIndex 
                ? "w-6 bg-blue-600" 
                : "w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
            }`}
            aria-label={`Ir al slide ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );

  if (isEmbedded) {
    return (
      <div className="w-full relative py-2 overflow-visible">
        {renderContent()}
      </div>
    );
  }

  return (
    <section className="w-full py-8 bg-slate-50/40 dark:bg-slate-950/20 border-y border-slate-200/50 dark:border-slate-800/50 overflow-hidden relative">
      {renderContent()}
    </section>
  );
}
