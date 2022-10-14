import { FirebaseError } from "firebase/app";
import { values } from "lodash";
import { nanoid } from "nanoid";
import { WritingPanelFormProps } from "../../base/data/contexts/WritingPanelTypes";
import {
  ApiPagingReqProps,
  ApiPagingResultProps,
  MainNetworkResponse,
  netError,
  netLoading,
  netSuccess,
} from "../../base/data/Main";
import {
  ArticleModel,
  toArticleModel,
  toArticleModelUpdated,
} from "../../base/data/models/ArticleModel";
import { UserModel } from "../../base/data/models/UserModel";
import {
  repoFsArticleAdd,
  repoFsArticleContentAdd,
  repoFsArticleContentDelete,
  fsArticleContentGet,
  repoFsArticleContentUpdate,
  repoFsArticleDelete,
  repoFsArticleGetByUser,
  repoFsArticleUpdate,
} from "../../base/repos/firestoreDb/FirestoreArticleRepo";
import {
  repoRtArticleGetAll,
  repoRtArticleMirrorAdd,
  repoRtArticleMirrorDelete,
  repoRtArticleMirrorUpdate,
  repoRtArticleSearch,
  repoRtArticleUpdateView,
} from "../../base/repos/realtimeDb/RealtimeArticleRepo";

import Fuse from "fuse.js";
import { MainApiResponse } from "../../base/data/Main";
import { ArticleListModel } from "../../base/data/models/ArticleListModel";
import { serviceFileUpload } from "./FileService";
import {
  repoStDirectoryDelete,
  repoStFileDeleteByFullLink,
} from "../../base/repos/StorageModules";
import { axiosClient } from "../../base/clients/AxiosClient";

// Adding article, now using direct firebaseClient
interface PropsAddArticle {
  rawArticle: WritingPanelFormProps;
  user: UserModel;
  callback?: (
    resp: MainNetworkResponse<ArticleModel | null | FirebaseError>,
  ) => void;
}

export type ArticleListModelByUser = ArticleListModel & {
  totalArticle: number;
  keyword: string;
  offset: number;
};

export type ArticleModelFromDb = {
  articles: ArticleModel[];
} & ApiPagingResultProps;

export async function serviceArticleMirrorGetAll({
  data,
  callback,
}: MainApiResponse<
  ApiPagingReqProps,
  ArticleModelFromDb | null | FirebaseError
>): Promise<ArticleModelFromDb | null> {
  callback?.(netLoading("Error when fetching articles", null));
  try {
    const res = await repoRtArticleGetAll(data);
    if (res) {
      callback?.(netSuccess("Success fetching articles", res));
      return res;
    }
    callback?.(netError("Error when fetching articles", null));
    return null;
  } catch (error) {
    console.log(error as FirebaseError);
    callback?.(
      netError("Error when fetching articles", error as FirebaseError),
    );
    return null;
  }
}

export async function serviceArticleGetByUser({
  articleListId,
  keyword,
  paging,
  callback,
}: {
  articleListId: string;
  keyword: string;
  paging: {
    start: number;
    end: number;
  };
  callback?: (
    resp: MainNetworkResponse<ArticleListModelByUser | null | FirebaseError>,
  ) => void;
}): Promise<ArticleListModelByUser | null> {
  try {
    // console.log("paging = ", `${paging.start} + ${paging.end}`)
    const data = await repoFsArticleGetByUser(articleListId, keyword, paging);
    callback?.(
      netSuccess<ArticleListModelByUser | null>(
        "Success getting user's posts",
        data,
      ),
    );
    return data;
  } catch (error) {
    console.log(error);
    callback?.(
      netError<FirebaseError>(
        "Error when getting users's posts",
        error as FirebaseError,
      ),
    );
    return null;
  }
}

