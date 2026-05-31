export const poisonLimit = (wit: number) => {
  if (wit <= -3) return 1;
  if (wit <= -1) return 2;
  if (wit === 0) return 3;
  if (wit <= 2)  return 4;
  if (wit <= 4)  return 5;
  return 6;
}