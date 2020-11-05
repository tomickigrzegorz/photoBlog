function scrollYProgression() {
  const scrollableHeight =
    window.document.body.scrollHeight - window.innerHeight;
  if (scrollableHeight <= 0) return 0;

  return window.scrollY / scrollableHeight;
}

function scrollHandler() {
  const progress = scrollYProgression();
  const bar = document.querySelector('#progress');
  bar.setAttribute('value', progress * 100);
}

window.addEventListener(
  'scroll',
  () => {
    window.requestAnimationFrame(scrollHandler);
  },
  { passive: true }
);

// export default ProgressBar;
