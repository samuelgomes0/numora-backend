export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj } as T;
  for (const key of keys) {
    delete (result as any)[key];
  }
  return result as Omit<T, K>;
}
