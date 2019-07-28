import { navOptions } from '../helpers/constants';

class NavMenu {
  constructor() {
    this.header = navOptions.navHeaderMenu;
    this.body = document.body;
    this.hamburger = document.querySelector('.hamburger');
    this.class = {
      showmenu: 'showMenu',
      isopen: 'is-open',
    };
  }

  addToHeaderMenu() {
    const header = document.querySelector(this.header);
    const overlay = document.createElement('div');
    overlay.id = 'overlaymenu';
    overlay.className = 'overlaymenu';

    const menu = `
      <ul>
          <li><a href="/index.html">home</a></li>
          <li><a href="mailto:info@grzegorztomicki.pl" id="contact">kontakt</a></li>
      </ul>
    `;
    overlay.innerHTML = menu;

    overlay.addEventListener('click', () => {
      this.body.classList.remove(this.class.showmenu);
      this.hamburger.classList.remove(this.class.isopen);
    });

    this.hamburger.addEventListener('click', () => {
      this.hamburger.classList.toggle(this.class.isopen);
      this.body.classList.toggle(this.class.showmenu);
    });

    header.parentNode.insertBefore(overlay, header.nextSibling);
  }
}

export default NavMenu;
