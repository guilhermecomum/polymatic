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
import { createPattern } from "~/framework/patterns";
import { Button } from "~/components/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Polymatic v7" },
    { name: "description", content: "Welcome to Polymatic!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await channels.parse(cookieHeader)) || [];

  return Response.json({ channels: cookie.channels || [] });
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await channels.parse(cookieHeader)) || {};
  const formData = await request.formData();
  const patterns = cookie.hasOwnProperty("channels") ? cookie.channels : [];

  if (formData.get("action") === "add") {
    cookie.channels = [
      {
        id: Date.now(),
        pattern: formData.get("pattern"),
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

  return Response.json(cookie.channels, {
    headers: {
      "Set-Cookie": await channels.serialize(cookie),
    },
  });
}

export default function Index() {
  const fetcher = useFetcher();
  const { channels } = useLoaderData<typeof loader>();
  console.log(`🐞🐞🐞 channels`, channels);

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
            <span className="inline-flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm">
              <PlayIcon className="h-5 w-5 " />
            </span>
            <select name="sampler" className="text-black rounded-r-md px-2">
              <option value="kick.wav">kick</option>
              <option value="hithat.wav">hithat</option>
            </select>
          </div>
          <input name="action" value="add" type="hidden" />
          <Button>Adicionar</Button>
        </fetcher.Form>
      </div>

      <div className="space-y-4 mt-4 p-4">
        {channels &&
          channels.length > 0 &&
          channels.map((track) => {
            const { pattern, bpm } = track;
            const isEuclidian = new RegExp("^(\\d+),(\\d+)$");
            const isBinary = new RegExp("^[0-1]{1,}$");
            let necklace;

            if (isEuclidian.test(pattern)) {
              const [pulse, steps] = pattern
                .split(",")
                .map((number) => parseInt(number))
                .sort((a, b) => a - b);

              necklace = createPattern(pulse, steps);
            } else if (isBinary.test(pattern)) {
              necklace = createPattern(pattern);
            }

            return (
              <div key={track.id}>
                <fetcher.Form
                  method="post"
                  className="flex rounded-md shadow-sm space-x-2"
                >
                  <>
                    <p className="mb-4">Padrão: {necklace.join(",")}</p>
                    <p className="mb-4">bpm: {bpm}</p>
                    <div className="space-x-2">
                      {necklace.map((isActive, index) => (
                        <button
                          key={index}
                          className={`
                      w-12 h-12 rounded-md transition-colors
                      ${isActive === 1 ? "bg-blue-500" : "bg-gray-700"}
                    `}
                        />
                      ))}
                    </div>
                    <input type="hidden" value="delete" name="action" />
                    <input type="hidden" value={track.id} name="id" />
                    <Button>
                      <TrashIcon className="h-4 w-4 text-white" />
                    </Button>
                  </>
                </fetcher.Form>
              </div>
            );
          })}
      </div>
    </div>
  );
}
