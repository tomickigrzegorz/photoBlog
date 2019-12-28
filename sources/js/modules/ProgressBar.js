const ProgressBar = () => {
  window.addEventListener('scroll', () => {
    const ws = window.pageYOffset;
    const wh = window.innerHeight;
    const dh = document.body.clientHeight;
    const scrollPercent = (ws / (dh - wh)) * 100;
    const progressBar = document.querySelector('#progress');
    if (ws > 50) {
      progressBar.setAttribute('style', `width:${scrollPercent}%`);
    } else {
      progressBar.removeAttribute('style');
    }
  });
};

export default ProgressBar;
