/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Role, User, Institution, Opportunity, CostType, Modality, Notification,
  NewsArticle, AdBanner, UserQuestion, EventReview
} from "./types";
import { 
  INITIAL_INSTITUTIONS, INITIAL_OPPORTUNITIES, CATEGORIES, REGIONS_AND_COMUNAS, TARGET_AUDIENCES, INSTITUTION_TYPES 
} from "./data";

import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import OpportunityCard from "./components/OpportunityCard";
import OpportunityDetail from "./components/OpportunityDetail";
import RoleSwitcher from "./components/RoleSwitcher";
import AuthModals from "./components/AuthModals";
import DashboardPublicador from "./components/DashboardPublicador";
import DashboardAdmin from "./components/DashboardAdmin";
import CoverFlow from "./components/CoverFlow";
import AdPlacement, { DEFAULT_BANNERS } from "./components/AdPlacement";
import NewsPanel, { REALISTIC_NEWS } from "./components/NewsPanel";
import AboutPanel from "./components/AboutPanel";
import CarouselSection from "./components/CarouselSection";
import ProfilePanel from "./components/ProfilePanel";
import Sidebar from "./components/Sidebar";
import HelpPanel from "./components/HelpPanel";

import { 
  Filter, RotateCcw, Calendar, MapPin, Monitor, 
  GraduationCap, Award, Briefcase, BookOpen, ChevronLeft, ChevronRight, CheckCircle2,
  Sparkles, Hourglass, Gift, Compass, Eye, TrendingUp, Clock
} from "lucide-react";

