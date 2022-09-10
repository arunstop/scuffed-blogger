import _ from "lodash";
import { nanoid } from "nanoid";
import { strKebabify } from "../../helpers/MainHelpers";
import { WritingPanelFormProps } from "../contexts/WritingPanelTypes";
import { isFalsy } from "../Main";
import { UserModel } from "./UserModel";

export interface ArticleModel {
  id: string;
  slug: string;
  title: string;
  desc: string;
  thumbnail: string;
  content: string;
  author: string;
  dateAdded: number;
  dateUpdated: number;
  duration: number;
  topics: string[];
  tags: string[];
  deleted: number;
  community: string;
  likes: string[];
  dislikes: string[];
}

export function isArticleModel(value: unknown) {
  // check if it is object
  if (typeof value !== "object") return false;
  // check falsy
  if (isFalsy(value)) return false;
  // check if all required properties are satisfied
  const requiredPropsValid =
    "id" in value &&
    "slug" in value &&
    "title" in value &&
    "desc" in value &&
    "thumbnail" in value &&
    "content" in value &&
    "author" in value &&
    "dateAdded" in value &&
    "dateUpdated" in value &&
    "duration" in value &&
    "topics" in value &&
    "tags" in value &&
    "deleted" in value &&
    "community" in value &&
    "likes" in value &&
    "dislikes" in value;
  // list all properties
  const props = [
    "id",
    "slug",
    "title",
    "desc",
    "thumbnail",
    "content",
    "author",
    "dateAdded",
    "dateUpdated",
    "duration",
    "topics",
    "tags",
    "deleted",
    "community",
    "likes",
    "dislikes",
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
export function toArticleModel({
  id,
  user,
  formData,
}: {
  id: string;
  user: UserModel;
  formData: WritingPanelFormProps;
}): ArticleModel {
  const date = Date.now();
  let thumbnail = "";
  if (formData.thumbnail) {
    const file = formData.thumbnail[0];
    // Splitting the name by with .  then get the last item
    // which results the extension of the file
    const extension = file.name.split(".").pop();
    // Getting new name with id
    const newName = encodeURIComponent(`thumbnails/${id}/${id}.${extension}`);

    thumbnail = `https://firebasestorage.googleapis.com/v0/b/tuturku-3e16b.appspot.com/o/${newName}?alt=media`;
  }

  return {
    id: id,
    slug: `${strKebabify(formData.title.slice(0, 120))}-${id}`,
    title: formData.title,
    desc: formData.desc,
    content: encodeURIComponent(formData.content),
    thumbnail: thumbnail,
    author: user.email,
    dateAdded: date,
    dateUpdated: date,
    deleted: 0,
    duration: (formData.content.length || 0) / 200,
    tags: [...formData.tags.split(",").map((e) => e.trim())],
    topics: [...formData.topics.split(",").map((e) => e.trim())],
    likes: [],
    dislikes: [],
    community: "",
  };
}

export function factoryArticleComplete(
  partial: Partial<ArticleModel>,
): ArticleModel {
  const res: ArticleModel = {
    id: partial.id || nanoid(24),
    slug: partial.slug || "",
    title: partial.title || "",
    desc: partial.desc || "",
    thumbnail: partial.thumbnail || "",
    content: partial.content || "",
    author: partial.author || "",
    dateAdded: partial.dateAdded || Date.now(),
    dateUpdated: partial.dateUpdated || Date.now(),
    duration: partial.duration || 0,
    topics: partial.topics || [],
    tags: partial.tags || [],
    deleted: partial.deleted || 0,
    community: partial.community || "",
    likes: partial.likes || [],
    dislikes: partial.dislikes || [],
  };
  return res;
}

// Turn ArticleModel to newly updated ArticleModel
export function toArticleModelUpdated({
  oldArticle,
  formData,
}: {
  oldArticle: ArticleModel;
  formData: WritingPanelFormProps;
}): ArticleModel {
  const id = oldArticle.id;
  // use oldArticle.thumbnail if no thumbnail is present
  let thumbnail = oldArticle.thumbnail;
  if (formData.thumbnail) {
    const file = formData.thumbnail[0];
    // Splitting the name by with .  then get the last item
    // which results the extension of the file
    const extension = file.name.split(".").pop();
    // Getting new name with id
    const newName = encodeURIComponent(`thumbnails/${id}/${id}.${extension}`);

    thumbnail = `https://firebasestorage.googleapis.com/v0/b/tuturku-3e16b.appspot.com/o/${newName}?alt=media`;
  }

  return {
    ...oldArticle,
    title: formData.title,
    desc: formData.desc,
    content: encodeURIComponent(formData.content),
    thumbnail: thumbnail,
    duration: (formData.content.length || 0) / 200,
    dateUpdated: Date.now(),
    tags: [...formData.tags.split(",").map((e) => e.trim())],
    topics: [...formData.topics.split(",").map((e) => e.trim())],
  };
}

export function factoryArticleRemoveContent(article: ArticleModel): ArticleModel {
  return { ...article, content: "" };
}

export function toArticleModelDraft(
  formData: WritingPanelFormProps,
): ArticleModel {
  const date = Date.now();

  return {
    id: "",
    slug: ``,
    title: formData.title,
    desc: formData.desc,
    content: encodeURIComponent(formData.content),
    thumbnail: formData.thumbnail
      ? URL.createObjectURL(formData.thumbnail[0])
      : "",
    author: `Writer`,
    dateAdded: date,
    dateUpdated: date,
    deleted: 0,
    duration: (formData.content.length || 0) / 200,
    tags: [...formData.tags.split(",").map((e) => e.trim())],
    topics: [...formData.topics.split(",").map((e) => e.trim())],
    likes: [],
    dislikes: [],
    community: "",
  };
}
