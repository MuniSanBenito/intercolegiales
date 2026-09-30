import { HOUSES } from "../../data/tournamentData";
import type { DisciplinePodium, SchoolScore } from "../../helpers/results";
import { disciplineName, houseName, type Team } from "../../helpers/teams";
import { formatLabel } from "../../helpers/tournaments";

function placeWord(place: 1 | 2 | 3) {
  if (place === 1) return "1.º";
  if (place === 2) return "2.º";
  return "3.º";
}

function rankClassName(rank: number | null) {
  if (rank === 1) return "text-amber-300";
  if (rank === 2) return "text-slate-200";
  if (rank === 3) return "text-orange-300";
  return "text-slate-500";
}

export function ResultsBoard({
  schools,
  disciplines,
  teams,
}: {
  schools: SchoolScore[];
  disciplines: DisciplinePodium[];
  teams: Team[];
}) {
  const waiting = schools.every((school) => school.points === 0);
  const teamName = (teamId: string) =>
    teams.find((team) => team.id === teamId)?.name ?? "Equipo eliminado";

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="tabla-general">
        <h2
          id="tabla-general"
          className="font-cyber text-sm font-black tracking-widest text-white uppercase"
        >
          Tabla general
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          {waiting
            ? "Todavía no hay podios definidos. En cada disciplina los puntos entran cuando quedan definidos el 1.º, el 2.º y el 3.º."
            : "Las escuelas quedan ordenadas por la suma de todos los podios."}
        </p>
        <ol className="mt-4 flex flex-col gap-3">
          {schools.map((school) => {
            const house = HOUSES.find((item) => item.id === school.houseId);

            return (
              <li
                key={school.houseId}
                className={`flex items-center gap-3 rounded-2xl border bg-[#0c0e1a]/90 px-3 py-3 sm:gap-4 sm:px-4 ${
                  house?.borderColor ?? "border-cyan-500/30"
                }`}
              >
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-800 bg-slate-950 font-cyber text-sm font-black ${rankClassName(school.rank)}`}
                >
                  <span className="sr-only">Puesto </span>
                  {school.rank ?? "—"}
                </div>
                {house ? (
                  <img
                    src={house.logo}
                    alt=""
                    className="h-10 w-10 shrink-0 object-contain"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <h3 className="font-cyber text-sm font-bold break-words text-white sm:text-base">
                    {houseName(school.houseId)}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
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
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="podios-disciplina">
        <h2
          id="podios-disciplina"
          className="font-cyber text-sm font-black tracking-widest text-white uppercase"
        >
          Por disciplina
        </h2>
        {disciplines.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 px-4 py-5 text-sm text-slate-400">
            Todavía no hay torneos. Cada disciplina va a mostrar acá su 1.º, 2.º
            y 3.º.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {disciplines.map((discipline) => (
              <article
                key={discipline.tournamentId}
                className="rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-4"
              >
                <h3 className="font-cyber text-base font-black tracking-tight text-white uppercase">
                  {disciplineName(discipline.disciplineId)}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {formatLabel(discipline.format)}
                </p>
                <ol className="mt-3 flex flex-col gap-2">
                  {discipline.slots.map((slot) => (
                    <li
                      key={slot.place}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
                    >
                      <p className="text-[11px] font-semibold tracking-wide text-cyan-300 uppercase">
                        {placeWord(slot.place)}
                        <span
                          className="mx-1.5 text-slate-600"
                          aria-hidden="true"
                        >
                          ·
                        </span>
                        {slot.points.toLocaleString("es-AR")} pts
                      </p>
                      <p className="mt-0.5 text-sm break-words text-slate-100">
                        {slot.teamId
                          ? `${teamName(slot.teamId)}${
                              slot.houseId
                                ? ` · ${houseName(slot.houseId)}`
                                : ""
                            }`
                          : "Pendiente"}
                      </p>
                    </li>
                  ))}
                </ol>
                {discipline.detail ? (
                  <p className="mt-3 text-sm text-amber-200/90">
                    {discipline.detail}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
