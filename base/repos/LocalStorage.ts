export function storageSave(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function storageGet(key: string): string {
  return localStorage.getItem(key) || "null";
}

export function storageCheck(key: string){
  return localStorage.getItem(key);
}

export function storageRemove(key: string) {
  localStorage.removeItem(key);
}
