/**
 * RAIDER PSYCHO-PASS — module « profil général ».
 *
 * Indicateur communautaire expérimental, sur 300, inspiré de l'échelle
 * Psycho-Pass. Ce N'EST PAS le score interne d'Embark et ce fichier ne
 * contient aucun coefficient officiel : le studio n'en a pas publié.
 *
 * Formule (choix du modèle, pas une rétro-ingénierie) :
 *
 *   signal = moyenne pondérée des réponses d'initiation
 *          mélangée au pic du geste le plus offensif
 *          (un « je tire souvent le premier » ne disparaît pas
 *          dans une moyenne de « jamais »).
 *   Les tirs accidentels, seuls, sont atténués.
 *   L'intensité (durée, downs, répétition) amplifie seulement ce signal,
 *   en écho qualitatif à la note publique d'Embark : un échange long pèse
 *   plus, pour celui qui a commencé.
 *
 *   score = signal × 300
 *         + (1 − signal) × pression × 120
 *
 * La pression subie relève donc l'indice quand le Raider n'initie pas
 * (conseil d'équipement), sans le faire passer pour l'agresseur.
 * La défense (dégâts subis d'abord, fuite, escouade touchée en premier)
 * ne s'ajoute pas au score. Micro, émotes, négociations et valeur du
 * loadout non plus.
 *
 * Le module « dernière partie » reprend la même échelle et les mêmes trois
 * sorties (Psycho-Pass, chances rat / joueur PvP, parties chill), sur la
 * chronologie d'un seul raid. Il ne réécrit pas cette formule.
 */

export type ModuleId = "general" | "last-raid";

export const MODULES: {
  id: ModuleId;
  index: string;
  title: string;
  text: string;
  ready: boolean;
}[] = [
  {
    id: "general",
    index: "01",
    title: "Profil général",
    text: "Plusieurs parties, un seul format. Tendance, chances rat / PvP, nombre de parties chill.",
    ready: true,
  },
  {
    id: "last-raid",
    index: "02",
    title: "Dernière partie",
    text: "Un seul raid, dans l'ordre. Même trois lectures, autres questions : qui tire, qui encaisse, pourquoi tu entres.",
    ready: true,
  },
];

export type Answers = Record<string, string>;

export type Option = {
  id: string;
  label: string;
  detail?: string;
  /** null = réponse exclue du calcul (inconnue ou sans objet). */
  v: number | null;
};

export type Axis = "meta" | "initiation" | "pressure" | "defense" | "narrative" | "intensity" | "gear";

export type Question = {
  id: string;
  sectionId: string;
  prompt: string;
  note?: string;
  options: Option[];
  axis: Axis;
  weight: number;
  /** Entre dans le « pic » d'initiation : un oui franc ne se dilue pas. */
  peak?: boolean;
  factor?: string;
  show: (a: Answers) => boolean;
};

export const SECTIONS: { id: string; index: string; title: string }[] = [
  { id: "context", index: "01", title: "Contexte" },
  { id: "encounters", index: "02", title: "Rencontres" },
  { id: "initiation", index: "03", title: "Initiation" },
  { id: "defense", index: "04", title: "Défense" },
  { id: "comms", index: "05", title: "Contact" },
  { id: "intensity", index: "06", title: "Intensité" },
  { id: "extract", index: "07", title: "Extraction" },
];

const always = () => true;

export function someEncounters(a: Answers): boolean {
  return Boolean(a.encounterRate && a.encounterRate !== "none");
}

export function noEncounters(a: Answers): boolean {
  return a.encounterRate === "none";
}

export function combatPath(a: Answers): boolean {
  if (someEncounters(a)) return true;
  return a.engagedAnyway === "isolated" || a.engagedAnyway === "hunted";
}

function squadFormat(a: Answers): boolean {
  return a.format === "duo" || a.format === "trio";
}

export function joinedVoluntarily(a: Answers): boolean {
  return a.thirdParty === "rare" || a.thirdParty === "sometimes" || a.thirdParty === "often" || a.thirdParty === "yes";
}

function lastMet(a: Answers): boolean {
  return a.met === "one" || a.met === "several";
}

function lastFight(a: Answers): boolean {
  return lastMet(a) || a.firstShot === "yes" || a.thirdParty === "yes";
}

const SCALE_5 = [
  { id: "never", label: "Jamais", v: 0 },
  { id: "once", label: "Une fois", v: 0.2 },
  { id: "sometimes", label: "Parfois", v: 0.48 },
  { id: "often", label: "Souvent", v: 0.78 },
  { id: "always", label: "Presque toujours", v: 1 },
  { id: "unknown", label: "Je ne sais pas", detail: "Exclu du calcul. Baisse la confiance.", v: null },
] as const satisfies readonly Option[];

const FREQ_4 = [
  { id: "never", label: "Jamais", v: 0 },
  { id: "rare", label: "Rarement", v: 0.28 },
  { id: "sometimes", label: "Parfois", v: 0.55 },
  { id: "often", label: "Souvent", v: 1 },
] as const satisfies readonly Option[];

