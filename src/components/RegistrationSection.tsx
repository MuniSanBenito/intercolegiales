import React from 'react';
import { motion, MotionConfig } from 'motion/react';
import { ArrowUpRight, CalendarDays, CheckCircle2, ClipboardList, MapPin } from 'lucide-react';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe-TYnxS3bpCvHkocqMsjyYYHiWEsh_utfnnsKbycJT7mRWmA/viewform?embedded=true';
const GOOGLE_FORM_LINK = 'https://forms.gle/AMY5mW7e7Zk7MpJx8';

export const RegistrationSection: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <section id="inscripciones" className="relative overflow-hidden border-y border-cyan-500/10 bg-[#0b0d16] py-16 text-slate-100 md:py-24">
      <div className="absolute inset-0 cyber-dots-bg opacity-30 pointer-events-none" />
      <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-0 h-72 w-72 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.2em] text-cyan-300">
            <ClipboardList className="h-3.5 w-3.5" />
            Registro oficial
          </div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Sumate a los{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
              Intercolegiales
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Completá el formulario oficial para registrar a tu equipo o institución. La coordinación revisará los datos y se pondrá en contacto para confirmar la inscripción.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-5 backdrop-blur-md">
            <CalendarDays className="mb-4 h-6 w-6 text-cyan-400" />
            <h3 className="mb-2 font-cyber text-sm font-bold text-white">Fechas del evento</h3>
            <p className="text-sm leading-relaxed text-slate-400">Del 5 al 9 de octubre de 2026, de 10:00 a 15:00 hs.</p>
          </div>
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/70 p-5 backdrop-blur-md">
            <MapPin className="mb-4 h-6 w-6 text-emerald-400" />
            <h3 className="mb-2 font-cyber text-sm font-bold text-white">Sedes confirmadas</h3>
            <p className="text-sm leading-relaxed text-slate-400">Parque Vieytes y Complejo Oscar Chapino (Av. Jorge Newbery 5900), San Benito.</p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-slate-900/70 p-5 backdrop-blur-md">
            <CheckCircle2 className="mb-4 h-6 w-6 text-amber-400" />
            <h3 className="mb-2 font-cyber text-sm font-bold text-white">Proceso simple</h3>
            <p className="text-sm leading-relaxed text-slate-400">Tené a mano los datos de la institución, responsables y participantes.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.24 }}
          className="mt-8 overflow-hidden rounded-3xl border border-slate-700/70 bg-slate-950/80 shadow-2xl shadow-cyan-950/20">
          <div className="flex flex-col gap-4 border-b border-slate-800 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="mb-2 text-xs font-mono uppercase tracking-[0.2em] text-cyan-400">Formulario de inscripción</p>
              <h3 className="text-xl font-bold text-white sm:text-2xl">Registrá tu participación</h3>
              <p className="mt-2 max-w-xl text-sm text-slate-400">Si el formulario no se carga dentro de la página, podés abrirlo directamente en una nueva pestaña.</p>
            </div>
            <motion.a
              href={GOOGLE_FORM_LINK}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-transform hover:scale-[1.02]"
            >
              Abrir formulario
              <ArrowUpRight className="h-4 w-4" />
            </motion.a>
          </div>
          <iframe
            src={GOOGLE_FORM_URL}
            title="Formulario de inscripción Intercolegiales 2026"
            height="900"
            loading="lazy"
            className="w-full border-0 bg-white"
          >
            Cargando formulario...
          </iframe>
        </motion.div>
      </div>
      </section>
    </MotionConfig>
  );
};
