import { json, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { CircleUser, Menu } from "lucide-react"
import { LanguageSwitcher } from "~/components/languageSwitcher";
import { ModeToggle } from "~/components/mode-toggle";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet"
import { knownUser } from '~/gaurds.server';


export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const user = await knownUser(request);
  return json({ user });
};

export default function Home() {
  const data = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="font-medium hidden flex-col gap-6 text-lg md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <NavLink
            className={({ isActive, isPending }) =>
              isActive ? "text-rose-600" : isPending ? "text-foreground" : "text-muted-foreground"
            }
            to={"/feed"}
          >
            {t("Feed")}
          </NavLink>
          {!data.user && (
            <NavLink
              className={({ isActive, isPending }) =>
                isActive ? "text-rose-600" : isPending ? "text-foreground" : "text-muted-foreground"
              }
              to={"/login"}
            >
              {t("Log in")}
            </NavLink>
          )}
          {!data.user && (
            <NavLink
              className={({ isActive, isPending }) =>
                isActive ? "text-rose-600" : isPending ? "text-foreground" : "text-muted-foreground"
              }
              to={"/register"}
            >
              {t("Sign up")}
            </NavLink>
          )}
          <ModeToggle />
          <LanguageSwitcher />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <NavLink
                className={({ isActive, isPending }) =>
                  isActive ? "text-rose-600" : isPending ? "text-foreground" : "text-muted-foreground"
                }
                to={"/feed"}
              >
                {t("Feed")}
              </NavLink>
              {!data.user && (
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "text-rose-600" : isPending ? "text-foreground" : "text-muted-foreground"
                  }
                  to={"/login"}
                >
                  {t("Log in")}
                </NavLink>
              )}
              {!data.user && (
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "text-rose-600" : isPending ? "text-foreground" : "text-muted-foreground"
                  }
                  to={"/register"}
                >
                  {t("Sign up")}
                </NavLink>
              )}
              <ModeToggle />
              <LanguageSwitcher />
            </nav>
          </SheetContent>
        </Sheet>

        {/* This is the user menu */}
        {data.user && (
          <div className="flex w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{data.user.firstName} {data.user.lastName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "text-rose-600" : isPending ? "text-foreground" : "text-muted-foreground"
                  }
                  to={"/account"}
                >
                  <DropdownMenuItem>
                    {t("Account")}
                  </DropdownMenuItem>
                </NavLink>
                <NavLink
                  className={({ isActive, isPending }) =>
                    isActive ? "text-rose-600" : isPending ? "text-foreground" : "text-muted-foreground"
                  }
                  to={"/logout"}
                >
                  <DropdownMenuItem>
                    {t("Log out")}
                  </DropdownMenuItem>
                </NavLink>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
