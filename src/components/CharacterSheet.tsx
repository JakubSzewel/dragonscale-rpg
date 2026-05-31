import { useState } from "react";
import DiceModal from "./DiceModal";
import HealthSection from "./HealthSection";
import SkillRow from "./SkillRow";
import KnowledgeRow from "./KnowledgeRow";
import EquipmentSection from "./EquipmentSection";
import StatusSection from "./StatusSection";
import NumStepper from "./ui/NumStepper";
import EditableText from "./ui/EditableText";
import { Character, RollConfig, AttrKey, Armor, Weapon, Skill, Knowledge } from "../types";
import { attrToDice, attrToTotal } from "../utils/dice";
import { poisonLimit } from "../utils/posionLimit";


interface CharacterSheetProps {
  char: Character;
  onUpdate: (updated: Character) => void;
}

const ATTR_LABELS: [AttrKey, string][] = [
  ["Vit", "Witalność"],
  ["Str", "Siła"],
  ["Agi", "Zwinność"],
  ["Dex", "Zręczność"],
  ["Int", "Inteligencja"],
  ["Wis", "Mądrość"],
];

const CharacterSheet = ({ char, onUpdate }: CharacterSheetProps) => {
  const [modal, setModal] = useState<RollConfig | null>(null);

  const update = (patch: Partial<Character>) => onUpdate({ ...char, ...patch });

  const setAttr = (k: AttrKey, v: number) => {
    const attrs = { ...char.attrs, [k]: Math.min(5, Math.max(-3, v)) };
    const hp = char.hp.map(s => ({ ...s, max: 6 + attrs.Vit }));
    update({ attrs, hp });
  };

  const wounds = char.hp.filter(s => s.current === 0).length;

  const openRoll = (
    label: string,
    diceTotal: number,
    modifier: number = 0,
    woundsOnByDefault: boolean = true
  ) => {
    setModal({ label, diceTotal, modifier, statuses: char.statuses, wounds, woundsOnByDefault, overEncumbered });
  };

  const { attrs } = char;
  const dodge = attrs.Agi + 3;
  const block = attrs.Dex + 3;
  const loadCapacity = attrs.Str + 3;
  const power = attrs.Int + attrs.Wis;
  const moraleMax = attrs.Wis + 4;
  const cunningMax = attrs.Int + 3;
  const speed = attrs.Agi + 4;
  const poisoningMax = poisonLimit(attrs.Vit);

  const weapons = char.equipment.filter((e): e is Weapon => e.type === "weapon");
  const armors = char.equipment.filter((e): e is Armor => e.type === "armor");
  const armorDef = armors.reduce((s, a) => s + a.defense, 0);
  const weaponBlock = weapons.reduce((s, w) => s + w.blockBonus, 0);
  const defense = block + armorDef + weaponBlock;

  const statChips: [string, number][] = [
    ["Blok", block],
    ["Udźwig", loadCapacity],
    ["Moc", power],
  ];

  const totalWeight = char.equipment.reduce(
    (s, it) => s + (it.weight || 0),
    0
  );

  const overEncumbered = Math.max(0, totalWeight - loadCapacity);

  const getWeaponFlatBonus = (weapon: Weapon): number => {
    switch (weapon.attr) {
      case "Sił": return attrs.Str;
      case "Zrę": return attrs.Dex;
      case "Sił/Zrę": return Math.max(attrs.Str, attrs.Dex);
      case "-": return 0;
    }
  };

  return (
    <div className="sheet">
      {modal && (
        <DiceModal
          rollConfig={modal}
          onClose={() => setModal(null)}
          cunning={char.cunning}
          onSpendCunning={(amount) => update({ cunning: Math.max(0, char.cunning - amount) })}
        />
      )}
      <div className="sheet-header">
        <div className="header-field big">
          <label>Imię</label>
          <EditableText value={char.name} onChange={(v: any) => update({ name: v })} placeholder="Imię postaci..." className={""} />
        </div>
        <div className="header-field">
          <label>Rasa</label>
          <EditableText value={char.race} onChange={(v: any) => update({ race: v })} placeholder="..." />
        </div>
        <div className="header-field">
          <label>Poziom</label>
          <EditableText value={char.level} onChange={(v: any) => update({ level: v })} placeholder="..." />
        </div>
      </div>
      <div className="attrs-row">
        {ATTR_LABELS.map(([key, label]) => (
          <div key={key} className="attr-box">
            <div className="attr-label">
              {label}
            </div>
            <NumStepper
              value={attrs[key]}
              min={-3}
              max={5}
              onChange={(v: number) => setAttr(key, v)}
            />
            <button
              className="attr-roll-btn"
              onClick={() => openRoll(label, attrToTotal(attrs[key]))}
            >
              {attrToDice(attrs[key])}
            </button>
          </div>
        ))}
      </div>
      <HealthSection
        sections={char.hp}
        onChange={(hp: any) => update({ hp })}
      />
      <div className="main-cols">
        <div className="left-col">
          <div className="table-section">
            <div className="section-header">Umiejętności</div>
            <table className="skill-table">
              <thead>
                <tr><th>Nazwa</th><th>Kość</th><th>Modyfikator</th><th>Postęp</th><th></th></tr>
              </thead>
              <tbody>
                {char.skills.map((sk, i) => (
                  <SkillRow
                    key={sk.name}
                    skill={sk}
                    attrVal={attrs[sk.attr]}
                    onUpdate={(updated: Skill) => {
                      const skills = [...char.skills];
                      skills[i] = updated;
                      update({ skills });
                    }}
                    onRoll={(name: string, diceTotal: number, mod: number | undefined) => openRoll(name, diceTotal, mod)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-section">
            <div className="section-header">Wiedza</div>
            <table className="skill-table">
              <thead>
                <tr><th>Nazwa</th><th>Kość</th><th>Modyfikator</th><th>Postęp</th><th></th></tr>
              </thead>
              <tbody>
                {char.knowledges.map((kn, i) => (
                  <KnowledgeRow
                    key={kn.name}
                    kn={kn}
                    onUpdate={(updated: Knowledge) => {
                      const knowledges = [...char.knowledges];
                      knowledges[i] = updated;
                      update({ knowledges });
                    }}
                    onRoll={(name: string, diceTotal: number, mod: number | undefined) => openRoll(name, diceTotal, mod, false)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <StatusSection
            statuses={char.statuses}
            onChange={(statuses: any) => update({ statuses })}
          />
        </div>
        <div className="right-col">
          <div className="misc-grid">
            <div className="misc-row">
              <div className="misc-card w-100">
                <div className="misc-label">
                  Morale <span className="misc-max">/{moraleMax}</span>
                </div>
                <div className="misc-bar">
                  {Array.from({ length: moraleMax }, (_, j) => (
                    <div
                      key={j}
                      className={`misc-pip ${j < char.morale ? "filled" : ""}`}
                      onClick={() => update({ morale: j < char.morale ? j : j + 1 })}
                    />
                  ))}
                </div>
              </div>
              <div className="misc-card w-100">
                <div className="misc-label">
                  Spryt <span className="misc-max">/{cunningMax}</span>
                </div>
                <div className="misc-bar">
                  {Array.from({ length: Math.max(0, cunningMax) }, (_, j) => (
                    <div
                      key={j}
                      className={`misc-pip ${j < char.cunning ? "filled" : ""}`}
                      onClick={() => update({ cunning: j < char.cunning ? j : j + 1 })}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="misc-row">
              <div className="misc-card">
                <div className="misc-label">
                  Prędkość <span className="misc-max"></span>
                </div>
                <div className="inline-stepper center">
                  <span className="big-val">
                    {speed}
                    {overEncumbered > 0 && (
                      <span className="big-val waring-text"> - {overEncumbered}</span>
                    )}
                  </span>
                </div>
              </div>
              <div className="misc-card">
                <div className="misc-label">
                  Zatrucie <span className="misc-max">/{poisoningMax}</span>
                </div>
                <div className="inline-stepper center">
                  <button onClick={() => update({ poisoning: Math.max(0, char.poisoning - 1) })}>−</button>
                  <span className={`big-val ${char.poisoning > poisoningMax ? 'waring-text' : ''}`}>{char.poisoning}</span>
                  <button onClick={() => update({ poisoning: char.poisoning + 1 })}>+</button>
                </div>
              </div>
              <div className="misc-card">
                <div className="misc-label">Dusza</div>
                <div className="inline-stepper center">
                  <button onClick={() => update({ soul: Math.max(0, char.soul - 1) })}>−</button>
                  <span className="big-val">{char.soul}</span>
                  <button onClick={() => update({ soul: char.soul + 1 })}>+</button>
                </div>
              </div>
            </div>
            <div className="misc-card stats-row">
              <div className="stat-chip">
                <div
                  className="stat-chip-val dice-btn clickable"
                  onClick={() => openRoll("Unik", attrToTotal(attrs.Dex), dodge)}
                >
                  k{attrToTotal(attrs.Dex)}
                  {dodge !== 0 && (
                    <span className="flat-bonus">
                      {dodge > 0 ? `+${dodge}` : dodge}
                    </span>
                  )}
                </div>
                <div className="stat-chip-label">Unik</div>
              </div>
              {statChips.map(([n, v]) => (
                <div key={n} className="stat-chip">
                  <div className="stat-chip-val">{v}</div>
                  <div className="stat-chip-label">{n}</div>
                </div>
              ))}
            </div>
            <div className="misc-card stats-row">
              {weapons.length === 0 ? (
                <div className="stat-chip">
                  <div className="stat-chip-val">—</div>
                  <div className="stat-chip-label">Atak</div>
                </div>
              ) : (
                weapons.map((w) => {
                  const flatBonus = getWeaponFlatBonus(w);
                  const label = flatBonus !== 0
                    ? `${w.name || "Broń"} (k${w.attackDice}${flatBonus > 0 ? `+${flatBonus}` : flatBonus})`
                    : `${w.name || "Broń"} (k${w.attackDice})`;
                  return (
                    <div className="stat-chip">
                      <div
                        key={w.id} 
                        className="stat-chip-val dice-btn clickable"
                        onClick={() => openRoll(label, w.attackDice, flatBonus)}
                      >
                        k{w.attackDice}
                        {flatBonus !== 0 && (
                          <span className="flat-bonus">
                            {flatBonus > 0 ? `+${flatBonus}` : flatBonus}
                          </span>
                        )}
                      </div>
                      <div className="stat-chip-label">{w.name || "Broń"}</div>
                    </div>
                  );
                })
              )}
              <div className="stat-chip">
                <div className="stat-chip-val">{defense}</div>
                <div className="stat-chip-label">Obrona</div>
              </div>
            </div>
          </div>
          <EquipmentSection
            items={char.equipment}
            onChange={(equipment: any) => update({ equipment })}
            loadCapacity={loadCapacity}
            overEncumbered={overEncumbered}
          />
          <div className="special-skills-section">
            <div className="section-header">Umiejętności Specjalne</div>
            <div className="special-list">
              {char.specialSkills.map((sk, i) => (
                <div key={i} className="special-item">
                  <EditableText
                    value={sk}
                    onChange={(v: string) => {
                      const s = [...char.specialSkills];
                      s[i] = v;
                      update({ specialSkills: s });
                    }}
                    placeholder="Umiejętność..."
                    className="special-skill-value"
                  />
                  <button
                    className="remove-btn"
                    onClick={() => update({ specialSkills: char.specialSkills.filter((_, j) => j !== i) })}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              className="add-btn"
              onClick={() => update({ specialSkills: [...char.specialSkills, ""] })}
            >
              + Dodaj
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;