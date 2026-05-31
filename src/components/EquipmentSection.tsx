import { EquipmentType, WeaponAttribute } from "../types";
import EditableText from "./ui/EditableText";

interface EquipmentItem {
  id: number;
  type: EquipmentType;
  name: string;
  weight: number;

  attackDice?: number;
  attr?: WeaponAttribute;
  blockBonus?: number;
  difficulty?: string;
  prog?: number;
  exp?: boolean;

  defense?: number;
  durability?: number;
}

const ATTACK_DICE_OPTIONS = [4, 6, 8, 10, 12, 14, 16, 18, 20];
const ATTR_OPTIONS: WeaponAttribute[] = ["-", "Sił", "Zrę", "Sił/Zrę"];

interface EquipmentSectionProps {
  items: EquipmentItem[];
  loadCapacity: number;
  overEncumbered: number;
  onChange: (items: EquipmentItem[]) => void;
}

const Label = ({ text }: { text: string }) => (
  <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>{text}</span>
);

const Stepper = ({
  value,
  onChange,
  min,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) => (
  <div className="inline-stepper small">
    <button onClick={() => onChange(min !== undefined ? Math.max(min, value - 1) : value - 1)}>−</button>
    <span>{value}</span>
    <button onClick={() => onChange(value + 1)}>+</button>
  </div>
);

const EquipmentSection = ({
  items,
  onChange,
  loadCapacity,
  overEncumbered,
}: EquipmentSectionProps) => {
  const totalWeight = items.reduce((s, it) => s + it.weight, 0);

  const addItem = (type: EquipmentType) => {
    const newItem: EquipmentItem = {
      id: Date.now(),
      type,
      name: "",
      weight: 0,
      ...(type === "weapon" && { attackDice: 6, attr: "-", blockBonus: 0, difficulty: "", prog: 0, exp: false }),
      ...(type === "armor" && { defense: 0, durability: 10 }),
    };
    onChange([...items, newItem]);
  };

  const update = (id: number, patch: Partial<EquipmentItem>) =>
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const remove = (id: number) =>
    onChange(items.filter((it) => it.id !== id));

  return (
    <div className="equipment-section">
      <div className="section-header">
        Ekwipunek
        <span className={`weight-badge ${overEncumbered > 0 ? "over" : ""}`}>
          {totalWeight}/{loadCapacity}
        </span>
      </div>
      <div className="equip-list">
        {items.map((it) => (
          <div key={it.id} className={`equip-item equip-${it.type}`}>
            <div className="equip-main">
              {it.type !== "item" && (
                <span className={`equip-type-badge ${it.type}`}>
                  {it.type === "weapon" ? "⚔" : "🛡"}
                </span>
              )}
              <EditableText
                value={it.name}
                onChange={(v) => update(it.id, { name: v })}
                placeholder="Nazwa..."
                className="equip-name"
              />
              <Stepper
                value={it.weight}
                min={0}
                onChange={(v) => update(it.id, { weight: v })}
              />
              <button className="remove-btn" onClick={() => remove(it.id)}>✕</button>
            </div>
            {it.type === "weapon" && (
              <>
                <div className="equip-details">
                  <select
                    className="dice-select"
                    value={it.attackDice}
                    onChange={(e) => update(it.id, { attackDice: parseInt(e.target.value) })}
                  >
                    {ATTACK_DICE_OPTIONS.map((d) => (
                      <option key={d} value={d}>k{d}</option>
                    ))}
                  </select>
                  <select
                    className="dice-select"
                    value={it.attr}
                    onChange={(e) => update(it.id, { attr: e.target.value as WeaponAttribute })}
                  >
                    {ATTR_OPTIONS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                  <Label text="Blok+" />
                  <Stepper
                    value={it.blockBonus ?? 0}
                    onChange={(v) => update(it.id, { blockBonus: v })}
                  />
                  <Label text="Trudność" />
                  <EditableText
                    value={it.difficulty ?? ""}
                    onChange={(v) => update(it.id, { difficulty: v })}
                    placeholder=""
                    className="difficulty-input"
                  />
                </div>
                <div className="equip-details">
                  <Label text="Postęp" />
                  <Stepper
                    value={it.prog ?? 0}
                    min={0}
                    onChange={(v) => update(it.id, { prog: v })}
                  />
                  <input
                    type="checkbox"
                    className="exp-checkbox"
                    checked={it.exp ?? false}
                    onChange={() => update(it.id, { exp: !it.exp })}
                  />
                </div>
              </>
            )}
            {it.type === "armor" && (
              <div className="equip-details">
                <Label text="Obrona+" />
                <Stepper
                  value={it.defense ?? 0}
                  min={0}
                  onChange={(v) => update(it.id, { defense: v })}
                />
                <Label text="Wytrzymałość" />
                <Stepper
                  value={it.durability ?? 0}
                  min={0}
                  onChange={(v) => update(it.id, { durability: v })}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="equip-add-row">
        <button className="add-btn" onClick={() => addItem("item")}>+ Przedmiot</button>
        <button className="add-btn weapon" onClick={() => addItem("weapon")}>+ Broń</button>
        <button className="add-btn armor" onClick={() => addItem("armor")}>+ Zbroja</button>
      </div>
    </div>
  );
};

export default EquipmentSection;