export const QUESTIONS: Question[] = [
  {
    id: "format",
    sectionId: "context",
    prompt: "Dans quel format veux-tu évaluer ce Raider ?",
    note: "Un seul format à la fois. Depuis la mise à jour 1.36.0, Embark indique suivre le style séparément en solo, duo et trio. Ce terminal fait pareil : on ne mélange pas les historiques.",
    axis: "meta",
    weight: 0,
    show: always,
    options: [
      { id: "solo", label: "Solo", detail: "Tu entres seul sur Topside.", v: 0 },
      { id: "duo", label: "Duo", detail: "Deux Raiders, profil de ce format seulement.", v: 0 },
      { id: "trio", label: "Trio", detail: "Escouade de trois, profil séparé du solo.", v: 0 },
    ],
  },
  {
    id: "recentGames",
    sectionId: "context",
    prompt: "Sur combien de parties récentes de ce format t'appuies-tu ?",
    note: "Dix parties nettes ne valent pas deux souvenirs flous. Le nombre change la confiance, pas un malus caché sur le score.",
    axis: "meta",
    weight: 0,
    show: always,
    options: [
      { id: "g1", label: "1 à 2 parties", v: 0.3 },
      { id: "g2", label: "3 à 5 parties", v: 0.5 },
      { id: "g3", label: "6 à 9 parties", v: 0.67 },
      { id: "g4", label: "10 à 15 parties", v: 0.82 },
      { id: "g5", label: "16 à 25 parties", v: 0.92 },
      { id: "g6", label: "26 parties ou plus", v: 0.97 },
    ],
  },
  {
    id: "frequency",
    sectionId: "context",
    prompt: "À quel rythme joues-tu en ce moment ?",
    note: "Contexte seulement. La fréquence ne modifie ni le score ni un soi-disant délai de récupération.",
    axis: "narrative",
    weight: 0,
    show: always,
    options: [
      { id: "rare", label: "Quelques parties par mois", v: 0 },
      { id: "weekly", label: "Une à deux fois par semaine", v: 0 },
      { id: "regular", label: "Plusieurs fois par semaine", v: 0 },
      { id: "daily", label: "Presque tous les jours", v: 0 },
    ],
  },
  {
    id: "sameFormat",
    sectionId: "context",
    prompt: "Ces parties sont-elles bien toutes dans ce format ?",
    axis: "meta",
    weight: 0,
    show: always,
    options: [
      { id: "pure", label: "Oui, uniquement ce format", v: 1 },
      { id: "mostly", label: "En majorité, avec quelques exceptions", v: 0.86 },
      {
        id: "mixed",
        label: "J'ai mélangé solo, duo et trio",
        detail: "La fiabilité baisse. Un format ne se déduit pas d'un autre.",
        v: 0.58,
      },
    ],
  },
  {
    id: "memory",
    sectionId: "context",
    prompt: "Quelle est la netteté de tes souvenirs sur ces parties ?",
    axis: "meta",
    weight: 0,
    show: always,
    options: [
      { id: "vague", label: "Floue, je reconstitue", v: 0.58 },
      { id: "clear", label: "Assez claire", v: 0.84 },
      { id: "precise", label: "Très précise, je pourrais les raconter", v: 1 },
    ],
  },
  {
    id: "encounterRate",
    sectionId: "encounters",
    prompt: "Dans ces parties, à quelle fréquence as-tu croisé d'autres Raiders ?",
    note: "Croiser quelqu'un n'est pas un combat. La suite distinguera le calme, le flou et l'hostile.",
    axis: "narrative",
    weight: 0,
    show: always,
    options: [
      { id: "none", label: "Presque aucune rencontre", v: 0 },
      { id: "rare", label: "Rares", detail: "Environ une partie sur quatre, ou moins.", v: 0.22 },
      { id: "half", label: "Régulières", detail: "Environ une partie sur deux.", v: 0.48 },
      { id: "most", label: "Fréquentes", detail: "La plupart des parties.", v: 0.74 },
      { id: "every", label: "Quasi systématiques", v: 1 },
    ],
  },
  {
    id: "tone",
    sectionId: "encounters",
    prompt: "Comment qualifierais-tu l'ensemble de ces rencontres ?",
    factor: "Tonalité des rencontres",
    axis: "pressure",
    weight: 1.35,
    show: someEncounters,
    options: [
      { id: "peaceful", label: "Surtout pacifiques", v: 0.04 },
      { id: "mixed", label: "Mélange calme et tendu", v: 0.32 },
      { id: "ambiguous", label: "Souvent ambiguës", detail: "Visée, filature, sans tir clair.", v: 0.5 },
      { id: "threatening", label: "Souvent menaçantes", v: 0.76 },
      { id: "hostile", label: "Surtout hostiles", v: 1 },
    ],
  },
  {
    id: "shotsReceived",
    sectionId: "encounters",
    prompt: "À quelle fréquence as-tu reçu des tirs ?",
    factor: "Tirs reçus",
    axis: "pressure",
    weight: 1.2,
    show: someEncounters,
    options: [
      { id: "never", label: "Jamais", v: 0 },
      { id: "rare", label: "Rarement", v: 0.22 },
      { id: "sometimes", label: "Parfois", v: 0.48 },
      { id: "often", label: "Souvent", v: 0.76 },
      { id: "always", label: "Presque à chaque rencontre", v: 1 },
    ],
  },
  {
    id: "ambush",
    sectionId: "encounters",
    prompt: "Des embuscades ou des attaques au moment de l'extraction ?",
    factor: "Embuscades à l'extraction",
    axis: "pressure",
    weight: 1.05,
    show: someEncounters,
    options: [
      { id: "never", label: "Jamais", v: 0 },
      { id: "once", label: "Une ou deux fois", v: 0.3 },
      { id: "several", label: "Plusieurs fois", v: 0.66 },
      { id: "frequent", label: "Fréquentes", v: 1 },
    ],
  },
  {
    id: "traps",
    sectionId: "encounters",
    prompt: "Des pièges ou des explosifs d'autres joueurs ont-ils été utilisés contre toi ?",
    factor: "Pièges et explosifs subis",
    axis: "pressure",
    weight: 0.75,
    show: someEncounters,
    options: [
      { id: "never", label: "Jamais", v: 0 },
      { id: "rare", label: "Rarement", v: 0.28 },
      { id: "several", label: "Plusieurs fois", v: 0.62 },
      { id: "frequent", label: "Fréquemment", v: 1 },
    ],
  },
  {
    id: "contactShape",
    sectionId: "encounters",
    prompt: "Ces contacts hostiles ressemblaient à quoi ?",
    note: "Rat, au sens des joueurs : planque, ascenseur, tir dans le dos, faux amical, attente que tu finisses un ARC. Joueur PvP : il cherche le fight. Ce n'est pas une catégorie Embark, et les deux peuvent coexister. Ça ne change pas le Psycho-Pass.",
    axis: "narrative",
    weight: 0,
    show: someEncounters,
    options: [
      { id: "rats", label: "Surtout des rats", detail: "Planque, ascenseur, dos, faux amical.", v: 0 },
      { id: "pvp", label: "Surtout des joueurs PvP", detail: "Ils poussent et cherchent le duel.", v: 0 },
      { id: "both", label: "Les deux, souvent", v: 0 },
      { id: "open", label: "Surtout des contacts sans ce genre de piège", v: 0 },
      { id: "unknown", label: "Je ne saurais pas les distinguer", v: 0 },
    ],
  },
  {
    id: "trend",
    sectionId: "encounters",
    prompt: "Ces dernières parties, la tendance des lobbys te semble…",
    factor: "Tendance récente",
    axis: "pressure",
    weight: 0.9,
    show: someEncounters,
    options: [
      { id: "calmer", label: "Plus calme qu'avant", v: 0.05 },
      { id: "stable", label: "Stable", v: 0.38 },
      { id: "hotter", label: "Plus agressive", v: 0.92 },
      { id: "unknown", label: "Trop peu de parties pour le dire", v: null },
    ],
  },
  {
    id: "engagedAnyway",
    sectionId: "initiation",
    prompt: "Même sans rencontre notable, as-tu engagé un Raider ?",
    factor: "Engagement malgré peu de rencontres",
    axis: "initiation",
    weight: 1.15,
    peak: true,
    show: noEncounters,
    options: [
      { id: "no", label: "Non, aucun engagement", v: 0 },
      { id: "isolated", label: "Un tir isolé, peut-être accidentel", v: 0.28 },
      { id: "hunted", label: "Oui, j'ai cherché le contact", v: 0.92 },
    ],
  },
  {
    id: "firstShot",
    sectionId: "initiation",
    prompt: "À quelle fréquence as-tu tiré le premier ?",
    note: "Le premier tir n'est pas le premier dégât. Un coup dans le vide, une sommation et le premier point de vie retiré sont trois événements distincts.",
    factor: "Premier tir",
    axis: "initiation",
    weight: 1.25,
    peak: true,
    show: combatPath,
    options: [...SCALE_5],
  },
  {
    id: "firstDamage",
    sectionId: "initiation",
    prompt: "À quelle fréquence as-tu infligé le premier dégât réel ?",
    note: "Points de vie effectivement retirés. Ce n'est pas « j'ai tiré le premier ».",
    factor: "Premier dégât infligé",
    axis: "initiation",
    weight: 1.1,
    peak: true,
    show: combatPath,
    options: [
      { id: "never", label: "Jamais", v: 0 },
      { id: "once", label: "Une fois", v: 0.2 },
      { id: "sometimes", label: "Parfois", v: 0.48 },
      { id: "often", label: "Souvent", v: 0.78 },
      { id: "always", label: "Presque toujours", v: 1 },
      { id: "unknown", label: "Chronologie inconnue", v: null },
    ],
  },
  {
    id: "thirdParty",
    sectionId: "initiation",
    prompt: "As-tu rejoint volontairement un combat déjà en cours ?",
    note: "Lors du test public 1.39.0, Embark a indiqué que s'insérer dans un combat déjà commencé compte comme le démarrer. La question suivante demande pourquoi : seul le kill ou le loot garde ici tout le poids. Ce n'est pas leur formule.",
    factor: "Third-party volontaire",
    axis: "initiation",
    weight: 1,
    peak: true,
    show: combatPath,
    options: [
      { id: "never", label: "Jamais", v: 0 },
      { id: "rare", label: "Rarement", v: 0.28 },
      { id: "sometimes", label: "Parfois", v: 0.55 },
      { id: "often", label: "Souvent", v: 1 },
      { id: "unknown", label: "Je ne suis pas sûr", v: null },
    ],
  },
  {
    id: "thirdMotive",
    sectionId: "initiation",
    prompt: "Quand tu entrais dans ce combat déjà commencé, c'était surtout pour…",
    note: "Défendre un inconnu que tu as vu se faire abattre, ou revenir sur un des tiens déjà à terre, n'est pas une chasse. Le terminal atténue alors le third-party. Embark n'a pas publié d'exception pour le motif : leur test comptait l'insertion elle-même.",
    axis: "narrative",
    weight: 0,
    show: joinedVoluntarily,
    options: [
      {
        id: "spill",
        label: "Le combat est arrivé sur moi",
        detail: "Je ne l'ai pas traversé la zone pour le chercher.",
        v: 0,
      },
      {
        id: "coverStranger",
        label: "J'ai vu un inconnu se faire tuer",
        detail: "Abattu, fini au sol, ou exécuté. J'ai tiré sur l'agresseur.",
        v: 0,
      },
      {
        id: "coverMate",
        label: "Un des miens était déjà à terre",
        detail: "Je suis revenu dessus, pas pour looter le duel.",
        v: 0,
      },
      {
        id: "hunt",
        label: "Le kill ou le loot",
        detail: "J'ai fini le combat parce que je le voulais.",
        v: 0,
      },
    ],
  },
  {
    id: "chase",
    sectionId: "initiation",
    prompt: "As-tu poursuivi un adversaire après qu'il a tenté de fuir ?",
    factor: "Poursuite d'un fuyard",
    axis: "initiation",
    weight: 0.9,
    peak: true,
    show: combatPath,
    options: [...FREQ_4],
  },
  {
    id: "noProof",
    sectionId: "initiation",
    prompt: "As-tu tiré sur un Raider sans indice clair qu'il t'avait déjà attaqué ?",
    factor: "Tir sans attaque préalable claire",
    axis: "initiation",
    weight: 1.15,
    peak: true,
    show: combatPath,
    options: [
      { id: "never", label: "Jamais", v: 0 },
      { id: "rare", label: "Rarement", v: 0.28 },
      { id: "sometimes", label: "Parfois", v: 0.55 },
      { id: "often", label: "Souvent", v: 1 },
      { id: "unknown", label: "Situation trop floue pour répondre", v: null },
    ],
  },
  {
    id: "accidental",
    sectionId: "initiation",
    prompt: "Des tirs accidentels ou des situations vraiment ambiguës ?",
    note: "Ricochet, tir de panique, ARC confondu avec un Raider. Dans la note 1.39.0, un coup accidentel compte encore comme un début de combat, mais pèse beaucoup moins. Ici le poids est volontairement faible, et ce n'est pas leur formule.",
    factor: "Tirs accidentels ou ambigus",
    axis: "initiation",
    weight: 0.3,
    show: combatPath,
    options: [
      { id: "none", label: "Aucun", v: 0 },
      { id: "one", label: "Un cas isolé", v: 0.15 },
      { id: "several", label: "Plusieurs cas", v: 0.32 },
      { id: "frequent", label: "C'était fréquent", v: 0.45 },
      { id: "unknown", label: "Je ne peux pas les distinguer", v: null },
    ],
  },
  {
    id: "hitFirst",
    sectionId: "defense",
    prompt: "Avant de riposter, avais-tu déjà subi des dégâts ?",
    note: "La riposte n'est pas additionnée à l'initiation. Elle décrit ta posture et peut ouvrir le verdict défensif.",
    factor: "Dégâts subis avant la riposte",
    axis: "defense",
    weight: 1.2,
    show: combatPath,
    options: [
      { id: "always", label: "Presque toujours, j'étais touché d'abord", v: 1 },
      { id: "often", label: "Souvent", v: 0.75 },
      { id: "sometimes", label: "Parfois", v: 0.45 },
      { id: "rarely", label: "Rarement : j'engageais avant d'être touché", v: 0.12 },
      { id: "nofight", label: "Pas de vrai échange de tirs", v: null },
      { id: "unknown", label: "Chronologie inconnue", v: null },
    ],
  },
  {
    id: "surviveOnly",
    sectionId: "defense",
    prompt: "Quand tu as riposté, c'était pour survivre ?",
    axis: "defense",
    weight: 1,
    show: combatPath,
    options: [
      { id: "always", label: "Oui, presque uniquement pour m'en sortir", v: 1 },
      { id: "mostly", label: "Surtout oui", v: 0.72 },
      { id: "pressed", label: "Parfois j'ai poussé l'avantage", v: 0.28 },
      { id: "hunted", label: "Non, je cherchais le combat", v: 0 },
    ],
  },
  {
    id: "broke",
    sectionId: "defense",
    prompt: "As-tu fui ou rompu le contact quand c'était possible ?",
    axis: "defense",
    weight: 0.9,
    show: combatPath,
    options: [
      { id: "often", label: "Souvent", v: 1 },
      { id: "sometimes", label: "Parfois", v: 0.62 },
      { id: "rarely", label: "Rarement", v: 0.22 },
      { id: "never", label: "Je n'ai pas cherché à rompre", v: 0 },
      { id: "nofight", label: "Pas de combat où fuir avait un sens", v: null },
    ],
  },
  {
    id: "pursuedAfter",
    sectionId: "defense",
    prompt: "Après avoir neutralisé la menace, as-tu poursuivi ?",
    note: "Neutraliser puis courir après n'est plus de la défense. Cette réponse alimente l'initiation, pas la posture défensive.",
    factor: "Poursuite après neutralisation",
    axis: "initiation",
    weight: 0.85,
    peak: true,
    show: combatPath,
    options: [
      { id: "never", label: "Jamais", v: 0 },
      { id: "once", label: "Une fois", v: 0.32 },
      { id: "sometimes", label: "Parfois", v: 0.62 },
      { id: "often", label: "Souvent", v: 1 },
      { id: "noneutral", label: "Pas de menace neutralisée", v: null },
    ],
  },
  {
    id: "overstay",
    sectionId: "defense",
    prompt: "As-tu continué le combat alors que tu pouvais partir ?",
    factor: "Combat prolongé alors que la fuite était possible",
    axis: "initiation",
    weight: 0.75,
    peak: true,
    show: combatPath,
    options: [
      { id: "never", label: "Non", v: 0 },
      { id: "sometimes", label: "Parfois", v: 0.55 },
      { id: "often", label: "Souvent", v: 1 },
      { id: "blocked", label: "Je ne pouvais pas vraiment partir", v: null },
    ],
  },
  {
    id: "squadFirst",
    sectionId: "defense",
    prompt: "Ton escouade a-t-elle été touchée en premier ?",
    note: "Lors du test 1.39.0, Embark lisait toute l'escouade comme défensive si l'autre infligeait le premier dégât, down ou KO à n'importe quel membre. Ici ça nourrit le portrait défensif, pas un malus d'initiation.",
    axis: "defense",
    weight: 1.1,
    show: (a) => combatPath(a) && squadFormat(a),
    options: [
      { id: "us", label: "Oui, souvent l'un des nôtres a été touché d'abord", v: 1 },
      { id: "mixed", label: "Mitigé", v: 0.4 },
      { id: "we", label: "C'est plutôt nous qui avons engagé", v: 0.05 },
      { id: "unknown", label: "Je ne sais pas", v: null },
    ],
  },
  {
    id: "mic",
    sectionId: "comms",
    prompt: "Tu utilises le micro avec les inconnus ?",
    note: "Portrait de style. Aucun bonus de matchmaking lié au micro n'est public, et ce terminal n'en invente pas.",
    axis: "narrative",
    weight: 0,
    show: always,
    options: [
      { id: "off", label: "Non, micro coupé", v: 0 },
      { id: "sometimes", label: "Parfois", v: 0 },
      { id: "often", label: "Souvent", v: 0 },
    ],
  },
  {
    id: "greet",
    sectionId: "comms",
    prompt: "Salutations et tentatives de négociation ?",
    axis: "narrative",
    weight: 0,
    show: always,
    options: [
      { id: "often", label: "Souvent", v: 0 },
      { id: "sometimes", label: "Parfois", v: 0 },
      { id: "rarely", label: "Rarement", v: 0 },
      { id: "never", label: "Jamais", v: 0 },
    ],
  },
  {
    id: "emote",
    sectionId: "comms",
    prompt: "La roue d'émotes, tu t'en sers face aux autres Raiders ?",
    axis: "narrative",
    weight: 0,
    show: always,
    options: [
      { id: "often", label: "Souvent", v: 0 },
      { id: "sometimes", label: "Parfois", v: 0 },
      { id: "rarely", label: "Rarement", v: 0 },
      { id: "never", label: "Jamais", v: 0 },
    ],
  },
  {
    id: "deesc",
    sectionId: "comms",
    prompt: "Tu as tenté de désescalader ?",
    axis: "narrative",
    weight: 0,
    show: always,
    options: [
      { id: "often", label: "Souvent", v: 0 },
      { id: "sometimes", label: "Parfois", v: 0 },
      { id: "rarely", label: "Rarement", v: 0 },
      { id: "never", label: "Jamais", v: 0 },
    ],
  },
  {
    id: "shareExtract",
    sectionId: "comms",
    prompt: "Partage ou tolérance à l'extraction avec des inconnus ?",
    note: "Décrire un style n'est pas affirmer qu'Embark récompense l'extraction pacifique. Rien de public ne le dit.",
    axis: "narrative",
    weight: 0,
    show: someEncounters,
    options: [
      { id: "often", label: "Souvent tolérée ou partagée", v: 0 },
      { id: "sometimes", label: "Parfois", v: 0 },
      { id: "rarely", label: "Rarement", v: 0 },
      { id: "never", label: "Jamais", v: 0 },
      { id: "none", label: "L'occasion ne s'est pas présentée", v: 0 },
    ],
  },
  {
    id: "reactPeace",
    sectionId: "comms",
    prompt: "Face à un Raider qui a l'air pacifique, tu fais quoi ?",
    factor: "Réaction aux Raiders pacifiques",
    axis: "initiation",
    weight: 0.95,
    peak: true,
    show: someEncounters,
    options: [
      { id: "leave", label: "Je le laisse", v: 0 },
      { id: "greet", label: "Je salue et je passe", v: 0.05 },
      { id: "watch", label: "Je le garde en joue, prêt", v: 0.28 },
      { id: "shoot", label: "Je tire quand même", v: 1 },
    ],
  },
  {
    id: "reactAim",
    sectionId: "comms",
    prompt: "Quelqu'un te vise sans tirer. Ta réaction ?",
    factor: "Réaction à une visée sans tir",
    axis: "initiation",
    weight: 0.9,
    peak: true,
    show: someEncounters,
    options: [
      { id: "hold", label: "Je ne tire pas", v: 0 },
      { id: "move", label: "Je me repositionne ou je pars", v: 0.12 },
      { id: "warn", label: "Je préviens, sans tirer le premier", v: 0.18 },
      { id: "shoot", label: "Je tire le premier", v: 0.9 },
    ],
  },
  {
    id: "duration",
    sectionId: "intensity",
    prompt: "Quand il y a eu combat, il a plutôt duré…",
    note: "L'intensité augmente le poids des combats que tu inities. Elle ne transforme pas une riposte en agression.",
    axis: "intensity",
    weight: 1.1,
    show: combatPath,
    options: [
      { id: "none", label: "Pas de vrai combat", v: 0 },
      { id: "short", label: "Très court, un échange bref", v: 0.2 },
      { id: "mid", label: "Quelques secondes appuyées", v: 0.55 },
      { id: "long", label: "Un affrontement prolongé", v: 1 },
    ],
  },
  {
    id: "involved",
    sectionId: "intensity",
    prompt: "Combien de joueurs se retrouvaient en général dans l'échange ?",
    axis: "intensity",
    weight: 0.7,
    show: combatPath,
    options: [
      { id: "none", label: "Personne, pas d'échange", v: 0 },
      { id: "one", label: "Un face-à-face", v: 0.35 },
      { id: "several", label: "Plusieurs Raiders", v: 0.7 },
      { id: "chaos", label: "Escouades, troisième force, confusion", v: 1 },
    ],
  },
  {
    id: "damageAmt",
    sectionId: "intensity",
    prompt: "La quantité de dégâts échangés, si tu la connais ?",
    axis: "intensity",
    weight: 0.8,
    show: combatPath,
    options: [
      { id: "unknown", label: "Je ne sais pas", v: null },
      { id: "light", label: "Légère", v: 0.25 },
      { id: "mid", label: "Modérée", v: 0.6 },
      { id: "heavy", label: "Lourde", v: 1 },
    ],
  },
  {
    id: "downs",
    sectionId: "intensity",
    prompt: "Des mises à terre pendant ces affrontements ?",
    axis: "intensity",
    weight: 1,
    show: combatPath,
    options: [
      { id: "none", label: "Aucune", v: 0 },
      { id: "rare", label: "Rares", v: 0.32 },
      { id: "several", label: "Plusieurs", v: 0.68 },
      { id: "many", label: "Nombreuses", v: 1 },
    ],
  },
  {
    id: "pursuitCount",
    sectionId: "intensity",
    prompt: "Des courses-poursuites, au-delà du simple échange de tirs ?",
    axis: "intensity",
    weight: 0.75,
    show: combatPath,
    options: [
      { id: "none", label: "Aucune", v: 0 },
      { id: "rare", label: "Rares", v: 0.4 },
      { id: "several", label: "Plusieurs", v: 1 },
    ],
  },
  {
    id: "repeats",
    sectionId: "intensity",
    prompt: "Le même raid recommençait-il le combat plus d'une fois ?",
    axis: "intensity",
    weight: 1,
    show: combatPath,
    options: [
      { id: "never", label: "Non", v: 0 },
      { id: "sometimes", label: "Parfois", v: 0.5 },
      { id: "often", label: "Souvent", v: 1 },
    ],
  },
  {
    id: "extractResult",
    sectionId: "extract",
    prompt: "Tes extractions, sur cet échantillon ?",
    note: "Réussir ou rater l'extraction ne monte pas le Psycho-Pass : un échec peut venir des ARC. Seule la contestation par d'autres Raiders compte comme pression.",
    axis: "narrative",
    weight: 0,
    show: always,
    options: [
      { id: "calm", label: "Surtout réussies et calmes", v: 0 },
      { id: "contested", label: "Surtout réussies, mais contestées", v: 0 },
      { id: "mixed", label: "Mitigé", v: 0 },
      { id: "failed", label: "Souvent ratées", v: 0 },
    ],
  },
  {
    id: "extractContest",
    sectionId: "extract",
    prompt: "L'extraction elle-même était-elle contestée par d'autres Raiders ?",
    factor: "Extraction contestée",
    axis: "pressure",
    weight: 0.8,
    show: always,
    options: [
      { id: "rare", label: "Rarement ou jamais", v: 0.08 },
      { id: "sometimes", label: "Parfois", v: 0.48 },
      { id: "often", label: "Souvent", v: 0.9 },
    ],
  },
  {
    id: "elevator",
    sectionId: "extract",
    prompt: "Des rencontres hostiles près de l'ascenseur ?",
    factor: "Hostilité près de l'ascenseur",
    axis: "pressure",
    weight: 1,
    show: always,
    options: [
      { id: "never", label: "Jamais", v: 0 },
      { id: "rare", label: "Rares", v: 0.28 },
      { id: "several", label: "Plusieurs", v: 0.66 },
      { id: "frequent", label: "Fréquentes", v: 1 },
    ],
  },
  {
    id: "kit",
    sectionId: "extract",
    prompt: "Quel équipement envisages-tu pour le prochain raid dans ce format ?",
    note: "N'entre pas dans le score. Embark a écrit que le loadout ne pilote pas le matchmaking. Ça ne sert qu'à personnaliser le conseil.",
    axis: "gear",
    weight: 0,
    show: always,
    options: [
      { id: "cheap", label: "Léger, remplaçable", v: 0 },
      { id: "standard", label: "Standard, celui d'habitude", v: 0 },
      { id: "expensive", label: "Coûteux", v: 0 },
      { id: "rare", label: "Avec des objets rares que je veux préserver", v: 0 },
    ],
  },
  {
    id: "tolerance",
    sectionId: "extract",
    prompt: "Si tu perds cet équipement, qu'est-ce que ça représente ?",
    axis: "gear",
    weight: 0,
    show: always,
    options: [
      { id: "fine", label: "Je peux le reperdre", v: 0 },
      { id: "annoying", label: "Agacant, mais remplaçable", v: 0 },
      { id: "painful", label: "Douloureux", v: 0 },
      { id: "refuse", label: "Je refuse de risquer ces objets", v: 0 },
    ],
  },
];

