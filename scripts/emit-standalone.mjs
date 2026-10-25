import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";

const modelSrc = readFileSync(new URL("../src/lib/psycho/model.ts", import.meta.url), "utf8");
const modelJs = ts
  .transpileModule(modelSrc, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  })
  .outputText.replace(/^export /gm, "");
const domJs = readFileSync(new URL("./standalone-dom.js", import.meta.url), "utf8");

const check = new Function(
  modelJs +
    `
  const calm = evaluate({
    format: "solo", recentGames: "g5", frequency: "regular", sameFormat: "pure", memory: "precise",
    encounterRate: "half", tone: "peaceful", shotsReceived: "never", ambush: "never", traps: "never", contactShape: "open", trend: "stable",
    firstShot: "never", firstDamage: "never", thirdParty: "never", chase: "never", noProof: "never", accidental: "none",
    hitFirst: "nofight", surviveOnly: "always", broke: "nofight", pursuedAfter: "noneutral", overstay: "never",
    mic: "often", greet: "often", emote: "sometimes", deesc: "often", shareExtract: "often", reactPeace: "leave", reactAim: "hold",
    duration: "none", involved: "none", damageAmt: "light", downs: "none", pursuitCount: "none", repeats: "never",
    extractResult: "calm", extractContest: "rare", elevator: "never", kit: "standard", tolerance: "annoying"
  });
  if (!(calm.score < 35)) throw new Error("calm score " + calm.score);
  const hunter = evaluate({
    format: "solo", recentGames: "g5", frequency: "daily", sameFormat: "pure", memory: "precise",
    encounterRate: "every", tone: "hostile", shotsReceived: "always", ambush: "frequent", traps: "frequent", contactShape: "pvp", trend: "hotter",
    firstShot: "always", firstDamage: "always", thirdParty: "often", chase: "often", noProof: "often", accidental: "none",
    hitFirst: "rarely", surviveOnly: "hunted", broke: "never", pursuedAfter: "often", overstay: "often",
    mic: "off", greet: "never", emote: "never", deesc: "never", shareExtract: "never", reactPeace: "shoot", reactAim: "shoot",
    duration: "long", involved: "chaos", damageAmt: "heavy", downs: "many", pursuitCount: "several", repeats: "often",
    extractResult: "contested", extractContest: "often", elevator: "frequent", kit: "rare", tolerance: "refuse"
  });
  if (hunter.score !== 300) throw new Error("hunter score " + hunter.score);
  const defender = evaluate({
    format: "solo", recentGames: "g4", frequency: "regular", sameFormat: "pure", memory: "precise",
    encounterRate: "most", tone: "hostile", shotsReceived: "often", ambush: "several", traps: "rare", contactShape: "pvp", trend: "hotter",
    firstShot: "never", firstDamage: "never", thirdParty: "never", chase: "never", noProof: "never", accidental: "none",
    hitFirst: "always", surviveOnly: "always", broke: "often", pursuedAfter: "never", overstay: "never",
    mic: "often", greet: "often", emote: "sometimes", deesc: "often", shareExtract: "often", reactPeace: "leave", reactAim: "hold",
    duration: "mid", involved: "one", damageAmt: "mid", downs: "rare", pursuitCount: "none", repeats: "sometimes",
    extractResult: "contested", extractContest: "often", elevator: "several", kit: "standard", tolerance: "annoying"
  });
  if (!defender.defenderVerdict) throw new Error("missing defender verdict, score " + defender.score);
  return calm.score + "/" + hunter.score + "/" + defender.score;
`,
);
const stamp = check();

