import { MainApiResponse } from "../../base/data/Main";
import { repoRtTopicGet } from "../../base/repos/RtdbModules";

export async function serviceTopicGetAll({
  data,
  callback,
}: MainApiResponse<{ keyword: string }, string[]>): Promise<string[] | null> {
  try {
    const topics = await repoRtTopicGet();
    // console.log(topics);
    return topics;
  } catch (error) {
    console.log(error);
    return null;
  }
}
