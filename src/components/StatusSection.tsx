import { Status } from "../types";
import SelectDiceModifier from "./SelectDiceModifier";
import EditableText from "./ui/EditableText";

interface StatusSectionProps {
  statuses: Status[];
  onChange: (statuses: Status[]) => void;
}

const StatusSection = ({
  statuses,
  onChange,
}: StatusSectionProps) => {
  const add = () =>
    onChange([
      ...statuses,
      {
        id: Date.now(),
        name: "",
        diceValue: 0,
      },
    ]);

  const update = (id: number, patch: Partial<Status>) =>
    onChange(
      statuses.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      )
    );

  const remove = (id: number) =>
    onChange(statuses.filter((s) => s.id !== id));

  return (
    <div className="status-section">
      <div className="section-header">Status</div>
      <table className="status-table">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Wpływ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((st) => (
            <tr key={st.id}>
              <td>
                <EditableText
                  value={st.name}
                  onChange={(v) =>
                    update(st.id, { name: v })
                  }
                  placeholder="Status..."
                />
              </td>
              <td className="dice-cell">
                <SelectDiceModifier 
                  value={st.diceValue} 
                  onChange={(e) =>
                    update(st.id, {
                      diceValue: Number(e.target.value),
                    })
                  }
                  />
              </td>
              <td>
                <button
                  className="remove-btn"
                  onClick={() => remove(st.id)}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-btn" onClick={add}>
        + Status
      </button>
    </div>
  );
};

export default StatusSection;