export const LAST_SECTIONS: { id: string; index: string; title: string }[] = [
  { id: "context", index: "01", title: "Ce raid" },
  { id: "chrono", index: "02", title: "Chronologie" },
  { id: "role", index: "03", title: "Ton rôle" },
  { id: "extract", index: "04", title: "Sortie" },
];

const LAST_SCALE_SHOT = [
  { id: "never", label: "Non", v: 0 },
  { id: "yes", label: "Oui", v: 1 },
  { id: "unknown", label: "Je ne sais plus l'ordre", v: null },
] as const satisfies readonly Option[];

export const LAST_QUESTIONS: Question[] = [
  {
    id: "format",
    sectionId: "context",
    prompt: "Ce raid, tu l'as fait en quel format ?",
    note: "Solo, duo et trio ne partagent pas le même historique. Une partie se lit dans le sien.",
    axis: "meta",
    weight: 0,
    show: always,
    options: [
      { id: "solo", label: "Solo", v: 0 },
      { id: "duo", label: "Duo", v: 0 },
      { id: "trio", label: "Trio", v: 0 },
    ],
  },
  {
    id: "memory",
    sectionId: "context",
    prompt: "Tu te souviens de l'ordre des coups ?",
    axis: "meta",
    weight: 0,
    show: always,
    options: [
      { id: "vague", label: "Flou, je reconstitue", v: 0.58 },
      { id: "clear", label: "Assez clairement", v: 0.84 },
      { id: "precise", label: "Oui, je peux le raconter dans l'ordre", v: 1 },
    ],
  },
  {
    id: "met",
    sectionId: "context",
    prompt: "As-tu croisé d'autres Raiders ?",
    axis: "narrative",
    weight: 0,
    show: always,
    options: [
      { id: "none", label: "Non", v: 0.08 },
      { id: "one", label: "Un contact", v: 0.55 },
      { id: "several", label: "Plusieurs contacts", v: 0.82 },
    ],
  },
  {
    id: "contactShape",
    sectionId: "chrono",
    prompt: "Ce contact, c'était plutôt…",
    note: "Rat : planque, ascenseur, dos, faux amical. Joueur PvP : il cherche le fight. Ça ne change pas le Psycho-Pass de ce raid.",
    axis: "narrative",
    weight: 0,
    show: lastMet,
    options: [
      { id: "rats", label: "Un rat", detail: "Il attendait, ou il a tiré dans le dos.", v: 0 },
      { id: "pvp", label: "Un joueur PvP", detail: "Il a poussé le combat.", v: 0 },
      { id: "both", label: "Les deux, sur ce même raid", v: 0 },
      { id: "open", label: "Un contact sans piège clair", v: 0 },
      { id: "unknown", label: "Je ne saurais pas le dire", v: 0 },
    ],
  },
  {
    id: "firstShot",
    sectionId: "chrono",
    prompt: "As-tu tiré le premier ?",
    note: "Premier tir, pas premier dégât. Sur un seul raid, c'est oui ou non.",
    factor: "Premier tir sur ce raid",
    axis: "initiation",
    weight: 1.25,
    peak: true,
    show: lastFight,
    options: [...LAST_SCALE_SHOT],
  },
  {
    id: "firstDamage",
    sectionId: "chrono",
    prompt: "As-tu infligé le premier dégât réel ?",
    factor: "Premier dégât sur ce raid",
    axis: "initiation",
    weight: 1.15,
    peak: true,
    show: lastFight,
    options: [...LAST_SCALE_SHOT],
  },
  {
    id: "hitFirst",
    sectionId: "chrono",
    prompt: "Avant de riposter, est-ce que tu avais déjà pris des dégâts ?",
    factor: "Dégâts subis avant la riposte",
    axis: "defense",
    weight: 1.2,
    show: lastFight,
    options: [
      { id: "always", label: "Oui, j'étais touché d'abord", v: 1 },
      { id: "rarely", label: "Non, j'ai engagé avant d'être touché", v: 0.12 },
      { id: "nofight", label: "Pas d'échange de tirs", v: null },
      { id: "unknown", label: "Chronologie inconnue", v: null },
    ],
  },
  {
    id: "shotsReceived",
    sectionId: "chrono",
    prompt: "Tu as reçu des tirs ?",
    factor: "Tirs reçus sur ce raid",
    axis: "pressure",
    weight: 1.15,
    show: lastMet,
    options: [
      { id: "never", label: "Non", v: 0 },
      { id: "sometimes", label: "Quelques balles", v: 0.48 },
      { id: "often", label: "Oui, nettement", v: 0.84 },
    ],
  },
  {
    id: "hostileForm",
    sectionId: "chrono",
    prompt: "La hostilité, elle est arrivée comment ?",
    factor: "Forme de la hostilité",
    axis: "pressure",
    weight: 1.05,
    show: lastMet,
    options: [
      { id: "none", label: "Pas de hostilité joueur", v: 0 },
      { id: "push", label: "Une poussée ouverte", detail: "Il est venu chercher le fight.", v: 0.66 },
      { id: "rat", label: "Planque, dos ou ascenseur", detail: "Le coup est parti d'une attente.", v: 0.74 },
      { id: "both", label: "Les deux", v: 0.9 },
    ],
  },
  {
    id: "thirdParty",
    sectionId: "role",
    prompt: "Tu es entré dans un combat déjà commencé ?",
    note: "Le test 1.39 comptait cette insertion comme un démarrage. Ici, la question d'après sépare le sauvetage du loot.",
    factor: "Third-party sur ce raid",
    axis: "initiation",
    weight: 1.1,
    peak: true,
    show: lastFight,
    options: [
      { id: "no", label: "Non", v: 0 },
      { id: "yes", label: "Oui", v: 1 },
    ],
  },
  {
    id: "thirdMotive",
    sectionId: "role",
    prompt: "Pourquoi tu es entré dans ce combat ?",
    note: "Voir quelqu'un se faire tuer et tirer sur l'agresseur n'est pas compté comme une chasse. Rien de public ne dit qu'Embark fait cette distinction.",
    axis: "narrative",
    weight: 0,
    show: (a) => lastFight(a) && a.thirdParty === "yes",
    options: [
      { id: "spill", label: "Le combat est arrivé sur moi", v: 0 },
      { id: "coverStranger", label: "J'ai vu un inconnu se faire tuer", detail: "J'ai tiré sur celui qui le finissait.", v: 0 },
      { id: "coverMate", label: "Un des miens était déjà à terre", v: 0 },
      { id: "hunt", label: "Pour le kill ou le loot", v: 0 },
    ],
  },
  {
    id: "chase",
    sectionId: "role",
    prompt: "Tu as poursuivi quelqu'un qui partait ?",
    factor: "Poursuite sur ce raid",
    axis: "initiation",
    weight: 0.9,
    peak: true,
    show: lastFight,
    options: [
      { id: "never", label: "Non", v: 0 },
      { id: "often", label: "Oui", v: 1 },
    ],
  },
  {
    id: "surviveOnly",
    sectionId: "role",
    prompt: "Si tu as tiré, c'était pour t'en sortir ?",
    axis: "defense",
    weight: 1,
    show: lastFight,
    options: [
      { id: "always", label: "Oui, pour sortir de là", v: 1 },
      { id: "pressed", label: "J'ai poussé ensuite", v: 0.28 },
      { id: "hunted", label: "Non, je voulais le combat", v: 0 },
      { id: "nofight", label: "Je n'ai pas tiré", v: null },
    ],
  },
  {
    id: "broke",
    sectionId: "role",
    prompt: "Tu as rompu le contact quand tu pouvais ?",
    axis: "defense",
    weight: 0.85,
    show: lastFight,
    options: [
      { id: "often", label: "Oui", v: 1 },
      { id: "never", label: "Non", v: 0 },
      { id: "nofight", label: "Pas de combat à rompre", v: null },
    ],
  },
  {
    id: "extractContest",
    sectionId: "extract",
    prompt: "La sortie a été contestée par un autre Raider ?",
    factor: "Sortie contestée",
    axis: "pressure",
    weight: 0.9,
    show: lastMet,
    options: [
      { id: "rare", label: "Non", v: 0.08 },
      { id: "sometimes", label: "Un peu, sans vrai siège", v: 0.45 },
      { id: "often", label: "Oui", v: 0.9 },
    ],
  },
  {
    id: "kit",
    sectionId: "extract",
    prompt: "Pour le prochain raid de ce format, tu sors avec quoi ?",
    note: "Hors score. Le loadout ne pilote pas le matchmaking.",
    axis: "gear",
    weight: 0,
    show: always,
    options: [
      { id: "cheap", label: "Léger, remplaçable", v: 0 },
      { id: "standard", label: "Standard", v: 0 },
      { id: "expensive", label: "Coûteux", v: 0 },
      { id: "rare", label: "Objets rares à préserver", v: 0 },
    ],
  },
  {
    id: "tolerance",
    sectionId: "extract",
    prompt: "Si tu perds cet équipement ?",
    axis: "gear",
    weight: 0,
    show: always,
    options: [
      { id: "fine", label: "Je peux le reperdre", v: 0 },
      { id: "annoying", label: "Agacant, mais remplaçable", v: 0 },
      { id: "painful", label: "Douloureux", v: 0 },
      { id: "refuse", label: "Je refuse de risquer ça", v: 0 },
    ],
  },
];

