import { NextApiRequest, NextApiResponse } from "next";
import { MainNetworkResponse } from "../../../base/data/Main";
import { ArticleModel } from "../../../base/data/models/ArticleModel";
import { repoFsArticleGetAll } from "../../../base/repos/firestoreDb/FirestoreArticleRepo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(500).json({});
  const articles = await repoFsArticleGetAll().then((e) => {
    return e;
  });
  res.status(200).json({
    message: "Successfully fetched the articles",
    status: "success",
    data: articles,
  } as MainNetworkResponse<ArticleModel[]>);
}
