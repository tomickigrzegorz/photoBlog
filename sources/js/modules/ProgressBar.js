// const ProgressBar = () => {
//   window.addEventListener('scroll', () => {
//     const ws = window.pageYOffset;
//     const wh = window.innerHeight;
//     const dh = document.body.clientHeight;
//     const scrollPercent = (ws / (dh - wh)) * 100;
//     const progressBar = document.querySelector('#progress');
//     if (ws > 50) {
//       progressBar.setAttribute('style', `width:${scrollPercent}%`);
//     } else {
//       progressBar.removeAttribute('style');
//     }
//   });
// };

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
  function(ev) {
    window.requestAnimationFrame(scrollHandler);
  },
  { passive: true }
);

// export default ProgressBar;
