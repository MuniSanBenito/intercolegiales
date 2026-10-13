import confetti from "canvas-confetti";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { panelPrimaryButtonClassName } from "../../../components/panel/panelClasses";
import { HOUSES } from "../../../data/tournamentData";
import type { SchoolScore } from "../../../helpers/results";
import { houseName } from "../../../helpers/teams";
import { useResults } from "../../../helpers/useResults";

const COUNTDOWN_START = 10;
const REST_DELAY_MS = 2400;
const RING_RADIUS = 108;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

type Phase = "idle" | "count" | "wait" | "champion" | "podium" | "empty";

function topSchools(schools: SchoolScore[]) {
  return schools.filter((school) => school.rank !== null).slice(0, 3);
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function startFireworks() {
  const duration = 15_000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 120,
    zIndex: 9999,
    disableForReducedMotion: false,
    colors: ["#22d3ee", "#fbbf24", "#e879f9", "#fb7185", "#ffffff"],
  };

  const burst = (particleCount: number) => {
    const count = Math.max(20, Math.round(particleCount));
    confetti({
      ...defaults,
      particleCount: count,
      origin: { x: randomInRange(0.05, 0.28), y: randomInRange(0.15, 0.55) },
    });
    confetti({
      ...defaults,
      particleCount: count,
      origin: { x: randomInRange(0.72, 0.95), y: randomInRange(0.15, 0.55) },
    });
  };

  burst(90);

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      window.clearInterval(interval);
      return;
    }

    burst(50 * (timeLeft / duration));
  }, 250);

  return () => {
    window.clearInterval(interval);
    confetti.reset();
  };
}

function CountdownDial({ seconds }: { seconds: number }) {
  const hot = seconds <= 3;
  const progress = seconds / COUNTDOWN_START;

  return (
    <div className="relative grid place-items-center">
      <span
        key={`flash-${seconds}`}
        aria-hidden="true"
        className={`ceremony-flash pointer-events-none fixed inset-0 ${
          hot ? "bg-amber-400/25" : "bg-cyan-400/15"
        }`}
      />
      <span
        key={`ripple-${seconds}`}
        aria-hidden="true"
        className={`ceremony-ripple pointer-events-none absolute h-48 w-48 rounded-full border-2 sm:h-64 sm:w-64 ${
          hot ? "border-amber-300/80" : "border-cyan-300/80"
        }`}
      />
      <span
        key={`ripple-late-${seconds}`}
        aria-hidden="true"
        className={`ceremony-ripple ceremony-ripple-late pointer-events-none absolute h-48 w-48 rounded-full border sm:h-64 sm:w-64 ${
          hot ? "border-orange-200/70" : "border-purple-300/70"
        }`}
      />
      <svg
        viewBox="0 0 240 240"
        aria-hidden="true"
        className="h-64 w-64 -rotate-90 sm:h-80 sm:w-80"
      >
        <circle
          cx="120"
          cy="120"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="10"
          className="stroke-slate-800"
        />
        <circle
          cx="120"
          cy="120"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH * (1 - progress)}
          className={`ceremony-ring ${hot ? "stroke-amber-300" : "stroke-cyan-300"}`}
        />
      </svg>
      <p
        key={seconds}
        aria-hidden="true"
        className={`ceremony-slam absolute z-10 font-cyber text-[6.5rem] leading-none font-black tabular-nums sm:text-[8.5rem] ${
          hot ? "text-amber-200" : "text-white"
        }`}
        style={{
          textShadow: hot
            ? "0 0 28px rgba(251, 191, 36, 0.95), 0 0 70px rgba(251, 146, 60, 0.55)"
            : "0 0 28px rgba(34, 211, 238, 0.9), 0 0 64px rgba(34, 211, 238, 0.35)",
        }}
      >
        {seconds}
      </p>
    </div>
  );
}

function placeLabel(rank: number) {
  if (rank === 1) return "1.º";
  if (rank === 2) return "2.º";
  return "3.º";
}

