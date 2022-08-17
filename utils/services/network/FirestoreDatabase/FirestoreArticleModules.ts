import { ArticleListModel } from "./../../../data/models/ArticleListModel";
// =============================
// IMPORTANT : converting JSON stringify and then parse again
// is to bypass a type error that said firebase recognize custom type e.g. `ArticleModel`
// also to remove undefined on JSON format because firebase hates it
// this syntax =>
//
// =============================

import {
  arrayUnion, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where
} from "firebase/firestore/lite";
import { ArticleModel } from "../../../data/models/ArticleModel";
import { firebaseClient } from "../FirebaseClient";

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
export async function fsArticleGetByIds(
  articleId: string[],
): Promise<ArticleModel[]> {
  const qq = query(articleDb, where("__name__", "in", articleId));
  const snapshot = await getDocs(qq);
  // console.log(snapshot);
  if (snapshot.empty) return [];
  const list = snapshot.docs.map((doc) => doc.data() as ArticleModel);
  return list;
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
export async function fsArticleAdd(
  articleList: ArticleListModel
) {
  const ref = doc(articleDb, articleList.id);
  const snapshot = await getDoc(ref);
  // check if document exists, update if it does
  if(snapshot.exists())  return await updateDoc(ref, {
    ...articleList,
    articles: arrayUnion(...articleList.articles),
  });
  // add otherwise
  await setDoc(ref, {
    ...articleList,
    articles: arrayUnion(...articleList.articles),
  });
}

export async function fsArticleUpdate2(articleList: ArticleListModel) {
  const ref = doc(articleDb, articleList.id);
  await setDoc(ref, {
    ...articleList,
    articles: arrayUnion(...articleList.articles),
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

export async function fsArticleDelete(articleId: string): Promise<boolean> {
  const ref = doc(articleDb, articleId);
  await deleteDoc(ref);
  return true;
}
