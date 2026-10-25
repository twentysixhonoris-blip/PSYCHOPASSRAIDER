/* Interface du fichier autonome. Le modèle est concaténé au-dessus de ce script. */
const STORAGE_KEY = "raider-psycho-pass-v2";
const app = document.querySelector("#app");

let moduleId = "general";
let bundles = {
  general: { answers: {}, cursorId: "format", screen: "home" },
  "last-raid": { answers: {}, cursorId: "format", screen: "home" },
};
let answers = {};
let cursorId = "format";
let screen = "home";
let copyState = "idle";
let fallback = "";

function pull() {
  const b = bundles[moduleId];
  answers = b.answers;
  cursorId = b.cursorId;
  screen = b.screen;
}

function push() {
  bundles[moduleId] = { answers, cursorId, screen };
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" }[ch]));
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved.drafts?.general && saved.drafts["last-raid"]) bundles = saved.drafts;
      if (saved.module === "general" || saved.module === "last-raid") moduleId = saved.module;
      pull();
      return;
    }
    const legacy = localStorage.getItem("raider-psycho-pass-general-v1");
    if (!legacy) return;
    const saved = JSON.parse(legacy);
    bundles.general = {
      answers: saved.answers && typeof saved.answers === "object" ? saved.answers : {},
      cursorId: typeof saved.cursorId === "string" ? saved.cursorId : "format",
      screen: saved.screen === "quiz" || saved.screen === "report" ? saved.screen : "home",
    };
    pull();
  } catch {
    /* stockage illisible */
  }
}

function save() {
  push();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ module: moduleId, drafts: bundles }));
}

function tone(score) {
  if (score >= 180) return "hot";
  if (score >= 80) return "watch";
  return "cyan";
}

function gauge(reading, compact) {
  const score = reading.unlocked ? reading.score : null;
  const pct = score == null ? 0 : (score / 300) * 100;
  const klass = score == null ? "muted" : tone(score);
  return `<div class="gauge ${compact ? "compact" : ""}">
    <div class="gauge-top">
      <div>
        <p class="kicker">Psycho-Pass</p>
        <p class="score ${klass}">${score == null ? "···" : String(score).padStart(3, "0")}</p>
      </div>
      ${compact ? "" : `<p class="gauge-side">${reading.provisional ? "Lecture provisoire" : "sur 300"}<span>${reading.unlocked ? esc(reading.category.name) : "En attente"}</span></p>`}
    </div>
    <div class="track" role="meter" aria-valuemin="0" aria-valuemax="300" aria-valuenow="${score ?? 0}" aria-label="Psycho-Pass sur 300">
      <div class="fill ${klass}" style="width:${pct}%"></div>
    </div>
    ${compact ? "" : `<div class="scale"><span>0</span><span>300</span></div>`}
  </div>`;
}

function axis(label, value, hint) {
  const pct = value == null ? 0 : value;
  return `<div class="card">
    <div class="row"><p>${esc(label)}</p><p class="num">${value == null ? "—" : value}</p></div>
    <div class="track thin"><div class="fill cyan" style="width:${pct}%"></div></div>
    <p class="muted">${esc(hint)}</p>
  </div>`;
}

function transparency() {
  const blocks = TRANSPARENCY.map(
    (block) => `<details class="card">
      <summary>${esc(block.title)}</summary>
      <ul>${block.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
    </details>`,
  ).join("");
  const links = SOURCES.map(
    (s) => `<li><a href="${esc(s.href)}" target="_blank" rel="noreferrer">${esc(s.label)}</a></li>`,
  ).join("");
  return `<section class="transparency">
    <h2>Ce qui est su, supposé, ou seulement ludique</h2>
    <div class="stack">${blocks}</div>
    <ul class="links">${links}</ul>
    <p class="muted small">Aucune donnée n'est envoyée. Les réponses restent dans ce navigateur. Fichier autonome, sans serveur.</p>
  </section>`;
}

