import 'styles/modules/_article.scss';
import 'styles/style.scss';
import './modules/Observer';
import DisqusLoader from './modules/Disqusloader';
import ShareButton from './modules/ShareButton';
import './modules/zooom.umd.min';
import './modules/readingTime.umd.min';

document.addEventListener('DOMContentLoaded', () => {
  const sharebutton = new ShareButton();
  sharebutton.initial();

  const disqusloader = new DisqusLoader();
  disqusloader.initial();

  new Zooom('zooom', {
    zIndex: 9,
    animationTime: 300,
    cursor: {
      in: 'zoom-in',
      out: 'zoom-out',
    },
    overlay: {
      color: '#f5f5f5',
      opacity: 100,
    },
  });

  new ReadingTime({
    wordsPerMinute: 215,
    elements: ['.article__text', 'figcaption'],

    template: function (minutes, words) {
      const element = document.querySelector('.reading-time');
      const text = minutes > 1 ? 'minut czytania' : 'minuta czytania';
      element.innerHTML = `~${minutes} ${text} (słów: ${words})`;
    },
  });
});
