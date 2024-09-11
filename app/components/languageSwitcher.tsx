import { Link, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { supportedLanguages } from "~/localization/resource";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const location = useLocation();
  const currentPath = location.pathname;

  const getNewPath = (lang: string) => {
    const newPath = currentPath.replace(/^\/(en|ar)/, `/${lang}`);
    return newPath;
  };

  return (
    <>
      {currentLanguage === supportedLanguages[0] ? (
        <Link to={getNewPath("ar")} onClick={() => i18n.changeLanguage("ar")}>
          <Button>العربية</Button>
        </Link>
      ) : (
        <Link to={getNewPath("en")} onClick={() => i18n.changeLanguage("en")}>
          <Button>English</Button>
        </Link>
      )}
    </>
  );
};

export { LanguageSwitcher };