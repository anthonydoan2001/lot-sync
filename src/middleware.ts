import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAuthPage = createRouteMatcher(["/auth"]);
const isProtectedRoute = createRouteMatcher([
  "/",
  "/active/:path*",
  "/history/:path*",
  "/manual",
]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const authed = await convexAuth.isAuthenticated();
  if (isAuthPage(request) && authed) {
    return nextjsMiddlewareRedirect(request, "/active/pallets");
  }
  if (isProtectedRoute(request) && !authed) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
