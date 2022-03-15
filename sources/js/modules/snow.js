class Hohoho {
  constructor(options) {
    this.canvas = options.canvas;
    this.ns = options.ns;
    this.radius = options.radius;
    this.interval = options.interval;
    this.snowColor = options.snowColor;
    this.snowOpacity = options.snowOpacity;
    this.angle = 0;
    this.partivles = [];

    this.createCanvas();
    this.resizeWindow();

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.getWidth();

    for (let i = 0; i < this.ns; i += 1) {
      this.partivles.push({
        x: Math.random() * this.W,
        y: Math.random() * this.H,
        r: Math.random() * this.radius + 1,
        d: Math.random() * this.ns,
      });
    }
  }

  getWidth() {
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    this.canvas.width = this.W;
    this.canvas.height = this.H;
  }

  createCanvas() {
    const canv = document.createElement("canvas");
    canv.id = "canvas";
    canv.setAttribute(
      "style",
      "position: fixed; top: 0; pointer-events: none;"
    );
    document.body.appendChild(canv);
  }

  resizeWindow() {
    window.addEventListener("resize", () => {
      this.getWidth();
    });
  }

  drawSnowflakes() {
    return () => {
      setInterval(() => {
        this.ctx.clearRect(0, 0, this.W, this.H);
        this.ctx.fillStyle = `rgba(${this.snowColor},${this.snowOpacity})`;
        this.ctx.beginPath();
        for (let i = 0; i < this.ns; i++) {
          const p = this.partivles[i];
          this.ctx.moveTo(p.x, p.y);
          this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
        }
        this.ctx.fill();
        this.updateSnowflakes();
      }, this.interval);
    };
  }

  updateSnowflakes() {
    this.angle += 0.01;
    for (let i = 0; i < this.ns; i++) {
      const p = this.partivles[i];
      p.y += Math.cos(this.angle + p.d) + 1 + p.r / 2;
      p.x += Math.sin(this.angle) * 2;
      if (p.x > this.W + 5 || p.x < -5 || p.y > this.H) {
        if (i % 3 > 0) {
          this.partivles[i] = {
            x: Math.random() * this.W,
            y: -10,
            r: p.r,
            d: p.d,
          };
        } else if (Math.sin(this.angle) > 0) {
          this.partivles[i] = {
            x: -5,
            y: Math.random() * this.H,
            r: p.r,
            d: p.d,
          };
        } else {
          this.partivles[i] = {
            x: this.W + 5,
            y: Math.random() * this.H,
            r: p.r,
            d: p.d,
          };
        }
      }
    }
  }
}

const options = {
  canvas: "canvas",
  snowColor: "255,255,255", // snowflakes color - white
  snowOpacity: "0.6", // snowflakes opacity
  ns: 50, // the number of snowflakes
  radius: 3, // size snowflakes
  interval: 30, // falling speed
};

const snow = new Hohoho(options).drawSnowflakes();

window.addEventListener("load", snow);
