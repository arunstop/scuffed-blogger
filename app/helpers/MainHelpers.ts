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
  return formatDistance(from, to).replace("about", "");
}

export function userAvatarLinkGet(userId: string) {
  return `https://firebasestorage.googleapis.com/v0/b/tuturku-3e16b.appspot.com/o/images%2Favatars%2F${userId}.png?alt=media`;
}

export async function autoRetry<T>(
  action: (attempt: number, max: boolean) => T,
  tries = 3,
): Promise<T | null> {
  for (let attempt = 1; attempt <= tries; attempt++) {
    // console.log("tries no : ", attempt);
    const res = await action(attempt, attempt === tries);
    // console.log("called done...");
    if (res) return res;
  }
  return null;
}

export async function imageToPng(file: File,name="pngimage"): Promise<File | undefined> {
  const base64: string | null = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      console.error("error processing image");
      reject(null);
    };
    reader.readAsDataURL(file);
  });
  if (!base64) return;

  // const res = reader.onload = () => {
  //   // console.log(reader.result);
  //   return reader.result;
  // };
  // reader.
  const pngFile = await fetch(base64)
    .then((res) => res.blob())
    .then((blob) => new File([blob], `${name}.png`,{ type: "image/png" }))
    .catch((e) => {
      console.error("Error when converting file type to png");
      return null;
    });
  if (!pngFile) return;

  return pngFile;
}
