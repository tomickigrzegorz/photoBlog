const disqusOptions = {
  disqusThread: 'disqus_thread',
  commentsButton: 'comments-button',
  buttonName: 'dodaj / pokaż komentarze',
  disqusShortName: 'bloggrzegorztomickipl',
};

class DisqusLoader {
  constructor() {
    this.option = disqusOptions;
  }

  init() {
    const discusContent = document.getElementById(this.option.disqusThread);

    if (discusContent) {
      discusContent.appendChild(this.disqusButtonCreate());
      this.disqusEvent();
    }
  }

  disqusButtonCreate() {
    const commentsButton = document.createElement('button');
    commentsButton.setAttribute('class', this.option.commentsButton);
    commentsButton.innerHTML = this.option.buttonName;
    return commentsButton;
  }

  disqusEvent() {
    const disqusButton = document.querySelector(
      `.${this.option.commentsButton}`
    );

    disqusButton.addEventListener('click', (e) => {
      e.preventDefault();
      const disqusContainer = document.createElement('div');
      disqusContainer.setAttribute('id', this.option.disqusThread);
      document.body.appendChild(disqusContainer);

      const disqusShortname = this.option.disqusShortName;

      const dsq = document.createElement('script');
      dsq.type = 'text/javascript';
      dsq.async = true;
      dsq.src = ` //${disqusShortname}.disqus.com/embed.js`;

      (
        document.getElementsByTagName('head')[0] ||
        document.getElementsByTagName('body')[0]
      ).appendChild(dsq);
    });
  }
}

export default DisqusLoader;
