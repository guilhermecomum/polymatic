import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getCompositionBySlug, encodeShareData } from "~/services/share.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { slug } = params;

  if (!slug) {
    return redirect("/");
  }

  const composition = await getCompositionBySlug(slug);

  if (!composition) {
    return redirect("/");
  }

  // Redirect to main page with composition data encoded in URL
  const encoded = encodeShareData({
    channels: composition.channels,
    bpm: composition.bpm,
  });

  return redirect(`/?data=${encoded}`);
}

export default function CompositionSlug() {
  // This should never render due to the redirect in loader
  return null;
}
