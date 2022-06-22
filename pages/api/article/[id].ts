// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "../../../utils/backend/FirestoreApi";

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
    const requestedArticle = await firestore
      .getArticleById(id as string)
      .then((e) => e);
    return res.status(200).json({ data: requestedArticle });
  }
}
