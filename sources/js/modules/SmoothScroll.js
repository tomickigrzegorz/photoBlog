const SmoothScroll = () => {
  const buttonTop = document.querySelector('.scroll');
  buttonTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
};

export default SmoothScroll;
