import { MainNetworkResponse } from "../../base/data/Main";
import { repoRtTopicGet } from "../../base/repos/RtdbModules";

export async function serviceTopicGetAll({
  keyword,
  callback,
}: {
  keyword: string;
  callback?: (resp: MainNetworkResponse<string[]>) => void;
}): Promise<string[] | null> {
  try {
    const topics = await repoRtTopicGet();
    // console.log(topics);
    return topics;
  } catch (error) {
    console.log(error);
    return null;
  }
}