export async function serviceArticleAdd({
  rawArticle,
  user,
  callback,
}: PropsAddArticle): Promise<ArticleModel | null> {
  // generate article
  const id = nanoid(24);
  const article = toArticleModel({
    id: id,
    user: user,
    formData: rawArticle,
  });

  const errorCb = (msg: string, error: null | FirebaseError) => {
    callback?.(netError<null | FirebaseError>(msg, error));
  };

  // contentless article
  const articleContentless: ArticleModel = { ...article, content: "" };

  // create article with no content
  try {
    const articleList: ArticleListModel = {
      id: user.list.posts,
      title: `${user.name}'s articles`,
      status: "PUBLIC",
      articles: [articleContentless],
      dateAdded: Date.now(),
      dateUpdated: Date.now(),
    };
    // add article and check if user already has article or not
    await repoFsArticleAdd(articleList);
  } catch (error) {
    console.log(error);
    errorCb("Error when creating article", error as FirebaseError);
    return null;
  }

  // create article content
  try {
    await repoFsArticleContentAdd(article.id, article.content);
  } catch (error) {
    console.log(error);
    errorCb("Error when creating article", error as FirebaseError);
    return null;
  }

  // upload thumbnail
  const thumbnail = rawArticle.thumbnail;
  if (thumbnail) {
    try {
      callback?.(netLoading<ArticleModel>("Uploading the thumbnail", article));
      // uploading thumbnail
      const thumbnailUrl = await serviceFileUpload({
        file: thumbnail[0],
        directory: `/thumbnails/${article.id}/`,
        name: article.id,
      });

      if (!thumbnailUrl) {
        errorCb("Couldn't get the uploaded image's url", null);
        return null;
      }
    } catch (error) {
      console.log(error);
      errorCb("Error when creating thumbnail", error as FirebaseError);
      return null;
    }
  }

  // uploading mirror to rtdb for efficient searching
  try {
    await repoRtArticleMirrorAdd(articleContentless);
  } catch (error) {
    console.log(error);
    errorCb("Error when creating thumbnail", error as FirebaseError);
    return null;
  }

  callback?.(netSuccess<ArticleModel>("Success creating article", article));
  return article;
}

export async function serviceArticleDelete({
  article,
  user,
  callback,
}: {
  article: ArticleModel;
  user: UserModel;
  callback?: (resp: MainNetworkResponse<string | null | FirebaseError>) => void;
}): Promise<UserModel | null> {
  // delete article
  try {
    await repoFsArticleDelete({
      article: article,
      userPostsRef: user.list.posts,
    });
  } catch (error) {
    console.log(error);
    callback?.(
      netError<FirebaseError>(
        "Error when deleting users's posts",
        error as FirebaseError,
      ),
    );
    return null;
  }
  // delete article content
  try {
    await repoFsArticleContentDelete(article.id);
  } catch (error) {
    console.log(error);
    callback?.(
      netError<FirebaseError>(
        "Error when deleting users's posts",
        error as FirebaseError,
      ),
    );
  }
  // delete mirror on rtdb
  try {
    await repoRtArticleMirrorDelete(article.id);
  } catch (error) {
    console.log(error);
    callback?.(
      netError<FirebaseError>(
        "Error when deleting users's posts",
        error as FirebaseError,
      ),
    );
    return null;
  }
  // delete thumbnail if exists
  if (article.thumbnail) {
    try {
      const thumbnailDirectory = `/thumbnails/${article.id}/`;
      await repoStDirectoryDelete(thumbnailDirectory);
    } catch (error) {
      console.log(error);
      callback?.(
        netError<FirebaseError>(
          "Error when deleting users's posts",
          error as FirebaseError,
        ),
      );
      return null;
    }
  }

  callback?.(
    netSuccess<string>(
      "Sucess deleting the article",
      `Deleted article with ID : ${article.id}`,
    ),
  );
  return user;
}

export async function serviceArticleContentGet({
  id,
  callback,
}: {
  id: string;
  callback?: (resp: MainNetworkResponse<string | null | FirebaseError>) => void;
}): Promise<string | null> {
  try {
    const data = await fsArticleContentGet(id);
    callback?.(netSuccess<string | null>("Success getting user's posts", data));
    return data;
  } catch (error) {
    console.log(error);
    callback?.(
      netError<FirebaseError>(
        "Error when getting users's posts",
        error as FirebaseError,
      ),
    );
    return null;
  }
}

type PropsEditArticle = {
  oldArticle: ArticleModel;
  rawArticle: WritingPanelFormProps;
  userPostsRef: string;
  callback?: (
    resp: MainNetworkResponse<ArticleModel | null | FirebaseError>,
  ) => void;
};

