import { MainNetworkResponse } from "../../../../base/data/Main";
import { rtdbTopicGet } from "../RtdbModules";

export async function fbTopicGetAll({
  keyword,
  callback,
}: {
  keyword: string;
  callback?: (resp: MainNetworkResponse<string[]>) => void;
}): Promise<string[]> {
  try {
    const topics = await rtdbTopicGet();
    // console.log(topics);
    return topics;
  } catch (error) {
    console.log(error);
    return [];
  }
}
