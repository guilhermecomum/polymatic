import {
  type MetaFunction,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams, useFetcher } from "@remix-run/react";

import {
  PlayIcon,
  StopIcon,
  ShareIcon,
  BookmarkIcon,
} from "@heroicons/react/16/solid";

import { Button } from "~/components/button";
import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import { Channel } from "~/components/Channel";
import { createPattern } from "~/framework/patterns";
import { instruments } from "~/framework/instruments";
import {
  decodeShareData,
  encodeShareData,
  saveComposition,
  validateChannels,
} from "~/services/share.server";
import { getUserId } from "~/services/session.server";
import { ShareModal } from "~/components/ShareModal";

export const meta: MetaFunction = () => {
  return [
    { title: "Polymatic v7" },
    { name: "description", content: "Welcome to Polymatic!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const dataParam = url.searchParams.get("data");

  let initialChannels: { pattern: string; sample: string }[] = [];
  let initialBpm = 120;

  if (dataParam) {
    const shareData = decodeShareData(dataParam);
    if (shareData) {
      initialChannels = shareData.channels;
      initialBpm = shareData.bpm;
    }
  }

  const userId = await getUserId(request);

  return json({ initialChannels, initialBpm, isLoggedIn: !!userId });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "save") {
    const userId = await getUserId(request);
    if (!userId) {
      return json({ error: "Você precisa estar logado para salvar" }, { status: 401 });
    }

    const channelsJson = formData.get("channels");
    const bpm = Number(formData.get("bpm")) || 120;
    const title = formData.get("title") as string | null;
    const folderId = formData.get("folderId") as string | null;

    if (typeof channelsJson !== "string") {
      return json({ error: "Dados inválidos" }, { status: 400 });
    }

    try {
      const channels = JSON.parse(channelsJson);
      if (!validateChannels(channels)) {
        return json({ error: "Dados de canais inválidos" }, { status: 400 });
      }
      const result = await saveComposition(
        { channels, bpm },
        { userId, title: title || undefined, folderId: folderId || undefined }
      );

      return json({ success: true, slug: result.slug });
    } catch {
      return json({ error: "Erro ao salvar composição" }, { status: 500 });
    }
  }

  if (intent === "share") {
    const channelsJson = formData.get("channels");
    const bpm = Number(formData.get("bpm")) || 120;

    if (typeof channelsJson !== "string") {
      return json({ error: "Dados inválidos" }, { status: 400 });
    }

    try {
      const channels = JSON.parse(channelsJson);
      if (!validateChannels(channels)) {
        return json({ error: "Dados de canais inválidos" }, { status: 400 });
      }
      const encoded = encodeShareData({ channels, bpm });
      const appUrl = process.env.APP_URL || "http://localhost:5173";
      const shareUrl = `${appUrl}/?data=${encoded}`;

      return json({ success: true, shareUrl });
    } catch {
      return json({ error: "Erro ao gerar link" }, { status: 500 });
    }
  }

  return json({ error: "Ação desconhecida" }, { status: 400 });
}

type ChannelType = {
  id: number;
  pattern: string;
  sample: string;
};

export default function Index() {
  const { initialChannels, initialBpm, isLoggedIn } =
    useLoaderData<typeof loader>();
  const [, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<{
    success?: boolean;
    shareUrl?: string;
    slug?: string;
    error?: string;
  }>();

  const [channels, setChannels] = useState<ChannelType[]>(() => {
    // Initialize with channels from URL if present
    return initialChannels.map((c, i) => ({
      id: Date.now() + i,
      pattern: c.pattern,
      sample: c.sample,
    }));
  });

  const [bpm, setBpm] = useState(initialBpm);
  const [pattern, setPattern] = useState<string>("");
  const [sample, setSample] = useState(
    "/samples/brazilian-percussion/agogo1.wav"
  );
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const playerRef = useRef<Tone.Player | null>(null);

  // Sync loader data into state when navigating with ?data= param
  useEffect(() => {
    if (initialChannels.length > 0) {
      setChannels(
        initialChannels.map((c, i) => ({
          id: Date.now() + i,
          pattern: c.pattern,
          sample: c.sample,
        }))
      );
      setBpm(initialBpm);
      setSearchParams({}, { replace: true });
    }
  }, [initialChannels]);

  // Handle fetcher responses
  useEffect(() => {
    if (fetcher.data?.success) {
      if (fetcher.data.shareUrl) {
        setShareUrl(fetcher.data.shareUrl);
        setIsShareModalOpen(true);
      }
      if (fetcher.data.slug) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    }
  }, [fetcher.data]);

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
      }
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

  // Update BPM when it changes
  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

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
      },
    ]);
    const transport = Tone.getTransport();
    if (transport.state === "started") {
      transport.stop();
      transport.start();
    }
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
          : p
      )
    );

  const handleEditPattern = (id: number, pattern: string) => {
    setChannels(
      channels.map((p) =>
        p.id == id
          ? {
              ...p,
              pattern,
            }
          : p
      )
    );
    const transport = Tone.getTransport();
    if (transport.state === "started") {
      transport.stop();
      transport.start();
    }
  };
  const handlePlay = () => Tone.getTransport().start();

  const handlePause = () => Tone.getTransport().stop();

  const handleBPM = (newBpm: number) => {
    setBpm(newBpm);
  };

  const handleShare = () => {
    const channelsData = channels.map((c) => ({
      pattern: c.pattern,
      sample: c.sample,
    }));

    fetcher.submit(
      {
        intent: "share",
        channels: JSON.stringify(channelsData),
        bpm: bpm.toString(),
      },
      { method: "post" }
    );
  };

  const handleSave = () => {
    if (!isLoggedIn) {
      window.location.href = "/login?redirectTo=/";
      return;
    }

    const channelsData = channels.map((c) => ({
      pattern: c.pattern,
      sample: c.sample,
    }));

    fetcher.submit(
      {
        intent: "save",
        channels: JSON.stringify(channelsData),
        bpm: bpm.toString(),
      },
      { method: "post" }
    );
  };

  return (
    <div className="flex w-full flex-col">
      <div className="grid grid-flow-col gap-2 border-y border-white p-4 w-full">
        <div className="flex space-x-2">
          <div id="general-control">
            <Button className="rounded-l-md" onClick={() => handlePlay()}>
              <PlayIcon className="h-5 w-5 " />
            </Button>
            <Button className="rounded-r-md" onClick={() => handlePause()}>
              <StopIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex rounded-md shadow-sm space-x-2 justify-self-start">
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-300 text-gray-500 text-sm">
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

            <Button className="rounded-md" onClick={() => handleCreate()}>
              Adicionar
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4 justify-self-end">
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-300 text-gray-500 text-sm">
              BPM
            </span>
            <input
              type="number"
              name="bpm"
              className="flex-1 block text-black rounded-r-md pl-2 border-gray-300 sm:text-sm w-20"
              value={bpm}
              onChange={(e) => handleBPM(Number(e.target.value))}
            />
          </div>

          {channels.length > 0 && (
            <div className="flex space-x-2">
              <Button
                className="rounded-md flex items-center space-x-1"
                onClick={handleShare}
                disabled={fetcher.state === "submitting"}
              >
                <ShareIcon className="h-4 w-4" />
                <span>Compartilhar</span>
              </Button>
              <Button
                className="rounded-md flex items-center space-x-1"
                onClick={handleSave}
                disabled={fetcher.state === "submitting"}
              >
                <BookmarkIcon className="h-4 w-4" />
                <span>{saveSuccess ? "Salvo!" : "Salvar"}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-4 items-center flex-wrap mt-4 p-4">
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

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
      />

      {fetcher.data?.error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-md">
          {fetcher.data.error}
        </div>
      )}
    </div>
  );
}