function home() {
  const cards = MODULES.map((mod) => {
    const saved = Object.keys(bundles[mod.id].answers).length > 0;
    return `<article class="card accent"><p class="kicker">${esc(mod.index)}</p><h2>${esc(mod.title)}</h2><p class="muted">${esc(mod.text)}</p>
      <div class="actions">
        <button type="button" class="primary" data-act="open" data-module="${esc(mod.id)}" data-mode="start">${saved ? "Depuis le début" : "Ouvrir"}</button>
        ${saved ? `<button type="button" data-act="open" data-module="${esc(mod.id)}" data-mode="resume">Continuer</button>` : ""}
        ${saved ? `<button type="button" class="ghost" data-act="open" data-module="${esc(mod.id)}" data-mode="clear">Effacer</button>` : ""}
      </div></article>`;
  }).join("");
  return `<p class="kicker">DEUX LECTURES · MÊME ÉCHELLE</p>
    <h1>RAIDER PSYCHO-PASS</h1>
    <p class="lead">Calcule le Psycho-Pass de ton Raider en temps réel.</p>
    <p class="muted">Chaque rapport donne trois choses : le Psycho-Pass sur 300, la chance de croiser un rat ou un joueur PvP, et un nombre de parties chill. Le profil général lit une tendance. La dernière partie lit un seul raid.</p>
    <p class="notice">Le matchmaking d'ARC Raiders n'est pas public dans le détail. Les chances et le nombre de parties chill sont une lecture expérimentale, pas une probabilité Embark.</p>
    <div class="split">${cards}</div>
    <ol class="steps">
      <li><p class="kicker">01</p><p class="strong">Le Psycho-Pass</p><p class="muted">0 à 300. Tendance sur plusieurs parties, ou film d'un seul raid.</p></li>
      <li><p class="kicker">02</p><p class="strong">Rat ou PvP</p><p class="muted">Deux chances séparées. Un rat n'est pas un joueur qui cherche le fight.</p></li>
      <li><p class="kicker">03</p><p class="strong">Parties chill</p><p class="muted">Un nombre. Pas un délai Embark pour retrouver des lobbys calmes.</p></li>
    </ol>
    ${transparency()}`;
}

function quiz(visible, reading) {
  const current = visible.find((q) => q.id === cursorId) ?? visible[0];
  const index = Math.max(0, visible.findIndex((q) => q.id === current.id));
  const section = sectionsFor(moduleId).find((s) => s.id === current.sectionId);
  const nav = sectionsFor(moduleId).map((s) => {
    const qs = visible.filter((q) => q.sectionId === s.id);
    if (!qs.length) return "";
    const done = qs.every((q) => answers[q.id]);
    const active = current.sectionId === s.id;
    return `<li><button type="button" class="${active ? "on" : ""}" data-act="jump" data-section="${esc(s.id)}"><span class="kicker">${esc(s.index)}</span> ${esc(s.title)}${done ? " ✓" : ""}</button></li>`;
  }).join("");
  const options = current.options
    .map((opt) => {
      const selected = answers[current.id] === opt.id;
      return `<button type="button" class="option ${selected ? "on" : ""}" data-act="pick" data-q="${esc(current.id)}" data-o="${esc(opt.id)}" aria-pressed="${selected}">
        <span>${esc(opt.label)}</span>
        ${opt.detail ? `<small>${esc(opt.detail)}</small>` : ""}
      </button>`;
    })
    .join("");
  return `<div class="layout"><ol class="nav">${nav}</ol><section>
    <div class="row muted"><p><span class="kicker">${esc(section.index)}</span> ${esc(section.title)} · ${moduleId === "last-raid" ? "Dernière partie" : "Profil général"}</p><p>Question ${index + 1} / ${visible.length}</p></div>
    <div class="track thin"><div class="fill cyan" style="width:${((index + 1) / visible.length) * 100}%"></div></div>
    ${gauge(reading, false)}
    <p class="muted">L'indice bouge avec tes réponses. Il ne lit pas les serveurs du jeu.</p>
    <h1>${esc(current.prompt)}</h1>
    ${current.note ? `<p class="muted">${esc(current.note)}</p>` : ""}
    <div class="options">${options}</div>
    <div class="actions">
      <button type="button" data-act="back">${index === 0 ? "Accueil" : "Retour"}</button>
      <button type="button" class="primary" data-act="next" ${answers[current.id] ? "" : "disabled"}>${index >= visible.length - 1 ? "Voir le rapport" : "Continuer"}</button>
    </div>
  </section></div>`;
}

