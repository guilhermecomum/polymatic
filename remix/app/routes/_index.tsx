import { type MetaFunction } from "@remix-run/node";

import { PlayIcon, StopIcon } from "@heroicons/react/16/solid";

import { Button } from "~/components/button";
import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import { Channel } from "~/components/Channel";
import { createPattern } from "~/framework/patterns";
import { instruments } from "~/framework/instruments";

export const meta: MetaFunction = () => {
  return [
    { title: "Polymatic v7" },
    { name: "description", content: "Welcome to Polymatic!" },
  ];
};

export default function Index() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [pattern, setPattern] = useState<string>("");
  const [sample, setSample] = useState(
    "/samples/brazilian-percussion/agogo1.wav",
  );
  const playerRef = useRef<Tone.Player | null>(null);

  useEffect(() => {
    document.body.addEventListener(
      "click",
      async () => {
        if (Tone.getContext().state !== "running") {
          await Tone.start();
          console.log("AudioContext started!");
        }
      },
      {
        once: true,
      },
    );

    // Create a Tone.Player instance
    const player = new Tone.Player({
      url: sample,
    }).toDestination();

    // Store the player instance in the ref's .current property
    // This does NOT cause a re-render
    playerRef.current = player;

    // --- Cleanup Function ---
    // This function is returned by useEffect and runs when:
    // 1. The component unmounts
    // 2. The `sampleUrl` dependency changes (before the effect runs again)
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [sample]);

  const previewSample = () => {
    if (playerRef.current) {
      playerRef.current.start(0);
    }
  };

  const handleCreate = () => {
    const isEuclidian = new RegExp("^(\\d+),(\\d+)$");
    const isBinary = new RegExp("^[0-1]{1,}$");
    let necklace: (0 | 1)[];

    if (isEuclidian.test(pattern)) {
      const [pulse, steps] = pattern
        .split(",")
        .map((number) => parseInt(number))
        .sort((a, b) => a - b);

      necklace = createPattern(pulse, steps);
    } else if (isBinary.test(pattern)) {
      necklace = createPattern(pattern);
    } else {
      throw Error("Padrão inválido!");
    }

    setChannels([
      ...channels,
      {
        id: Date.now(),
        pattern: necklace.join(""),
        sample,
        isPlaying: true,
      },
    ]);
  };

  const handleDelete = (id: number) =>
    setChannels(channels.filter((p) => p.id != id));

  const handleEditInstrument = (id: number, sample: string) =>
    setChannels(
      channels.map((p) =>
        p.id == id
          ? {
              ...p,
              sample,
            }
          : p,
      ),
    );

  const handleEditPattern = (id: number, pattern: string) =>
    setChannels(
      channels.map((p) =>
        p.id == id
          ? {
              ...p,
              pattern,
            }
          : p,
      ),
    );

  const handlePlay = () => Tone.getTransport().start();

  const handlePause = () => Tone.getTransport().stop();

  return (
    <div className="flex w-full flex-col">
      <div className="flex border-y border-white w-full p-4 space-x-2">
        <div id="general-control">
          <Button className="rounded-l-md" onClick={() => handlePlay()}>
            <PlayIcon className="h-5 w-5 " />
          </Button>
          <Button className="rounded-r-md" onClick={() => handlePause()}>
            <StopIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex rounded-md shadow-sm space-x-2">
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm">
              Guia
            </span>
            <input
              type="text"
              name="pattern"
              className="flex-1 block text-black rounded-r-md pl-2 border-gray-300 sm:text-sm"
              placeholder="10101011 ou 3,2"
              onChange={(e) => setPattern(e.target.value)}
            />
          </div>
          <div className="flex shadow-sm rounded-r-md">
            <span className="bg-red-500 hover:bg-red-700 inline-flex items-center px-2 rounded-l-md border-r-0 border-gray-300 text-white-500 text-sm">
              <PlayIcon className="h-5 w-5" onClick={() => previewSample()} />
            </span>
            <select
              name="sample"
              className="text-black rounded-r-md px-2"
              value={sample}
              onChange={(e) => setSample(e.target.value)}
            >
              {instruments.map((instrument) => (
                <option key={instrument.name} value={instrument.path}>
                  {instrument.name}
                </option>
              ))}
            </select>
          </div>
          <input name="action" value="add" type="hidden" />
          <Button onClick={() => handleCreate()}>Adicionar</Button>
        </div>
      </div>

      <div className="flex space-y-4 mt-4 p-4">
        {channels.map((track) => (
          <Channel
            key={track.id}
            track={track}
            onDelete={handleDelete}
            onEditInstrument={handleEditInstrument}
            onEditPattern={handleEditPattern}
          />
        ))}
      </div>
    </div>
  );
}
