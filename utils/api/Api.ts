import { ArticleModel } from './../data/models/Article';
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

export async function addArticle(newArticle: ArticleModel) {
  let data: null | any = null;
  try {
    //   Call the endpoint
    const result = await axiosClient
      .post("/api/article/add", JSON.stringify(newArticle), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
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
