class NavMenu {
  constructor(option) {
    this.header = option.navHeaderMenu;
    this.contact = option.navContact;
    this.portfolio = option.navPortfolio;
    this.buildMenu();
  }

  menu() {
    return `
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
  }

  addToHeaderMenu() {
    return document.getElementById(this.header).innerHTML = this.menu();
  }

  buildMenu() {
    this.addToHeaderMenu();
    const elements = document.querySelectorAll(this.contact, this.portfolio);

    elements.forEach(function (item) {
      item.addEventListener('click', function () {
        document.getElementById('toggle-nav').click();
      });
    });
  }
}

export default NavMenu;