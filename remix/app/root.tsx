import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUser } from "~/services/session.server";
import { UserMenu } from "~/components/UserMenu";
import "./tailwind.css";

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

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  return json({ user });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-screen bg-black text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
        {/* Client-side hash URL redirect for legacy CRA format */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.location.hash && window.location.hash.startsWith('#/guias')) {
                  var hashPath = window.location.hash.substring(1);
                  window.location.replace(hashPath);
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="flex justify-between items-center text-red p-4">
        <Link className="text-[#cc2c11] text-3xl" to="/">
          Polymatic 7.0.0
        </Link>
        <UserMenu user={user} />
      </div>
      <Outlet />
    </>
  );
}
