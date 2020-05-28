/* eslint-disable import/no-unresolved */
import 'Styles/modules/_article.scss';
import 'Styles/style.scss';
import './modules/Observer';
import DisqusLoader from './modules/Disqusloader';
import ShareButton from './modules/ShareButton';
import mail from './modules/Mail';
import backToTop from './modules/BackToTop';
import smoothScroll from './modules/SmoothScroll';

document.addEventListener('DOMContentLoaded', () => {
  const sharebutton = new ShareButton();
  sharebutton.renderHTML();

  const disqusloader = new DisqusLoader();
  disqusloader.init();

  mail();
  backToTop();
  smoothScroll();
});
