/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Bell, LogIn, UserPlus, LogOut, 
  BookOpen, Star, Building, ShieldCheck, Sun, Moon, Menu, X, CheckSquare, Info, ChevronRight, Calendar, HelpCircle
} from "lucide-react";
import { User, Role, Notification, Institution } from "../types";

interface NavbarProps {
  currentUser: User;
  notifications: Notification[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearNotifications: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogoutClick: () => void;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  favoritesCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onViewFavorites: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  institutions?: Institution[];
  users?: User[];
  onViewProfile?: (id: string, type: "user" | "institution") => void;
  sidebarVisible?: boolean;
  onToggleSidebar?: () => void;
}

export default function Navbar({
  currentUser,
  notifications,
  onMarkNotificationAsRead,
  onClearNotifications,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
  searchKeyword,
  onSearchChange,
  favoritesCount,
  darkMode,
  onToggleDarkMode,
  onViewFavorites,
  currentView,
  onNavigate,
  institutions = [],
  users = [],
  onViewProfile,
  sidebarVisible = true,
  onToggleSidebar
}: NavbarProps) {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setShowUserDropdown(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(target)) {
        setShowNotifDropdown(false);
      }
      if (showMobileMenu) {
        const mobileMenuBtn = document.getElementById("mobile-menu-btn");
        const mobileAvatarBtn = document.getElementById("mobile-user-avatar-btn");
        if (
          (mobileMenuBtn && mobileMenuBtn.contains(target)) ||
          (mobileAvatarBtn && mobileAvatarBtn.contains(target))
        ) {
          return;
        }
        setShowMobileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("touchstart", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
    };
  }, [showMobileMenu]);

