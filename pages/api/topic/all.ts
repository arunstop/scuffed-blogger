import { NextApiRequest, NextApiResponse } from "next";
import { axiosClient } from "../../../base/clients/AxiosClient";
import { ITopic } from "../../../base/repos/realtimeDb/RealtimeTopicRepo";
import { netError, netSuccess } from "./../../../base/data/Main";

const rtdbUrl = `https://tuturku-3e16b-default-rtdb.asia-southeast1.firebasedatabase.app`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "GET") throw Error("Only method get GET is allowed");
    const { keyword } = req.query;
    const topics: ITopic[] = await axiosClient
      .get(`${rtdbUrl}/topicList.json`)
      .then((e) => {
        const kw = keyword?.toString().toLowerCase().trim();
        if (kw)
          return (e.data as ITopic[]).filter((topic) =>
            topic.name.toLowerCase().trim().includes(kw),
          );
        return e.data as ITopic[];
      });
    return res.status(200).json(netSuccess("Success getting topics", topics));
  } catch (e) {
    return res.status(500).json(netError(`${e as string}`));
  }
}
