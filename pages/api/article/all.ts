import { NextApiRequest, NextApiResponse } from "next";
import { MainNetworkResponse } from "../../../utils/data/Main";
import { ArticleModel } from "../../../utils/data/models/ArticleModel";
import { fsArticleGetAll } from "../../../utils/services/network/FirestoreModules";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(500).json({});
  const articles = await fsArticleGetAll().then((e) => {
    return e;
  });
  res.status(200).json({
    message: "Successfully fetched the articles",
    status: "success",
    data: articles,
  } as MainNetworkResponse<ArticleModel[]>);
}
