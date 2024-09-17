import { createCookieSessionStorage } from "@remix-run/node"
import { createThemeSessionResolver } from "remix-themes"

// Secret key for the cookie session
const secret = process.env.COOKIE_SECRET;
if (!secret) {
  throw new Error("COOKIE_SECRET environment variable is not set");
}

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production"

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: [secret],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "noteworthy.abdorithm.tech", secure: true }
      : {}),
  },
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)

// Authentication session storage
const { commitSession, getSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "auth",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    sameSite: "lax",
    secrets: [secret],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "noteworthy.abdorithm.tech", secure: true }
      : {}),
  },
})

export const storeUserInSession = async (id: string) => {
  const session = await getSession();
  session.set("userId", id);
  const header = await commitSession(session);
  return header;
} 

export const getUserIdFromSession = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("userId");
}

export const destroyUserSession = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  const header = await destroySession(session);
  return header;
}