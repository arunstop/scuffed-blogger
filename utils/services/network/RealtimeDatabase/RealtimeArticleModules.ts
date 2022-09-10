import { get, ref, remove, set } from "firebase/database";
import { ArticleModel, factoryArticleComplete } from "../../../data/models/ArticleModel";
import { firebaseClient } from "../FirebaseClient";

const db = firebaseClient.rtdb;

export async function rtArticleGetById(
    id: string,
  ): Promise<ArticleModel | null> {
    const path = `articleList/${id}`;
    const rr = ref(db, path);
    const res = await get(rr);
    if (res.exists()) {
      return factoryArticleComplete(res.val() as ArticleModel);
    }
    return null;
  }
  
  // Adding lite version of article to rtdb for searching purpose
  export async function rtArticleMirrorAdd(
    article: ArticleModel,
  ): Promise<ArticleModel> {
    const path = `articleList/${article.id}`;
    // console.log(data);
    const newRef = ref(db, path);
    await set(newRef, article);
    return article;
  }
  
  // Updating the mirror by deleting the old one and adding the new one
  export async function rtArticleMirrorUpdate(
    article: ArticleModel,
  ): Promise<ArticleModel> {
    rtArticleMirrorDelete(article.id);
    rtArticleMirrorAdd(article);
    return article;
  }
  
  export async function rtArticleMirrorDelete(
    articleId: string,
  ): Promise<boolean> {
    const path = `articleList/${articleId}`;
    const rr = ref(db, path);
    await remove(rr);
    return true;
  }