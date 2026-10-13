import { Link } from "react-router";
import { motion, MotionConfig } from "motion/react";
import { ChevronRight, Trophy } from "lucide-react";
import { HOUSES } from "../data/tournamentData";
import { houseName } from "../helpers/teams";
import { useResults } from "../helpers/useResults";
import { sound } from "../lib/sound";

function rankTone(rank: number | null) {
  if (rank === 1) return "text-amber-300 border-amber-400/50 bg-amber-500/10";
  if (rank === 2) return "text-slate-100 border-slate-400/40 bg-slate-500/10";
  if (rank === 3) return "text-orange-300 border-orange-400/40 bg-orange-500/10";
  return "text-slate-500 border-slate-700/40 bg-slate-800/60";
}

export function ScoreboardSection() {
  const { loading, schools } = useResults();
  const finished = schools.some((school) => school.points > 0);
  const leaders = schools.filter((school) => school.rank === 1);
  const leaderLabel = leaders.map((school) => houseName(school.houseId)).join(" y ");

  return (
    <MotionConfig reducedMotion="user">
      <section id="posiciones" className="relative py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 font-mono text-xs tracking-widest text-amber-400 uppercase">
              <Trophy className="h-3.5 w-3.5" />
              Resultados finales
            </div>
            <h2 className="mb-3 font-cyber text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
              Así terminó{" "}
              <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
                la copa
              </span>
            </h2>
            <p className="mx-auto max-w-xl text-sm text-slate-400 md:text-base">
              Cada disciplina sumó 1000 puntos al 1.º, 800 al 2.º y 600 al 3.º.
              Esta es la tabla general al cierre de los Intercolegiales.
            </p>
          </motion.div>

          {loading ? (
            <p role="status" className="text-center text-sm text-slate-400">
              Cargando resultados finales…
            </p>
          ) : null}

          {!loading && finished && leaders.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mb-8 rounded-2xl border border-amber-500/30 bg-slate-900/60 p-6 text-center backdrop-blur-md md:p-8"
            >
              <p className="font-mono text-xs tracking-widest text-amber-300 uppercase">
                {leaders.length > 1 ? "Empate en la cima" : "Campeón"}
              </p>
              <p className="mt-2 font-cyber text-2xl font-black text-white md:text-3xl">
                {leaderLabel}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                {leaders[0].points.toLocaleString("es-AR")} puntos
              </p>
            </motion.div>
          ) : null}

          {!loading && !finished ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="mb-8 rounded-2xl border border-amber-500/20 bg-slate-900/60 p-6 text-center backdrop-blur-md md:p-8"
            >
              <h3 className="mb-2 font-cyber text-lg font-bold text-white md:text-xl">
                La tabla todavía no tiene puntos
              </h3>
              <p className="mx-auto max-w-md text-sm text-slate-400">
                Cuando quede definido el podio de una disciplina, esa escuela
                entra en esta tabla.
              </p>
            </motion.div>
          ) : null}

          {!loading ? (
            <ol className="space-y-3">
              {schools.map((school, index) => {
                const house = HOUSES.find((item) => item.id === school.houseId);

                return (
                  <motion.li
                    key={school.houseId}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.07 }}
                    className={`relative rounded-xl border bg-slate-950/60 transition-all duration-300 hover:scale-[1.01] ${
                      house?.borderColor ?? "border-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 p-4 md:gap-4 md:p-5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-cyber text-sm font-black md:h-12 md:w-12 ${rankTone(school.rank)}`}
                      >
                        <span className="sr-only">Puesto </span>
                        {school.rank ?? "—"}
                      </div>

                      {house ? (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center md:h-12 md:w-12">
                          <img
                            src={house.logo}
                            alt={`Escudo de ${house.name}`}
                            className="h-full w-full object-contain drop-shadow-md"
                          />
                        </div>
                      ) : null}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate font-cyber text-sm font-bold text-white md:text-base">
                            {house?.name ?? houseName(school.houseId)}
                          </h3>
                          {house ? (
                            <span className="rounded bg-slate-800/60 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                              {house.tag}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          1.º {school.places[1]}
                          <span className="mx-1.5 text-slate-600" aria-hidden="true">
                            ·
                          </span>
                          2.º {school.places[2]}
                          <span className="mx-1.5 text-slate-600" aria-hidden="true">
                            ·
                          </span>
                          3.º {school.places[3]}
                        </p>
                      </div>

                      <p className="shrink-0 text-right">
                        <span className="sr-only">Puntos </span>
                        <span className="font-cyber text-lg font-black text-cyan-200">
                          {school.points.toLocaleString("es-AR")}
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] tracking-wide text-slate-500 uppercase">
                          pts
                        </span>
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mt-8 rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-5 text-center sm:p-6"
          >
            <p className="text-sm text-slate-300">
              En Torneos está el fixture y el podio de cada disciplina.
            </p>
            <Link
              to="/torneos"
              onClick={() => sound.click()}
              onMouseEnter={() => sound.hover()}
              onFocus={() => sound.hover()}
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-6 py-3 font-cyber text-xs font-black tracking-widest text-cyan-200 uppercase transition-all hover:border-cyan-300 hover:bg-cyan-500/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:w-auto"
            >
              Ver cómo salió cada disciplina
              <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
