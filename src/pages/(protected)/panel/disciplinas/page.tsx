import { DISCIPLINES, type Discipline } from "../../../../data/tournamentData";

function TypeChip({ discipline }: { discipline: Discipline }) {
  const deportivo = discipline.type === "deportivo";

  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2 py-0.5 font-cyber text-[10px] tracking-wider uppercase ${
        deportivo
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
          : "border-purple-400/30 bg-purple-400/10 text-purple-300"
      }`}
    >
      {discipline.typeLabel}
    </span>
  );
}

export function Component() {
  return (
    <main className="px-4 py-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-4">
          <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[10px] font-cyber tracking-widest text-cyan-300 uppercase">
            Catálogo fijo
          </div>
          <h1 className="font-cyber text-2xl font-black tracking-tight text-white uppercase">
            Disciplinas
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {DISCIPLINES.length} competencias definidas.
          </p>
        </header>

        <ul className="flex flex-col gap-2 md:hidden">
          {DISCIPLINES.map((discipline) => (
            <li
              key={discipline.id}
              className="rounded-xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-semibold text-white">
                  {discipline.name}
                </h2>
                <TypeChip discipline={discipline} />
              </div>
              <p className="mt-1 text-xs text-slate-300">
                {discipline.categoryLabel}
                <span aria-hidden="true"> · </span>
                {discipline.format}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {discipline.location}
                <span aria-hidden="true"> · </span>
                {discipline.dates}
              </p>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 md:block">
          <table className="w-full table-fixed text-left text-xs">
            <caption className="sr-only">Disciplinas del torneo</caption>
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[18%]" />
              <col className="w-[18%]" />
              <col className="w-[16%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-cyan-500/20 font-cyber text-[10px] tracking-widest text-cyan-300 uppercase">
                <th scope="col" className="px-3 py-3 font-bold">
                  Nombre
                </th>
                <th scope="col" className="px-3 py-3 font-bold">
                  Tipo
                </th>
                <th scope="col" className="px-3 py-3 font-bold">
                  Categoría
                </th>
                <th scope="col" className="px-3 py-3 font-bold">
                  Formato
                </th>
                <th scope="col" className="px-3 py-3 font-bold">
                  Sede
                </th>
                <th scope="col" className="px-3 py-3 font-bold">
                  Fechas
                </th>
              </tr>
            </thead>
            <tbody>
              {DISCIPLINES.map((discipline) => (
                <tr
                  key={discipline.id}
                  className="border-b border-slate-800 align-top last:border-0"
                >
                  <th
                    scope="row"
                    className="px-3 py-3 text-left text-sm font-semibold text-white"
                  >
                    {discipline.name}
                  </th>
                  <td className="px-3 py-3">
                    <TypeChip discipline={discipline} />
                  </td>
                  <td className="px-3 py-3 break-words text-slate-300">
                    {discipline.categoryLabel}
                  </td>
                  <td className="px-3 py-3 break-words text-slate-300">
                    {discipline.format}
                  </td>
                  <td className="px-3 py-3 break-words text-slate-300">
                    {discipline.location}
                  </td>
                  <td className="px-3 py-3 break-words text-slate-300">
                    {discipline.dates}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
