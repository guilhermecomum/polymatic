import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { createPattern } from "~/framework/patterns";
import {
  connectDots,
  coords,
  drawDotBeat,
  drawDotOff,
  drawDotOn,
  drawOuterCircle,
  theme,
  width,
  height,
} from "~/framework/ui";

type Props = {
  id: string;
  pattern: string;
  currentStep: number;
};

export default function Guia({ id, pattern, currentStep }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const patternPos = [] as number[];
  const necklace = createPattern(pattern);
  const fetcher = useFetcher();

  const draw = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, width, height);
    drawOuterCircle(context);
    let patternDots: number[] = [];

    const startAngle = -0.5 * Math.PI;
    const angle = (2 * Math.PI) / necklace.length;
    const radius = theme["outer-circle-radius"];

    for (let i = 0; i < necklace.length; i++) {
      let dot;
      const a = startAngle + angle * i;
      const [x, y] = coords(a, radius);
      if (necklace[i] === 1) {
        dot = drawDotOn(context, x, y);
        patternDots.push([x, y]);
      } else {
        dot = drawDotOff(context, x, y);
      }
      patternPos[i] = { x, y, dot };
    }

    if (patternDots.length >= 1) {
      connectDots(context, patternDots);
    }

    const beatX = patternPos[currentStep].x;
    const beatY = patternPos[currentStep].y;
    drawDotBeat(context, beatX, beatY);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        const render = () => {
          draw(context);
        };
        render();
      }
    }
  }, [draw]);

  const handleClick = (event) => {
    event.stopPropagation();
    console.log(`🐞🐞🐞 handle Click`);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        patternPos.forEach((circ, index) => {
          if (
            ctx.isPointInPath(
              circ.dot,
              event.nativeEvent.offsetX,
              event.nativeEvent.offsetY,
            )
          ) {
            const clone = [...pattern];
            clone[index] = clone[index] === 1 ? 0 : 1;

            console.log(`🐞🐞🐞 edit`, clone.join(""));

            fetcher.submit(
              {
                id: id,
                action: "edit",
                pattern: createPattern(clone.join("")),
              },
              { method: "POST" },
            );
          }
        });
      }
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
      />
      <p className="text-center">{pattern}</p>
    </div>
  );
}
