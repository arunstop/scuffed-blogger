import { netError, netSuccess } from "./../../base/data/Main";
import { MainApiResponse } from "../../base/data/Main";
import {
  ITopic,
  repoRtTopicGet,
} from "../../base/repos/realtimeDb/RealtimeTopicRepo";

export async function serviceTopicGetAll({
  data,
  callback,
}: MainApiResponse<
  { keyword: string; abortSignal?: AbortSignal },
  string[] | null
>): Promise<string[] | null> {
  const { keyword, abortSignal } = data;
  try {
    const topics = await repoRtTopicGet(keyword, abortSignal).then((res) => {
      const topics = res.data.data as ITopic[];
      if (!topics.length) return [];
      const strTopics = topics.map((topic) => topic.name);
      callback?.(netSuccess(res.data.message, strTopics));
      return strTopics;
    });
    return topics;
  } catch (error) {
    console.log(error);
    callback?.(netError(error as string, null));
    return null;
  }
}
