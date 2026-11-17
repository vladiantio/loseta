import type { Example } from "./types";
import { ratioImage } from "./icons";

export const aspectRatioExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="aspect-ratio" style="max-width: 24rem">
  <img src="${ratioImage}" alt="A 16 by 9 media placeholder" />
</div>`
    },
    {
      title: "16 / 9",
      html: `<div class="aspect-ratio" style="--ratio: 16 / 9">
  <img src="${ratioImage}" alt="A 16 by 9 media placeholder" />
</div>`
    },
    {
      title: "Square, contain",
      html: `<div class="aspect-ratio" style="--ratio: 1 / 1; max-width: 16rem" data-fit="contain">
  <img src="${ratioImage}" alt="A wide media placeholder inside a square frame" />
</div>`
    }
];
