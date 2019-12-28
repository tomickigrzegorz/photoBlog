// import './modules/snow';
import SmoothScroll from 'smooth-scroll';
import '../scss/modules/_gallery.scss';
import '../scss/modules/_grid.scss';
import '../scss/style.scss';
import './modules/Observer';
import backToTop from './modules/BackToTop';
import mail from './modules/Mail';
import './modules/snow';
// import NavMenu from './modules/NavMenu';

document.addEventListener('DOMContentLoaded', () => {
  const option = {
    speed: 100,
    easing: 'easeOutCubic',
  };
  const scroll = new SmoothScroll('.scroll', option);

  // const navMenu = new NavMenu();
  // navMenu.addToHeaderMenu();

  mail();
  backToTop();
});
