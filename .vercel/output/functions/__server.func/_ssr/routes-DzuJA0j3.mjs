import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Crosshair, c as ChevronLeft, i as Lock, l as Check, n as Shield, o as Copy, r as RotateCcw, s as ChevronRight, t as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DzuJA0j3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MODULES = [{
	id: "general",
	index: "01",
	title: "Profil général",
	text: "Plusieurs parties récentes, un seul format. Lecture de tendance, pas le film d'un raid.",
	ready: true
}, {
	id: "last-raid",
	index: "02",
	title: "Dernière partie",
	text: "Chronologie d'un raid : premier tir, premier dégât, third-party, extraction. Prévu, pas encore branché.",
	ready: false
}];
var SECTIONS = [
	{
		id: "context",
		index: "01",
		title: "Contexte"
	},
	{
		id: "encounters",
		index: "02",
		title: "Rencontres"
	},
	{
		id: "initiation",
		index: "03",
		title: "Initiation"
	},
	{
		id: "defense",
		index: "04",
		title: "Défense"
	},
	{
		id: "comms",
		index: "05",
		title: "Contact"
	},
	{
		id: "intensity",
		index: "06",
		title: "Intensité"
	},
	{
		id: "extract",
		index: "07",
		title: "Extraction"
	}
];
var always = () => true;
function someEncounters(a) {
	return Boolean(a.encounterRate && a.encounterRate !== "none");
}
function noEncounters(a) {
	return a.encounterRate === "none";
}
function combatPath(a) {
	if (someEncounters(a)) return true;
	return a.engagedAnyway === "isolated" || a.engagedAnyway === "hunted";
}
function squadFormat(a) {
	return a.format === "duo" || a.format === "trio";
}
var SCALE_5 = [
	{
		id: "never",
		label: "Jamais",
		v: 0
	},
	{
		id: "once",
		label: "Une fois",
		v: .2
	},
	{
		id: "sometimes",
		label: "Parfois",
		v: .48
	},
	{
		id: "often",
		label: "Souvent",
		v: .78
	},
	{
		id: "always",
		label: "Presque toujours",
		v: 1
	},
	{
		id: "unknown",
		label: "Je ne sais pas",
		detail: "Exclu du calcul. Baisse la confiance.",
		v: null
	}
];
var FREQ_4 = [
	{
		id: "never",
		label: "Jamais",
		v: 0
	},
	{
		id: "rare",
		label: "Rarement",
		v: .28
	},
	{
		id: "sometimes",
		label: "Parfois",
		v: .55
	},
	{
		id: "often",
		label: "Souvent",
		v: 1
	}
];
var QUESTIONS = [
	{
		id: "format",
		sectionId: "context",
		prompt: "Dans quel format veux-tu évaluer ce Raider ?",
		note: "Un seul format à la fois. Depuis la mise à jour 1.36.0, Embark indique suivre le style séparément en solo, duo et trio. Ce terminal fait pareil : on ne mélange pas les historiques.",
		axis: "meta",
		weight: 0,
		show: always,
		options: [
			{
				id: "solo",
				label: "Solo",
				detail: "Tu entres seul sur Topside.",
				v: 0
			},
			{
				id: "duo",
				label: "Duo",
				detail: "Deux Raiders, profil de ce format seulement.",
				v: 0
			},
			{
				id: "trio",
				label: "Trio",
				detail: "Escouade de trois, profil séparé du solo.",
				v: 0
			}
		]
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
			{
				id: "g1",
				label: "1 à 2 parties",
				v: .3
			},
			{
				id: "g2",
				label: "3 à 5 parties",
				v: .5
			},
			{
				id: "g3",
				label: "6 à 9 parties",
				v: .67
			},
			{
				id: "g4",
				label: "10 à 15 parties",
				v: .82
			},
			{
				id: "g5",
				label: "16 à 25 parties",
				v: .92
			},
			{
				id: "g6",
				label: "26 parties ou plus",
				v: .97
			}
		]
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
			{
				id: "rare",
				label: "Quelques parties par mois",
				v: 0
			},
			{
				id: "weekly",
				label: "Une à deux fois par semaine",
				v: 0
			},
			{
				id: "regular",
				label: "Plusieurs fois par semaine",
				v: 0
			},
			{
				id: "daily",
				label: "Presque tous les jours",
				v: 0
			}
		]
	},
	{
		id: "sameFormat",
		sectionId: "context",
		prompt: "Ces parties sont-elles bien toutes dans ce format ?",
		axis: "meta",
		weight: 0,
		show: always,
		options: [
			{
				id: "pure",
				label: "Oui, uniquement ce format",
				v: 1
			},
			{
				id: "mostly",
				label: "En majorité, avec quelques exceptions",
				v: .86
			},
			{
				id: "mixed",
				label: "J'ai mélangé solo, duo et trio",
				detail: "La fiabilité baisse. Un format ne se déduit pas d'un autre.",
				v: .58
			}
		]
	},
	{
		id: "memory",
		sectionId: "context",
		prompt: "Quelle est la netteté de tes souvenirs sur ces parties ?",
		axis: "meta",
		weight: 0,
		show: always,
		options: [
			{
				id: "vague",
				label: "Floue, je reconstitue",
				v: .58
			},
			{
				id: "clear",
				label: "Assez claire",
				v: .84
			},
			{
				id: "precise",
				label: "Très précise, je pourrais les raconter",
				v: 1
			}
		]
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
			{
				id: "none",
				label: "Presque aucune rencontre",
				v: 0
			},
			{
				id: "rare",
				label: "Rares",
				detail: "Environ une partie sur quatre, ou moins.",
				v: .22
			},
			{
				id: "half",
				label: "Régulières",
				detail: "Environ une partie sur deux.",
				v: .48
			},
			{
				id: "most",
				label: "Fréquentes",
				detail: "La plupart des parties.",
				v: .74
			},
			{
				id: "every",
				label: "Quasi systématiques",
				v: 1
			}
		]
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
			{
				id: "peaceful",
				label: "Surtout pacifiques",
				v: .04
			},
			{
				id: "mixed",
				label: "Mélange calme et tendu",
				v: .32
			},
			{
				id: "ambiguous",
				label: "Souvent ambiguës",
				detail: "Visée, filature, sans tir clair.",
				v: .5
			},
			{
				id: "threatening",
				label: "Souvent menaçantes",
				v: .76
			},
			{
				id: "hostile",
				label: "Surtout hostiles",
				v: 1
			}
		]
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
			{
				id: "never",
				label: "Jamais",
				v: 0
			},
			{
				id: "rare",
				label: "Rarement",
				v: .22
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: .48
			},
			{
				id: "often",
				label: "Souvent",
				v: .76
			},
			{
				id: "always",
				label: "Presque à chaque rencontre",
				v: 1
			}
		]
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
			{
				id: "never",
				label: "Jamais",
				v: 0
			},
			{
				id: "once",
				label: "Une ou deux fois",
				v: .3
			},
			{
				id: "several",
				label: "Plusieurs fois",
				v: .66
			},
			{
				id: "frequent",
				label: "Fréquentes",
				v: 1
			}
		]
	},
	{
		id: "traps",
		sectionId: "encounters",
		prompt: "Des pièges ou des explosifs d'autres joueurs ont-ils été utilisés contre toi ?",
		factor: "Pièges et explosifs subis",
		axis: "pressure",
		weight: .75,
		show: someEncounters,
		options: [
			{
				id: "never",
				label: "Jamais",
				v: 0
			},
			{
				id: "rare",
				label: "Rarement",
				v: .28
			},
			{
				id: "several",
				label: "Plusieurs fois",
				v: .62
			},
			{
				id: "frequent",
				label: "Fréquemment",
				v: 1
			}
		]
	},
	{
		id: "trend",
		sectionId: "encounters",
		prompt: "Ces dernières parties, la tendance des lobbys te semble…",
		factor: "Tendance récente",
		axis: "pressure",
		weight: .9,
		show: someEncounters,
		options: [
			{
				id: "calmer",
				label: "Plus calme qu'avant",
				v: .05
			},
			{
				id: "stable",
				label: "Stable",
				v: .38
			},
			{
				id: "hotter",
				label: "Plus agressive",
				v: .92
			},
			{
				id: "unknown",
				label: "Trop peu de parties pour le dire",
				v: null
			}
		]
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
			{
				id: "no",
				label: "Non, aucun engagement",
				v: 0
			},
			{
				id: "isolated",
				label: "Un tir isolé, peut-être accidentel",
				v: .28
			},
			{
				id: "hunted",
				label: "Oui, j'ai cherché le contact",
				v: .92
			}
		]
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
		options: [...SCALE_5]
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
			{
				id: "never",
				label: "Jamais",
				v: 0
			},
			{
				id: "once",
				label: "Une fois",
				v: .2
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: .48
			},
			{
				id: "often",
				label: "Souvent",
				v: .78
			},
			{
				id: "always",
				label: "Presque toujours",
				v: 1
			},
			{
				id: "unknown",
				label: "Chronologie inconnue",
				v: null
			}
		]
	},
	{
		id: "thirdParty",
		sectionId: "initiation",
		prompt: "As-tu rejoint volontairement un combat déjà en cours ?",
		note: "Lors du test public 1.39.0, Embark a indiqué que s'insérer dans un combat déjà commencé compte comme le démarrer. Pas un coefficient : un critère qualitatif.",
		factor: "Third-party volontaire",
		axis: "initiation",
		weight: 1,
		peak: true,
		show: combatPath,
		options: [
			{
				id: "never",
				label: "Jamais",
				v: 0
			},
			{
				id: "rare",
				label: "Rarement",
				v: .28
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: .55
			},
			{
				id: "often",
				label: "Souvent",
				v: 1
			},
			{
				id: "unknown",
				label: "Je ne suis pas sûr",
				v: null
			}
		]
	},
	{
		id: "chase",
		sectionId: "initiation",
		prompt: "As-tu poursuivi un adversaire après qu'il a tenté de fuir ?",
		factor: "Poursuite d'un fuyard",
		axis: "initiation",
		weight: .9,
		peak: true,
		show: combatPath,
		options: [...FREQ_4]
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
			{
				id: "never",
				label: "Jamais",
				v: 0
			},
			{
				id: "rare",
				label: "Rarement",
				v: .28
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: .55
			},
			{
				id: "often",
				label: "Souvent",
				v: 1
			},
			{
				id: "unknown",
				label: "Situation trop floue pour répondre",
				v: null
			}
		]
	},
	{
		id: "accidental",
		sectionId: "initiation",
		prompt: "Des tirs accidentels ou des situations vraiment ambiguës ?",
		note: "Ricochet, tir de panique, ARC confondu avec un Raider. Dans la note 1.39.0, un coup accidentel compte encore comme un début de combat, mais pèse beaucoup moins. Ici le poids est volontairement faible, et ce n'est pas leur formule.",
		factor: "Tirs accidentels ou ambigus",
		axis: "initiation",
		weight: .3,
		show: combatPath,
		options: [
			{
				id: "none",
				label: "Aucun",
				v: 0
			},
			{
				id: "one",
				label: "Un cas isolé",
				v: .15
			},
			{
				id: "several",
				label: "Plusieurs cas",
				v: .32
			},
			{
				id: "frequent",
				label: "C'était fréquent",
				v: .45
			},
			{
				id: "unknown",
				label: "Je ne peux pas les distinguer",
				v: null
			}
		]
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
			{
				id: "always",
				label: "Presque toujours, j'étais touché d'abord",
				v: 1
			},
			{
				id: "often",
				label: "Souvent",
				v: .75
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: .45
			},
			{
				id: "rarely",
				label: "Rarement : j'engageais avant d'être touché",
				v: .12
			},
			{
				id: "nofight",
				label: "Pas de vrai échange de tirs",
				v: null
			},
			{
				id: "unknown",
				label: "Chronologie inconnue",
				v: null
			}
		]
	},
	{
		id: "surviveOnly",
		sectionId: "defense",
		prompt: "Quand tu as riposté, c'était pour survivre ?",
		axis: "defense",
		weight: 1,
		show: combatPath,
		options: [
			{
				id: "always",
				label: "Oui, presque uniquement pour m'en sortir",
				v: 1
			},
			{
				id: "mostly",
				label: "Surtout oui",
				v: .72
			},
			{
				id: "pressed",
				label: "Parfois j'ai poussé l'avantage",
				v: .28
			},
			{
				id: "hunted",
				label: "Non, je cherchais le combat",
				v: 0
			}
		]
	},
	{
		id: "broke",
		sectionId: "defense",
		prompt: "As-tu fui ou rompu le contact quand c'était possible ?",
		axis: "defense",
		weight: .9,
		show: combatPath,
		options: [
			{
				id: "often",
				label: "Souvent",
				v: 1
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: .62
			},
			{
				id: "rarely",
				label: "Rarement",
				v: .22
			},
			{
				id: "never",
				label: "Je n'ai pas cherché à rompre",
				v: 0
			},
			{
				id: "nofight",
				label: "Pas de combat où fuir avait un sens",
				v: null
			}
		]
	},
	{
		id: "pursuedAfter",
		sectionId: "defense",
		prompt: "Après avoir neutralisé la menace, as-tu poursuivi ?",
		note: "Neutraliser puis courir après n'est plus de la défense. Cette réponse alimente l'initiation, pas la posture défensive.",
		factor: "Poursuite après neutralisation",
		axis: "initiation",
		weight: .85,
		peak: true,
		show: combatPath,
		options: [
			{
				id: "never",
				label: "Jamais",
				v: 0
			},
			{
				id: "once",
				label: "Une fois",
				v: .32
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: .62
			},
			{
				id: "often",
				label: "Souvent",
				v: 1
			},
			{
				id: "noneutral",
				label: "Pas de menace neutralisée",
				v: null
			}
		]
	},
	{
		id: "overstay",
		sectionId: "defense",
		prompt: "As-tu continué le combat alors que tu pouvais partir ?",
		factor: "Combat prolongé alors que la fuite était possible",
		axis: "initiation",
		weight: .75,
		peak: true,
		show: combatPath,
		options: [
			{
				id: "never",
				label: "Non",
				v: 0
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: .55
			},
			{
				id: "often",
				label: "Souvent",
				v: 1
			},
			{
				id: "blocked",
				label: "Je ne pouvais pas vraiment partir",
				v: null
			}
		]
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
			{
				id: "us",
				label: "Oui, souvent l'un des nôtres a été touché d'abord",
				v: 1
			},
			{
				id: "mixed",
				label: "Mitigé",
				v: .4
			},
			{
				id: "we",
				label: "C'est plutôt nous qui avons engagé",
				v: .05
			},
			{
				id: "unknown",
				label: "Je ne sais pas",
				v: null
			}
		]
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
			{
				id: "off",
				label: "Non, micro coupé",
				v: 0
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: 0
			},
			{
				id: "often",
				label: "Souvent",
				v: 0
			}
		]
	},
	{
		id: "greet",
		sectionId: "comms",
		prompt: "Salutations et tentatives de négociation ?",
		axis: "narrative",
		weight: 0,
		show: always,
		options: [
			{
				id: "often",
				label: "Souvent",
				v: 0
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: 0
			},
			{
				id: "rarely",
				label: "Rarement",
				v: 0
			},
			{
				id: "never",
				label: "Jamais",
				v: 0
			}
		]
	},
	{
		id: "emote",
		sectionId: "comms",
		prompt: "La roue d'émotes, tu t'en sers face aux autres Raiders ?",
		axis: "narrative",
		weight: 0,
		show: always,
		options: [
			{
				id: "often",
				label: "Souvent",
				v: 0
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: 0
			},
			{
				id: "rarely",
				label: "Rarement",
				v: 0
			},
			{
				id: "never",
				label: "Jamais",
				v: 0
			}
		]
	},
	{
		id: "deesc",
		sectionId: "comms",
		prompt: "Tu as tenté de désescalader ?",
		axis: "narrative",
		weight: 0,
		show: always,
		options: [
			{
				id: "often",
				label: "Souvent",
				v: 0
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: 0
			},
			{
				id: "rarely",
				label: "Rarement",
				v: 0
			},
			{
				id: "never",
				label: "Jamais",
				v: 0
			}
		]
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
			{
				id: "often",
				label: "Souvent tolérée ou partagée",
				v: 0
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: 0
			},
			{
				id: "rarely",
				label: "Rarement",
				v: 0
			},
			{
				id: "never",
				label: "Jamais",
				v: 0
			},
			{
				id: "none",
				label: "L'occasion ne s'est pas présentée",
				v: 0
			}
		]
	},
	{
		id: "reactPeace",
		sectionId: "comms",
		prompt: "Face à un Raider qui a l'air pacifique, tu fais quoi ?",
		factor: "Réaction aux Raiders pacifiques",
		axis: "initiation",
		weight: .95,
		peak: true,
		show: someEncounters,
		options: [
			{
				id: "leave",
				label: "Je le laisse",
				v: 0
			},
			{
				id: "greet",
				label: "Je salue et je passe",
				v: .05
			},
			{
				id: "watch",
				label: "Je le garde en joue, prêt",
				v: .28
			},
			{
				id: "shoot",
				label: "Je tire quand même",
				v: 1
			}
		]
	},
	{
		id: "reactAim",
		sectionId: "comms",
		prompt: "Quelqu'un te vise sans tirer. Ta réaction ?",
		factor: "Réaction à une visée sans tir",
		axis: "initiation",
		weight: .9,
		peak: true,
		show: someEncounters,
		options: [
			{
				id: "hold",
				label: "Je ne tire pas",
				v: 0
			},
			{
				id: "move",
				label: "Je me repositionne ou je pars",
				v: .12
			},
			{
				id: "warn",
				label: "Je préviens, sans tirer le premier",
				v: .18
			},
			{
				id: "shoot",
				label: "Je tire le premier",
				v: .9
			}
		]
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
			{
				id: "none",
				label: "Pas de vrai combat",
				v: 0
			},
			{
				id: "short",
				label: "Très court, un échange bref",
				v: .2
			},
			{
				id: "mid",
				label: "Quelques secondes appuyées",
				v: .55
			},
			{
				id: "long",
				label: "Un affrontement prolongé",
				v: 1
			}
		]
	},
	{
		id: "involved",
		sectionId: "intensity",
		prompt: "Combien de joueurs se retrouvaient en général dans l'échange ?",
		axis: "intensity",
		weight: .7,
		show: combatPath,
		options: [
			{
				id: "none",
				label: "Personne, pas d'échange",
				v: 0
			},
			{
				id: "one",
				label: "Un face-à-face",
				v: .35
			},
			{
				id: "several",
				label: "Plusieurs Raiders",
				v: .7
			},
			{
				id: "chaos",
				label: "Escouades, troisième force, confusion",
				v: 1
			}
		]
	},
	{
		id: "damageAmt",
		sectionId: "intensity",
		prompt: "La quantité de dégâts échangés, si tu la connais ?",
		axis: "intensity",
		weight: .8,
		show: combatPath,
		options: [
			{
				id: "unknown",
				label: "Je ne sais pas",
				v: null
			},
			{
				id: "light",
				label: "Légère",
				v: .25
			},
			{
				id: "mid",
				label: "Modérée",
				v: .6
			},
			{
				id: "heavy",
				label: "Lourde",
				v: 1
			}
		]
	},
	{
		id: "downs",
		sectionId: "intensity",
		prompt: "Des mises à terre pendant ces affrontements ?",
		axis: "intensity",
		weight: 1,
		show: combatPath,
		options: [
			{
				id: "none",
				label: "Aucune",
				v: 0
			},
			{
				id: "rare",
				label: "Rares",
				v: .32
			},
			{
				id: "several",
				label: "Plusieurs",
				v: .68
			},
			{
				id: "many",
				label: "Nombreuses",
				v: 1
			}
		]
	},
	{
		id: "pursuitCount",
		sectionId: "intensity",
		prompt: "Des courses-poursuites, au-delà du simple échange de tirs ?",
		axis: "intensity",
		weight: .75,
		show: combatPath,
		options: [
			{
				id: "none",
				label: "Aucune",
				v: 0
			},
			{
				id: "rare",
				label: "Rares",
				v: .4
			},
			{
				id: "several",
				label: "Plusieurs",
				v: 1
			}
		]
	},
	{
		id: "repeats",
		sectionId: "intensity",
		prompt: "Le même raid recommençait-il le combat plus d'une fois ?",
		axis: "intensity",
		weight: 1,
		show: combatPath,
		options: [
			{
				id: "never",
				label: "Non",
				v: 0
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: .5
			},
			{
				id: "often",
				label: "Souvent",
				v: 1
			}
		]
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
			{
				id: "calm",
				label: "Surtout réussies et calmes",
				v: 0
			},
			{
				id: "contested",
				label: "Surtout réussies, mais contestées",
				v: 0
			},
			{
				id: "mixed",
				label: "Mitigé",
				v: 0
			},
			{
				id: "failed",
				label: "Souvent ratées",
				v: 0
			}
		]
	},
	{
		id: "extractContest",
		sectionId: "extract",
		prompt: "L'extraction elle-même était-elle contestée par d'autres Raiders ?",
		factor: "Extraction contestée",
		axis: "pressure",
		weight: .8,
		show: always,
		options: [
			{
				id: "rare",
				label: "Rarement ou jamais",
				v: .08
			},
			{
				id: "sometimes",
				label: "Parfois",
				v: .48
			},
			{
				id: "often",
				label: "Souvent",
				v: .9
			}
		]
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
			{
				id: "never",
				label: "Jamais",
				v: 0
			},
			{
				id: "rare",
				label: "Rares",
				v: .28
			},
			{
				id: "several",
				label: "Plusieurs",
				v: .66
			},
			{
				id: "frequent",
				label: "Fréquentes",
				v: 1
			}
		]
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
			{
				id: "cheap",
				label: "Léger, remplaçable",
				v: 0
			},
			{
				id: "standard",
				label: "Standard, celui d'habitude",
				v: 0
			},
			{
				id: "expensive",
				label: "Coûteux",
				v: 0
			},
			{
				id: "rare",
				label: "Avec des objets rares que je veux préserver",
				v: 0
			}
		]
	},
	{
		id: "tolerance",
		sectionId: "extract",
		prompt: "Si tu perds cet équipement, qu'est-ce que ça représente ?",
		axis: "gear",
		weight: 0,
		show: always,
		options: [
			{
				id: "fine",
				label: "Je peux le reperdre",
				v: 0
			},
			{
				id: "annoying",
				label: "Agacant, mais remplaçable",
				v: 0
			},
			{
				id: "painful",
				label: "Douloureux",
				v: 0
			},
			{
				id: "refuse",
				label: "Je refuse de risquer ces objets",
				v: 0
			}
		]
	}
];
var FORMULA = {
	INIT_SCALE: 300,
	PRESSURE_LIFT: 120,
	INTENSITY_AMP: .28,
	PEAK_BLEND: .42,
	SOFT_ONLY_DAMP: .5
};
var SAMPLE = {
	g1: .3,
	g2: .5,
	g3: .67,
	g4: .82,
	g5: .92,
	g6: .97
};
var NOT_SCORED = [
	"Micro, émotes, salutations, négociations et extraction partagée : portrait, pas un bonus.",
	"Valeur de l'équipement et peur de le perdre : conseil de sortie seulement. Le loadout ne pilote pas le matchmaking, dixit Embark.",
	"Réussite ou échec brut de l'extraction : hors calcul, un wipe peut venir des ARC.",
	"Riposte après dégâts subis, fuite, escouade touchée en premier : posture défensive, pas une initiation."
];
function questionById(id) {
	return QUESTIONS.find((q) => q.id === id);
}
function chosenOption(id, answers) {
	const q = questionById(id);
	const picked = answers[id];
	if (!q || !picked) return void 0;
	return q.options.find((o) => o.id === picked);
}
function visibleQuestions(answers) {
	return QUESTIONS.filter((q) => q.show(answers));
}
function weightedMean(items) {
	let w = 0;
	let s = 0;
	for (const it of items) {
		w += it.w;
		s += it.w * it.v;
	}
	if (w <= 0) return null;
	return s / w;
}
function itemsFor(axis, answers) {
	const out = [];
	for (const q of QUESTIONS) {
		if (q.axis !== axis || !q.show(answers) || q.weight <= 0) continue;
		const opt = chosenOption(q.id, answers);
		if (!opt || opt.v == null) continue;
		out.push({
			id: q.id,
			label: q.factor ?? q.prompt,
			w: q.weight,
			v: opt.v,
			hard: Boolean(q.peak)
		});
	}
	return out;
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function categoryFor(score) {
	if (score >= 300) return {
		id: "pvp",
		name: "Raider PvP",
		blurb: "Sommet symbolique de l'échelle : un profil extrêmement orienté PvP d'après tes réponses. Pas un classement officiel."
	};
	if (score >= 230) return {
		id: "very",
		name: "Raider en lobbys très PvP",
		blurb: "L'échantillon décrit une forte orientation combat, ou une pression qui ne laisse plus beaucoup de calme."
	};
	if (score >= 180) return {
		id: "near",
		name: "Raider proche des lobbys PvP",
		blurb: "Le combat joueur pèse lourd dans ce que tu décris. La similitude de style rend ce genre de lobby plus probable, sans le garantir."
	};
	if (score >= 130) return {
		id: "watch",
		name: "Raider en vigilance",
		blurb: "Zone mixte. Assez de friction pour sortir prudent, pas assez pour coller une étiquette unique."
	};
	if (score >= 80) return {
		id: "defend",
		name: "Raider qui se défend",
		blurb: "L'indice monte surtout parce que les rencontres chauffent, ou parce qu'un geste offensif ponctuel existe déjà."
	};
	if (score >= 35) return {
		id: "coop",
		name: "Raider coopératif",
		blurb: "Tu décris un style plutôt ouvert, avec assez de contact pour ne pas parler d'une carte vide."
	};
	return {
		id: "clear",
		name: "Raider sans problèmes",
		blurb: "Peu d'initiation, peu de pression rapportée. Ça ne promet pas un lobby sans danger."
	};
}
function formatLabel(answers) {
	if (answers.format === "duo") return "Duo";
	if (answers.format === "trio") return "Trio";
	if (answers.format === "solo") return "Solo";
	return "Format non précisé";
}
function gamesLabel(answers) {
	return chosenOption("recentGames", answers)?.label ?? "échantillon non précisé";
}
function confidenceOf(answers, visible) {
	const sample = SAMPLE[answers.recentGames] ?? .45;
	const memory = chosenOption("memory", answers)?.v ?? .7;
	const purity = chosenOption("sameFormat", answers)?.v ?? .8;
	const unknownLabels = [];
	let unknownN = 0;
	let knownN = 0;
	for (const q of visible) {
		if (q.axis !== "initiation" && q.axis !== "pressure" && q.axis !== "defense" && q.axis !== "intensity") continue;
		const opt = chosenOption(q.id, answers);
		if (!opt) continue;
		if (opt.v == null) {
			unknownN += 1;
			unknownLabels.push(q.factor ?? q.prompt);
		} else knownN += 1;
	}
	const chrono = 1 - .5 * (unknownN / Math.max(1, unknownN + knownN));
	let value = clamp(sample * (memory ?? .7) * (purity ?? .8) * chrono, .08, .98);
	if (visible.filter((q) => answers[q.id]).length < 8) value = Math.min(value, .42);
	return {
		value,
		label: value < .4 ? "faible" : value < .62 ? "moyenne" : value < .82 ? "élevée" : "très élevée",
		unknownLabels
	};
}
function gearAdvice(input) {
	const { score, confidence, heat, agg, defenderVerdict, trendId, answers } = input;
	const kit = answers.kit;
	const tolerance = answers.tolerance;
	const lines = [];
	const risky = kit === "rare" || kit === "expensive" || tolerance === "painful" || tolerance === "refuse";
	if (confidence < .48 && score >= 130) lines.push("Ton indice est élevé, mais les données sont insuffisantes pour conclure à une tendance durable. Continue à observer les prochaines parties.");
	else if (defenderVerdict && heat >= .55) {
		lines.push("Ton Raider semble avoir subi plusieurs rencontres hostiles. Privilégie un équipement standard pendant quelques parties et réévalue la situation.");
		lines.push("Ton Raider s'est surtout défendu. Rien ne permet de conclure qu'il a volontairement initié les combats.");
	} else if (defenderVerdict) {
		lines.push("Ton Raider s'est surtout défendu. Rien ne permet de conclure qu'il a volontairement initié les combats.");
		lines.push("Tu peux envisager ton équipement habituel, tout en gardant à l'esprit qu'aucun score ne garantit un lobby PvE.");
	} else if (score >= 180 || heat >= .72) lines.push("Ton historique récent indique une forte pression PvP. Sors avec un équipement remplaçable et conserve tes objets rares si leur perte serait difficile à accepter.");
	else if (score < 35 && heat < .35) lines.push("Ton Raider semble évoluer dans un contexte calme. Tu peux envisager ton équipement habituel, tout en gardant à l'esprit qu'aucun score ne garantit un lobby PvE.");
	else if (trendId === "hotter") lines.push("La tendance que tu décris est plus agressive. Le temps d'y voir plus clair, évite les objets dont la perte serait dure à accepter.");
	else if (risky && score >= 100) lines.push("L'indice n'est pas extrême, mais tu envisages du matériel que tu tiens à garder. Une alternative remplaçable est plus raisonnable tant que la lecture n'est pas plus stable.");
	else lines.push("Profil intermédiaire sur ce format. L'équipement standard reste le compromis le plus sain : de quoi te défendre, sans miser ce que tu ne veux pas perdre.");
	if (trendId === "calmer" && agg < .25 && confidence >= .6 && score < 130) lines.push("La tendance récente te semble plus calme. Tu peux envisager un peu plus de risque, sans prendre cela pour un retour garanti à des lobbys pacifiques.");
	if (risky && score < 80 && heat < .45 && !lines.some((l) => l.includes("objets rares"))) lines.push("Tu tiens à cet équipement. Même une lecture basse n'est pas une assurance : garde une alternative si la partie compte vraiment.");
	if ((kit === "cheap" || tolerance === "fine") && (score >= 180 || heat >= .72)) lines.push("Tu envisages déjà du matériel que tu acceptes de perdre : c'est cohérent avec cette lecture.");
	return lines.join(" ");
}
function synthesisOf(input) {
	const { answers, defenderVerdict, defenderUncertain, agg, heat, confidence, trendId } = input;
	const parts = [];
	parts.push(`Lecture limitée au ${formatLabel(answers).toLowerCase()}, sur ${gamesLabel(answers).toLowerCase()}.`);
	if (defenderVerdict) {
		parts.push("Tu décris des attaques subies et peu ou pas d'initiation. Le verdict contextuel s'applique : Raider en lobby PvE s'étant défendu. La riposte n'est pas comptée comme une mise en chasse.");
		if (heat >= .6) parts.push("La pression hostile observée reste élevée. Ce verdict parle de ton comportement, pas d'un lobby garanti sans danger.");
	} else if (defenderUncertain) parts.push("Tu décris surtout des attaques subies, mais la chronologie est trop incomplète pour affirmer que tu n'as rien initié.");
	else if (agg >= .66) parts.push("Tes réponses décrivent un Raider qui engage souvent : premier tir, premier dégât, poursuite ou third-party. C'est surtout ça qui tire l'indice.");
	else if (agg >= .35) parts.push("Le profil est mixte : une part des contacts vient de toi, une autre des situations subies.");
	else if (heat >= .55) parts.push("Tu inities peu, mais les rencontres récentes sont souvent hostiles. L'indice monte à cause de la pression observée, pas pour te traiter comme l'agresseur.");
	else parts.push("Les rencontres décrites restent plutôt calmes, et tu engages peu le combat.");
	if (trendId === "hotter") parts.push("Tu signales en plus une tendance récente plus agressive.");
	if (trendId === "calmer") parts.push("Tu signales une tendance récente plus calme.");
	const greet = answers.greet;
	const deesc = answers.deesc;
	if (greet === "often" || deesc === "often") parts.push("Côté contact, tu décris des tentatives de salut ou de désescalade. Ça éclaire le style, ça ne baisse pas un score Embark.");
	if (answers.reactPeace === "shoot") parts.push("Tirer sur un Raider qui semble pacifique est traité comme une initiation, pas comme un détail social.");
	if (confidence < .48) parts.push("La confiance est limitée : échantillon court, souvenirs flous, formats mélangés ou chronologie inconnue. Ne lis pas cet indice comme une tendance installée.");
	return parts.join(" ");
}
function evaluate(answers) {
	const visible = visibleQuestions(answers);
	const complete = visible.every((q) => Boolean(answers[q.id]));
	const unlocked = Boolean(answers.format && answers.recentGames && answers.encounterRate);
	const initItems = itemsFor("initiation", answers);
	const pressItems = itemsFor("pressure", answers);
	const defItems = itemsFor("defense", answers);
	const intItems = itemsFor("intensity", answers);
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
	const escIds = [
		"thirdParty",
		"chase",
		"noProof",
		"pursuedAfter",
		"overstay",
		"reactPeace",
		"reactAim",
		"engagedAnyway"
	];
	const escItems = initItems.filter((i) => escIds.includes(i.id));
	const escMean = weightedMean(escItems);
	const escPeak = escItems.length ? Math.max(...escItems.map((i) => i.v)) : 0;
	const escLow = (escMean == null || escMean <= .28) && escPeak <= .35;
	const initLow = mean != null && signal <= .18;
	const shots = chosenOption("shotsReceived", answers)?.v;
	const ambush = chosenOption("ambush", answers)?.v;
	const tone = chosenOption("tone", answers)?.v;
	const hit = chosenOption("hitFirst", answers)?.v;
	const squad = chosenOption("squadFirst", answers)?.v;
	const attacked = shots != null && shots >= .22 || ambush != null && ambush >= .3 || tone != null && tone >= .5 || hit != null && hit >= .75 || squad != null && squad >= .75;
	const survive = chosenOption("surviveOnly", answers);
	const notSeeking = !survive || survive.v == null || survive.v >= .6;
	const aggressiveSocial = answers.reactPeace === "shoot" || answers.reactAim === "shoot";
	const chronoUnknown = [
		"firstShot",
		"firstDamage",
		"hitFirst"
	].some((id) => {
		const opt = chosenOption(id, answers);
		return Boolean(opt && opt.v == null && opt.id === "unknown");
	});
	const onCombat = combatPath(answers);
	const defenderVerdict = Boolean(onCombat && attacked && initLow && escLow && notSeeking && !chronoUnknown && !aggressiveSocial && complete);
	const defenderUncertain = Boolean(onCombat && attacked && initLow && chronoUnknown && !aggressiveSocial);
	const conf = confidenceOf(answers, visible);
	const spread = Math.round((1 - conf.value) * 58);
	const trendId = answers.trend ?? null;
	const factorsRaw = [];
	const initW = initItems.reduce((s, i) => s + i.w, 0);
	const pressW = pressItems.reduce((s, i) => s + i.w, 0);
	const amp = 1 + FORMULA.INTENSITY_AMP * (intensity ?? 0);
	for (const it of initItems) factorsRaw.push({
		label: it.label,
		points: initW > 0 ? it.w / initW * it.v * amp * FORMULA.INIT_SCALE : 0
	});
	for (const it of pressItems) factorsRaw.push({
		label: it.label,
		points: pressW > 0 ? it.w / pressW * it.v * (1 - agg) * FORMULA.PRESSURE_LIFT : 0
	});
	const sumPts = factorsRaw.reduce((s, f) => s + f.points, 0);
	const scale = sumPts > 0 ? score / sumPts : 1;
	const factors = factorsRaw.map((f) => ({
		label: f.label,
		points: Math.round(f.points * scale)
	})).filter((f) => f.points > 0).sort((a, b) => b.points - a.points).slice(0, 5);
	const uncertainties = ["Ce Psycho-Pass n'est pas le score interne d'Embark. Aucun seuil officiel n'a été publié, et la similarité de style n'est jamais garantie."];
	if ((SAMPLE[answers.recentGames] ?? 1) < .5) uncertainties.push("Très peu de parties : une série courte peut être un hasard, pas une tendance.");
	if (answers.memory === "vague") uncertainties.push("Souvenirs flous : la chronologie fine (qui a tiré, qui a blessé) est la première chose à perdre.");
	if (answers.sameFormat === "mixed") uncertainties.push("Historiques de solo, duo et trio mélangés. Embark les sépare ; cette lecture est moins fiable.");
	else if (answers.sameFormat === "mostly") uncertainties.push("Quelques parties d'un autre format se sont glissées dans l'échantillon.");
	for (const label of conf.unknownLabels) uncertainties.push(`Réponse exclue faute de certitude : ${label}.`);
	if (answers.damageAmt === "unknown") uncertainties.push("Volume de dégâts inconnu : l'intensité du combat reste approximative.");
	if (defenderUncertain) uncertainties.push("Verdict défensif retenu : tu sembles avoir subi, mais l'ordre des coups n'est pas établi.");
	uncertainties.push("Le test 1.39.0 (défense à poids nul) a été annoncé comme un test. On s'en inspire, on ne le fige pas comme une règle éternelle.");
	uncertainties.push("Le toggle PvE testé du 13 au 20 octobre 2026 ne doit pas être mélangé à cet échantillon : Embark indiquait qu'il ne modifiait pas le rating PvPvE, et qu'il serait retiré à la fin du test.");
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
		gamesLabel: gamesLabel(answers),
		trendId,
		factors,
		uncertainties,
		ignored: NOT_SCORED,
		complete
	};
	const synthesis = synthesisOf({
		answers,
		defenderVerdict: readingBase.defenderVerdict,
		defenderUncertain: readingBase.defenderUncertain,
		agg,
		heat,
		confidence: conf.value,
		trendId
	});
	const gear = gearAdvice({
		score: readingBase.score,
		confidence: conf.value,
		heat,
		agg,
		defenderVerdict: readingBase.defenderVerdict,
		trendId,
		answers
	});
	const protocol = `Protocole expérimental : observe encore ${conf.value >= .8 ? "5 à 8" : conf.value >= .55 ? "8 à 12" : "10 à 15"} parties en ${formatLabel(answers).toLowerCase()} avant de réévaluer. Note qui inflige le premier dégât, qui commence le combat, et si tu n'as fait que riposter. Ce n'est pas un délai officiel de retour vers des lobbys calmes — Embark n'en publie pas, et décrit seulement un glissement graduel.`;
	return {
		...readingBase,
		synthesis,
		gear,
		protocol
	};
}
function discordReport(r) {
	const lines = [
		"RAIDER PSYCHO-PASS — profil général",
		"Indicateur communautaire expérimental. Ce n'est pas le score interne d'Embark.",
		"",
		`Psycho-Pass : ${String(r.score).padStart(3, "0")} / 300`,
		`Catégorie : ${r.category.name}`
	];
	if (r.defenderVerdict) lines.push("Verdict : Raider en lobby PvE s'étant défendu");
	else if (r.defenderUncertain) lines.push("Verdict défensif : incertain (chronologie incomplète)");
	lines.push(`Format évalué : ${r.formatLabel}`, `Confiance : ${r.confidenceLabel} (${r.confidence.toFixed(2).replace(".", ",")}) · fourchette de lecture ${r.low}–${r.high}`, `Parties observées : ${r.gamesLabel}`, "", `Initiation volontaire : ${r.initiation}/100`, `Pression hostile subie : ${r.pressure}/100`, `Posture défensive : ${r.defense == null ? "non établie" : `${r.defense}/100`}`, "", "Synthèse", r.synthesis, "", "Facteurs les plus contributifs");
	if (r.factors.length === 0) lines.push("• Aucun facteur notable : l'indice reste bas.");
	else for (const f of r.factors) lines.push(`• ${f.label} (~${f.points} pts)`);
	lines.push("", "Incertitudes");
	for (const u of r.uncertainties) lines.push(`• ${u}`);
	lines.push("", "Hors calcul", ...r.ignored.map((i) => `• ${i}`), "", "Conseil d'équipement", r.gear, "", "Protocole", r.protocol);
	return lines.join("\n");
}
var TRANSPARENCY = [
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
			"Un toggle PvE a été testé du 13 au 20 octobre 2026, avec zéro dégât joueur sur ces serveurs, et sans modifier le rating PvPvE. Le studio prévoyait de retirer le toggle à la fin du test. Aucun résultat officiel post-test n'est codé ici."
		]
	},
	{
		id: "community",
		title: "Observations communautaires",
		items: ["Les joueurs décrivent des séries plus calmes ou plus chaudes, des third-parties, des attaques à l'ascenseur, des pièges. Ce sont des récits de raid, pas une télémétrie.", "La distribution « environ un tiers plutôt PvP » citée dans la presse au moment du projet de toggle est un portrait de population, pas un score personnel. Elle n'entre pas dans la formule."]
	},
	{
		id: "model",
		title: "Hypothèses de ce modèle",
		items: [
			"Trois lectures séparées : initiation volontaire, pression subie, posture défensive.",
			"L'initiation peut porter toute l'échelle jusqu'à 300. La pression ajoute jusqu'à 120 points, et seulement dans la part du score qui n'est pas déjà de l'initiation.",
			"Le pic du geste le plus offensif compte autant que la moyenne, pour qu'un comportement clair ne soit pas noyé.",
			"L'intensité amplifie l'initiation (coefficient 0,28), pas la défense.",
			"La confiance dépend du nombre de parties, de la netteté des souvenirs, de la pureté du format et des « je ne sais pas ». Elle élargit la fourchette. Elle ne tire pas le score vers le milieu.",
			"Aucun bonus micro, émote ou extraction pacifique. Aucun malus de loadout."
		]
	},
	{
		id: "play",
		title: "Choix ludiques",
		items: ["L'échelle 0–300, les noms de catégories et le mot Psycho-Pass sont un hommage à la série, pas un système Sibyl et pas un outil Embark.", "Le 300 est un sommet symbolique : le profil le plus orienté PvP que tes réponses permettent de décrire."]
	}
];
var SOURCES = [
	{
		label: "Notes on the Matchmaking System — Embark, 20 mai 2026",
		href: "https://arcraiders.com/news/notes-on-the-matchmaking-system"
	},
	{
		label: "Test du toggle PvE — Embark, 24 septembre 2026",
		href: "https://arcraiders.com/news/pve-toggle-beta-test"
	},
	{
		label: "Règles du test PvE — Embark, 12 octobre 2026",
		href: "https://arcraiders.com/news/pve-toggle-what-to-know"
	},
	{
		label: "Live Update 1.39.0 — centre d'aide Embark",
		href: "https://id.embark.games/arc-raiders/support/faq/269-live-update-1-39-0"
	}
];
var STORAGE_KEY = "raider-psycho-pass-general-v1";
function cx(...parts) {
	return parts.filter(Boolean).join(" ");
}
function toneText(score) {
	if (score >= 180) return "text-hot";
	if (score >= 80) return "text-watch";
	return "text-cyan";
}
function toneFill(score) {
	if (score >= 180) return "bg-hot";
	if (score >= 80) return "bg-watch";
	return "bg-cyan";
}
function Gauge({ reading, compact }) {
	const score = reading.unlocked ? reading.score : null;
	const pct = score == null ? 0 : score / 300 * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cx("min-w-0", compact && "w-40 sm:w-56"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-widest text-muted",
					children: "Psycho-Pass"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cx("font-display leading-none", compact ? "text-2xl" : "text-5xl", score == null ? "text-muted" : toneText(score)),
					children: score == null ? "···" : String(score).padStart(3, "0")
				})] }), !compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "max-w-40 text-right text-sm text-muted",
					children: [reading.provisional ? "Lecture provisoire" : "sur 300", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-fg",
						children: reading.unlocked ? reading.category.name : "En attente"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-2 overflow-hidden rounded-full bg-raised",
				role: "meter",
				"aria-valuemin": 0,
				"aria-valuemax": 300,
				"aria-valuenow": score ?? 0,
				"aria-label": "Psycho-Pass sur 300",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cx("h-full rounded-full", score == null ? "bg-line" : toneFill(score)),
					style: { width: `${pct}%` }
				})
			}),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex justify-between text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "300" })]
			})
		]
	});
}
function Axis({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-line bg-canvas p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl text-cyan",
					children: value == null ? "—" : value
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-1.5 overflow-hidden rounded-full bg-raised",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-cyan",
					style: { width: `${value == null ? 0 : value}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: hint
			})
		]
	});
}
function PsychoPassApp() {
	const [screen, setScreen] = (0, import_react.useState)("home");
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [cursorId, setCursorId] = (0, import_react.useState)("format");
	const [soon, setSoon] = (0, import_react.useState)(false);
	const [copyState, setCopyState] = (0, import_react.useState)("idle");
	const [fallback, setFallback] = (0, import_react.useState)("");
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const saved = JSON.parse(raw);
				if (saved.answers && typeof saved.answers === "object") setAnswers(saved.answers);
				if (saved.screen === "home" || saved.screen === "quiz" || saved.screen === "report") setScreen(saved.screen);
				if (typeof saved.cursorId === "string") setCursorId(saved.cursorId);
			}
		} catch {}
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify({
			screen,
			answers,
			cursorId
		}));
	}, [
		screen,
		answers,
		cursorId,
		hydrated
	]);
	const visible = (0, import_react.useMemo)(() => visibleQuestions(answers), [answers]);
	const reading = (0, import_react.useMemo)(() => evaluate(answers), [answers]);
	const current = visible.find((q) => q.id === cursorId) ?? visible[0];
	const index = Math.max(0, visible.findIndex((q) => q.id === current?.id));
	const section = SECTIONS.find((s) => s.id === current?.sectionId);
	(0, import_react.useEffect)(() => {
		if (screen !== "quiz") return;
		if (!visible.some((q) => q.id === cursorId) && visible[0]) setCursorId(visible[0].id);
	}, [
		visible,
		cursorId,
		screen
	]);
	(0, import_react.useEffect)(() => {
		if (screen === "report" && !reading.complete) setScreen("quiz");
	}, [screen, reading.complete]);
	(0, import_react.useEffect)(() => {
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		document.getElementById("top")?.scrollIntoView({
			behavior: reduce ? "auto" : "smooth",
			block: "start"
		});
	}, [screen, cursorId]);
	function select(questionId, optionId) {
		setAnswers((prev) => ({
			...prev,
			[questionId]: optionId
		}));
		setCopyState("idle");
	}
	function goNext() {
		if (!current || !answers[current.id]) return;
		if (index >= visible.length - 1) setScreen("report");
		else setCursorId(visible[index + 1].id);
	}
	function goBack() {
		if (index <= 0) setScreen("home");
		else setCursorId(visible[index - 1].id);
	}
	function restart() {
		setAnswers({});
		setCursorId("format");
		setScreen("home");
		setSoon(false);
		setCopyState("idle");
		setFallback("");
		localStorage.removeItem(STORAGE_KEY);
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
	const hasDraft = Object.keys(answers).length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "top",
		className: "min-h-dvh bg-canvas text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-line",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setScreen("home"),
					className: "min-h-11 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-sm tracking-widest text-cyan",
						children: "RAIDER PSYCHO-PASS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-xs text-muted",
						children: "Terminal d'analyse · pas un score Embark"
					})]
				}), screen !== "home" && reading.unlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, {
					reading,
					compact: true
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid w-full max-w-5xl gap-6 px-4 py-6 lg:grid-cols-4 lg:px-6 lg:py-8",
			children: [screen !== "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "min-w-0 lg:col-span-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "flex max-w-full gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible",
					children: SECTIONS.map((s) => {
						const qs = visible.filter((q) => q.sectionId === s.id);
						if (qs.length === 0) return null;
						const done = qs.every((q) => answers[q.id]);
						const active = current?.sectionId === s.id && screen === "quiz";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								const firstMissing = visible.find((q) => !answers[q.id]);
								const target = qs.find((q) => !answers[q.id]) ?? qs[0];
								const targetIndex = visible.findIndex((q) => q.id === target.id);
								const frontier = firstMissing ? visible.findIndex((q) => q.id === firstMissing.id) : visible.length;
								setCursorId(targetIndex > frontier ? firstMissing.id : target.id);
								setScreen("quiz");
							},
							className: cx("flex min-h-11 w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm", active ? "border-cyan bg-surface text-fg" : "border-transparent text-muted"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xs text-cyan",
									children: s.index
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "whitespace-nowrap",
									children: s.title
								}),
								done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
									className: "ml-auto size-4 shrink-0 text-cyan",
									"aria-hidden": true
								})
							]
						}) }, s.id);
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cx("min-w-0", screen === "home" ? "lg:col-span-4" : "lg:col-span-3"),
				children: [
					screen === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Home$1, {
						hasDraft,
						soon,
						onSoon: () => setSoon((v) => !v),
						onStart: () => {
							setCursorId(visible[0]?.id ?? "format");
							setScreen("quiz");
						},
						onResume: () => setScreen(reading.complete ? "report" : "quiz"),
						onRestart: restart
					}),
					screen === "quiz" && current && section && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						"aria-labelledby": "q-title",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-cyan",
										children: section.index
									}),
									" ",
									section.title
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Question ",
									index + 1,
									" / ",
									visible.length
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-1 overflow-hidden rounded-full bg-raised",
								"aria-hidden": true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-cyan",
									style: { width: `${(index + 1) / visible.length * 100}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { reading }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted",
									children: "L'indice bouge avec tes réponses. Il ne lit pas les serveurs du jeu."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								id: "q-title",
								className: "mt-8 font-display text-2xl leading-snug text-fg sm:text-3xl",
								children: current.prompt
							}),
							current.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
								children: current.note
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 grid gap-3",
								role: "group",
								"aria-label": "Réponses",
								children: current.options.map((opt) => {
									const selected = answers[current.id] === opt.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": selected,
										onClick: () => select(current.id, opt.id),
										className: cx("min-h-11 rounded-xl border px-4 py-3 text-left transition-colors", selected ? "border-cyan bg-surface" : "border-line bg-canvas hover:border-cyan"),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cx("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border", selected ? "border-cyan bg-cyan text-canvas" : "border-line"),
												"aria-hidden": true,
												children: selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-base text-fg",
												children: opt.label
											}), opt.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 block text-sm text-muted",
												children: opt.detail
											})] })]
										})
									}, opt.id);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: goBack,
									className: "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-line px-4 text-sm text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
										className: "size-4",
										"aria-hidden": true
									}), index === 0 ? "Accueil" : "Retour"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: goNext,
									disabled: !answers[current.id],
									className: "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan px-4 text-sm font-semibold text-canvas disabled:opacity-40",
									children: [index >= visible.length - 1 ? "Voir le rapport" : "Continuer", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
										className: "size-4",
										"aria-hidden": true
									})]
								})]
							})
						]
					}),
					screen === "report" && reading.complete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Report, {
						reading,
						copyState,
						fallback,
						onCopy: () => void copyReport(),
						onEdit: () => {
							setCursorId(visible[0]?.id ?? "format");
							setScreen("quiz");
						},
						onRestart: restart
					})
				]
			})]
		})]
	});
}
function Home$1({ hasDraft, soon, onSoon, onStart, onResume, onRestart }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xs tracking-widest text-cyan",
			children: "MODULE 01 · PROFIL GÉNÉRAL"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-3 max-w-3xl font-display text-4xl leading-tight text-fg sm:text-5xl",
			children: "RAIDER PSYCHO-PASS"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 max-w-2xl text-lg leading-relaxed text-fg",
			children: "Calcule le Psycho-Pass de ton Raider en temps réel."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-2xl text-base leading-relaxed text-muted",
			children: "Un indicateur sur 300 pour estimer, à partir de tes propres parties, si tu peux sortir avec ton équipement habituel, s'il vaut mieux rester prudent, ou si tu traverses une série plus agressive."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-col gap-3 sm:flex-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onStart,
					className: "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan px-5 font-semibold text-canvas",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, {
						className: "size-4",
						"aria-hidden": true
					}), hasDraft ? "Reprendre au début des questions" : "Commencer le questionnaire"]
				}),
				hasDraft && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onResume,
					className: "inline-flex min-h-12 items-center justify-center rounded-xl border border-line px-5 text-fg",
					children: "Continuer là où j'en étais"
				}),
				hasDraft && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onRestart,
					className: "inline-flex min-h-12 items-center justify-center px-3 text-sm text-muted",
					children: "Effacer"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 max-w-2xl rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted",
			children: "Le matchmaking d'ARC Raiders n'est pas public dans le détail. Ce terminal ne prétend pas connaître le score interne d'Embark. C'est un outil communautaire expérimental."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-3 sm:grid-cols-2",
			children: MODULES.map((mod) => mod.ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border border-cyan bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs tracking-widest text-cyan",
						children: mod.index
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-xl text-fg",
						children: mod.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: mod.text
					})
				]
			}, mod.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl border border-line bg-canvas p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xs tracking-widest text-muted",
							children: mod.index
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
							className: "size-4 text-muted",
							"aria-hidden": true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-xl text-fg",
						children: "Dernière partie"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: mod.text
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onSoon,
						className: "mt-3 min-h-11 text-sm text-cyan",
						children: soon ? "Fermer" : "Voir ce que le module couvrira"
					})
				]
			}, mod.id))
		}),
		soon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-muted",
			children: [
				"Le second module reprendra la même échelle, mais sur un seul raid : ordre du premier tir, du premier dégât, arrivée en third-party, fuite, poursuite, et ce qui se passe à l'ascenseur. Le code garde déjà l'identifiant ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: "last-raid"
				}),
				" pour ne pas mélanger ce profil général avec une partie isolée."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-8 grid gap-3 sm:grid-cols-3",
			children: [
				[
					"01",
					"Un format",
					"Solo, duo ou trio. Les trois historiques ne se compensent pas."
				],
				[
					"02",
					"Tes souvenirs",
					"Rencontres, qui commence, qui encaisse, comment ça se termine."
				],
				[
					"03",
					"Une lecture",
					"Score, confiance, pression subie, et un conseil d'équipement partageable."
				]
			].map(([n, t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl border border-line p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-cyan",
						children: n
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-semibold text-fg",
						children: t
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-muted",
						children: d
					})
				]
			}, n))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transparency, {})
	] });
}
function Report({ reading, copyState, fallback, onCopy, onEdit, onRestart }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-display text-xs tracking-widest text-cyan",
			children: ["RAPPORT · ", reading.formatLabel.toUpperCase()]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-3 font-display text-3xl leading-tight text-fg sm:text-4xl",
			children: reading.category.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-2xl text-base leading-relaxed text-muted",
			children: reading.category.blurb
		}),
		reading.defenderVerdict && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 flex gap-3 rounded-xl border border-cyan bg-surface px-4 py-3 text-sm leading-relaxed text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {
				className: "mt-0.5 size-4 shrink-0 text-cyan",
				"aria-hidden": true
			}), "Verdict contextuel : Raider en lobby PvE s'étant défendu. Il peut coexister avec un indice modéré ou élevé : il décrit ton comportement, pas une promesse de lobby calme."]
		}),
		reading.defenderUncertain && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 flex gap-3 rounded-xl border border-watch bg-surface px-4 py-3 text-sm leading-relaxed text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
				className: "mt-0.5 size-4 shrink-0 text-watch",
				"aria-hidden": true
			}), "Tu sembles avoir surtout subi, mais la chronologie est trop trouée pour le verdict défensif."]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-xl border border-line bg-surface p-4 sm:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { reading }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					"Fourchette de lecture ",
					reading.low,
					"–",
					reading.high,
					". Plus elle est large, moins il faut figer une habitude de sortie dessus. Ce n'est pas une marge d'erreur Embark."
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Axis, {
					label: "Initiation",
					value: reading.initiation,
					hint: "Combats que tu choisis de commencer."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Axis, {
					label: "Pression subie",
					value: reading.pressure,
					hint: "Hostilité rencontrée, pas ton rôle."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Axis, {
					label: "Posture défensive",
					value: reading.defense,
					hint: "Hors du score d'initiation."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-fg",
				children: "Synthèse"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-base leading-relaxed text-fg",
				children: reading.synthesis
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-6 grid gap-3 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-line p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs uppercase tracking-widest text-muted",
						children: "Confiance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-2 font-display text-2xl text-fg",
						children: reading.confidenceLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "mt-1 text-sm text-muted",
						children: [
							reading.gamesLabel,
							" · ",
							reading.formatLabel
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-line p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-xs uppercase tracking-widest text-muted",
					children: "Ce qui pèse le plus"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-2",
					children: reading.factors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Aucun facteur fort. L'indice reste bas."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: reading.factors.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline justify-between gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: f.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-cyan",
								children: ["+", f.points]
							})]
						}, f.label))
					})
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 rounded-xl border border-watch bg-surface p-4 sm:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg text-watch",
				children: "Conseil pour le prochain raid"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-base leading-relaxed text-fg",
				children: reading.gear
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-3 rounded-xl border border-line p-4 sm:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg text-fg",
				children: "Protocole d'observation"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: reading.protocol
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-fg",
				children: "Incertitudes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: reading.uncertainties.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm leading-relaxed text-muted",
					children: u
				}, u))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-fg",
				children: "Hors calcul"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: reading.ignored.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm leading-relaxed text-muted",
					children: u
				}, u))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 flex flex-col gap-3 sm:flex-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onCopy,
					className: "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan px-5 font-semibold text-canvas",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
						className: "size-4",
						"aria-hidden": true
					}), copyState === "ok" ? "Rapport copié" : "Copier pour Discord"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onEdit,
					className: "inline-flex min-h-12 items-center justify-center rounded-xl border border-line px-5 text-fg",
					children: "Modifier les réponses"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onRestart,
					className: "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line px-5 text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
						className: "size-4",
						"aria-hidden": true
					}), "Recommencer"]
				})
			]
		}),
		copyState === "fallback" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-watch",
				children: "La copie automatique est bloquée. Sélectionne le texte ci-dessous."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				readOnly: true,
				value: fallback,
				className: "mt-2 h-64 w-full rounded-xl border border-line bg-canvas p-3 text-sm text-fg"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-6 text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "text-cyan underline",
				href: "/raider_psycho_pass_general.html",
				download: true,
				children: "Télécharger le terminal HTML autonome"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: " — un seul fichier, ouvrable sans installation, partageable tel quel." })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transparency, {})
	] });
}
function Transparency() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10 border-t border-line pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-fg",
				children: "Ce qui est su, supposé, ou seulement ludique"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3",
				children: TRANSPARENCY.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "rounded-xl border border-line bg-surface px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "min-h-11 cursor-pointer font-semibold text-fg",
						children: block.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2 pb-2",
						children: block.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm leading-relaxed text-muted",
							children: item
						}, item))
					})]
				}, block.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: SOURCES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "text-sm text-cyan underline",
					href: s.href,
					target: "_blank",
					rel: "noreferrer",
					children: s.label
				}) }, s.href))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-xs leading-relaxed text-muted",
				children: [QUESTIONS.length, " questions au plus, moins si tes réponses en ferment. Aucune donnée n'est envoyée : les réponses restent dans ce navigateur."]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PsychoPassApp, {});
}
//#endregion
export { Home as component };
