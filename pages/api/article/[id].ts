import { MainNetworkResponse } from "../../../base/data/Main";
import { ArticleModel } from "../../../base/data/models/ArticleModel";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { repoRtArticleGetById } from "../../../base/repos/realtimeDb/RealtimeArticleRepo";

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
    const requestedArticle = await repoRtArticleGetById(id as string).then(
      (e) =>
        ({
          message: e
            ? "Successfully fetched the article"
            : "Could not find the requested article",
          status: e ? "success" : "error",
          data: e,
        } as MainNetworkResponse<ArticleModel | null>),
    );
    return res.status(200).json(requestedArticle);
  }
}
