import { Button } from "~/components/button";
import { useFetcher } from "@remix-run/react";
import { TrashIcon } from "@heroicons/react/16/solid";
import Guia from "./Guia";

type Channel = {
  id: string;
  pattern: string;
  bpm: number;
  sample: string;
  isPlaying: boolean;
};

function Channel({ track }: { track: Channel }) {
  const fetcher = useFetcher();
  const { pattern, bpm, id } = track;

  return (
    <div key={id}>
      <fetcher.Form
        method="post"
        className="flex flex-col rounded-md shadow-sm space-x-2"
      >
        <>
          <div className="space-x-2">
            <Guia id={id} currentStep={0} pattern={pattern} />
            <p className="mb-4">bpm: {bpm}</p>
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
}

export { Channel };
