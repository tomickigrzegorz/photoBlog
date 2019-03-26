import './modules/foreachPolyfill';
import ScrollerTop from './modules/scrolltop';
import NavMenu from './modules/nav';
import ShareButton from './modules/shareButton';

import DisqusLoader from './modules/disqusLoader';
import './modules/lazy';

import '../../sources/scss/style.scss';
import '../../sources/scss/modules/_article.scss';


document.addEventListener('DOMContentLoaded', () => {

  const navOptoins = {
    navHeaderMenu: 'header-menu',
    navContact: '#contact',
    navPortfolio: '#portfolio'
  };

  new NavMenu(navOptoins);

  const shareButtonOptions = {
    place: {
      stick: 'share-button-stick',
      bottom: 'share-button-bottom'
    },
    title: 'Podziel się:'
  };

  new ShareButton(shareButtonOptions);

  const scrollerOptions = {
    showButtonAfter: 200,
    animate: 'normal',
    normal: {
      steps: 20,
      ms: 10
    },
    linear: {
      px: 30,
      ms: 10
    }
  };

  new ScrollerTop(scrollerOptions);

  const disqusOptions = {
    disqusThread: 'disqus_thread',
    commentsButton: 'comments-button',
    buttonName: 'dodaj / pokaż komentarze',
    disqusShortName: 'bloggrzegorztomickipl'
  };

  new DisqusLoader(disqusOptions);

});