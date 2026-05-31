import { useState, useMemo } from "react";
import { RollConfig, Status, Die } from "../types";
import { rollDie, totalToIndex, indexToDice } from "../utils/dice";
import DiceFace from "./DiceFace";
import SelectDiceModifier from "./SelectDiceModifier";

interface RollEntry {
  label: string;
  value: number;
}

interface DiceModalProps {
  rollConfig: RollConfig;
  onClose: () => void;
  cunning: number;
  onSpendCunning: (amount: number) => void;
}

const DiceModal = ({ rollConfig, onClose, cunning, onSpendCunning }: DiceModalProps) => {
  const { label, diceTotal, modifier, statuses, wounds, woundsOnByDefault, overEncumbered } = rollConfig;

  const [activeStatuses, setActiveStatuses] = useState<number[]>([]);
  const [includeWounds, setIncludeWounds] = useState(woundsOnByDefault);
  const [includeOverEncumbered, setIncludeOverEncumbered] = useState(woundsOnByDefault);
  const [result, setResult] = useState<number | null>(null);
  const [rolls, setRolls] = useState<RollEntry[]>([]);
  const [rolling, setRolling] = useState(false);
  const [hasRerolled, setHasRerolled] = useState(false);
  const [cunningUpgrade, setCunningUpgrade] = useState(false);
  const [ownModifiers, setOwnModifiers] = useState(false);
  const [extraDiceModifier, setExtraDiceModifier] = useState(0);
  const [extraFlatModifier, setExtraFlatModifier] = useState(0);

  const statusBonus = useMemo(() => {
    return activeStatuses.reduce((sum, idx) => {
      const st = statuses[idx];
      return st ? sum + st.diceValue : sum;
    }, 0);
  }, [activeStatuses, statuses]);

  const effectiveDice = useMemo<Die[]>(() => {
    const newDiceTotal = diceTotal + statusBonus;
    const baseIdx = totalToIndex(newDiceTotal);
    const woundsPenalty = includeWounds ? wounds : 0;
    const overEncumberedPenalty = includeOverEncumbered ? overEncumbered : 0;
    const cunningBonus = cunningUpgrade ? 2 : 0;
    const extraSteps = extraDiceModifier / 2;
    return indexToDice(Math.max(0, baseIdx - woundsPenalty - overEncumberedPenalty + cunningBonus + extraSteps));
  }, [diceTotal, wounds, includeWounds, statusBonus, cunningUpgrade, extraDiceModifier, overEncumbered, includeOverEncumbered]);

  const toggleStatus = (idx: number) => {
    setActiveStatuses(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const executeRoll = (): { allRolls: RollEntry[]; total: number } => {
    const allRolls: RollEntry[] = [];
    let total = 0;
    effectiveDice.forEach((d: Die) => {
      const r = rollDie(d.sides);
      allRolls.push({ label: `k${d.sides}`, value: r });
      total += r;
    });
    total += modifier ?? 0;
    total += extraFlatModifier;
    return { allRolls, total };
  };

  const doRoll = () => {
    if (cunningUpgrade) onSpendCunning(1);
    setCunningUpgrade(false);
    setRolling(true);
    setTimeout(() => {
      const { allRolls, total } = executeRoll();
      setRolls(allRolls);
      setResult(total);
      setRolling(false);
    }, 600);
  };

  const doReroll = () => {
    if (cunning < 1 || hasRerolled) return;
    onSpendCunning(1);
    setHasRerolled(true);
    setCunningUpgrade(false);
    setRolling(true);
    setTimeout(() => {
      const { allRolls, total } = executeRoll();
      setRolls(allRolls);
      setResult(total);
      setRolling(false);
    }, 600);
  };

  const handleOwnModifiers = () => {
    setOwnModifiers(prev => {
      const next = !prev;
      if (!next) {
        setExtraDiceModifier(0);
        setExtraFlatModifier(0);
      }
      return next;
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{label}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="dice-display">
          {effectiveDice.map((d: Die, i: number) => (
            <DiceFace key={i} sides={d.sides} rolling={rolling} value={rolls[i]?.value} />
          ))}
        </div>
        {modifier !== 0 && (
          <div className="modifier-badge">
            Modyfikator: {modifier > 0 ? `+${modifier}` : modifier}
          </div>
        )}
        {wounds > 0 && (
          <div className="modal-section">
            <button
              className={`wounds-toggle-btn ${includeWounds ? "active" : ""}`}
              onClick={() => setIncludeWounds(prev => !prev)}
            >
              Uwzględnij rany (-k{wounds * 2})
            </button>
          </div>
        )}
        {overEncumbered > 0 && (
          <div className="modal-section">
            <button
              className={`wounds-toggle-btn ${includeOverEncumbered ? "active" : ""}`}
              onClick={() => setIncludeOverEncumbered(prev => !prev)}
            >
              Uwzględnij przeciążenie (-k{overEncumbered * 2})
            </button>
          </div>
        )}
        {statuses.length > 0 && (
          <div className="modal-section">
            <div className="modal-section-title">Statusy</div>
            <div className="status-toggles">
              {statuses.map((st: Status, i: number) => (
                <button
                  key={i}
                  className={`status-toggle-btn ${activeStatuses.includes(i) ? "active" : ""}`}
                  onClick={() => toggleStatus(i)}
                >
                  {st.name} ({st.diceValue > 0 ? `+k${st.diceValue}` : `-k${Math.abs(st.diceValue)}`})
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="modal-section cunning-section">
          <div className="modal-section-title">
            Spryt <span className="cunning-available">({cunning} dostępnych)</span>
          </div>
          <div className="cunning-actions">
            <button
              className={`cunning-btn ${cunningUpgrade ? "active" : ""}`}
              onClick={() => setCunningUpgrade(prev => !prev)}
              disabled={cunning < 1 && !cunningUpgrade}
              title="Wydaj 1 punkt Sprytu aby ulepszyć kość o +k4"
            >
              +k4 do rzutu
            </button>
          </div>
        </div>
        <div className="modal-section">
          <button
            className={`cunning-btn ${ownModifiers ? "active" : ""}`}
            onClick={handleOwnModifiers}
            title="Użyj własnych modyfikatorów rzutu"
          >
            Własne modyfikatory
          </button>
          {ownModifiers && (
            <div className="extra-modifier-row">
              <SelectDiceModifier
                value={extraDiceModifier}
                onChange={e => setExtraDiceModifier(parseInt(e.target.value))}
              />
              <input
                type="number"
                className="flat-modifier-input"
                value={extraFlatModifier}
                onChange={e => setExtraFlatModifier(parseInt(e.target.value) || 0)}
                placeholder="+0"
              />
            </div>
          )}
        </div>
        <button
          className="roll-btn"
          onClick={result === null ? doRoll : doReroll}
          disabled={rolling || (result !== null && (cunning < 1 || hasRerolled || (cunning == 1 && cunningUpgrade)))}
        >
          {rolling
            ? "Rzucam…"
            : result === null
              ? "🎲 Rzuć"
              : hasRerolled
                ? "🎲 Przerzucono ✓"
                : cunning >= 1 && !cunningUpgrade
                  ? "🎲 Przerzuć (Spryt)"
                  : "🎲 Przerzuć (brak Sprytu)"}
        </button>
        {result !== null && !rolling && (
          <div className="roll-result">
            <div className="roll-breakdown">
              {rolls.map((r: RollEntry, i: number) => (
                <span key={i} className={r.value < 0 ? "neg-roll" : "pos-roll"}>
                  {r.label}: {r.value}
                </span>
              ))}
              {modifier !== 0 && (
                <span>{modifier > 0 ? `+${modifier}` : `${modifier}`}</span>
              )}
              {extraFlatModifier !== 0 && (
                <span className="pos-roll">
                  extra: {extraFlatModifier > 0 ? `+${extraFlatModifier}` : extraFlatModifier}
                </span>
              )}
            </div>
            <div className="roll-total">= {result}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiceModal;