import React from 'react';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe-TYnxS3bpCvHkocqMsjyYYHiWEsh_utfnnsKbycJT7mRWmA/viewform?embedded=true';

export const RegistrationSection: React.FC = () => {
  return (
    <section id="inscripciones" className="py-16 md:py-24 bg-[#ede7f6] text-slate-800 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden border-t-8 border-t-[#673ab7]">
          <div className="p-6 sm:p-8 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight">
              Inscripción Oficial — Intercolegiales San Benito 2026
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Completá el formulario para inscribirte. Los datos serán enviados directamente a la coordinación.
            </p>
          </div>
          <div className="w-full">
            <iframe
              src={GOOGLE_FORM_URL}
              width="100%"
              height="1400"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              loading="lazy"
              title="Formulario de Inscripción Intercolegiales 2026"
              className="w-full border-0"
            >
              Cargando formulario...
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
};
