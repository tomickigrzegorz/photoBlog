export const BackToTop = () => {
  const backToTop = document.querySelector(".scroll");
  window.addEventListener("scroll", () => {
    const pageyoffset = window.scrollY || document.documentElement.scrollTop;
    backToTop.style.display = pageyoffset > 200 ? "block" : "none";
  });
};
