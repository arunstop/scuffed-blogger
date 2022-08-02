import { ref, set } from "firebase/database";
import uaParser from "ua-parser-js";
import { UserModel, UserSession } from "../../data/models/UserModel";
import { firebaseClient } from "./FirebaseClient";
// Modules for realtime database

const db = firebaseClient.rtdb;

//  update latest data to be the indentifier if the firestore data has changed or not
// so obsolete data on other machine would update
export async function rtdbSessionLatestSet(user: UserModel) {
  const path = `sessionList/${encodeURIComponent(user.id || "")}/_LATEST/`;
  const data = {
    ...user.session,
    userLastUpdated: user.dateUpdated,
  } as UserSession;
  const newRef = ref(db, path);
  await set(newRef, data);
  return data;
}

export async function rtdbSessionAdd(user: UserModel) {
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
  const latestSession = await rtdbSessionLatestSet(userWithSession);
  return userWithSession;
}

// UPDATE session to notice other instance if the user data has changed or not
// export async function rtdbSessionUpdate(user: UserModel) {
//   const lastLoginAt = (user.localAuthData?.metadata as any).lastLoginAt;
//   const sessionId = `SESSION_${lastLoginAt}`;
//   // create new ref
//   const newRef = ref(
//     db,
//     `sessionList/${encodeURIComponent(user.id || "")}/${sessionId}`,
//   );
//   //   get userAgent
//   const userAgent = uaParser(navigator.userAgent);
//   //   create new user session
//   const userSession: UserSession = {
//     id: sessionId,
//     userId: user.id,
//     os: `${userAgent.os.name} ${userAgent.os.version}`,
//     browser: `${userAgent.browser.name} v.${userAgent.browser.version}`,
//     time: lastLoginAt,
//     userLastUpdated: user.dateUpdated,
//   };
//   //   console.log(userSession);
//   await push(newRef, userSession);
//   return rtdbSessionLatestSet(user);
// }
