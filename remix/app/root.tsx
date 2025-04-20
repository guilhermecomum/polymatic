import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useSearchParams,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import * as Tone from "tone";
import "./tailwind.css";
import { useEffect } from "react";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  //const [searchParams] = useSearchParams();
  // const isPlaying = searchParams.get("isPlaying") === "true" ? true : false;

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
  }, []);

  // useEffect(() => {
  //   if (isPlaying) {
  //     Tone.getTransport().start();
  //   } else {
  //     Tone.getTransport().stop();
  //   }
  //   /* eslint-disable-next-line */
  // }, [isPlaying]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-screen bg-black text-white">
        <div className="flex text-red mb-4 p-2 space-x-4">
          <Link className="text-red" to="/">
            Polymatic 7.0.0
          </Link>
        </div>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
