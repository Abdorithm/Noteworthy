import { LoaderFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from "~/components/languageSwitcher";
import { ModeToggle } from "~/components/mode-toggle";

export const loader: LoaderFunction = async () => {

  return {

  };
};

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <Link to="#"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        {t("About")}
      </Link>
      <LanguageSwitcher />
      <ModeToggle />
    </div>
  );
}