export async function serviceArticleUpdate({
  oldArticle,
  rawArticle,
  userPostsRef,
  callback,
}: PropsEditArticle) {
  // generate updated article
  const article = toArticleModelUpdated({
    oldArticle: oldArticle,
    formData: rawArticle,
  });

  const errorCb = (msg: string, error: null | FirebaseError) => {
    callback?.(netError<null | FirebaseError>(msg, error));
  };

  // contentless articles
  const articleContentless: ArticleModel = { ...article, content: "" };
  const oldArticleContentless: ArticleModel = { ...oldArticle, content: "" };

  // store updated article without content
  try {
    await repoFsArticleUpdate({
      oldArticle: oldArticleContentless,
      article: articleContentless,
      userPostsRef: userPostsRef,
    });
  } catch (error) {
    console.log(error);
    errorCb("Error when updating article", error as FirebaseError);
    return null;
  }

  // update the content if present different
  if (oldArticle.content !== article.content) {
    try {
      await repoFsArticleContentUpdate(article.id, article.content);
    } catch (error) {
      console.log(error);
      errorCb("Error when updating article", error as FirebaseError);
      return null;
    }
  }

  // upload thumbnail if present
  const thumbnail = rawArticle.thumbnail;
  if (thumbnail) {
    callback?.(netLoading<ArticleModel>("Uploading the thumbnail", article));
    // delete the old tumbnail
    const thumbnailExt = thumbnail[0].name.split(".").pop() || "";
    // delete the old thumbnail
    // if it has different extension than the new one
    if (!oldArticle.thumbnail.includes(thumbnailExt)) {
      try {
        await repoStFileDeleteByFullLink(oldArticle.thumbnail);
      } catch (error) {
        console.log(error);
        errorCb("Error when uploading thumbnail", error as FirebaseError);
        return null;
      }
    }

    // upload/replace the new one
    try {
      const thumbnailUrl = await serviceFileUpload({
        file: thumbnail[0],
        directory: `/thumbnails/${article.id}/`,
        name: article.id,
      });

      if (!thumbnailUrl) {
        errorCb("Couldn't get the uploaded image's url", null);
        return null;
      }
    } catch (error) {
      console.log(error);
      errorCb("Error when updating thumbnail", error as FirebaseError);
      return null;
    }
  }

  // uploading mirror to rtdb for efficient searching
  try {
    await repoRtArticleMirrorUpdate(articleContentless);
  } catch (error) {
    console.log(error);
    errorCb("Error when updating thumbnail", error as FirebaseError);
    return null;
  }

  callback?.(netSuccess<ArticleModel>("Success updating article", article));
  return article;
}

export async function serviceArticleReact({
  data,
  callback,
}: MainApiResponse<
  {
    article: ArticleModel;
  },
  ArticleModel | null | FirebaseError
>): Promise<ArticleModel | null> {
  const { article } = data;
  try {
    console.log(article);
    await repoRtArticleMirrorUpdate(article);
    callback?.(netSuccess("Success liking the article", article));
    return article;
  } catch (error) {
    console.log(error);
    callback?.(netError("Success liking the article", error as FirebaseError));
    return null;
  }
}

export async function serviceArticleSearch({
  data,
  callback,
}: MainApiResponse<
  ApiPagingReqProps & { abortSignal: AbortSignal },
  ArticleModel[] | null | FirebaseError
>): Promise<ArticleModel[] | null> {
  console.log("searching...", data.keyword);
  const { keyword, count, start, abortSignal } = data;
  try {
    const res: ArticleModel[] = await repoRtArticleSearch(
      data.abortSignal,
    ).then((e) => {
      if (e.status !== 200) return [];
      let articles = values(e.data) as ArticleModel[];
      const kw = (keyword || "").toLowerCase().trim();
      // show all articles if no keyword
      if (!kw) {
        articles = articles.slice(0, count);
        return articles;
      }
      const fuzz = new Fuse(articles, {
        keys: ["title", "desc", "tags", "community", "slug"],
      });
      // show filtered articles if there is a keyword
      const searchResult = fuzz.search(kw).map((e) => e.item);
      articles = searchResult.slice(0, count);
      // articles = (fuzz.search(kw) as unknown as ArticleModel[]).slice(0, count);
      return articles;
    });
    return res;
  } catch (error) {
    return null;
  }
}

export async function serviceArticleUpdateView({
  data,
  callback,
}: MainApiResponse<{ id: string }, string | null | FirebaseError>): Promise<
  string | null
> {
  const { id } = data;
  try {
    await repoRtArticleUpdateView(id);
    callback?.(netSuccess("Success Updating Views", "Success Updating Views"));
    return "Success Updating Views";
  } catch (error) {
    callback?.(netError("Error Updating Views", error as FirebaseError));
    console.error(error as FirebaseError);
    return null;
  }
}

export async function serviceArticleGetById({
  id,
  callback,
}: {
  id: string;
  callback?: (resp: MainNetworkResponse<ArticleModel | null>) => void;
}): Promise<ArticleModel | null> {
  // callback?.({
  //   data: null,
  //   message: "Submitting your article...",
  //   status: "loading",
  // });
  console.log(id);
  let data: MainNetworkResponse<ArticleModel | null> | null = null;
  // await waitFor(2000);
  try {
    //   Call the endpoint
    const result = await axiosClient
      .get(`/api/article/${id}`, {
        // .get(`/api/hello`, {
        method: "GET",
      })
      .then((resp) => {
        // console.log(resp.data);
        return resp;
      });
    data = result.data as MainNetworkResponse<ArticleModel | null>;
    callback?.(data);
  } catch (error) {
    callback?.({
      data: null,
      message: `${error}`,
      status: "error",
    });
    // console.log(error);
  }
  // Returns data if it exist
  // returns null otherwise
  return data?.data || null;
}
