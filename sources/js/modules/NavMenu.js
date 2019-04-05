import { navOptions } from '../helpers/constants';

class NavMenu {
  constructor() {
    this.header = navOptions.navHeaderMenu;
    this.contact = navOptions.navContact;
    this.portfolio = navOptions.navPortfolio;
    this.buildMenu();
  }

  addToHeaderMenu() {
    const menu = `
        <nav id="overlaymenu">
          <input type="checkbox" id="toggle-nav">
          <label id="toggle-nav-label" for="toggle-nav">Zadaj pytanie</label>
          <div class="box">
              <ul>
                  <li><a href="/index.html">home</a></li>
                  <li><a href="mailto:info@grzegorztomicki.pl" id="contact">kontakt</a></li>
                  <li><a href="http://www.grzegorztomicki.pl" id="portfolio" target="_blank" rel="noopener">portfolio</a></li>
              </ul>
          </div>
        </nav>
    `;
    document.getElementById(this.header).innerHTML = menu;
  }

  buildMenu() {
    this.addToHeaderMenu();
    const elements = document.querySelectorAll(this.contact, this.portfolio);

    elements.forEach(item => {
      item.addEventListener('click', function() {
        document.getElementById('toggle-nav').click();
      });
    });
  }
}

export default NavMenu;
