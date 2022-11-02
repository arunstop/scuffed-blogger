import { netError, netSuccess } from "./../../../base/data/Main";
import { NextApiRequest, NextApiResponse } from "next";
import { repoRtUserDisplayGetById } from "../../../base/repos/realtimeDb/RealtimeUserRepo";
import { autoRetry } from "../../../app/helpers/MainHelpers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  if (req.method !== "GET")
    return res.status(500).send(netError("Error : only GET is allowed"));

  const { userId } = req.query;
  if (!userId)
    return res.status(500).send(netError("Error : userId is required"));
    
  if (!userId.toString().trim() || userId.length < 24)
    return res.status(500).send(netError("Error : userId has invalid format"));
    
  const userDisplay = await autoRetry(async () => {
    return await repoRtUserDisplayGetById(userId.toString());
  });
  if (!userDisplay)
    return res.status(500).send(netError("Error : user not found"));
    
  return res
    .status(200)
    .send(netSuccess("Successfully fetched user display ", userDisplay));
}
