import { FirebaseError } from "firebase/app";
import { netError, netSuccess } from "./../../../utils/data/Main";
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
      try {
        await firebaseApi.addArticle(newArticle);
        return res
          .status(200)
          .json(
            netSuccess<ArticleModel>(
              "Data has been saved to the database",
              newArticle,
            ),
          );
      } catch (error) {
        console.log(JSON.stringify(error as FirebaseError));
        return res
          .status(200)
          .json(
            netError<FirebaseError>(
              "Error when adding article to the database",
              error as FirebaseError,
            ),
          );
      }
    }
    // if data doesn't match
    return res.status(200).json(netError("Requested data doesn't match"));
  }
  return res.status(500).json({
    status: "error",
    message: "Only POST method allowed",
    data: null,
  } as MainNetworkResponse);
}
