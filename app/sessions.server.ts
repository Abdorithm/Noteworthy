import { createCookieSessionStorage } from "@remix-run/node"
import { createThemeSessionResolver } from "remix-themes"

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production"

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["NjqhlEguQREYKTT3k83vtg3AxrmKnZ3wcr3t"],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "abdorithm.tech", secure: true }
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
    secrets: ["8Eg3uKhjq9AxgrT3lgVEYtKaZTwcr3QNk3vt"],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "abdorithm.tech", secure: true }
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