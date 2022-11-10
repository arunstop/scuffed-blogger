import { ApiPagingReqProps } from "./../../data/Main";
import { ArticleListModel } from "../../data/models/ArticleListModel";
// =============================
// IMPORTANT : converting JSON stringify and then parse again
// is to bypass a type error that said firebase recognize custom type e.g. `ArticleModel`
// also to remove undefined on JSON format because firebase hates it
// this syntax =>
//
// =============================

import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";
import {
  ArticleModel,
  factoryArticleComplete,
} from "../../data/models/ArticleModel";
import {
  ArticleIdsByUser,
  ArticleListModelByUser,
} from "../../../app/services/ArticleService";
import { firebaseClient } from "../../clients/FirebaseClient";

const articleDb = firebaseClient.collections.articles;
const articleContentDb = firebaseClient.collections.articleContents;

// @return all articles
export async function repoFsArticleGetAll(): Promise<ArticleModel[] | null> {
  const snapshot = await getDocs(articleDb);
  // console.log(snapshot);
  const list = snapshot.docs.map((doc) =>
    factoryArticleComplete(doc.data() as ArticleModel),
  );
  return list;
}

// @return article ids
export async function repoFsArticleGetIds({
  articleListRefId,
  start,
  count,
  keyword,
}: {
  articleListRefId: string;
} & ApiPagingReqProps): Promise<ArticleIdsByUser | null> {
  const end = start + count;
  const ref = doc(articleDb, articleListRefId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;

  const dataRaw = snapshot.data() as ArticleListModel;
  if (!dataRaw.articles.length) return null;

  const data = {
    ids: dataRaw.articles.map((e) => e.id).slice(start, end),
    keyword: keyword,
    offset: end,
    totalArticle: dataRaw.articles.length,
  } as ArticleIdsByUser;

  // no keyword
  if (!keyword) return data;
  // with keyword
  const kw = keyword.trim().toLowerCase();
  const filteredArticles = dataRaw.articles
    .filter((e) => {
      const title = e.title.toLowerCase().trim();
      const desc = e.desc.toLowerCase().trim();
      const topics = e.topics?.join(" ").toLowerCase().trim() || "";
      const tags = e.tags.join(" ").toLowerCase().trim();
      // const date = format(e.dateAdded, "EEEE, DDDD MMMM yyyy")
      //   .toLowerCase()
      //   .trim();
      return (
        title.includes(kw) ||
        desc.includes(kw) ||
        topics.includes(kw) ||
        tags.includes(kw)
      );
    })
    .map((e) => e.id);

  return {
    ...data,
    ids: filteredArticles.slice(start, end),
    totalArticle: filteredArticles.length,
  };
}

// @return all articles
export async function repoFsArticleGetByUser(
  articleListId: string,
  keyword: string,
  paging: {
    start: number;
    end: number;
  },
): Promise<ArticleListModelByUser | null> {
  const ref = doc(articleDb, articleListId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  const dataRaw = snapshot.data() as ArticleListModel;
  const data = {
    ...dataRaw,
    totalArticle: dataRaw.articles.length,
    keyword: keyword,
    articles: dataRaw.articles.slice(paging.start, paging.end),
    offset: paging.end,
  } as ArticleListModelByUser;

  // no keyword
  if (!keyword) return data;
  // with keyword
  const kw = keyword.trim().toLowerCase();
  const filteredArticles = dataRaw.articles.filter((e) => {
    const title = e.title.toLowerCase().trim();
    const desc = e.desc.toLowerCase().trim();
    const topics = e.topics?.join(" ").toLowerCase().trim() || "";
    const tags = e.tags.join(" ").toLowerCase().trim();
    // const date = format(e.dateAdded, "EEEE, DDDD MMMM yyyy")
    //   .toLowerCase()
    //   .trim();
    return (
      title.includes(kw) ||
      desc.includes(kw) ||
      topics.includes(kw) ||
      tags.includes(kw)
    );
  });

  return {
    ...data,
    articles: filteredArticles.slice(paging.start, paging.end),
    totalArticle: filteredArticles.length,
  };
}

// @return an article based on `id`
export async function repoFsArticleGetById(
  id: string,
): Promise<ArticleModel | null> {
  // Get the requested document
  const snapshot = await getDoc(doc(articleDb, id));
  // Check if it exists
  const article = snapshot.exists()
    ? ({ id: snapshot.id, ...snapshot.data() } as ArticleModel)
    : null;

  return article;
}

// Adds an article to article list to database
export async function repoFsArticleAdd(articleList: ArticleListModel) {
  const ref = doc(articleDb, articleList.id);
  const snapshot = await getDoc(ref);
  // check if document exists, update if it does
  if (snapshot.exists())
    return await updateDoc(ref, {
      ...articleList,
      articles: arrayUnion(...articleList.articles),
    });
  // add otherwise
  await setDoc(ref, {
    ...articleList,
    articles: arrayUnion(...articleList.articles),
  });
}

// Update an article to firestore database
export async function repoFsArticleUpdate({
  oldArticle,
  article,
  userPostsRef,
}: {
  oldArticle: ArticleModel;
  article: ArticleModel;
  userPostsRef: string;
}) {
  const ref = doc(articleDb, userPostsRef);
  console.log(oldArticle);
  console.log(article);
  // delete the old article
  await updateDoc(ref, {
    articles: arrayRemove(oldArticle),
  });
  // add the new updated one
  await updateDoc(ref, {
    dateUpdated: article.dateUpdated,
    articles: arrayUnion(article),
  });
}

export async function fsArticleContentGet(id: string): Promise<string | null> {
  const ref = doc(articleContentDb, id);
  const res = await getDoc(ref);
  return res.exists() ? res.data().content : null;
}

// Updates an article in database
// export async function fsArticleUpdate(
//   article: ArticleModel,
//   // only accept ArticleModel keys
//   fields?: (keyof ArticleModel)[],
// ) {
//   const ref = doc(articleDb, article.id);
//   // check if fields are valid and specified
//   // if YES, then update only the fields
//   if (fields) {
//     // mapping `fields` param to the its matching data on the `article` param
//     const filledFields = fields.map((key, idx) => ({ [key]: article[key] }));
//     // turning the array into object
//     const updatedFields = _.reduce(
//       filledFields, // array
//       (array, currentField) => ({ ...array, ...currentField }), // iterator
//       {},
//     );
//     return await updateDoc(ref, updatedFields);
//   }
//   // if NO, then update the whole document
//   return await updateDoc(ref, toJsonFriendly(article));
// }

export async function repoFsArticleDelete({
  article,
  userPostsRef,
}: {
  article: ArticleModel;
  userPostsRef: string;
}) {
  const ref = doc(articleDb, userPostsRef);
  await updateDoc(ref, {
    dateUpdated: Date.now(),
    articles: arrayRemove(article),
  });
}

export async function repoFsArticleContentAdd(id: string, content: string) {
  const ref = doc(articleContentDb, id);
  await setDoc(ref, { content: content });
}
export async function repoFsArticleContentUpdate(id: string, content: string) {
  const ref = doc(articleContentDb, id);
  await setDoc(ref, { content: content });
}

export async function repoFsArticleContentDelete(id: string) {
  const ref = doc(articleContentDb, id);
  await deleteDoc(ref);
}
