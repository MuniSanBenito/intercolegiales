import { HOUSES } from "../../../../data/tournamentData";

export function Component() {
  return (
    <main className="px-4 py-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-4">
          <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[10px] font-cyber tracking-widest text-cyan-300 uppercase">
            Catálogo fijo
          </div>
          <h1 className="font-cyber text-2xl font-black tracking-tight text-white uppercase">
            Escuelas
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {HOUSES.length} instituciones definidas.
          </p>
        </header>

        <ul className="flex flex-col gap-2 md:hidden">
          {HOUSES.map((house) => (
            <li
              key={house.id}
              className="flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-3"
            >
              <img
                src={house.logo}
                alt=""
                className="h-10 w-10 shrink-0 object-contain"
              />
              <div className="flex min-w-0 items-baseline gap-2">
                <p className="shrink-0 font-mono text-[10px] font-black tracking-wider text-cyan-300">
                  {house.tag}
                </p>
                <p className="truncate text-sm font-semibold text-white">
                  {house.name}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 md:block">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Escuelas participantes</caption>
            <thead>
              <tr className="border-b border-cyan-500/20 font-cyber text-[10px] tracking-widest text-cyan-300 uppercase">
                <th scope="col" className="px-4 py-3 font-bold">
                  Escudo
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Nombre
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Sigla
                </th>
              </tr>
            </thead>
            <tbody>
              {HOUSES.map((house) => (
                <tr
                  key={house.id}
                  className="border-b border-slate-800 last:border-0"
                >
                  <td className="px-4 py-3">
                    <img
                      src={house.logo}
                      alt={`Escudo de ${house.name}`}
                      className="h-10 w-10 object-contain"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    {house.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-cyan-300">
                    {house.tag}
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
