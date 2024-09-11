import { User } from "@prisma/client"
import { createCookieSessionStorage } from "@remix-run/node"
import { createThemeSessionResolver } from "remix-themes"

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production"

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["NjqhlEguQREYKTT3k83vtg3AxrmKnZ3wcr3t"],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)

// Authentication session storage
const { commitSession, getSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "auth",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["8Eg3uKhjq9AxgrT3lgVEYtKaZTwcr3QNk3vt"],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
})

export const storeUserInSession = async (user: Pick<User, "id">) => {
  const session = await getSession();
  session.set("userId", user.id);
  const header = await commitSession(session);
  return header;
} 

export const destroyUserSession = async () => {
  const session = await getSession();
  const header = await destroySession(session);
  return header;
}