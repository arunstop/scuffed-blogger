import { isFalsy } from "../Main";

export interface ArticleModel {
  title: string;
  desc: string;
  thumbnail: string;
  content: string;
  author: string;
  dateAdded: number;
  dateUpdated: number;
  duration: number;
  tags: string[];
  deleted: number;
  community?: string;
}

export function isArticleModel(value: unknown) {
  // check if it is object
  if (typeof value !== "object") return false;
  // check falsy
  if (isFalsy(value)) return false;
  // check if there is a
  if (
    "title" in value &&
    "desc" in value &&
    "thumbnail" in value &&
    "content" in value &&
    "author" in value &&
    "dateAdded" in value &&
    "dateUpdated" in value &&
    "duration" in value &&
    "tags" in value &&
    "deleted" in value
  )
    return true;
}
