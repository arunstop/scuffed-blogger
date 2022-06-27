export function storageSave(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function storageFind(key: string): string {
  return localStorage.getItem(key) || "null";
}

export function storageRemove(key: string) {
  localStorage.removeItem(key);
}
