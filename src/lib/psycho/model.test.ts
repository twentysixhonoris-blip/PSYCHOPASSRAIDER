import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { categoryFor, discordReport, evaluate, type Answers } from "./model.ts";

function base(over: Answers = {}): Answers {
  return {
    format: "solo",
    recentGames: "g5",
    frequency: "regular",
    sameFormat: "pure",
    memory: "precise",
    encounterRate: "half",
    tone: "peaceful",
    shotsReceived: "never",
    ambush: "never",
    traps: "never",
    contactShape: "open",
    trend: "stable",
    firstShot: "never",
    firstDamage: "never",
    thirdParty: "never",
    chase: "never",
    noProof: "never",
    accidental: "none",
    hitFirst: "nofight",
    surviveOnly: "always",
    broke: "nofight",
    pursuedAfter: "noneutral",
    overstay: "never",
    mic: "often",
    greet: "often",
    emote: "sometimes",
    deesc: "often",
    shareExtract: "often",
    reactPeace: "leave",
    reactAim: "hold",
    duration: "none",
    involved: "none",
    damageAmt: "light",
    downs: "none",
    pursuitCount: "none",
    repeats: "never",
    extractResult: "calm",
    extractContest: "rare",
    elevator: "never",
    kit: "standard",
    tolerance: "annoying",
    ...over,
  };
}

