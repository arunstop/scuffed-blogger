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
  callback,
}: {
  callback?: (resp: MainNetworkResponse) => void;
} = {}) {
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
      .get("/api/hello", {
        method: "GET",
      })
      .then((resp) => {
        console.log(resp.data); 
        return resp;
      });
    data = result.data;
    callback?.({
      data: null,
      message: data.data,
      status: "success",
    });
  } catch (error) {
    callback?.({
      data: null,
      message: error + "",
      status: "error",
    });
    console.log(error);
  }
  return data;
}

async function addArticle({
  article,
  callback,
}: {
  article: ArticleModel;
  callback?: (resp: MainNetworkResponse) => void;
}) {
  // callback?.({
  //   data: null,
  //   message: "Submitting your article...",
  //   status: "loading",
  // });

  await waitFor(5000);

  let data: null | any = null;

  try {
    //   Call the endpoint
    const result = await axiosClient
      // .post("/api/article/add", JSON.stringify(article), {
      .post("/api/hello", JSON.stringify(article), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((resp) => {        
        callback?.({
          data: resp.data,
          message: "Added to Database",
          status: "success",
        });
        
        console.log(resp.data);

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

export const mainApi = {getArticleById,addArticle};
