import { ref, set } from "firebase/database";
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
  userLastUpdated: number;
}

const db = firebaseClient.rtdb;

//  update latest data to be the indentifier if the firestore data has changed or not
// so obsolete data on other machine would update
export async function rtdbSessionLatestSet({
  user,
  session,
}: {
  user: UserModel;
  session?: UserSession;
}) {
  let path = `sessionList/${encodeURIComponent(user.id || "")}/_LATEST/`;
  let data: UserSession | number = {
    ...session,
    userLastUpdated: user.dateUpdated,
  } as UserSession;
  //   if no session params, only update the `userLastUpdated` props
  if (!session) {
    path = `sessionList/${encodeURIComponent(
      user.id || "",
    )}/_LATEST/userLastUpdated`;
    data = user.dateUpdated;
  }
  console.log(path);
  const newRef = ref(db, path);
  await set(newRef, data);
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
  await rtdbSessionLatestSet({ user, session });
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
