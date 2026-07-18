/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Home, Calendar, Users, HelpCircle, User, LogIn, LogOut, 
  ShieldCheck, Building, BookOpen, Star, ChevronLeft, ChevronRight, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User as UserType, Institution, Role } from "../types";

interface SidebarProps {
  currentUser: UserType;
  institutions: Institution[];
  currentView: string;
  onNavigate: (view: string) => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onViewFavorites?: () => void;
  favoritesCount?: number;
  onCollapse?: () => void;
  users?: UserType[];
  onViewProfile?: (id: string, type: "user" | "institution") => void;
}

export default function Sidebar({
  currentUser,
  institutions,
  currentView,
  onNavigate,
  onLoginClick,
  onLogoutClick,
  onViewFavorites,
  favoritesCount = 0,
  onCollapse,
  users = [],
  onViewProfile
}: SidebarProps) {
  const isLoggedIn = currentUser && currentUser.id !== "visitor-session" && currentUser.role !== Role.Visitor;
  
  const isInstitution = currentUser.role === Role.InstitutionalVerified || currentUser.role === Role.InstitutionalPending;
  const targetInstitution = isInstitution && currentUser.institutionId 
    ? institutions.find(i => i.id === currentUser.institutionId)
    : null;

  const avatarUrl = isInstitution
    ? (targetInstitution?.logo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&q=80")
    : (currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80");

  const displayName = isInstitution && targetInstitution ? targetInstitution.name : currentUser.name;
  const displayRole = isInstitution 
    ? (currentUser.role === Role.InstitutionalVerified ? "Institución Verificada" : "Pendiente de Validación")
    : (currentUser.role === Role.Admin ? "Administrador" : "Estudiante / Visitante");

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const handleProfileCardClick = () => {
    if (!isLoggedIn) {
      onLoginClick();
    } else {
      setShowUserMenu(!showUserMenu);
    }
  };

  const navItems = [
    { id: "home", label: "Inicio 🏠", icon: <Home className="w-4 h-4" /> },
    { id: "eventos", label: "Eventos 📅", icon: <Calendar className="w-4 h-4" /> },
    { id: "about", label: "Nosotros 👋", icon: <Users className="w-4 h-4" /> },
    { id: "ayuda", label: "Ayuda 🙋‍♂️", icon: <HelpCircle className="w-4 h-4" /> }
  ];

  return (
    <aside 
      id="left-sidebar-navigation" 
      className="w-64 bg-white dark:bg-slate-900 border-r-3 border-[#1e293b] dark:border-slate-800 flex flex-col justify-between p-5 h-full relative"
    >
      {/* Cartoon Background Decals */}
      <div className="absolute top-4 right-4 text-xs opacity-15 pointer-events-none select-none">✨</div>
      <div className="absolute bottom-20 left-4 text-sm opacity-15 pointer-events-none select-none">🎯</div>

      <div className="space-y-6">
        {/* Brand Header */}
        <div 
          className="flex items-center gap-2.5 pb-4 border-b-2 border-dashed border-[#1e293b]/10 dark:border-slate-800/60 cursor-pointer group"
          onClick={() => onNavigate("home")}
        >
          <div className="w-9 h-9 rounded-xl bg-[#1abcfe] border-2 border-[#1e293b] flex items-center justify-center text-slate-900 shadow-[2px_2px_0px_0px_#1e293b] group-hover:-translate-y-0.5 transition-transform">
            <BookOpen className="w-5 h-5 text-slate-900" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Convocatorias
            </span>
            <span className="text-[9px] text-[#1abcfe] font-extrabold uppercase tracking-widest mt-0.5">
              Escolares Chile
            </span>
          </div>
        </div>

        {/* Main Navigation links */}
        <div className="space-y-2 pt-2">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block text-left pl-2">
            Navegación
          </span>
          
          <div className="space-y-1">
            {/* Standard Nav Items */}
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              
              // Color themes for active states
              let activeBg = "bg-[#0acf83] text-slate-900"; // Default green for Inicio
              if (item.id === "eventos") activeBg = "bg-[#1abcfe] text-slate-900";
              if (item.id === "about") activeBg = "bg-[#a259ff] text-slate-900";
              if (item.id === "ayuda") activeBg = "bg-[#ffc72c] text-slate-900";

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 border-2 transition-all cursor-pointer ${
                    isActive
                      ? `${activeBg} border-[#1e293b] shadow-[3px_3px_0px_0px_#1e293b] -translate-y-0.5`
                      : "text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Pizarra de favoritos inside sidebar navigation for better access if logged in */}
            {isLoggedIn && onViewFavorites && (
              <button
                onClick={onViewFavorites}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-black flex items-center justify-between border-2 transition-all cursor-pointer ${
                  currentView === "favorites"
                    ? "bg-[#ff94e0] text-slate-900 border-[#1e293b] shadow-[3px_3px_0px_0px_#1e293b] -translate-y-0.5"
                    : "text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Favoritos 📌</span>
                </span>
                {favoritesCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-slate-900 text-white text-[9px] rounded-full font-black border border-white">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Roles management shortcuts */}
        {isLoggedIn && (currentUser.role === Role.Admin || currentUser.role === Role.InstitutionalVerified || currentUser.role === Role.InstitutionalPending) && (
          <div className="space-y-2 pt-2">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block text-left pl-2">
              Gestión
            </span>
            
            <div className="space-y-1">
              {currentUser.role === Role.Admin && (
                <button
                  onClick={() => onNavigate("admin")}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 border-2 transition-all cursor-pointer ${
                    currentView === "admin"
                      ? "bg-slate-900 text-white border-[#1e293b] shadow-[3px_3px_0px_0px_#1e293b] -translate-y-0.5"
                      : "text-rose-600 dark:text-rose-400 border-transparent hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Consola Admin 🛡️</span>
                </button>
              )}

              {(currentUser.role === Role.InstitutionalVerified || currentUser.role === Role.InstitutionalPending) && (
                <button
                  onClick={() => {
                    if (currentUser.role === Role.InstitutionalVerified) {
                      onNavigate("publisher");
                    } else {
                      alert("Tu cuenta aún se encuentra pendiente de validación por parte del administrador.");
                    }
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 border-2 transition-all cursor-pointer ${
                    currentView === "publisher"
                      ? "bg-[#0acf83] text-slate-900 border-[#1e293b] shadow-[3px_3px_0px_0px_#1e293b] -translate-y-0.5"
                      : "text-emerald-600 dark:text-emerald-400 border-transparent hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span className="truncate flex-1 text-left">Panel Publicador 🏢</span>
                  {currentUser.role === Role.InstitutionalPending && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Footer / Login Actions */}
      <div className="border-t-2 border-dashed border-[#1e293b]/10 dark:border-slate-800/60 pt-4 mt-auto">
        {isLoggedIn ? (
          <button
            onClick={onLogoutClick}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-black flex items-center gap-2.5 text-blue-600 dark:text-[#1abcfe] hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión 🔐</span>
          </button>
        )}
      </div>
    </aside>
  );
}
