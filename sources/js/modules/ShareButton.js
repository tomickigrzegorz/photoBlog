const shareButtonOptions = {
  place: {
    stick: 'share-button-stick',
    bottom: 'share-button-bottom',
  },
  title: 'Podziel się',
};

class ShareButton {
  constructor() {
    this.option = shareButtonOptions;
    this.getTitle = document.title;
    this.getUrl = window.location.href;

    this.shareData = {
      title: this.getTitle,
      text: `📸 ${this.getDescription()}`,
      url: this.getUrl,
    };
  }

  initial() {
    const placeStick = document.getElementById(this.option.place.stick);
    const placeBottom = document.getElementById(this.option.place.bottom);

    if (placeStick || placeBottom) {
      placeStick.innerHTML =
        navigator.share && this.isMobile()
          ? this.shareButtonNavigation()
          : this.htmlTemplate();
      placeBottom.innerHTML =
        navigator.share && this.isMobile()
          ? this.shareButtonNavigation()
          : this.htmlTemplate();
    }

    if (navigator.share && this.isMobile()) {
      const btns = document.querySelectorAll('.social-buttons__btn');
      for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', async () => {
          try {
            await navigator.share(this.shareData);
          } catch (err) {
            console.log(err);
          }
        });
      }
    } else {
      this.handlerEvent();
    }
  }

  isMobile() {
    // sprawdzenie czy jest mobilny
    let hasTouchScreen = false;
    if ('maxTouchPoints' in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ('msMaxTouchPoints' in navigator) {
      hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
      let mQ = window.matchMedia && matchMedia('(pointer:coarse)');
      if (mQ && mQ.media === '(pointer:coarse)') {
        hasTouchScreen = !!mQ.matches;
      } else if ('orientation' in window) {
        hasTouchScreen = true; // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        let UA = navigator.userAgent;
        hasTouchScreen =
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
      }
    }

    return hasTouchScreen;
  }

  htmlTemplate() {
    const social = {
      facebook:
        '<svg class="share-icon"><use xlink:href="#facebook-icon"></use></svg>',
      twitter:
        '<svg class="share-icon"><use xlink:href="#twitter-icon"></use></svg>',
      mail:
        '<svg class="share-icon"><use xlink:href="#mail-icon"></use></svg>',
    };

    const template = `
        <h4>${this.option.title}</h4>
        <div class="share-mobile">
            <div title="Udostępnij w serwisie Facebook. Strona otworzy się w nowym oknie." data-share="facebook" class="icon">${social.facebook}</div>
            <div title="Udostępnij w serwisie Twitter. Strona otworzy się w nowym oknie." data-share="twitter" class="icon">${social.twitter}</div>
            <div title="Wyślij maila." data-share="mail" class="icon">${social.mail}</div>
        </div>
        `;
    return template;
  }

  shareButtonNavigation() {
    const share = `
      <div class="social-buttons__btn">
        <svg class="share__icon">
          <use xlink:href="#share-icon"></use>
        </svg>
        <h2>${this.option.title}</h2>
      </div>
    `;

    return share;
  }

  handlerEvent() {
    const buttonShare = document.querySelectorAll('.icon');
    const winWidth = 520;
    const winHeight = 320;
    const winTop = window.screen.height / 2 - winHeight / 2;
    const winLeft = window.screen.width / 2 - winWidth / 2;

    for (let i = 0; i < buttonShare.length; i += 1) {
      buttonShare[i].addEventListener('click', ({ currentTarget }) => {
        const typeSocial = currentTarget.getAttribute('data-share');
        switch (typeSocial) {
          case 'mail': {
            const mailtoLink = `mailto:?subject=Zobacz może Ci się spodoba&body=${this.getTitle} %20%0A ${this.getUrl}`;
            const win = window.open(mailtoLink, 'mail');
            setTimeout(() => {
              win.close();
            }, 500);
            break;
          }

          default: {
            window.open(
              this.showShareLink(typeSocial),
              'sharer',
              `top=${winTop}, left=${winLeft}, toolbar=0, status=0, width=${winWidth}, height=${winHeight}`
            );
            break;
          }
        }
      });
    }
  }

  showShareLink(typeSocial) {
    let url;
    switch (typeSocial) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(
          this.getUrl
        )}&p=${encodeURI(this.getDescription().replace(/ /g, '%20'))}`;
        break;
      case 'twitter':
        url = `http://twitter.com/share?text=${this.getTitle}&url=${this.getUrl}`;
        break;
      default:
        break;
    }
    return url;
  }

  getDescription() {
    let description;
    const meta = document.getElementsByTagName('meta');

    for (let x = 0, y = meta.length; x < y; x += 1) {
      if (meta[x].name.toLowerCase() === 'description') {
        description = meta[x];
      }
    }
    const { content } = description;
    return content;
  }
}

export default ShareButton;