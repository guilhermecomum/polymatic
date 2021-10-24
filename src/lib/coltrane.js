/**
Original code from Lincoln de Sousa
author: Lincoln de Sousa <lincoln@clarete.li>
source: https://github.com/clarete/clavis/
**/

class Clavis {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.pattern = null;
    this.tempo = 0;
    this.animate = false;
    this.lastRender = Date.now();
    this.draw = this.draw.bind(this);
    this.addDot = this.addDot.bind(this);
    this.currentStep = 0;
    this.patternPos = {};
    this.dotsOn = [];
    this.notesOn = [];
    this.patternDots = [];
    this.notesDots = [];
    this.theme = {};
    this.notes = [
      "C",
      "G",
      "D",
      "A",
      "E",
      "B",
      "G♭",
      "D♭",
      "A♭",
      "E♭",
      "B♭",
      "F",
    ];
  }

  configure(canvas, pattern, tempo) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.pattern = pattern;
    this.tempo = tempo;
  }

  setCurrentStep(step) {
    this.currentStep = step;
  }

  play() {
    this.animate = true;
    window.requestAnimationFrame(this.draw);
  }

  pause() {
    this.animate = false;
  }

  addDot(idx) {
    const [x, y] = this.notesDots[idx];
    const circle = new Path2D();
    circle.arc(x, y, 6, 0, 2 * Math.PI);
    this.context.fillStyle = "green";
    this.context.fill(circle);
  }

  draw() {
    const { canvas, context, pattern } = this;
    this.theme = {
      "canvas-padding": "20px",
      "canvas-width": 500,
      "canvas-height": 500,
      "outer-circle-radius": 80,
      "outer-circle-line-width": 2,
      "outer-circle-stroke-style": "#fff",
      "dot-path-stroke": "#cc2c11",
      "dot-on-radius": 6,
      "dot-on-stroke-style": "#cc2c11",
      "dot-on-fill-style": "#cc2c11",
      "dot-off-radius": 4,
      "dot-off-stroke-style": "#fff",
      "dot-off-fill-style": "#fff",
      "dot-beat-radius": 10,
      "dot-beat-stroke-style": "#cc2c11",
      "dot-beat-fill-style": "#cc2c11",
    };

    /* Canvas dimensions */
    const [width, height] = [
      this.theme["canvas-width"],
      this.theme["canvas-height"],
    ];

    /* Radius of the outer circle */
    const radius = this.theme["outer-circle-radius"];

    /* The entire circle is `360∘ ≡ 2π` and we we want to find the
       distance between each point `2π / N`. */
    const angle = (2 * Math.PI) / pattern.length;

    /* This is where it all starts */
    const startAngle = -0.5 * Math.PI;

    /* Configure canvas */
    //canvas.style.padding = this.theme["canvas-padding"];
    canvas.width = width;
    canvas.height = height;

    this.context.clearRect(0, 0, width, height);
    this.drawOuterCircle();
    this.drawOOuterCircle();

    for (let i = 0; i < pattern.length; i++) {
      const a = startAngle + angle * i;
      const [x, y] = this.coords(a, 100);
      if (pattern[i] === "1") {
        const [x, y] = this.coords(a, 70);
        const dotOn = this.drawDotOn(x, y);
        this.dotsOn.push(dotOn);
        this.patternDots.push([x, y]);
      } else {
        this.drawDotOff(x, y);
      }
      const noteOn = this.drawNote(x, y, this.notes[i]);
      this.notesOn.push(noteOn);
      const [xStep, yStep] = this.coords(a, 70);
      this.notesDots.push([xStep, yStep]);

      //drawStep(xStep, yStep, i + 1);
      this.patternPos[i] = { x, y };
    }

    /* Connect the dots */
    if (this.patternDots.length >= 1) {
      this.connectDots(this.patternDots);
    }

    /* Draw the moving dot */
    const beatX = this.patternPos[this.currentStep].x;
    const beatY = this.patternPos[this.currentStep].y;
    this.drawDotBeat(beatX, beatY);

    if (this.animate) {
      window.requestAnimationFrame(this.draw);
    }
  }

  drawOuterCircle() {
    this.context.lineWidth = this.theme["outer-circle-line-width"];
    this.context.strokeStyle = this.theme["outer-circle-stroke-style"];
    this.context.beginPath();
    this.context.arc(
      this.width / 2 /* x */,
      this.height / 2 /* y */,
      this.radius /* radius */,
      0 /* angle start */,
      2 * Math.PI /* angle end */
    );
    this.context.stroke();
  }

  drawOOuterCircle() {
    this.context.lineWidth = this.theme["outer-circle-line-width"];
    this.context.strokeStyle = this.theme["outer-circle-stroke-style"];
    this.context.beginPath();
    this.context.arc(
      this.width / 2 /* x */,
      this.height / 2 /* y */,
      100 /* radius */,
      0 /* angle start */,
      2 * Math.PI /* angle end */
    );
    this.context.stroke();
  }

  drawStep(x, y, step) {
    this.context.font = "12px serif";
    this.context.fillText(step, x, y);
  }

  drawDot(x, y, { radius, stroke, fill }) {
    const circle = new Path2D();
    circle.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = fill;
    this.context.fill(circle);
    // const dot = new Path2D();
    // dot.arc(x, y, radius, 0, 2 * Math.PI);
    // //context.beginPath();
    // //context.arc(x, y, radius, 0, 2 * Math.PI);
    // context.fillStyle = fill;
    // context.fill(dot);
    return circle;
  }

  drawDotOn(x, y) {
    return this.drawDot(x, y, {
      radius: this.theme["dot-on-radius"],
      stroke: this.theme["dot-on-stroke-style"],
      fill: this.theme["dot-on-fill-style"],
    });
  }

  drawDotOff(x, y) {
    this.drawDot(x, y, {
      radius: this.theme["dot-off-radius"],
      stroke: this.theme["dot-off-stroke-style"],
      fill: this.theme["dot-off-fill-style"],
    });
  }

  drawNote(x, y, note) {
    const circle = new Path2D();
    circle.arc(x, y, 20, 0, 2 * Math.PI);
    this.context.fillStyle = "#fff";
    this.context.fill(circle);
    this.context.font = "8pt sans";
    this.context.fillStyle = "black";
    this.context.textAlign = "center";
    this.context.fillText(note, x, y);
    return circle;
  }

  drawDotBeat(x, y) {
    this.drawDot(x, y, {
      radius: this.theme["dot-beat-radius"],
      stroke: this.theme["dot-beat-stroke-style"],
      fill: this.theme["dot-beat-fill-style"],
    });
  }

  connectDots(dots) {
    this.context.strokeStyle = this.theme["dot-path-stroke"];
    this.context.beginPath();
    this.context.moveTo(dots[0][0], dots[0][1]);
    for (let i = 1; i < dots.length; i++) {
      this.context.lineTo(dots[i][0], dots[i][1]);
    }
    this.context.closePath();
    this.context.stroke();
  }

  coords(angle, r) {
    /* Find the equidistant points:
         Many thanks to
         https://math.stackexchange.com/questions/2820194/how-to-plot-n-coords-to-distribute-evenly-as-a-ring-of-points-around-a-circle
      */
    const x = Math.cos(angle) * r + this.width / 2;
    const y = Math.sin(angle) * r + this.height / 2;
    return [x, y];
  }
}

export default Clavis;
