(() => {
const KEY = "sirb-theme";
const root = document.documentElement;
let theme = null;
try {
theme = localStorage.getItem(KEY);
} catch (e) {
theme = null;
}
if (theme !== "light" && theme !== "dark") theme = "dark";
root.setAttribute("data-theme", theme);
document.addEventListener("DOMContentLoaded", () => {
const btn = document.getElementById("themeBtn");
if (!btn) return;
btn.addEventListener("click", () => {
theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
root.setAttribute("data-theme", theme);
try {
localStorage.setItem(KEY, theme);
} catch (e) {}
});
});
})();
