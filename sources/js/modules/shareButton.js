class ShareButton {
  constructor(option) {
    this.option = option;
  }

  init() {
    this.renderHTML();
    this.eventButton();
  }

  renderHTML() {
    let placeStick = document.getElementById(this.option.place.stick);
    let placeBottom = document.getElementById(this.option.place.bottom);

    if (placeStick || placeBottom) {
      placeStick.innerHTML = this.htmlTemplate(this.option.place.stick);
      placeBottom.innerHTML = this.htmlTemplate(this.option.place.bottom);
    }
  }

  htmlTemplate(place) {
    let social = {
      facebook:
        '<svg class="share-icon share-facebook"><use xlink:href="#share-icon-facebook"></use></svg>',
      twitter:
        '<svg class="share-icon share-twitter"><use xlink:href="#share-icon-twitter"></use></svg>',
      mail:
        '<svg class="share-icon share-mail"><use xlink:href="#share-icon-mail"></use></svg>',
      add:
        '<svg class="share-icon share-add"><use xlink:href="#share-icon-add-opinion"></use></svg>'
    };

    let addComment =
      place === 'share-button-bottom'
        ? ''
        : '<div title="Dodaj opinię." data-share="opinion" class="share-btn btn-add-opinion"><span class="share-btn__wrapper">Dodaj komentarz</span></div>';

    let html = `
        <h3>${this.option.title}</h3>
        <div class="share-button fl">
            <div title="Udostępnij w serwisie Facebook. Strona otworzy się w nowym oknie." data-share="facebook" class="share-btn btn-facebook">
                <span class="share-btn__wrapper">${social.facebook}</span>
            </div>
            <div title="Udostępnij w serwisie Twitter. Strona otworzy się w nowym oknie." data-share="twitter" class="share-btn btn-twitter">
                <span class="share-btn__wrapper">${social.twitter}</span>
            </div>
            <div title="Wyślij maila." data-share="mail" class="share-btn btn-mail">
                <span class="share-btn__wrapper">${social.mail}</span>
            </div>
            ${addComment}
        </div>
        `;
    return html;
  }

  eventButton() {
    let buttonShare = document.querySelectorAll('.share-btn');
    let winWidth = 520;
    let winHeight = 320;
    let winTop = screen.height / 2 - winHeight / 2;
    let winLeft = screen.width / 2 - winWidth / 2;

    buttonShare.forEach(el => {
      let typeSocial = el.getAttribute('data-share');
      el.addEventListener('click', () => {
        if (typeSocial === 'print') {
          window.print();
        } else if (typeSocial === 'opinion') {
          let h = document.body.scrollHeight;
          window.scrollTo(0, h);
          document.querySelectorAll('.comments-button')[0].click();
        } else if (typeSocial === 'mail') {
          let mailtoLink = `mailto:?subject=Zobacz może Ci się spodoba&body=${this.getTitle()} %20%0A ${this.getUrl()}`;
          let win = window.open(mailtoLink, 'mail');
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
    }
    return url;
  }

  getUrl() {
    return window.location.href;
  }

  getTitle() {
    return document.title;
  }

  getDescription() {
    let description,
      content,
      meta = document.getElementsByTagName('meta');

    for (let x = 0, y = meta.length; x < y; x++) {
      if (meta[x].name.toLowerCase() === 'description') {
        description = meta[x];
      }
    }
    content = description.content.replace(/ /g, '%20');
    return content;
  }
}

let option = {
  place: {
    stick: 'share-button-stick',
    bottom: 'share-button-bottom'
  },
  title: 'Podziel się:'
};

let sharebutton = new ShareButton(option);
sharebutton.init();
