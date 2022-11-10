import { NextRequest, NextResponse } from "next/server";
import { isUserModel } from "./base/data/models/UserModel";
import { COOKIE_USER_AUTH } from "./app/helpers/Constants";

const protectedRoutes = ["/write", "/user/posts", "/auth", "/profile"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname.toLowerCase().split("/");

    // check if user requested to access to protected routes without authenticating
    // a.k.a tresspassing
    //  by checking their cookies
    const auth = request.cookies.get(COOKIE_USER_AUTH) || "";
    let isCookieValid;
    try {
      isCookieValid = isUserModel(JSON.parse(auth) as unknown);
    } catch {
      isCookieValid = false;
    }

    //   matching requested route to the protected routes array
    const isTresspassing =
      protectedRoutes.filter((e) => {
        return pathname.includes(e.toLowerCase().substring(1));
      }).length > 0;
    const onAuthPage = pathname.includes("auth");
    // if invalid
    if (!isCookieValid) {
      //   if tresspassing and not on auth page, then redirect to auth
      if (isTresspassing && !onAuthPage)
        return NextResponse.redirect(new URL("/auth", request.url));
      //   if not trespassing, then don't redirect
      return NextResponse.next();
    }
    // if valid
    // if valid and accessing /auth, then redirect to profile
    if (onAuthPage) return NextResponse.redirect(new URL("/", request.url));
    // if not accessing auth, then don't redirect
    return NextResponse.next();
  } catch (e) {
    console.error(e);
    NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: protectedRoutes,
};
