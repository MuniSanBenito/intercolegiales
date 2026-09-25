import {
  PanelCatalog,
  type PanelColumn,
} from "../../../../components/panel/PanelCatalog";
import { PanelHeading } from "../../../../components/panel/PanelHeading";
import { PanelPage } from "../../../../components/panel/PanelPage";
import { HOUSES, type House } from "../../../../data/tournamentData";

const columns: PanelColumn<House>[] = [
  {
    header: "Escudo",
    render: (house) => (
      <img
        src={house.logo}
        alt={`Escudo de ${house.name}`}
        className="h-10 w-10 object-contain"
      />
    ),
  },
  {
    header: "Nombre",
    className: "font-medium text-white",
    render: (house) => house.name,
  },
  {
    header: "Sigla",
    className: "font-mono text-cyan-300",
    render: (house) => house.tag,
  },
];

export function Component() {
  return (
    <PanelPage width="5xl">
      <PanelHeading
        eyebrow="Catálogo fijo"
        title="Escuelas"
        description={`${HOUSES.length} instituciones definidas.`}
      />

      <PanelCatalog
        items={HOUSES}
        caption="Escuelas participantes"
        columns={columns}
        tableClassName="w-full text-left text-sm"
        paddingClassName="px-4 py-3"
        cardClassName="flex items-center gap-3"
        renderCard={(house) => (
          <>
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
          </>
        )}
      />
    </PanelPage>
  );
}
