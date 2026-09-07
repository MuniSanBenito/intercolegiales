import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HousesSection } from './components/HousesSection';
import { DisciplinesSection } from './components/DisciplinesSection';
import { RegistrationSection } from './components/RegistrationSection';
import { ScoreboardSection } from './components/ScoreboardSection';
import { InteractiveQuiz } from './components/InteractiveQuiz';
import { LocationModal } from './components/LocationModal';
import { Footer } from './components/Footer';

export function App() {
  const [locationOpen, setLocationOpen] = useState(false);

  const handleScrollToInscripciones = () => {
    const el = document.getElementById('inscripciones');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToQuiz = () => {
    const el = document.getElementById('test-casa');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08090e] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Fixed Cyber Navbar */}
      <Navbar
        onOpenQuiz={handleScrollToQuiz}
        onOpenLocation={() => setLocationOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero with Countdown, Location & HUD Stats */}
        <Hero
          onOpenQuiz={handleScrollToQuiz}
          onOpenLocation={() => setLocationOpen(true)}
        />

        {/* The 5 Competing Schools */}
        <HousesSection
          onSelectSchool={handleScrollToInscripciones}
        />

        {/* Disciplines, Sports & Cultural Area */}
        <DisciplinesSection
          onRegisterDiscipline={handleScrollToInscripciones}
        />

        {/* Dedicated Official Registration Form */}
        <RegistrationSection />

        {/* Live Scoreboard & Rankings */}
        <ScoreboardSection />

        {/* Interactive School Affinity Quiz */}
        <InteractiveQuiz
          onSelectHouse={handleScrollToInscripciones}
        />
      </main>

      {/* Location Modal */}
      <LocationModal
        isOpen={locationOpen}
        onClose={() => setLocationOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
