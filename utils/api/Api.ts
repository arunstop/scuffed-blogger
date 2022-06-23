import { waitFor } from "../helpers/DelayHelpers";
import { MainNetworkResponse } from "./../data/Main";
import { ArticleModel } from "./../data/models/Article";
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

export async function getArticleById() {
  let data: null | any = null;
  try {
    //   Call the endpoint
    const result = await axiosClient
      .get("/api/hello", {
        method: "GET",
      })
      .then((resp) => {
        console.log(resp.data);
        return resp;
      });
    data = result.data;
  } catch (error) {
    console.log(error);
  }
  return data;
}

export async function addArticle({
  article,
  callback,
}: {
  article: ArticleModel;
  callback?: (resp: MainNetworkResponse) => void;
}) {
  callback?.({
    data: null,
    message: "Submitting your article...",
    status: "loading",
  });
  await waitFor(5000);
  let data: null | any = null;
  try {
    //   Call the endpoint
    const result = await axiosClient
      .post("/api/article/add", JSON.stringify(article), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((resp) => {
        console.log(resp.data);
        callback?.({
          data: resp.data,
          message: "Added to Database",
          status: "success",
        });
        return resp;
      });
    data = result.data;
  } catch (error) {
    callback?.({
      data: error + "",
      message: "Error just occured",
      status: "error",
    });
    console.log(error);
  }
  return data;
}
