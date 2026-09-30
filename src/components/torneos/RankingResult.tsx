import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { PODIUM_POINTS, type PodiumPlace } from "../../helpers/results";
import { disciplineName, houseName, type Team } from "../../helpers/teams";
import {
  formatEventDate,
  formatLabel,
  type RankingPodium,
  type Tournament,
} from "../../helpers/tournaments";
import { saveRankingPodium } from "../../helpers/tournamentsFirestore";
import { PanelField } from "../panel/PanelField";
import { PanelHeading } from "../panel/PanelHeading";
import { PanelPage } from "../panel/PanelPage";
import {
  panelFieldClassName,
  panelGhostButtonClassName,
  panelPrimaryButtonClassName,
} from "../panel/panelClasses";

const PLACES = [
  { key: "firstId", place: 1 },
  { key: "secondId", place: 2 },
  { key: "thirdId", place: 3 },
] as const satisfies ReadonlyArray<{
  key: keyof RankingPodium;
  place: PodiumPlace;
}>;

function podiumKey(podium: RankingPodium) {
  return PLACES.map((item) => podium[item.key] ?? "").join("|");
}

function placeWord(place: PodiumPlace) {
  if (place === 1) return "1.º";
  if (place === 2) return "2.º";
  return "3.º";
}

export function RankingResult({
  tournament,
  teams,
}: {
  tournament: Tournament;
  teams: Team[];
}) {
  const enrolled = tournament.teamIds
    .map((teamId) => teams.find((team) => team.id === teamId))
    .filter((team): team is Team => team !== undefined)
    .sort((left, right) => left.name.localeCompare(right.name, "es"));
  const savedKey = podiumKey(tournament.podium);
  const [seenKey, setSeenKey] = useState(savedKey);
  const [podium, setPodium] = useState<RankingPodium>(tournament.podium);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (seenKey !== savedKey) {
    setSeenKey(savedKey);
    setPodium(tournament.podium);
    setError(null);
  }

  const event = tournament.event;
  const dirty = podiumKey(podium) !== savedKey;

  const handleSave = async (formEvent: SubmitEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (saving) return;

    const form = formEvent.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const allowed = new Set(enrolled.map((team) => team.id));
    const ids = PLACES.map((item) => podium[item.key]);
    if (
      ids.some((teamId) => !teamId || !allowed.has(teamId)) ||
      new Set(ids).size !== ids.length
    ) {
      setError("Elegí tres equipos distintos del torneo.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await saveRankingPodium(tournament.id, podium);
    } catch {
      setError("No se pudo guardar el podio. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PanelPage>
      <PanelHeading
        eyebrow="Resultado"
        title={disciplineName(tournament.disciplineId)}
        description={formatLabel(tournament.format)}
        action={
          <Link to="/panel/torneos" className={panelGhostButtonClassName}>
            Volver a torneos
          </Link>
        }
      />

      <section className="mt-6 rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-4">
        <h2 className="font-cyber text-sm font-black tracking-widest text-white uppercase">
          La prueba
        </h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-slate-400">Lugar</dt>
            <dd className="mt-1 text-sm break-words text-slate-100">
              {event?.venue || "Sin lugar"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-400">Fecha</dt>
            <dd className="mt-1 text-sm text-slate-100">
              {event?.eventDate
                ? formatEventDate(event.eventDate)
                : "Sin fecha"}
            </dd>
          </div>
          {event?.details ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-slate-400">Detalles</dt>
              <dd className="mt-1 text-sm break-words whitespace-pre-wrap text-slate-100">
                {event.details}
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <form
        onSubmit={(formEvent) => void handleSave(formEvent)}
        className="mt-4"
      >
        <fieldset
          disabled={saving || enrolled.length < 3}
          className="rounded-2xl border border-cyan-500/30 bg-[#0c0e1a]/90 p-4"
        >
          <legend className="font-cyber text-sm font-black tracking-widest text-white uppercase">
            Podio
          </legend>
          <p className="mt-2 text-sm text-slate-400">
            Cuando termine la prueba, cargá los tres primeros. Esos puestos
            suman 1000, 800 y 600 en la tabla general.
          </p>
          {enrolled.length < 3 ? (
            <p className="mt-3 text-sm text-amber-200/90">
              Hacen falta al menos tres equipos inscriptos para cargar el podio.
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {PLACES.map((item) => {
                const taken = new Set(
                  PLACES.filter((place) => place.key !== item.key).map(
                    (place) => podium[place.key],
                  ),
                );

                return (
                  <PanelField
                    key={item.key}
                    id={`podio-${item.place}`}
                    label={`${placeWord(item.place)} · ${PODIUM_POINTS[item.place].toLocaleString("es-AR")} pts`}
                  >
                    <select
                      id={`podio-${item.place}`}
                      required
                      value={podium[item.key] ?? ""}
                      onChange={(change) => {
                        const teamId = change.target.value;
                        setPodium((current) => ({
                          ...current,
                          [item.key]: teamId || null,
                        }));
                      }}
                      className={panelFieldClassName}
                    >
                      <option value="">Elegí un equipo</option>
                      {enrolled.map((team) => (
                        <option
                          key={team.id}
                          value={team.id}
                          disabled={
                            taken.has(team.id) && podium[item.key] !== team.id
                          }
                        >
                          {team.name} · {houseName(team.houseId)}
                        </option>
                      ))}
                    </select>
                  </PanelField>
                );
              })}
            </div>
          )}
        </fieldset>
        {error ? (
          <p role="alert" className="mt-3 text-sm text-rose-300">
            {error}
          </p>
        ) : null}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving || !dirty || enrolled.length < 3}
            className={panelPrimaryButtonClassName}
          >
            {saving ? "Guardando…" : "Guardar podio"}
          </button>
        </div>
      </form>
    </PanelPage>
  );
}
