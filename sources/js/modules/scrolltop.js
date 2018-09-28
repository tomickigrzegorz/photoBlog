class Scroller {
    constructor(options) {
        this.options = options;
    }

    init() {
        this.createButton();
        this.checkPosition();
        this.stopListener();
        this.click(this.button());
    }

    button() {
        return document.querySelectorAll('.scroll-button')[0];
    }

    createButton() {
        let button = document.createElement('button');
        button.classList.add('scroll-button');
        button.classList.add('scroll-button--hidden');

        let buttonArrot = document.createElement('div');
        buttonArrot.classList.add('triangle-up');

        button.appendChild(buttonArrot);

        document.body.appendChild(button);
    };

    scroll() {
        if (this.options.animate == false || this.options.animate == "false") {
            this.scrollNoAnimate();
        }
        if (this.options.animate == "normal") {
            this.scrollAnimate();
        }
        if (this.options.animate == "linear") {
            this.scrollAnimateLinear();
        }
    };

    scrollNoAnimate() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    scrollAnimate() {
        if (this.scrollTop() > 0 && this.stop == false) {
            setTimeout(() => {
                this.scrollAnimate();
                window.scrollBy(0, (-Math.abs(this.scrollTop()) / this.options.normal['steps']));
            }, (this.options.normal['ms']));
        }
    };

    scrollAnimateLinear() {
        if (this.scrollTop() > 0 && this.stop == false) {
            setTimeout(() => {
                this.scrollAnimateLinear();
                window.scrollBy(0, -Math.abs(this.options.linear['px']));
            }, this.options.linear['ms']);
        }
    };

    click(button) {
        button.addEventListener("click", e => {
            e.stopPropagation();
            this.scroll();
        }, false);

        button.addEventListener("dblclick", e => {
            e.stopPropagation();
            this.scrollNoAnimate();
        }, false);
    };

    hide(button) {
        button.classList.add("scroll-button--hidden");
    };

    show(button) {
        button.classList.remove("scroll-button--hidden");
    };

    checkPosition() {
        window.addEventListener("scroll", () => {
            (this.scrollTop() > this.options.showButtonAfter) ? this.show(this.button()): this.hide(this.button());
        });
    };

    stopListener() {
        let position = this.scrollTop();
        window.addEventListener("scroll", () => {
            (this.scrollTop() > position) ? this.stopTimeout(200): '';
            position = this.scrollTop();
        }, false);

        window.addEventListener("wheel", e => {
            if (e.deltaY > 0) this.stopTimeout(200);
        }, false);
    };

    stopTimeout(ms) {
        this.stop = true;
        setTimeout(() => {
            this.stop = false;
        }, ms);
    };

    scrollTop() {
        return document.documentElement.scrollTop || document.body.scrollTop;
    };

}

let options = {
    'showButtonAfter': 200, // show button after scroling down this amount of px
    'animate': "normal", // [false|normal|linear] - for false no aditional settings are needed

    'normal': { // applys only if [animate: normal] - set scroll loop distanceLeft/steps|ms
        'steps': 20, // the more steps per loop the slower animation gets
        'ms': 10 // the less ms the quicker your animation gets
    },
    'linear': { // applys only if [animate: linear] - set scroll px|ms
        'px': 30, // the more px the quicker your animation gets
        'ms': 10 // the less ms the quicker your animation gets
    }
};

let scroll = new Scroller(options);
scroll.init();