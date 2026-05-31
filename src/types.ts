export interface Die {
  sides: number;
}

export type AttrKey = "Vit" | "Str" | "Agi" | "Dex" | "Int" | "Wis";

export interface Attributes {
  Vit: number;
  Str: number;
  Agi: number;
  Dex: number;
  Int: number;
  Wis: number;
}

export interface Health {
  current: number;
  max: number;
}

export interface Skill {
  name: string;
  attr: AttrKey;
  mod: number;
  prog: number;
  exp: boolean;
}

export interface Knowledge {
  name: string;
  dice: number;
  mod: number;
  prog: number;
  exp: boolean;
}

export interface Status {
  id: number;
  name: string;
  diceValue: number;
}

export type EquipmentType = "item" | "weapon" | "armor";

interface EquipmentBase {
  id: number;
  type: EquipmentType;
  name: string;
  weight: number;
}

export interface GenericItem extends EquipmentBase {
  type: "item";
}

export type WeaponAttribute = "-" | "Sił" | "Zrę" | "Sił/Zrę"

export interface Weapon extends EquipmentBase {
  type: "weapon";
  attackDice: number;
  attr: WeaponAttribute;
  blockBonus: number;
  difficulty: string;
  prog: number;
  exp: boolean;
}

export interface Armor extends EquipmentBase {
  type: "armor";
  defense: number;
  durability: number;
}

export type Equipment = GenericItem | Weapon | Armor;

export interface Character {
  id: number;
  name: string;
  race: string;
  level: string;
  attrs: Attributes;
  hp: Health[];
  skills: Skill[];
  knowledges: Knowledge[];
  statuses: Status[];
  morale: number;
  cunning: number;
  soul: number;
  speed: number;
  poisoning: number;
  equipment: Equipment[];
  specialSkills: string[];
}

export interface RollConfig {
  label: string;
  diceTotal: number;
  modifier: number;
  statuses: Status[];
  wounds: number;
  woundsOnByDefault?: boolean;
  overEncumbered: number;
}