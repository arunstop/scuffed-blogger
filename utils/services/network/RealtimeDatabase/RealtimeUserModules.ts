import { get, ref, set, update } from "firebase/database";
import { firebaseClient } from "./../FirebaseClient";
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
  const path = `userDisplay/${userId}`;
  const rr = ref(getRtdb(), path);
  const res = await get(rr);
  if (!res.exists()) return null;
  const dataRaw = res.val();
  const data = dataRaw as UserDisplayModel;
  return data;
}

export async function rtUserDisplayAdd(userDisplay: UserDisplayModel) {
  const path = `userList/${userDisplay.id}`;
  const rr = ref(getRtdb(), path);
  return await set(rr, userDisplay);
}

export async function rtUserDisplayUpdate(userDisplay: UserDisplayModel) {
  const path = `userList/${userDisplay.id}`;
  const rr = ref(getRtdb(), path);
  return await update(rr, userDisplay);
}
