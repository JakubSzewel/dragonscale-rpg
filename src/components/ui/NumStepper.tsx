interface NumStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

const NumStepper = ({
  value,
  min,
  max,
  onChange,
  className = "",
}: NumStepperProps) => {
  return (
    <div className={`num-stepper ${className}`}>
      <button
        onClick={() => onChange(Math.max(min ?? -Infinity, value - 1))}
      >
        -
      </button>
      <span>{value > 0 ? `+${value}` : value}</span>
      <button
        onClick={() => onChange(Math.min(max ?? Infinity, value + 1))}
      >
        +
      </button>
    </div>
  );
};

export default NumStepper;