export function prettyJSON(obj: object): string {
  return JSON.stringify(obj, undefined, "\t");
}
