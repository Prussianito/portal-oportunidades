/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldCheck, Check, X, FileText, AlertTriangle, Sparkles, Trash, Eye,
  Building, User, Shield, MessageCircle, RefreshCw, Layers, Newspaper,
  Megaphone, Plus, Edit2, ToggleLeft, ToggleRight, CheckSquare, PlusCircle,
  ExternalLink, Globe, Layout, AlignLeft, EyeOff
} from "lucide-react";
import { Institution, Opportunity, Role, NewsArticle, AdBanner, Modality, CostType } from "../types";

interface DashboardAdminProps {
  pendingInstitutions: Institution[];
  onApproveInstitution: (id: string) => void;
  onRejectInstitution: (id: string) => void;
  opportunities: Opportunity[];
  onToggleFeatureOpportunity: (id: string) => void;
  onDeleteOpportunity: (id: string) => void;
  onAddOpportunity: (opp: Opportunity) => void;
  
  // News Control Props
  newsArticles: NewsArticle[];
  onAddNewsArticle: (article: NewsArticle) => void;
  onUpdateNewsArticle: (article: NewsArticle) => void;
  onDeleteNewsArticle: (id: string) => void;

  // Ad Control Props
  adBanners: AdBanner[];
  onAddAdBanner: (banner: AdBanner) => void;
  onUpdateAdBanner: (banner: AdBanner) => void;
  onDeleteAdBanner: (id: string) => void;
  onToggleAdActive: (id: string) => void;
}

