import { COOKIE_USER_AUTH } from "./../utils/helpers/Constants";
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/write", "/profile"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const reqRoute = request.nextUrl.pathname;

  // check if user requested to access to protected routes without authenticating
  // a.k.a tresspassing
  //  by checking their cookies
  const userAuthCookie = request.cookies[COOKIE_USER_AUTH];
  //   If not authenticated
  if (!userAuthCookie) {
    //   matching requested route to the protected routes array
    const isTresspassing =
      protectedRoutes.filter((e) => {
        return reqRoute.toLowerCase().includes(e.toLowerCase());
      }).length > 0;
    //   if tresspassing
    // redirect to auth
    if (isTresspassing)
      return NextResponse.redirect(new URL("/auth", request.url));
  }
  // if already logged in
  // AND requested `/auth`
  // then redirect to profile
  if (reqRoute === "/auth")
    return NextResponse.redirect(new URL("/profile/choosetopic", request.url));
  return NextResponse.next();
}