function SchoolCard({
  school,
  featured,
}: {
  school: SchoolScore;
  featured: boolean;
}) {
  const house = HOUSES.find((item) => item.id === school.houseId);
  const rank = school.rank ?? 0;

  return (
    <>
      <article
        className={`ceremony-card flex w-full flex-col items-center rounded-3xl border bg-[#0c0e1a]/90 px-4 py-5 text-center shadow-2xl ${
          house?.borderColor ?? "border-cyan-500/30"
        } ${featured ? "py-8" : ""}`}
        style={house ? { boxShadow: `0 0 48px ${house.glowColor}` } : undefined}
      >
        {house ? (
          <img
            src={house.logo}
            alt=""
            className={`ceremony-logo object-contain ${featured ? "h-24 w-24 sm:h-28 sm:w-28" : "h-16 w-16 sm:h-20 sm:w-20"}`}
          />
        ) : null}
        <p
          className={`mt-3 font-cyber text-xs font-black tracking-[0.28em] uppercase ${
            rank === 1
              ? "text-amber-300"
              : rank === 2
                ? "text-slate-200"
                : "text-orange-300"
          }`}
        >
          {placeLabel(rank)}
        </p>
        <h2
          className={`mt-2 font-cyber font-black tracking-tight text-white ${
            featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
          }`}
        >
          {houseName(school.houseId)}
        </h2>
        <p className="mt-2 font-cyber text-lg font-black text-cyan-200">
          <span className="sr-only">Puntos </span>
          {school.points.toLocaleString("es-AR")}
          <span className="ml-1 text-xs tracking-widest text-cyan-400/80">
            pts
          </span>
        </p>
      </article>
      <div
        aria-hidden="true"
        className={`ceremony-pedestal mt-3 hidden w-full rounded-t-2xl bg-gradient-to-t opacity-90 lg:block ${
          house?.color ?? "from-cyan-500 to-cyan-700"
        } ${featured ? "h-28" : rank === 2 ? "h-16" : "h-10"}`}
      />
    </>
  );
}

