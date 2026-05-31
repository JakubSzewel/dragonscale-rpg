import { Skill } from "../types";
import { attrToTotal } from "../utils/dice";

interface SkillRowProps {
  skill: Skill;
  attrVal: number;
  onUpdate: (skill: Skill) => void;
  onRoll: (name: string, diceTotal: number, modifier: number) => void;
}

const SkillRow = ({
  skill,
  attrVal,
  onUpdate,
  onRoll,
}: SkillRowProps) => {
  const diceStr = attrToTotal(attrVal);

  return (
    <tr>
      <td className="skill-name">{skill.name}</td>
      <td>
        <button
          className="dice-btn"
          onClick={() =>
            onRoll(skill.name, diceStr, skill.mod)
          }
        >
          k{diceStr}
        </button>
      </td>
      <td>
        <div className="inline-stepper">
          <button onClick={() => onUpdate({ ...skill, mod: skill.mod - 1 })}>
            -
          </button>
          <span>
            {skill.mod !== 0
              ? skill.mod > 0
                ? `+${skill.mod}`
                : skill.mod
              : ""}
          </span>

          <button onClick={() => onUpdate({ ...skill, mod: skill.mod + 1 })}>
            +
          </button>
        </div>
      </td>
      <td>
        <div className="inline-stepper">
          <button
            onClick={() =>
              onUpdate({
                ...skill,
                prog: Math.max(0, skill.prog - 1),
              })
            }
          >
            -
          </button>
          <span>{skill.prog !== 0 ? skill.prog : ""}</span>
          <button
            onClick={() =>
              onUpdate({
                ...skill,
                prog: skill.prog + 1,
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
          checked={skill.exp} 
          onChange={() =>
            onUpdate({
              ...skill,
              exp: !skill.exp,
            })
          }
        />
      </td>
    </tr>
  );
};

export default SkillRow;