// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "../../../utils/services/network/FirestoreApi";
import {
  ArticleModel,
  isArticleModel,
} from "../../../utils/data/models/ArticleModel";

// type Data = {
//   name: string;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  // Only proceed post method
  if (req.method === "POST") {
    let newArticle: ArticleModel | undefined = undefined;
    // check if the request body matches ArticleModel
    try {
      newArticle = req.body;
    } catch (error) {
      newArticle = undefined;
    }
    // check if body is valid
    if (newArticle && isArticleModel(newArticle)) {
      await firestore.addArticle(newArticle).then((e) => e);
      return res.status(200).json({ data: "Data has been saved to the database" });
    }
    return res.status(200).json({ data: "Requested data doesn't match" });
  }
  return res.status(500).json({ data: "Only POST method allowed" });
}