export function sectionsFor(module: ModuleId = "general") {
  return module === "last-raid" ? LAST_SECTIONS : SECTIONS;
}

export function questionBank(module: ModuleId = "general"): Question[] {
  return module === "last-raid" ? LAST_QUESTIONS : QUESTIONS;
}

export const FORMULA = {
  INIT_SCALE: 300,
  PRESSURE_LIFT: 120,
  INTENSITY_AMP: 0.28,
  PEAK_BLEND: 0.42,
  SOFT_ONLY_DAMP: 0.5,
} as const;

const SAMPLE: Record<string, number> = {
  g1: 0.3,
  g2: 0.5,
  g3: 0.67,
  g4: 0.82,
  g5: 0.92,
  g6: 0.97,
};

const NOT_SCORED = [
  "Micro, émotes, salutations, négociations et extraction partagée : portrait, pas un bonus.",
  "Valeur de l'équipement et peur de le perdre : conseil de sortie seulement. Le loadout ne pilote pas le matchmaking, dixit Embark.",
  "Réussite ou échec brut de l'extraction : hors calcul, un wipe peut venir des ARC.",
  "Riposte après dégâts subis, fuite, escouade touchée en premier : posture défensive, pas une initiation.",
  "Le motif du third-party (sauver un inconnu, revenir sur un mate) atténue l'initiation dans ce terminal. Ce n'est pas une exemption publiée par Embark.",
  "Les chances rat / joueur PvP et le nombre de parties chill ne sont pas des sorties du matchmaking.",
];

