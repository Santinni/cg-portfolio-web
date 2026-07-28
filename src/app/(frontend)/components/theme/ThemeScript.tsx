const themeScript = `(() => {
  try {
    const stored = localStorage.getItem("codeguy-theme");
    const theme = stored === "light" || stored === "dark"
      ? stored
      : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
  } catch (_) {}
})();`

export function ThemeScript() {
	return <script dangerouslySetInnerHTML={{ __html: themeScript }} />
}
