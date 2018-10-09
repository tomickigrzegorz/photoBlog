class NavMenu {
    constructor(header, contact, portfolio) {
        this.header = header;
        this.contact = contact;
        this.portfolio = portfolio;
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
        return (document.getElementById(this.header).innerHTML = this.menu());
    }

    buildMenu() {
        this.addToHeaderMenu();

        let elements = document.querySelectorAll(this.contact, this.portfolio);

        elements.forEach(function(item) {
            item.addEventListener('click', function() {
                document.getElementById('toggle-nav').click();
            });
        });
    }
}

let menunav = new NavMenu('header-menu', '#contact', '#portfolio');
menunav.buildMenu();