function report(reading) {
  const factors = reading.factors.length
    ? `<ul class="factors">${reading.factors.map((f) => `<li><span>${esc(f.label)}</span><b>+${f.points}</b></li>`).join("")}</ul>`
    : `<p class="muted">Aucun facteur fort. L'indice reste bas.</p>`;
  const verdict = reading.defenderVerdict
    ? `<p class="banner">Verdict contextuel : Raider en lobby PvE s'étant défendu. Il décrit ton comportement, pas une promesse de lobby calme.</p>`
    : reading.defenderUncertain
      ? `<p class="banner warn">Tu sembles avoir surtout subi, mais la chronologie est trop trouée pour le verdict défensif.</p>`
      : "";
  const intervention = reading.intervention ? `<p class="banner">${esc(reading.intervention)}</p>` : "";
  return `<p class="kicker">RAPPORT · ${esc(reading.formatLabel.toUpperCase())} · ${reading.module === "last-raid" ? "DERNIÈRE PARTIE" : "PROFIL GÉNÉRAL"}</p>
    <h1>${esc(reading.category.name)}</h1>
    <p class="muted">${esc(reading.category.blurb)}</p>
    ${verdict}
    ${intervention}
    <div class="axes">
      <div class="card"><p class="kicker">Psycho-Pass</p><p class="num">${String(reading.score).padStart(3, "0")}</p><p class="muted">sur 300</p></div>
      <div class="card"><p class="kicker">Prochain contact</p><p class="num">Rat ${reading.ratChance}%</p><p class="num">PvP ${reading.pvpChance}%</p></div>
      <div class="card"><p class="kicker">Parties chill</p><p class="num">${reading.chillGames}</p><p class="muted">conseillées</p></div>
    </div>
    <p class="muted">${esc(reading.chanceNote)}</p>
    <p class="muted">${esc(reading.chillNote)}</p>
    <div class="card">${gauge(reading, false)}
      <p class="muted">Fourchette de lecture ${reading.low}–${reading.high}. Ce n'est pas une marge d'erreur Embark.</p>
    </div>
    <div class="axes">
      ${axis("Initiation", reading.initiation, "Combats que tu choisis de commencer.")}
      ${axis("Pression subie", reading.pressure, "Hostilité rencontrée, pas ton rôle.")}
      ${axis("Posture défensive", reading.defense, "Hors du score d'initiation.")}
    </div>
    <h2>Synthèse</h2>
    <p>${esc(reading.synthesis)}</p>
    <div class="split">
      <div class="card"><p class="kicker">Confiance</p><p class="num">${esc(reading.confidenceLabel)}</p><p class="muted">${esc(reading.gamesLabel)} · ${esc(reading.formatLabel)}</p></div>
      <div class="card"><p class="kicker">Ce qui pèse le plus</p>${factors}</div>
    </div>
    <div class="card advice"><h2>Conseil pour le prochain raid</h2><p>${esc(reading.gear)}</p></div>
    <h2>Incertitudes</h2>
    <ul>${reading.uncertainties.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>
    <h2>Hors calcul</h2>
    <ul>${reading.ignored.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>
    <div class="actions">
      <button type="button" class="primary" data-act="copy">${copyState === "ok" ? "Rapport copié" : "Copier pour Discord"}</button>
      <button type="button" data-act="edit">Modifier les réponses</button>
      <button type="button" data-act="restart">Recommencer</button>
    </div>
    ${copyState === "fallback" ? `<p class="warn-text">La copie automatique est bloquée. Sélectionne le texte ci-dessous.</p><textarea id="fallback" readonly>${esc(fallback)}</textarea>` : ""}
    ${transparency()}`;
}