function SideColumn({
  schools,
  visible,
  className,
}: {
  schools: SchoolScore[];
  visible: boolean;
  className: string;
}) {
  if (schools.length === 0) {
    return (
      <div
        className={`hidden w-full lg:block lg:w-64 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`flex w-full flex-col gap-4 lg:w-64 ${className} ${
        visible ? "ceremony-rise" : "hidden lg:invisible lg:block"
      }`}
    >
      {schools.map((school) => (
        <SchoolCard key={school.houseId} school={school} featured={false} />
      ))}
    </div>
  );
}

export function Component() {
  const results = useResults();
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(COUNTDOWN_START);
  const [podium, setPodium] = useState<SchoolScore[]>([]);

  useEffect(() => {
    if (phase !== "count" || seconds <= 0) return;

    const id = window.setTimeout(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(id);
  }, [phase, seconds]);

  useEffect(() => {
    if (phase !== "count" || seconds > 0) return;

    if (results.loading) {
      setPhase("wait");
      return;
    }

    const top = topSchools(results.schools);
    setPodium(top);
    setPhase(top.length === 0 ? "empty" : "champion");
  }, [phase, seconds, results.loading, results.schools]);

  useEffect(() => {
    if (phase !== "wait" || results.loading) return;

    const top = topSchools(results.schools);
    setPodium(top);
    setPhase(top.length === 0 ? "empty" : "champion");
  }, [phase, results.loading, results.schools]);

  const celebrating = phase === "champion" || phase === "podium";
  const hasRest = podium.some((school) => school.rank !== 1);

  useEffect(() => {
    if (!celebrating) return;

    return startFireworks();
  }, [celebrating]);

  useEffect(() => {
    if (phase !== "champion" || !hasRest) return;

    const id = window.setTimeout(() => setPhase("podium"), REST_DELAY_MS);

    return () => window.clearTimeout(id);
  }, [phase, hasRest]);

  const champions = podium.filter((school) => school.rank === 1);
  const secondPlaces = podium.filter((school) => school.rank === 2);
  const thirdPlaces = podium.filter((school) => school.rank === 3);
  const showRest = phase === "podium";
  const displaySeconds = Math.max(seconds, 1);

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#08090e] text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 cyber-grid-bg opacity-40" />
        <div className="absolute top-1/4 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-cyan-600/20 via-purple-600/20 to-pink-600/10 blur-[120px] sm:h-[480px] sm:w-[480px]" />
      </div>

      <Link
        to="/panel"
        className="absolute top-4 left-4 z-50 inline-flex h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-3 text-sm text-slate-200 backdrop-blur-md transition-colors hover:border-cyan-400/50 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver al Panel
      </Link>

      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 py-24">
        {phase === "idle" ? (
          <div className="mx-auto flex max-w-xl flex-col items-center text-center">
            <p className="font-cyber text-[10px] font-bold tracking-[0.28em] text-cyan-400 uppercase">
              Intercolegiales
            </p>
            <h1 className="mt-3 font-cyber text-3xl font-black tracking-tight text-white sm:text-5xl">
              Posiciones finales
            </h1>
            <p className="mt-4 max-w-md text-sm text-slate-400 sm:text-base">
              Al terminar la cuenta se revela la escuela ganadora y el podio,
              con los puntos de las disciplinas cargadas hasta ahora.
            </p>
            <button
              type="button"
              onClick={() => {
                setSeconds(COUNTDOWN_START);
                setPodium([]);
                setPhase("count");
              }}
              className={`${panelPrimaryButtonClassName} mt-8 px-6`}
            >
              Iniciar cuenta regresiva
            </button>
          </div>
        ) : null}

        {phase === "count" ? (
          <div className="flex flex-col items-center text-center">
            <p
              className={`font-cyber text-xs font-bold tracking-[0.28em] uppercase ${
                displaySeconds <= 3 ? "text-amber-300" : "text-cyan-400"
              }`}
            >
              El podio se revela en
            </p>
            <p className="sr-only" aria-live="polite">
              {displaySeconds}
            </p>
            <div className="mt-2">
              <CountdownDial seconds={displaySeconds} />
            </div>
          </div>
        ) : null}

        {phase === "wait" ? (
          <div
            className="flex flex-col items-center gap-4 text-center"
            role="status"
          >
            <LoaderCircle className="h-10 w-10 animate-spin text-cyan-300" />
            <p className="font-cyber text-sm font-bold tracking-widest text-cyan-200 uppercase">
              Calculando posiciones…
            </p>
          </div>
        ) : null}

        {phase === "empty" ? (
          <div className="mx-auto max-w-lg text-center">
            <h1 className="font-cyber text-3xl font-black text-white">
              Podio en espera
            </h1>
            <p className="mt-4 text-sm text-slate-400 sm:text-base">
              Todavía no hay escuelas con puntos. Cuando las disciplinas definan
              sus puestos, esta pantalla muestra el cierre.
            </p>
          </div>
        ) : null}

        {celebrating ? (
          <div className="flex w-full max-w-5xl flex-col items-center">
            <p className="font-cyber text-[10px] font-bold tracking-[0.28em] text-cyan-400 uppercase">
              Intercolegiales
            </p>
            <h1 className="ceremony-title mt-2 text-center font-cyber text-3xl font-black text-white sm:text-5xl">
              {champions.length > 1 ? "Campeonas" : "Campeona"}
            </h1>
            <div className="mt-8 flex w-full flex-col items-center gap-4 lg:flex-row lg:items-end lg:justify-center">
              <SideColumn
                schools={secondPlaces}
                visible={showRest}
                className="order-2 lg:order-1"
              />
              <div
                className={`order-1 flex w-full flex-col gap-4 lg:order-2 lg:w-80 ${
                  champions.length > 1
                    ? "lg:w-[28rem] lg:flex-row lg:items-end"
                    : ""
                }`}
              >
                {champions.map((school) => (
                  <div
                    key={school.houseId}
                    className="ceremony-champion min-w-0 flex-1"
                  >
                    <SchoolCard school={school} featured />
                  </div>
                ))}
              </div>
              <SideColumn
                schools={thirdPlaces}
                visible={showRest}
                className="ceremony-rise-late order-3"
              />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