const css = `
:root { color-scheme: dark; --canvas:#071016; --surface:#10202b; --raised:#163042; --line:#2a4658; --fg:#e7f4f6; --muted:#8eacb8; --cyan:#3ee0ff; --watch:#f0b429; --hot:#ff4d5e; }
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--canvas); color: var(--fg); font-family: "Outfit", "Segoe UI", sans-serif; }
body { min-height: 100dvh; }
button, summary { cursor: pointer; font: inherit; color: inherit; }
button { min-height: 44px; }
h1 { font-family: "Chakra Petch", "Segoe UI", sans-serif; font-size: clamp(2rem, 6vw, 3.2rem); line-height: 1.1; margin: 0.4rem 0; }
h2 { font-family: "Chakra Petch", "Segoe UI", sans-serif; font-size: 1.25rem; margin: 1.4rem 0 0.4rem; }
p { line-height: 1.5; }
header { border-bottom: 1px solid var(--line); }
.bar, main { width: min(64rem, calc(100% - 2rem)); margin: 0 auto; }
.bar { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: space-between; padding: 1rem 0; }
.brand { background: none; border: 0; text-align: left; padding: 0; }
.brand small, .muted, small { color: var(--muted); }
.kicker { font-family: "Chakra Petch", sans-serif; letter-spacing: 0.12em; text-transform: uppercase; color: var(--cyan); font-size: 0.75rem; margin: 0; }
.lead { font-size: 1.15rem; }
.notice, .card, .banner { border: 1px solid var(--line); border-radius: 0.9rem; padding: 1rem; background: var(--surface); }
.card.accent { border-color: var(--cyan); }
.banner.warn, .warn-text { color: var(--watch); }
.advice { border-color: var(--watch); }
.advice h2 { color: var(--watch); margin-top: 0; }
main { padding: 1.5rem 0 3rem; }
.split, .axes, .steps { display: grid; gap: 0.75rem; margin-top: 1rem; }
@media (min-width: 800px) { .split, .axes { grid-template-columns: 1fr 1fr; } .axes { grid-template-columns: 1fr 1fr 1fr; } .steps { grid-template-columns: 1fr 1fr 1fr; } .layout { display: grid; grid-template-columns: 12rem 1fr; gap: 1.25rem; } }
.steps { list-style: none; padding: 0; }
.steps li, .nav { border: 1px solid var(--line); border-radius: 0.9rem; padding: 0.9rem; }
.nav { list-style: none; display: flex; gap: 0.4rem; overflow-x: auto; margin: 0; padding: 0; }
.nav li { margin: 0; }
.nav button { background: transparent; border: 1px solid transparent; border-radius: 0.6rem; padding: 0.45rem 0.6rem; white-space: nowrap; }
.nav button.on { border-color: var(--cyan); background: var(--surface); }
.layout section { min-width: 0; }
.strong { font-weight: 600; margin: 0.3rem 0; }
.gauge-top, .row, .scale, .factors li { display: flex; justify-content: space-between; gap: 0.75rem; align-items: flex-end; }
.score { font-family: "Chakra Petch", sans-serif; font-size: 3rem; line-height: 1; margin: 0; }
.gauge.compact .score { font-size: 1.6rem; }
.score.cyan, .fill.cyan, .num { color: var(--cyan); }
.score.watch { color: var(--watch); }
.score.hot { color: var(--hot); }
.score.muted { color: var(--muted); }
.fill.cyan { background: var(--cyan); }
.fill.watch { background: var(--watch); }
.fill.hot { background: var(--hot); }
.fill.muted { background: var(--line); }
.track { height: 0.5rem; background: var(--raised); border-radius: 999px; overflow: hidden; margin-top: 0.7rem; }
.track.thin { height: 0.3rem; }
.fill { height: 100%; }
.scale { color: var(--muted); font-size: 0.75rem; margin-top: 0.35rem; }
.num { font-family: "Chakra Petch", sans-serif; font-size: 1.4rem; margin: 0.2rem 0; }
.options { display: grid; gap: 0.6rem; margin-top: 1rem; }
.option { text-align: left; background: var(--canvas); border: 1px solid var(--line); border-radius: 0.9rem; padding: 0.8rem 1rem; }
.option.on { border-color: var(--cyan); background: var(--surface); }
.option small { display: block; color: var(--muted); margin-top: 0.25rem; }
.actions { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 1.2rem; }
.actions button, button.primary { border-radius: 0.8rem; border: 1px solid var(--line); background: transparent; padding: 0.7rem 1rem; }
button.primary { background: var(--cyan); color: var(--canvas); border-color: var(--cyan); font-weight: 700; }
button.primary:disabled { opacity: 0.4; }
button.ghost { border: 0; color: var(--muted); background: none; }
.factors { list-style: none; padding: 0; margin: 0.4rem 0 0; }
.factors b { color: var(--cyan); font-family: "Chakra Petch", sans-serif; }
ul { padding-left: 1.1rem; }
li { margin: 0.35rem 0; color: var(--muted); line-height: 1.45; }
.links { list-style: none; padding: 0; }
a { color: var(--cyan); }
textarea { width: 100%; min-height: 16rem; margin-top: 0.6rem; background: var(--canvas); color: var(--fg); border: 1px solid var(--line); border-radius: 0.8rem; padding: 0.8rem; }
.transparency { margin-top: 2rem; border-top: 1px solid var(--line); padding-top: 1rem; }
.stack { display: grid; gap: 0.6rem; }
summary { min-height: 44px; display: flex; align-items: center; }
.small { font-size: 0.8rem; }
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
`;

const safeJs = (modelJs + "\n" + domJs).replace(/<\/script/gi, "<\\/script");
const html = [
  "<!DOCTYPE html>",
  '<html lang="fr">',
  "<head>",
  '  <meta charset="utf-8" />',
  '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
  "  <title>RAIDER PSYCHO-PASS</title>",
  '  <meta name="description" content="Calcule le Psycho-Pass de ton Raider en temps réel. Indicateur communautaire expérimental pour ARC Raiders — pas un score Embark." />',
  '  <meta name="theme-color" content="#071016" />',
  '  <link rel="preconnect" href="https://fonts.googleapis.com" />',
  '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
  '  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Outfit:wght@400;500;600;700&display=swap" />',
  "  <style>",
  css,
  "  </style>",
  "</head>",
  '<body id="top">',
  '  <div id="app"></div>',
  "  <script>",
  safeJs,
  "  </script>",
  "</body>",
  "</html>",
  "",
].join("\n");

const outPath = new URL("../public/raider_psycho_pass_general.html", import.meta.url);
writeFileSync(outPath, html);
console.log("wrote", outPath.pathname, "bytes", html.length, "check", stamp);
