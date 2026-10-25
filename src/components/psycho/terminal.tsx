import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Crosshair,
  RotateCcw,
  Shield,
} from "lucide-react";
import {
  MODULES,
  QUESTIONS,
  LAST_QUESTIONS,
  SOURCES,
  TRANSPARENCY,
  discordReport,
  evaluate,
  sectionsFor,
  visibleQuestions,
  type Answers,
  type ModuleId,
  type Reading,
} from "@/lib/psycho/model";

const STORAGE_KEY = "raider-psycho-pass-v2";
const LEGACY_KEY = "raider-psycho-pass-general-v1";

type Screen = "home" | "quiz" | "report";
type Draft = { answers: Answers; cursorId: string; screen: Screen };

function emptyDraft(): Draft {
  return { answers: {}, cursorId: "format", screen: "home" };
}

function cx(...parts: Array<string | false | undefined | null>): string {
  return parts.filter(Boolean).join(" ");
}

function toneText(score: number): string {
  if (score >= 180) return "text-hot";
  if (score >= 80) return "text-watch";
  return "text-cyan";
}

function toneFill(score: number): string {
  if (score >= 180) return "bg-hot";
  if (score >= 80) return "bg-watch";
  return "bg-cyan";
}

function Gauge({ reading, compact }: { reading: Reading; compact?: boolean }) {
  const score = reading.unlocked ? reading.score : null;
  const pct = score == null ? 0 : (score / 300) * 100;
  return (
    <div className={cx("min-w-0", compact && "w-40 sm:w-56")}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">Psycho-Pass</p>
          <p className={cx("font-display leading-none", compact ? "text-2xl" : "text-5xl", score == null ? "text-muted" : toneText(score))}>
            {score == null ? "···" : String(score).padStart(3, "0")}
          </p>
        </div>
        {!compact && (
          <p className="max-w-40 text-right text-sm text-muted">
            {reading.provisional ? "Lecture provisoire" : "sur 300"}
            <span className="mt-1 block text-fg">{reading.unlocked ? reading.category.name : "En attente"}</span>
          </p>
        )}
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-raised"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={300}
        aria-valuenow={score ?? 0}
        aria-label="Psycho-Pass sur 300"
      >
        <div className={cx("h-full rounded-full", score == null ? "bg-line" : toneFill(score))} style={{ width: `${pct}%` }} />
      </div>
      {!compact && (
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>0</span>
          <span>300</span>
        </div>
      )}
    </div>
  );
}

function Axis({ label, value, hint }: { label: string; value: number | null; hint: string }) {
  const pct = value == null ? 0 : value;
  return (
    <div className="rounded-xl border border-line bg-canvas p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-fg">{label}</p>
        <p className="font-display text-xl text-cyan">{value == null ? "—" : value}</p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-raised">
        <div className="h-full rounded-full bg-cyan" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-sm text-muted">{hint}</p>
    </div>
  );
}

