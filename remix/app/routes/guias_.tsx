import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { parseLegacyGuias, encodeShareData } from "~/services/share.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  // Get the guias parameter from URL (legacy CRA format)
  const guiasParam = url.searchParams.get("guias");

  if (guiasParam) {
    // Parse the legacy format
    // URLSearchParams.get() already decodes, no need for decodeURIComponent
    const shareData = parseLegacyGuias(guiasParam);

    if (shareData) {
      // Encode to new format and redirect to main page
      const encoded = encodeShareData(shareData);
      return redirect(`/?data=${encoded}`);
    }
  }

  // If no valid guias parameter, redirect to home
  return redirect("/");
}

export default function Guias() {
  // This should never render due to the redirect in loader
  return null;
}
