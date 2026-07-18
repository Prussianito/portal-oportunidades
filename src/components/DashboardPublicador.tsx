/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, Plus, Edit2, Copy, Trash2, Eye, MousePointerClick, 
  UserCheck, Calendar, MapPin, Tag, FileCheck, CheckCircle2,
  LineChart, LayoutList, Settings, Sparkles, AlertCircle, Save, HelpCircle, Send, Upload, RefreshCw
} from "lucide-react";
import { Opportunity, CostType, Modality, Institution, UserQuestion } from "../types";
import { CATEGORIES, REGIONS_AND_COMUNAS, TARGET_AUDIENCES } from "../data";

interface DashboardPublicadorProps {
  institution: Institution;
  opportunities: Opportunity[];
  onAddOpportunity: (opp: Opportunity) => void;
  onUpdateOpportunity: (opp: Opportunity) => void;
  onDeleteOpportunity: (id: string) => void;
  onUpdateInstitution: (inst: Institution) => void;
  userQuestions?: UserQuestion[];
  onAnswerQuestion?: (questionId: string, answer: string) => void;
  onPublishQuestionToFaq?: (questionId: string) => void;
  initialEditingOpp?: Opportunity | null;
  onClearInitialEditingOpp?: () => void;
}

export default function DashboardPublicador({
  institution,
  opportunities,
  onAddOpportunity,
  onUpdateOpportunity,
  onDeleteOpportunity,
  onUpdateInstitution,
  userQuestions = [],
  onAnswerQuestion,
  onPublishQuestionToFaq,
  initialEditingOpp,
  onClearInitialEditingOpp
}: DashboardPublicadorProps) {
  const [activeTab, setActiveTab] = useState<"publications" | "questions" | "analytics" | "profile">("publications");
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Trigger editing if initialEditingOpp is provided
  React.useEffect(() => {
    if (initialEditingOpp) {
      handleEditClick(initialEditingOpp);
      if (onClearInitialEditingOpp) {
        onClearInitialEditingOpp();
      }
    }
  }, [initialEditingOpp]);

  // AI Curation states for verified publishers
  const [aiUrlOrText, setAiUrlOrText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiStep, setAiStep] = useState(0);

  // Simulated steps for AI curation
  React.useEffect(() => {
    let interval: any;
    if (isAiLoading) {
      setAiStep(0);
      interval = setInterval(() => {
        setAiStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 1500);
    } else {
      setAiStep(0);
    }
    return () => clearInterval(interval);
  }, [isAiLoading]);

  const handleCrateAi = async () => {
    if (!aiUrlOrText.trim()) {
      alert("Por favor ingresa un enlace o texto para procesar.");
      return;
    }

    setIsAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch("/api/curate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: aiUrlOrText }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error del servidor (${res.status})`);
      }

      const data = await res.json();
      
      if (data.status === "descartado") {
        setAiError("La Inteligencia Artificial determinó que este contenido no es relevante para el catálogo (es un saludo, spam, o evento vencido).");
        return;
      }

      // Populate form fields!
      if (data.name) setTitle(data.name);
      if (data.description) {
        setBriefDescription(data.description.substring(0, 160));
        setFullDescription(data.description);
      }
      if (data.website) {
        setOfficialWebsite(data.website);
        setRegistrationLink(data.website);
      }
      if (data.logo) {
        setImageUrl(data.logo);
      }
      if (data.type) {
        // If type fits inside categories, select it
        setCategories([data.type]);
      }
      if (data.publico_objetivo) {
        setTargetAudience(
          data.publico_objetivo === "Ambos" 
            ? ["Escolares", "Docentes"] 
            : [data.publico_objetivo]
        );
      }
      if (data.region) {
        setRegion(data.region);
      }

      alert("✨ ¡Formulario autocompletado! Revisa los campos completados abajo y luego haz clic en 'Guardar Publicación' para publicar el evento.");
      setAiUrlOrText(""); // Clear after success
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "No se pudo conectar con el motor de IA de Gemini.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Answering states
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [alsoPublishToFaq, setAlsoPublishToFaq] = useState(true);

  // Form Fields
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [modality, setModality] = useState(Modality.Presencial);
  const [cost, setCost] = useState(CostType.Gratuito);
  const [price, setPrice] = useState("");
  const [region, setRegion] = useState(Object.keys(REGIONS_AND_COMUNAS)[0]);
  const [comuna, setComuna] = useState(REGIONS_AND_COMUNAS[Object.keys(REGIONS_AND_COMUNAS)[0]][0]);
  const [address, setAddress] = useState("");
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [briefDescription, setBriefDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [programDetails, setProgramDetails] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("2026-07-31");
  const [eventDate, setEventDate] = useState("2026-08-15");
  const [officialWebsite, setOfficialWebsite] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&fit=crop&q=80");
  const [status, setStatus] = useState<"Draft" | "Published" | "Scheduled">("Published");
  const [isImageDragOver, setIsImageDragOver] = useState(false);

  const handleImageFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Filter local opportunities owned by this institution
  const myOpps = opportunities.filter(o => o.institutionId === institution.id);
  const myOppIds = myOpps.map(o => o.id);
  const myQuestions = (userQuestions || []).filter(q => myOppIds.includes(q.opportunityId));

  // Stats sums
  const totalViews = myOpps.reduce((sum, o) => sum + o.views, 0);
  const totalClicks = myOpps.reduce((sum, o) => sum + o.clicks, 0);
  const totalInscripciones = myOpps.reduce((sum, o) => sum + o.registrations, 0);
  const derivationRate = totalClicks > 0 ? ((totalInscripciones / totalClicks) * 100).toFixed(1) : "0.0";

  const resetForm = () => {
    setTitle("");
    setCategories([]);
    setModality(Modality.Presencial);
    setCost(CostType.Gratuito);
    setPrice("");
    setRegion(Object.keys(REGIONS_AND_COMUNAS)[0]);
    setComuna(REGIONS_AND_COMUNAS[Object.keys(REGIONS_AND_COMUNAS)[0]][0]);
    setAddress("");
    setTargetAudience([]);
    setBriefDescription("");
    setFullDescription("");
    setObjectives("");
    setProgramDetails("");
    setRequirements("");
    setBenefits("");
    setApplicationDeadline("2026-07-31");
    setEventDate("2026-08-15");
    setOfficialWebsite(institution.website);
    setContactEmail(institution.email);
    setContactPhone(institution.phone || "");
    setRegistrationLink("");
    setImageUrl("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&fit=crop&q=80");
    setStatus("Published");
    setEditingOpp(null);
  };

  const handleEditClick = (opp: Opportunity) => {
    setEditingOpp(opp);
    setTitle(opp.title);
    setCategories(opp.categories);
    setModality(opp.modality);
    setCost(opp.cost);
    setPrice(opp.price || "");
    setRegion(opp.region);
    setComuna(opp.comuna);
    setAddress(opp.address || "");
    setTargetAudience(opp.targetAudience);
    setBriefDescription(opp.briefDescription);
    setFullDescription(opp.fullDescription);
    setObjectives(opp.objectives || "");
    setProgramDetails(opp.programDetails || "");
    setRequirements(opp.requirements || "");
    setBenefits(opp.benefits || "");
    setApplicationDeadline(opp.applicationDeadline);
    setEventDate(opp.eventDate);
    setOfficialWebsite(opp.officialWebsite || "");
    setContactEmail(opp.contactEmail || "");
    setContactPhone(opp.contactPhone || "");
    setRegistrationLink(opp.registrationLink || "");
    setImageUrl(opp.imageUrl);
    setStatus(opp.status);
    setShowForm(true);
  };

  const handleDuplicate = (opp: Opportunity) => {
    const duplicated: Opportunity = {
      ...opp,
      id: "opp-" + Date.now(),
      title: `${opp.title} (Copia)`,
      views: 0,
      clicks: 0,
      registrations: 0,
      status: "Draft"
    };
    onAddOpportunity(duplicated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Opportunity = {
      id: editingOpp ? editingOpp.id : "opp-" + Date.now(),
      title,
      institutionId: institution.id,
      institutionName: institution.name,
      institutionLogo: institution.logo,
      isInstitutionVerified: institution.verified,
      categories,
      modality,
      cost,
      price: cost === CostType.Pagado ? price : "",
      region,
      comuna,
      address,
      targetAudience,
      briefDescription,
      fullDescription,
      objectives,
      programDetails,
      requirements,
      benefits,
      applicationDeadline,
      eventDate,
      officialWebsite,
      contactEmail,
      contactPhone,
      registrationLink,
      imageUrl,
      status,
      views: editingOpp ? editingOpp.views : 0,
      clicks: editingOpp ? editingOpp.clicks : 0,
      registrations: editingOpp ? editingOpp.registrations : 0
    };

    if (editingOpp) {
      onUpdateOpportunity(payload);
    } else {
      onAddOpportunity(payload);
    }

    resetForm();
    setShowForm(false);
  };

  const handleCategoryToggle = (cat: string) => {
    setCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleAudienceToggle = (aud: string) => {
    setTargetAudience(prev => 
      prev.includes(aud) ? prev.filter(a => a !== aud) : [...prev, aud]
    );
  };

  return (
    <div id="publisher-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      
      {/* Publisher Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={institution.logo} 
            alt={institution.name} 
            className="w-16 h-16 rounded-[1.25rem] object-cover border-2 border-slate-50 shadow-sm shrink-0" 
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">{institution.name}</h2>
              {institution.verified && (
                <span className="inline-flex items-center text-xs font-bold bg-[#C87A53]/10 text-[#C87A53] border border-[#C87A53]/20 px-2 py-0.5 rounded-full gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C87A53]" />
                  <span>Verificada</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-normal">
              RUT: {institution.rut} | Sitio Oficial: <a href={institution.website} target="_blank" rel="noreferrer" className="underline hover:text-[#C87A53]">{institution.website}</a>
            </p>
          </div>
        </div>

        <button
          id="btn-create-new-publication"
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-[#C87A53] hover:bg-[#b0653f] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Crear Evento</span>
        </button>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 my-6 flex-wrap">
        <button
          id="tab-pub-list"
          onClick={() => { setActiveTab("publications"); setShowForm(false); }}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-4 transition-all flex items-center gap-1.5 ${
            activeTab === "publications" && !showForm
              ? "border-[#C87A53] text-[#C87A53] dark:text-[#C87A53]"
              : "border-transparent text-slate-450 hover:text-slate-700"
          }`}
        >
          <LayoutList className="w-4 h-4" />
          Mis Publicaciones ({myOpps.length})
        </button>
        <button
          id="tab-pub-questions"
          onClick={() => { setActiveTab("questions"); setShowForm(false); }}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-4 transition-all flex items-center gap-1.5 ${
            activeTab === "questions" && !showForm
              ? "border-[#C87A53] text-[#C87A53] dark:text-[#C87A53]"
              : "border-transparent text-slate-450 hover:text-slate-700"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Preguntas de Usuarios ({myQuestions.length})
        </button>
        <button
          id="tab-pub-analytics"
          onClick={() => { setActiveTab("analytics"); setShowForm(false); }}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-4 transition-all flex items-center gap-1.5 ${
            activeTab === "analytics" && !showForm
              ? "border-[#C87A53] text-[#C87A53] dark:text-[#C87A53]"
              : "border-transparent text-slate-450 hover:text-slate-700"
          }`}
        >
          <LineChart className="w-4 h-4" />
          Métricas y Estadísticas
        </button>
        <button
          id="tab-pub-profile"
          onClick={() => { setActiveTab("profile"); setShowForm(false); }}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-4 transition-all flex items-center gap-1.5 ${
            activeTab === "profile" && !showForm
              ? "border-[#C87A53] text-[#C87A53] dark:text-[#C87A53]"
              : "border-transparent text-slate-450 hover:text-slate-700"
          }`}
        >
          <Settings className="w-4 h-4" />
          Perfil Institucional
        </button>
      </div>

      {/* Main View Area */}
      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/80 shadow-xs space-y-6 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">
                {editingOpp ? "Editar Evento" : "Crear Nuevo Evento"}
              </h3>
              <p className="text-xs text-slate-500">Completa los campos detallados para asegurar una postulación transparente.</p>
            </div>
            <button
              type="button"
              onClick={() => { resetForm(); setShowForm(false); }}
              className="text-xs font-semibold text-slate-500 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>

          {/* AI Curator Section for Verified Publishers */}
          {institution.verified && !editingOpp && (
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-lg relative overflow-hidden text-left">
              {/* Decorative Glows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-rose-500/30">
                      <Sparkles className="w-3 h-3 animate-pulse text-rose-400" />
                      <span>Exclusivo: Publicador Verificado ✨</span>
                    </div>
                    <h4 className="text-base font-black tracking-tight flex items-center gap-1.5">
                      <span>Asistente de Autocompletado con Inteligencia Artificial (Gemini)</span>
                    </h4>
                    <p className="text-xs text-slate-400 max-w-2xl">
                      ¿Tienes un enlace a tu publicación de Instagram, un afiche digital, o una descripción promocional en bruto? Pégala abajo para autocompletar este formulario en segundos. Nuestra IA extraerá el título, descripciones, categorías oficiales, público objetivo y links para que puedas publicarlo inmediatamente.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={aiUrlOrText}
                    onChange={(e) => setAiUrlOrText(e.target.value)}
                    placeholder="Escribe o pega aquí el enlace de tu evento, post de Instagram, o texto promocional..."
                    className="flex-1 bg-slate-950/60 border border-slate-800 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                    disabled={isAiLoading}
                  />
                  <button
                    type="button"
                    onClick={handleCrateAi}
                    disabled={isAiLoading || !aiUrlOrText.trim()}
                    className="bg-rose-600 hover:bg-rose-750 disabled:bg-slate-800 disabled:text-slate-500 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer"
                  >
                    {isAiLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Curando Información...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-250 animate-bounce" />
                        <span>Autocompletar Formulario ✨</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Simulated Steps during parsing */}
                {isAiLoading && (
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 space-y-2 max-w-xl">
                    <span className="text-[9px] font-black uppercase text-rose-400 block tracking-wider">Proceso en Vivo con Gemini:</span>
                    <div className="space-y-1 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${aiStep >= 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
                        <span className={aiStep === 0 ? "font-bold text-slate-200" : ""}>Leyendo y analizando texto / enlace proporcionado...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${aiStep >= 1 ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
                        <span className={aiStep === 1 ? "font-bold text-slate-200" : ""}>Clasificando áreas curriculares y público objetivo...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${aiStep >= 2 ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
                        <span className={aiStep === 2 ? "font-bold text-slate-200" : ""}>Optimizando descripciones y completando enlaces...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${aiStep >= 3 ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
                        <span className={aiStep === 3 ? "font-bold text-slate-200" : ""}>Rellenando datos de contacto e imágenes oficiales...</span>
                      </div>
                    </div>
                  </div>
                )}

                {aiError && (
                  <div className="bg-rose-950/30 border border-rose-900/40 text-rose-300 rounded-xl p-3 text-xs flex items-start gap-2 max-w-xl">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Atención: </span>
                      <span>{aiError}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left 8 Columns Form fields */}
            <div className="md:col-span-8 space-y-5">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Nombre Oficial del Evento u Oportunidad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Taller Avanzado de Robótica Espacial y Física Teórica"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Brief and Full Description */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Breve Descripción (Se muestra en la tarjeta - Máx 160 caracteres)</label>
                  <textarea
                    required
                    maxLength={160}
                    placeholder="Escribe un resumen atractivo para captar clics..."
                    value={briefDescription}
                    onChange={(e) => setBriefDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 h-16 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Descripción Completa (Detalles, objetivos, metodologías)</label>
                  <textarea
                    required
                    placeholder="Describe de manera profunda los contenidos del curso, taller o seminario..."
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 h-32 resize-y"
                  />
                </div>
              </div>

              {/* Program, Objectives, Requirements, Benefits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Objetivos del Evento</label>
                  <textarea
                    placeholder="Ej. • Comprender circuitos lógicos básicos..."
                    value={objectives}
                    onChange={(e) => setObjectives(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl focus:outline-hidden h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Cronograma o Programa</label>
                  <textarea
                    placeholder="Ej. Semana 1: Arduino básico. Semana 2: Sensores..."
                    value={programDetails}
                    onChange={(e) => setProgramDetails(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl focus:outline-hidden h-24 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Requisitos de Ingreso o Postulación</label>
                  <textarea
                    placeholder="Ej. • Residir en la región de Valparaíso..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl focus:outline-hidden h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Beneficios del Programa</label>
                  <textarea
                    placeholder="Ej. • Entrega de kit Micro:bit. • Diploma de participación..."
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl focus:outline-hidden h-20 resize-none"
                  />
                </div>
              </div>

              {/* Multiple Selection of Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">Áreas de Clasificación Curricular (Elige una o más)</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800">
                  {CATEGORIES.map(cat => {
                    const isSelected = categories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategoryToggle(cat)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md border transition-all ${
                          isSelected 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right 4 Columns Configuration fields */}
            <div className="md:col-span-4 space-y-5 bg-slate-50/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-150/50 dark:border-slate-800">
              
              {/* Image / Banner Upload (Afiche) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">Afiche o Imagen de la Publicación</label>
                
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsImageDragOver(true);
                  }}
                  onDragLeave={() => setIsImageDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsImageDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleImageFileChange(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => document.getElementById("opp-image-upload")?.click()}
                  className={`border-2 border-dashed rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                    isImageDragOver
                      ? "border-[#1abcfe] bg-[#1abcfe]/5"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <Upload className="w-5 h-5 text-slate-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    Arrastra o selecciona afiche
                  </span>
                  <span className="text-[8px] text-slate-400 dark:text-slate-500">
                    Formatos: PNG, JPG, SVG, WebP
                  </span>
                  <input
                    id="opp-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageFileChange(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                {/* Preview and URL entry */}
                <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Vista Previa"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs shrink-0">
                        No image
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 block">Vista Previa</span>
                      <span className="text-[8px] text-slate-400 dark:text-slate-500 truncate block text-left">
                        {imageUrl.startsWith("data:") ? "Imagen cargada localmente" : imageUrl}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 block mb-0.5 text-left">O introduce un enlace URL:</span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-2 py-1 text-[10px] border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Modality & Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Modalidad</label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value as Modality)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl"
                  >
                    <option value={Modality.Presencial}>Presencial</option>
                    <option value={Modality.Online}>Online</option>
                    <option value={Modality.Hibrida}>Híbrida</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Arancel</label>
                  <select
                    value={cost}
                    onChange={(e) => setCost(e.target.value as CostType)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl"
                  >
                    <option value={CostType.Gratuito}>Gratuito</option>
                    <option value={CostType.Pagado}>Pagado</option>
                  </select>
                </div>
              </div>

              {cost === CostType.Pagado && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Valor de la Inscripción</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. $15.000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl"
                  />
                </div>
              )}

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Región</label>
                  <select
                    value={region}
                    onChange={(e) => {
                      const newRegion = e.target.value;
                      setRegion(newRegion);
                      setComuna(REGIONS_AND_COMUNAS[newRegion][0]);
                    }}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl"
                  >
                    {Object.keys(REGIONS_AND_COMUNAS).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Comuna</label>
                  <select
                    value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl"
                  >
                    {(REGIONS_AND_COMUNAS[region] || []).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Dirección Exacta</label>
                <input
                  type="text"
                  placeholder="Ej. Av. España 1680"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl"
                />
              </div>

              {/* Target Audience selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Dirigido A</label>
                <div className="space-y-1 max-h-24 overflow-y-auto bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200">
                  {TARGET_AUDIENCES.map(aud => {
                    const isChecked = targetAudience.includes(aud);
                    return (
                      <label key={aud} className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleAudienceToggle(aud)}
                          className="rounded text-blue-600"
                        />
                        <span>{aud}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Deadlines */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Fecha de Cierre</label>
                  <input
                    type="date"
                    required
                    value={applicationDeadline}
                    onChange={(e) => setApplicationDeadline(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Fecha del Evento</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl"
                  />
                </div>
              </div>

              {/* External URLs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Enlace de Postulación (Inscripción)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={registrationLink}
                  onChange={(e) => setRegistrationLink(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl"
                />
              </div>

              {/* Publication Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Estado del Post</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Draft" | "Published" | "Scheduled")}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl"
                >
                  <option value="Published">Publicado Inmediatamente</option>
                  <option value="Draft">Borrador (Oculto)</option>
                  <option value="Scheduled">Programado</option>
                </select>
              </div>

            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { resetForm(); setShowForm(false); }}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="save-publication-btn"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#C87A53] hover:bg-[#b0653f] rounded-full shadow-xs transition-all flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-4 h-4 text-white" />
              <span>{editingOpp ? "Actualizar Publicación" : "Guardar Publicación"}</span>
            </button>
          </div>

        </form>
      ) : activeTab === "publications" ? (
        <div className="space-y-4">
          {myOpps.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-12 border border-slate-150 dark:border-slate-850 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-250">No tienes publicaciones activas</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Comienza a difundir tus talleres, cursos, becas o eventos culturales hoy mismo.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mx-auto bg-[#C87A53] hover:bg-[#b0653f] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-xs"
              >
                Crear Primer Evento
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-xs">
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                      <th className="py-3.5 px-4">Oportunidad</th>
                      <th className="py-3.5 px-4">Áreas / Categorías</th>
                      <th className="py-3.5 px-4">Fecha Límite</th>
                      <th className="py-3.5 px-4">Estado</th>
                      <th className="py-3.5 px-4 text-center">Visitas</th>
                      <th className="py-3.5 px-4 text-right pr-6">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60 text-xs">
                    {myOpps.map(opp => (
                      <tr key={opp.id} id={`table-opp-row-${opp.id}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img src={opp.imageUrl} alt={opp.title} className="w-10 h-10 object-cover rounded-lg shrink-0 border" />
                            <div className="max-w-xs truncate">
                              <span className="font-bold text-slate-800 dark:text-white block truncate">{opp.title}</span>
                              <span className="text-[10px] text-slate-400 block truncate">{opp.modality} • {opp.comuna}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {opp.categories.slice(0, 2).map(c => (
                              <span key={c} className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {opp.applicationDeadline}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            opp.status === "Published" ? "bg-emerald-100 text-emerald-800" :
                            opp.status === "Draft" ? "bg-slate-100 text-slate-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {opp.status === "Published" ? "Publicado" : 
                             opp.status === "Draft" ? "Borrador" : "Programado"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-200">
                          {opp.views}
                        </td>
                        <td className="py-3.5 px-4 text-right pr-6">
                          {deleteConfirmId === opp.id ? (
                            <div className="flex items-center justify-end gap-2 animate-in fade-in slide-in-from-right-1 duration-150">
                              <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">¿Eliminar?</span>
                              <button
                                onClick={() => {
                                  onDeleteOpportunity(opp.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-[11px] cursor-pointer shadow-sm transition-all"
                              >
                                Sí, eliminar
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-black rounded-xl text-[11px] cursor-pointer transition-all"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(opp)}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/60 font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-[11px]"
                                title="Editar convocatoria para corregir errores"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Editar</span>
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(opp.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-[11px]"
                                title="Eliminar convocatoria"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Eliminar</span>
                              </button>
                              <button
                                onClick={() => handleDuplicate(opp)}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                title="Duplicar (Clonar)"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>
      ) : activeTab === "questions" ? (
        <div className="space-y-6 animate-in fade-in duration-200 text-left">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-150 dark:border-slate-700/60 shadow-xs space-y-2">
            <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Bandeja de Consultas de Usuarios
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Aquí aparecen las preguntas que los visitantes y usuarios han enviado directamente desde las fichas de tus actividades publicadas. Respóndelas para enviarles un correo de notificación o agrégalas al listado de Preguntas Frecuentes (FAQ) de la actividad de forma automática para resolver dudas recurrentes de otros postulantes.
            </p>
          </div>

          {myQuestions.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 border border-slate-150 dark:border-slate-700/60 text-center space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No hay preguntas recibidas aún</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Las consultas enviadas por la ciudadanía mediante tus publicaciones aparecerán en este panel en tiempo real.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myQuestions.map(q => (
                <div 
                  key={q.id} 
                  className={`p-5 rounded-2xl border transition-all ${
                    q.answered 
                      ? "bg-slate-50/50 dark:bg-slate-900/30 border-slate-150 dark:border-slate-800/80" 
                      : "bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-900 shadow-xs ring-1 ring-blue-500/10"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/55 dark:text-blue-400">
                        {q.opportunityTitle}
                      </span>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
                        De: <span className="text-slate-900 dark:text-white font-extrabold">{q.senderName}</span> • <span className="text-slate-500">{q.senderEmail}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold">{q.createdAt}</span>
                      {q.answered ? (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-2 py-0.5 rounded-full">✓ Respondida</span>
                      ) : (
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 px-2 py-0.5 rounded-full animate-pulse">Pendiente</span>
                      )}
                    </div>
                  </div>

                  <div className="py-4 space-y-2">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                      "{q.question}"
                    </p>

                    {q.answered && q.answer && (
                      <div className="mt-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Tu Respuesta Oficial:</span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          {q.answer}
                        </p>
                        
                        {/* FAQ action inside answered card */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 text-[11px]">
                          {q.publishedToFaq ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Publicado en el FAQ público de la actividad
                            </span>
                          ) : (
                            <>
                              <span className="text-slate-400 dark:text-slate-500 font-medium">Esta respuesta aún no es pública en la sección de FAQ.</span>
                              <button
                                onClick={() => {
                                  if (onPublishQuestionToFaq) onPublishQuestionToFaq(q.id);
                                }}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-lg cursor-pointer transition-all self-end"
                              >
                                Publicar en FAQ de la Ficha
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {!q.answered && (
                    <div className="pt-2">
                      {answeringId === q.id ? (
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/80 space-y-3 animate-in slide-in-from-top-2 duration-150">
                          <textarea
                            rows={3}
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            placeholder="Escribe la respuesta que se le enviará al usuario..."
                            className="w-full text-xs p-2 bg-white dark:bg-slate-850 border border-slate-250 dark:border-slate-750 rounded-lg focus:outline-hidden focus:border-blue-500 dark:text-white"
                          />
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={alsoPublishToFaq}
                                onChange={(e) => setAlsoPublishToFaq(e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                              />
                              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold">
                                Publicar automáticamente en el FAQ público de esta actividad
                              </span>
                            </label>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setAnsweringId(null)}
                                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-250 dark:hover:bg-slate-850 rounded-lg"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => {
                                  if (!answerText.trim()) return;
                                  if (onAnswerQuestion) {
                                    onAnswerQuestion(q.id, answerText);
                                  }
                                  if (alsoPublishToFaq && onPublishQuestionToFaq) {
                                    onPublishQuestionToFaq(q.id);
                                  }
                                  setAnsweringId(null);
                                  setAnswerText("");
                                }}
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-lg cursor-pointer shadow-xs"
                              >
                                Enviar Respuesta
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAnsweringId(q.id);
                            setAnswerText("");
                            setAlsoPublishToFaq(true);
                          }}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>Responder Consulta</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === "analytics" ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Numeric Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 border p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Visualizaciones Totales</span>
              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{totalViews}</span>
                <Eye className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 border p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Clics de Interés</span>
              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{totalClicks}</span>
                <MousePointerClick className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 border p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Inscripciones Derivadas</span>
              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{totalInscripciones}</span>
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 border p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tasa de Conversión</span>
              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{derivationRate}%</span>
                <LineChart className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Graphical Analytics (D3/Recharts aesthetic simulation using highly styled pure React SVGs) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visualizing Views & Clicks per publication */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-150 dark:border-slate-700/60 p-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Rendimiento Comparativo de Publicaciones</h4>
                <p className="text-[11px] text-slate-500">Comportamiento e interés de los usuarios según visitas contra derivaciones reales.</p>
              </div>

              {myOpps.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-xs text-slate-400">Sin datos de rendimiento. Crea un post primero.</div>
              ) : (
                <div className="space-y-3.5 pt-2">
                  {myOpps.map((opp, idx) => {
                    const maxViews = Math.max(...myOpps.map(o => o.views), 100);
                    const viewWidthPercent = (opp.views / maxViews) * 100;
                    const clickWidthPercent = (opp.registrations / maxViews) * 100;

                    return (
                      <div key={opp.id} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span className="truncate max-w-[240px]">{opp.title}</span>
                          <span className="text-slate-400 text-[10px]">Visitas: {opp.views} | Inscripciones: {opp.registrations}</span>
                        </div>
                        <div className="space-y-1">
                          {/* Views bar */}
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-slate-400/80 dark:bg-slate-500 rounded-full transition-all duration-500" 
                              style={{ width: `${Math.max(viewWidthPercent, 2)}%` }}
                            />
                          </div>
                          {/* Registrations bar */}
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                              style={{ width: `${Math.max(clickWidthPercent, 1)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Legend */}
                  <div className="flex gap-4 text-[10px] text-slate-400 font-bold justify-end pt-3 border-t">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-slate-400" /> Visitas
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-blue-500" /> Inscripciones Derivadas
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* General National Engagement / Context stats (bento box styled) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-150 dark:border-slate-700/60 p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Impacto e Interés
                </h4>
                <p className="text-[11px] text-slate-500">Métricas acumuladas del público chileno en tu sector curricular.</p>
              </div>

              <div className="space-y-3.5 my-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sector Preferente</span>
                  <p className="text-xs font-black text-slate-800 dark:text-white">Ciencia y Astronomía</p>
                  <p className="text-[9px] text-slate-500 leading-normal">Concentra el 64% de las búsquedas nacionales de tu institución.</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Público Mayoritario</span>
                  <p className="text-xs font-black text-slate-800 dark:text-white">Docentes de Enseñanza Media</p>
                  <p className="text-[9px] text-slate-500 leading-normal">Un 45% de tus suscriptores son profesores buscando capacitaciones.</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 text-[10px] text-blue-800 dark:text-blue-300 flex gap-1.5 leading-relaxed">
                <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>Las estadísticas se actualizan en tiempo real cada vez que un visitante interactúa o deriva su inscripción.</span>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Profile configuration tab */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-xs space-y-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Editar Perfil Institucional</h3>
            <p className="text-xs text-slate-500">Modifica los datos públicos que se mostrarán en la página oficial de tu institución.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Historia y Origen de la Entidad</label>
              <textarea
                placeholder="Escribe sobre la historia o trayectoria de tu institución..."
                defaultValue={institution.history || ""}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 h-28"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Descripción Pública Corta</label>
                <textarea
                  placeholder="Pequeña descripción para tarjetas de presentación..."
                  defaultValue={institution.description}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl h-14"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Teléfono de Contacto</label>
                  <input
                    type="text"
                    defaultValue={institution.phone || ""}
                    placeholder="+56 2 2..."
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Sitio Web</label>
                  <input
                    type="url"
                    defaultValue={institution.website}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => { alert("Perfil institucional guardado exitosamente."); }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Guardar Perfil
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
