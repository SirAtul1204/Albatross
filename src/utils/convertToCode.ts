export function convertToCode(s: string): string {
  const backTick = "`";
  let res = backTick.concat(s).concat(backTick);
  return res;
}
