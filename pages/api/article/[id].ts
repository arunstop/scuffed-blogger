import {
  netError,
  netSuccess
} from "../../../base/data/Main";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { FirebaseError } from "firebase/app";
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
  if (!id) return  res.status(500).send(netError("Error : ID is required!"));
  // only proceed if the method is `GET`
  if (req.method !== "GET") return res.status(500).send(netError("Error : only `GET` method is allowed "));
  try {
    const requestedArticle = await repoRtArticleGetById(id as string).then(
      (e) =>
        netSuccess(
          e
            ? "Successfully fetched the article"
            : "Could not find the requested article",
          e,
        ),
    );
    return res.status(200).json(requestedArticle);
  } catch (error) {
    // console.log(error as FirebaseError);
    return res
      .status(500)
      .send(netError((error as FirebaseError).message, null));
  }
}
