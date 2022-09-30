import { get, ref, set, update } from "firebase/database";
import { firebaseClient } from "../../clients/FirebaseClient";
function getRtdb() {
  return firebaseClient.rtdb;
}

export interface UserDisplayModel {
  id: string;
  name: string;
  avatar: string;
  username: string;
}

export async function rtUserDisplayGetById(userId: string) {
  const path = `userDisplayList/${userId}`;
  const rr = ref(getRtdb(), path);
  const res = await get(rr);
  if (!res.exists()) return null;
  const dataRaw = res.val();
  const data = dataRaw as UserDisplayModel;
  console.log("data", data);
  return data;
}

export async function rtUserDisplayAdd(userDisplay: UserDisplayModel) {
  const path = `userDisplayList/${userDisplay.id}`;
  const rr = ref(getRtdb(), path);
  return await set(rr, userDisplay);
}

export async function rtUserDisplayUpdate(userDisplay: UserDisplayModel) {
  const path = `userDisplayList/${userDisplay.id}`;
  const rr = ref(getRtdb(), path);
  return await update(rr, userDisplay);
}