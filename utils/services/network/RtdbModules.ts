import { push, ref } from "firebase/database";
import uaParser from "ua-parser-js";
import { UserModel } from "../../data/models/UserModel";
import { firebaseClient } from "./FirebaseClient";
// Modules for realtime database

interface UserSession {
  id: string;
  userId: string;
  os: string;
  browser: string;
  time: number;
  userLastUpdated:number;
}

const db = firebaseClient.rtdb;

export function rtdbSessionAdd(user: UserModel) {
  const lastLoginAt = (user.localAuthData?.metadata as any).lastLoginAt;
  const sessionId = `SESSION_${lastLoginAt}`;
  // create new ref
  const newRef = ref(
    db,
    `sessionList/${encodeURIComponent(user.id || "")}/${sessionId}`,
  );
  //   get userAgent
  const userAgent = uaParser(navigator.userAgent);
  //   create new user session
  const userSession: UserSession = {
    id: sessionId,
    userId: user.id,
    os: `${userAgent.os.name} ${userAgent.os.version}`,
    browser: `${userAgent.browser.name} v.${userAgent.browser.version}`,
    time: lastLoginAt,
    userLastUpdated:user.dateUpdated,
  };
  //   console.log(userSession);
  return push(newRef, userSession);
}
