let seq = 0;

/** Local id without relying on Web Crypto (unavailable in RN by default). */
export function createId(prefix = 'id'): string {
  seq += 1;
  return `${prefix}_${Date.now().toString(36)}_${seq.toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}
