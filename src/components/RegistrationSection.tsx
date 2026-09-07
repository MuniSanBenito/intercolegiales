import React, { useState } from 'react';
import { UserCheck, Sparkles, CheckCircle2, Shield, QrCode, Mail, User, Hash, School, Calendar, Send, Trophy, Printer, Upload, FileCheck } from 'lucide-react';
import { HOUSES, DISCIPLINES } from '../data/tournamentData';

interface RegistrationData {
  fullName: string;
  dni: string;
  schoolId: string;
  email: string;
  age: string;
  discipline: string;
}

export const RegistrationSection: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    dni: '',
    schoolId: 'san-benito',
    email: '',
    age: '16',
    discipline: 'Fútbol Femenino',
  });


  const [constanciaFile, setConstanciaFile] = useState<File | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredPlayer, setRegisteredPlayer] = useState<RegistrationData | null>(null);
  const [ticketId, setTicketId] = useState('');

  const selectedSchool = HOUSES.find((h) => h.id === formData.schoolId) || HOUSES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dni || !formData.email || !formData.age || !constanciaFile) return;

    const generatedId = `ISB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(generatedId);
    setRegisteredPlayer({ ...formData });
    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setConstanciaFile(null);
    setFormData({
      fullName: '',
      dni: '',
      schoolId: 'san-benito',
      email: '',
      age: '16',
      discipline: 'Fútbol Femenino',
    });
  };


  return (
    <section id="inscripciones" className="relative py-24 bg-[#080912] border-t border-b border-cyan-500/20 overflow-hidden">
      {/* Background Cyber Lights */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-cyber tracking-widest uppercase mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>REGISTRO OFICIAL DE ATLETAS & ESPORTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-cyber text-white tracking-tight uppercase mb-4">
            PORTAL DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300">INSCRIPCIONES 2026</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Completá tus datos oficiales para validar tu ficha de atleta y credencial de competencia. 
            Representá a tu escuela del <strong className="text-white">5 al 9 de Octubre (10:00 a 15:00 hs)</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Form Side */}
          <div className="lg:col-span-7 bg-[#0d0f1e]/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-cyan-950/30">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> FORMULARIO DE ACCESO OFICIAL
                  </span>
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    5 AL 9 OCT 2026
                  </span>
                </div>

                {/* 1. Nombre y Apellido */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Nombre y Apellido *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Sofía Valentina Martínez"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono text-sm transition-all"
                  />
                </div>

                {/* 2. DNI & 3. Edad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-purple-400" />
                      <span>DNI (Documento Nacional) *</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 46892114"
                      value={formData.dni}
                      onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-mono text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edad del Estudiante *</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="11"
                      max="20"
                      placeholder="Ej: 16"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono text-sm transition-all"
                    />
                  </div>
                </div>

                {/* 4. Correo Electrónico */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Correo Electrónico (Email) *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="estudiante@ejemplo.edu.ar"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono text-sm transition-all"
                  />
                </div>

                {/* 5. Escuela Participante */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Escuela / Institución a Representar *</span>
                  </label>
                  <select
                    value={formData.schoolId}
                    onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono text-sm transition-all"
                  >
                    {HOUSES.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} [{h.tag}]
                      </option>
                    ))}
                  </select>
                </div>

                {/* Disciplina Principal */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Disciplina Principal de Competencia</span>
                  </label>
                  <select
                    value={formData.discipline}
                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-mono text-sm transition-all"
                  >
                    {DISCIPLINES.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} (+{d.xpReward} XP)
                      </option>
                    ))}
                  </select>
                </div>

                {/* 7. Constancia de Alumno Regular */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-pink-400" />
                    <span>Constancia de Alumno Regular *</span>
                  </label>
                  <p className="text-[11px] font-mono text-slate-500 mb-2">
                    Subí una foto o PDF de tu constancia de alumno regular para verificar tu identidad.
                  </p>
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    constanciaFile
                      ? 'border-emerald-400/60 bg-emerald-500/5'
                      : 'border-slate-700 bg-slate-950/80 hover:border-pink-400/50 hover:bg-pink-500/5'
                  }">
                    <div className="flex flex-col items-center justify-center pt-2 pb-1">
                      {constanciaFile ? (
                        <>
                          <FileCheck className="w-7 h-7 text-emerald-400 mb-1" />
                          <span className="text-xs font-mono text-emerald-300 font-bold max-w-[240px] truncate">{constanciaFile.name}</span>
                          <span className="text-[10px] font-mono text-slate-500 mt-0.5">Click para cambiar archivo</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-7 h-7 text-slate-500 mb-1" />
                          <span className="text-xs font-mono text-slate-400">Arrastrá tu archivo o click para seleccionar</span>
                          <span className="text-[10px] font-mono text-slate-600 mt-0.5">JPG, PNG o PDF — Max 5MB</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file && file.size > 5 * 1024 * 1024) {
                          alert('El archivo supera los 5MB. Elegí uno más chico.');
                          return;
                        }
                        setConstanciaFile(file);
                      }}
                    />
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 mt-2 rounded-xl font-cyber text-xs uppercase tracking-widest font-black text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:shadow-xl hover:shadow-cyan-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>Confirmar Inscripción Oficial (+500 XP)</span>
                </button>
              </form>
            ) : (
              /* Success confirmation within form block */
              <div className="text-center py-6 animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-cyber font-black text-white mb-2">
                  ¡INSCRIPCIÓN REGISTRADA!
                </h3>
                <p className="text-xs font-mono text-slate-300 max-w-md mx-auto mb-6">
                  Se ha generado tu credencial oficial para los Intercolegiales 2026. Te enviamos la confirmación a 
                  <span className="text-cyan-300 font-bold block mt-1">{registeredPlayer?.email}</span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 text-black hover:shadow-lg hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] text-xs font-cyber uppercase tracking-wider font-black transition-all flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir Credencial
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-cyan-400 text-xs font-cyber uppercase tracking-wider transition-all"
                  >
                    Inscribir a otro Estudiante
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Live Card Preview Side */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>VISTA PREVIA DE TU CREDENCIAL OFICIAL</span>
            </div>

            {/* Cyber Credential Card */}
            <div className="bg-gradient-to-br from-[#111326] via-[#0d0e1f] to-[#161a35] border-2 border-cyan-400/80 rounded-3xl p-6 shadow-2xl shadow-cyan-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-3xl pointer-events-none"></div>

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4 mb-4">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    TORNEO INTERCOLEGIAL 2026
                  </div>
                  <h4 className="text-sm font-cyber font-black text-white">
                    {selectedSchool.name}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30">
                    OCTUBRE '26
                  </span>
                </div>
              </div>

              {/* Card Body Data */}
              <div className="space-y-2.5 text-xs font-mono mb-5">
                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Atleta / Estudiante:</span>
                  <span className="text-white font-bold truncate max-w-[180px]">
                    {formData.fullName || '— (Completar nombre)'}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">DNI:</span>
                  <span className="text-purple-300 font-bold">
                    {formData.dni || '— (Completar DNI)'}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Edad:</span>
                  <span className="text-amber-300">
                    {formData.age ? `${formData.age} Años` : '—'}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Correo:</span>
                  <span className="text-emerald-300 truncate max-w-[180px]">
                    {formData.email || '— (Completar correo)'}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-slate-400">Escuela:</span>
                  <span className="text-cyan-300 font-bold">
                    {selectedSchool.name} [{selectedSchool.tag}]
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Disciplina:</span>
                  <span className="text-amber-300 truncate max-w-[180px]">
                    {formData.discipline}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Constancia:</span>
                  <span className={`font-bold truncate max-w-[180px] ${constanciaFile ? 'text-emerald-300' : 'text-red-400'}`}>
                    {constanciaFile ? '✓ Cargada' : '✗ Pendiente'}
                  </span>
                </div>
              </div>

              {/* Card Footer Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-slate-300 font-bold">{ticketId || '#ISB-2026-PENDING'}</div>
                    <div className="text-[9px] text-slate-500">HORARIO: 10:00 A 15:00 HS</div>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  ● HABILITADO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
