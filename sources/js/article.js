import 'styles/modules/_article.scss';
import 'styles/style.scss';
import './modules/Observer';
import DisqusLoader from './modules/Disqusloader';
import ShareButton from './modules/ShareButton';
import mail from './modules/Mail';
import backToTop from './modules/BackToTop';
import smoothScroll from './modules/SmoothScroll';

document.addEventListener('DOMContentLoaded', () => {
  const sharebutton = new ShareButton();
  sharebutton.initial();

  const disqusloader = new DisqusLoader();
  disqusloader.initial();

  mail();
  backToTop();
  smoothScroll();
});
