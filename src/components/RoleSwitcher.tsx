/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Role, User } from "../types";
import { Shield, User as UserIcon, Building2, UserCheck, Eye, Sparkles } from "lucide-react";

interface RoleSwitcherProps {
  currentUser: User;
  onRoleChange: (role: Role) => void;
}

export default function RoleSwitcher({ currentUser, onRoleChange }: RoleSwitcherProps) {
  const roles = [
    {
      role: Role.Visitor,
      label: "Visitante 👁️",
      description: "Navega, busca y comparte libremente. No puede registrar favoritos permanentes ni publicar.",
      icon: Eye,
      baseBg: "bg-white text-slate-700 hover:bg-[#ff7262]/10",
      activeBg: "bg-[#ff7262] text-slate-900 border-3 border-[#1e293b] shadow-[2.5px_2.5px_0px_0px_#1e293b]",
    },
    {
      role: Role.Registered,
      label: "Usuario Registrado 👤",
      description: "Puede guardar favoritos, suscribirse a categorías e instituciones, y recibir notificaciones.",
      icon: UserIcon,
      baseBg: "bg-white text-slate-700 hover:bg-[#0acf83]/10",
      activeBg: "bg-[#0acf83] text-white border-3 border-[#1e293b] shadow-[2.5px_2.5px_0px_0px_#1e293b]",
    },
    {
      role: Role.InstitutionalPending,
      label: "Institución (Pendiente) ⏳",
      description: "Representa a una entidad en validación. No puede publicar hasta que el Admin apruebe sus datos.",
      icon: Building2,
      baseBg: "bg-white text-slate-700 hover:bg-[#f24e1e]/10",
      activeBg: "bg-[#f24e1e] text-white border-3 border-[#1e293b] shadow-[2.5px_2.5px_0px_0px_#1e293b]",
    },
    {
      role: Role.InstitutionalVerified,
      label: "Publicador Verificado 🐮",
      description: "Institución verificada (✔). Acceso al panel para publicar, duplicar y ver métricas avanzadas.",
      icon: UserCheck,
      baseBg: "bg-white text-slate-700 hover:bg-[#1abcfe]/10",
      activeBg: "bg-[#1abcfe] text-slate-900 border-3 border-[#1e293b] shadow-[2.5px_2.5px_0px_0px_#1e293b]",
    },
    {
      role: Role.Admin,
      label: "Administrador 👑",
      description: "Verifica postulaciones de instituciones, modera contenidos, destaca banners y gestiona reportes.",
      icon: Shield,
      baseBg: "bg-white text-slate-700 hover:bg-[#a259ff]/10",
      activeBg: "bg-[#a259ff] text-white border-3 border-[#1e293b] shadow-[2.5px_2.5px_0px_0px_#1e293b]",
    },
  ];

  return (
    <div id="role-switcher-container" className="bg-[#ffe3e1]/30 border-t-3 border-b-3 border-[#1e293b] py-6 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-slate-900" />
              Consola de Simulación de Roles 🎮
            </h3>
            <p className="text-xs text-slate-700 font-bold mt-1">
              Como evaluador, puedes alternar instantáneamente entre los distintos perfiles para validar el comportamiento del sistema.
            </p>
          </div>
          <div className="mt-2 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-black text-slate-800">Rol activo:</span>
            <span className={`text-xs font-black px-3 py-1 rounded-xl border-2 border-[#1e293b] uppercase tracking-wider ${
              currentUser.role === Role.Admin ? "bg-[#a259ff] text-white shadow-[1.5px_1.5px_0px_0px_#1e293b]" :
              currentUser.role === Role.InstitutionalVerified ? "bg-[#1abcfe] text-slate-900 shadow-[1.5px_1.5px_0px_0px_#1e293b]" :
              currentUser.role === Role.InstitutionalPending ? "bg-[#f24e1e] text-white shadow-[1.5px_1.5px_0px_0px_#1e293b]" :
              currentUser.role === Role.Registered ? "bg-[#0acf83] text-white shadow-[1.5px_1.5px_0px_0px_#1e293b]" :
              "bg-[#ff7262] text-slate-900 shadow-[1.5px_1.5px_0px_0px_#1e293b]"
            }`}>
              {currentUser.role === Role.Admin && "Administrador 👑"}
              {currentUser.role === Role.InstitutionalVerified && "Publicador Verificado 🐮"}
              {currentUser.role === Role.InstitutionalPending && "Institución Pendiente ⏳"}
              {currentUser.role === Role.Registered && "Usuario Registrado 👤"}
              {currentUser.role === Role.Visitor && "Visitante 👁️"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {roles.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentUser.role === item.role;
            return (
              <button
                key={item.role}
                id={`btn-role-${item.role.toLowerCase()}`}
                onClick={() => onRoleChange(item.role)}
                className={`flex flex-col text-left p-4 rounded-2xl border-2 border-[#1e293b] transition-all cursor-pointer ${
                  isActive 
                    ? `${item.activeBg} scale-102` 
                    : `${item.baseBg} shadow-[2px_2px_0px_0px_#1e293b] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#1e293b]`
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <IconComponent className="w-4 h-4 text-slate-900" />
                  <span className="text-xs font-black tracking-wide text-slate-900">{item.label}</span>
                </div>
                <p className={`text-[11px] leading-relaxed font-bold ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
