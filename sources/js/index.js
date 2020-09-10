/* eslint-disable import/no-unresolved */
import 'styles/modules/_gallery.scss';
import 'styles/modules/_grid.scss';
import 'styles/style.scss';
import './modules/Observer';
import mail from './modules/Mail';
import backToTop from './modules/BackToTop';
import smoothScroll from './modules/SmoothScroll';

document.addEventListener('DOMContentLoaded', () => {
  mail();
  backToTop();
  smoothScroll();
});