export type Factor = { label: string; points: number };

export type Reading = {
  score: number;
  category: { id: string; name: string; blurb: string };
  provisional: boolean;
  unlocked: boolean;
  initiation: number;
  pressure: number;
  defense: number | null;
  agg: number;
  heat: number;
  confidence: number;
  confidenceLabel: string;
  spread: number;
  low: number;
  high: number;
  defenderVerdict: boolean;
  defenderUncertain: boolean;
  formatLabel: string;
  gamesLabel: string;
  trendId: string | null;
  synthesis: string;
  gear: string;
  protocol: string;
  factors: Factor[];
  uncertainties: string[];
  ignored: string[];
  complete: boolean;
  module: ModuleId;
  ratChance: number;
  pvpChance: number;
  chillGames: number;
  chanceNote: string;
  chillNote: string;
  intervention: string | null;
};

type Item = { id: string; label: string; w: number; v: number; hard: boolean };

function questionById(id: string, module: ModuleId = "general"): Question | undefined {
  return questionBank(module).find((q) => q.id === id);
}

export function chosenOption(id: string, answers: Answers, module: ModuleId = "general"): Option | undefined {
  const q = questionById(id, module);
  const picked = answers[id];
  if (!q || !picked) return undefined;
  return q.options.find((o) => o.id === picked);
}

export function visibleQuestions(answers: Answers, module: ModuleId = "general"): Question[] {
  return questionBank(module).filter((q) => q.show(answers));
}

function shown(id: string, answers: Answers, module: ModuleId, visible: Question[]): boolean {
  return visible.some((q) => q.id === id) && Boolean(answers[id]);
}

function weightedMean(items: { w: number; v: number }[]): number | null {
  let w = 0;
  let s = 0;
  for (const it of items) {
    w += it.w;
    s += it.w * it.v;
  }
  if (w <= 0) return null;
  return s / w;
}

function itemsFor(axis: Axis, answers: Answers, module: ModuleId): Item[] {
  const out: Item[] = [];
  for (const q of questionBank(module)) {
    if (q.axis !== axis || !q.show(answers) || q.weight <= 0) continue;
    const opt = chosenOption(q.id, answers, module);
    if (!opt || opt.v == null) continue;
    out.push({
      id: q.id,
      label: q.factor ?? q.prompt,
      w: q.weight,
      v: opt.v,
      hard: Boolean(q.peak),
    });
  }
  return out;
}

