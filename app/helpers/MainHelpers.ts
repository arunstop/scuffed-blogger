import { formatDistance } from "date-fns";
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

export function dateDistanceGet(from: number, to: number) {
  return formatDistance(from, to);
}

export function userAvatarLinkGet(userId:string){
  return `https://firebasestorage.googleapis.com/v0/b/tuturku-3e16b.appspot.com/o/images%2Favatars%2F${userId}.png?alt=media`;
}