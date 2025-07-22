import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useCallback, useMemo } from "react";
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
  isPlaying: boolean;
};

// Define proper type for pattern position
interface PatternPosition {
  x: number;
  y: number;
  dot: Path2D;
}

export default function Guia({ id, pattern, currentStep, isPlaying }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fetcher = useFetcher();

  // Create memoized pattern to avoid recalculations
  const necklace = useMemo(() => createPattern(pattern), [pattern]);

  // Initialize pattern positions with proper typing
  const patternPos = useRef<PatternPosition[]>([]);

  // Move draw function outside render cycle with useCallback
  const draw = useCallback(
    (context: CanvasRenderingContext2D) => {
      context.clearRect(0, 0, width, height);
      drawOuterCircle(context);
      const patternDots: Array<[number, number]> = [];

      const startAngle = -0.5 * Math.PI;
      const angle = (2 * Math.PI) / necklace.length;
      const radius = theme["outer-circle-radius"];

      // Clear existing pattern positions
      patternPos.current = [];

      for (let i = 0; i < necklace.length; i++) {
        const a = startAngle + angle * i;
        const [x, y] = coords(a, radius);
        let dot: Path2D;

        if (necklace[i] === 1) {
          dot = drawDotOn(context, x, y);
          patternDots.push([x, y]);
        } else {
          dot = drawDotOff(context, x, y);
        }

        patternPos.current[i] = { x, y, dot };
      }

      if (patternDots.length >= 1) {
        connectDots(context, patternDots);
      }

      const beatX = patternPos.current[currentStep].x;
      const beatY = patternPos.current[currentStep].y;
      drawDotBeat(context, beatX, beatY);
    },
    [necklace, currentStep],
  );

  // Handle canvas rendering with proper dependencies
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    isPlaying && draw(context);

    // No dependency on draw itself since it's wrapped in useCallback
  }, [draw, isPlaying]);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.stopPropagation();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ensure we have pattern positions
    if (patternPos.current.length === 0) return;

    // Check each dot to see if it was clicked
    for (let index = 0; index < patternPos.current.length; index++) {
      const circ = patternPos.current[index];

      // Use isPointInPath as in original code
      if (
        ctx.isPointInPath(
          circ.dot,
          event.nativeEvent.offsetX,
          event.nativeEvent.offsetY,
        )
      ) {
        // Convert pattern string to array for manipulation
        const patternArray = pattern.split("");
        patternArray[index] = patternArray[index] === "1" ? "0" : "1";
        const newPattern = patternArray.join("");

        // Submit form with the updated pattern
        fetcher.submit(
          {
            id: id,
            action: "edit",
            pattern: newPattern,
          },
          { method: "POST" },
        );

        // Exit after processing the first clicked dot
        break;
      }
    }
  };

  return (
    <div className="space-y-2">
      <canvas
        key={id}
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
      />
      <p className="text-center">{pattern}</p>
    </div>
  );
}
