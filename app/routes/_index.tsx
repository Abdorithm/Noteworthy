import type { MetaFunction } from "@remix-run/node";
import { Dashboard } from "~/components/dashboard-04";

export const meta: MetaFunction = () => {
  return [
    { title: "Noteworthy" },
    { name: "description", content: "Welcome to Noteworthy!" },
  ];
};

export default function Index() {
  return (
    <Dashboard />
  );
  // return (
  //   <div className="font-sans p-4">
  //     <h1 className="text-3xl">{t("Hello")}</h1>
  //     <LanguageSwitcher/> 
  //     <ModeToggle/>
  //   </div>
  // );
}