  const isInstitution = currentUser.role === Role.InstitutionalVerified || currentUser.role === Role.InstitutionalPending;
  const targetInstitution = isInstitution && currentUser.institutionId
    ? institutions.find(i => i.id === currentUser.institutionId)
    : null;
  const navbarAvatar = isInstitution
    ? (targetInstitution?.logo || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&q=80")
    : (currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80");

  const displayName = isInstitution && targetInstitution ? targetInstitution.name : currentUser.name;
  const displayEmail = isInstitution && targetInstitution ? targetInstitution.email : currentUser.email;

  return (
    <nav id="main-navigation" className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Left Side: Logo & Brand */}
          <div className="flex items-center gap-4">
            {onToggleSidebar && (
              <button
                id="sidebar-toggle-btn"
                onClick={onToggleSidebar}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-[#1e293b] dark:border-slate-700 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#1e293b] hover:-translate-y-0.5 active:translate-y-0 focus:outline-hidden"
                title={sidebarVisible ? "Ocultar menú" : "Mostrar menú"}
              >
                <Menu className="w-4 h-4 text-slate-800 dark:text-slate-100" />
              </button>
            )}

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("home")}>
              <div className="w-10 h-10 rounded-xl bg-[#1abcfe] border-2 border-[#1e293b] flex items-center justify-center text-slate-900 shadow-[3px_3px_0px_0px_#1e293b] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_#1e293b] transition-all">
                <BookOpen className="w-5.5 h-5.5 text-slate-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white leading-none hover:text-[#1abcfe] transition-colors">
                  Convocatorias Escolares
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Chile
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links (Moved to Left Sidebar) */}
            <div className="hidden">
              <button
                id="nav-link-home"
                onClick={() => onNavigate("home")}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentView === "home"
                    ? "bg-[#0acf83] text-slate-900 border-2 border-[#1e293b] shadow-[2px_2px_0px_0px_#1e293b] -translate-y-0.5"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent"
                }`}
              >
                Inicio 🏠
              </button>
              <button
                id="nav-link-about"
                onClick={() => onNavigate("about")}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentView === "about"
                    ? "bg-[#a259ff] text-slate-900 border-2 border-[#1e293b] shadow-[2px_2px_0px_0px_#1e293b] -translate-y-0.5"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent"
                }`}
              >
                Nosotros 👋
              </button>
            </div>
          </div>

          {/* Center: Search Field in Navbar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                id="nav-search-input"
                type="text"
                placeholder="Buscar talleres, becas, museos..."
                value={searchKeyword}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (currentView !== "home") onNavigate("home");
                }}
                className="block w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {searchKeyword && (
                <button
                  id="clear-nav-search"
                  onClick={() => onSearchChange("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* View navigation based on roles */}
            {currentUser.role === Role.Admin && (
              <button
                id="nav-admin-panel"
                onClick={() => onNavigate("admin")}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentView === "admin"
                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                    : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Consola Admin
              </button>
            )}

            {(currentUser.role === Role.InstitutionalVerified || currentUser.role === Role.InstitutionalPending) && currentView !== "profile" && currentView !== "publisher" && (
              <button
                id="nav-pub-panel"
                onClick={() => {
                  if (currentUser.role === Role.InstitutionalVerified) {
                    onNavigate("publisher");
                  } else {
                    alert("Tu cuenta aún se encuentra pendiente de validación por parte del administrador.");
                  }
                }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentView === "publisher"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                    : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                }`}
              >
                <Building className="w-4 h-4" />
                Panel Publicador
                {currentUser.role === Role.InstitutionalPending && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            )}

            {/* Favorites Counter for Registered users */}
            {currentUser.role !== Role.Visitor && (
              <button
                id="nav-favorites-btn"
                onClick={onViewFavorites}
                className={`p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative flex items-center gap-1 ${
                  currentView === "favorites" ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40" : ""
                }`}
                title="Mis Favoritos"
              >
                <Star className={`w-4 h-4 ${favoritesCount > 0 ? "fill-amber-400 text-amber-400" : ""}`} />
                {favoritesCount > 0 && (
                  <span className="text-xs font-bold px-1.5 py-0.2 bg-blue-600 text-white rounded-full">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            {/* Notification system */}
            <div ref={notifDropdownRef} className="relative">
              <button
                id="notification-bell"
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
                aria-label="Notificaciones"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifDropdown && (
                <div id="notification-dropdown" className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">Notificaciones ({unreadCount})</span>
                    {unreadCount > 0 && (
                      <button
                        id="clear-all-notifications"
                        onClick={() => {
                          onClearNotifications();
                          setShowNotifDropdown(false);
                        }}
                        className="text-[10px] font-semibold text-blue-600 hover:text-blue-500"
                      >
                        Marcar todo leído
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-400">
                        No tienes notificaciones
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          id={`notification-${notif.id}`}
                          onClick={() => {
                            onMarkNotificationAsRead(notif.id);
                            if (notif.opportunityId) {
                              onNavigate("home");
                              // Handle detailed modal open if needed
                            }
                          }}
                          className={`px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-slate-50 dark:border-slate-700/30 flex gap-2 transition-colors ${
                            !notif.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                          }`}
                        >
                          <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-500 shrink-0" style={{ opacity: notif.read ? 0 : 1 }} />
                          <div className="flex-1 space-y-0.5">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{notif.title}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{notif.message}</p>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 block">{notif.date}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Session Buttons */}
            {currentUser.role === Role.Visitor ? (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={onLoginClick}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-4 h-4" />
                  Ingresar
                </button>
                <button
                  id="nav-register-btn"
                  onClick={onRegisterClick}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrarse
                </button>
              </div>
            ) : (
              currentView !== "profile" && currentView !== "publisher" ? (
                <div ref={userDropdownRef} className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800 relative">
                  <div 
                    id="nav-user-profile-trigger"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 cursor-pointer group hover:opacity-85"
                    title="Opciones de Perfil"
                  >
                    <img 
                      src={navbarAvatar} 
                      alt={displayName} 
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-bold text-slate-800 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {displayName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                        {displayEmail}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-3 px-4 space-y-3 z-50">
                      <div>
                        <button
                          onClick={() => {
                            onNavigate("profile");
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-xs font-black text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span>Mi Perfil</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Following Section */}
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-2 space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-2">
                          Siguiendo
                        </span>
                        
                        {/* Followed Institutions & Users list */}
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {((currentUser.followedInstitutions && currentUser.followedInstitutions.length > 0) || 
                            (currentUser.followedUsers && currentUser.followedUsers.length > 0)) ? (
                            <>
                              {currentUser.followedInstitutions?.map(instId => {
                                const inst = institutions.find(i => i.id === instId);
                                if (!inst) return null;
                                return (
                                  <button
                                    key={inst.id}
                                    onClick={() => {
                                      onViewProfile && onViewProfile(inst.id, "institution");
                                      setShowUserDropdown(false);
                                    }}
                                    className="w-full text-left flex items-center gap-2 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                  >
                                    <img 
                                      src={inst.logo} 
                                      alt={inst.name} 
                                      className="w-5 h-5 rounded object-cover"
                                    />
                                    <span className="truncate flex-1 font-bold">{inst.name}</span>
                                  </button>
                                );
                              })}

                              {currentUser.followedUsers?.map(usrId => {
                                const usr = users.find(u => u.id === usrId);
                                if (!usr) return null;
                                return (
                                  <button
                                    key={usr.id}
                                    onClick={() => {
                                      onViewProfile && onViewProfile(usr.id, "user");
                                      setShowUserDropdown(false);
                                    }}
                                    className="w-full text-left flex items-center gap-2 p-1.5 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg text-[10px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                  >
                                    <img 
                                      src={usr.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80"} 
                                      alt={usr.name} 
                                      className="w-5 h-5 rounded-full object-cover"
                                    />
                                    <span className="truncate flex-1 font-bold">{usr.name}</span>
                                  </button>
                                );
                              })}
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 italic block px-2 py-1">
                              No sigues a nadie aún
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                        <button
                          onClick={() => {
                            onLogoutClick();
                            setShowUserDropdown(false);
                          }}
                          className="w-full text-left py-1.5 px-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span>Cerrar Sesión</span>
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    id="nav-logout-btn"
                    onClick={onLogoutClick}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Cerrar Sesión"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              ) : null
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-2">
            {/* Circular user avatar next to the menu bars */}
            <button
              id="mobile-user-avatar-btn"
              onClick={() => {
                onNavigate("profile");
                setShowMobileMenu(false);
              }}
              className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#1abcfe] transition-all cursor-pointer mr-1"
              title="Ir a mi Perfil"
            >
              <img 
                src={navbarAvatar} 
                alt={displayName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>

            <button
              id="mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Open */}
      {showMobileMenu && (
        <div ref={mobileMenuRef} id="mobile-navigation-dropdown" className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2">
          
          {/* Quick Search for Mobile */}
          <div className="relative my-2">
            <input
              type="text"
              placeholder="Buscar oportunidades..."
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Quick links for mobile */}
          <button
            onClick={() => { onNavigate("home"); setShowMobileMenu(false); }}
            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-2 ${
              currentView === "home" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Inicio
          </button>

          <button
            onClick={() => { onNavigate("eventos"); setShowMobileMenu(false); }}
            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-2 ${
              currentView === "eventos" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Eventos
          </button>

          <button
            onClick={() => { onNavigate("about"); setShowMobileMenu(false); }}
            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-2 ${
              currentView === "about" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
            }`}
          >
            <Info className="w-4 h-4" />
            Nosotros
          </button>

          <button
            onClick={() => { onNavigate("ayuda"); setShowMobileMenu(false); }}
            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg flex items-center gap-2 ${
              currentView === "ayuda" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Ayuda
          </button>

          {currentUser.role === Role.Admin && (
            <button
              onClick={() => { onNavigate("admin"); setShowMobileMenu(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Consola Admin
            </button>
          )}

          {(currentUser.role === Role.InstitutionalVerified || currentUser.role === Role.InstitutionalPending) && (
            <button
              onClick={() => {
                if (currentUser.role === Role.InstitutionalVerified) {
                  onNavigate("publisher");
                } else {
                  alert("Pendiente de validación");
                }
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg flex items-center gap-2"
            >
              <Building className="w-4 h-4" />
              Panel Publicador
            </button>
          )}

          {currentUser.role !== Role.Visitor && (
            <button
              onClick={() => { onNavigate("favorites"); setShowMobileMenu(false); }}
              className="w-full text-left px-3 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Mis Favoritos ({favoritesCount})
            </button>
          )}

          <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
            {currentUser.role === Role.Visitor ? (
              <div className="space-y-1">
                <button
                  onClick={() => { onLoginClick(); setShowMobileMenu(false); }}
                  className="w-full text-center py-2 text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg"
                >
                  Ingresar
                </button>
                <button
                  onClick={() => { onRegisterClick(); setShowMobileMenu(false); }}
                  className="w-full text-center py-2 text-xs font-bold bg-blue-600 text-white rounded-lg"
                >
                  Registrarse
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-1">
                <div 
                  onClick={() => { onNavigate("profile"); setShowMobileMenu(false); }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <img 
                    src={navbarAvatar} 
                    alt={displayName} 
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-800 shadow-xs"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{displayName}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{displayEmail}</span>
                  </div>
                </div>
                <button
                  onClick={() => { onLogoutClick(); setShowMobileMenu(false); }}
                  className="p-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}
