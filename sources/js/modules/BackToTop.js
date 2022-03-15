const backToTop = document.querySelector(".scroll");
const BackToTop = () => {
  window.addEventListener("scroll", () => {
    const pageyoffset =
      window.pageYOffset || document.documentElement.scrollTop;
    backToTop.style.display = pageyoffset > 200 ? "block" : "none";
  });
};

export default BackToTop;
