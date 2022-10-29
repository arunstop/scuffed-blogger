import { get, ref, set, update } from "firebase/database";
import { firebaseClient } from "../../clients/FirebaseClient";
import { UserModel, UserSession } from "../../data/models/UserModel";
import uaParser from "ua-parser-js";

function getRtdb() {
  return firebaseClient.rtdb;
}

export interface UserDisplayModel {
  id: string;
  name: string;
  avatar: string;
  username: string;
}

export async function repoRtUserDisplayGetById(userId: string) {
  const path = `userDisplayList/${userId}`;
  const rr = ref(getRtdb(), path);
  const res = await get(rr);
  if (!res.exists()) return null;
  const dataRaw = res.val();
  const data = dataRaw as UserDisplayModel;
  return data;
}

export async function repoRtUserDisplayAdd(userDisplay: UserDisplayModel) {
  const path = `userDisplayList/${userDisplay.id}`;
  const rr = ref(getRtdb(), path);
  return await set(rr, userDisplay);
}

export async function repoRtUserDisplayUpdate(userDisplay: UserDisplayModel) {
  const path = `userDisplayList/${userDisplay.id}`;
  const rr = ref(getRtdb(), path);
  return await update(rr, userDisplay);
}


//  update latest data to be the indentifier if the firestore data has changed or not
// so obsolete data on other machine would update
export async function repoRtUserSessionLatestSet(user: UserModel) {
  const path = `sessionList/${encodeURIComponent(user.id || "")}/_LATEST/`;
  const data = {
    ...user.session,
    userLastUpdated: user.dateUpdated,
  } as UserSession;
  const newRef = ref(getRtdb(), path);
  await set(newRef, data);
  return data;
}

// RETURN a UserModel
export async function repoRtUserSessionAdd(user: UserModel): Promise<UserModel> {
  const lastLoginAt = (user.localAuthData?.metadata as any).lastLoginAt;
  const sessionId = `SESSION_${lastLoginAt}`;
  // create new ref
  const newRef = ref(
    getRtdb(),
    `sessionList/${encodeURIComponent(user.id || "")}/${sessionId}`,
  );
  //   get userAgent
  const userAgent = uaParser(navigator.userAgent);
  //   create new user session
  const session: UserSession = {
    id: sessionId,
    userId: user.id,
    os: `${userAgent.os.name} ${userAgent.os.version}`,
    browser: `${userAgent.browser.name} v.${userAgent.browser.version}`,
    time: lastLoginAt,
    userLastUpdated: user.dateUpdated,
  };
  await set(newRef, session);
  const userWithSession = { ...user, session: session };
  await repoRtUserSessionLatestSet(userWithSession);
  return userWithSession;
}
