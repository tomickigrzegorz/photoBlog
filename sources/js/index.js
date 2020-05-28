/* eslint-disable import/no-unresolved */
import 'Styles/modules/_gallery.scss';
import 'Styles/modules/_grid.scss';
import 'Styles/style.scss';
import './modules/Observer';
import mail from './modules/Mail';
import backToTop from './modules/BackToTop';
import smoothScroll from './modules/SmoothScroll';

document.addEventListener('DOMContentLoaded', () => {
  mail();
  backToTop();
  smoothScroll();
});
