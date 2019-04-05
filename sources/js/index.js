// import './modules/snow';
import SmoothScroll from 'smooth-scroll';
import '../scss/modules/_gallery.scss';
import '../scss/modules/_grid.scss';
import '../scss/style.scss';
import './modules/ForeachPolyfill';
import backToTop from './modules/BackToTop';
import hamburgerMenu from './modules/HamburgerMenu';
import NavMenu from './modules/NavMenu';

document.addEventListener('DOMContentLoaded', () => {
  const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 300,
  });

  new NavMenu();

  hamburgerMenu();
  backToTop();
});
