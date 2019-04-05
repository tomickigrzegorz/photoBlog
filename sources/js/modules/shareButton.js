import '../../scss/modules/_share-button.scss';
import { shareButtonOptions } from '../helpers/constants';

class ShareButton {
  constructor() {
    this.option = shareButtonOptions;
    this.init();
  }

  init() {
    this.renderHTML();
    this.eventButton();
  }

  renderHTML() {
    const placeStick = document.getElementById(this.option.place.stick);
    const placeBottom = document.getElementById(this.option.place.bottom);

    if (placeStick || placeBottom) {
      placeStick.innerHTML = this.htmlTemplate(this.option.place.stick);
      placeBottom.innerHTML = this.htmlTemplate(this.option.place.bottom);
    }
  }

  htmlTemplate(place) {
    const social = {
      facebook:
        '<svg class="share__icon share__btn--facebook"><use xlink:href="#share-icon-facebook"></use></svg>',
      twitter:
        '<svg class="share__icon share__btn--twitter"><use xlink:href="#share-icon-twitter"></use></svg>',
      mail:
        '<svg class="share__icon share__btn--mail"><use xlink:href="#share-icon-mail"></use></svg>',
      add:
        '<svg class="share__icon share__btn--add"><use xlink:href="#share-icon-add-opinion"></use></svg>',
    };

    const addComment =
      place === 'share-button-bottom'
        ? ''
        : '<div title="Dodaj opinię." data-share="opinion" class="share__btn share__btn--add-opinion"><span class="share__btn--wrapper">Dodaj komentarz</span></div>';

    const html = `
        <h3>${this.option.title}</h3>
        <div class="share fl">
            <div title="Udostępnij w serwisie Facebook. Strona otworzy się w nowym oknie." data-share="facebook" class="share__btn btn-facebook">
                <span class="share__btn--wrapper">${social.facebook}</span>
            </div>
            <div title="Udostępnij w serwisie Twitter. Strona otworzy się w nowym oknie." data-share="twitter" class="share__btn btn-twitter">
                <span class="share__btn--wrapper">${social.twitter}</span>
            </div>
            <div title="Wyślij maila." data-share="mail" class="share__btn btn-mail">
                <span class="share__btn--wrapper">${social.mail}</span>
            </div>
            ${addComment}
        </div>
        `;
    return html;
  }

  eventButton() {
    const buttonShare = document.querySelectorAll('.share__btn');
    const winWidth = 520;
    const winHeight = 320;
    const winTop = screen.height / 2 - winHeight / 2;
    const winLeft = screen.width / 2 - winWidth / 2;

    buttonShare.forEach(el => {
      const typeSocial = el.getAttribute('data-share');
      el.addEventListener('click', () => {
        if (typeSocial === 'print') {
          window.print();
        } else if (typeSocial === 'opinion') {
          const h = document.body.scrollHeight;
          window.scrollTo(0, h);
          document.querySelectorAll('.comments-button')[0].click();
        } else if (typeSocial === 'mail') {
          const mailtoLink = `mailto:?subject=Zobacz może Ci się spodoba&body=${this.getTitle()} %20%0A ${this.getUrl()}`;
          const win = window.open(mailtoLink, 'mail');
          setTimeout(function() {
            win.close();
          }, 500);
        } else {
          window.open(
            this.showShareLink(typeSocial),
            'sharer',
            `top=${winTop}, left=${winLeft}, toolbar=0, status=0, width=${winWidth}, height=${winHeight}`
          );
        }
      });
    });
  }

  showShareLink(typeSocial) {
    let url;
    switch (typeSocial) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${this.getUrl()}&p=${this.getDescription()}`;
        break;
      case 'twitter':
        url = `http://twitter.com/share?text=${this.getTitle()}&url=${this.getUrl()}`;
        break;
      default:
        break;
    }
    return url;
  }

  static getUrl() {
    return window.location.href;
  }

  static getTitle() {
    return document.title;
  }

  static getDescription() {
    let description;
    const meta = document.getElementsByTagName('meta');

    for (let x = 0, y = meta.length; x < y; x++) {
      if (meta[x].name.toLowerCase() === 'description') {
        description = meta[x];
      }
    }
    const content = description.content.replace(/ /g, '%20');
    return content;
  }
}

export default ShareButton;
