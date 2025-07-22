import { Button } from "~/components/button";
import { useFetcher } from "@remix-run/react";
import { PauseIcon, PlayIcon, TrashIcon } from "@heroicons/react/16/solid";
import Guia from "./Guia";
import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import { createPattern } from "~/framework/patterns";
import { instruments } from "~/framework/instruments";

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
  const contextRef = useRef<Tone.Context | null>(null);
  const channelRef = useRef<Tone.Channel | null>(null);
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
    const context = new Tone.Context();
    contextRef.current = context;

    const channel = new Tone.Channel({
      context,
      pan: 0,
      volume: 0,
    });
    channelRef.current = channel;

    const player = new Tone.Player({
      url: sample,
      context,
    });

    playerRef.current = player;

    context.transport.bpm.value = bpm;

    const tick = (time: number, step: number) => {
      if (necklace[step] && playerRef.current) {
        playerRef.current.start(time).chain(channel, context.destination);
      }

      context.draw.schedule(() => {
        setCurrentStep(step);
      }, time);
    };

    const sequence = new Tone.Sequence({
      callback: tick,
      context,
      events: [...Array(size).keys()],
    }).start(0);

    sequenceRef.current = sequence;

    if (isPlaying) {
      context.transport.start();
      sequenceRef.current.start(0);
    }

    return () => {
      try {
        // Check if the sequence is actually playing before stopping it
        if (sequenceRef.current && sequenceRef.current.state === "started") {
          sequenceRef.current.stop();
        }

        if (sequenceRef.current) {
          sequenceRef.current.dispose();
        }

        if (playerRef.current) {
          // Stop only if the player is active
          if (playerRef.current.state === "started") {
            playerRef.current.stop();
          }
          playerRef.current.dispose();
        }

        if (channelRef.current) {
          channelRef.current.dispose();
        }

        if (contextRef.current) {
          contextRef.current.dispose();
        }
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    };
  }, [pattern, bpm, sample, isPlaying, necklace.length]);

  const handleDelete = () => {
    fetcher.submit(
      {
        action: "delete",
        id,
      },
      { method: "POST" },
    );
  };

  const handlePause = () => {
    fetcher.submit(
      {
        action: "pause",
        id,
      },
      { method: "POST" },
    );
  };

  const handleResume = () => {
    fetcher.submit(
      {
        action: "play",
        id,
      },
      { method: "POST" },
    );
  };

  const handleEdit = (e: React.FormEvent<HTMLSelectElement>, id: string) => {
    fetcher.submit(
      {
        action: "instrument",
        id,
        sample: e.currentTarget.value,
      },
      { method: "POST" },
    );
  };

  return (
    <div key={id}>
      <div className="flex flex-col rounded-md shadow-sm space-x-2">
        <div className="space-x-2">
          <Guia id={id} pattern={pattern} currentStep={currentStep} />
        </div>
        <input type="hidden" value="delete" name="action" />
        <input type="hidden" value={track.id} name="id" />
        <select
          name="sample"
          className="text-black rounded-r-md px-2"
          value={sample}
          onChange={(e) => handleEdit(e, track.id)}
        >
          {instruments.map((instrument) => (
            <option key={instrument.name} value={instrument.path}>
              {instrument.name}
            </option>
          ))}
        </select>
        <Button onClick={() => handleDelete()}>
          <TrashIcon className="h-4 w-4 text-white" />
        </Button>
        <Button>
          {isPlaying ? (
            <PauseIcon
              className="h-4 w-4 text-white"
              onClick={() => handlePause()}
            />
          ) : (
            <PlayIcon
              className="h-4 w-4 text-white"
              onClick={() => handleResume()}
            />
          )}
        </Button>
      </div>
    </div>
  );
}

export { Channel };
