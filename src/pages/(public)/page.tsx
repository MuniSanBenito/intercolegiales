import { useState } from "react";
import { DisciplinesSection } from "../../components/DisciplinesSection";
import { Footer } from "../../components/Footer";
import { Hero } from "../../components/Hero";
import { HousesSection } from "../../components/HousesSection";
import { LocationModal } from "../../components/LocationModal";
import { Navbar } from "../../components/Navbar";
import { RegistrationSection } from "../../components/RegistrationSection";
import { ScoreboardSection } from "../../components/ScoreboardSection";

export function Component() {
  const [locationOpen, setLocationOpen] = useState(false);

  const handleScrollToInscripciones = () => {
    const el = document.getElementById("inscripciones");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08090e] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Fixed Cyber Navbar */}
      <Navbar onOpenLocation={() => setLocationOpen(true)} />

      {/* Main Content Sections */}
      <main>
        {/* Hero with Countdown, Location & HUD Stats */}
        <Hero onOpenLocation={() => setLocationOpen(true)} />

        {/* The 5 Competing Schools */}
        <HousesSection onSelectSchool={handleScrollToInscripciones} />

        {/* Disciplines, Sports & Cultural Area */}
        <DisciplinesSection
          onRegisterDiscipline={handleScrollToInscripciones}
        />

        {/* Dedicated Official Registration Form */}
        <RegistrationSection />

        {/* Live Scoreboard & Rankings */}
        <ScoreboardSection />
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