describe("Psycho-Pass communautaire", () => {
  it("borne les catégories demandées", () => {
    assert.equal(categoryFor(0).name, "Raider sans problèmes");
    assert.equal(categoryFor(34).name, "Raider sans problèmes");
    assert.equal(categoryFor(35).name, "Raider coopératif");
    assert.equal(categoryFor(79).name, "Raider coopératif");
    assert.equal(categoryFor(80).name, "Raider qui se défend");
    assert.equal(categoryFor(129).name, "Raider qui se défend");
    assert.equal(categoryFor(130).name, "Raider en vigilance");
    assert.equal(categoryFor(179).name, "Raider en vigilance");
    assert.equal(categoryFor(180).name, "Raider proche des lobbys PvP");
    assert.equal(categoryFor(229).name, "Raider proche des lobbys PvP");
    assert.equal(categoryFor(230).name, "Raider en lobbys très PvP");
    assert.equal(categoryFor(299).name, "Raider en lobbys très PvP");
    assert.equal(categoryFor(300).name, "Raider PvP");
  });

  it("laisse un profil calme et documenté sous 35, avec une confiance haute", () => {
    const r = evaluate(base());
    assert.ok(r.score < 35, `score ${r.score}`);
    assert.equal(r.category.id, "clear");
    assert.equal(r.defenderVerdict, false);
    assert.ok(r.confidence >= 0.8, `conf ${r.confidence}`);
    assert.equal(r.complete, true);
  });

  it("ne traite pas un défenseur comme un initiateur, même sous pression", () => {
    const r = evaluate(
      base({
        recentGames: "g4",
        encounterRate: "most",
        tone: "hostile",
        shotsReceived: "often",
        ambush: "several",
        traps: "rare",
        trend: "hotter",
        hitFirst: "always",
        surviveOnly: "always",
        broke: "often",
        pursuedAfter: "never",
        overstay: "never",
        extractContest: "often",
        elevator: "several",
        duration: "mid",
        involved: "one",
        damageAmt: "mid",
        downs: "rare",
        repeats: "sometimes",
      }),
    );
    assert.ok(r.score >= 80 && r.score <= 129, `score ${r.score}`);
    assert.equal(r.defenderVerdict, true);
    assert.ok(r.initiation < 20, `init ${r.initiation}`);
    assert.ok(r.pressure >= 60, `pressure ${r.pressure}`);
    assert.match(r.gear, /surtout défendu|rencontres hostiles/);
  });

  it("envoie un profil qui cherche le combat vers le haut de l'échelle, jusqu'à 300", () => {
    const r = evaluate(
      base({
        encounterRate: "every",
        tone: "hostile",
        shotsReceived: "always",
        ambush: "frequent",
        traps: "frequent",
        trend: "hotter",
        firstShot: "always",
        firstDamage: "always",
        thirdParty: "often",
        chase: "often",
        noProof: "often",
        accidental: "none",
        hitFirst: "rarely",
        surviveOnly: "hunted",
        broke: "never",
        pursuedAfter: "often",
        overstay: "often",
        reactPeace: "shoot",
        reactAim: "shoot",
        duration: "long",
        involved: "chaos",
        damageAmt: "heavy",
        downs: "many",
        pursuitCount: "several",
        repeats: "often",
        extractResult: "contested",
        extractContest: "often",
        elevator: "frequent",
        kit: "rare",
        tolerance: "refuse",
      }),
    );
    assert.equal(r.score, 300);
    assert.equal(r.category.name, "Raider PvP");
    assert.equal(r.defenderVerdict, false);
    assert.match(r.gear, /équipement remplaçable/);
  });

  it("garde un indice haut même avec deux parties floues, mais baisse la confiance", () => {
    const hot = base({
      recentGames: "g1",
      memory: "vague",
      sameFormat: "mixed",
      firstShot: "often",
      firstDamage: "often",
      noProof: "often",
      thirdParty: "sometimes",
      tone: "threatening",
      shotsReceived: "often",
    });
    const r = evaluate(hot);
    assert.ok(r.score >= 130, `score ${r.score}`);
    assert.ok(r.confidence < 0.4, `conf ${r.confidence}`);
    assert.match(r.gear, /insuffisantes/);
  });

  it("ignore le micro, les émotes et la valeur du loadout", () => {
    const a = evaluate(base({ mic: "off", emote: "never", greet: "never", kit: "cheap", tolerance: "fine" }));
    const b = evaluate(base({ mic: "often", emote: "often", greet: "often", kit: "rare", tolerance: "refuse" }));
    assert.equal(a.score, b.score);
    assert.notEqual(a.gear, b.gear);
  });

  it("ne confond pas le premier tir avec le premier dégât", () => {
    const shots = evaluate(base({ firstShot: "always", firstDamage: "never" }));
    const both = evaluate(base({ firstShot: "always", firstDamage: "always" }));
    assert.ok(both.score > shots.score, `${both.score} vs ${shots.score}`);
    assert.ok(shots.initiation < 80, `init ${shots.initiation}`);
  });

  it("pèse un accident moins qu'une initiation assumée", () => {
    const accident = evaluate(
      base({
        firstShot: "unknown",
        firstDamage: "unknown",
        accidental: "frequent",
        hitFirst: "unknown",
      }),
    );
    const intentional = evaluate(base({ firstShot: "often", noProof: "often", reactPeace: "shoot" }));
    assert.ok(intentional.score - accident.score > 40, `${intentional.score} vs ${accident.score}`);
  });

  it("compte le third-party comme une initiation", () => {
    const calm = evaluate(base());
    const third = evaluate(base({ thirdParty: "often", duration: "long", downs: "several" }));
    assert.ok(third.score > calm.score + 30, `${third.score} vs ${calm.score}`);
    assert.equal(third.defenderVerdict, false);
  });

  it("ne donne pas le verdict défensif si la chronologie est inconnue", () => {
    const r = evaluate(
      base({
        tone: "hostile",
        shotsReceived: "often",
        firstShot: "unknown",
        firstDamage: "unknown",
        hitFirst: "unknown",
        trend: "hotter",
      }),
    );
    assert.equal(r.defenderVerdict, false);
    assert.equal(r.defenderUncertain, true);
  });

  it("sépare le solo du duo sans changer le score si les réponses de combat sont les mêmes", () => {
    const solo = evaluate(base({ format: "solo" }));
    const duo = evaluate(base({ format: "duo", squadFirst: "us" }));
    assert.equal(solo.score, duo.score);
    assert.equal(duo.formatLabel, "Duo");
  });

  it("atténue le third-party quand on défend quelqu'un, pas quand on loot", () => {
    const shared = { thirdParty: "often", duration: "long", downs: "several" };
    const hunt = evaluate(base(shared), "general");
    const cover = evaluate(base({ ...shared, thirdMotive: "coverStranger" }));
    const huntMotive = evaluate(base({ ...shared, thirdMotive: "hunt" }));
    assert.ok(huntMotive.score >= hunt.score - 5, `${huntMotive.score} vs ${hunt.score}`);
    assert.ok(hunt.score > cover.score + 20, `${hunt.score} vs ${cover.score}`);
    assert.ok(cover.initiation < hunt.initiation);
    assert.match(cover.intervention ?? "", /inconnu/);
    assert.equal(cover.defenderVerdict, false);
  });

  it("donne un Psycho-Pass, deux chances, et un nombre de parties chill", () => {
    const calm = evaluate(base());
    assert.equal(calm.chillGames, 0);
    assert.ok(calm.ratChance >= 0 && calm.ratChance <= 90);
    assert.ok(calm.pvpChance >= 0 && calm.pvpChance <= 90);
    assert.match(discordReport(calm), /Psycho-Pass/);
    assert.match(discordReport(calm), /rat/);
    assert.match(discordReport(calm), /joueur PvP/);
    assert.match(discordReport(calm), /Parties chill conseillées : 0/);

    const rats = evaluate(
      base({
        contactShape: "rats",
        ambush: "frequent",
        traps: "frequent",
        elevator: "frequent",
        extractContest: "often",
        tone: "mixed",
        shotsReceived: "rare",
      }),
    );
    const pvps = evaluate(
      base({
        contactShape: "pvp",
        ambush: "never",
        traps: "never",
        elevator: "never",
        tone: "hostile",
        shotsReceived: "often",
        extractContest: "rare",
      }),
    );
    assert.ok(rats.ratChance > rats.pvpChance, `rat ${rats.ratChance} pvp ${rats.pvpChance}`);
    assert.ok(pvps.pvpChance > pvps.ratChance, `pvp ${pvps.pvpChance} rat ${pvps.ratChance}`);
  });

  it("lit un raid isolé sans le confondre avec le profil", () => {
    const quiet = evaluate(
      {
        format: "solo",
        memory: "precise",
        met: "none",
        kit: "standard",
        tolerance: "annoying",
      },
      "last-raid",
    );
    assert.ok(quiet.score < 35, `score ${quiet.score}`);
    assert.equal(quiet.chillGames, 0);
    assert.equal(quiet.module, "last-raid");
    assert.match(quiet.synthesis, /un seul raid/);
    assert.ok(quiet.ratChance < 15 && quiet.pvpChance < 15);

    const defend = evaluate(
      {
        format: "solo",
        memory: "precise",
        met: "several",
        contactShape: "pvp",
        firstShot: "never",
        firstDamage: "never",
        hitFirst: "always",
        shotsReceived: "often",
        hostileForm: "push",
        thirdParty: "no",
        chase: "never",
        surviveOnly: "always",
        broke: "often",
        extractContest: "often",
        kit: "standard",
        tolerance: "annoying",
      },
      "last-raid",
    );
    assert.equal(defend.defenderVerdict, true);
    assert.ok(defend.chillGames >= 2 && defend.chillGames <= 6, `chill ${defend.chillGames}`);

    const cover = evaluate(
      {
        format: "solo",
        memory: "precise",
        met: "one",
        contactShape: "pvp",
        firstShot: "yes",
        firstDamage: "yes",
        hitFirst: "rarely",
        shotsReceived: "sometimes",
        hostileForm: "push",
        thirdParty: "yes",
        thirdMotive: "coverStranger",
        chase: "never",
        surviveOnly: "always",
        broke: "often",
        extractContest: "rare",
        kit: "standard",
        tolerance: "annoying",
      },
      "last-raid",
    );
    const loot = evaluate(
      {
        format: "solo",
        memory: "precise",
        met: "one",
        contactShape: "pvp",
        firstShot: "yes",
        firstDamage: "yes",
        hitFirst: "rarely",
        shotsReceived: "sometimes",
        hostileForm: "push",
        thirdParty: "yes",
        thirdMotive: "hunt",
        chase: "often",
        surviveOnly: "hunted",
        broke: "never",
        extractContest: "rare",
        kit: "cheap",
        tolerance: "fine",
      },
      "last-raid",
    );
    assert.ok(loot.score > cover.score, `${loot.score} vs ${cover.score}`);
    assert.match(cover.intervention ?? "", /inconnu/);
    assert.equal(loot.intervention, null);
    assert.ok(loot.chillGames > cover.chillGames);
  });
});
