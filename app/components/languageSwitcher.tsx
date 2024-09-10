import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { supportedLanguages } from "~/localization/resource";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  console.log(currentLanguage);
  return (
    <>
      {currentLanguage === supportedLanguages[0] ? (
        <Link to="/ar" onClick={() => i18n.changeLanguage("ar")}>
          <Button>العربية</Button>
        </Link>
      ) : (
        <Link to="/en" onClick={() => i18n.changeLanguage("en")}>
          <Button>English</Button>
        </Link>
      )}
    </>
  );
};

export { LanguageSwitcher };