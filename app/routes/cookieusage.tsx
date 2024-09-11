import { LoaderFunction } from '@remix-run/node';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from "~/components/languageSwitcher";
import { ModeToggle } from "~/components/mode-toggle";

export const loader: LoaderFunction = async () => {

  return {

  };
};

export default function CookieUsage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">Noteworthy&apos;s Cookie Usage</h1>
      <p className="m-2">
        {t("This website uses cookies to ensure you get the best experience.")}
        <br />
        {t("Our usage is minimal. We use cookies to:")}
      </p>
      <ul className="list-disc m-2">
        <li>{t("Remember & honor your theme preference.")}</li>
        <li>{t("Keep you logged in to Noteworthy.")}</li>
      </ul>
      <div className="m-2">
        <ModeToggle />
      </div>
      <LanguageSwitcher />
    </div>
  );
}