import SmoothScroll from 'smooth-scroll';
import '../scss/modules/_article.scss';
import '../scss/style.scss';
import './modules/Observer';
import backToTop from './modules/BackToTop';
import DisqusLoader from './modules/Disqusloader';
import NavMenu from './modules/NavMenu';
import ShareButton from './modules/ShareButton';

document.addEventListener('DOMContentLoaded', () => {
  const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 100,
  });

  new NavMenu();

  new ShareButton();

  new DisqusLoader();

  backToTop();
});
