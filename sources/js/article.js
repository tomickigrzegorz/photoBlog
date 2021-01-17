import 'styles/modules/_article.scss';
import 'styles/style.scss';
import './modules/Observer';
import DisqusLoader from './modules/Disqusloader';
import ShareButton from './modules/ShareButton';
// import Zooom from './modules/zooom.umd.min';
// import ReadingTime from './modules/readingTime.umd.min';

document.addEventListener('DOMContentLoaded', () => {
  const sharebutton = new ShareButton();
  sharebutton.initial();

  const disqusloader = new DisqusLoader();
  disqusloader.initial();
});
