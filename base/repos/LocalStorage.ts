export function repoLocalSave(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function repoLocalGet(key: string): string {
  return localStorage.getItem(key) || "null";
}

export function repoLocalCheck(key: string){
  return localStorage.getItem(key);
}

export function repoLocalRemove(key: string) {
  localStorage.removeItem(key);
}
