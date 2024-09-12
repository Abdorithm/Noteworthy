import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "~/components/languageSwitcher";
import { ModeToggle } from "~/components/mode-toggle";
import { Button } from "~/components/ui/button"

export default function Index() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <h1 className="text-4xl font-bold mb-4">Noteworthy</h1>
      <p className="text-center max-w-md mb-8">
        {t("Journaling redefined!")}
        <br />
        {t("Whether you want a personal diary or a platform to share your journey with the world, You're in the right place!")}
      </p>
      <div className="mb-2">
        <Link to="/feed">
          <Button variant="outline" className="m-2">{t("Feed")}</Button>
        </Link>
        <Link to="/register">
          <Button variant="default" className="m-2">{t("Sign up")}</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" className="m-2">{t("Log in")}</Button>
        </Link>
      </div>
      <div className="mb-2">
        <ModeToggle />
      </div>
      <LanguageSwitcher />
      <br />
      <Link to="/cookieusage" className="text-blue-500 hover:text-blue-700 underline">
        {t("Cookie usage")}
      </Link>
    </div>
  )
}
