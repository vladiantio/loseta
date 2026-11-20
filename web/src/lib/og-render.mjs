import { readFile } from "node:fs/promises";
import { render } from "takumi-js";
import {
  createOgCardHtml,
  OG_IMAGE_FORMAT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH
} from "./og-card.mjs";

const fontPromise = readFile(new URL("../fonts/InterVariable.woff2", import.meta.url));

export async function renderOgCard({ title, description }) {
  const font = await fontPromise;

  return render(createOgCardHtml({ title, description }), {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    format: OG_IMAGE_FORMAT,
    fonts: [{ name: "Inter", data: font }],
    fontFamilies: ["Inter"]
  });
}
