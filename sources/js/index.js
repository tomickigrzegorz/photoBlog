import './modules/foreachPolyfill';
import ScrollerTop from './modules/scrolltop';
import NavMenu from './modules/nav';
// import './modules/snow';


import '../../sources/scss/style.scss';
import '../../sources/scss/modules/_gallery.scss';
import '../../sources/scss/modules/_grid.scss';


document.addEventListener('DOMContentLoaded', () => {

  const navOptoins = {
    navHeaderMenu: 'header-menu',
    navContact: '#contact',
    navPortfolio: '#portfolio'
  };

  new NavMenu(navOptoins);

  const options = {
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

  new ScrollerTop(options);

});