function tuneInitiation(items: Item[], answers: Answers, module: ModuleId, visible: Question[]): Item[] {
  if (!shown("thirdMotive", answers, module, visible)) return items;
  const motive = answers.thirdMotive;
  if (!motive || motive === "hunt") return items;
  const damp = motive === "spill" ? 0.12 : motive === "coverMate" ? 0.2 : motive === "coverStranger" ? 0.28 : 1;
  if (damp === 1) return items;
  return items.map((it) =>
    it.id === "thirdParty"
      ? { ...it, v: it.v * damp, hard: false, label: "Third-party atténué par le motif" }
      : it,
  );
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function categoryFor(score: number): { id: string; name: string; blurb: string } {
  if (score >= 300) {
    return {
      id: "pvp",
      name: "Raider PvP",
      blurb: "Sommet symbolique de l'échelle : un profil extrêmement orienté PvP d'après tes réponses. Pas un classement officiel.",
    };
  }
  if (score >= 230) {
    return {
      id: "very",
      name: "Raider en lobbys très PvP",
      blurb: "L'échantillon décrit une forte orientation combat, ou une pression qui ne laisse plus beaucoup de calme.",
    };
  }
  if (score >= 180) {
    return {
      id: "near",
      name: "Raider proche des lobbys PvP",
      blurb: "Le combat joueur pèse lourd dans ce que tu décris. La similitude de style rend ce genre de lobby plus probable, sans le garantir.",
    };
  }
  if (score >= 130) {
    return {
      id: "watch",
      name: "Raider en vigilance",
      blurb: "Zone mixte. Assez de friction pour sortir prudent, pas assez pour coller une étiquette unique.",
    };
  }
  if (score >= 80) {
    return {
      id: "defend",
      name: "Raider qui se défend",
      blurb: "L'indice monte surtout parce que les rencontres chauffent, ou parce qu'un geste offensif ponctuel existe déjà.",
    };
  }
  if (score >= 35) {
    return {
      id: "coop",
      name: "Raider coopératif",
      blurb: "Tu décris un style plutôt ouvert, avec assez de contact pour ne pas parler d'une carte vide.",
    };
  }
  return {
    id: "clear",
    name: "Raider sans problèmes",
    blurb: "Peu d'initiation, peu de pression rapportée. Ça ne promet pas un lobby sans danger.",
  };
}

function formatLabel(answers: Answers): string {
  if (answers.format === "duo") return "Duo";
  if (answers.format === "trio") return "Trio";
  if (answers.format === "solo") return "Solo";
  return "Format non précisé";
}

function gamesLabel(answers: Answers, module: ModuleId): string {
  if (module === "last-raid") return "une seule partie";
  return chosenOption("recentGames", answers, module)?.label ?? "échantillon non précisé";
}

function confidenceOf(answers: Answers, visible: Question[], module: ModuleId): {
  value: number;
  label: string;
  unknownLabels: string[];
} {
  const sample = module === "last-raid" ? 0.62 : (SAMPLE[answers.recentGames] ?? 0.45);
  const memory = chosenOption("memory", answers, module)?.v ?? 0.7;
  const purity = module === "last-raid" ? 1 : (chosenOption("sameFormat", answers, module)?.v ?? 0.8);
  const unknownLabels: string[] = [];
  let unknownN = 0;
  let knownN = 0;
  for (const q of visible) {
    if (q.axis !== "initiation" && q.axis !== "pressure" && q.axis !== "defense" && q.axis !== "intensity") {
      continue;
    }
    const opt = chosenOption(q.id, answers, module);
    if (!opt) continue;
    if (opt.v == null) {
      unknownN += 1;
      unknownLabels.push(q.factor ?? q.prompt);
    } else {
      knownN += 1;
    }
  }
  const ratio = unknownN / Math.max(1, unknownN + knownN);
  const chrono = 1 - 0.5 * ratio;
  let value = clamp(sample * (memory ?? 0.7) * (purity ?? 0.8) * chrono, 0.08, module === "last-raid" ? 0.58 : 0.98);
  const answered = visible.filter((q) => answers[q.id]).length;
  if (module !== "last-raid" && answered < 8) value = Math.min(value, 0.42);
  const label = value < 0.4 ? "faible" : value < 0.62 ? "moyenne" : value < 0.82 ? "élevée" : "très élevée";
  return { value, label, unknownLabels };
}

function gearAdvice(input: {
  score: number;
  confidence: number;
  heat: number;
  agg: number;
  defenderVerdict: boolean;
  trendId: string | null;
  answers: Answers;
}): string {
  const { score, confidence, heat, agg, defenderVerdict, trendId, answers } = input;
  const kit = answers.kit;
  const tolerance = answers.tolerance;
  const lines: string[] = [];
  const risky = kit === "rare" || kit === "expensive" || tolerance === "painful" || tolerance === "refuse";

  if (confidence < 0.48 && score >= 130) {
    lines.push(
      "Ton indice est élevé, mais les données sont insuffisantes pour conclure à une tendance durable. Continue à observer les prochaines parties.",
    );
  } else if (defenderVerdict && heat >= 0.55) {
    lines.push(
      "Ton Raider semble avoir subi plusieurs rencontres hostiles. Privilégie un équipement standard pendant quelques parties et réévalue la situation.",
    );
    lines.push("Ton Raider s'est surtout défendu. Rien ne permet de conclure qu'il a volontairement initié les combats.");
  } else if (defenderVerdict) {
    lines.push("Ton Raider s'est surtout défendu. Rien ne permet de conclure qu'il a volontairement initié les combats.");
    lines.push(
      "Tu peux envisager ton équipement habituel, tout en gardant à l'esprit qu'aucun score ne garantit un lobby PvE.",
    );
  } else if (score >= 180 || heat >= 0.72) {
    lines.push(
      "Ton historique récent indique une forte pression PvP. Sors avec un équipement remplaçable et conserve tes objets rares si leur perte serait difficile à accepter.",
    );
  } else if (score < 35 && heat < 0.35) {
    lines.push(
      "Ton Raider semble évoluer dans un contexte calme. Tu peux envisager ton équipement habituel, tout en gardant à l'esprit qu'aucun score ne garantit un lobby PvE.",
    );
  } else if (trendId === "hotter") {
    lines.push(
      "La tendance que tu décris est plus agressive. Le temps d'y voir plus clair, évite les objets dont la perte serait dure à accepter.",
    );
  } else if (risky && score >= 100) {
    lines.push(
      "L'indice n'est pas extrême, mais tu envisages du matériel que tu tiens à garder. Une alternative remplaçable est plus raisonnable tant que la lecture n'est pas plus stable.",
    );
  } else {
    lines.push(
      "Profil intermédiaire sur ce format. L'équipement standard reste le compromis le plus sain : de quoi te défendre, sans miser ce que tu ne veux pas perdre.",
    );
  }

  if (trendId === "calmer" && agg < 0.25 && confidence >= 0.6 && score < 130) {
    lines.push(
      "La tendance récente te semble plus calme. Tu peux envisager un peu plus de risque, sans prendre cela pour un retour garanti à des lobbys pacifiques.",
    );
  }

  if (risky && score < 80 && heat < 0.45 && !lines.some((l) => l.includes("objets rares"))) {
    lines.push(
      "Tu tiens à cet équipement. Même une lecture basse n'est pas une assurance : garde une alternative si la partie compte vraiment.",
    );
  }

  if ((kit === "cheap" || tolerance === "fine") && (score >= 180 || heat >= 0.72)) {
    lines.push("Tu envisages déjà du matériel que tu acceptes de perdre : c'est cohérent avec cette lecture.");
  }

  return lines.join(" ");
}

function synthesisOf(input: {
  answers: Answers;
  defenderVerdict: boolean;
  defenderUncertain: boolean;
  agg: number;
  heat: number;
  confidence: number;
  trendId: string | null;
  module: ModuleId;
}): string {
  const { answers, defenderVerdict, defenderUncertain, agg, heat, confidence, trendId, module } = input;
  const parts: string[] = [];
  parts.push(
    module === "last-raid"
      ? `Lecture d'un seul raid en ${formatLabel(answers).toLowerCase()}. Ce n'est pas le profil général : une partie ne fait pas une tendance.`
      : `Lecture limitée au ${formatLabel(answers).toLowerCase()}, sur ${gamesLabel(answers, module).toLowerCase()}.`,
  );
  if (defenderVerdict) {
    parts.push(
      "Tu décris des attaques subies et peu ou pas d'initiation. Le verdict contextuel s'applique : Raider en lobby PvE s'étant défendu. La riposte n'est pas comptée comme une mise en chasse.",
    );
    if (heat >= 0.6) {
      parts.push(
        "La pression hostile observée reste élevée. Ce verdict parle de ton comportement, pas d'un lobby garanti sans danger.",
      );
    }
  } else if (defenderUncertain) {
    parts.push(
      "Tu décris surtout des attaques subies, mais la chronologie est trop incomplète pour affirmer que tu n'as rien initié.",
    );
  } else if (agg >= 0.66) {
    parts.push(
      "Tes réponses décrivent un Raider qui engage souvent : premier tir, premier dégât, poursuite ou third-party. C'est surtout ça qui tire l'indice.",
    );
  } else if (agg >= 0.35) {
    parts.push("Le profil est mixte : une part des contacts vient de toi, une autre des situations subies.");
  } else if (heat >= 0.55) {
    parts.push(
      "Tu inities peu, mais les rencontres récentes sont souvent hostiles. L'indice monte à cause de la pression observée, pas pour te traiter comme l'agresseur.",
    );
  } else {
    parts.push("Les rencontres décrites restent plutôt calmes, et tu engages peu le combat.");
  }
  if (trendId === "hotter") parts.push("Tu signales en plus une tendance récente plus agressive.");
  if (trendId === "calmer") parts.push("Tu signales une tendance récente plus calme.");
  const greet = answers.greet;
  const deesc = answers.deesc;
  if (greet === "often" || deesc === "often") {
    parts.push("Côté contact, tu décris des tentatives de salut ou de désescalade. Ça éclaire le style, ça ne baisse pas un score Embark.");
  }
  if (answers.reactPeace === "shoot") {
    parts.push("Tirer sur un Raider qui semble pacifique est traité comme une initiation, pas comme un détail social.");
  }
  const motiveOn =
    Boolean(answers.thirdMotive) &&
    (joinedVoluntarily(answers) || (module === "last-raid" && answers.thirdParty === "yes"));
  if (motiveOn && answers.thirdMotive === "coverStranger") {
    parts.push("Tu décris une intervention pour un inconnu déjà agressé. Ce n'est pas lu comme une mise en chasse.");
  } else if (motiveOn && answers.thirdMotive === "coverMate") {
    parts.push("Tu décris être revenu sur un des tiens déjà à terre. Ce n'est pas lu comme une chasse au loot.");
  } else if (motiveOn && answers.thirdMotive === "spill") {
    parts.push("Tu décris un combat arrivé sur toi, pas un third-party que tu es allé chercher.");
  } else if (motiveOn && answers.thirdMotive === "hunt") {
    parts.push("Entrer dans le combat pour le kill ou le loot est compté comme une initiation.");
  }
  if (confidence < 0.48) {
    parts.push(
      "La confiance est limitée : échantillon court, souvenirs flous, formats mélangés ou chronologie inconnue. Ne lis pas cet indice comme une tendance installée.",
    );
  }
  return parts.join(" ");
}

function average(values: Array<number | null>): number | null {
  const xs = values.filter((v): v is number => v != null);
  if (!xs.length) return null;
  return xs.reduce((s, n) => s + n, 0) / xs.length;
}

function meetChance(answers: Answers, module: ModuleId): number {
  if (module === "last-raid") return chosenOption("met", answers, module)?.v ?? 0.35;
  const map: Record<string, number> = { none: 0.08, rare: 0.22, half: 0.48, most: 0.74, every: 0.88 };
  return map[answers.encounterRate] ?? 0.3;
}

const SHAPE_SPLIT: Record<string, { rat: number; pvp: number }> = {
  rats: { rat: 0.78, pvp: 0.2 },
  pvp: { rat: 0.16, pvp: 0.8 },
  both: { rat: 0.58, pvp: 0.64 },
  open: { rat: 0.14, pvp: 0.3 },
};

function asPercent(meet: number, share: number): number {
  return clamp(Math.round(meet * share * 100), 0, 90);
}

function chanceOf(answers: Answers, module: ModuleId, visible: Question[]): { rat: number; pvp: number; note: string } {
  const meet = meetChance(answers, module);
  const shapeOn = visible.some((q) => q.id === "contactShape");
  const shape = shapeOn ? answers.contactShape : undefined;
  const form = visible.some((q) => q.id === "hostileForm") ? answers.hostileForm : undefined;
  const ratProxy = average([
    chosenOption("ambush", answers, module)?.v ?? null,
    chosenOption("traps", answers, module)?.v ?? null,
    chosenOption("elevator", answers, module)?.v ?? null,
    chosenOption("extractContest", answers, module)?.v ?? null,
    form === "rat" ? 0.85 : form === "both" ? 0.55 : form === "push" ? 0.2 : form === "none" ? 0.05 : null,
  ]);
  const pvpProxy = average([
    chosenOption("tone", answers, module)?.v ?? null,
    chosenOption("shotsReceived", answers, module)?.v ?? null,
    form === "push" ? 0.8 : form === "both" ? 0.6 : form === "rat" ? 0.25 : form === "none" ? 0.05 : null,
  ]);
  const preset = shape && shape !== "unknown" ? SHAPE_SPLIT[shape] : undefined;
  const ratShare = preset ? clamp(preset.rat * 0.72 + (ratProxy ?? preset.rat) * 0.28, 0, 1) : (ratProxy ?? 0.28);
  const pvpShare = preset ? clamp(preset.pvp * 0.72 + (pvpProxy ?? preset.pvp) * 0.28, 0, 1) : (pvpProxy ?? 0.28);
  const note =
    module === "last-raid"
      ? "Une seule partie. Ces pourcentages disent : si les prochains raids de ce format ressemblent à celui-ci. Ce n'est pas la composition du prochain lobby, et Embark ne publie pas ces chances. Rat et joueur PvP peuvent se croiser dans le même raid : on ne les additionne pas."
      : "Lecture expérimentale de tes parties récentes : chance de croiser au moins un rat, et chance de croiser au moins un joueur qui cherche le fight. Ce n'est pas une probabilité Embark. Les deux peuvent arriver dans la même partie : les pourcentages ne s'additionnent pas.";
  return { rat: asPercent(meet, ratShare), pvp: asPercent(meet, pvpShare), note };
}

function chillGames(input: {
  score: number;
  agg: number;
  heat: number;
  confidence: number;
  defenderVerdict: boolean;
  trendId: string | null;
  module: ModuleId;
}): number {
  const { score, agg, heat, confidence, defenderVerdict, trendId, module } = input;
  let n: number;
  if (score < 35 && heat < 0.32 && agg < 0.15) {
    n = module === "general" && confidence < 0.7 ? 2 : 0;
  } else if (defenderVerdict && agg < 0.2) {
    n = heat >= 0.65 ? 5 : heat >= 0.4 ? 3 : 2;
  } else {
    n = 2;
    if (score >= 80) n = 4;
    if (score >= 130) n = 6;
    if (score >= 180) n = 8;
    if (score >= 230) n = 11;
    if (agg >= 0.6) n += 2;
    if (confidence < 0.45) n = Math.min(n, 6);
    if (trendId === "hotter") n += 1;
    if (trendId === "calmer" && agg < 0.25) n = Math.max(0, n - 2);
  }
  if (module === "last-raid") n = Math.min(n, agg >= 0.85 ? 8 : agg >= 0.55 ? 6 : 4);
  return clamp(n, 0, 14);
}

function motiveLive(answers: Answers, module: ModuleId): boolean {
  return Boolean(answers.thirdMotive) && (joinedVoluntarily(answers) || (module === "last-raid" && answers.thirdParty === "yes"));
}

function interventionOf(answers: Answers, module: ModuleId): string | null {
  if (!motiveLive(answers, module)) return null;
  if (answers.thirdMotive === "coverStranger") {
    return "Intervention : tu as tiré pour un inconnu déjà agressé ou au sol. Ce terminal ne compte pas ça comme une mise en chasse. Le test 1.39 comptait l'insertion dans un combat déjà commencé, sans publier d'exception pour le motif.";
  }
  if (answers.thirdMotive === "coverMate") {
    return "Intervention : tu es revenu sur un des tiens déjà à terre. Ce n'est pas lu comme une chasse au loot. Rien de public ne dit qu'Embark ignore ce motif.";
  }
  if (answers.thirdMotive === "spill") {
    return "Le combat est décrit comme arrivé sur toi. L'insertion n'est pas comptée comme volontaire.";
  }
  return null;
}

function chillNoteOf(n: number, module: ModuleId): string {
  const limit = " Ce nombre n'est pas un délai Embark. Le studio décrit un glissement graduel, pas un compte à rebours.";
  if (n === 0) {
    return module === "last-raid"
      ? "0 partie chill. Ce raid ne demande pas une série calme. Il ne promet pas non plus un lobby vide."
      : `0 partie chill. Cette lecture ne demande pas une série calme avant de rejouer comme d'habitude. Ce n'est pas une autorisation de lobby PvE.${limit}`;
  }
  const noun = n === 1 ? "partie chill" : "parties chill";
  const base = `${n} ${noun} avant de réévaluer : pas de premier tir, pas de poursuite, pas d'entrée dans un combat pour le loot, équipement que tu acceptes de perdre.`;
  return module === "last-raid" ? `${base} Une partie isolée ne justifie pas une longue série.${limit}` : base + limit;
}

export function evaluate(answers: Answers, module: ModuleId = "general"): Reading {
  const visible = visibleQuestions(answers, module);
  const complete = visible.every((q) => Boolean(answers[q.id]));
  const unlocked =
    module === "last-raid"
      ? Boolean(answers.format && answers.met)
      : Boolean(answers.format && answers.recentGames && answers.encounterRate);

  const initItems = tuneInitiation(itemsFor("initiation", answers, module), answers, module, visible);
  const pressItems = itemsFor("pressure", answers, module);
  const defItems = itemsFor("defense", answers, module);
  const intItems = itemsFor("intensity", answers, module);

  const mean = weightedMean(initItems);
  const hard = initItems.filter((i) => i.hard);
  const peak = hard.length ? Math.max(...hard.map((i) => i.v)) : 0;
  let signal = mean == null ? 0 : mean * (1 - FORMULA.PEAK_BLEND) + peak * FORMULA.PEAK_BLEND;
  if (initItems.length > 0 && hard.length === 0) signal *= FORMULA.SOFT_ONLY_DAMP;

  const intensity = weightedMean(intItems);
  const agg = clamp(signal * (1 + FORMULA.INTENSITY_AMP * (intensity ?? 0)), 0, 1);
  const heat = weightedMean(pressItems) ?? 0;
  const defenseMean = weightedMean(defItems);

  const raw = agg * FORMULA.INIT_SCALE + (1 - agg) * heat * FORMULA.PRESSURE_LIFT;
  const score = clamp(Math.round(raw), 0, 300);

  const escIds = ["thirdParty", "chase", "noProof", "pursuedAfter", "overstay", "reactPeace", "reactAim", "engagedAnyway"];
  const escItems = initItems.filter((i) => escIds.includes(i.id));
  const escMean = weightedMean(escItems);
  const escPeak = escItems.length ? Math.max(...escItems.map((i) => i.v)) : 0;
  const escLow = (escMean == null || escMean <= 0.28) && escPeak <= 0.35;
  const initLow = mean != null && signal <= 0.18;

  const shots = chosenOption("shotsReceived", answers, module)?.v;
  const ambush = chosenOption("ambush", answers, module)?.v;
  const tone = chosenOption("tone", answers, module)?.v;
  const hit = chosenOption("hitFirst", answers, module)?.v;
  const squad = chosenOption("squadFirst", answers, module)?.v;
  const hostile = answers.hostileForm;
  const attacked =
    (shots != null && shots >= 0.22) ||
    (ambush != null && ambush >= 0.3) ||
    (tone != null && tone >= 0.5) ||
    (hit != null && hit >= 0.75) ||
    (squad != null && squad >= 0.75) ||
    hostile === "push" ||
    hostile === "rat" ||
    hostile === "both";

  const survive = chosenOption("surviveOnly", answers, module);
  const notSeeking = !survive || survive.v == null || survive.v >= 0.6;
  const aggressiveSocial =
    answers.reactPeace === "shoot" || answers.reactAim === "shoot" || (motiveLive(answers, module) && answers.thirdMotive === "hunt");
  const chronoIds = ["firstShot", "firstDamage", "hitFirst"];
  const chronoUnknown = chronoIds.some((id) => {
    const opt = chosenOption(id, answers, module);
    return Boolean(opt && opt.v == null && opt.id === "unknown");
  });

  const onCombat = module === "last-raid" ? lastFight(answers) : combatPath(answers);
  const defenderVerdict = Boolean(
    onCombat && attacked && initLow && escLow && notSeeking && !chronoUnknown && !aggressiveSocial && complete,
  );
  const defenderUncertain = Boolean(onCombat && attacked && initLow && chronoUnknown && !aggressiveSocial);

  const conf = confidenceOf(answers, visible, module);
  const spread = Math.round((1 - conf.value) * 58);
  const trendId = answers.trend ?? null;

  const factorsRaw: Factor[] = [];
  const initW = initItems.reduce((s, i) => s + i.w, 0);
  const pressW = pressItems.reduce((s, i) => s + i.w, 0);
  const amp = 1 + FORMULA.INTENSITY_AMP * (intensity ?? 0);
  for (const it of initItems) {
    factorsRaw.push({
      label: it.label,
      points: initW > 0 ? (it.w / initW) * it.v * amp * FORMULA.INIT_SCALE : 0,
    });
  }
  for (const it of pressItems) {
    factorsRaw.push({
      label: it.label,
      points: pressW > 0 ? (it.w / pressW) * it.v * (1 - agg) * FORMULA.PRESSURE_LIFT : 0,
    });
  }
  const sumPts = factorsRaw.reduce((s, f) => s + f.points, 0);
  const scale = sumPts > 0 ? score / sumPts : 1;
  const factors = factorsRaw
    .map((f) => ({ label: f.label, points: Math.round(f.points * scale) }))
    .filter((f) => f.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const uncertainties: string[] = [
    "Ce Psycho-Pass n'est pas le score interne d'Embark. Aucun seuil officiel n'a été publié, et la similarité de style n'est jamais garantie.",
  ];
  if (module === "general" && (SAMPLE[answers.recentGames] ?? 1) < 0.5) {
    uncertainties.push("Très peu de parties : une série courte peut être un hasard, pas une tendance.");
  }
  if (module === "last-raid") {
    uncertainties.push("Une partie isolée peut être un hasard, une défense ou un third-party. Elle ne remplace pas le profil général.");
  }
  if (answers.memory === "vague") {
    uncertainties.push("Souvenirs flous : la chronologie fine (qui a tiré, qui a blessé) est la première chose à perdre.");
  }
  if (answers.sameFormat === "mixed") {
    uncertainties.push("Historiques de solo, duo et trio mélangés. Embark les sépare ; cette lecture est moins fiable.");
  } else if (answers.sameFormat === "mostly") {
    uncertainties.push("Quelques parties d'un autre format se sont glissées dans l'échantillon.");
  }
  for (const label of conf.unknownLabels) {
    uncertainties.push(`Réponse exclue faute de certitude : ${label}.`);
  }
  if (answers.damageAmt === "unknown") {
    uncertainties.push("Volume de dégâts inconnu : l'intensité du combat reste approximative.");
  }
  if (defenderUncertain) {
    uncertainties.push("Verdict défensif retenu : tu sembles avoir subi, mais l'ordre des coups n'est pas établi.");
  }
  uncertainties.push(
    "Le test 1.39.0 (défense à poids nul) a été annoncé comme un test. On s'en inspire, on ne le fige pas comme une règle éternelle.",
  );
  uncertainties.push(
    "Le toggle PvE testé du 13 au 20 octobre 2026 ne doit pas être mélangé à cet échantillon : Embark indiquait qu'il ne modifiait pas le rating PvPvE, et qu'il serait retiré à la fin du test.",
  );

  const readingBase = {
    score: unlocked ? score : 0,
    category: categoryFor(unlocked ? score : 0),
    provisional: !complete,
    unlocked,
    initiation: Math.round(agg * 100),
    pressure: Math.round(heat * 100),
    defense: defenseMean == null ? null : Math.round(defenseMean * 100),
    agg,
    heat,
    confidence: conf.value,
    confidenceLabel: conf.label,
    spread,
    low: clamp((unlocked ? score : 0) - spread, 0, 300),
    high: clamp((unlocked ? score : 0) + spread, 0, 300),
    defenderVerdict: defenderVerdict && unlocked,
    defenderUncertain: defenderUncertain && unlocked,
    formatLabel: formatLabel(answers),
    gamesLabel: gamesLabel(answers, module),
    trendId,
    factors,
    uncertainties,
    ignored: NOT_SCORED,
    complete,
    module,
  };

  const chances = chanceOf(answers, module, visible);
  const chill = chillGames({
    score: readingBase.score,
    agg,
    heat,
    confidence: conf.value,
    defenderVerdict: readingBase.defenderVerdict,
    trendId,
    module,
  });
  const intervention = interventionOf(answers, module);
  if (intervention) {
    readingBase.uncertainties.push(
      "Le motif du third-party est une hypothèse de ce terminal. Le test 1.39 comptait l'insertion, sans dire que sauver quelqu'un ne compte pas.",
    );
  }

  const synthesis = synthesisOf({
    answers,
    defenderVerdict: readingBase.defenderVerdict,
    defenderUncertain: readingBase.defenderUncertain,
    agg,
    heat,
    confidence: conf.value,
    trendId,
    module,
  });
  const gear = gearAdvice({
    score: readingBase.score,
    confidence: conf.value,
    heat,
    agg,
    defenderVerdict: readingBase.defenderVerdict,
    trendId,
    answers,
  });
  const protocol = chillNoteOf(chill, module);

  return {
    ...readingBase,
    synthesis,
    gear,
    protocol,
    ratChance: chances.rat,
    pvpChance: chances.pvp,
    chillGames: chill,
    chanceNote: chances.note,
    chillNote: protocol,
    intervention,
  };
}

export function discordReport(r: Reading): string {
  const lines = [
    r.module === "last-raid" ? "RAIDER PSYCHO-PASS — dernière partie" : "RAIDER PSYCHO-PASS — profil général",
    "Indicateur communautaire expérimental. Ce n'est pas le score interne d'Embark.",
    "",
    `Psycho-Pass : ${String(r.score).padStart(3, "0")} / 300`,
    `Catégorie : ${r.category.name}`,
    `Chance de croiser un rat : ${r.ratChance} %`,
    `Chance de croiser un joueur PvP : ${r.pvpChance} %`,
    `Parties chill conseillées : ${r.chillGames}`,
  ];
  if (r.defenderVerdict) lines.push("Verdict : Raider en lobby PvE s'étant défendu");
  else if (r.defenderUncertain) lines.push("Verdict défensif : incertain (chronologie incomplète)");
  if (r.intervention) lines.push(r.intervention);
  lines.push(
    `Format évalué : ${r.formatLabel}`,
    `Confiance : ${r.confidenceLabel} (${r.confidence.toFixed(2).replace(".", ",")}) · fourchette de lecture ${r.low}–${r.high}`,
    `Parties observées : ${r.gamesLabel}`,
    "",
    `Initiation volontaire : ${r.initiation}/100`,
    `Pression hostile subie : ${r.pressure}/100`,
    `Posture défensive : ${r.defense == null ? "non établie" : `${r.defense}/100`}`,
    "",
    "Lecture des chances",
    r.chanceNote,
    "",
    "Parties chill",
    r.chillNote,
    "",
    "Synthèse",
    r.synthesis,
    "",
    "Facteurs les plus contributifs",
  );
  if (r.factors.length === 0) lines.push("• Aucun facteur notable : l'indice reste bas.");
  else for (const f of r.factors) lines.push(`• ${f.label} (~${f.points} pts)`);
  lines.push("", "Incertitudes");
  for (const u of r.uncertainties) lines.push(`• ${u}`);
  lines.push("", "Hors calcul", ...r.ignored.map((i) => `• ${i}`), "", "Conseil d'équipement", r.gear, "", "Protocole", r.protocol);
  return lines.join("\n");
}

export const TRANSPARENCY: { id: string; title: string; items: string[] }[] = [
  {
    id: "facts",
    title: "Confirmé par Embark",
    items: [
      "Le style de jeu est une échelle continue, pas deux lobbys « gentils » et « méchants ». La plupart des Raiders sont entre les deux. (Notes du 20 mai 2026.)",
      "Le système rapproche plutôt des styles similaires, sans garantie. Il n'existe pas, dans ces notes, de lobby où personne ne pourra jamais t'attaquer. Topside reste risqué.",
      "Un tir ou un kill isolé ne te bascule pas d'un coup. L'historique pèse sur la durée, et les patchs ne le remettent pas à zéro.",
      "Le loadout, le sondage de fin de partie, le fait de looter un joueur au sol, le statut de chef et le crossplay ne sont pas présentés comme le levier du ton PvP. Le crossplay change le vivier, pas une promesse de calme.",
      "Depuis le 20 mai 2026, se défendre n'est plus traité comme démarrer un combat. Les rounds très pauvres en décisions pèsent moins.",
      "Depuis la 1.36.0 (7 juillet 2026), solo, duo et trio ont des historiques séparés.",
      "Le test 1.39.0 (28 juillet 2026) allait plus loin : seuls les combats que tu choisis de commencer devaient compter, défense incluse à zéro — y compris le KO de celui qui a frappé en premier. L'escouade qui pose le premier dégât, down ou KO est lue comme l'initiatrice. Le third-party compte. Un échange long pèse plus qu'un tir accidentel, qui compte encore un peu. Embark présentait cela comme un test.",
      "Un toggle PvE a été testé du 13 au 20 octobre 2026, avec zéro dégât joueur sur ces serveurs, et sans modifier le rating PvPvE. Le studio prévoyait de retirer le toggle à la fin du test. Aucun résultat officiel post-test n'est codé ici.",
    ],
  },
  {
    id: "community",
    title: "Observations communautaires",
    items: [
      "Les joueurs décrivent des séries plus calmes ou plus chaudes, des third-parties, des attaques à l'ascenseur, des pièges. Ce sont des récits de raid, pas une télémétrie.",
      "La distribution « environ un tiers plutôt PvP » citée dans la presse au moment du projet de toggle est un portrait de population, pas un score personnel. Elle n'entre pas dans la formule.",
    ],
  },
  {
    id: "model",
    title: "Hypothèses de ce modèle",
    items: [
      "Trois lectures séparées : initiation volontaire, pression subie, posture défensive.",
      "L'initiation peut porter toute l'échelle jusqu'à 300. La pression ajoute jusqu'à 120 points, et seulement dans la part du score qui n'est pas déjà de l'initiation.",
      "Le pic du geste le plus offensif compte autant que la moyenne, pour qu'un comportement clair ne soit pas noyé.",
      "L'intensité amplifie l'initiation (coefficient 0,28), pas la défense.",
      "La confiance dépend du nombre de parties, de la netteté des souvenirs, de la pureté du format et des « je ne sais pas ». Elle élargit la fourchette. Elle ne tire pas le score vers le milieu. Sur un seul raid, elle est plafonnée.",
      "Rejoindre un combat pour le kill ou le loot garde le poids du third-party. Le faire parce qu'un inconnu se fait tuer, parce qu'un mate est déjà à terre, ou parce que le combat arrive sur toi, atténue ce poids. Hypothèse du terminal, pas une règle Embark.",
      "La chance « rat » et la chance « joueur PvP » partent de la fréquence de rencontres que tu décris, puis du type de contact. Embûches, pièges et ascenseur tirent vers le rat. Tirs reçus et tonalité hostile tirent vers le joueur PvP. Plafond affiché : 90 %.",
      "Le nombre de parties chill suit le Psycho-Pass, l'initiation et la pression. Zéro si la lecture est déjà calme. Ce n'est pas un reset de matchmaking.",
      "Aucun bonus micro, émote ou extraction pacifique. Aucun malus de loadout.",
    ],
  },
  {
    id: "play",
    title: "Choix ludiques",
    items: [
      "L'échelle 0–300, les noms de catégories et le mot Psycho-Pass sont un hommage à la série, pas un système Sibyl et pas un outil Embark.",
      "Le 300 est un sommet symbolique : le profil le plus orienté PvP que tes réponses permettent de décrire.",
    ],
  },
];

export const SOURCES: { label: string; href: string }[] = [
  {
    label: "Notes on the Matchmaking System — Embark, 20 mai 2026",
    href: "https://arcraiders.com/news/notes-on-the-matchmaking-system",
  },
  {
    label: "Test du toggle PvE — Embark, 24 septembre 2026",
    href: "https://arcraiders.com/news/pve-toggle-beta-test",
  },
  {
    label: "Règles du test PvE — Embark, 12 octobre 2026",
    href: "https://arcraiders.com/news/pve-toggle-what-to-know",
  },
  {
    label: "Live Update 1.39.0 — centre d'aide Embark",
    href: "https://id.embark.games/arc-raiders/support/faq/269-live-update-1-39-0",
  },
];
