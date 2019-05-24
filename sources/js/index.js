// import './modules/snow';
import SmoothScroll from 'smooth-scroll';
import '../scss/modules/_gallery.scss';
import '../scss/modules/_grid.scss';
import '../scss/style.scss';
import './modules/Observer';
import backToTop from './modules/BackToTop';
import NavMenu from './modules/NavMenu';

document.addEventListener('DOMContentLoaded', () => {
  const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 100,
  });

  new NavMenu();

  backToTop();
});
