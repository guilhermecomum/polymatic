import { Button } from "~/components/button";
import { useFetcher } from "@remix-run/react";
import { PauseIcon, PlayIcon, TrashIcon } from "@heroicons/react/16/solid";
import Guia from "./Guia";
import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import { createPattern } from "~/framework/patterns";

type Channel = {
  id: string;
  pattern: string;
  bpm: number;
  sample: string;
  isPlaying: boolean;
};

function Channel({ track }: { track: Channel }) {
  const fetcher = useFetcher();
  const { pattern, bpm, id, sample, isPlaying } = track;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const playerRef = useRef<Tone.Player | null>(null);
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const necklace = createPattern(pattern);
  const size = necklace.length;

  useEffect(() => {
    // Start audio context on user interaction
    const startAudio = async () => {
      await Tone.start();
      console.log("Audio context started");
    };

    startAudio();
  }, []);

  useEffect(() => {
    const player = new Tone.Player({
      url: sample,
    }).toDestination();

    playerRef.current = player;

    const sequence = new Tone.Sequence(
      (time, step) => {
        if (necklace[step] && playerRef.current) {
          playerRef.current.start(time);
        }
        Tone.getDraw().schedule(() => {
          setCurrentStep(step);
        }, time);
      },
      [...Array(size).keys()], // steps 0-15
      `${size}n`, // sixteenth notes
    );

    sequenceRef.current = sequence;

    if (isPlaying) {
      sequenceRef.current.start(0);
    }

    return () => {
      sequence.dispose();
      player.dispose();
    };
  }, [pattern]);

  const handleDelete = () => {
    fetcher.submit(
      {
        action: "delete",
        id,
      },
      { method: "POST" },
    );
  };

  return (
    <div key={id}>
      <div className="flex flex-col rounded-md shadow-sm space-x-2">
        <div className="space-x-2">
          <Guia id={id} pattern={pattern} currentStep={currentStep} />
          <p className="mb-4">bpm: {bpm}</p>
        </div>
        <input type="hidden" value="delete" name="action" />
        <input type="hidden" value={track.id} name="id" />
        <Button onClick={() => handleDelete()}>
          <TrashIcon className="h-4 w-4 text-white" />
        </Button>
        <Button>
          {isPlaying ? (
            <PauseIcon className="h-4 w-4 text-white" />
          ) : (
            <PlayIcon className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>
    </div>
  );
}

export { Channel };
