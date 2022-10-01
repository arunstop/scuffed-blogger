import { get, orderByChild, query, ref } from "firebase/database";
import { firebaseClient } from "../clients/FirebaseClient";
import { ArticleModel } from "../data/models/ArticleModel";
// Modules for realtime database

const db = firebaseClient.rtdb;


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

export async function repoRtTopicGet(): Promise<string[]> {
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
