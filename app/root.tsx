import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import i18next from "./localization/i18n.server";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next/react";
import { returnLanguageIfSupported } from "./localization/resource";
import clsx from "clsx"
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "remix-themes" 
import { themeSessionResolver } from "./sessions.server"

export async function loader({ request, params }: LoaderFunctionArgs) {
  const lang = returnLanguageIfSupported(params.lang);
    const locale = lang ?? (await i18next.getLocale(request));

  const { getTheme } = await themeSessionResolver(request)

  return json({
    locale,
    theme: getTheme(),
  });
}

export const handle = {
    // In the handle export, we can add a i18n key with namespaces our route
    // will need to load. This key can be a single string or an array of strings.
    // TIP: In most cases, you should set this to your defaultNS from your i18n config
    // or if you did not set one, set it to the i18next default namespace "translation"
    i18n: "common",
};

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  )
}

export function App() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
  const { locale } = data;
  const { i18n } = useTranslation();
  useChangeLanguage(locale);
  const [theme] = useTheme()

  return (
    <html lang={locale} dir={i18n.dir()} className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}