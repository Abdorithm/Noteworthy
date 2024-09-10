import { Link } from "@remix-run/react";
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

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link to="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("Home")}
          </Link>
          <Link to="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("About")}
          </Link>
          <Link to="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("Contact")}
          </Link>
          <Link to="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <ModeToggle />
          </Link>
          <Link to="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            <LanguageSwitcher />
          </Link>
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
              <Link to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                {t("Home")}
              </Link>
              <Link to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                {t("About")}
              </Link>
              <Link to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                {t("Contact")}
              </Link>
              <Link to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <ModeToggle />
              </Link>
              <Link to="#" className="hover:text-foreground">
                <LanguageSwitcher />
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("My Profile")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t("Settings")}</DropdownMenuItem>
              <DropdownMenuItem>{t("Logout")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  )
}
