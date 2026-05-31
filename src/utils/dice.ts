import { Die } from "../types";

function buildDiceLadder(): Die[][] {
  const base: Die[][] = [
    [{ sides: 4 }],
    [{ sides: 6 }],
    [{ sides: 8 }],
    [{ sides: 10 }],
    [{ sides: 12 }],
  ];
  const extensions = [4, 6, 8, 10, 12];
  const NUM_TIERS = 8;
  const ladder = [...base];
  for (let tier = 1; tier <= NUM_TIERS; tier++) {
    const d10s: Die[] = Array(tier).fill({ sides: 10 });
    for (const ext of extensions) {
      ladder.push([...d10s, { sides: ext }]);
    }
  }
  return ladder;
}

export const DICE_LADDER = buildDiceLadder();

const ATTR_DICE_TOTAL: Record<number, number> = {
  [-3]: 4,
  [-2]: 6,
  [-1]: 8,
  [0]:  12,
  [1]:  14,
  [2]:  16,
  [3]:  18,
  [4]:  20,
  [5]:  22,
};

export const totalToIndex = (total: number): number => {
  const idx = DICE_LADDER.findIndex(
    entry => entry.reduce((s, d) => s + d.sides, 0) === total
  );
  return idx === -1 ? DICE_LADDER.findIndex(
    entry => entry.reduce((s, d) => s + d.sides, 0) === 12
  ) : idx;
};

export const indexToDice = (idx: number): Die[] =>
  DICE_LADDER[Math.max(0, Math.min(DICE_LADDER.length - 1, idx))];

export interface RollModifiers {
  wounds?: number;
  statusSteps?: number;
  modifier?: number;
}

export const resolveDice = (baseTotal: number, modifiers: RollModifiers): Die[] => {
  let idx = totalToIndex(baseTotal);
  idx -= modifiers.wounds ?? 0;
  idx += modifiers.statusSteps ?? 0;
  return indexToDice(idx);
};

export const rollDie = (sides: number): number =>
  Math.floor(Math.random() * sides) + 1;

export const rollDice = (dice: Die[]): number =>
  dice.reduce((sum, d) => sum + rollDie(d.sides), 0);


export const diceToLabel = (diceArr: Die[]): string =>
  `k${diceArr.reduce((sum, d) => sum + d.sides, 0)}`;

export const totalToLabel = (total: number): string =>
  diceToLabel(indexToDice(totalToIndex(total)));

export const attrToTotal = (val: number): number =>
  ATTR_DICE_TOTAL[Math.max(-3, Math.min(5, val))];

export const getDiceForAttr = (val: number): Die[] => {
  const total = attrToTotal(val);
  return indexToDice(totalToIndex(total));
};

export const attrToDice = (val: number): string =>
  diceToLabel(getDiceForAttr(val));

export const shiftDice = (baseTotal: number, steps: number): Die[] =>
  indexToDice(totalToIndex(baseTotal) + steps);