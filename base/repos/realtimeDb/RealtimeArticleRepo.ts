import { axiosClient } from "../../clients/AxiosClient";
import { FirebaseError } from "firebase/app";
import { get, increment, ref, remove, set } from "firebase/database";
import _ from "lodash";
import { ApiPagingReqProps } from "../../data/Main";
import {
  ArticleModel,
  factoryArticleComplete,
} from "../../data/models/ArticleModel";
import { ArticleModelFromDb } from "../../../app/services/ArticleService";
import { firebaseClient } from "../../clients/FirebaseClient";

const db = firebaseClient.rtdb;
const rtdbUrl = `https://tuturku-3e16b-default-rtdb.asia-southeast1.firebasedatabase.app/`;
export async function repoRtArticleGetById(
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

export async function repoRtArticleGetAll({
  count,
  start,
  keyword,
}: ApiPagingReqProps): Promise<ArticleModelFromDb | null> {
  const path = `articleList`;
  const rr = ref(db, path);
  const res = await get(rr);

  try {
    if (!res.exists()) return null;

    const dataRaw = _.values(res.val() as ArticleModel[]);
    let data: ArticleModel[] = [];

    if (keyword) {
      const kw = keyword?.toLowerCase().trim() || "";
      data = dataRaw.filter((e) => {
        const title = e.title.toLowerCase().trim();
        const desc = e.desc.toLowerCase().trim();
        const topics = e.topics?.join(" ").toLowerCase().trim() || "";
        const tags = e.tags.join(" ").toLowerCase().trim();

        return (
          title.includes(kw) ||
          desc.includes(kw) ||
          topics.includes(kw) ||
          tags.includes(kw)
        );
      });
    } else {
      data = dataRaw;
    }

    // if count is zero  meaning it will return all the data.
    const limit = !count ? undefined : start + count;

    return {
      articles: data.slice(start, limit).map((e) => factoryArticleComplete(e)),
      offset: limit || 0,
      total: dataRaw.length,
      keyword: keyword,
    };
  } catch (error) {
    console.log(error as FirebaseError);
    return null;
  }
}

// Adding lite version of article to rtdb for searching purpose
export async function repoRtArticleMirrorAdd(
  article: ArticleModel,
): Promise<ArticleModel> {
  const path = `articleList/${article.id}`;
  // console.log(data);
  const newRef = ref(db, path);
  await set(newRef, article);
  return article;
}

// Updating the mirror by deleting the old one and adding the new one
export async function repoRtArticleMirrorUpdate(
  article: ArticleModel,
): Promise<ArticleModel> {
  repoRtArticleMirrorDelete(article.id);
  repoRtArticleMirrorAdd(article);
  return article;
}

export async function repoRtArticleMirrorDelete(
  articleId: string,
): Promise<boolean> {
  const path = `articleList/${articleId}`;
  const rr = ref(db, path);
  await remove(rr);
  return true;
}

export function repoRtArticleSearch(abortSignal: AbortSignal) {
  const path = `articleList.json`;
  return (
    axiosClient
      //
      .get(`${rtdbUrl}/${path}`, {
        method: "GET",
        signal: abortSignal,
      })
  );
}

export async function repoRtArticleUpdateView(articleId: string) {
  const path = `articleList/${articleId}/views`;
  const rr = ref(db, path);
  await set(rr, increment(1));
}