const NEWS_IMAGE_PRESETS = [
  { name: "Computadores & TIC", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&fit=crop&q=80" },
  { name: "Inteligencia Artificial", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&fit=crop&q=80" },
  { name: "Estudiantes / Biblioteca", url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&fit=crop&q=80" },
  { name: "Reunión / Orientación", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&fit=crop&q=80" },
  { name: "Campus Universitario", url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&fit=crop&q=80" }
];

const AD_IMAGE_PRESETS = [
  { name: "Escuela / Idiomas", url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&fit=crop&q=80" },
  { name: "Laptop / Código", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&fit=crop&q=80" },
  { name: "Robótica / Futuro", url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&fit=crop&q=80" },
  { name: "Mentoría / Tutor", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&fit=crop&q=80" }
];

export default function DashboardAdmin({
  pendingInstitutions,
  onApproveInstitution,
  onRejectInstitution,
  opportunities,
  onToggleFeatureOpportunity,
  onDeleteOpportunity,
  onAddOpportunity,
  
  newsArticles,
  onAddNewsArticle,
  onUpdateNewsArticle,
  onDeleteNewsArticle,

  adBanners,
  onAddAdBanner,
  onUpdateAdBanner,
  onDeleteAdBanner,
  onToggleAdActive
}: DashboardAdminProps) {
  const [activeTab, setActiveTab] = useState<"verifications" | "moderation" | "news" | "ads" | "reports" | "ai-curator">("verifications");
  const [viewDocName, setViewDocName] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const [deleteNewsConfirmId, setDeleteNewsConfirmId] = useState<string | null>(null);
  const [deleteAdConfirmId, setDeleteAdConfirmId] = useState<string | null>(null);

  // AI Curation States
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiStep, setAiStep] = useState(0);
  const [aiResult, setAiResult] = useState<any>(null);

  const [curatedForm, setCuratedForm] = useState<any>({
    name: "",
    type: "Colegio",
    website: "",
    description: "",
    publico_objetivo: "Ambos",
    region: "Región Metropolitana",
    logo: "",
    comuna: "Santiago",
    modality: Modality.Presencial,
    cost: CostType.Gratuito,
    price: "",
  });

  // Simulated live steps for visual polish during curation
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
    if (!aiInput.trim()) {
      alert("Por favor ingresa texto o un enlace para procesar.");
      return;
    }

    setIsAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const res = await fetch("/api/curate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: aiInput }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Error del servidor (${res.status})`);
      }

      const data = await res.json();
      setAiResult(data);
      
      if (data.status === "aprobado") {
        setCuratedForm({
          name: data.name || "",
          type: data.type || "Colegio",
          website: data.website || "",
          description: data.description || "",
          publico_objetivo: data.publico_objetivo || "Ambos",
          region: data.region || "Región Metropolitana",
          logo: data.logo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&q=80",
          comuna: "Santiago",
          modality: Modality.Presencial,
          cost: CostType.Gratuito,
          price: "",
        });
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "No se pudo conectar con el motor de IA de Gemini.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePublishCurated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!curatedForm.name || !curatedForm.description) {
      alert("Por favor rellena el nombre y descripción.");
      return;
    }

    const newOpp: Opportunity = {
      id: `opp-ai-${Date.now()}`,
      title: curatedForm.name,
      institutionId: `inst-curated-${Date.now()}`,
      institutionName: curatedForm.type,
      institutionLogo: curatedForm.logo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&q=80",
      isInstitutionVerified: true,
      categories: [curatedForm.type],
      modality: curatedForm.modality,
      cost: curatedForm.cost,
      price: curatedForm.price || undefined,
      region: curatedForm.region,
      comuna: curatedForm.comuna,
      targetAudience: curatedForm.publico_objetivo === "Ambos" ? ["Escolares", "Docentes"] : [curatedForm.publico_objetivo],
      imageUrl: curatedForm.logo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&fit=crop&q=80",
      briefDescription: curatedForm.description,
      fullDescription: curatedForm.description + "\n\nEsta convocatoria ha sido curada de forma automatizada por el motor de Inteligencia Artificial de Convocatorias Escolares Chile.",
      status: "Published",
      views: 0,
      clicks: 0,
      registrations: 0,
      applicationDeadline: "2026-12-15",
      eventDate: "2026-12-31",
      officialWebsite: curatedForm.website,
      registrationLink: curatedForm.website,
    };

    onAddOpportunity(newOpp);
    alert(`✔ ¡Éxito! Oportunidad "${curatedForm.name}" publicada correctamente en el catálogo nacional.`);
    
    // Clear state and redirect to moderation tab to see it
    setAiInput("");
    setAiResult(null);
    setActiveTab("moderation");
  };

  // Simulated Reports from Users
  const [reports, setReports] = useState([
    {
      id: "rep-1",
      opportunityTitle: "Taller Práctico de Grabado y Patrimonio",
      reporterEmail: "catalina.suarez@gmail.com",
      reason: "Enlace de inscripción roto",
      details: "Al intentar hacer clic en 'Ir a la inscripción' redirige a una página 404 del Museo Nacional de Bellas Artes.",
      status: "Pendiente",
      date: "24-Jun-2026"
    },
    {
      id: "rep-2",
      opportunityTitle: "Seminario Regional de Innovación y Liderazgo",
      reporterEmail: "marcos.p@yahoo.es",
      reason: "Información desactualizada",
      details: "Cambiaron la fecha presencial para el fin de semana del 12 de julio, pero en el portal todavía figura que inicia el 5 de julio.",
      status: "Pendiente",
      date: "25-Jun-2026"
    }
  ]);

  // Modals for editing
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    category: "",
    author: "",
    source: "",
    tag: "",
    readingTime: "3 min de lectura"
  });

  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdBanner | null>(null);
  const [adForm, setAdForm] = useState({
    title: "",
    description: "",
    image: "",
    ctaText: "",
    ctaUrl: "",
    sponsorName: "",
    tagsInput: "",
    type: "horizontal" as "horizontal" | "card" | "sidebar",
    active: true
  });

  const resolveReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: "Resuelto" } : r));
    alert("Reporte marcado como RESUELTO. Se ha enviado un correo al publicador solicitando la corrección.");
  };

  // NEWS Handlers
  const handleOpenNewsModal = (article?: NewsArticle) => {
    if (article) {
      setEditingNews(article);
      setNewsForm({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        imageUrl: article.imageUrl,
        category: article.category,
        author: article.author,
        source: article.source || "",
        tag: article.tag || "",
        readingTime: article.readingTime
      });
    } else {
      setEditingNews(null);
      setNewsForm({
        title: "",
        excerpt: "",
        content: "",
        imageUrl: NEWS_IMAGE_PRESETS[0].url,
        category: "Educación",
        author: "Editor Portal",
        source: "Mineduc",
        tag: "Novedad",
        readingTime: "3 min de lectura"
      });
    }
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.excerpt || !newsForm.content) {
      alert("Por favor rellene los campos obligatorios.");
      return;
    }

    if (editingNews) {
      onUpdateNewsArticle({
        ...editingNews,
        title: newsForm.title,
        excerpt: newsForm.excerpt,
        content: newsForm.content,
        imageUrl: newsForm.imageUrl,
        category: newsForm.category,
        author: newsForm.author,
        source: newsForm.source,
        tag: newsForm.tag,
        readingTime: newsForm.readingTime
      });
    } else {
      onAddNewsArticle({
        id: `news-${Date.now()}`,
        title: newsForm.title,
        excerpt: newsForm.excerpt,
        content: newsForm.content,
        imageUrl: newsForm.imageUrl,
        category: newsForm.category,
        publishDate: new Date().toISOString().split("T")[0],
        readingTime: newsForm.readingTime,
        author: newsForm.author,
        source: newsForm.source,
        tag: newsForm.tag
      });
    }
    setIsNewsModalOpen(false);
  };

  // AD BANNERS Handlers
  const handleOpenAdModal = (ad?: AdBanner) => {
    if (ad) {
      setEditingAd(ad);
      setAdForm({
        title: ad.title,
        description: ad.description,
        image: ad.image,
        ctaText: ad.ctaText,
        ctaUrl: ad.ctaUrl,
        sponsorName: ad.sponsorName,
        tagsInput: ad.tags ? ad.tags.join(", ") : "",
        type: ad.type,
        active: ad.active
      });
    } else {
      setEditingAd(null);
      setAdForm({
        title: "",
        description: "",
        image: AD_IMAGE_PRESETS[0].url,
        ctaText: "Más Información",
        ctaUrl: "https://",
        sponsorName: "Patrocinador Oficial",
        tagsInput: "Educación, Becas",
        type: "horizontal",
        active: true
      });
    }
    setIsAdModalOpen(true);
  };

  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adForm.title || !adForm.sponsorName || !adForm.ctaUrl) {
      alert("Por favor rellene los campos obligatorios.");
      return;
    }

    const tagsArray = adForm.tagsInput
      ? adForm.tagsInput.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    if (editingAd) {
      onUpdateAdBanner({
        ...editingAd,
        title: adForm.title,
        description: adForm.description,
        image: adForm.image,
        ctaText: adForm.ctaText,
        ctaUrl: adForm.ctaUrl,
        sponsorName: adForm.sponsorName,
        tags: tagsArray,
        type: adForm.type,
        active: adForm.active
      });
    } else {
      onAddAdBanner({
        id: `ad-${Date.now()}`,
        title: adForm.title,
        description: adForm.description,
        image: adForm.image,
        ctaText: adForm.ctaText,
        ctaUrl: adForm.ctaUrl,
        sponsorName: adForm.sponsorName,
        tags: tagsArray,
        type: adForm.type,
        active: adForm.active
      });
    }
    setIsAdModalOpen(false);
  };

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      
      {/* Admin Title Card */}
      <div className="bg-gradient-to-r from-[#2C3E35] to-[#1E293B] text-white rounded-[2rem] p-6 sm:p-8 border border-slate-800/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[1.25rem] bg-[#C87A53] flex items-center justify-center text-white shadow-md shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-medium tracking-tight text-white">Consola de Administración del Portal</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Panel de control para validación, noticias educativas, banners de publicidad, moderación de becas y reportes comunitarios.
            </p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => handleOpenNewsModal()}
            className="px-5 py-2.5 bg-[#C87A53] hover:bg-[#b0653f] text-white font-bold text-xs rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>Redactar Noticia</span>
          </button>
          <button 
            onClick={() => handleOpenAdModal()}
            className="px-5 py-2.5 bg-[#E2B13C] hover:bg-[#cda02a] text-[#1E293B] font-bold text-xs rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#1E293B]" />
            <span>Agregar Banner</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 my-6">
        <button
          id="admin-tab-verifications"
          onClick={() => setActiveTab("verifications")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-4 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "verifications"
              ? "border-[#C87A53] text-[#C87A53] dark:text-[#C87A53]"
              : "border-transparent text-slate-450 hover:text-slate-700"
          }`}
        >
          <Building className="w-4 h-4" />
          Solicitudes ({pendingInstitutions.length})
        </button>
        <button
          id="admin-tab-moderation"
          onClick={() => setActiveTab("moderation")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-4 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "moderation"
              ? "border-[#C87A53] text-[#C87A53] dark:text-[#C87A53]"
              : "border-transparent text-slate-450 hover:text-slate-700"
          }`}
        >
          <Layers className="w-4 h-4" />
          Publicaciones ({opportunities.length})
        </button>
        <button
          id="admin-tab-news"
          onClick={() => setActiveTab("news")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-4 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "news"
              ? "border-[#C87A53] text-[#C87A53] dark:text-[#C87A53]"
              : "border-transparent text-slate-450 hover:text-slate-700"
          }`}
        >
          <Newspaper className="w-4 h-4" />
          Noticias ({newsArticles.length})
        </button>
        <button
          id="admin-tab-ads"
          onClick={() => setActiveTab("ads")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-4 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "ads"
              ? "border-[#C87A53] text-[#C87A53] dark:text-[#C87A53]"
              : "border-transparent text-slate-450 hover:text-slate-700"
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Banners de Publicidad ({adBanners.length})
        </button>
        <button
          id="admin-tab-reports"
          onClick={() => setActiveTab("reports")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-4 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "reports"
              ? "border-[#C87A53] text-[#C87A53] dark:text-[#C87A53]"
              : "border-transparent text-slate-450 hover:text-slate-700"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Reportes ({reports.filter(r => r.status === "Pendiente").length})
        </button>
        <button
          id="admin-tab-ai-curator"
          onClick={() => setActiveTab("ai-curator")}
          className={`pb-3 text-xs font-bold uppercase tracking-wider border-b-2 px-4 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "ai-curator"
              ? "border-[#C87A53] text-[#C87A53] dark:text-[#C87A53]"
              : "border-transparent text-slate-450 hover:text-slate-700"
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C87A53] animate-pulse" />
          Curador de IA ✨
        </button>
      </div>

      {/* Tab Content: Institution Verifications */}
      {activeTab === "verifications" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {pendingInstitutions.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 border border-slate-150 dark:border-slate-800 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">¡Al día! No hay solicitudes de verificación pendientes</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Tanto los usuarios independientes como las instituciones postuladas han sido auditados, autorizados y habilitados para publicar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingInstitutions.map(inst => {
                const isIndividualUser = inst.id.startsWith("inst-usr-") || inst.contactRole === "Organizador Independiente";
                return (
                  <div 
                    key={inst.id} 
                    id={`pending-inst-${inst.id}`}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 dark:border-slate-700/60 p-5 space-y-4 shadow-xs text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          isIndividualUser 
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}>
                          {isIndividualUser ? <User className="w-6 h-6" /> : <Building className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5 flex-wrap">
                            {inst.name}
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${
                              isIndividualUser 
                                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" 
                                : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                            }`}>
                              {isIndividualUser ? "Usuario Independiente" : "Institución"}
                            </span>
                          </h4>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 font-bold px-2 py-0.5 rounded-full block w-max mt-1">
                            {isIndividualUser ? "RUT/Cédula" : "RUT"}: {inst.rut}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        Pendiente
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-700/40">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">
                          {isIndividualUser ? "Usuario Solicitante" : "Funcionario Postulante"}
                        </span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{inst.contactName}</span>
                        <span className="text-[10px] text-slate-500 block">{inst.contactRole}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Correo Oficial</span>
                        <a href={`mailto:${inst.email}`} className="text-blue-600 dark:text-blue-400 hover:underline block truncate">{inst.email}</a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">
                          {isIndividualUser ? "Descripción" : "Sitio Web Oficial"}
                        </span>
                        {isIndividualUser ? (
                          <span className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 block" title={inst.description}>
                            {inst.description}
                          </span>
                        ) : (
                          <a href={inst.website} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate block">
                            {inst.website}
                          </a>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Documento de Respaldo</span>
                        <button
                          onClick={() => setViewDocName(inst.documentName || "Decreto_Nombramiento.pdf")}
                          className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span>Ver Documento</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/40 flex items-center justify-end gap-2.5">
                      {rejectConfirmId === inst.id ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-1 duration-150">
                          <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">¿Rechazar solicitud?</span>
                          <button
                            onClick={() => {
                              onRejectInstitution(inst.id);
                              setRejectConfirmId(null);
                            }}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-all shadow-xs"
                          >
                            Sí, rechazar
                          </button>
                          <button
                            onClick={() => setRejectConfirmId(null)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-extrabold text-xs rounded-xl cursor-pointer transition-all"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => setRejectConfirmId(inst.id)}
                            className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            Rechazar
                          </button>
                          <button
                            onClick={() => onApproveInstitution(inst.id)}
                            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            <span>Verificar & Autorizar</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Moderation */}
      {activeTab === "moderation" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 overflow-hidden shadow-xs animate-in fade-in duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                  <th className="py-3.5 px-5">Oportunidad</th>
                  <th className="py-3.5 px-5">Institución</th>
                  <th className="py-3.5 px-5">Coste</th>
                  <th className="py-3.5 px-5">Moderar Destacado</th>
                  <th className="py-3.5 px-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {opportunities.map(opp => (
                  <tr key={opp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img src={opp.imageUrl} className="w-9 h-9 object-cover rounded-lg shrink-0" alt="img" />
                        <div>
                          <span className="font-bold text-slate-800 dark:text-white block">{opp.title}</span>
                          <span className="text-[10px] text-slate-400 block">{opp.region}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300 font-medium">
                      {opp.institutionName}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                        opp.cost === "Gratuito" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400"
                      }`}>
                        {opp.cost}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <button
                        onClick={() => onToggleFeatureOpportunity(opp.id)}
                        className={`text-[10px] font-extrabold px-3 py-1 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                          opp.isFeatured
                            ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900 shadow-xs"
                            : "bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:text-amber-600"
                        }`}
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${opp.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                        <span>{opp.isFeatured ? "★ Destacado" : "Destacar"}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {deleteConfirmId === opp.id ? (
                        <div className="flex items-center justify-end gap-1.5 animate-in fade-in slide-in-from-right-1 duration-150">
                          <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider mr-1">¿Eliminar?</span>
                          <button
                            onClick={() => {
                              onDeleteOpportunity(opp.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-lg text-[10px] cursor-pointer shadow-xs transition-all"
                          >
                            Sí
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-black rounded-lg text-[10px] cursor-pointer transition-all"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(opp.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-600 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar Publicación"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: NEWS MANAGEMENT */}
      {activeTab === "news" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
            <span className="text-xs text-slate-500 font-bold">Puedes redactar, editar y eliminar noticias de relevancia estatal que apoyan la alfabetización.</span>
            <button 
              onClick={() => handleOpenNewsModal()}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Redactar Noticia</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {newsArticles.map(art => (
              <div 
                key={art.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all text-left"
              >
                <div>
                  <div className="h-40 relative bg-slate-900">
                    <img src={art.imageUrl} className="w-full h-full object-cover opacity-90" alt="news" />
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                      {art.category}
                    </span>
                    {art.tag && (
                      <span className="absolute top-3 right-3 bg-amber-500 text-slate-900 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                        {art.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>{art.author}</span>
                      <span>{art.publishDate}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex justify-end gap-2 shrink-0">
                  {deleteNewsConfirmId === art.id ? (
                    <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-1 duration-150">
                      <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider mr-1">¿Eliminar?</span>
                      <button
                        onClick={() => {
                          onDeleteNewsArticle(art.id);
                          setDeleteNewsConfirmId(null);
                        }}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-lg text-xs cursor-pointer shadow-xs transition-all"
                      >
                        Sí
                      </button>
                      <button
                        onClick={() => setDeleteNewsConfirmId(null)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-black rounded-lg text-xs cursor-pointer transition-all"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleOpenNewsModal(art)}
                        className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 rounded-lg transition-colors flex items-center gap-1 text-xs font-black cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button 
                        onClick={() => setDeleteNewsConfirmId(art.id)}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 rounded-lg transition-colors flex items-center gap-1 text-xs font-black cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: AD BANNERS MANAGEMENT */}
      {activeTab === "ads" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
            <span className="text-xs text-slate-500 font-bold">Crea y controla los banners publicitarios que financian el ecosistema educativo. Soporta formatos horizontal, tarjeta y barra lateral.</span>
            <button 
              onClick={() => handleOpenAdModal()}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Agregar Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {adBanners.map(banner => (
              <div 
                key={banner.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all text-left"
              >
                <div>
                  <div className="h-36 relative bg-slate-900">
                    <img src={banner.image} className="w-full h-full object-cover opacity-90" alt="ad" />
                    <span className="absolute top-3 left-3 bg-amber-500 text-slate-900 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                      Sponsor: {banner.sponsorName}
                    </span>
                    <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full border border-white/20">
                      {banner.type}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {banner.ctaText}
                      </span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        banner.active ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-850 dark:text-slate-400"
                      }`}>
                        {banner.active ? "Activo" : "Pausado"}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1 leading-snug">
                      {banner.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {banner.description}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {banner.tags?.map(t => (
                        <span key={t} className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between shrink-0">
                  <button 
                    onClick={() => onToggleAdActive(banner.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-350 font-bold cursor-pointer"
                  >
                    {banner.active ? (
                      <ToggleRight className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-slate-400" />
                    )}
                    <span>{banner.active ? "Desactivar" : "Activar"}</span>
                  </button>

                  <div className="flex gap-1">
                    {deleteAdConfirmId === banner.id ? (
                      <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-1 duration-150">
                        <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider mr-1">¿Eliminar?</span>
                        <button
                          onClick={() => {
                            onDeleteAdBanner(banner.id);
                            setDeleteAdConfirmId(null);
                          }}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-lg text-[10px] cursor-pointer shadow-xs transition-all"
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => setDeleteAdConfirmId(null)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 font-black rounded-lg text-[10px] cursor-pointer transition-all"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleOpenAdModal(banner)}
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-black cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button 
                          onClick={() => setDeleteAdConfirmId(banner.id)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-black cursor-pointer"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Reports */}
      {activeTab === "reports" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(rep => (
              <div key={rep.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 p-5 space-y-3.5 shadow-xs text-left">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                      Motivo: {rep.reason}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white pt-1">{rep.opportunityTitle}</h4>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded ${
                    rep.status === "Pendiente" ? "bg-amber-100 text-amber-800 animate-pulse" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {rep.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100">
                  {rep.details}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t pt-3">
                  <span>Reportado por: <strong>{rep.reporterEmail}</strong></span>
                  <span className="text-[10px] text-slate-400 font-medium">Fecha: {rep.date}</span>
                </div>

                {rep.status === "Pendiente" && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => resolveReport(rep.id)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolver Alerta</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: AI Curator */}
      {activeTab === "ai-curator" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Ambient Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 text-left">
                <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Motor de Inteligencia Artificial</span>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-black tracking-tight">Curador de Convocatorias Nacionales</h3>
                <p className="text-sm text-slate-400 max-w-2xl">
                  Procesa textos, publicaciones de Instagram, afiches o datos en bruto de internet. 
                  Nuestra Inteligencia Artificial clasificará, evaluará la relevancia y estructurará el contenido automáticamente para su aprobación inmediata.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Input Side */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-150 dark:border-slate-800 space-y-4 text-left shadow-xs">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <AlignLeft className="w-4 h-4 text-indigo-500" />
                  <span>Datos, Enlaces o Afiche en Bruto</span>
                </label>
                <p className="text-[11px] text-slate-400">
                  Pega el texto de un afiche, correos de prensa, hilos de redes sociales o la URL de la publicación del evento escolar.
                </p>
              </div>

              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ejemplo: '¡Atención colegios! Este 25 de Octubre la Universidad de Santiago realizará el Taller de Robótica Educativa para estudiantes de enseñanza media en el campus central de Estación Central. Gratuito e incluye almuerzo. Inscripciones en www.usach.cl/robotica...'"
                rows={10}
                className="w-full text-sm bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 font-sans leading-relaxed text-slate-700 dark:text-slate-300 resize-y"
              />

              <button
                type="button"
                onClick={handleCrateAi}
                disabled={isAiLoading || !aiInput.trim()}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-100 disabled:dark:bg-slate-900 disabled:text-slate-400 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Procesando con Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-350 animate-bounce" />
                    <span>Iniciar Extracción de IA</span>
                  </>
                )}
              </button>

              {/* Step Logs for loading */}
              {isAiLoading && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase text-rose-500 block">Proceso de Curación en Vivo:</span>
                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${aiStep >= 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                      <span className={aiStep === 0 ? "font-bold text-slate-700 dark:text-slate-300" : ""}>Conectando con el motor de IA de Convocatorias Escolares...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${aiStep >= 1 ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                      <span className={aiStep === 1 ? "font-bold text-slate-700 dark:text-slate-300" : ""}>Analizando la relevancia del evento o publicación chilena...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${aiStep >= 2 ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                      <span className={aiStep === 2 ? "font-bold text-slate-700 dark:text-slate-300" : ""}>Estructurando y categorizando según las directrices oficiales...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${aiStep >= 3 ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                      <span className={aiStep === 3 ? "font-bold text-slate-700 dark:text-slate-300" : ""}>Completando campos obligatorios, URLs, imágenes y descripciones...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${aiStep >= 4 ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                      <span className={aiStep === 4 ? "font-bold text-slate-700 dark:text-slate-300" : ""}>Generando bloque JSON final compatible con la base de datos...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Output Side */}
            <div className="lg:col-span-7">
              {aiError && (
                <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 rounded-3xl p-6 border border-rose-150 dark:border-rose-900/40 text-left space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <h4 className="font-bold text-sm">Error en el procesamiento</h4>
                  </div>
                  <p className="text-xs">{aiError}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Asegúrate de que la clave de API GEMINI_API_KEY esté correctamente configurada en la pestaña Secrets y vuelve a intentarlo.
                  </p>
                </div>
              )}

              {!isAiLoading && !aiResult && !aiError && (
                <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-250 dark:border-slate-850 rounded-3xl p-12 text-center space-y-3">
                  <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400">Panel de Resultados Listo</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Ingresa los datos crudos en la izquierda y presiona procesar para ver la magia de la curación inteligente aquí.
                  </p>
                </div>
              )}

              {aiResult && aiResult.status === "descartado" && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-150 dark:border-amber-900/40 text-amber-900 dark:text-amber-400 rounded-3xl p-6 text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <X className="w-5 h-5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 p-1 rounded-full shrink-0" />
                    <h4 className="font-bold text-sm">Publicación Descartada por Relevancia</h4>
                  </div>
                  <p className="text-xs leading-relaxed">
                    De acuerdo a las reglas estipuladas, la Inteligencia Artificial determinó que este contenido es un 
                    <strong> saludo general, publicidad vacía, spam o un evento ya vencido</strong>, por lo que no es relevante 
                    para el catálogo nacional de Convocatorias Escolares.
                  </p>
                  <div className="bg-amber-100/50 dark:bg-amber-950/40 p-3.5 rounded-2xl text-[11px] font-mono whitespace-pre-wrap leading-tight text-slate-600 dark:text-slate-300">
                    {JSON.stringify(aiResult, null, 2)}
                  </div>
                </div>
              )}

              {aiResult && aiResult.status === "aprobado" && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-150 dark:border-slate-850 p-6 shadow-md text-left space-y-6">
                  <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-0.5 rounded-full">
                        ✔ Extraído con Éxito
                      </span>
                      <h4 className="text-base font-display font-black text-slate-800 dark:text-white pt-1">Verificación y Edición de la Convocatoria</h4>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">Verificado: No</span>
                  </div>

                  {/* Form for manual refinements before saving */}
                  <form onSubmit={handlePublishCurated} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nombre de la Convocatoria</label>
                        <input
                          type="text"
                          value={curatedForm.name}
                          onChange={(e) => setCuratedForm({ ...curatedForm, name: e.target.value })}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-white"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categoría / Tipo de Entidad</label>
                        <select
                          value={curatedForm.type}
                          onChange={(e) => setCuratedForm({ ...curatedForm, type: e.target.value })}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-white"
                        >
                          <option value="Colegio">Colegio</option>
                          <option value="Universidad">Universidad</option>
                          <option value="Instituto">Instituto</option>
                          <option value="Liceo">Liceo</option>
                          <option value="Museo">Museo</option>
                          <option value="Fundación">Fundación</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Público Objetivo</label>
                        <select
                          value={curatedForm.publico_objetivo}
                          onChange={(e) => setCuratedForm({ ...curatedForm, publico_objetivo: e.target.value })}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-white"
                        >
                          <option value="Escolares">Escolares</option>
                          <option value="Docentes">Docentes</option>
                          <option value="Ambos">Ambos (Escolares y Docentes)</option>
                        </select>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enlace de la Convocatoria / Red Social</label>
                        <input
                          type="url"
                          value={curatedForm.website}
                          onChange={(e) => setCuratedForm({ ...curatedForm, website: e.target.value })}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Descripción Corta Curada (Máx 2 líneas)</label>
                        <textarea
                          value={curatedForm.description}
                          onChange={(e) => setCuratedForm({ ...curatedForm, description: e.target.value })}
                          rows={2}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-white"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Región del Evento</label>
                        <input
                          type="text"
                          value={curatedForm.region}
                          onChange={(e) => setCuratedForm({ ...curatedForm, region: e.target.value })}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Comuna del Evento</label>
                        <input
                          type="text"
                          value={curatedForm.comuna}
                          onChange={(e) => setCuratedForm({ ...curatedForm, comuna: e.target.value })}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Modalidad</label>
                        <select
                          value={curatedForm.modality}
                          onChange={(e) => setCuratedForm({ ...curatedForm, modality: e.target.value as Modality })}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-white"
                        >
                          <option value={Modality.Presencial}>Presencial</option>
                          <option value={Modality.Online}>Online</option>
                          <option value={Modality.Hibrida}>Híbrida</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Costo</label>
                        <select
                          value={curatedForm.cost}
                          onChange={(e) => setCuratedForm({ ...curatedForm, cost: e.target.value as CostType })}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-white"
                        >
                          <option value={CostType.Gratuito}>Gratuito</option>
                          <option value={CostType.Pagado}>Pagado</option>
                        </select>
                      </div>

                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enlace del Logo / Imagen de la Institución</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={curatedForm.logo}
                            onChange={(e) => setCuratedForm({ ...curatedForm, logo: e.target.value })}
                            className="flex-1 text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
                          />
                          {curatedForm.logo && (
                            <img
                              src={curatedForm.logo}
                              alt="Logo Preview"
                              className="w-11 h-11 rounded-lg border object-cover shrink-0"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&q=80";
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setAiResult(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Descartar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Aprobar y Publicar en Convocatorias Chile 🚀</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NEWS EDITOR MODAL */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-150 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <h3 className="font-display font-black text-base text-slate-800 dark:text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-blue-600" />
                <span>{editingNews ? "Editar Noticia Estatal" : "Redactar Nueva Noticia Estatal"}</span>
              </h3>
              <button 
                onClick={() => setIsNewsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSaveNews} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Título de la Noticia *</label>
                  <input 
                    type="text" 
                    value={newsForm.title} 
                    onChange={e => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600 font-medium"
                    placeholder="Escriba un título descriptivo y claro"
                    required
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Copete o Excerpt Breve *</label>
                  <input 
                    type="text" 
                    value={newsForm.excerpt} 
                    onChange={e => setNewsForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600 font-medium"
                    placeholder="Descripción resumida para el listado de noticias"
                    required
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Contenido Completo (Markdown Soportado) *</label>
                  <textarea 
                    value={newsForm.content} 
                    onChange={e => setNewsForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={7}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600 font-medium leading-relaxed"
                    placeholder="Escriba todo el desarrollo educativo..."
                    required
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">URL de Imagen Principal *</label>
                  <input 
                    type="url" 
                    value={newsForm.imageUrl} 
                    onChange={e => setNewsForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600 font-mono"
                    required
                  />
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    <span className="text-[10px] text-slate-400 flex items-center font-bold">Sugeridos:</span>
                    {NEWS_IMAGE_PRESETS.map(preset => (
                      <button 
                        key={preset.name}
                        type="button"
                        onClick={() => setNewsForm(prev => ({ ...prev, imageUrl: preset.url }))}
                        className={`text-[9px] font-bold px-2 py-1 rounded border transition-all ${
                          newsForm.imageUrl === preset.url 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Categoría</label>
                  <input 
                    type="text" 
                    value={newsForm.category} 
                    onChange={e => setNewsForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Etiqueta de Emergencia (ej. Importante)</label>
                  <input 
                    type="text" 
                    value={newsForm.tag} 
                    onChange={e => setNewsForm(prev => ({ ...prev, tag: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600 font-bold text-amber-600"
                    placeholder="Opcional"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Autor</label>
                  <input 
                    type="text" 
                    value={newsForm.author} 
                    onChange={e => setNewsForm(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fuente (ej. Ministerio)</label>
                  <input 
                    type="text" 
                    value={newsForm.source} 
                    onChange={e => setNewsForm(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tiempo Estimado Lectura</label>
                  <input 
                    type="text" 
                    value={newsForm.readingTime} 
                    onChange={e => setNewsForm(prev => ({ ...prev, readingTime: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2 shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl"
                >
                  {editingNews ? "Guardar Cambios" : "Publicar Noticia"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AD BANNER EDITOR MODAL */}
      {isAdModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-150 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <h3 className="font-display font-black text-base text-slate-800 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" />
                <span>{editingAd ? "Editar Banner de Publicidad" : "Agregar Nuevo Banner Publicitario"}</span>
              </h3>
              <button 
                onClick={() => setIsAdModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleSaveAd} className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Patrocinador / Sponsor *</label>
                  <input 
                    type="text" 
                    value={adForm.sponsorName} 
                    onChange={e => setAdForm(prev => ({ ...prev, sponsorName: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600 font-bold"
                    placeholder="ej. Duolingo Chile"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tipo de Ubicación *</label>
                  <select 
                    value={adForm.type} 
                    onChange={e => setAdForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-blue-600 font-bold"
                  >
                    <option value="horizontal">Horizontal (Banners del Home)</option>
                    <option value="card">Tarjeta (Bento o Rejilla)</option>
                    <option value="sidebar">Barra Lateral (Detalle de Oportunidad)</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Título del Anuncio *</label>
                  <input 
                    type="text" 
                    value={adForm.title} 
                    onChange={e => setAdForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600 font-medium"
                    placeholder="ej. ¡Inscríbete hoy en el diplomado!"
                    required
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Descripción Corta</label>
                  <textarea 
                    value={adForm.description} 
                    onChange={e => setAdForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600"
                    placeholder="Descripción promocional breve..."
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">URL de la Imagen publicitaria *</label>
                  <input 
                    type="url" 
                    value={adForm.image} 
                    onChange={e => setAdForm(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600 font-mono"
                    required
                  />
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    <span className="text-[10px] text-slate-400 flex items-center font-bold">Sugeridos:</span>
                    {AD_IMAGE_PRESETS.map(preset => (
                      <button 
                        key={preset.name}
                        type="button"
                        onClick={() => setAdForm(prev => ({ ...prev, image: preset.url }))}
                        className={`text-[9px] font-bold px-2 py-1 rounded border transition-all ${
                          adForm.image === preset.url 
                            ? "bg-amber-500 text-slate-950 border-amber-500" 
                            : "bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Texto del Botón CTA</label>
                  <input 
                    type="text" 
                    value={adForm.ctaText} 
                    onChange={e => setAdForm(prev => ({ ...prev, ctaText: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600 font-bold"
                    placeholder="ej. Postular Aquí"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">URL de Destino CTA *</label>
                  <input 
                    type="url" 
                    value={adForm.ctaUrl} 
                    onChange={e => setAdForm(prev => ({ ...prev, ctaUrl: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600 font-mono"
                    placeholder="https://..."
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Etiquetas (Separadas por coma)</label>
                  <input 
                    type="text" 
                    value={adForm.tagsInput} 
                    onChange={e => setAdForm(prev => ({ ...prev, tagsInput: e.target.value }))}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-800 dark:text-white focus:outline-blue-600"
                    placeholder="ej. Tecnología, Robótica, Idiomas"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-6.5">
                  <input 
                    id="checkbox-ad-active"
                    type="checkbox" 
                    checked={adForm.active} 
                    onChange={e => setAdForm(prev => ({ ...prev, active: e.target.checked }))}
                    className="w-4.5 h-4.5 text-blue-600 bg-gray-100 border-gray-350 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="checkbox-ad-active" className="text-xs font-black text-slate-700 dark:text-slate-350 select-none cursor-pointer">
                    Activar este anuncio de forma inmediata
                  </label>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2 shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsAdModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl"
                >
                  {editingAd ? "Guardar Cambios" : "Guardar Ad Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Institutional validation Document modal mockup */}
      {viewDocName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b dark:border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                Auditoría de Documento Pertenencia
              </h4>
              <button onClick={() => setViewDocName(null)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">{viewDocName}</span>
                <span className="text-[10px] text-slate-400 block">PDF (Firmado Digitalmente) • 2.45 MB</span>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] rounded-lg border border-emerald-200 dark:border-emerald-900/40 inline-block">
                ✔ Firma del Representante Legal Validada por FirmaGob
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              Este documento acredita formalmente la vigencia legal de la corporación/universidad y certifica el nombramiento del funcionario como responsable autorizado para la publicación de contenidos.
            </p>

            <div className="flex justify-end pt-2 border-t dark:border-slate-800">
              <button
                onClick={() => setViewDocName(null)}
                className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs rounded-xl"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
