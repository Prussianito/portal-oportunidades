/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Opportunity, CostType, AdBanner, User } from "../types";
import { 
  X, MapPin, Calendar, CheckCircle2, Star, Share2, 
  ExternalLink, FileText, Phone, Mail, Globe, Sparkles, HelpCircle,
  Clock, Info, BookOpen, AlertTriangle, Send
} from "lucide-react";
import AdPlacement from "./AdPlacement";

interface OpportunityDetailProps {
  opportunity: Opportunity;
  isFavorited: boolean;
  onFavoriteToggle: (id: string) => void;
  onClose: () => void;
  onRegisterDerivation: (id: string) => void; // Register derivation clicks in metrics
  banners?: AdBanner[];
  currentUser?: User | null;
  onSubmitQuestion?: (opportunityId: string, opportunityTitle: string, name: string, email: string, question: string) => void;
  onViewProfile?: (id: string, type: "user" | "institution") => void;
}

export default function OpportunityDetail({
  opportunity,
  isFavorited,
  onFavoriteToggle,
  onClose,
  onRegisterDerivation,
  banners,
  currentUser,
  onSubmitQuestion,
  onViewProfile
}: OpportunityDetailProps) {
  const [activeTab, setActiveTab] = useState<"info" | "program" | "faq">("info");
  const [showShareToast, setShowShareToast] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  // Question form states
  const [qName, setQName] = useState(currentUser?.name || "");
  const [qEmail, setQEmail] = useState(currentUser?.email || "");
  const [qText, setQText] = useState("");
  const [qSuccess, setQSuccess] = useState(false);

  // Sync user state if it changes
  React.useEffect(() => {
    if (currentUser) {
      setQName(currentUser.name || "");
      setQEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleSubmitQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qName.trim() || !qEmail.trim() || !qText.trim()) return;
    if (onSubmitQuestion) {
      onSubmitQuestion(opportunity.id, opportunity.title, qName, qEmail, qText);
    }
    setQText("");
    setQSuccess(true);
    setTimeout(() => setQSuccess(false), 5000);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return `${day} de ${months[monthIndex]} de ${year}`;
  };

  const handleShare = () => {
    const link = `${window.location.origin}/oportunidad/${opportunity.id}`;
    navigator.clipboard.writeText(link);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  const handleInscribe = () => {
    onRegisterDerivation(opportunity.id);
    const mockLink = opportunity.registrationLink || "https://www.chileatiende.gob.cl";
    window.open(mockLink, "_blank", "noopener,noreferrer");
  };

  // Dynamic values based on scrolling
  const maxScrollRange = 250;
  const opacityValue = Math.max(0, 1 - scrollTop / maxScrollRange);
  const scaleValue = Math.max(0.9, 1 - (scrollTop / maxScrollRange) * 0.1);
  const parallaxValue = scrollTop * 0.35;

  return (
    <div id="opp-detail-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md overflow-y-auto">
      <div id="opp-detail-content" className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Floating close button - Pinned at top-right of the dialog */}
        <button
          id="close-opp-detail"
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer border border-slate-100 dark:border-slate-700 shadow-xs"
          aria-label="Cerrar Detalles"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container covering entire height */}
        <div 
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto bg-slate-50/55 dark:bg-slate-950/20 relative scroll-smooth"
        >
          
          {/* Banner/Header Image - Part of scroll stream but with fade & parallax */}
          <div className="relative h-48 sm:h-72 w-full overflow-hidden bg-slate-950 shrink-0">
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                opacity: opacityValue,
                transform: `scale(${scaleValue}) translateY(${parallaxValue}px)`,
                transformOrigin: "center",
              }}
            >
              <img
                src={opportunity.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&fit=crop&q=80"}
                alt={opportunity.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            </div>

            {/* Bottom metadata floating on banner */}
            <div 
              className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
              style={{ opacity: opacityValue }}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                    opportunity.cost === CostType.Gratuito ? "bg-emerald-500 text-white" : "bg-blue-600 text-white"
                  }`}>
                    {opportunity.cost === CostType.Gratuito ? "Gratuito" : (opportunity.price || "Pagado")}
                  </span>
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-900/80 text-white uppercase tracking-wider backdrop-blur-xs">
                    {opportunity.modality}
                  </span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {opportunity.title}
                </h2>
                
                <div 
                  onClick={() => {
                    if (onViewProfile) {
                      onClose();
                      onViewProfile(opportunity.institutionId, "institution");
                    }
                  }}
                  className={`flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-semibold drop-shadow-xs ${
                    onViewProfile ? "hover:text-white cursor-pointer hover:underline" : ""
                  }`}
                >
                  {opportunity.institutionLogo && (
                    <img src={opportunity.institutionLogo} className="w-5 h-5 rounded-full object-cover border border-white/20" alt="logo" />
                  )}
                  <span>Organiza: {opportunity.institutionName}</span>
                  {opportunity.isInstitutionVerified && (
                    <span className="inline-flex items-center text-blue-400" title="Institución Verificada">
                      <CheckCircle2 className="w-4 h-4 fill-white/10" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Body Layout */}
          <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Side (8 cols): Main info and tabs */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tabs Selector */}
            <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <button
                id="tab-detail-info"
                onClick={() => setActiveTab("info")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                  activeTab === "info" 
                    ? "bg-[#C87A53] border-[#C87A53] text-white shadow-xs" 
                    : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Información General 📚
              </button>
              <button
                id="tab-detail-program"
                onClick={() => setActiveTab("program")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                  activeTab === "program" 
                    ? "bg-[#C87A53] border-[#C87A53] text-white shadow-xs" 
                    : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Programa y Requisitos 📝
              </button>
              <button
                id="tab-detail-faq"
                onClick={() => setActiveTab("faq")}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                  activeTab === "faq" 
                    ? "bg-[#C87A53] border-[#C87A53] text-white shadow-xs" 
                    : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Preguntas Frecuentes ({opportunity.faqs?.length || 0}) ❓
              </button>
            </div>

            {/* Tab: Information General */}
            {activeTab === "info" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                
                {/* Full description */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Descripción Completa</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {opportunity.fullDescription}
                  </p>
                </div>

                {/* Who can participate & Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Público Objetivo
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {opportunity.targetAudience.map((audience) => (
                        <span key={audience} className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md">
                          {audience}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Beneficios
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {opportunity.benefits || "Certificado oficial de asistencia y materiales incluidos sin costo."}
                    </p>
                  </div>
                </div>

                {/* Simulated Maps Mockup */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Lugar y Mapa</h3>
                  <div className="bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
                    <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-slate-800 dark:text-slate-100">
                          {opportunity.address || "Modalidad Virtual / Online"}
                        </span>
                        <span className="text-[11px] text-slate-500">{opportunity.comuna}, {opportunity.region}</span>
                      </div>
                    </div>

                    {/* Highly polished Chile administrative style mini map mockup */}
                    <div className="h-32 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] dark:opacity-5" />
                      
                      {/* Grid overlay */}
                      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

                      {/* Map lines simulation */}
                      <svg className="absolute inset-0 w-full h-full text-slate-200 dark:text-slate-800" fill="none">
                        <path d="M 0 50 Q 150 100 300 30 L 450 110 L 600 20" stroke="currentColor" strokeWidth="2" />
                        <path d="M 100 0 Q 250 80 400 150" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                        <circle cx="250" cy="80" r="12" fill="#3b82f6" fillOpacity="0.15" />
                      </svg>

                      {/* Live Pin Marker */}
                      <div className="relative flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-rose-500 border-2 border-white animate-ping absolute" />
                        <MapPin className="w-6 h-6 text-rose-600 relative z-10" />
                        <span className="text-[9px] font-extrabold bg-slate-900/95 text-white px-2 py-0.5 rounded shadow-sm mt-1 border border-white/10 uppercase tracking-wider">
                          Ubicación de Actividad
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab: Program and Requirements */}
            {activeTab === "program" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    Programa de la Actividad
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                    {opportunity.programDetails || "El programa definitivo se entregará a los participantes al inicio del evento. Contempla clases teóricas, paneles de conversación y desarrollo práctico guiado."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-500" />
                    Requisitos para Participar
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                    {opportunity.requirements || "• Motivación por aprender e interés en la temática.\n• Disponibilidad en las fechas indicadas.\n• No requiere experiencia previa a menos que se indique."}
                  </p>
                </div>

                {/* Downloadable Documents Section */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Bases y Documentos Descargables</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {opportunity.documents && opportunity.documents.length > 0 ? (
                      opportunity.documents.map((doc, idx) => (
                        <a
                          key={idx}
                          href={doc.url}
                          className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-150 dark:border-slate-800 shadow-xs hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-slate-700 dark:text-slate-200"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 shrink-0 text-blue-600" />
                            <span className="text-xs font-bold truncate">{doc.name}</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ))
                    ) : (
                      <>
                        <a
                          href="#"
                          className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-150 dark:border-slate-800 shadow-xs hover:border-blue-400 text-slate-700 dark:text-slate-300"
                          onClick={(e) => { e.preventDefault(); alert("Descargando bases oficiales de la convocatoria..."); }}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold">Bases Oficiales Convocatoria 2026.pdf</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href="#"
                          className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-150 dark:border-slate-800 shadow-xs hover:border-blue-400 text-slate-700 dark:text-slate-300"
                          onClick={(e) => { e.preventDefault(); alert("Descargando cronograma educativo..."); }}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold">Cronograma de Talleres y Recursos.docx</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: FAQs */}
            {activeTab === "faq" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="space-y-3">
                  {opportunity.faqs && opportunity.faqs.length > 0 ? (
                    opportunity.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-150 dark:border-slate-800 p-4 space-y-1">
                        <h4 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-blue-600" />
                          {faq.question}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                          {faq.answer}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-150 dark:border-slate-800 p-4 space-y-1">
                        <h4 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-blue-600" />
                          ¿Tiene algún costo de inscripción o mensualidad?
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                          {opportunity.cost === CostType.Gratuito 
                            ? "No, esta actividad es 100% subvencionada y gratuita para todos los participantes que resulten seleccionados." 
                            : `Sí, tiene un costo único arancelario de ${opportunity.price || "$20.000"} pesos chilenos.`}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-150 dark:border-slate-800 p-4 space-y-1">
                        <h4 className="text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-blue-600" />
                          ¿Se entregan certificados oficiales?
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                          Sí, al final de la actividad se entregará un diploma oficial firmado por las autoridades institucionales que acredita la participación y cumplimiento de horas pedagógicas.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Send a question section */}
                <div className="bg-blue-50/40 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-800 p-5 rounded-2xl space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-blue-600" />
                      ¿Tienes alguna consulta? Escribe a la institución
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      ¿Tienes dudas sobre los plazos, requisitos o el programa? Envía tu pregunta directamente a <strong>{opportunity.institutionName}</strong>. Te responderemos al correo ingresado.
                    </p>
                  </div>

                  {qSuccess ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl text-center space-y-2 animate-in zoom-in duration-200">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xs">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-xs text-emerald-800 dark:text-emerald-400">¡Consulta enviada exitosamente!</h5>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-500">Tu pregunta fue recibida por la institución. Si la responden, se te notificará por correo y podría ser publicada en esta sección.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitQuestionSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tu Nombre</label>
                          <input
                            type="text"
                            required
                            value={qName}
                            onChange={(e) => setQName(e.target.value)}
                            placeholder="Ej. Constanza Silva"
                            className="w-full text-xs bg-white dark:bg-slate-850 border border-slate-250 dark:border-slate-750 px-3 py-2 rounded-xl focus:outline-hidden focus:border-blue-500 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
                          <input
                            type="email"
                            required
                            value={qEmail}
                            onChange={(e) => setQEmail(e.target.value)}
                            placeholder="Ej. constanza@correo.cl"
                            className="w-full text-xs bg-white dark:bg-slate-850 border border-slate-250 dark:border-slate-750 px-3 py-2 rounded-xl focus:outline-hidden focus:border-blue-500 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tu Pregunta o Duda</label>
                        <textarea
                          required
                          rows={3}
                          value={qText}
                          onChange={(e) => setQText(e.target.value)}
                          placeholder="Escribe tu consulta de forma clara..."
                          className="w-full text-xs bg-white dark:bg-slate-850 border border-slate-250 dark:border-slate-750 px-3 py-2 rounded-xl focus:outline-hidden focus:border-blue-500 dark:text-white resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#C87A53] hover:bg-[#b0653f] text-white font-bold text-xs rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5 text-white" />
                        <span>Enviar consulta a {opportunity.institutionName} ✉️</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Side (4 cols): Important dates & Actions */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Call to action boxes */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-[2rem] shadow-xs space-y-4">
              
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Fechas Clave 📅</span>
                <div className="space-y-3 pt-2">
                  <div className="flex gap-2 text-xs">
                    <div className="w-2.5 h-2.5 mt-1 rounded-full bg-[#C87A53] shrink-0" />
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-slate-200">Plazo de Postulación</span>
                      <span className="text-slate-500 font-medium text-[11px]">Hasta el {formatDate(opportunity.applicationDeadline)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <div className="w-2.5 h-2.5 mt-1 rounded-full bg-[#E2B13C] shrink-0" />
                    <div>
                      <span className="font-semibold block text-slate-900 dark:text-slate-200">Inicio de Actividad</span>
                      <span className="text-slate-500 font-medium text-[11px]">El {formatDate(opportunity.eventDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-2">
                
                {/* Main Registration Button */}
                <button
                  id="btn-go-to-registration"
                  onClick={handleInscribe}
                  className="w-full py-2.5 px-4 bg-[#C87A53] hover:bg-[#b0653f] text-white font-bold text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ir a la Inscripción 🚀</span>
                  <ExternalLink className="w-4 h-4 text-white" />
                </button>

                {/* Favorite & Share secondary actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="btn-detail-favorite"
                    onClick={() => onFavoriteToggle(opportunity.id)}
                    className="py-2.5 px-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Star className={`w-3.5 h-3.5 ${isFavorited ? "fill-[#E2B13C] text-[#E2B13C]" : "text-slate-400"}`} />
                    <span>{isFavorited ? "Guardado" : "Guardar"}</span>
                  </button>

                  <button
                    id="btn-detail-share"
                    onClick={handleShare}
                    className="py-2.5 px-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Compartir</span>
                  </button>
                </div>

                {/* Share Link Toast */}
                {showShareToast && (
                  <p className="text-[10px] text-center text-emerald-600 font-extrabold animate-pulse pt-1">
                    ✔ ¡Enlace copiado al portapapeles!
                  </p>
                )}
              </div>
            </div>

            {/* Institution Contact Card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-3">
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Contacto Organizador</span>
              
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={`mailto:${opportunity.contactEmail || "contacto@institucion.cl"}`} className="hover:underline hover:text-blue-600 truncate">
                    {opportunity.contactEmail || "contacto@institucion.cl"}
                  </a>
                </div>
                {opportunity.contactPhone && (
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{opportunity.contactPhone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                  <a href={opportunity.officialWebsite || "https://www.gob.cl"} target="_blank" rel="noreferrer" className="hover:underline hover:text-blue-600 truncate">
                    Sitio Web Oficial
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar advertisement */}
            <AdPlacement type="sidebar" id={`detail-sidebar-ad-${opportunity.id}`} banners={banners} />

            {/* Platform Security Badge */}
            <div className="bg-emerald-50/55 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 p-4 rounded-2xl flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Garantía de Veracidad</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  Esta oportunidad proviene de una institución verificada mediante RUT oficial y acreditación gubernamental, garantizando la seriedad del evento.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  </div>
  );
}
