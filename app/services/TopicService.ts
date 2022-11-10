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
  string[]
>): Promise<string[] | null> {
  const { keyword, abortSignal } = data;
  try {
    const topics = await repoRtTopicGet(keyword, abortSignal).then((e) => {
      const res = e.data as ITopic[];
      if (!res.length) return [];
      return res.map((topic) => topic.name);
    });
    return topics;
  } catch (error) {
    console.log(error);
    return null;
  }
}
