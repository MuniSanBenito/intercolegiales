import { ResultsBoard } from "../../../../components/resultados/ResultsBoard";
import { PanelHeading } from "../../../../components/panel/PanelHeading";
import { PanelLoading } from "../../../../components/panel/PanelLoading";
import { PanelPage } from "../../../../components/panel/PanelPage";
import { useResults } from "../../../../helpers/useResults";

export function Component() {
  const results = useResults();

  return (
    <PanelPage>
      <PanelHeading
        eyebrow="Resultados"
        title="Tabla actual"
        description="En cada disciplina el 1.º suma 1000 puntos, el 2.º 800 y el 3.º 600. La tabla general junta esos podios por escuela."
      />
      {results.loading ? (
        <PanelLoading label="Cargando resultados…" />
      ) : (
        <ResultsBoard
          schools={results.schools}
          disciplines={results.disciplines}
          teams={results.teams}
        />
      )}
    </PanelPage>
  );
}
