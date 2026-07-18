import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Institution, Opportunity, EventReview, Role, CostType 
} from "../types";
import { CATEGORIES } from "../data";
import { 
  Star, Share2, Edit3, Save, X, Plus, Calendar, MapPin, 
  ChevronRight, ThumbsUp, MessageSquare, Award, Briefcase, Globe, Mail, Phone, ExternalLink, CheckCircle2,
  UserPlus, UserMinus, Users, Upload
} from "lucide-react";

interface ProfilePanelProps {
  profileId: string;
  profileType: "user" | "institution";
  currentUser: User;
  institutions: Institution[];
  opportunities: Opportunity[];
  reviews: EventReview[];
  onAddReview: (review: EventReview) => void;
  onUpdateInstitution: (updated: Institution) => void;
  onUpdateUser: (updated: User) => void;
  onViewOpportunity: (opp: Opportunity) => void;
  onClose: () => void;
  users?: User[];
  onFollowToggle?: (targetId: string, type: "user" | "institution") => void;
  onViewProfile?: (id: string, type: "user" | "institution") => void;
  onVerifyUser?: (updatedUser: User, newInstitution: Institution) => void;
  onNavigate?: (view: string) => void;
  onEditOpportunity?: (opp: Opportunity) => void;
}

export default function ProfilePanel({
  profileId,
  profileType,
  currentUser,
  institutions,
  opportunities,
  reviews,
  onAddReview,
  onUpdateInstitution,
  onUpdateUser,
  onViewOpportunity,
  onClose,
  users = [],
  onFollowToggle,
  onViewProfile,
  onVerifyUser,
  onNavigate,
  onEditOpportunity
}: ProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [contactsTab, setContactsTab] = useState<'following' | 'followers'>('following');

  // Click state for Quick Access Navigation sections
  const [activeSection, setActiveSection] = useState<'intereses' | 'red' | 'evaluaciones' | null>(null);

  const handleToggleSection = (sec: 'intereses' | 'red' | 'evaluaciones') => {
    setActiveSection(prev => prev === sec ? null : sec);
  };

  // States for Editing
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editOccupation, setEditOccupation] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editWebsite, setEditWebsite] = useState("");

  // Verification form states
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [verifyName, setVerifyName] = useState("");
  const [verifyRut, setVerifyRut] = useState("");
  const [verifyPhone, setVerifyPhone] = useState("");
  const [verifyOccupation, setVerifyOccupation] = useState("");
  const [verifyDescription, setVerifyDescription] = useState("");
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifyFileError, setVerifyFileError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAvatarDragOver, setIsAvatarDragOver] = useState(false);

  const handleAvatarFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido (PNG, JPG, SVG, WebP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setEditAvatar(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // State for Review Form
  const [selectedReviewOppId, setSelectedReviewOppId] = useState<string | null>(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  // Find targeted profile data
  const isInstitution = profileType === "institution";
  
  let targetInstitution: Institution | undefined;
  let targetUser: User | undefined;

  if (isInstitution) {
    targetInstitution = institutions.find(i => i.id === profileId);
  } else {
    // If it's the currentUser themselves or another user
    if (currentUser.id === profileId) {
      targetUser = currentUser;
    } else {
      targetUser = users.find(u => u.id === profileId);
      if (!targetUser) {
        // Create a fallback user model
        targetUser = {
          id: profileId,
          name: profileId === "user-sim-demo" ? "Eduardo N.B." : "Usuario Registrado",
          email: "eduardo@ejemplo.cl",
          role: Role.Registered,
          savedFavorites: [],
          subscribedCategories: [],
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80",
          description: "Estudiante de ingeniería apasionado por la tecnología, la música y la innovación social. Participo activamente en talleres locales.",
          occupation: "Estudiante Universitario",
          followedUsers: [],
          followedInstitutions: []
        };
      }
    }
  }

  // Get name, logo, occupation, etc. safely
  const profileName = isInstitution ? (targetInstitution?.name || "") : (targetUser?.name || "");
  const profileAvatar = isInstitution 
    ? (targetInstitution?.logo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&q=80") 
    : (targetUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80");
  
  const profileDescription = isInstitution 
    ? (targetInstitution?.description || "Sin descripción proporcionada.") 
    : (targetUser?.description || "Sin biografía o descripción.");
  
  const profileOccupation = isInstitution 
    ? (targetInstitution?.occupation || "Sector Institucional") 
    : (targetUser?.occupation || "Ocupación No Definida");

  // Filter opportunities published/associated
  const profileOpportunities = isInstitution 
    ? opportunities.filter(o => o.institutionId === profileId)
    : []; // For regular users, they don't publish opportunities

  // Favorite opportunities for regular user (afiches)
  const favoriteOpps = opportunities.filter(opp => targetUser?.savedFavorites?.includes(opp.id));

  // Total publications count (favorited count for registered users, publication count for institutions)
  const publicationsCount = isInstitution ? profileOpportunities.length : favoriteOpps.length;

  // Check permission to edit
  const canEdit = isInstitution 
    ? (currentUser.institutionId === profileId && (currentUser.role === Role.InstitutionalVerified || currentUser.role === Role.InstitutionalPending))
    : (currentUser.id === profileId);

  // Initialize edit form values
  const startEditing = () => {
    if (isInstitution && targetInstitution) {
      setEditName(targetInstitution.name);
      setEditDescription(targetInstitution.description);
      setEditOccupation(targetInstitution.occupation || "Educación Superior");
      setEditAvatar(targetInstitution.logo);
      setEditPhone(targetInstitution.phone || "");
      setEditWebsite(targetInstitution.website || "");
    } else if (targetUser) {
      setEditName(targetUser.name);
      setEditDescription(targetUser.description || "");
      setEditOccupation(targetUser.occupation || "");
      setEditAvatar(targetUser.avatar || "");
    }
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    if (isInstitution && targetInstitution) {
      const updated: Institution = {
        ...targetInstitution,
        name: editName,
        description: editDescription,
        occupation: editOccupation,
        logo: editAvatar,
        phone: editPhone,
        website: editWebsite
      };
      onUpdateInstitution(updated);
    } else if (targetUser) {
      const updated: User = {
        ...targetUser,
        name: editName,
        description: editDescription,
        occupation: editOccupation,
        avatar: editAvatar
      };
      onUpdateUser(updated);
    }
    setIsEditing(false);
  };

  // Add Comment/Review for an event
  const handleSubmitReview = (oppId: string, oppTitle: string) => {
    if (!newComment.trim()) return;
    
    const newReview: EventReview = {
      id: "rev-" + Date.now(),
      opportunityId: oppId,
      opportunityTitle: oppTitle,
      reviewerName: currentUser.role === Role.Visitor ? "Anónimo" : currentUser.name,
      reviewerAvatar: currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80",
      rating: newRating,
      comment: newComment,
      createdAt: "Reciente"
    };

    onAddReview(newReview);
    setNewComment("");
    setSelectedReviewOppId(null);
  };

  // Handle Share Profile
  const handleShare = () => {
    const url = `${window.location.origin}/?profile=${profileType}-${profileId}`;
    navigator.clipboard.writeText(url).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    });
  };

  // Verification handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setVerifyFileError("El archivo no debe superar los 5MB");
        setVerifyFile(null);
      } else {
        setVerifyFileError("");
        setVerifyFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setVerifyFileError("El archivo no debe superar los 5MB");
        setVerifyFile(null);
      } else {
        setVerifyFileError("");
        setVerifyFile(file);
      }
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyName || !verifyRut || !onVerifyUser) return;

    const instId = "inst-usr-" + currentUser.id;
    const newInstitution: Institution = {
      id: instId,
      name: verifyName,
      rut: verifyRut,
      website: "",
      email: currentUser.email,
      contactName: currentUser.name,
      contactRole: "Organizador Independiente",
      verified: false, // Requires authorization and verification by the administrator
      logo: currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80",
      description: verifyDescription || "Organizador independiente.",
      phone: verifyPhone,
      socials: {},
      documentName: verifyFile ? verifyFile.name : "Verificacion_Identidad_RUT.pdf"
    };

    const updatedUser: User = {
      ...currentUser,
      role: Role.InstitutionalPending, // Set to pending until admin approves
      institutionId: instId,
      description: verifyDescription || currentUser.description,
      occupation: verifyOccupation || currentUser.occupation
    };

    onVerifyUser(updatedUser, newInstitution);
    setShowVerifyForm(false);
  };

  // Calculate Average Rating of an Event
  const getEventAverageRating = (oppId: string) => {
    const eventReviews = reviews.filter(r => r.opportunityId === oppId);
    if (eventReviews.length === 0) return 0;
    const sum = eventReviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / eventReviews.length).toFixed(1));
  };

  // Followers & Following calculations
  const isFollowing = isInstitution
    ? currentUser.followedInstitutions?.includes(profileId)
    : currentUser.followedUsers?.includes(profileId);

  // Followers of this profile
  const profileFollowers = users.filter(u => {
    if (isInstitution) {
      return u.followedInstitutions?.includes(profileId);
    } else {
      return u.followedUsers?.includes(profileId);
    }
  });
  const followersCount = profileFollowers.length;

  // Following list and count
  let followingCount = 0;
  let followedInstitutionsList: Institution[] = [];
  let followedUsersList: User[] = [];

  const targetUserObj = currentUser.id === profileId ? currentUser : users.find(u => u.id === profileId);
  if (!isInstitution && targetUserObj) {
    const followedInstsIds = targetUserObj.followedInstitutions || [];
    const followedUsersIds = targetUserObj.followedUsers || [];

    followedInstitutionsList = institutions.filter(i => followedInstsIds.includes(i.id));
    followedUsersList = users.filter(u => followedUsersIds.includes(u.id));
    followingCount = followedInstitutionsList.length + followedUsersList.length;
  }

  // Get reviewer user ID by name
  const getReviewerUserId = (name: string) => {
    if (name === "Matias Alarcon") return "user-matias";
    if (name === "Carolina Silva") return "user-carolina";
    if (name === "Felipe Soto") return "user-felipe";
    if (name === "Eduardo N.B." || name === "Eduardo") return "user-sim-demo";
    // Check in users list
    const found = users.find(u => u.name.toLowerCase() === name.toLowerCase());
    return found ? found.id : null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      
      {/* Toast notification for sharing */}
      {showShareToast && (
        <div className="fixed bottom-24 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>¡Enlace de perfil copiado al portapapeles!</span>
        </div>
      )}

      {/* Back button */}
      <button 
        onClick={onClose}
        className="mb-6 inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
        Volver al Inicio
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 shadow-xs overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 relative" />
        
        <div className="p-4 sm:p-8 pt-0 relative flex flex-row gap-4 sm:gap-6 items-center">
          
          {/* Profile Picture (Left Aligned) */}
          <div className="-mt-10 sm:-mt-16 relative shrink-0 z-10">
            <img 
              src={profileAvatar} 
              alt={profileName}
              className="w-16 h-16 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl object-cover border-4 border-white dark:border-slate-900 bg-slate-100 shadow-md animate-in fade-in duration-350"
            />
          </div>

          {/* Profile Basic Info */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {profileName}
              </h1>
              {isInstitution && targetInstitution?.verified && (
                <span className="inline-flex items-center text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-100/50">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-blue-600 fill-blue-500/10" />
                  Verificado
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                {isInstitution ? <Briefcase className="w-3.5 h-3.5 text-blue-500" /> : <Award className="w-3.5 h-3.5 text-indigo-500" />}
                {profileOccupation}
              </span>
              <span>•</span>
              <span className="text-blue-600 dark:text-blue-400">
                {publicationsCount} {isInstitution ? "Convocatorias" : "Publicaciones"}
              </span>
              <span>•</span>
              <span className="text-slate-600 dark:text-slate-300">
                {followersCount} {followersCount === 1 ? "Seguidor" : "Seguidores"}
              </span>
              {!isInstitution && (
                <>
                  <span>•</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    {followingCount} Siguiendo
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {profileDescription}
            </p>

            {/* Institution specific contact details */}
            {isInstitution && targetInstitution && (
              <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                {targetInstitution.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {targetInstitution.email}
                  </span>
                )}
                {targetInstitution.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {targetInstitution.phone}
                  </span>
                )}
                {targetInstitution.website && (
                  <a 
                    href={targetInstitution.website} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-0.5 text-blue-600 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Sitio Web
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Action buttons (Share, Edit) */}
          <div className="flex gap-2 w-full sm:w-auto self-start sm:self-center">
            <button 
              onClick={handleShare}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Compartir
            </button>

            {!canEdit && onFollowToggle && (
              <button 
                onClick={() => onFollowToggle(profileId, isInstitution ? "institution" : "user")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  isFollowing
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="w-3.5 h-3.5" />
                    <span>Siguiendo</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Seguir</span>
                  </>
                )}
              </button>
            )}

            {canEdit && (
              <button 
                onClick={startEditing}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Editar Perfil
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Profile Quick-Access Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-150 dark:border-slate-800 p-2 shadow-xs mb-8 flex flex-col sm:flex-row gap-2 items-center justify-around relative z-30 animate-in fade-in duration-300">
        {[
          { id: 'intereses', label: 'Áreas de Interés', emoji: '⭐', desc: 'Disciplinas y temáticas' },
          { id: 'red', label: 'Red de Contacto', emoji: '👥', desc: 'Seguidores y contactos' },
          { id: 'evaluaciones', label: 'Buzón de Evaluaciones', emoji: '✉️', desc: 'Comentarios y opiniones' }
        ].map((btn) => {
          const isActive = activeSection === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => handleToggleSection(btn.id as any)}
              className={`w-full sm:flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all duration-300 relative overflow-hidden group border ${
                isActive
                  ? "bg-blue-600 text-white shadow-md border-blue-750 -translate-y-1"
                  : "bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
              }`}
            >
              <span className="text-xl group-hover:scale-120 transition-transform duration-200">{btn.emoji}</span>
              <span className="font-display font-black leading-tight">{btn.label}</span>
              <span className={`text-[8px] font-medium lowercase tracking-normal ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                {btn.desc}
              </span>
              <span className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          );
        })}
      </div>

      {/* Floating Preview Card Container with smooth custom motion scaling & spring animation */}
      <AnimatePresence custom={activeSection}>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          >
            {/* Ambient semi-transparent backdrop */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              className="absolute inset-0 bg-slate-950/25 dark:bg-slate-950/45 pointer-events-auto"
              onClick={() => setActiveSection(null)}
            />

            {/* Centered Floating Preview Card */}
            <motion.div
              custom={activeSection}
              variants={{
                hidden: (section: string) => {
                  let xOffset = 0;
                  if (section === 'intereses') xOffset = -150;
                  else if (section === 'red') xOffset = 0;
                  else if (section === 'evaluaciones') xOffset = 150;
                  
                  return {
                    opacity: 0,
                    scale: 0.3,
                    x: xOffset,
                    y: -100,
                    filter: 'blur(10px)',
                  };
                },
                visible: {
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: {
                    type: "spring",
                    damping: 18,
                    stiffness: 110,
                  }
                },
                exit: (section: string) => {
                  let xOffset = 0;
                  if (section === 'intereses') xOffset = -150;
                  else if (section === 'red') xOffset = 0;
                  else if (section === 'evaluaciones') xOffset = 150;
                  
                  return {
                    opacity: 0,
                    scale: 0.3,
                    x: xOffset,
                    y: -100,
                    filter: 'blur(10px)',
                    transition: {
                      duration: 0.2,
                      ease: "easeInOut"
                    }
                  };
                }
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md bg-white dark:bg-slate-900 border-3 border-slate-900 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative pointer-events-auto z-10 overflow-hidden"
              style={{ transformOrigin: "center center" }}
            >
              {/* Top gradient indicator */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              
              <button
                onClick={() => setActiveSection(null)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                title="Cerrar vista previa"
              >
                <X className="w-4 h-4" />
              </button>



              {activeSection === 'intereses' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <h4 className="font-display font-black text-xs uppercase tracking-wider text-slate-800 dark:text-white">
                        {isInstitution ? "Temáticas de Especialidad" : "Áreas de Interés"}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {isInstitution ? "Líneas temáticas de su portafolio de actividades" : "Disciplinas y etiquetas preferidas de recomendación"}
                      </p>
                    </div>
                  </div>

                  <div className="min-h-[120px] flex flex-col justify-between">
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-3 font-medium">
                      {isInstitution 
                        ? "Categorías principales extraídas de las convocatorias publicadas para orientar a la comunidad escolar." 
                        : "Estas áreas personalizan la página de inicio destacando de forma automática las mejores oportunidades para ti."}
                    </p>

                    {!isInstitution ? (
                      <div className="space-y-3">
                        {canEdit && (
                          <p className="text-[9px] text-[#1abcfe] font-black uppercase bg-sky-50 dark:bg-sky-950/40 px-2 py-1 rounded-lg border border-sky-150 dark:border-sky-900/40 text-center">
                            ¡Haz clic en las estrellas para actualizar tus preferencias! ✨
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1.5 p-2 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 max-h-48 overflow-y-auto">
                          {CATEGORIES.map((category) => {
                            const isSelected = targetUser?.subscribedCategories?.includes(category) || false;
                            return (
                              <button
                                type="button"
                                key={category}
                                disabled={!canEdit}
                                onClick={() => {
                                  if (!canEdit || !targetUser) return;
                                  const currentSubs = targetUser.subscribedCategories || [];
                                  const updatedSubs = currentSubs.includes(category)
                                    ? currentSubs.filter(c => c !== category)
                                    : [...currentSubs, category];
                                  
                                  onUpdateUser({
                                    ...targetUser,
                                    subscribedCategories: updatedSubs
                                  });
                                }}
                                className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition-all duration-150 flex items-center gap-1 ${
                                  isSelected
                                    ? "bg-blue-600 text-white border-blue-700 shadow-sm font-black"
                                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                                } ${canEdit ? "cursor-pointer hover:scale-102 active:scale-98" : "cursor-default"}`}
                              >
                                <span>{isSelected ? "★" : "☆"}</span>
                                <span>{category}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 p-2 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 max-h-40 overflow-y-auto">
                        {Array.from(new Set(profileOpportunities.flatMap(o => o.categories || []))).length === 0 ? (
                          <div className="text-center py-4 text-slate-400 text-xs w-full font-medium">No se han registrado categorías aún.</div>
                        ) : (
                          Array.from(new Set(profileOpportunities.flatMap(o => o.categories || []))).map((category) => (
                            <span 
                              key={category} 
                              className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/40 shadow-2xs"
                            >
                              ★ {category}
                            </span>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'red' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                    <span className="text-2xl">👥</span>
                    <div>
                      <h4 className="font-display font-black text-xs uppercase tracking-wider text-slate-800 dark:text-white">
                        Red de Contactos
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Vínculos, seguidores y sinergia escolar de la cuenta
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 min-h-[120px]">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-2xs">
                        <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{followersCount}</p>
                        <p className="text-[8px] text-slate-400 font-extrabold uppercase mt-1">Seguidores</p>
                      </div>
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-slate-150 dark:border-slate-800 shadow-2xs">
                        <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{followingCount}</p>
                        <p className="text-[8px] text-slate-400 font-extrabold uppercase mt-1">Siguiendo</p>
                      </div>
                    </div>

                    {/* Toggle tabs: Siguiendo / Seguidores */}
                    <div className="flex bg-slate-50 dark:bg-slate-850 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
                      <button
                        onClick={() => setContactsTab("following")}
                        className={`flex-1 py-1 text-[9px] font-black uppercase rounded-lg transition-colors cursor-pointer ${
                          contactsTab === "following"
                            ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        }`}
                      >
                        Siguiendo
                      </button>
                      <button
                        onClick={() => setContactsTab("followers")}
                        className={`flex-1 py-1 text-[9px] font-black uppercase rounded-lg transition-colors cursor-pointer ${
                          contactsTab === "followers"
                            ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-xs"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        }`}
                      >
                        Seguidores
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {contactsTab === "following" ? (
                        followedInstitutionsList.length === 0 && followedUsersList.length === 0 ? (
                          <p className="text-[10px] text-slate-400 text-center py-4">No sigue a ningún contacto aún.</p>
                        ) : (
                          <div className="space-y-1">
                            {followedInstitutionsList.map(inst => (
                              <div 
                                key={inst.id}
                                onClick={() => {
                                  onViewProfile && onViewProfile(inst.id, "institution");
                                  setActiveSection(null);
                                }}
                                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer transition-all"
                              >
                                <img 
                                  src={inst.logo || "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80"} 
                                  alt={inst.name}
                                  className="w-7 h-7 rounded-lg object-cover bg-slate-100"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 truncate leading-tight">
                                    {inst.name}
                                  </h4>
                                  <span className="text-[8px] text-slate-400 uppercase tracking-wide font-medium">Institución</span>
                                </div>
                                <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                              </div>
                            ))}

                            {followedUsersList.map(usr => (
                              <div 
                                key={usr.id}
                                onClick={() => {
                                  onViewProfile && onViewProfile(usr.id, "user");
                                  setActiveSection(null);
                                }}
                                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer transition-all"
                              >
                                <img 
                                  src={usr.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80"} 
                                  alt={usr.name}
                                  className="w-7 h-7 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 truncate leading-tight">
                                    {usr.name}
                                  </h4>
                                  <span className="text-[8px] text-slate-400 truncate block font-medium">{usr.occupation || "Usuario"}</span>
                                </div>
                                <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                              </div>
                            ))}
                          </div>
                        )
                      ) : (
                        profileFollowers.length === 0 ? (
                          <p className="text-[10px] text-slate-400 text-center py-4">Aún no tiene seguidores.</p>
                        ) : (
                          <div className="space-y-1">
                            {profileFollowers.map(usr => (
                              <div 
                                key={usr.id}
                                onClick={() => {
                                  onViewProfile && onViewProfile(usr.id, "user");
                                  setActiveSection(null);
                                }}
                                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 cursor-pointer transition-all"
                              >
                                <img 
                                  src={usr.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80"} 
                                  alt={usr.name}
                                  className="w-7 h-7 rounded-full object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 truncate leading-tight">
                                    {usr.name}
                                  </h4>
                                  <span className="text-[8px] text-slate-400 truncate block font-medium">{usr.occupation || "Usuario"}</span>
                                </div>
                                <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'evaluaciones' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                    <span className="text-2xl">✉️</span>
                    <div>
                      <h4 className="font-display font-black text-xs uppercase tracking-wider text-slate-800 dark:text-white">
                        Buzón de Evaluaciones
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {isInstitution ? "Retroalimentación de eventos recibida" : "Valoraciones y opiniones enviadas por el usuario"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 min-h-[120px] max-h-80 overflow-y-auto pr-1">
                    {isInstitution ? (
                      (() => {
                        const instOppIds = profileOpportunities.map(o => o.id);
                        const instReviews = reviews.filter(r => instOppIds.includes(r.opportunityId));
                        const avgInstRating = instReviews.length > 0 
                          ? parseFloat((instReviews.reduce((sum, r) => sum + r.rating, 0) / instReviews.length).toFixed(1))
                          : 0;

                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-2.5 bg-amber-500/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl">
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">Calificación Global:</span>
                              <div className="flex items-center gap-1.5 font-black text-amber-700 dark:text-amber-400 text-xs">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                {avgInstRating > 0 ? `${avgInstRating} / 5.0` : "Sin valoraciones aún"}
                              </div>
                            </div>

                            {profileOpportunities.length === 0 ? (
                              <p className="text-xs text-slate-400 py-6 text-center font-medium">Sin actividades disponibles.</p>
                            ) : (
                              <div className="space-y-3">
                                {profileOpportunities.map(opp => {
                                  const oppReviews = reviews.filter(r => r.opportunityId === opp.id);
                                  const avgRating = getEventAverageRating(opp.id);
                                  const isFormOpen = selectedReviewOppId === opp.id;

                                  return (
                                    <div key={opp.id} className="border border-slate-150 dark:border-slate-800/85 rounded-2xl p-3 bg-slate-50/20 dark:bg-slate-900/10 space-y-3 border-dashed">
                                      <div className="flex justify-between items-start gap-2">
                                        <div className="min-w-0">
                                          <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-200 truncate leading-tight">
                                            {opp.title}
                                          </h4>
                                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                            {opp.cost === CostType.Gratuito ? "Gratuita" : "Pago"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0 bg-amber-50 dark:bg-amber-950/40 border border-amber-100/50 dark:border-amber-900/30 px-1.5 py-0.5 rounded-lg">
                                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                                            {avgRating > 0 ? avgRating : "N/A"}
                                          </span>
                                        </div>
                                      </div>

                                      {/* List of comments */}
                                      <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                                        {oppReviews.length === 0 ? (
                                          <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">No hay evaluaciones todavía para esta actividad.</p>
                                        ) : (
                                          oppReviews.map(rev => (
                                            <div key={rev.id} className="text-[10px] bg-white dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-850 space-y-1">
                                              <div className="flex items-center justify-between font-extrabold text-slate-700 dark:text-slate-300">
                                                <span>{rev.reviewerName}</span>
                                                <span className="text-amber-600 font-bold">{rev.rating} ★</span>
                                              </div>
                                              <p className="text-slate-500 dark:text-slate-400 italic font-medium leading-tight">
                                                "{rev.comment}"
                                              </p>
                                            </div>
                                          ))
                                        )}
                                      </div>

                                      {/* Review form */}
                                      {isFormOpen ? (
                                        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800 space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase text-slate-400">Calificar</span>
                                            <div className="flex gap-0.5">
                                              {[1, 2, 3, 4, 5].map((s) => (
                                                <button 
                                                  key={s}
                                                  onClick={() => setNewRating(s)}
                                                  className="p-0.5 hover:scale-115 transition-transform cursor-pointer"
                                                >
                                                  <Star className={`w-3.5 h-3.5 ${s <= newRating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"}`} />
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                          <textarea 
                                            rows={2}
                                            placeholder="Tu opinión..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="w-full text-[10px] p-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-250 dark:border-slate-800 rounded-lg focus:outline-hidden text-slate-850 dark:text-white"
                                          />
                                          <div className="flex gap-1 justify-end">
                                            <button 
                                              onClick={() => setSelectedReviewOppId(null)}
                                              className="px-2 py-0.5 text-[9px] font-bold border rounded-md"
                                            >
                                              Cancelar
                                            </button>
                                            <button 
                                              onClick={() => handleSubmitReview(opp.id, opp.title)}
                                              className="px-2.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-md"
                                            >
                                              Enviar
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <button 
                                          onClick={() => {
                                            setSelectedReviewOppId(opp.id);
                                            setNewRating(5);
                                            setNewComment("");
                                          }}
                                          className="w-full text-center py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[9px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                                        >
                                          + Evaluar Actividad
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      (() => {
                        const userReviews = reviews.filter(r => r.reviewerName === profileName);
                        return (
                          <div className="space-y-2.5">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total de valoraciones: {userReviews.length}</p>
                            {userReviews.length === 0 ? (
                              <p className="text-[10px] text-slate-400 italic text-center py-4 font-medium">Este usuario no ha enviado evaluaciones todavía.</p>
                            ) : (
                              userReviews.map(r => (
                                <div key={r.id} className="p-2.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800 rounded-xl space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-700 dark:text-slate-300">
                                    <span className="truncate max-w-[150px]">{r.opportunityTitle}</span>
                                    <span className="text-amber-600 font-bold">{r.rating} ★</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 italic leading-snug font-medium">"{r.comment}"</p>
                                </div>
                              ))
                            )}
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
              )}

              {/* Action/Tip Footer in Floating Card */}
              <div className="mt-4 pt-3 border-t border-dashed border-slate-150 dark:border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
                <span className="font-bold uppercase tracking-wider">Detalles Interactivos 🚀</span>
                <span>Haz clic fuera o en la 'X' para cerrar</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editing Form (Overlaid as standard block inside the view) */}
      {isEditing && (
        <div className="bg-slate-50 dark:bg-slate-850 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 mb-8 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-750">
            <h3 className="font-display font-black text-xs uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 rounded-full bg-blue-600" />
              Actualizar Datos de Perfil
            </h3>
            <button 
              onClick={() => setIsEditing(false)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Nombre de Perfil</label>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Ocupación / Sector</label>
              <input 
                type="text" 
                value={editOccupation}
                onChange={(e) => setEditOccupation(e.target.value)}
                className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Foto de Perfil (Avatar / Logo)</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsAvatarDragOver(true);
                  }}
                  onDragLeave={() => setIsAvatarDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsAvatarDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleAvatarFileChange(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                    isAvatarDragOver
                      ? "border-[#1abcfe] bg-[#1abcfe]/5"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  }`}
                  onClick={() => document.getElementById("avatar-file-upload")?.click()}
                >
                  <Upload className="w-5 h-5 text-slate-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Arrastra o selecciona imagen
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
                    PNG, JPG, SVG, WebP
                  </span>
                  <input
                    id="avatar-file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleAvatarFileChange(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                {/* Preview / URL option */}
                <div className="flex flex-col justify-between p-3 border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 rounded-xl space-y-2">
                  <div className="flex items-center gap-3">
                    {editAvatar ? (
                      <img
                        src={editAvatar}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border-2 border-[#1e293b] dark:border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 text-lg">
                        ?
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 block">Vista Previa</span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate block">
                        {editAvatar.startsWith("data:") ? "Imagen cargada localmente" : editAvatar || "Sin imagen"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 block mb-0.5">O introduce una URL:</span>
                    <input 
                      type="text" 
                      placeholder="https://ejemplo.com/foto.jpg"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="w-full text-[10px] px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isInstitution && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Teléfono de Contacto</label>
                  <input 
                    type="text" 
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Sitio Web Oficial</label>
                  <input 
                    type="text" 
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
              </>
            )}

            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">Descripción / Biografía</label>
              <textarea 
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </div>
      )}

      {/* Profile Sections & Content Layout: Centered Poster Board (Pizarra de Afiches) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 p-6 shadow-xs mt-6 mb-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📌</span>
            <div className="text-left">
              <h2 className="font-display font-black text-xs uppercase tracking-wider text-slate-800 dark:text-white leading-tight">
                {isInstitution ? "Pizarra de Eventos Publicados" : "Mi Pizarra de Afiches"}
              </h2>
              <p className="text-[10px] text-slate-400">
                {isInstitution ? "Mis convocatorias publicadas fijadas en la pizarra" : "Afiches de convocatorias guardadas como favoritos"}
              </p>
            </div>
          </div>
          
          <span className="px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/40">
            {isInstitution ? `${profileOpportunities.length} Eventos` : `${favoriteOpps.length} Favoritos`}
          </span>
        </div>

        {isInstitution ? (
          profileOpportunities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3 bg-[#e2f1ff]/10 dark:bg-slate-950/20 border-2 border-dashed border-blue-400/40 rounded-2xl">
              <span className="text-3xl filter drop-shadow-md">📌</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-bold">
                ¡Aún no tienes eventos en tu pizarra! Crea convocatorias en tu panel para verlas publicadas aquí.
              </p>
            </div>
          ) : (
            <div className="bg-[#e2f1ff]/20 dark:bg-slate-950/40 border-3 border-dashed border-blue-400 p-4 sm:p-5 rounded-3xl min-h-[300px] flex justify-center w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
                {profileOpportunities.map((opp, idx) => {
                  const tiltClass = idx % 3 === 0 
                    ? "-rotate-1 hover:rotate-0" 
                    : idx % 3 === 1 
                    ? "rotate-1 hover:rotate-0" 
                    : "rotate-2 hover:rotate-0";

                  return (
                    <div
                      key={opp.id}
                      onClick={() => onViewOpportunity(opp)}
                      className={`relative group bg-white dark:bg-slate-900 p-2.5 border border-[#1e293b] dark:border-slate-800 shadow-[3px_3px_0px_0px_#1e293b] dark:shadow-[3px_3px_0px_0px_#1e293b] rounded-xl hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_#1e293b] transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[220px] ${tiltClass}`}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl z-20 filter drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.3)]">
                        📌
                      </div>

                      <div>
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-[#1e293b] dark:border-slate-800 mb-2">
                          <img
                            src={opp.imageUrl}
                            alt={opp.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1 left-1 bg-[#1abcfe] text-white text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-[#1e293b] shadow-[1px_1px_0px_0px_#1e293b]">
                            {opp.categories && opp.categories[0] ? opp.categories[0] : "Evento"}
                          </span>
                        </div>

                        <div className="space-y-1 text-left">
                          <h4 className="text-[11px] font-black text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {opp.title}
                          </h4>
                          
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                            {opp.briefDescription}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-0.5 pt-1.5 mt-2 border-t border-dashed border-slate-200 dark:border-slate-800 text-[8px] font-bold text-slate-500 dark:text-slate-400 text-left">
                        <span className="flex items-center gap-0.5 truncate">
                          <MapPin className="w-2.5 h-2.5 text-[#f24e1e] shrink-0" />
                          {opp.comuna}
                        </span>
                        <span className="flex items-center gap-0.5 truncate">
                          <Calendar className="w-2.5 h-2.5 text-[#1abcfe] shrink-0" />
                          {opp.eventDate || opp.applicationDeadline}
                        </span>
                      </div>

                      {canEdit && onEditOpportunity && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditOpportunity(opp);
                          }}
                          className="mt-2.5 w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/60 font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer text-[10px] border border-blue-200/50 dark:border-blue-800/40"
                          title="Editar esta convocatoria para corregir errores"
                        >
                          <Edit3 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          <span>Editar Convocatoria</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          favoriteOpps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3 bg-[#ffe3e1]/10 dark:bg-slate-950/20 border-2 border-dashed border-[#ff7262]/40 rounded-2xl">
              <span className="text-3xl filter drop-shadow-md">📌</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-bold">
                ¡Aún no has fijado afiches en tu pizarra! Explora las convocatorias en el inicio y haz clic en el icono de estrella para guardar tus favoritas aquí.
              </p>
            </div>
          ) : (
            <div className="bg-[#ffe3e1]/20 dark:bg-slate-950/40 border-3 border-dashed border-[#ff7262] p-4 sm:p-5 rounded-3xl min-h-[300px] flex justify-center w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
                {favoriteOpps.map((opp, idx) => {
                  const tiltClass = idx % 3 === 0 
                    ? "-rotate-1 hover:rotate-0" 
                    : idx % 3 === 1 
                    ? "rotate-1 hover:rotate-0" 
                    : "rotate-2 hover:rotate-0";

                  return (
                    <div
                      key={opp.id}
                      onClick={() => onViewOpportunity(opp)}
                      className={`relative group bg-white dark:bg-slate-900 p-2.5 border border-[#1e293b] dark:border-slate-800 shadow-[3px_3px_0px_0px_#1e293b] dark:shadow-[3px_3px_0px_0px_#1e293b] rounded-xl hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_#1e293b] transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[220px] ${tiltClass}`}
                    >
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl z-20 filter drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.3)]">
                        📌
                      </div>

                      <div>
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-[#1e293b] dark:border-slate-800 mb-2">
                          <img
                            src={opp.imageUrl}
                            alt={opp.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1 left-1 bg-[#0acf83] text-white text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border border-[#1e293b] shadow-[1px_1px_0px_0px_#1e293b]">
                            {opp.categories[0]}
                          </span>
                        </div>

                        <div className="space-y-1 text-left">
                          <h4 className="text-[11px] font-black text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {opp.title}
                          </h4>
                          
                          <p className="text-[9px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                            {opp.briefDescription}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-0.5 pt-1.5 mt-2 border-t border-dashed border-slate-200 dark:border-slate-800 text-[8px] font-bold text-slate-500 dark:text-slate-400 text-left">
                        <span className="flex items-center gap-0.5 truncate">
                          <MapPin className="w-2.5 h-2.5 text-[#f24e1e] shrink-0" />
                          {opp.comuna}
                        </span>
                        <span className="flex items-center gap-0.5 truncate">
                          <Calendar className="w-2.5 h-2.5 text-[#1abcfe] shrink-0" />
                          {opp.eventDate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}

      </div>

      {/* Verification Banners for Registered Users */}
      {currentUser.role === Role.InstitutionalPending && currentUser.id === profileId && (
        <div id="user-verification-pending-banner" className="mb-8 p-6 bg-amber-50/30 dark:bg-slate-900 border-3 border-[#1e293b] rounded-3xl shadow-[4px_4px_0px_0px_#1e293b] space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500 border-2 border-[#1e293b] rounded-2xl text-white shadow-[2px_2px_0px_0px_#1e293b] shrink-0 animate-pulse">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                ⏳ Solicitud de Verificación en Revisión
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Hemos recibido tus antecedentes y tu solicitud se encuentra actualmente en la <strong>pestaña de solicitudes del panel del administrador</strong> para su correspondiente revisión manual, autenticación y firma.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase bg-amber-100/60 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200">
                <span>Estado: Pendiente de Aprobación por el Administrador 🛡️</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Banners for Registered Users */}
      {currentUser.role === Role.Registered && currentUser.id === profileId && (
        <div id="user-verification-banner" className="mb-8 p-6 bg-amber-50/50 dark:bg-slate-900 border-3 border-[#1e293b] rounded-3xl shadow-[4px_4px_0px_0px_#1e293b] space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#f24e1e] border-2 border-[#1e293b] rounded-2xl text-white shadow-[2px_2px_0px_0px_#1e293b] shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                ✨ ¿Quieres Crear tus Propios Eventos?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                ¡Conviértete en un Organizador Verificado! Solicita tu verificación gratuita para desbloquear el <strong>Panel Publicador</strong> y comenzar a publicar tus propias convocatorias, talleres y actividades de forma directa.
              </p>
            </div>
          </div>
          
          {!showVerifyForm ? (
            <button
              id="start-verification-btn"
              onClick={() => {
                setShowVerifyForm(true);
                setVerifyName(currentUser.name);
                setVerifyDescription(currentUser.description || "");
                setVerifyOccupation(currentUser.occupation || "");
              }}
              className="w-full sm:w-auto py-2.5 px-6 bg-[#0acf83] text-white hover:bg-[#08b874] border-2 border-[#1e293b] text-xs font-black uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_0px_#1e293b] active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_0px_#1e293b] transition-all cursor-pointer"
            >
              Comenzar Verificación de Cuenta
            </button>
          ) : (
            <form id="verification-form" onSubmit={handleVerifySubmit} className="bg-white dark:bg-slate-850 p-5 rounded-2xl border-2 border-[#1e293b] space-y-4 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between border-b-2 border-dashed border-[#1e293b] pb-2">
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Formulario de Verificación de Organizador</span>
                <button 
                  type="button"
                  onClick={() => setShowVerifyForm(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-slate-400">Nombre del Organizador / Entidad *</label>
                  <input
                    type="text"
                    required
                    value={verifyName}
                    onChange={(e) => setVerifyName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border-2 border-[#1e293b] rounded-xl focus:outline-hidden text-slate-900 dark:text-white"
                    placeholder="Ej. Eduardo N.B. / Club de Robótica Coquimbo"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-slate-400">RUT u Identificación Tributaria *</label>
                  <input
                    type="text"
                    required
                    value={verifyRut}
                    onChange={(e) => setVerifyRut(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border-2 border-[#1e293b] rounded-xl focus:outline-hidden text-slate-900 dark:text-white"
                    placeholder="Ej. 12.345.678-9 o RUT Personal"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-slate-400">Teléfono de Contacto</label>
                  <input
                    type="text"
                    value={verifyPhone}
                    onChange={(e) => setVerifyPhone(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border-2 border-[#1e293b] rounded-xl focus:outline-hidden text-slate-900 dark:text-white"
                    placeholder="Ej. +56 9 8765 4321"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black uppercase text-slate-400">Sector o Especialidad</label>
                  <input
                    type="text"
                    value={verifyOccupation}
                    onChange={(e) => setVerifyOccupation(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border-2 border-[#1e293b] rounded-xl focus:outline-hidden text-slate-900 dark:text-white"
                    placeholder="Ej. Ciencias y Tecnología, Arte Local, etc."
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400">Descripción o Justificación de Actividades</label>
                  <textarea
                    rows={2}
                    value={verifyDescription}
                    onChange={(e) => setVerifyDescription(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border-2 border-[#1e293b] rounded-xl focus:outline-hidden text-slate-900 dark:text-white"
                    placeholder="Describe brevemente qué tipo de actividades o eventos quieres publicar..."
                  />
                </div>

                {/* File upload with drag and drop zone */}
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400">
                    Acreditar Identidad o Pertenencia (Documento PDF, PNG o JPG) *
                  </label>
                  <div
                    id="verify-drag-drop-zone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("verify-file-input")?.click()}
                    className={`border-3 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? "border-[#0acf83] bg-[#0acf83]/10"
                        : "border-[#1e293b] bg-slate-50 dark:bg-slate-900 hover:bg-[#ffe3e1]/10"
                    }`}
                  >
                    <input
                      id="verify-file-input"
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 border-2 border-[#1e293b] rounded-xl">
                        <Upload className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                      </div>
                      {verifyFile ? (
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          📄 Archivo seleccionado: <span className="text-[#0acf83]">{verifyFile.name}</span> ({(verifyFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      ) : (
                        <>
                          <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                            Arrastra y suelta tu documento aquí, o <span className="text-blue-600 dark:text-blue-400 underline">haz clic para explorar</span>
                          </p>
                          <p className="text-[10px] text-slate-400">PDF, PNG o JPG de hasta 5MB</p>
                        </>
                      )}
                      {verifyFileError && (
                        <p className="text-xs text-[#f24e1e] font-bold mt-1">{verifyFileError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t-2 border-dashed border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setShowVerifyForm(false)}
                  className="px-4 py-2 border-2 border-[#1e293b] rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-black uppercase text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!verifyName || !verifyRut || !verifyFile}
                  className={`px-5 py-2 text-white border-2 border-[#1e293b] text-xs font-black uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_0px_#1e293b] active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_0px_#1e293b] transition-all cursor-pointer ${
                    (!verifyName || !verifyRut || !verifyFile)
                      ? "bg-slate-300 text-slate-500 border-slate-300 cursor-not-allowed shadow-none"
                      : "bg-[#0acf83] hover:bg-[#08b874]"
                  }`}
                >
                  Enviar y Verificarse ✨
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Organizer Created Event shortcut banner */}
      {currentUser.role === Role.InstitutionalVerified && currentUser.id === profileId && (
        <div id="publisher-shortcut-banner" className="mb-8 p-6 bg-emerald-50/50 dark:bg-slate-900 border-3 border-[#1e293b] rounded-3xl shadow-[4px_4px_0px_0px_#1e293b] space-y-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#0acf83] border-2 border-[#1e293b] rounded-2xl text-white shadow-[2px_2px_0px_0px_#1e293b] shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                🌟 Eres un Organizador Verificado
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Tu cuenta está activa y verificada formalmente. Ya puedes crear convocatorias, ver métricas, y gestionar tus eventos directamente desde tu panel.
              </p>
            </div>
          </div>
          
          {onNavigate && (
            <button
              id="go-publisher-btn"
              onClick={() => onNavigate("publisher")}
              className="w-full sm:w-auto py-2.5 px-6 bg-[#1abcfe] text-slate-950 hover:bg-[#0ea5e9] border-2 border-[#1e293b] text-xs font-black uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_0px_#1e293b] active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_0px_#1e293b] transition-all cursor-pointer"
            >
              Ir al Panel Publicador y Crear Evento 📝
            </button>
          )}
        </div>
      )}



    </div>
  );
}
