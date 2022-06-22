// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "../../../utils/backend/FirestoreApi";
import {
  ArticleModel,
  isArticleModel,
} from "../../../utils/data/models/Article";

// type Data = {
//   name: string;
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  // firestore.addArticle({
  //     title:
  //       "First article of this site. Pretty much just a dummy, but hey, at least an improvement right?",
  //     desc: `Actually i didn't really think about writing this description but
  //     because of the system's requirement, i was forced to do so. So at last, here it is. The low effort description. But hey, i think it is decent, what do you think?`,
  //     content: `%23%23%20Contents%0A%0A*%20%20%20%5BWhat%20is%20this%3F%5D(%23what-is-this)
  //       %0A*%20%20%20%5BWhen%20should%20I%20use%20this%3F%5D(%23when-should-i-use-this)%0A*%20%20%20%5BInstall%5D(%23install)`,
  //     thumbnail: "https://picsum.photos/id/5/500/300",
  //     author: "Munkrey Alf",
  //     dateAdded: 1655901953087,
  //     dateUpdated: 1655901953087,
  //     deleted: 0,
  //     duration: 39.795,
  //     tags: ["Technology", "Photography"],
  //   });
  // Only proceed post
  if (req.method === "POST") {
    let newArticle: ArticleModel | undefined = undefined;
    // check if the request body matches ArticleModel
    try {
      newArticle = req.body;
    } catch (error) {
      newArticle = undefined;
    }
    if (newArticle&&isArticleModel(newArticle)) {
      const articles = await firestore.addArticle(newArticle).then((e) => e);
      return res.status(200).json({ data: articles });
    }
    return res.status(200).json({ data: "Requested data doesn't match" });
  }
  return res.status(500).json({ data: "Only POST method allowed" });
}
