import { theme } from "./ui";

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
