import { waitFor } from "../../helpers/DelayHelpers";
import { MainNetworkResponse } from "../../data/Main";
import { ArticleModel } from "../../data/models/ArticleModel";
import { axiosClient } from "./AxiosClient";
// axios.get('/user?ID=12345')
//   .then(function (response) {
//     // handle success
//     console.log(response);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   })
//   .then(function () {
//     // always executed
//   });

async function getArticleById({
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
      message: `Error just occured, stating : ${error}`,
      status: "error",
    });
    // console.log(error);
  }
  // Returns data if it exist
  // returns null otherwise
  return data?.data || null;
}

async function getArticles({
  callback,
}: {
  callback?: (resp: MainNetworkResponse<ArticleModel>) => void;
} = {}): Promise<MainNetworkResponse<ArticleModel>> {
  // callback?.({
  //   data: null,
  //   message: "Submitting your article...",
  //   status: "loading",
  // });
  let data: null | any = null;
  // await waitFor(2000);
  try {
    //   Call the endpoint
    const result = await axiosClient
      // .get(`/api/article/${id}`, {
      .get(`/api/hello`, {
        method: "GET",
      })
      .then((resp) => {
        // console.log(resp.data);
        return resp;
      });
    data = result.data;
    callback?.(data);
  } catch (error) {
    callback?.(data);
    // console.log(error);
  }
  return data;
}

async function addArticle({
  article,
  callback,
}: {
  article: ArticleModel;
  callback?: (resp: MainNetworkResponse<ArticleModel | null>) => void;
}): Promise<ArticleModel | null> {
  // callback?.({
  //   data: null,
  //   message: "Submitting your article...",
  //   status: "loading",
  // });

  await waitFor(5000);

  let data: MainNetworkResponse<ArticleModel | null> | null = null;

  try {
    //   Call the endpoint
    const result = await axiosClient
      .post("/api/article/add", JSON.stringify(article), {
        // .post("/api/hello", JSON.stringify(article), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((resp) => {
        console.log(resp.data);
        return resp;
      });

    data = result.data as MainNetworkResponse<ArticleModel | null>;
    callback?.(data);
  } catch (error) {
    callback?.({
      data: null,
      message: `Error just occured, stating : ${error}`,
      status: "error",
    });

    console.log(error);
  }
  // Returns data if it exist
  // returns null otherwise
  return data?.data || null;
}

export const mainApi = { getArticleById, getArticles, addArticle };
