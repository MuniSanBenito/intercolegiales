import { useState } from "react";
import { Outlet } from "react-router";
import { Footer } from "../Footer";
import { LocationModal } from "../LocationModal";
import { Navbar } from "../Navbar";

export function Component() {
  const [locationOpen, setLocationOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08090e] font-sans text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar onOpenLocation={() => setLocationOpen(true)} />
      <main className="px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Outlet />
        </div>
      </main>
      <LocationModal
        isOpen={locationOpen}
        onClose={() => setLocationOpen(false)}
      />
      <Footer />
    </div>
  );
}
