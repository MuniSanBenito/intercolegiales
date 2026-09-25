import {
  PanelCatalog,
  type PanelColumn,
} from "../../../../components/panel/PanelCatalog";
import { PanelHeading } from "../../../../components/panel/PanelHeading";
import { PanelPage } from "../../../../components/panel/PanelPage";
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

const columns: PanelColumn<Discipline>[] = [
  {
    header: "Nombre",
    width: "w-[18%]",
    rowHeader: true,
    render: (discipline) => discipline.name,
  },
  {
    header: "Tipo",
    width: "w-[16%]",
    render: (discipline) => <TypeChip discipline={discipline} />,
  },
  {
    header: "Categoría",
    width: "w-[14%]",
    className: "break-words text-slate-300",
    render: (discipline) => discipline.categoryLabel,
  },
  {
    header: "Formato",
    width: "w-[18%]",
    className: "break-words text-slate-300",
    render: (discipline) => discipline.format,
  },
  {
    header: "Sede",
    width: "w-[18%]",
    className: "break-words text-slate-300",
    render: (discipline) => discipline.location,
  },
  {
    header: "Fechas",
    width: "w-[16%]",
    className: "break-words text-slate-300",
    render: (discipline) => discipline.dates,
  },
];

export function Component() {
  return (
    <PanelPage>
      <PanelHeading
        eyebrow="Catálogo fijo"
        title="Disciplinas"
        description={`${DISCIPLINES.length} competencias definidas.`}
      />

      <PanelCatalog
        items={DISCIPLINES}
        caption="Disciplinas del torneo"
        columns={columns}
        tableClassName="w-full table-fixed text-left text-xs"
        alignTop
        renderCard={(discipline) => (
          <>
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
          </>
        )}
      />
    </PanelPage>
  );
}
