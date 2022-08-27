import { get, orderByChild, query, ref, remove, set } from "firebase/database";
import uaParser from "ua-parser-js";
import { UserModel, UserSession } from "../../data/models/UserModel";
import { ArticleModel } from "./../../data/models/ArticleModel";
import { firebaseClient } from "./FirebaseClient";
// Modules for realtime database

const db = firebaseClient.rtdb;

//  update latest data to be the indentifier if the firestore data has changed or not
// so obsolete data on other machine would update
export async function rtdbSessionLatestSet(user: UserModel) {
  const path = `sessionList/${encodeURIComponent(user.id || "")}/_LATEST/`;
  const data = {
    ...user.session,
    userLastUpdated: user.dateUpdated,
  } as UserSession;
  const newRef = ref(db, path);
  await set(newRef, data);
  return data;
}

// RETURN a UserModel
export async function rtdbSessionAdd(user: UserModel): Promise<UserModel> {
  const lastLoginAt = (user.localAuthData?.metadata as any).lastLoginAt;
  const sessionId = `SESSION_${lastLoginAt}`;
  // create new ref
  const newRef = ref(
    db,
    `sessionList/${encodeURIComponent(user.id || "")}/${sessionId}`,
  );
  //   get userAgent
  const userAgent = uaParser(navigator.userAgent);
  //   create new user session
  const session: UserSession = {
    id: sessionId,
    userId: user.id,
    os: `${userAgent.os.name} ${userAgent.os.version}`,
    browser: `${userAgent.browser.name} v.${userAgent.browser.version}`,
    time: lastLoginAt,
    userLastUpdated: user.dateUpdated,
  };
  await set(newRef, session);
  const userWithSession = { ...user, session: session };
  await rtdbSessionLatestSet(userWithSession);
  return userWithSession;
}

export type ArticleLiteModel = Pick<
  ArticleModel,
  "id" | "title" | "desc" | "thumbnail" | "dateAdded" | "topics" | "duration"
> & {
  author: {
    id: string;
    name: string;
    avatar: string;
    username: string;
  };
};

export async function rtdbArticleGetById(
  id: string,
): Promise<ArticleModel | null> {
  const path = `articleList/${id}`;
  const rr = ref(db, path);
  const res = await get(rr);
  if (res.exists()) {
    return res.val() as ArticleModel;
  }
  return null;
}

// Adding lite version of article to rtdb for searching purpose
export async function rtdbArticleMirrorAdd(
  article: ArticleModel,
): Promise<ArticleModel> {
  const path = `articleList/${article.id}`;
  // console.log(data);
  const newRef = ref(db, path);
  await set(newRef, article);
  return article;
}

// Updating the mirror by deleting the old one and adding the new one
export async function rtdbArticleMirrorUpdate(
  article: ArticleModel,
): Promise<ArticleModel> {
  rtdbArticleMirrorDelete(article.id);
  rtdbArticleMirrorAdd(article);
  return article;
}

export async function rtdbArticleMirrorDelete(
  articleId: string,
): Promise<boolean> {
  const path = `articleList/${articleId}`;
  const rr = ref(db, path);
  await remove(rr);
  return true;
}

export async function rtdbTopicGet(): Promise<string[]> {
  const path = `topicList`;
  // const query = child(ref(db),path);
  const rr = ref(db, path);
  const qq = query(rr, orderByChild("name"));
  const res = await get(qq).then((snapshot) => {
    if (snapshot.exists()) {
      const data: string[] = [];
      // using `forEach` because normal `val` won't guarantee the ordering request
      snapshot.forEach((e) => {
        data.push(e.val().name);
      });

      return data;
    }
    return [];
  });
  return res as string[];
}
