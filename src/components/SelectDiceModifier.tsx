const DICE_VALUES = [-8, -6, -4, -2, 0, 2, 4, 6, 8] as const;

const formatDice = (value: number) => {
  if (value === 0) return "0";
  return `${value > 0 ? "+" : "-"}k${Math.abs(value)}`;
};

interface SelectDiceModifierProps {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectDiceModifier = ({ value, onChange }: SelectDiceModifierProps) => {
  return (
    <select
        value={value}
        onChange={onChange}
        className="dice-select"
        >
        {DICE_VALUES.map((val) => (
            <option key={val} value={val}>
            {formatDice(val)}
            </option>
        ))}
    </select>
  );
}

export default SelectDiceModifier;