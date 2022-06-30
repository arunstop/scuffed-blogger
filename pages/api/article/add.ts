// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseApi } from "../../../utils/services/network/FirestoreApi";
import {
  ArticleModel,
  isArticleModel,
} from "../../../utils/data/models/ArticleModel";
import { MainNetworkResponse } from "../../../utils/data/Main";

// type Data = {
//   name: string;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  // Only proceed post method
  if (req.method === "POST") {
    let newArticle: ArticleModel | null = null;
    // check if the request body matches ArticleModel
    try {
      newArticle = req.body;
    } catch (error) {
      newArticle = null;
    }
    // check if body is valid
    if (newArticle && isArticleModel(newArticle)) {
      await firebaseApi.addArticle(newArticle).then((e) => e);
      return res
        .status(200)
        .json({
          status: "success",
          message: "Data has been saved to the database",
          data: newArticle,
        } as MainNetworkResponse<ArticleModel>);
    }
    return res.status(200).json(
      {
        status: "error",
        message: "Requested data doesn't match",
        data: null,
      } as MainNetworkResponse);
  }
  return res
    .status(500)
    .json({
      status: "error",
      message: "Only POST method allowed",
      data: null,
    } as MainNetworkResponse);
}
