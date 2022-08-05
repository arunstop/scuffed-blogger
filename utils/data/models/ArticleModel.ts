import { isFalsy } from "../Main";
import _ from "lodash";
import { WritingPanelFormProps } from "../contexts/WritingPanelTypes";
import { nanoid } from "nanoid";
import { strKebabify } from "../../helpers/MainHelpers";

export interface ArticleModel {
  id: string;
  title: string;
  desc: string;
  thumbnail: string;
  content: string;
  author: string;
  dateAdded: number;
  dateUpdated: number;
  duration: number;
  topics?: string[];
  tags: string[];
  deleted: number;
  community?: string;
}

export function isArticleModel(value: unknown) {
  // check if it is object
  if (typeof value !== "object") return false;
  // check falsy
  if (isFalsy(value)) return false;
  // check if all required properties are satisfied
  const requiredPropsValid =
    "id" in value &&
    "title" in value &&
    "desc" in value &&
    "thumbnail" in value &&
    "content" in value &&
    "author" in value &&
    "dateAdded" in value &&
    "dateUpdated" in value &&
    "duration" in value &&
    "tags" in value &&
    "deleted" in value;
  // list all properties
  const props = [
    "id",
    "title",
    "desc",
    "thumbnail",
    "content",
    "author",
    "dateAdded",
    "dateUpdated",
    "duration",
    "tags",
    "topics",
    "deleted",
    "community",
  ];
  // check if `value` has props that is not in the required on the props
  const unrequiredPropsValid =
    _.difference(Object.keys(value), props).length === 0;

  // if all required props are satisfied
  // and no other unrequired value, returns true
  return requiredPropsValid === true && unrequiredPropsValid === true;
}

// turn `WritingPanelFormProps` into `ArticleModel`
// by extracting their component
export function toArticleModel(formData: WritingPanelFormProps): ArticleModel {
  const date = Date.now();

  return {
    id: strKebabify(`${formData.title.slice(0, 120)}-${nanoid()}`),
    title: formData.title,
    desc: formData.desc,
    content: encodeURIComponent(formData.content),
    thumbnail: formData.thumbnail
      ? URL.createObjectURL(formData.thumbnail[0])
      : "",
    author: "Munkrey Alf",
    dateAdded: date,
    dateUpdated: date,
    deleted: 0,
    duration: (formData.content.length || 0) / 200,
    tags: [...formData.tags.split(",").map((e) => e.trim())],
    topics: [...formData.topics.split(",").map((e) => e.trim())],
  };
}
