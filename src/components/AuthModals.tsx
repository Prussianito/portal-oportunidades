/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { X, Building2, User as UserIcon, CheckCircle2, ShieldAlert, Upload } from "lucide-react";
import { Role, User, Institution } from "../types";
import { INSTITUTION_TYPES } from "../data";

interface AuthModalsProps {
  isOpen: boolean;
  type: "login" | "register" | null;
  onClose: () => void;
  onSuccess: (user: User, institution?: Institution) => void;
}

export default function AuthModals({ isOpen, type, onClose, onSuccess }: AuthModalsProps) {
  const [activeTab, setActiveTab] = useState<"personal" | "institutional">("personal");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  // Institutional fields
  const [instName, setInstName] = useState("");
  const [instRut, setInstRut] = useState("");
  const [instType, setInstType] = useState(INSTITUTION_TYPES[0]);
  const [instWebsite, setInstWebsite] = useState("");
  const [instRole, setInstRole] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState("");

  const isInstitutionalEmail = (emailStr: string): boolean => {
    if (!emailStr || !emailStr.includes("@")) return false;
    const domain = emailStr.split("@")[1].toLowerCase().trim();
    
    // List of common free or personal email domains
    const personalDomains = [
      "gmail.com", "gmail.cl", "gmail.es",
      "hotmail.com", "hotmail.cl", "hotmail.es", "hotmail.fr",
      "outlook.com", "outlook.cl", "outlook.es", "outlook.fr",
      "yahoo.com", "yahoo.es", "yahoo.cl", "yahoo.co.uk",
      "live.com", "live.cl", "live.es", "live.com.mx",
      "icloud.com", "me.com", "mac.com",
      "aol.com", "msn.com", "zoho.com", "zoho.cl",
      "protonmail.com", "proton.me", "tutamail.com", "tutanota.com",
      "gmx.com", "gmx.es", "gmx.de", "mail.com", "yandex.com",
      "fastmail.com", "inbox.com"
    ];
    
    return !personalDomains.includes(domain);
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (emailValidationError) {
      setEmailValidationError("");
    }
  };

  const handleTabChange = (tab: "personal" | "institutional") => {
    setActiveTab(tab);
    setEmailValidationError("");
  };

  // Reset states on close
  useEffect(() => {
    if (!isOpen) {
      setEmailValidationError("");
      setEmail("");
      setPassword("");
      setFullName("");
      setInstName("");
      setInstRut("");
      setInstWebsite("");
      setInstRole("");
      setUploadedFile(null);
      setFileError("");
    }
  }, [isOpen]);

  if (!isOpen || !type) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError("El archivo no debe superar los 5MB");
        setUploadedFile(null);
      } else {
        setFileError("");
        setUploadedFile(file);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "login") {
      // Simulate login
      const defaultUser: User = {
        id: "simulated-user-" + Date.now(),
        name: email.split("@")[0] || "Usuario",
        email: email || "usuario@ejemplo.cl",
        role: email.includes("admin") ? Role.Admin : 
              email.includes("inst") ? Role.InstitutionalVerified : Role.Registered,
        savedFavorites: [],
        subscribedCategories: []
      };
      onSuccess(defaultUser);
      onClose();
    } else {
      // Register - Enforce institutional email
      if (!isInstitutionalEmail(email)) {
        setEmailValidationError(
          "El correo para registrarse debe ser institucional (ej: @colegio.cl, @universidad.edu, @ong.org, @empresa.cl). No se permiten correos de uso personal (Gmail, Hotmail, Yahoo, Outlook, etc.)."
        );
        return;
      }
      setEmailValidationError("");

      if (activeTab === "personal") {
        const newUser: User = {
          id: "user-" + Date.now(),
          name: fullName || "Nuevo Usuario",
          email: email || "usuario@ejemplo.cl",
          role: Role.Registered,
          savedFavorites: [],
          subscribedCategories: []
        };
        onSuccess(newUser);
        onClose();
      } else {
        // Institutional registration (creates a pending institutional user and institution)
        const instId = "inst-" + Date.now();
        const newInstitution: Institution = {
          id: instId,
          name: instName || "Institución Postulante",
          rut: instRut || "76.111.222-3",
          website: instWebsite || "https://institucion.cl",
          email: email || "contacto@institucion.cl",
          contactName: fullName || "Funcionario",
          contactRole: instRole || "Coordinador",
          verified: false,
          logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&h=150&fit=crop&q=80",
          description: `Institución de tipo ${instType} dedicada al desarrollo de oportunidades educativas y culturales en Chile.`,
          documentName: uploadedFile ? uploadedFile.name : "Acreditacion_Pertenencia.pdf"
        };

        const newUser: User = {
          id: "user-inst-" + Date.now(),
          name: fullName || "Representante Institucional",
          email: email || "contacto@institucion.cl",
          role: Role.InstitutionalPending,
          institutionId: instId,
          savedFavorites: [],
          subscribedCategories: []
        };

        setRegistrationSuccess(true);
        setTimeout(() => {
          onSuccess(newUser, newInstitution);
          setRegistrationSuccess(false);
          onClose();
        }, 3000);
      }
    }
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300">
      <div id="auth-modal-content" className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {type === "login" ? "Iniciar Sesión" : "Crear una Cuenta"}
          </h2>
          <button 
            id="close-auth-modal"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {registrationSuccess ? (
          <div className="flex flex-col items-center justify-center p-8 text-center flex-1">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Solicitud de Validación Registrada</h3>
            <p className="text-sm text-slate-600 max-w-sm mb-4 leading-relaxed">
              Hemos registrado los datos de <strong>{instName}</strong>. Tu cuenta se encuentra en estado <span className="font-semibold text-amber-600">Pendiente de Validación</span>.
            </p>
            <div className="bg-amber-50 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2 max-w-sm text-left">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Un administrador del portal validará tu RUT, correo institucional y el documento de pertenencia en menos de 24 horas.</span>
            </div>
            <p className="text-xs text-slate-400 mt-6 animate-pulse">Redirigiendo al portal...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
            
            {/* Tab Selection for Registration */}
            {type === "register" && (
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  id="tab-personal"
                  onClick={() => handleTabChange("personal")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                    activeTab === "personal" 
                      ? "bg-white text-blue-600 shadow-xs" 
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Público General
                </button>
                <button
                  type="button"
                  id="tab-institutional"
                  onClick={() => handleTabChange("institutional")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                    activeTab === "institutional" 
                      ? "bg-white text-blue-600 shadow-xs" 
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Institucional / Publicador
                </button>
              </div>
            )}

            {/* General Description */}
            {type === "register" && activeTab === "institutional" && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 flex items-start gap-2 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Solo instituciones educativas, culturales o públicas debidamente validadas pueden publicar oportunidades. El proceso requiere RUT institucional y acreditación.</span>
              </div>
            )}

            {/* Common Fields */}
            <div className="space-y-3">
              {type === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez González"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {type === "register" && activeTab === "institutional" ? "Correo Electrónico Institucional" : "Correo Electrónico"}
                </label>
                <input
                  type="email"
                  required
                  placeholder={type === "register" && activeTab === "institutional" ? "Ej. contacto@universidad.cl" : "Ej. juan.perez@colegio.cl"}
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    emailValidationError ? "border-rose-300 bg-rose-50/30" : "border-slate-200"
                  }`}
                />
                {type === "register" && !emailValidationError && (
                  <p className="text-[10px] text-slate-500 mt-1 font-bold">
                    ⚠️ Debe ser un correo con dominio institucional (ej. @colegio.cl, @universidad.edu, @ong.org). No se permiten correos personales.
                  </p>
                )}
                {emailValidationError && (
                  <p className="text-rose-600 dark:text-rose-400 text-[11px] font-bold mt-1.5 leading-relaxed bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-lg p-2.5 flex items-start gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{emailValidationError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Institutional Specific Fields */}
              {type === "register" && activeTab === "institutional" && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Datos de la Institución</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nombre Oficial de la Entidad</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Corporación Cultural Maipú"
                        value={instName}
                        onChange={(e) => setInstName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">RUT Institucional</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. 72.111.000-K"
                        value={instRut}
                        onChange={(e) => setInstRut(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tipo de Institución</label>
                      <select
                        value={instType}
                        onChange={(e) => setInstType(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        {INSTITUTION_TYPES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Sitio Web Oficial</label>
                      <input
                        type="url"
                        required
                        placeholder="https://www.entidad.cl"
                        value={instWebsite}
                        onChange={(e) => setInstWebsite(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tu Cargo o Relación con la Entidad</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Encargado de Comunicaciones o Director Académico"
                      value={instRole}
                      onChange={(e) => setInstRole(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Acreditación de Pertenencia (Decreto, Contrato o Carta Oficial)</label>
                    <div className="mt-1 flex justify-center px-4 py-3 border-2 border-dashed border-slate-200 rounded-lg hover:border-blue-400 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-6 w-6 text-slate-400" />
                        <div className="text-xs text-slate-600">
                          <span className="font-semibold text-blue-600 hover:text-blue-500">Sube un archivo</span> o arrástralo
                        </div>
                        <p className="text-[10px] text-slate-400">PDF, DOC, DOCX hasta 5MB</p>
                      </div>
                    </div>
                    {uploadedFile && (
                      <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                        ✔ {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                    {fileError && (
                      <p className="text-xs text-rose-500 font-medium mt-1">{fileError}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Credentials Help */}
            {type === "login" && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold">💡 Atajos de simulación rápida:</span>
                <p>• Escribe <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold">admin@portal.cl</code> para simular el rol Administrador.</p>
                <p>• Escribe <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold">inst@uchile.cl</code> para simular el rol Publicador Verificado.</p>
                <p>• O escribe cualquier otro correo para simular un Usuario Registrado.</p>
              </div>
            )}

            {/* Submit buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                id="submit-auth-form"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                {type === "login" ? "Iniciar Sesión" : "Registrarme"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
