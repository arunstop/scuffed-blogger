import { ArticleListModel } from "./../../../data/models/ArticleListModel";
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
import { ArticleModel } from "../../../data/models/ArticleModel";
import { firebaseClient } from "../FirebaseClient";
import { ArticleListModelByUser } from "../FirebaseApi/ArticleModules";

const articleDb = firebaseClient.collections.articles;
const articleContentDb = firebaseClient.collections.articleContents;

// @return all articles
export async function fsArticleGetAll(): Promise<ArticleModel[] | null> {
  const snapshot = await getDocs(articleDb);
  // console.log(snapshot);
  const list = snapshot.docs.map((doc) => doc.data() as ArticleModel);
  return list;
}

// @return all articles
export async function fsArticleGetByUser(
  articleListId: string,
  keyword: string,
): Promise<ArticleListModelByUser | null> {
  const ref = doc(articleDb, articleListId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  const dataRaw = snapshot.data();
  const data = {
    ...dataRaw,
    totalArticle: dataRaw.articles.length,
    keyword: keyword,
  } as ArticleListModelByUser;
  // no keyword
  if (!keyword) return data;
  // with keyword
  const kw = keyword.trim().toLowerCase();
  const filteredArticles = data.articles.filter((e) => {
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
    articles: filteredArticles,
  };
}

// @return an article based on `id`
export async function fsArticleGetById(
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
export async function fsArticleAdd(articleList: ArticleListModel) {
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
export async function fsArticleUpdate({
  oldArticle,
  article,
  userPostsRef,
}: {
  oldArticle: ArticleModel;
  article: ArticleModel;
  userPostsRef: string;
}) {
  const ref = doc(articleDb, userPostsRef);
  console.log("oldArticle", oldArticle.dateUpdated);
  console.log("article", article.dateUpdated);
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

export async function fsArticleDelete({
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

export async function fsArticleContentAdd(id: string, content: string) {
  const ref = doc(articleContentDb, id);
  await setDoc(ref, { content: content });
}
export async function fsArticleContentUpdate(id: string, content: string) {
  const ref = doc(articleContentDb, id);
  await setDoc(ref, { content: content });
}

export async function fsArticleContentDelete(id: string) {
  const ref = doc(articleContentDb, id);
  await deleteDoc(ref);
}
