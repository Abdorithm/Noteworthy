import { Moon, Sun } from "lucide-react";
import { Theme, useTheme } from "remix-themes";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export function ModeToggle() {
  const [theme, setTheme] = useTheme();
  const { t } = useTranslation();

  const toggleTheme = () => {
    setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === Theme.LIGHT ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">{t("Toggle theme")}</span>
    </Button>
  );
}
