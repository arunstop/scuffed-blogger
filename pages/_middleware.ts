import { COOKIE_USER_AUTH } from "./../utils/helpers/Constants";
// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isUserModel } from "../utils/data/models/UserModel";

const protectedRoutes = ["/write", "/profile"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const reqRoute = request.nextUrl.pathname;

  // check if user requested to access to protected routes without authenticating
  // a.k.a tresspassing
  //  by checking their cookies
  const auth = request.cookies[COOKIE_USER_AUTH];
  let isValid;
  try {
    isValid = isUserModel(JSON.parse(auth) as unknown);
  } catch {
    isValid = false;
  }
  
  //   matching requested route to the protected routes array
  const isTresspassing =
    protectedRoutes.filter((e) => {
      return reqRoute.toLowerCase().includes(e.toLowerCase());
    }).length > 0;
  // if invalid
  if (!isValid) {
    //   if tresspassing, then redirect to auth
    if (isTresspassing)
      return NextResponse.redirect(new URL("/auth", request.url));
    //   if not trespassing, then don't redirect
    return NextResponse.next();
  }
  // if valid
  const onAuthPage = reqRoute.toLowerCase().includes("/auth");
  // if valid and accessing /auth, then redirect to profile
  if (onAuthPage)
    return NextResponse.redirect(new URL("/profile/choosetopic", request.url));
  // if not accessing auth, then don't redirect
  return NextResponse.next();
}
