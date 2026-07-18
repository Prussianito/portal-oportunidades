/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Send, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "¿Cómo puedo registrar mi institución?",
    answer: "Para registrar tu institución, haz clic en 'Registrar Entidad' en la página de inicio o en la barra de navegación. Completa el formulario con los datos de tu organización. Un administrador de la plataforma validará tu perfil en un plazo máximo de 48 horas hábiles."
  },
  {
    question: "¿El portal cobra alguna comisión por publicar convocatorias?",
    answer: "No. El Portal Único de Oportunidades es una plataforma de acceso 100% gratuito y federal. El objetivo es democratizar el acceso a actividades culturales, científicas y formativas para todos los escolares de Chile."
  },
  {
    question: "Soy estudiante, ¿cómo me postulo a los eventos?",
    answer: "Cada afiche de evento contiene un botón de 'Postular / Más información' que te redirigirá directamente al formulario de inscripción o página web oficial de la institución que organiza el evento. Asegúrate de cumplir con los plazos señalados."
  },
  {
    question: "¿Cómo funciona la pizarra de favoritos?",
    answer: "Si has iniciado sesión con tu cuenta, puedes presionar el ícono de estrella (★) en cualquier afiche de convocatoria para guardarlo en tu pizarra personal. Esto te permitirá llevar un seguimiento de las fechas de cierre de tus convocatorias preferidas."
  },
  {
    question: "¿Cómo sé si una institución es de confianza?",
    answer: "Las instituciones verificadas cuentan con una insignia de verificación (✓) en su perfil y afiches de eventos. Esto indica que sus credenciales legales e información de contacto fueron aprobadas rigurosamente por nuestro equipo de administración."
  }
];

export default function HelpPanel() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 100);
    }
  };

  return (
    <div id="help-panel-container" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-12 animate-in fade-in duration-300 text-left">
      
      {/* Help Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#E2B13C]/10 via-[#F7F9FA] to-[#C87A53]/5 text-slate-900 rounded-[2.5rem] p-8 sm:p-12 border border-slate-150 shadow-xs">
        <div className="absolute top-2 right-4 text-3xl opacity-15 select-none">💡</div>
        <div className="absolute bottom-4 right-12 text-3xl opacity-10 select-none">📞</div>
        
        <div className="relative max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C87A53]/15 text-[#C87A53] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#C87A53]" />
            Centro de Ayuda
          </span>
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-slate-900 leading-tight">
            ¿Cómo podemos ayudarte hoy?
          </h1>
          <p className="text-slate-650 text-sm sm:text-base leading-relaxed font-normal">
            Resuelve tus dudas sobre publicaciones, cuentas institucionales, postulaciones estudiantiles o envía una consulta directa a nuestro equipo de soporte federal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* FAQs Accordion on Left (Spans 7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xs space-y-6">
          <div>
            <h2 className="font-display font-medium text-xl text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-5 bg-[#C87A53] rounded-full" />
              Preguntas Frecuentes
            </h2>
            <p className="text-slate-400 text-xs font-medium mt-1">Respuestas instantáneas a las consultas más comunes de la comunidad.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div 
                  key={idx}
                  className="border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden transition-all bg-slate-50/50 dark:bg-slate-950/20"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left py-4 px-5 flex justify-between items-center font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#C87A53] shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-450 shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-slate-650 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 leading-relaxed font-normal bg-white dark:bg-slate-900">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact form on Right (Spans 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Support Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xs space-y-5">
            <div>
              <h2 className="font-display font-medium text-xl text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-5 bg-[#E2B13C] rounded-full" />
                Soporte de Contacto
              </h2>
              <p className="text-slate-400 text-xs font-medium mt-1">Escríbenos directamente y te responderemos a la brevedad.</p>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-dashed border-emerald-500/40 rounded-2xl animate-in zoom-in-95">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-100">¡Mensaje Enviado con Éxito!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto font-normal">
                  Hemos recibido tus comentarios. Te enviaremos una respuesta al correo indicado lo antes posible.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-[#C87A53] hover:underline cursor-pointer"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-900 dark:text-white font-normal focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ej: juan.perez@correo.cl"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-900 dark:text-white font-normal focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Asunto</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Ej: Problemas para validar perfil"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-900 dark:text-white font-normal focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Mensaje o Consulta</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe en detalle tu consulta..."
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden text-slate-900 dark:text-white font-normal resize-none focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#C87A53] hover:bg-[#b0653f] text-white font-bold py-2.5 rounded-full shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
                >
                  <Send className="w-4 h-4 text-white" />
                  Enviar Mensaje
                </button>
              </form>
            )}
          </div>

          {/* Quick Contact Info */}
          <div className="bg-slate-50/50 dark:bg-slate-900/40 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-850 shadow-xs space-y-4 text-xs font-semibold text-slate-750 dark:text-slate-250">
            <h3 className="uppercase tracking-wider text-[10px] text-slate-400 block font-bold">Información Directa de Contacto</h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <Mail className="w-4.5 h-4.5 text-[#C87A53]" />
                <span>contacto@convocatoriasescolares.cl</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4.5 h-4.5 text-[#E2B13C]" />
                <span>+56 2 2345 6789</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4.5 h-4.5 text-slate-500" />
                <span>Alameda #135, Santiago de Chile</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
