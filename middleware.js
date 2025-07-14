//import { clerkMiddleware , createRouteMatcher, redirectToSignIn } from '@clerk/nextjs/server';
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { redirectToSignIn } from "@clerk/nextjs"; // 👈 must come from here

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)', 
  '/events(.*)', 
  '/meetings(.*)', 
  '/availability(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
 
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Allow access if the user is logged in
  return;
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};