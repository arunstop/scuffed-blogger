import { ArticleModel } from "./../../../utils/data/models/ArticleModel";
import { MainNetworkResponse } from "./../../../utils/data/Main";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseApi } from "../../../utils/services/network/FirebaseApi";

// type Data = {
//   name: string;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const { id } = req.query;
  // If no id
  if (!id) return res.status(500);
  // only proceed if the method is `GET`
  if (req.method === "GET") {
    const requestedArticle = await firebaseApi.getArticleById(id as string).then(
      (e) =>
        ({
          message: e
            ? "Successfully fetched the article"
            : "Could not find the requested article",
          status: e ? "success" : "error",
          data: e,
        } as MainNetworkResponse<ArticleModel>),
    );
    return res.status(200).json(requestedArticle);
  }
}
