// Web shim for expo-secure-store (sem suporte oficial a web).
// Usa localStorage — suficiente para desenvolvimento/preview no navegador.
export function getItem(key: string): string | null {
  return globalThis.localStorage?.getItem(key) ?? null;
}

export function setItem(key: string, value: string): void {
  globalThis.localStorage?.setItem(key, value);
}

export async function getItemAsync(key: string): Promise<string | null> {
  return getItem(key);
}

export async function setItemAsync(key: string, value: string): Promise<void> {
  setItem(key, value);
}

export async function deleteItemAsync(key: string): Promise<void> {
  globalThis.localStorage?.removeItem(key);
}