export function PsychoPassApp() {
  const [moduleId, setModuleId] = useState<ModuleId>("general");
  const [drafts, setDrafts] = useState<Record<ModuleId, Draft>>({
    general: emptyDraft(),
    "last-raid": emptyDraft(),
  });
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fallback">("idle");
  const [fallback, setFallback] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const draft = drafts[moduleId];
  const { answers, cursorId, screen } = draft;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { module?: ModuleId; drafts?: Record<ModuleId, Draft> };
        if (saved.drafts?.general && saved.drafts["last-raid"]) setDrafts(saved.drafts);
        if (saved.module === "general" || saved.module === "last-raid") setModuleId(saved.module);
      } else {
        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy) {
          const saved = JSON.parse(legacy) as { screen?: Screen; answers?: Answers; cursorId?: string };
          setDrafts((prev) => ({
            ...prev,
            general: {
              answers: saved.answers && typeof saved.answers === "object" ? saved.answers : {},
              cursorId: typeof saved.cursorId === "string" ? saved.cursorId : "format",
              screen: saved.screen === "quiz" || saved.screen === "report" ? saved.screen : "home",
            },
          }));
        }
      }
    } catch {
      /* mémoire locale illisible : on repart du terminal vide */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ module: moduleId, drafts }));
  }, [drafts, moduleId, hydrated]);

  const visible = useMemo(() => visibleQuestions(answers, moduleId), [answers, moduleId]);
  const reading = useMemo(() => evaluate(answers, moduleId), [answers, moduleId]);
  const sections = sectionsFor(moduleId);
  const current = visible.find((q) => q.id === cursorId) ?? visible[0];
  const index = Math.max(0, visible.findIndex((q) => q.id === current?.id));
  const section = sections.find((s) => s.id === current?.sectionId);

  function writeDraft(mod: ModuleId, next: Draft) {
    setDrafts((prev) => ({ ...prev, [mod]: next }));
  }

  useEffect(() => {
    if (screen !== "quiz") return;
    if (!visible.some((q) => q.id === cursorId) && visible[0]) {
      writeDraft(moduleId, { ...draft, cursorId: visible[0].id });
    }
    // draft identity changes every write; cursor correction only depends on the visible list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, cursorId, screen, moduleId]);

  useEffect(() => {
    if (screen === "report" && !reading.complete) writeDraft(moduleId, { ...draft, screen: "quiz" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, reading.complete, moduleId]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("top")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [screen, cursorId, moduleId]);

  function select(questionId: string, optionId: string) {
    writeDraft(moduleId, { ...draft, answers: { ...answers, [questionId]: optionId } });
    setCopyState("idle");
  }

  function goNext() {
    if (!current || !answers[current.id]) return;
    if (index >= visible.length - 1) writeDraft(moduleId, { ...draft, screen: "report" });
    else writeDraft(moduleId, { ...draft, cursorId: visible[index + 1].id });
  }

  function goBack() {
    if (index <= 0) writeDraft(moduleId, { ...draft, screen: "home" });
    else writeDraft(moduleId, { ...draft, cursorId: visible[index - 1].id });
  }

  function openModule(id: ModuleId, mode: "start" | "resume") {
    const currentDraft = drafts[id];
    const nextVisible = visibleQuestions(currentDraft.answers, id);
    const done = evaluate(currentDraft.answers, id).complete;
    setModuleId(id);
    writeDraft(id, {
      ...currentDraft,
      screen: mode === "resume" && done ? "report" : "quiz",
      cursorId: mode === "start" ? (nextVisible[0]?.id ?? "format") : currentDraft.cursorId,
    });
    setCopyState("idle");
    setFallback("");
  }

  function restart(id: ModuleId = moduleId) {
    writeDraft(id, emptyDraft());
    setModuleId(id);
    setCopyState("idle");
    setFallback("");
  }

  async function copyReport() {
    const text = discordReport(reading);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard");
      await navigator.clipboard.writeText(text);
      setCopyState("ok");
      setFallback("");
    } catch {
      setFallback(text);
      setCopyState("fallback");
    }
  }

  return (
    <div id="top" className="min-h-dvh bg-canvas text-fg">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <button type="button" onClick={() => writeDraft(moduleId, { ...draft, screen: "home" })} className="min-h-11 text-left">
            <span className="font-display text-sm tracking-widest text-cyan">RAIDER PSYCHO-PASS</span>
            <span className="mt-1 block text-xs text-muted">Terminal d'analyse · pas un score Embark</span>
          </button>
          {screen !== "home" && reading.unlocked && <Gauge reading={reading} compact />}
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-6 lg:grid-cols-4 lg:px-6 lg:py-8">
        {screen !== "home" && (
          <aside className="min-w-0 lg:col-span-1">
            <ol className="flex max-w-full gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible">
              {sections.map((s) => {
                const qs = visible.filter((q) => q.sectionId === s.id);
                if (qs.length === 0) return null;
                const done = qs.every((q) => answers[q.id]);
                const active = current?.sectionId === s.id && screen === "quiz";
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        const firstMissing = visible.find((q) => !answers[q.id]);
                        const target = qs.find((q) => !answers[q.id]) ?? qs[0];
                        const targetIndex = visible.findIndex((q) => q.id === target.id);
                        const frontier = firstMissing ? visible.findIndex((q) => q.id === firstMissing.id) : visible.length;
                        writeDraft(moduleId, {
                          ...draft,
                          cursorId: targetIndex > frontier ? firstMissing!.id : target.id,
                          screen: "quiz",
                        });
                      }}
                      className={cx(
                        "flex min-h-11 w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm",
                        active ? "border-cyan bg-surface text-fg" : "border-transparent text-muted",
                      )}
                    >
                      <span className="font-display text-xs text-cyan">{s.index}</span>
                      <span className="whitespace-nowrap">{s.title}</span>
                      {done && <Check className="ml-auto size-4 shrink-0 text-cyan" aria-hidden />}
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>
        )}

        <div className={cx("min-w-0", screen === "home" ? "lg:col-span-4" : "lg:col-span-3")}>
          {screen === "home" && (
            <Home
              drafts={drafts}
              onOpen={openModule}
              onRestart={restart}
            />
          )}

          {screen === "quiz" && current && section && (
            <section aria-labelledby="q-title">
              <div className="flex items-center justify-between gap-3 text-sm text-muted">
                <p>
                  <span className="font-display text-cyan">{section.index}</span> {section.title}
                  <span className="ml-2 text-muted">{moduleId === "last-raid" ? "· Dernière partie" : "· Profil général"}</span>
                </p>
                <p>
                  Question {index + 1} / {visible.length}
                </p>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-raised" aria-hidden>
                <div className="h-full rounded-full bg-cyan" style={{ width: `${((index + 1) / visible.length) * 100}%` }} />
              </div>
              <div className="mt-6">
                <Gauge reading={reading} />
                <p className="mt-3 text-sm text-muted">
                  L'indice bouge avec tes réponses. Il ne lit pas les serveurs du jeu.
                </p>
              </div>
              <h1 id="q-title" className="mt-8 font-display text-2xl leading-snug text-fg sm:text-3xl">
                {current.prompt}
              </h1>
              {current.note && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{current.note}</p>}
              <div className="mt-5 grid gap-3" role="group" aria-label="Réponses">
                {current.options.map((opt) => {
                  const selected = answers[current.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => select(current.id, opt.id)}
                      className={cx(
                        "min-h-11 rounded-xl border px-4 py-3 text-left transition-colors",
                        selected ? "border-cyan bg-surface" : "border-line bg-canvas hover:border-cyan",
                      )}
                    >
                      <span className="flex items-start gap-3">
                        <span
                          className={cx(
                            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border",
                            selected ? "border-cyan bg-cyan text-canvas" : "border-line",
                          )}
                          aria-hidden
                        >
                          {selected && <Check className="size-3" />}
                        </span>
                        <span>
                          <span className="block text-base text-fg">{opt.label}</span>
                          {opt.detail && <span className="mt-1 block text-sm text-muted">{opt.detail}</span>}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-line px-4 text-sm text-fg"
                >
                  <ChevronLeft className="size-4" aria-hidden />
                  {index === 0 ? "Accueil" : "Retour"}
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!answers[current.id]}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan px-4 text-sm font-semibold text-canvas disabled:opacity-40"
                >
                  {index >= visible.length - 1 ? "Voir le rapport" : "Continuer"}
                  <ChevronRight className="size-4" aria-hidden />
                </button>
              </div>
            </section>
          )}

          {screen === "report" && reading.complete && (
            <Report reading={reading} copyState={copyState} fallback={fallback} onCopy={() => void copyReport()} onEdit={() => {
              writeDraft(moduleId, { ...draft, cursorId: visible[0]?.id ?? "format", screen: "quiz" });
            }} onRestart={() => restart(moduleId)} />
          )}
        </div>
      </main>
    </div>
  );
}

function Home({
  drafts,
  onOpen,
  onRestart,
}: {
  drafts: Record<ModuleId, Draft>;
  onOpen: (id: ModuleId, mode: "start" | "resume") => void;
  onRestart: (id: ModuleId) => void;
}) {
  return (
    <div>
      <p className="font-display text-xs tracking-widest text-cyan">DEUX LECTURES · MÊME ÉCHELLE</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-fg sm:text-5xl">RAIDER PSYCHO-PASS</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg">Calcule le Psycho-Pass de ton Raider en temps réel.</p>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
        Chaque rapport donne trois choses : le Psycho-Pass sur 300, la chance de croiser un rat ou un joueur PvP,
        et un nombre de parties chill. Le profil général lit une tendance. La dernière partie lit un seul raid.
      </p>

      <p className="mt-4 max-w-2xl rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted">
        Le matchmaking d'ARC Raiders n'est pas public dans le détail. Les chances et le nombre de parties chill
        sont une lecture expérimentale, pas une probabilité Embark.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {MODULES.map((mod) => {
          const saved = Object.keys(drafts[mod.id].answers).length > 0;
          return (
            <article key={mod.id} className="rounded-xl border border-cyan bg-surface p-4">
              <p className="font-display text-xs tracking-widest text-cyan">{mod.index}</p>
              <h2 className="mt-2 font-display text-xl text-fg">{mod.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{mod.text}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpen(mod.id, "start")}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan px-4 text-sm font-semibold text-canvas"
                >
                  <Crosshair className="size-4" aria-hidden />
                  {saved ? "Depuis le début" : "Ouvrir"}
                </button>
                {saved && (
                  <button
                    type="button"
                    onClick={() => onOpen(mod.id, "resume")}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-4 text-sm text-fg"
                  >
                    Continuer
                  </button>
                )}
                {saved && (
                  <button
                    type="button"
                    onClick={() => onRestart(mod.id)}
                    className="inline-flex min-h-11 items-center justify-center px-3 text-sm text-muted"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <ol className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["01", "Le Psycho-Pass", "0 à 300. Tendance sur plusieurs parties, ou film d'un seul raid."],
          ["02", "Rat ou PvP", "Deux chances séparées. Un rat n'est pas un joueur qui cherche le fight."],
          ["03", "Parties chill", "Un nombre. Pas un délai Embark pour retrouver des lobbys calmes."],
        ].map(([n, t, d]) => (
          <li key={n} className="rounded-xl border border-line p-4">
            <p className="font-display text-cyan">{n}</p>
            <p className="mt-2 font-semibold text-fg">{t}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{d}</p>
          </li>
        ))}
      </ol>

      <Transparency />
    </div>
  );
}

function Report({
  reading,
  copyState,
  fallback,
  onCopy,
  onEdit,
  onRestart,
}: {
  reading: Reading;
  copyState: "idle" | "ok" | "fallback";
  fallback: string;
  onCopy: () => void;
  onEdit: () => void;
  onRestart: () => void;
}) {
  return (
    <article>
      <p className="font-display text-xs tracking-widest text-cyan">RAPPORT · {reading.formatLabel.toUpperCase()}</p>
      <h1 className="mt-3 font-display text-3xl leading-tight text-fg sm:text-4xl">{reading.category.name}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{reading.category.blurb}</p>
      {reading.defenderVerdict && (
        <p className="mt-4 flex gap-3 rounded-xl border border-cyan bg-surface px-4 py-3 text-sm leading-relaxed text-fg">
          <Shield className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
          Verdict contextuel : Raider en lobby PvE s'étant défendu. Il peut coexister avec un indice modéré ou
          élevé : il décrit ton comportement, pas une promesse de lobby calme.
        </p>
      )}
      {reading.defenderUncertain && (
        <p className="mt-4 flex gap-3 rounded-xl border border-watch bg-surface px-4 py-3 text-sm leading-relaxed text-fg">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-watch" aria-hidden />
          Tu sembles avoir surtout subi, mais la chronologie est trop trouée pour le verdict défensif.
        </p>
      )}
      {reading.intervention && (
        <p className="mt-4 rounded-xl border border-cyan bg-surface px-4 py-3 text-sm leading-relaxed text-fg">
          {reading.intervention}
        </p>
      )}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-widest text-muted">Psycho-Pass</p>
          <p className={cx("mt-2 font-display text-4xl", toneText(reading.score))}>{String(reading.score).padStart(3, "0")}</p>
          <p className="mt-1 text-sm text-muted">sur 300</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-widest text-muted">Prochain contact</p>
          <p className="mt-2 font-display text-2xl text-fg">Rat {reading.ratChance}%</p>
          <p className="mt-1 font-display text-2xl text-watch">PvP {reading.pvpChance}%</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-widest text-muted">Parties chill</p>
          <p className="mt-2 font-display text-4xl text-cyan">{reading.chillGames}</p>
          <p className="mt-1 text-sm text-muted">{reading.chillGames === 1 ? "partie conseillée" : "parties conseillées"}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{reading.chanceNote}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{reading.chillNote}</p>
      <div className="mt-6 rounded-xl border border-line bg-surface p-4 sm:p-5">
        <Gauge reading={reading} />
        <p className="mt-4 text-sm text-muted">
          Fourchette de lecture {reading.low}–{reading.high}. Plus elle est large, moins il faut figer une
          habitude de sortie dessus. Ce n'est pas une marge d'erreur Embark.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Axis label="Initiation" value={reading.initiation} hint="Combats que tu choisis de commencer." />
        <Axis label="Pression subie" value={reading.pressure} hint="Hostilité rencontrée, pas ton rôle." />
        <Axis label="Posture défensive" value={reading.defense} hint="Hors du score d'initiation." />
      </div>

      <section className="mt-6">
        <h2 className="font-display text-xl text-fg">Synthèse</h2>
        <p className="mt-2 text-base leading-relaxed text-fg">{reading.synthesis}</p>
      </section>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-line p-4">
          <dt className="text-xs uppercase tracking-widest text-muted">Confiance</dt>
          <dd className="mt-2 font-display text-2xl text-fg">{reading.confidenceLabel}</dd>
          <dd className="mt-1 text-sm text-muted">{reading.gamesLabel} · {reading.formatLabel}</dd>
        </div>
        <div className="rounded-xl border border-line p-4">
          <dt className="text-xs uppercase tracking-widest text-muted">Ce qui pèse le plus</dt>
          <dd className="mt-2">
            {reading.factors.length === 0 ? (
              <p className="text-sm text-muted">Aucun facteur fort. L'indice reste bas.</p>
            ) : (
              <ul className="space-y-2">
                {reading.factors.map((f) => (
                  <li key={f.label} className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-fg">{f.label}</span>
                    <span className="font-display text-cyan">+{f.points}</span>
                  </li>
                ))}
              </ul>
            )}
          </dd>
        </div>
      </dl>

      <section className="mt-4 rounded-xl border border-watch bg-surface p-4 sm:p-5">
        <h2 className="font-display text-lg text-watch">Conseil pour le prochain raid</h2>
        <p className="mt-2 text-base leading-relaxed text-fg">{reading.gear}</p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl text-fg">Incertitudes</h2>
        <ul className="mt-3 space-y-2">
          {reading.uncertainties.map((u) => (
            <li key={u} className="text-sm leading-relaxed text-muted">
              {u}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-6">
        <h2 className="font-display text-xl text-fg">Hors calcul</h2>
        <ul className="mt-3 space-y-2">
          {reading.ignored.map((u) => (
            <li key={u} className="text-sm leading-relaxed text-muted">
              {u}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan px-5 font-semibold text-canvas"
        >
          <Copy className="size-4" aria-hidden />
          {copyState === "ok" ? "Rapport copié" : "Copier pour Discord"}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-line px-5 text-fg"
        >
          Modifier les réponses
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line px-5 text-fg"
        >
          <RotateCcw className="size-4" aria-hidden />
          Recommencer
        </button>
      </div>
      {copyState === "fallback" && (
        <div className="mt-4">
          <p className="text-sm text-watch">La copie automatique est bloquée. Sélectionne le texte ci-dessous.</p>
          <textarea readOnly value={fallback} className="mt-2 h-64 w-full rounded-xl border border-line bg-canvas p-3 text-sm text-fg" />
        </div>
      )}
      <p className="mt-6 text-sm text-muted">
        <a className="text-cyan underline" href="/raider_psycho_pass_general.html" download>
          Télécharger le terminal HTML autonome
        </a>
        <span> — un seul fichier, ouvrable sans installation, partageable tel quel.</span>
      </p>
      <Transparency />
    </article>
  );
}

function Transparency() {
  return (
    <section className="mt-10 border-t border-line pt-6">
      <h2 className="font-display text-xl text-fg">Ce qui est su, supposé, ou seulement ludique</h2>
      <div className="mt-4 grid gap-3">
        {TRANSPARENCY.map((block) => (
          <details key={block.id} className="rounded-xl border border-line bg-surface px-4 py-3">
            <summary className="min-h-11 cursor-pointer font-semibold text-fg">{block.title}</summary>
            <ul className="mt-3 space-y-2 pb-2">
              {block.items.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {SOURCES.map((s) => (
          <li key={s.href}>
            <a className="text-sm text-cyan underline" href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        {QUESTIONS.length} questions pour le profil général, {LAST_QUESTIONS.length} pour la dernière partie. Moins si tes réponses en ferment. Aucune donnée n'est envoyée : les réponses restent dans ce navigateur.
      </p>
    </section>
  );
}
