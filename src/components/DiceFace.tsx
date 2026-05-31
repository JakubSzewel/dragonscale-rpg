const DICE_SHAPES: Record<number, string> = {
  4:  "polygon(50% 0%, 0% 100%, 100% 100%)",
  8:  "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  10: "polygon(50% 0%, 100% 35%, 85% 100%, 15% 100%, 0% 35%)",
  12: "polygon(50% 0%, 93% 18%, 100% 68%, 72% 100%, 28% 100%, 0% 68%, 7% 18%)",
};

interface DiceFaceProps {
  sides: number;
  rolling: boolean;
  value?: number;
}

const DiceFace = ({ sides, rolling, value }: DiceFaceProps) => {
  const clip = DICE_SHAPES[sides];
  return (
    <div
      className={`dice-face ${rolling ? "rolling" : ""}`}
      style={clip ? { clipPath: clip } : undefined}
    >
      <span>{rolling ? "?" : (value ?? sides)}</span>
      <div className="dice-label">k{sides}</div>
    </div>
  );
}

export default DiceFace;