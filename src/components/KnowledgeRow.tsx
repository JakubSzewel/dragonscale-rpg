import { Knowledge } from "../types";

interface KnowledgeRowProps {
  kn: Knowledge;
  onUpdate: (knowledge: Knowledge) => void;
  onRoll: (name: string, diceTotal: number, modifier: number) => void;
}

const KnowledgeRow = ({
  kn,
  onUpdate,
  onRoll,
}: KnowledgeRowProps) => {
  const DICE_OPTIONS = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

  return (
    <tr>
      <td className="skill-name">{kn.name}</td>
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <select
            className="dice-select"
            value={kn.dice}
            onChange={(e) =>
              onUpdate({
                ...kn,
                dice: parseInt(e.target.value),
              })
            }
          >
            {DICE_OPTIONS.map((d) => (
              <option key={d} value={d}>
                k{d}
              </option>
            ))}
          </select>
          <button
            className="dice-btn small"
            onClick={() => onRoll(kn.name, kn.dice, kn.mod)}
          >
            🎲
          </button>
        </div>
      </td>
      <td>
        <div className="inline-stepper">
          <button onClick={() => onUpdate({ ...kn, mod: kn.mod - 1 })}>
            -
          </button>

          <span>
            {kn.mod !== 0
              ? kn.mod > 0
                ? `+${kn.mod}`
                : kn.mod
              : ""}
          </span>

          <button onClick={() => onUpdate({ ...kn, mod: kn.mod + 1 })}>
            +
          </button>
        </div>
      </td>
      <td>
        <div className="inline-stepper">
          <button
            onClick={() =>
              onUpdate({
                ...kn,
                prog: Math.max(0, kn.prog - 1),
              })
            }
          >
            -
          </button>
          <span>{kn.prog !== 0 ? kn.prog : ""}</span>
          <button
            onClick={() =>
              onUpdate({
                ...kn,
                prog: kn.prog + 1,
              })
            }
          >
            +
          </button>
        </div>
      </td>
      <td>
        <input 
          type="checkbox" 
          name="Experience" 
          className="exp-checkbox"
          checked={kn.exp} 
          onChange={() =>
            onUpdate({
              ...kn,
              exp: !kn.exp,
            })
          }
        />
      </td>
    </tr>
  );
};

export default KnowledgeRow;