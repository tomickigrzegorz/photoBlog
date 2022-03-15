const toggleSwitch = document.querySelector(".theme");

toggleSwitch.addEventListener("click", () => {
  const currentTheme = localStorage.getItem("theme");
  const typeTheme = currentTheme === "dark" ? "light" : "dark";
  toggleSwitch.setAttribute(
    "aria-label",
    `zmień motyw na ${currentTheme === "dark" ? "dark" : "light"}`
  );
  document.body.setAttribute("data-theme", typeTheme);
  localStorage.setItem("theme", typeTheme);
});
