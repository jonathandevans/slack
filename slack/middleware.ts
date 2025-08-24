import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicRoute = createRouteMatcher(["/"]);
const isAuthRoute = createRouteMatcher(["/sign-in", "/sign-up"]);

export default convexAuthNextjsMiddleware(async (request) => {
  const isAuthenticated = await isAuthenticatedNextjs();

  if (!(isPublicRoute(request) || isAuthRoute(request)) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/sign-in");
  }

  if (isAuthRoute(request) && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
