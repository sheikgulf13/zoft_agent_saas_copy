import Actions from "@/Components/phoneAgent/Actions";

export default function ToolCreationPage({
  darkMode,
  toggleDarkMode,
  toggleLightMode,
}: any) {
  if (typeof window === "undefined") {
    return <></>;
  }
  return <Actions />;
}
