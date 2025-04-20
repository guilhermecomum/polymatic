import {
  ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";

import {
  BackwardIcon,
  ForwardIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";

import { channels } from "~/framework/channels";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/button";
import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import { Channel } from "~/components/Channel";
import { createPattern } from "~/framework/patterns";

export const meta: MetaFunction = () => {
  return [
    { title: "Polymatic v7" },
    { name: "description", content: "Welcome to Polymatic!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await channels.parse(cookieHeader)) || [];

  return { channels: (cookie.channels as Channel[]) || [] };
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await channels.parse(cookieHeader)) || {};
  const formData = await request.formData();
  const patterns: Channel[] | [] = Object.hasOwn(cookie, "channels")
    ? cookie.channels
    : [];

  if (formData.get("action") === "add") {
    const isEuclidian = new RegExp("^(\\d+),(\\d+)$");
    const isBinary = new RegExp("^[0-1]{1,}$");
    const pattern = formData.get("pattern") as string;
    let necklace: (0 | 1)[];

    if (isEuclidian.test(pattern)) {
      const [pulse, steps] = pattern
        .split(",")
        .map((number) => parseInt(number))
        .sort((a, b) => a - b);

      necklace = createPattern(pulse, steps);
    } else if (isBinary.test(pattern)) {
      necklace = createPattern(pattern);
    }

    cookie.channels = [
      {
        id: Date.now(),
        pattern: necklace.join(""),
        bpm: formData.get("tempo"),
        sample: formData.get("sample"),
        isPlaying: true,
      },
      ...patterns,
    ];
  }

  if (formData.get("action") === "delete") {
    cookie.channels = patterns.filter((p) => p.id != formData.get("id"));
  }

  if (formData.get("action") === "edit") {
    cookie.channels = patterns.map((p) =>
      p.id == formData.get("id")
        ? {
            ...p,
            pattern: formData.get("pattern"),
          }
        : p,
    );
  }
  return Response.json(cookie.channels as Channel[], {
    headers: {
      "Set-Cookie": await channels.serialize(cookie),
    },
  });
}

export default function Index() {
  const fetcher = useFetcher();
  const { channels } = useLoaderData<typeof loader>();
  const [sample, setSample] = useState("/samples/kick2.wav");
  const playerRef = useRef<Tone.Player | null>(null);

  useEffect(() => {
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
    playerRef.current.start(0);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex border-y border-white w-full p-4 space-x-2">
        <div id="general-control">
          <Button className="rounded-l-md">
            <BackwardIcon className="h-5 w-5" />
          </Button>
          <Button>
            <PlayIcon className="h-5 w-5 " />
          </Button>
          <Button>
            <StopIcon className="h-5 w-5" />
          </Button>
          <Button className="rounded-r-md">
            <ForwardIcon className="h-5 w-5" />
          </Button>
        </div>

        <fetcher.Form
          method="post"
          className="flex rounded-md shadow-sm space-x-2"
        >
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm">
              Padrão
            </span>
            <input
              type="text"
              name="pattern"
              className="flex-1 block text-black rounded-r-md pl-2 border-gray-300 sm:text-sm"
              placeholder="10101011 ou 3,2"
            />
          </div>

          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm">
              Tempo
            </span>
            <input
              type="text"
              name="tempo"
              className="flex-1 block text-black rounded-r-md pl-2 border-gray-300  sm:text-sm"
              defaultValue={120}
            />
          </div>
          <div className="flex shadow-sm rounded-r-md">
            <span className="bg-red-500 hover:bg-red-700 inline-flex items-center px-2 rounded-l-md border-r-0 border-gray-300 text-white-500 text-sm">
              <PlayIcon className="h-5 w-5" onClick={() => previewSample()} />
            </span>
            <select
              name="sampler"
              className="text-black rounded-r-md px-2"
              value={sample}
              onChange={(e) => setSample(e.target.value)}
            >
              <option value="/samples/kick2.wav">kick</option>
              <option value="/samples/bass.wav">bass</option>
            </select>
          </div>
          <input name="action" value="add" type="hidden" />
          <Button>Adicionar</Button>
        </fetcher.Form>
      </div>

      <div className="space-y-4 mt-4 p-4">
        {channels.map((track) => (
          <Channel key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
