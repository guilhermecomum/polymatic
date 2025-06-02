const theme = {
  "canvas-padding": "0px",
  "canvas-width": 600,
  "canvas-height": 600,
  "notes-circle-radius": 220,
  "outer-circle-radius": 180,
  "outer-circle-line-width": 2,
  "outer-circle-stroke-style": "#fff",
  "dot-path-stroke": "#cc2c11",
  "dot-on-radius": 10,
  "dot-on-stroke-style": "#cc2c11",
  "dot-on-fill-style": "#cc2c11",
  "dot-off-radius": 10,
  "dot-off-stroke-style": "#fff",
  "dot-off-fill-style": "#fff",
  "dot-beat-radius": 16,
  "dot-beat-stroke-style": "#cc2c11",
  "dot-beat-fill-style": "#cc2c11",
};

//const startAngle = -0.5 * Math.PI;
const [width, height] = [theme["canvas-width"], theme["canvas-height"]];

type DotProps = {
  radius: number;
  fill: string;
};

function drawDot(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  { radius, fill }: DotProps,
) {
  const circle = new Path2D();
  circle.arc(x, y, radius, 0, 2 * Math.PI);
  context.fillStyle = fill;
  context.fill(circle);
  return circle;
}

function drawDotOn(context: CanvasRenderingContext2D, x: number, y: number) {
  return drawDot(context, x, y, {
    radius: theme["dot-on-radius"],
    fill: theme["dot-on-fill-style"],
  });
}

function drawDotOff(context: CanvasRenderingContext2D, x: number, y: number) {
  return drawDot(context, x, y, {
    radius: theme["dot-off-radius"],
    fill: theme["dot-off-fill-style"],
  });
}

function drawDotBeat(context: CanvasRenderingContext2D, x: number, y: number) {
  return drawDot(context, x, y, {
    radius: theme["dot-beat-radius"],
    fill: theme["dot-beat-fill-style"],
  });
}

function coords(angle: number, r: number) {
  /* Find the equidistant points:
         Many thanks to
         https://math.stackexchange.com/questions/2820194/how-to-plot-n-coords-to-distribute-evenly-as-a-ring-of-points-around-a-circle
      */
  const x = Math.cos(angle) * r + width / 2;
  const y = Math.sin(angle) * r + height / 2;
  return [x, y];
}

function connectDots(context: CanvasRenderingContext2D, dots: number[][]) {
  context.strokeStyle = theme["dot-path-stroke"];
  context.beginPath();
  context.moveTo(dots[0][0], dots[0][1]);
  for (let i = 1; i < dots.length; i++) {
    context.lineTo(dots[i][0], dots[i][1]);
  }
  context.closePath();
  context.stroke();
}

function drawOuterCircle(context: CanvasRenderingContext2D) {
  const r = theme["outer-circle-radius"];
  context.lineWidth = theme["outer-circle-line-width"];
  context.strokeStyle = theme["outer-circle-stroke-style"];
  context.beginPath();
  context.arc(
    width / 2 /* x */,
    height / 2 /* y */,
    r /* radius */,
    0 /* angle start */,
    2 * Math.PI /* angle end */,
  );

  context.fillStyle = "rgba(255, 0, 0, 0)";
  context.fill();
  context.stroke();
}
export {
  theme,
  drawDot,
  drawDotBeat,
  drawDotOff,
  drawDotOn,
  coords,
  connectDots,
  drawOuterCircle,
  width,
  height,
};
