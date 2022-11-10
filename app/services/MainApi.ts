import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";
import { MainNetworkResponse } from "../../base/data/Main";
import { ArticleModel } from "../../base/data/models/ArticleModel";
import { axiosClient } from "../../base/clients/AxiosClient";
import { AuthRegisterProps } from "./UserService";

async function getDummy({
  callback,
}: {
  callback?: (resp: MainNetworkResponse<string | null>) => void;
} = {}): Promise<string | null> {
  let data: MainNetworkResponse<string | null> | null = null;

  try {
    //   Call the endpoint
    const result = await axiosClient
      // .get(`/api/article/all`, {
      .get(`/api/hello`, {
        method: "GET",
      })
      .then((resp) => {
        // console.log(resp.data);
        return resp;
      });
    data = result.data;
    callback?.(data!);
  } catch (error) {
    callback?.({
      data: null,
      message: `${error}`,
      status: "error",
    });
    // console.log(error);
  }
  return data?.data || null;
}



async function addArticle({
  article,
  callback,
}: {
  article: ArticleModel;
  callback?: (
    resp: MainNetworkResponse<ArticleModel | FirebaseError | null>,
  ) => void;
}): Promise<ArticleModel | FirebaseError | null> {
  // await waitFor(5000);

  let data: MainNetworkResponse<ArticleModel | FirebaseError | null> | null =
    null;

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

    data = result.data as MainNetworkResponse<
      ArticleModel | FirebaseError | null
    >;
    callback?.(data);
  } catch (error) {
    callback?.({
      data: null,
      message: `${error}`,
      status: "error",
    });

    console.log(error);
  }
  // Returns data if it exist
  // returns null otherwise
  return data?.data || null;
}

async function registerUser({
  fields,
  callback,
}: {
  fields: AuthRegisterProps;
  callback?: (resp: MainNetworkResponse<User | null>) => void;
}) {
  let data: MainNetworkResponse<User | null> | null = null;

  try {
    //   Call the endpoint
    const result = await axiosClient
      .post("/api/auth/register", JSON.stringify(fields), {
        // .post("/api/hello", JSON.stringify(article), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((resp) => {
        return resp;
      });

    data = result.data as MainNetworkResponse<User | null>;
    callback?.(data);
  } catch (error) {
    callback?.({
      data: null,
      message: `${error}`,
      status: "error",
    });
  }
  // Returns data if it exist
  // returns null otherwise
  return data?.data || null;
}

// server side auth validation
export async function mainUserAuthValidate(token:string) {
  try {
    const data = await axiosClient.get("/api/auth/validate", {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: token,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
  }
  return null;
}

export const mainApi = {
  getDummy,
  addArticle,
  registerUser,
};