function render() {
  const visible = visibleQuestions(answers, moduleId);
  const reading = evaluate(answers, moduleId);
  if (screen === "report" && !reading.complete) screen = "quiz";
  if (screen === "quiz" && !visible.some((q) => q.id === cursorId) && visible[0]) cursorId = visible[0].id;
  const body = screen === "quiz" ? quiz(visible, reading) : screen === "report" ? report(reading) : home();
  const showGauge = screen !== "home" && reading.unlocked;
  app.innerHTML = `<header><div class="bar">
      <button type="button" data-act="home" class="brand"><span class="kicker">RAIDER PSYCHO-PASS</span><small>Terminal d'analyse · pas un score Embark</small></button>
      ${showGauge ? gauge(reading, true) : ""}
    </div></header><main>${body}</main>`;
}

app.addEventListener("click", (event) => {
  const el = event.target.closest("[data-act]");
  if (!el) return;
  const act = el.dataset.act;
  const visible = visibleQuestions(answers, moduleId);
  const current = visible.find((q) => q.id === cursorId) ?? visible[0];
  const index = Math.max(0, visible.findIndex((q) => q.id === current?.id));
  if (act === "home") screen = "home";
  if (act === "open") {
    push();
    moduleId = el.dataset.module === "last-raid" ? "last-raid" : "general";
    pull();
    const next = visibleQuestions(answers, moduleId);
    const mode = el.dataset.mode;
    if (mode === "clear") {
      answers = {};
      cursorId = "format";
      screen = "home";
    } else if (mode === "resume") {
      screen = evaluate(answers, moduleId).complete ? "report" : "quiz";
    } else {
      cursorId = next[0]?.id ?? "format";
      screen = "quiz";
    }
    copyState = "idle";
    fallback = "";
  }
  if (act === "restart") {
    answers = {};
    cursorId = "format";
    screen = "home";
    copyState = "idle";
    fallback = "";
  }
  if (act === "pick") answers = { ...answers, [el.dataset.q]: el.dataset.o };
  if (act === "back") {
    if (index <= 0) screen = "home";
    else cursorId = visible[index - 1].id;
  }
  if (act === "next" && current && answers[current.id]) {
    if (index >= visible.length - 1) screen = "report";
    else cursorId = visible[index + 1].id;
  }
  if (act === "edit") {
    cursorId = visible[0]?.id ?? "format";
    screen = "quiz";
  }
  if (act === "jump") {
    const qs = visible.filter((q) => q.sectionId === el.dataset.section);
    const firstMissing = visible.find((q) => !answers[q.id]);
    const target = qs.find((q) => !answers[q.id]) ?? qs[0];
    if (target) {
      const targetIndex = visible.findIndex((q) => q.id === target.id);
      const frontier = firstMissing ? visible.findIndex((q) => q.id === firstMissing.id) : visible.length;
      cursorId = targetIndex > frontier ? firstMissing.id : target.id;
      screen = "quiz";
    }
  }
  if (act === "copy") {
    const text = discordReport(evaluate(answers, moduleId));
    const done = (ok) => {
      copyState = ok ? "ok" : "fallback";
      fallback = ok ? "" : text;
      save();
      render();
      if (!ok) document.querySelector("#fallback")?.select();
    };
    if (!navigator.clipboard?.writeText) done(false);
    else navigator.clipboard.writeText(text).then(() => done(true)).catch(() => done(false));
    return;
  }
  save();
  render();
  document.getElementById("top")?.scrollIntoView({ block: "start" });
});

load();
pull();
if (screen === "report" && !evaluate(answers, moduleId).complete) screen = "quiz";
render();
