// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { MainNetworkResponse } from "../../utils/data/Main";

// type Data = {
//   name: string;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  console.log(req.method);
  if (req.method === "GET") {
    // const articles = await firestore.getArticleAll().then((e) => e);
    res
      .status(200)
      .json({
        data: "hello",
        message: "",
        status: "success",
      } as MainNetworkResponse);
  }

  if (req.method === "POST") {
    // const articles = await firestore.getArticleAll().then((e) => e);
    res
      .status(200)
      .json({
        data: "Data added",
        message: "",
        status: "success",
      } as MainNetworkResponse);
  }
}
