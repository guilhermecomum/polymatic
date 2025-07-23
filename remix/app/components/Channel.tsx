import { Button } from "~/components/button";
import { useFetcher } from "@remix-run/react";
import { PauseIcon, PlayIcon, TrashIcon } from "@heroicons/react/16/solid";
import Guia from "./Guia";
import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import { createPattern } from "~/framework/patterns";
import { instruments } from "~/framework/instruments";

type Channel = {
  id: number;
  pattern: string;
  sample: string;
  isPlaying: boolean;
};

function Channel({
  track,
  onDelete,
  onEditInstrument,
  onEditPattern,
}: {
  track: Channel;
  onDelete: any;
  onEditInstrument: any;
  onEditPattern: any;
}) {
  const { pattern, id, sample } = track;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(100);
  const playerRef = useRef<Tone.Player | null>(null);
  const sequenceRef = useRef<Tone.Sequence | null>(null);
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
    const channel = new Tone.Channel({
      volume: percentToDb(volume),
    }).toDestination();
    channelRef.current = channel;

    const player = new Tone.Player({
      url: sample,
    }).connect(channel);

    playerRef.current = player;

    const tick = (time: number, step: number) => {
      if (necklace[step] && playerRef.current) {
        playerRef.current.start(time);
      }

      Tone.getDraw().schedule(() => {
        setCurrentStep(step);
      }, time);
    };

    const sequence = new Tone.Sequence({
      callback: tick,
      events: [...Array(size).keys()],
    }).start(0);

    sequenceRef.current = sequence;

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
      } catch (error) {
        console.error("Error during cleanup:", error);
      }
    };
  }, [pattern, sample, necklace.length]);

  const handleDelete = () => {
    onDelete(id);
  };

  const handlePause = () => {
    setIsPlaying(false);
    const channel = channelRef.current;
    channel?.set({
      mute: true,
    });
  };

  const handleResume = () => {
    setIsPlaying(true);
    const channel = channelRef.current;
    channel?.set({
      mute: false,
    });
  };

  const handleEdit = (id: number, sample: string) =>
    onEditInstrument(id, sample);

  function percentToDb(percent: number) {
    if (percent <= 0) return -1000; // Silence
    if (percent >= 100) return 0; // Maximum
    return percent * 0.3 - 24;
  }

  const handleVolume = (value: number) => {
    const channel = channelRef.current;
    channel?.set({
      volume: percentToDb(value),
    });
    setVolume(value);
  };

  return (
    <div key={id}>
      <div className="flex flex-col rounded-md shadow-sm space-x-2">
        <div className="space-x-2">
          <Guia
            id={id}
            pattern={pattern}
            currentStep={currentStep}
            isPlaying={isPlaying}
            onEdit={onEditPattern}
          />
        </div>
        <input type="hidden" value="delete" name="action" />
        <input type="hidden" value={track.id} name="id" />
        <select
          name="sample"
          className="text-black rounded-r-md px-2"
          value={sample}
          onChange={(e) => handleEdit(track.id, e.currentTarget.value)}
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
        {isPlaying ? (
          <Button>
            <PauseIcon
              className="h-4 w-4 text-white"
              onClick={() => handlePause()}
            />
          </Button>
        ) : (
          <Button>
            <PlayIcon
              className="h-4 w-4 text-white"
              onClick={() => handleResume()}
            />
          </Button>
        )}
        <input
          type="range"
          id="volume"
          name="volume"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export { Channel };
