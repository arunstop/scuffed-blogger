import _ from "lodash";

export function routeTrimQuery(urlWithQuery: string): string {
  return urlWithQuery.split("?")[0];
}

export function strKebabify(str: string): string {
  return _.kebabCase(str);
}

export function getStorageDirectory(link: string): string {
  return decodeURIComponent(link.split("?")[0].split("/").pop() || "");
}

export function toJsonFriendly(data: any): any {
  // This is to turn any `undefined` to `null`
  // because JSON cannot read `undefined`
  // Also this is to avoid firebase `updateDoc` not allowing custom types
  return JSON.parse(JSON.stringify(data));
}
