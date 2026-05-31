import { Character, AttrKey } from "../types";

export const newCharacter = (name: string = "Nowa Postać"): Character => {
  return {
    id: Date.now(),
    name,
    race: "",
    level: "",
    attrs: { Vit: 0, Str: 0, Agi: 0, Dex: 0, Int: 0, Wis: 0 },
    hp: Array(5).fill(null).map(() => ({ current: 6, max: 6 })),
    skills: [
      { name: "Dyplomacja",  attr: "Wis" as AttrKey, mod: 0, prog: 0, exp: false },
      { name: "Oszustwo",    attr: "Int" as AttrKey, mod: 0, prog: 0, exp: false },
      { name: "Zastraszenie",attr: "Str" as AttrKey, mod: 0, prog: 0, exp: false },
      { name: "Odporność",   attr: "Vit" as AttrKey, mod: 0, prog: 0, exp: false },
      { name: "Wola",        attr: "Wis" as AttrKey, mod: 0, prog: 0, exp: false },
      { name: "Precyzja",    attr: "Dex" as AttrKey, mod: 0, prog: 0, exp: false },
      { name: "Potęga",      attr: "Str" as AttrKey, mod: 0, prog: 0, exp: false },
      { name: "Sprawność",   attr: "Agi" as AttrKey, mod: 0, prog: 0, exp: false },
      { name: "Ukrycie",     attr: "Agi" as AttrKey, mod: 0, prog: 0, exp: false },
      { name: "Percepcja",   attr: "Int" as AttrKey, mod: 0, prog: 0, exp: false },
      { name: "Wnikliwość",  attr: "Wis" as AttrKey, mod: 0, prog: 0, exp: false },
    ],
    knowledges: [
      { name: "Kultura",  dice: 6, mod: 0, prog: 0, exp: false },
      { name: "Natura",   dice: 6, mod: 0, prog: 0, exp: false },
      { name: "Technika", dice: 6, mod: 0, prog: 0, exp: false },
      { name: "Magia",    dice: 6, mod: 0, prog: 0, exp: false },
      { name: "Medycyna", dice: 6, mod: 0, prog: 0, exp: false },
    ],
    statuses: [],
    morale: 0,
    cunning: 0,
    soul: 0,
    speed: 0,
    poisoning: 0,
    equipment: [],
    specialSkills: [],
  };
};