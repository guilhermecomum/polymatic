class Clavis {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.pattern = null;
    this.tempo = 0;
    this.animate = false;
    this.lastRender = Date.now();
    this.draw = this.draw.bind(this);
    this.currentStep = 1;
    this.patternPos = {};
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

  draw() {
    if (this.animate) {
      window.requestAnimationFrame(this.draw);
    }
    const { canvas, context, pattern } = this;
    const theme = {
      "canvas-padding": "20px",
      "canvas-width": 200,
      "canvas-height": 200,
      "outer-circle-radius": 80,
      "outer-circle-line-width": 2,
      "outer-circle-stroke-style": "#ccc",
      "dot-path-stroke": "#000",
      "dot-on-radius": 4,
      "dot-on-stroke-style": "#000",
      "dot-on-fill-style": "#000",
      "dot-off-radius": 2,
      "dot-off-stroke-style": "#ccc",
      "dot-off-fill-style": "#ccc",
      "dot-beat-radius": 5,
      "dot-beat-stroke-style": "#fc0",
      "dot-beat-fill-style": "#fc0"
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
        fill: theme["dot-on-fill-style"]
      });
    }

    function drawDotOff(x, y) {
      drawDot(x, y, {
        radius: theme["dot-off-radius"],
        stroke: theme["dot-off-stroke-style"],
        fill: theme["dot-off-fill-style"]
      });
    }

    function drawDotBeat(x, y) {
      drawDot(x, y, {
        radius: theme["dot-beat-radius"],
        stroke: theme["dot-beat-stroke-style"],
        fill: theme["dot-beat-fill-style"]
      });
    }

    context.clearRect(0, 0, width, height);
    drawOuterCircle();

    const patternDots = [];

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

    function coords(angle) {
      /* Find the equidistant points:
         Many thanks to
         https://math.stackexchange.com/questions/2820194/how-to-plot-n-coords-to-distribute-evenly-as-a-ring-of-points-around-a-circle
      */
      const x = Math.cos(angle) * radius + width / 2;
      const y = Math.sin(angle) * radius + height / 2;
      return [x, y];
    }

    for (let i = 0; i < pattern.length; i++) {
      const a = startAngle + angle * i;
      const [x, y] = coords(a);
      if (pattern[i] === "1") {
        drawDotOn(x, y);
        patternDots.push([x, y]);
      } else {
        drawDotOff(x, y);
      }
      this.patternPos[i] = { x, y };
    }

    /* Connect the dots */
    connectDots(patternDots);

    /* Draw the moving dot */
    const beatX = this.patternPos[this.currentStep - 1].x;
    const beatY = this.patternPos[this.currentStep - 1].y;
    drawDotBeat(beatX, beatY);
  }
}

export default Clavis;