const INITIAL_QUESTIONS: UserQuestion[] = [
  {
    id: "q-1",
    opportunityId: "opp-1",
    opportunityTitle: "Bootcamp Infantil de Programación y Robótica con Micro:bit",
    senderName: "Gabriela Torres",
    senderEmail: "gaby.torres@gmail.com",
    question: "Hola, ¿este bootcamp de robótica requiere que compremos la placa Micro:bit por nuestra cuenta o nos la prestan durante las clases?",
    createdAt: "Ayer, 14:32",
    answered: false,
    publishedToFaq: false
  },
  {
    id: "q-2",
    opportunityId: "opp-2",
    opportunityTitle: "Escuela de Invierno: Astronomía Moderna",
    senderName: "Mauricio Olivares",
    senderEmail: "m.olivares@outlook.cl",
    question: "Estimados, quisiera consultar si las clases virtuales de astronomía quedan grabadas en caso de no poder asistir a alguna sesión sincrónica por motivos laborales.",
    createdAt: "Hace 3 días",
    answered: true,
    answer: "Hola Mauricio, sí, todas las clases teóricas de la Escuela de Invierno quedan grabadas en nuestra plataforma virtual y estarán disponibles para repasar durante un año completo.",
    publishedToFaq: true
  }
];

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("portal-theme") === "dark";
  });

  // Data states (synchronized with LocalStorage for a true persistent simulation)
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem("portal-opps");
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [institutions, setInstitutions] = useState<Institution[]>(() => {
    const saved = localStorage.getItem("portal-insts");
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTIONS;
  });

  // News states (synchronized with LocalStorage)
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem("portal-news");
    return saved ? JSON.parse(saved) : REALISTIC_NEWS;
  });

  // Ad Banners states (synchronized with LocalStorage)
  const [adBanners, setAdBanners] = useState<AdBanner[]>(() => {
    const saved = localStorage.getItem("portal-ads");
    return saved ? JSON.parse(saved) : DEFAULT_BANNERS;
  });

  // Simulated Users list for the portal (synchronized with LocalStorage)
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("portal-users");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "user-sim-demo",
        name: "Eduardo N.B.",
        email: "eduardo@ejemplo.cl",
        role: Role.Registered,
        savedFavorites: [],
        subscribedCategories: [],
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80",
        description: "Estudiante de ingeniería apasionado por la tecnología, la música y la innovación social. Participo activamente en talleres locales.",
        occupation: "Estudiante Universitario",
        followedUsers: [],
        followedInstitutions: []
      },
      {
        id: "user-matias",
        name: "Matias Alarcon",
        email: "matias.alarcon@correo.cl",
        role: Role.Registered,
        savedFavorites: [],
        subscribedCategories: [],
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
        description: "Padre entusiasta y desarrollador de software. Interesado en robótica educativa y actividades tecnológicas para niños.",
        occupation: "Ingeniero de Software",
        followedUsers: [],
        followedInstitutions: ["inst-1"]
      },
      {
        id: "user-carolina",
        name: "Carolina Silva",
        email: "carolina.silva@correo.cl",
        role: Role.Registered,
        savedFavorites: [],
        subscribedCategories: [],
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
        description: "Profesora de educación básica con mención en ciencias. Busco actividades interactivas para complementar mis clases.",
        occupation: "Docente de Educación Básica",
        followedUsers: [],
        followedInstitutions: ["inst-1", "inst-2"]
      },
      {
        id: "user-felipe",
        name: "Felipe Soto",
        email: "felipe.soto@correo.cl",
        role: Role.Registered,
        savedFavorites: [],
        subscribedCategories: [],
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
        description: "Aficionado a la astronomía y la fotografía nocturna. Miembro activo de clubes locales de ciencia.",
        occupation: "Diseñador Gráfico",
        followedUsers: [],
        followedInstitutions: ["inst-2"]
      }
    ];
  });

  // Simulated Current User Session
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem("portal-user");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        followedUsers: parsed.followedUsers || [],
        followedInstitutions: parsed.followedInstitutions || []
      };
    }
    return {
      id: "visitor-session",
      name: "Visitante",
      email: "anonimo@correo.cl",
      role: Role.Visitor,
      savedFavorites: [],
      subscribedCategories: [],
      followedUsers: [],
      followedInstitutions: []
    };
  });

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("portal-notifications");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "notif-1",
        title: "⏳ Cierre Próximo de Postulaciones",
        message: "El programa 'Escuela de Invierno: Astronomía Moderna' de la Universidad de Chile cierra su convocatoria en menos de 10 días.",
        date: "27 Jun 2026",
        read: false,
        type: "alert",
        opportunityId: "opp-2"
      },
      {
        id: "notif-2",
        title: "💻 Nueva Actividad Recomendada",
        message: "Se ha publicado 'Bootcamp Infantil de Programación y Robótica con Micro:bit', ideal para estudiantes interesados en Tecnología.",
        date: "26 Jun 2026",
        read: false,
        type: "opportunity",
        opportunityId: "opp-1"
      }
    ];
  });

  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>(() => {
    const saved = localStorage.getItem("portal-questions");
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  // Profile View States
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  const [viewingProfileType, setViewingProfileType] = useState<"user" | "institution" | null>(null);

  // Reviews state, synced to localStorage
  const [reviews, setReviews] = useState<EventReview[]>(() => {
    const saved = localStorage.getItem("portal-reviews");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "rev-mock-1",
        opportunityId: "opp-1",
        opportunityTitle: "Bootcamp Infantil de Programación y Robótica con Micro:bit",
        reviewerName: "Matias Alarcon",
        reviewerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
        rating: 5,
        comment: "A mi hijo le encantó el taller. El kit de robótica que le regalaron al final lo tiene súper entusiasmado. ¡100% recomendado!",
        createdAt: "12 Jun 2026"
      },
      {
        id: "rev-mock-2",
        opportunityId: "opp-1",
        opportunityTitle: "Bootcamp Infantil de Programación y Robótica con Micro:bit",
        reviewerName: "Carolina Silva",
        reviewerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
        rating: 4,
        comment: "Muy buena metodología y excelente paciencia de los tutores. Ideal para comenzar en robótica.",
        createdAt: "18 Jun 2026"
      },
      {
        id: "rev-mock-3",
        opportunityId: "opp-2",
        opportunityTitle: "Escuela de Invierno: Astronomía Moderna",
        reviewerName: "Felipe Soto",
        reviewerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
        rating: 5,
        comment: "Una experiencia astronómica de primer nivel. El acceso a los telescopios profesionales fue increíble.",
        createdAt: "22 Jun 2026"
      }
    ];
  });

  // Active Navigation View: "home" | "admin" | "publisher" | "favorites" | "profile"
  const [currentView, setCurrentView] = useState<string>("home");

  // Scroll ref for closing soon horizontal strip
  const closingSoonScrollRef = useRef<HTMLDivElement>(null);

  // Sidebar container ref for click outside
  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  // Sidebar visibility state (collapsible/hidden)
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem("portal-sidebar-visible");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("portal-sidebar-visible", String(sidebarVisible));
  }, [sidebarVisible]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (sidebarVisible && sidebarContainerRef.current && !sidebarContainerRef.current.contains(target)) {
        const toggleBtn = document.getElementById("sidebar-toggle-btn");
        if (!toggleBtn || !toggleBtn.contains(target)) {
          setSidebarVisible(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarVisible]);

  // Filter States
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");
  const [selectedModality, setSelectedModality] = useState("");
  const [selectedCost, setSelectedCost] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("");
  const [selectedInstitutionType, setSelectedInstitutionType] = useState("");

  // Detailed modal opportunity
  const [activeDetailOpp, setActiveDetailOpp] = useState<Opportunity | null>(null);

  // Edit transition state from profile to publisher dashboard
  const [initialEditingOpp, setInitialEditingOpp] = useState<Opportunity | null>(null);

  // Authentication modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<"login" | "register" | null>(null);

  // Side Filter panel toggle for mobile
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem("portal-opps", JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem("portal-insts", JSON.stringify(institutions));
  }, [institutions]);

  useEffect(() => {
    localStorage.setItem("portal-user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("portal-users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("portal-notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("portal-news", JSON.stringify(newsArticles));
  }, [newsArticles]);

  useEffect(() => {
    localStorage.setItem("portal-ads", JSON.stringify(adBanners));
  }, [adBanners]);

  useEffect(() => {
    localStorage.setItem("portal-questions", JSON.stringify(userQuestions));
  }, [userQuestions]);

  useEffect(() => {
    localStorage.setItem("portal-reviews", JSON.stringify(reviews));
  }, [reviews]);

  // Read URL params for profile viewing (e.g. direct profile links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const profileParam = params.get("profile"); // format: "type-id" (e.g. "institution-inst-1" or "user-user-sim-demo")
    if (profileParam) {
      const parts = profileParam.split("-");
      if (parts.length >= 2) {
        const type = parts[0] as "user" | "institution";
        // Reconstruct ID (it might contain dashes)
        const id = parts.slice(1).join("-");
        setViewingProfileId(id);
        setViewingProfileType(type);
        setCurrentView("profile");
      }
    }
  }, []);

  // Dark Mode Apply class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("portal-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("portal-theme", "light");
    }
  }, [darkMode]);

  // Increment view metric when opportunity is clicked/viewed
  const handleViewOpportunity = (opp: Opportunity) => {
    setActiveDetailOpp(opp);
    setOpportunities(prev => 
      prev.map(o => o.id === opp.id ? { ...o, views: o.views + 1 } : o)
    );
  };

  // Increment derivation clicks
  const handleRegisterDerivation = (oppId: string) => {
    setOpportunities(prev => 
      prev.map(o => o.id === oppId ? { ...o, clicks: o.clicks + 1, registrations: o.registrations + 1 } : o)
    );
    // Send a beautiful success notification
    const newNotif: Notification = {
      id: "notif-deriv-" + Date.now(),
      title: "✔ Derivación Exitosa",
      message: "Te hemos redirigido exitosamente al enlace de inscripción oficial de la institución.",
      date: "Hoy",
      read: false,
      type: "success"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Add review from Profile review dialog
  const handleAddReview = (newReview: EventReview) => {
    setReviews(prev => [newReview, ...prev]);
    const newNotif: Notification = {
      id: "notif-rev-" + Date.now(),
      title: "⭐ Comentario Publicado",
      message: `Tu evaluación con ${newReview.rating} estrellas para el evento ha sido publicada con éxito.`,
      date: "Hoy",
      read: false,
      type: "success"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Update institution profile information
  const handleUpdateInstitution = (updated: Institution) => {
    setInstitutions(prev => prev.map(inst => inst.id === updated.id ? updated : inst));
    if (currentUser.institutionId === updated.id) {
      setCurrentUser(prev => ({
        ...prev,
        name: updated.name,
        avatar: updated.logo,
        description: updated.description,
        occupation: updated.occupation || prev.occupation
      }));
    }
    const newNotif: Notification = {
      id: "notif-inst-update-" + Date.now(),
      title: "📝 Perfil Institucional Actualizado",
      message: "Los cambios en la descripción, foto y datos de contacto se guardaron correctamente.",
      date: "Hoy",
      read: false,
      type: "success"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Update user profile information
  const handleUpdateUser = (updated: User) => {
    if (updated.id === currentUser.id) {
      setCurrentUser(updated);
    }
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    
    const newNotif: Notification = {
      id: "notif-user-update-" + Date.now(),
      title: "👤 Perfil de Usuario Actualizado",
      message: "La información de perfil y ocupación se guardaron correctamente.",
      date: "Hoy",
      read: false,
      type: "success"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Verify user and register them as an organizer/institution
  const handleVerifyUser = (updatedUser: User, newInstitution: Institution) => {
    setInstitutions(prev => {
      if (prev.some(i => i.id === newInstitution.id)) {
        return prev.map(i => i.id === newInstitution.id ? newInstitution : i);
      }
      return [...prev, newInstitution];
    });
    setCurrentUser(updatedUser);
    setUsers(prev => {
      if (prev.some(u => u.id === updatedUser.id)) {
        return prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      }
      return [...prev, updatedUser];
    });

    const successNotif: Notification = {
      id: "notif-verified-pending-" + Date.now(),
      title: "⏳ Solicitud de Publicador Enviada",
      message: `Tu solicitud para ser Organizador/Publicador con '${newInstitution.name}' ha sido enviada con éxito. Un administrador la revisará y autorizará en el panel de solicitudes.`,
      date: "Hoy",
      read: false,
      type: "info"
    };
    setNotifications(prev => [successNotif, ...prev]);
  };

  // Toggle following status for a user or institution
  const handleFollowToggle = (targetId: string, type: "user" | "institution") => {
    if (currentUser.role === Role.Visitor) {
      alert("Debes iniciar sesión para poder seguir a otros perfiles.");
      return;
    }

    const followedUsersList = currentUser.followedUsers || [];
    const followedInstsList = currentUser.followedInstitutions || [];

    let updatedUser: User;

    if (type === "user") {
      const isFollowing = followedUsersList.includes(targetId);
      const newFollowedUsers = isFollowing
        ? followedUsersList.filter(id => id !== targetId)
        : [...followedUsersList, targetId];
      
      updatedUser = {
        ...currentUser,
        followedUsers: newFollowedUsers
      };
    } else {
      const isFollowing = followedInstsList.includes(targetId);
      const newFollowedInsts = isFollowing
        ? followedInstsList.filter(id => id !== targetId)
        : [...followedInstsList, targetId];
      
      updatedUser = {
        ...currentUser,
        followedInstitutions: newFollowedInsts
      };
    }

    // Save active user session
    setCurrentUser(updatedUser);
    
    // Also sync the active user session inside the general users list if applicable
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    // Notify user of successful follow action
    const targetName = type === "user" 
      ? (users.find(u => u.id === targetId)?.name || "Usuario")
      : (institutions.find(i => i.id === targetId)?.name || "Institución");

    const isFollowingNow = type === "user" 
      ? updatedUser.followedUsers?.includes(targetId)
      : updatedUser.followedInstitutions?.includes(targetId);

    const newNotif: Notification = {
      id: "notif-follow-" + Date.now(),
      title: isFollowingNow ? "➕ Nuevo Seguido" : "➖ Dejaste de Seguir",
      message: isFollowingNow 
        ? `Ahora sigues a '${targetName}'. Sus novedades aparecerán en tu panel y sus convocatorias en tus destacados.`
        : `Has dejado de seguir a '${targetName}'.`,
      date: "Hoy",
      read: false,
      type: "success"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Send a question to publisher
  const handleSendQuestion = (opportunityId: string, opportunityTitle: string, name: string, email: string, questionText: string) => {
    const newQ: UserQuestion = {
      id: "q-" + Date.now(),
      opportunityId,
      opportunityTitle,
      senderName: name,
      senderEmail: email,
      question: questionText,
      createdAt: "Hoy, " + new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
      answered: false,
      publishedToFaq: false
    };

    setUserQuestions(prev => [newQ, ...prev]);

    // Send notification
    const newNotif: Notification = {
      id: "notif-q-sent-" + Date.now(),
      title: "📨 Consulta Enviada",
      message: `Tu pregunta sobre "${opportunityTitle}" fue enviada a la institución. Se te responderá a ${email}.`,
      date: "Hoy",
      read: false,
      type: "info"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Answer a user question (called by Publisher)
  const handleAnswerQuestion = (questionId: string, answer: string) => {
    setUserQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, answered: true, answer } : q)
    );

    // Send a notification to publisher confirming the reply
    const newNotif: Notification = {
      id: "notif-q-ans-" + Date.now(),
      title: "✉ Consulta Respondida",
      message: "Respuesta enviada con éxito. Se ha enviado una notificación de correo ficticia al remitente.",
      date: "Hoy",
      read: false,
      type: "success"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Publish answered question directly to Opportunity's FAQ section
  const handlePublishQuestionToFaq = (questionId: string) => {
    const question = userQuestions.find(q => q.id === questionId);
    if (!question || !question.answered || !question.answer) return;

    // 1. Mark question as published to FAQ
    setUserQuestions(prev => 
      prev.map(q => q.id === questionId ? { ...q, publishedToFaq: true } : q)
    );

    // 2. Add question and answer to the opportunity FAQs array
    setOpportunities(prev => 
      prev.map(opp => {
        if (opp.id === question.opportunityId) {
          const currentFaqs = opp.faqs || [];
          // Avoid duplicate entries if already added
          const alreadyExists = currentFaqs.some(f => f.question.toLowerCase() === question.question.toLowerCase());
          if (alreadyExists) return opp;
          return {
            ...opp,
            faqs: [...currentFaqs, { question: question.question, answer: question.answer || "" }]
          };
        }
        return opp;
      })
    );

    // 3. Update active modal if open
    setActiveDetailOpp(prev => {
      if (prev && prev.id === question.opportunityId) {
        const currentFaqs = prev.faqs || [];
        const alreadyExists = currentFaqs.some(f => f.question.toLowerCase() === question.question.toLowerCase());
        if (alreadyExists) return prev;
        return {
          ...prev,
          faqs: [...currentFaqs, { question: question.question, answer: question.answer || "" }]
        };
      }
      return prev;
    });

    // 4. Send notification
    const newNotif: Notification = {
      id: "notif-faq-pub-" + Date.now(),
      title: "📢 Pregunta Publicada en FAQ",
      message: `Has publicado una nueva pregunta frecuente en la actividad "${question.opportunityTitle}".`,
      date: "Hoy",
      read: false,
      type: "success"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Toggle Favorite
  const handleFavoriteToggle = (oppId: string) => {
    if (currentUser.role === Role.Visitor) {
      setAuthModalType("login");
      setAuthModalOpen(true);
      return;
    }

    if (currentUser.role === Role.InstitutionalVerified) {
      const opp = opportunities.find(o => o.id === oppId);
      if (opp && opp.institutionId !== currentUser.institutionId) {
        const errorNotif: Notification = {
          id: "notif-fav-error-" + Date.now(),
          title: "❌ Acción no permitida",
          message: "Como institución, no puedes guardar en favoritos eventos de otras instituciones.",
          date: "Hoy",
          read: false,
          type: "info"
        };
        setNotifications(prev => [errorNotif, ...prev]);
        return;
      }
    }

    const isFav = currentUser.savedFavorites.includes(oppId);
    const updatedFavorites = isFav 
      ? currentUser.savedFavorites.filter(id => id !== oppId)
      : [...currentUser.savedFavorites, oppId];

    setCurrentUser(prev => ({
      ...prev,
      savedFavorites: updatedFavorites
    }));

    // Alert Notification
    const newNotif: Notification = {
      id: "notif-fav-" + Date.now(),
      title: isFav ? "⭐ Favorito Eliminado" : "⭐ Guardado en Favoritos",
      message: isFav 
        ? "La oportunidad se ha removido de tu lista personal." 
        : "La oportunidad se guardó. Recibirás alertas si hay cambios de fechas.",
      date: "Hoy",
      read: false,
      type: "info"
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Add category subscription
  const handleSubscribeCategory = (catName: string) => {
    if (currentUser.role === Role.Visitor) {
      setAuthModalType("login");
      setAuthModalOpen(true);
      return;
    }

    const isSubscribed = currentUser.subscribedCategories.includes(catName);
    const updated = isSubscribed
      ? currentUser.subscribedCategories.filter(c => c !== catName)
      : [...currentUser.subscribedCategories, catName];

    setCurrentUser(prev => ({
      ...prev,
      subscribedCategories: updated
    }));
  };

  // Mark notification as read
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Auth Modals Callback
  const handleAuthSuccess = (user: User, institution?: Institution) => {
    setCurrentUser(user);
    if (institution) {
      setInstitutions(prev => [institution, ...prev]);
      
      // Send a notification that validation is pending
      const adminNotif: Notification = {
        id: "notif-adm-pend-" + Date.now(),
        title: "⚡ Nueva Institución Registrada",
        message: `La entidad '${institution.name}' ha cargado sus documentos. Pendiente de auditar por el Administrador.`,
        date: "Hoy",
        read: false,
        type: "alert"
      };
      setNotifications(prev => [adminNotif, ...prev]);
    } else {
      // Normal login success notification
      const welcomeNotif: Notification = {
        id: "notif-welcome-" + Date.now(),
        title: `👋 ¡Hola, bienvenido de vuelta!`,
        message: `Has iniciado sesión correctamente como ${user.name}.`,
        date: "Hoy",
        read: false,
        type: "info"
      };
      setNotifications(prev => [welcomeNotif, ...prev]);
    }
  };

  const handleLogout = () => {
    setCurrentUser({
      id: "visitor-session",
      name: "Visitante",
      email: "anonimo@correo.cl",
      role: Role.Visitor,
      savedFavorites: [],
      subscribedCategories: []
    });
    setCurrentView("home");
  };

  // Admin approvals
  const handleApproveInstitution = (id: string) => {
    setInstitutions(prev => prev.map(i => i.id === id ? { ...i, verified: true } : i));
    
    // Find representative user and elevate their role to Verified Institutional
    // Since we are simulating, we check if the currentUser represents this institution and upgrade them!
    if (currentUser.institutionId === id) {
      setCurrentUser(prev => ({ ...prev, role: Role.InstitutionalVerified }));
    }

    // Also update role for any other matching users in the simulated list
    setUsers(prev => prev.map(u => u.institutionId === id ? { ...u, role: Role.InstitutionalVerified } : u));

    // Trigger congratulations notification
    const successNotif: Notification = {
      id: "notif-approved-" + Date.now(),
      title: "✔ Cuenta de Publicador Aprobada",
      message: `¡Excelentes noticias! La entidad/organizador ha sido aprobada formalmente. Ya puede publicar bajo la insignia Verificada.`,
      date: "Hoy",
      read: false,
      type: "success"
    };
    setNotifications(prev => [successNotif, ...prev]);
  };

  const handleRejectInstitution = (id: string) => {
    setInstitutions(prev => prev.filter(i => i.id !== id));
    
    // If current user is the one rejected, reset role
    if (currentUser.institutionId === id) {
      setCurrentUser(prev => ({ ...prev, role: Role.Registered, institutionId: undefined }));
    }

    // Reset role for matching users in the simulated list
    setUsers(prev => prev.map(u => u.institutionId === id ? { ...u, role: Role.Registered, institutionId: undefined } : u));

    const rejectNotif: Notification = {
      id: "notif-rejected-" + Date.now(),
      title: "❌ Solicitud Rechazada",
      message: "Tu postulación para ser publicador ha sido rechazada por el administrador debido a inconsistencias en los datos.",
      date: "Hoy",
      read: false,
      type: "alert"
    };
    setNotifications(prev => [rejectNotif, ...prev]);
  };

  // Opportunity CRUD
  const handleAddOpportunity = (opp: Opportunity) => {
    setOpportunities(prev => [opp, ...prev]);
    // Notify users subscribed to these categories
    const notif: Notification = {
      id: "notif-new-opp-" + Date.now(),
      title: "🔔 Nueva Oportunidad Disponible",
      message: `Se ha publicado una nueva actividad curricular: '${opp.title}' en tu región.`,
      date: "Hoy",
      read: false,
      type: "opportunity",
      opportunityId: opp.id
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleUpdateOpportunity = (opp: Opportunity) => {
    setOpportunities(prev => prev.map(o => o.id === opp.id ? opp : o));
  };

  const handleDeleteOpportunity = (id: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
  };

  const handleToggleFeatureOpportunity = (id: string) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, isFeatured: !o.isFeatured } : o));
  };

  // News control handlers
  const handleAddNewsArticle = (newArt: NewsArticle) => {
    setNewsArticles(prev => [newArt, ...prev]);
  };

  const handleUpdateNewsArticle = (updatedArt: NewsArticle) => {
    setNewsArticles(prev => prev.map(art => art.id === updatedArt.id ? updatedArt : art));
  };

  const handleDeleteNewsArticle = (id: string) => {
    setNewsArticles(prev => prev.filter(art => art.id !== id));
  };

  // Ad Banners control handlers
  const handleAddAdBanner = (newAd: AdBanner) => {
    setAdBanners(prev => [newAd, ...prev]);
  };

  const handleUpdateAdBanner = (updatedAd: AdBanner) => {
    setAdBanners(prev => prev.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
  };

  const handleDeleteAdBanner = (id: string) => {
    setAdBanners(prev => prev.filter(ad => ad.id !== id));
  };

  const handleToggleAdActive = (id: string) => {
    setAdBanners(prev => prev.map(ad => ad.id === id ? { ...ad, active: !ad.active } : ad));
  };

  // Simulated quick switches for evaluation
  const handleRoleChangeSimulated = (newRole: Role) => {
    let mockName = "Visitante";
    let mockEmail = "anonimo@correo.cl";
    let mockInstId = undefined;

    if (newRole === Role.Registered) {
      mockName = "Juan Pérez";
      mockEmail = "juan.perez@correo.cl";
    } else if (newRole === Role.InstitutionalPending) {
      mockName = "Clara Gómez";
      mockEmail = "c.gomez@uvalparaiso.cl";
      // Ensure we have a pending institution in state to audit
      mockInstId = "inst-valparaiso";
      const uvExists = institutions.some(i => i.id === "inst-valparaiso");
      if (!uvExists) {
        const pendingInst: Institution = {
          id: "inst-valparaiso",
          name: "Universidad de Valparaíso",
          rut: "70.222.100-3",
          website: "https://www.uv.cl",
          email: "vinculacion@uv.cl",
          contactName: "Clara Gómez",
          contactRole: "Encargada de Extensión",
          verified: false,
          logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&h=150&fit=crop&q=80",
          description: "Institución de educación superior pública chilena fundada en Valparaíso.",
          documentName: "Acreditacion_U_Valparaiso.pdf"
        };
        setInstitutions(prev => [pendingInst, ...prev]);
      }
    } else if (newRole === Role.InstitutionalVerified) {
      mockName = "Valentina Rojas";
      mockEmail = "formacion@chiletecnologico.org";
      mockInstId = "inst-3"; // Fundación Chile Tecnológico
    } else if (newRole === Role.Admin) {
      mockName = "Eduardo Administrator";
      mockEmail = "admin@portal.cl";
    }

    setCurrentUser({
      id: "simulated-user-id-" + newRole.toLowerCase(),
      name: mockName,
      email: mockEmail,
      role: newRole,
      institutionId: mockInstId,
      savedFavorites: currentUser.savedFavorites,
      subscribedCategories: currentUser.subscribedCategories
    });
    
    // Auto navigate
    if (newRole === Role.Admin) {
      setCurrentView("admin");
    } else if (newRole === Role.InstitutionalVerified) {
      setCurrentView("publisher");
    } else {
      setCurrentView("home");
    }
  };

  // Filtering Logic
  const filteredOpportunities = opportunities.filter((opp) => {
    // Only published status on home page
    if (opp.status !== "Published" && currentUser.role !== Role.Admin && opp.institutionId !== currentUser.institutionId) {
      return false;
    }

    // Keyword Search
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(kw);
      const matchDesc = opp.briefDescription.toLowerCase().includes(kw) || opp.fullDescription.toLowerCase().includes(kw);
      const matchInst = opp.institutionName.toLowerCase().includes(kw);
      if (!matchTitle && !matchDesc && !matchInst) return false;
    }

    // Categories (multiple logic: matching one or more)
    if (selectedCategories.length > 0) {
      const hasCat = opp.categories.some(c => selectedCategories.includes(c));
      if (!hasCat) return false;
    }

    // Region
    if (selectedRegion && opp.region !== selectedRegion) return false;

    // Comuna
    if (selectedComuna && opp.comuna !== selectedComuna) return false;

    // Modality
    if (selectedModality && opp.modality !== selectedModality) return false;

    // Cost
    if (selectedCost && opp.cost !== selectedCost) return false;

    // Audience
    if (selectedAudience && !opp.targetAudience.includes(selectedAudience)) return false;

    return true;
  });

  // Split filter metrics for homepage grids
  const featuredOpps = filteredOpportunities.filter(o => {
    // 1. Matches user's subscribed areas of interest (categories)
    if (currentUser.subscribedCategories && currentUser.subscribedCategories.length > 0) {
      if (o.categories.some(c => currentUser.subscribedCategories.includes(c))) {
        return true;
      }
    }

    // 2. Standard featured
    if (o.isFeatured) return true;
    
    // 3. Belongs to a followed institution
    const followedInsts = currentUser.followedInstitutions || [];
    if (followedInsts.includes(o.institutionId)) return true;
    
    // 4. Belongs to an institution of a followed user
    const followedUsrs = currentUser.followedUsers || [];
    const followedUsersModels = users.filter(u => followedUsrs.includes(u.id));
    const followedUsersInstIds = followedUsersModels.map(u => u.institutionId).filter(Boolean);
    if (followedUsersInstIds.includes(o.institutionId)) return true;

    return false;
  });
  const recentOpps = [...filteredOpportunities].sort((a, b) => b.id.localeCompare(a.id));
  const closingSoonOpps = filteredOpportunities
    .filter(o => {
      const diff = new Date(o.applicationDeadline).getTime() - new Date("2026-06-27").getTime();
      return diff >= 0;
    })
    .sort((a, b) => a.applicationDeadline.localeCompare(b.applicationDeadline));

  const freeOpps = filteredOpportunities.filter(o => o.cost === CostType.Gratuito);
  const dynamicRecommended = filteredOpportunities.filter(o => {
    // Matches users subscribed categories or default featured
    if (currentUser.subscribedCategories.length > 0) {
      return o.categories.some(c => currentUser.subscribedCategories.includes(c));
    }
    return o.views > 200;
  });

  const mostViewedOpps = [...filteredOpportunities].sort((a, b) => b.views - a.views);
  const popularOpps = [...filteredOpportunities].sort((a, b) => b.derivations - a.derivations);

  const isFiltered = searchKeyword !== "" || selectedCategories.length > 0 || selectedRegion !== "" || selectedComuna !== "" || selectedModality !== "" || selectedCost !== "" || selectedAudience !== "";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return dateStr;
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${day} ${months[parseInt(month, 10) - 1]}`;
  };

  const resetAllFilters = () => {
    setSearchKeyword("");
    setSelectedCategories([]);
    setSelectedRegion("");
    setSelectedComuna("");
    setSelectedModality("");
    setSelectedCost("");
    setSelectedAudience("");
    setSelectedInstitutionType("");
  };

  const getActiveInstitution = () => {
    if (!currentUser.institutionId) return null;
    return institutions.find(i => i.id === currentUser.institutionId) || null;
  };

  return (
    <div id="portal-root-view" className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 flex flex-col md:flex-row">
      
      {/* Sidebar - Persistent on left for desktop, collapsible drawer on mobile */}
      {sidebarVisible && (
        <>
          {/* Mobile backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-150"
            onClick={() => setSidebarVisible(false)}
          />
          <div 
            ref={sidebarContainerRef}
            className="fixed inset-y-0 left-0 z-50 md:sticky md:top-0 md:h-screen w-64 shrink-0 shadow-2xl md:shadow-none animate-in slide-in-from-left duration-250"
          >
            <Sidebar
              currentUser={currentUser}
              institutions={institutions}
              currentView={currentView}
              onNavigate={(view) => {
                if (view === "profile") {
                  if ((currentUser.role === Role.InstitutionalVerified || currentUser.role === Role.InstitutionalPending) && currentUser.institutionId) {
                    setViewingProfileId(currentUser.institutionId);
                    setViewingProfileType("institution");
                  } else {
                    setViewingProfileId(currentUser.id);
                    setViewingProfileType("user");
                  }
                } else {
                  setViewingProfileId(null);
                  setViewingProfileType(null);
                }
                setCurrentView(view);
                if (window.innerWidth < 768) {
                  setSidebarVisible(false);
                }
              }}
              onLoginClick={() => { setAuthModalType("login"); setAuthModalOpen(true); }}
              onLogoutClick={handleLogout}
              onViewFavorites={() => {
                setCurrentView("favorites");
                if (window.innerWidth < 768) {
                  setSidebarVisible(false);
                }
              }}
              favoritesCount={currentUser.savedFavorites.length}
              users={users}
              onViewProfile={(id, type) => {
                setViewingProfileId(id);
                setViewingProfileType(type);
                setCurrentView("profile");
                if (window.innerWidth < 768) {
                  setSidebarVisible(false);
                }
              }}
            />
          </div>
        </>
      )}

      {/* Main Container on the right */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 relative overflow-hidden">
        {/* Organic floating decorative background waves */}
        <div className="organic-bg-wave" />
        <div className="organic-bg-wave-secondary" />

        {/* Top Navigation Bar */}
        <Navbar
          currentUser={currentUser}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onClearNotifications={handleClearNotifications}
          onLoginClick={() => { setAuthModalType("login"); setAuthModalOpen(true); }}
          onRegisterClick={() => { setAuthModalType("register"); setAuthModalOpen(true); }}
          onLogoutClick={handleLogout}
          searchKeyword={searchKeyword}
          onSearchChange={(kw) => {
            setSearchKeyword(kw);
            if (kw && currentView !== "eventos") setCurrentView("eventos");
          }}
          favoritesCount={currentUser.savedFavorites.length}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onViewFavorites={() => setCurrentView("favorites")}
          currentView={currentView}
          onNavigate={(view) => {
            if (view === "profile") {
              if ((currentUser.role === Role.InstitutionalVerified || currentUser.role === Role.InstitutionalPending) && currentUser.institutionId) {
                setViewingProfileId(currentUser.institutionId);
                setViewingProfileType("institution");
              } else {
                setViewingProfileId(currentUser.id);
                setViewingProfileType("user");
              }
            } else {
              setViewingProfileId(null);
              setViewingProfileType(null);
            }
            setCurrentView(view);
          }}
          institutions={institutions}
          users={users}
          onViewProfile={(id, type) => {
            setViewingProfileId(id);
            setViewingProfileType(type);
            setCurrentView("profile");
          }}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
        />

        {/* Main Container */}
        <main id="main-content-layout" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-16">
        
        {/* Render View: INICIO (HOME) */}
        {currentView === "home" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Sophisticated Welcome Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#F4F3EF]/95 via-white/80 to-[#F7F9FA]/70 text-slate-900 rounded-[2.5rem] p-8 sm:p-10 border border-slate-200/50 shadow-lg text-left flex flex-col md:flex-row items-center gap-8 justify-between">
              {/* Decorative glows */}
              <div className="absolute top-0 left-0 w-48 h-48 bg-[#E2B13C]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#C87A53]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4 max-w-xl md:w-3/5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2B13C]/10 text-[#C87A53] text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#C87A53]" />
                  Portal Único de Convocatorias Escolares ✨
                </span>
                <h1 className="text-3xl sm:text-5xl font-display font-medium tracking-tight text-[#1E293B] leading-tight mt-2">
                  El futuro de la ciencia y cultura escolar <span className="text-[#C87A53] font-serif italic">chilena</span>
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-2xl mt-2 leading-relaxed">
                  Reunimos convocatorias de olimpiadas, talleres, becas y exposiciones interactivas del país en una red federal coordinada de instituciones verificadas.
                </p>
              </div>

              {/* Right Side Image with Organic Asymmetric Blob Mask */}
              <div className="hidden md:block md:w-2/5 relative z-10 shrink-0">
                <div className="absolute inset-0 bg-[#C87A53]/8 rounded-[40%_60%_50%_50%_/_50%_40%_60%_50%] blur-xl transform scale-105" />
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&fit=crop&q=80" 
                  alt="Ciencia Escolar" 
                  className="w-full h-48 object-cover rounded-[40%_60%_50%_50%_/_50%_40%_60%_50%] shadow-md border border-[#E2B13C]/20 hover:scale-102 hover:-rotate-1 transition-all"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Side-by-side Grid: Noticias (Left) and Eventos Destacados (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Noticias Destacadas (Spans 7 columns on desktop) */}
              <div className="lg:col-span-7 text-left">
                <NewsPanel articles={newsArticles} />
              </div>

              {/* Eventos Destacados Sidebar Card (Spans 5 columns on desktop) */}
              <div className="lg:col-span-5 text-left">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-3 border-[#1e293b] dark:border-slate-800 shadow-[6px_6px_0px_0px_#1e293b] dark:shadow-[6px_6px_0px_0px_#1e293b]">
                  <div className="flex items-center gap-2 border-b-2 border-dashed border-[#1e293b]/10 dark:border-slate-800 pb-3 mb-4">
                    <span className="text-xl">🔥</span>
                    <h3 className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">
                      Eventos Destacados
                    </h3>
                  </div>
                  
                  {/* Vertical list of featured events */}
                  <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1.5 scrollbar-thin">
                    {opportunities.filter(o => o.isFeatured).map((opp) => (
                      <div 
                        key={opp.id}
                        onClick={() => handleViewOpportunity(opp)}
                        className="p-4 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex gap-4 group"
                      >
                        <img 
                          src={opp.imageUrl} 
                          alt={opp.title} 
                          className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-700 shrink-0 shadow-xs"
                        />
                        <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <span className="px-2.5 py-0.5 bg-[#C87A53]/10 text-[#C87A53] font-bold text-[9px] uppercase tracking-wider rounded-full border border-[#C87A53]/20 inline-block">
                              {opp.category}
                            </span>
                            <h4 className="font-display font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-2 mt-1.5 leading-snug group-hover:text-[#C87A53] transition-colors">
                              {opp.title}
                            </h4>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs font-bold mt-2.5 pt-1.5 border-t border-dashed border-slate-200/60 dark:border-slate-700/60">
                            <span className="truncate max-w-[130px] text-slate-500 dark:text-slate-400 font-medium">
                              {opp.institutionName}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-[9px] font-semibold border border-slate-200/50 dark:border-slate-700/50">
                              {opp.modality}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentView("eventos")}
                    className="w-full bg-[#1abcfe] hover:bg-[#15a3dc] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-[#1e293b] shadow-[3px_3px_0px_0px_#1e293b] transition-all cursor-pointer block text-center mt-5"
                  >
                    Ver Todos los Eventos 📅
                  </button>
                </div>
              </div>

            </div>

            {/* Horizontal supportive widgets: Red Federal y Socio Destacado side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Red Federal de Formación */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white flex flex-col justify-between border-3 border-[#1e293b] shadow-[6px_6px_0px_0px_#1e293b] hover:-translate-y-0.5 transition-all text-left">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-blue-200">Red Federal de Formación</span>
                    <Award className="w-6 h-6 text-blue-200 animate-bounce" />
                  </div>
                  <div className="mt-4">
                    <span className="font-display font-black text-4xl leading-none">+{institutions.filter(i => i.verified).length}</span>
                    <p className="text-sm text-blue-100 font-bold mt-1">Instituciones Verificadas en Chile activas en el portal</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-blue-500/30">
                  <div className="flex -space-x-2 overflow-hidden">
                    {institutions.slice(0, 5).map((inst) => (
                      <img 
                        key={inst.id} 
                        src={inst.logo} 
                        alt={inst.name} 
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-blue-600 object-cover hover:scale-110 transition-transform cursor-pointer"
                        title={inst.name}
                        onClick={() => {
                          setViewingProfileId(inst.id);
                          setViewingProfileType("institution");
                          setCurrentView("profile");
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-blue-100 font-extrabold uppercase tracking-wide">Red Federal de Convocatorias Escolares</span>
                </div>
              </div>

              {/* Socio Destacado Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border-3 border-[#1e293b] dark:border-slate-800 p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_#1e293b] dark:shadow-[6px_6px_0px_0px_#1e293b] hover:-translate-y-0.5 transition-all text-left">
                <div className="flex gap-4 items-start">
                  <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border-2 border-[#1e293b] shrink-0">
                    <img src="https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80" alt="Universidad de Chile" className="w-16 h-16 rounded-xl object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 block">Socio Académico Destacado</span>
                    <h4 className="font-display font-black text-lg text-slate-800 dark:text-white mt-1">Universidad de Chile</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Líder en investigación y fomento de las olimpiadas nacionales de ciencias, física y astronomía para estudiantes de todo Chile.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSearchKeyword("Universidad de Chile");
                    setCurrentView("eventos");
                  }}
                  className="w-full mt-6 bg-[#0acf83] hover:bg-[#09b672] text-slate-900 py-2.5 rounded-xl text-xs font-black border-2 border-[#1e293b] shadow-[3px_3px_0px_0px_#1e293b] cursor-pointer transition-all uppercase tracking-wider text-center"
                >
                  Ver Convocatorias de la U. de Chile →
                </button>
              </div>

            </div>

            {/* Horizontal Ad placement inside bento container */}
            <AdPlacement type="horizontal" id="home-banner-ad-bento" banners={adBanners} />
          </div>
        )}

        {/* Render View: EVENTOS */}
        {currentView === "eventos" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Search Filter Banner */}
            <Banner
              onCategoryToggle={(cat) => {
                setSelectedCategories(prev => 
                  prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                );
              }}
              selectedCategories={selectedCategories}
              onRegionChange={setSelectedRegion}
              selectedRegion={selectedRegion}
              onAudienceChange={setSelectedAudience}
              selectedAudience={selectedAudience}
              onCategorySelectOnly={(cat) => {
                if (cat === "") {
                  setSelectedCategories([]);
                } else {
                  setSelectedCategories([cat]);
                }
              }}
            />

            {/* Horizontal Strip Carousel for Closing Soon Events (Moved here below the banner) */}
            {closingSoonOpps.length > 0 && (
              <div className="bg-amber-100/60 dark:bg-amber-950/20 rounded-3xl p-4 border-2 border-amber-500/30 text-left relative overflow-hidden shadow-[2px_2px_0px_0px_#1e293b]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                    </span>
                    <h2 className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                      ⏳ ¡Postulaciones Cerrando Pronto!
                    </h2>
                  </div>
                  
                  {/* Arrow navigation */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        closingSoonScrollRef.current?.scrollBy({ left: -280, behavior: "smooth" });
                      }}
                      className="p-1 sm:p-1.5 rounded-lg bg-white dark:bg-slate-900 border-2 border-slate-900 text-slate-800 dark:text-slate-200 hover:bg-[#1abcfe] hover:text-white transition-colors cursor-pointer shadow-[1px_1px_0px_0px_#1e293b]"
                      title="Anterior"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        closingSoonScrollRef.current?.scrollBy({ left: 280, behavior: "smooth" });
                      }}
                      className="p-1 sm:p-1.5 rounded-lg bg-white dark:bg-slate-900 border-2 border-slate-900 text-slate-800 dark:text-slate-200 hover:bg-[#1abcfe] hover:text-white transition-colors cursor-pointer shadow-[1px_1px_0px_0px_#1e293b]"
                      title="Siguiente"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Scrolling container */}
                <div 
                  ref={closingSoonScrollRef}
                  className="flex gap-4 overflow-x-auto pb-1 snap-x scroll-smooth scrollbar-none"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {closingSoonOpps.map((opp) => {
                    const daysLeft = Math.ceil(
                      (new Date(opp.applicationDeadline).getTime() - new Date("2026-06-27").getTime()) / (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <div 
                        key={opp.id}
                        onClick={() => handleViewOpportunity(opp)}
                        className="flex-shrink-0 w-64 bg-white dark:bg-slate-900 p-3 rounded-2xl border-2 border-slate-900 dark:border-slate-800 shadow-[2px_2px_0px_0px_#1e293b] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#1e293b] transition-all cursor-pointer flex gap-3 snap-start"
                      >
                        <img 
                          src={opp.imageUrl} 
                          alt={opp.title} 
                          className="w-12 h-12 rounded-lg object-cover border border-slate-900/10 shrink-0"
                        />
                        <div className="min-w-0 flex-1 flex flex-col justify-between text-left">
                          <h3 className="font-display font-black text-xs text-slate-900 dark:text-white truncate" title={opp.title}>
                            {opp.title}
                          </h3>
                          <p className="text-[10px] text-slate-500 truncate">{opp.institutionName}</p>
                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-dashed border-slate-100 dark:border-slate-800">
                            <span className="text-[9px] font-black bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded">
                              ⏳ {daysLeft === 0 ? "Hoy" : daysLeft === 1 ? "Mañana" : `Cierra en ${daysLeft}d`}
                            </span>
                            <span className="text-[8px] text-slate-400 font-extrabold uppercase">{opp.modality}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Eventos Grid Layout: Left (Filtered/Carousels) & Right (Sidebar) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side Content Column (Spans 9 columns on desktop) */}
              <div className="lg:col-span-9 space-y-6 text-left">
                
                {/* Active Filter Tags Indicator */}
                {(selectedCategories.length > 0 || selectedRegion || selectedAudience || selectedCost || searchKeyword) && (
                  <div className="flex items-center justify-between p-4 bg-blue-50/50 dark:bg-blue-950/20 border-2 border-[#1e293b] dark:border-slate-800 rounded-2xl shadow-[2px_2px_0px_0px_#1e293b]">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-extrabold text-slate-800 dark:text-white">Filtros Activos:</span>
                      <span className="font-black px-2 py-0.5 bg-blue-600 text-white rounded-md text-[10px]">{filteredOpportunities.length} hallados</span>
                      {searchKeyword && <span className="bg-slate-100 dark:bg-slate-800 border border-[#1e293b]/10 px-2 py-0.5 rounded text-[10px] font-bold">"{searchKeyword}"</span>}
                      {selectedRegion && <span className="bg-[#1abcfe] text-slate-900 px-2 py-0.5 rounded text-[10px] font-black border border-[#1e293b]">{selectedRegion.replace("Región de ", "")}</span>}
                      {selectedCategories.length > 0 && <span className="bg-[#0acf83] text-slate-900 px-2 py-0.5 rounded text-[10px] font-black border border-[#1e293b]">{selectedCategories.join(", ")}</span>}
                      {selectedAudience && <span className="bg-[#ff7262] text-slate-900 px-2 py-0.5 rounded text-[10px] font-black border border-[#1e293b]">{selectedAudience}</span>}
                    </div>
                    <button
                      onClick={resetAllFilters}
                      className="text-xs font-black text-rose-600 hover:underline cursor-pointer uppercase tracking-wider"
                    >
                      Limpiar
                    </button>
                  </div>
                )}

                {/* Show filtered list or standard visual carousels */}
                {isFiltered ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-dashed border-[#1e293b]/10 dark:border-slate-800 pb-2">
                      <h2 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-4 bg-blue-600 rounded-full" />
                        Convocatorias Filtradas
                      </h2>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase">Búsqueda Federal</span>
                    </div>

                    {filteredOpportunities.length === 0 ? (
                      <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border-3 border-[#1e293b] dark:border-slate-800 shadow-[4px_4px_0px_0px_#1e293b] space-y-3">
                        <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                        <h3 className="text-sm font-black text-slate-700 dark:text-slate-300">No hallamos convocatorias con esos filtros</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">Prueba seleccionando otra región, público objetivo o reseteando la búsqueda.</p>
                        <button
                          onClick={resetAllFilters}
                          className="mt-2 bg-[#1abcfe] hover:bg-[#15a3dc] text-slate-900 text-xs font-black px-4 py-2 border-2 border-[#1e293b] rounded-xl cursor-pointer shadow-[2px_2px_0px_0px_#1e293b]"
                        >
                          Restablecer Filtros
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {filteredOpportunities.map(opp => (
                          <OpportunityCard
                            key={opp.id}
                            opportunity={opp}
                            isFavorited={currentUser.savedFavorites.includes(opp.id)}
                            onFavoriteToggle={handleFavoriteToggle}
                            onViewDetails={handleViewOpportunity}
                            onViewProfile={(id, type) => {
                              setViewingProfileId(id);
                              setViewingProfileType(type);
                              setCurrentView("profile");
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-dashed border-[#1e293b]/10 dark:border-slate-800 pb-2">
                      <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2.5 h-4 bg-[#1abcfe] rounded-full" />
                        Recomendado para Ti 🌟
                      </h2>
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Personalizado</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {dynamicRecommended.map((opp) => (
                        <OpportunityCard
                          key={opp.id}
                          opportunity={opp}
                          isFavorited={currentUser.savedFavorites.includes(opp.id)}
                          onFavoriteToggle={handleFavoriteToggle}
                          onViewDetails={handleViewOpportunity}
                          onViewProfile={(id, type) => {
                            setViewingProfileId(id);
                            setViewingProfileType(type);
                            setCurrentView("profile");
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side Column (Sidebar) (Spans 3 columns on desktop) */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Additional Sidebar Ads */}
                <AdPlacement type="sidebar" id="eventos-sidebar-ad" banners={adBanners} />
              </div>

            </div>

          </div>
        )}

        {/* Render View: AYUDA */}
        {currentView === "ayuda" && (
          <HelpPanel />
        )}

        {/* Render View: ABOUT */}
        {currentView === "about" && (
          <AboutPanel
            onExploreClick={() => setCurrentView("home")}
            onRegisterClick={() => {
              setAuthModalType("register");
              setAuthModalOpen(true);
            }}
            institutionsCount={institutions.length}
            opportunitiesCount={opportunities.length}
          />
        )}

        {/* Render View: FAVORITES */}
        {currentView === "favorites" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span>📌</span> Mi Pizarra de Afiches
                </h2>
                <p className="text-xs text-slate-500">Mantén el seguimiento de los plazos y fechas límite para tus actividades guardadas.</p>
              </div>
              <button
                onClick={() => setCurrentView("home")}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Volver al catálogo
              </button>
            </div>

            {currentUser.savedFavorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4 bg-[#ffe3e1]/10 dark:bg-slate-950/20 border-3 border-dashed border-[#ff7262]/40 rounded-3xl max-w-lg mx-auto">
                <span className="text-4xl filter drop-shadow-md">📌</span>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">¡Aún no has fijado afiches en tu pizarra!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                  Explora las convocatorias escolares en el inicio y haz clic en el icono de estrella para guardarlas como favoritas y fijarlas aquí.
                </p>
                <button
                  onClick={() => setCurrentView("home")}
                  className="bg-[#0acf83] hover:bg-[#08b874] text-white text-xs font-black uppercase tracking-wider py-2.5 px-6 border-2 border-[#1e293b] rounded-xl shadow-[2px_2px_0px_0px_#1e293b] active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_0px_#1e293b] transition-all cursor-pointer"
                >
                  Explorar convocatorias
                </button>
              </div>
            ) : (
              <div className="bg-[#ffe3e1]/20 dark:bg-slate-950/40 border border-dashed border-[#ff7262] p-4 sm:p-5 rounded-3xl min-h-[400px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
                  {opportunities
                    .filter(o => currentUser.savedFavorites.includes(o.id))
                    .map((opp, idx) => {
                      const tiltClass = idx % 3 === 0 
                        ? "-rotate-1 hover:rotate-0" 
                        : idx % 3 === 1 
                        ? "rotate-1 hover:rotate-0" 
                        : "rotate-2 hover:rotate-0";

                      return (
                        <div
                          key={opp.id}
                          onClick={() => handleViewOpportunity(opp)}
                          className={`relative group bg-white dark:bg-slate-900 p-2.5 border border-[#1e293b] dark:border-slate-800 shadow-[3px_3px_0px_0px_#1e293b] dark:shadow-[3px_3px_0px_0px_#1e293b] rounded-xl hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_#1e293b] transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[220px] ${tiltClass}`}
                        >
                          {/* Push-pin decoration */}
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl z-20 filter drop-shadow-[0_1.5px_1px_rgba(0,0,0,0.3)]">
                            📌
                          </div>

                          {/* Image box */}
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
                              
                              {/* Fast Star Toggle inside board to remove directly */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFavoriteToggle(opp.id);
                                }}
                                className="absolute top-1 right-1 p-1 bg-white dark:bg-slate-800 border border-[#1e293b] dark:border-slate-700 rounded-md text-amber-400 hover:scale-110 active:scale-95 transition-all shadow-[1px_1px_0px_0px_#1e293b]"
                                title="Quitar de favoritos"
                              >
                                ★
                              </button>
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

                          <div className="flex flex-col gap-0.5 pt-1.5 mt-2 border-t border-dashed border-slate-200 dark:border-slate-800 text-[8px] font-bold text-slate-500 dark:text-slate-400">
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
            )}
          </div>
        )}

        {/* Render View: PUBLISHER */}
        {currentView === "publisher" && getActiveInstitution() && (
          <DashboardPublicador
            institution={getActiveInstitution()!}
            opportunities={opportunities}
            onAddOpportunity={handleAddOpportunity}
            onUpdateOpportunity={handleUpdateOpportunity}
            onDeleteOpportunity={handleDeleteOpportunity}
            onUpdateInstitution={(updated) => {
              setInstitutions(prev => prev.map(i => i.id === updated.id ? updated : i));
              alert("Información institucional actualizada de forma correcta.");
            }}
            userQuestions={userQuestions}
            onAnswerQuestion={handleAnswerQuestion}
            onPublishQuestionToFaq={handlePublishQuestionToFaq}
            initialEditingOpp={initialEditingOpp}
            onClearInitialEditingOpp={() => setInitialEditingOpp(null)}
          />
        )}

        {/* Render View: PROFILE */}
        {currentView === "profile" && (
          <ProfilePanel
            profileId={
              viewingProfileId || 
              ((currentUser.role === Role.InstitutionalVerified || currentUser.role === Role.InstitutionalPending) && currentUser.institutionId
                ? currentUser.institutionId 
                : currentUser.id)
            }
            profileType={
              viewingProfileType || 
              (currentUser.role === Role.InstitutionalVerified || currentUser.role === Role.InstitutionalPending
                ? "institution" 
                : "user")
            }
            currentUser={currentUser}
            institutions={institutions}
            opportunities={opportunities}
            reviews={reviews}
            onAddReview={handleAddReview}
            onUpdateInstitution={handleUpdateInstitution}
            onUpdateUser={handleUpdateUser}
            onViewOpportunity={handleViewOpportunity}
            onClose={() => {
              setCurrentView("home");
              setViewingProfileId(null);
              setViewingProfileType(null);
            }}
            users={users}
            onFollowToggle={handleFollowToggle}
            onViewProfile={(id, type) => {
              setViewingProfileId(id);
              setViewingProfileType(type);
              setCurrentView("profile");
            }}
            onVerifyUser={handleVerifyUser}
            onNavigate={setCurrentView}
            onEditOpportunity={(opp) => {
              setInitialEditingOpp(opp);
              setCurrentView("publisher");
            }}
          />
        )}

        {/* Render View: ADMIN */}
        {currentView === "admin" && (
          <DashboardAdmin
            pendingInstitutions={institutions.filter(i => !i.verified)}
            onApproveInstitution={handleApproveInstitution}
            onRejectInstitution={handleRejectInstitution}
            opportunities={opportunities}
            onToggleFeatureOpportunity={handleToggleFeatureOpportunity}
            onDeleteOpportunity={handleDeleteOpportunity}
            onAddOpportunity={handleAddOpportunity}
            newsArticles={newsArticles}
            onAddNewsArticle={handleAddNewsArticle}
            onUpdateNewsArticle={handleUpdateNewsArticle}
            onDeleteNewsArticle={handleDeleteNewsArticle}
            adBanners={adBanners}
            onAddAdBanner={handleAddAdBanner}
            onUpdateAdBanner={handleUpdateAdBanner}
            onDeleteAdBanner={handleDeleteAdBanner}
            onToggleAdActive={handleToggleAdActive}
          />
        )}

      </main>

      {/* Role Switcher administrative preview console (at the bottom) */}
      <RoleSwitcher
        currentUser={currentUser}
        onRoleChange={handleRoleChangeSimulated}
      />

      {/* FOOTER */}
      <footer className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-slate-400 text-center text-[10px] space-y-2">
        <p className="font-bold uppercase tracking-widest text-slate-500">Portal Único de Oportunidades de Formación y Cultura • Chile 2026</p>
        <p>Inspirado en los estándares de accesibilidad WCAG 2.2 AA y lineamientos del Portal Único del Estado.</p>
        <p>© Todos los derechos reservados. Las oportunidades publicadas son responsabilidad exclusiva de sus respectivas entidades verificadas.</p>
      </footer>

      {/* Details Dialog / Modal */}
      {activeDetailOpp && (
        <OpportunityDetail
          opportunity={activeDetailOpp}
          isFavorited={currentUser.savedFavorites.includes(activeDetailOpp.id)}
          onFavoriteToggle={handleFavoriteToggle}
          onClose={() => setActiveDetailOpp(null)}
          onRegisterDerivation={handleRegisterDerivation}
          banners={adBanners}
          currentUser={currentUser}
          onSubmitQuestion={handleSendQuestion}
          onViewProfile={(id, type) => {
            setViewingProfileId(id);
            setViewingProfileType(type);
            setCurrentView("profile");
          }}
        />
      )}

      {/* Authentication & Signup Modals */}
      <AuthModals
        isOpen={authModalOpen}
        type={authModalType}
        onClose={() => { setAuthModalOpen(false); setAuthModalType(null); }}
        onSuccess={handleAuthSuccess}
      />

      </div>
    </div>
  );
}
