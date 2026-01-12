export function ThemeToggle({
  theme,
  toggle,
}: {
  theme: "light" | "dark";
  toggle: () => void;
}) {
  return (
    <button className="theme-toggle" onClick={toggle}>
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
