import { Health } from "../types";

interface HealthSectionProps {
  sections: Health[];
  onChange: (sections: Health[]) => void;
}

const HealthSection = ({ sections, onChange }: HealthSectionProps) => {
  const totalCurrent = sections.reduce((sum, s) => sum + s.current, 0);

  const handleClick = (clickedAbsolute: number) => {
    const newTotal = clickedAbsolute < totalCurrent
      ? clickedAbsolute
      : clickedAbsolute + 1;
    let remaining = newTotal;
    const updated = sections.map(s => {
      const current = Math.min(remaining, s.max);
      remaining = Math.max(0, remaining - s.max);
      return { ...s, current };
    });

    onChange(updated);
  };

  let absoluteIndex = 0;
  const boxes: { sectionIndex: number; boxIndex: number; absolute: number }[] = [];
  sections.forEach((s, si) => {
    for (let j = 0; j < s.max; j++) {
      boxes.push({ sectionIndex: si, boxIndex: j, absolute: absoluteIndex++ });
    }
  });

  return (
    <div className="health-row">
      <div className="health-label">Zdrowie</div>
      <div className="health-sections">
        {sections.map((sec, si) => {
          const sectionsToRight = sections.length - si;
          const penaltyLabel = si > 0 ? `−k${sectionsToRight * 2}` : 'X';
          const sectionStart = sections.slice(0, si).reduce((sum, s) => sum + s.max, 0);

          return (
            <div
              key={si}
              className={`health-sec ${sec.current === 0 ? "damaged" : ""}`}
            >
              <div className="health-sec-penalty">{penaltyLabel}</div>
              <div className="health-sec-bar">
                {Array.from({ length: sec.max }, (_, j) => {
                  const abs = sectionStart + j;
                  const filled = abs < totalCurrent;
                  return (
                    <div
                      key={j}
                      className={`hp-box ${filled ? "hp-full" : "hp-empty"}`}
                      onClick={() => handleClick(abs)}
                    />
                  );
                })}
              </div>
              <div className="health-sec-count">{sec.current}/{sec.max}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthSection;