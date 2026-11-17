import type { Example } from "./types";
import { chevronRight, moreHorizontal } from "./icons";

export const breadcrumbExamples: Example[] = [
    {
      title: "Default",
      html: `<nav class="breadcrumb" aria-label="breadcrumb">
  <ol>
    <li><a href="#">Home</a></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><a href="#">Components</a></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><span aria-current="page">Breadcrumb</span></li>
  </ol>
</nav>`
    },
    {
      title: "Collapsed",
      html: `<nav class="breadcrumb" aria-label="breadcrumb">
  <ol>
    <li><a href="#">Home</a></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><span data-slot="ellipsis" aria-hidden="true">${moreHorizontal}</span></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><a href="#">Components</a></li>
    <li role="presentation" aria-hidden="true">${chevronRight}</li>
    <li><span aria-current="page">Breadcrumb</span></li>
  </ol>
</nav>`
    }
];
