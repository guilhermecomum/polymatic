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
    this.currentStep = 0;
    this.patternPos = {};
    this.patternNotes = [];
    this.notes = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
  }

  configure(canvas, pattern, tempo) {
    this.pattern = pattern;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
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

  draw() {
    const { canvas, context, pattern } = this;
    const theme = {
      "canvas-padding": "0px",
      "canvas-width": 600,
      "canvas-height": 600,
      "notes-circle-radius": 220,
      "outer-circle-radius": 180,
      "outer-circle-line-width": 0,
      "outer-circle-stroke-style": "#000",
      "dot-path-stroke": "#cc2c11",
      "dot-on-radius": 4,
      "dot-on-stroke-style": "#cc2c11",
      "dot-on-fill-style": "#cc2c11",
      "dot-off-radius": 2,
      "dot-off-stroke-style": "#fff",
      "dot-off-fill-style": "#fff",
      "dot-beat-radius": 8,
      "dot-beat-stroke-style": "#cc2c11",
      "dot-beat-fill-style": "#cc2c11",
    };

    /* Canvas dimensions */
    const [width, height] = [theme["canvas-width"], theme["canvas-height"]];

    /* Radius of the outer circle */
    const radius = theme["outer-circle-radius"];

    /* The entire circle is `360∘ ≡ 2π` and we we want to find the
       distance between each point `2π / N`. */

    const angle = (2 * Math.PI) / pattern.length;

    /* This is where it all starts */
    const startAngle = -0.5 * Math.PI;

    /* Configure canvas */
    canvas.style.padding = theme["canvas-padding"];
    canvas.width = width;
    canvas.height = height;

    function drawOuterCircle() {
      context.lineWidth = theme["outer-circle-line-width"];
      context.strokeStyle = theme["outer-circle-stroke-style"];
      context.beginPath();
      context.arc(
        width / 2 /* x */,
        height / 2 /* y */,
        radius /* radius */,
        0 /* angle start */,
        2 * Math.PI /* angle end */
      );
      context.stroke();
    }

    // function drawStep(x, y, step) {
    //   context.font = "12px serif";
    //   context.fillText(step, x, y);
    // }

    function drawNote(x, y, note) {
      const circle = new Path2D();
      circle.arc(x, y, 20, 0, 2 * Math.PI);
      context.fillStyle = "#fff";
      context.fill(circle);
      context.font = "8pt sans";
      context.fillStyle = "black";
      context.textAlign = "center";
      context.font = "15px serif";
      context.fillText(note, x, y + 5);
      return circle;
    }

    function drawDot(x, y, { radius, stroke, fill }) {
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
    }

    function drawDotOn(x, y) {
      drawDot(x, y, {
        radius: theme["dot-on-radius"],
        stroke: theme["dot-on-stroke-style"],
        fill: theme["dot-on-fill-style"],
      });
    }

    function drawDotOff(x, y) {
      drawDot(x, y, {
        radius: theme["dot-off-radius"],
        stroke: theme["dot-off-stroke-style"],
        fill: theme["dot-off-fill-style"],
      });
    }

    function drawDotBeat(x, y) {
      drawDot(x, y, {
        radius: theme["dot-beat-radius"],
        stroke: theme["dot-beat-stroke-style"],
        fill: theme["dot-beat-fill-style"],
      });
    }

    context.clearRect(0, 0, width, height);
    drawOuterCircle();

    const patternDots = [];
    const patternNotes = [];

    function connectDots(dots) {
      context.strokeStyle = theme["dot-path-stroke"];
      context.beginPath();
      context.moveTo(dots[0][0], dots[0][1]);
      for (let i = 1; i < dots.length; i++) {
        context.lineTo(dots[i][0], dots[i][1]);
      }
      context.closePath();
      context.stroke();
    }

    function coords(angle, r) {
      /* Find the equidistant points:
         Many thanks to
         https://math.stackexchange.com/questions/2820194/how-to-plot-n-coords-to-distribute-evenly-as-a-ring-of-points-around-a-circle
      */
      const x = Math.cos(angle) * r + width / 2;
      const y = Math.sin(angle) * r + height / 2;
      return [x, y];
    }

    for (let i = 0; i < pattern.length; i++) {
      const a = startAngle + angle * i;
      const [x, y] = coords(a, radius);
      if (pattern[i] === "1") {
        drawDotOn(x, y);
        patternDots.push([x, y]);
      } else {
        drawDotOff(x, y);
      }
      const nRadius = theme["notes-"];
      const [xNote, yNote] = coords(a, theme["notes-circle-radius"]);
      const noteOn = drawNote(xNote, yNote, this.notes[i]);
      patternNotes.push(noteOn);
      this.patternPos[i] = { x, y };
      this.patternNotes[i] = noteOn;
    }

    /* Connect the dots */
    if (patternDots.length >= 1) {
      connectDots(patternDots);
    }

    /* Draw the moving dot */
    const beatX = this.patternPos[this.currentStep].x;
    const beatY = this.patternPos[this.currentStep].y;
    drawDotBeat(beatX, beatY);
    if (this.animate) {
      window.requestAnimationFrame(this.draw);
    }
  }
}

export default Clavis;
