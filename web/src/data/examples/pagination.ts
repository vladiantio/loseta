import type { Example } from "./types";
import { chevronLeft, chevronRight, moreHorizontal } from "./icons";

export const paginationExamples: Example[] = [
    {
      title: "Default",
      html: `<nav class="pagination" aria-label="pagination">
  <ul>
    <li>
      <a class="btn" data-variant="ghost" data-size="icon" href="#" aria-label="Go to previous page">${chevronLeft}</a>
    </li>
    <li><a class="btn" data-variant="ghost" href="#" aria-current="page">1</a></li>
    <li><a class="btn" data-variant="ghost" href="#">2</a></li>
    <li><a class="btn" data-variant="ghost" href="#">3</a></li>
    <li>
      <a class="btn" data-variant="ghost" data-size="icon" href="#" aria-label="Go to next page">${chevronRight}</a>
    </li>
  </ul>
</nav>`
    },
    {
      title: "With ellipsis",
      html: `<nav class="pagination" aria-label="pagination">
  <ul>
    <li>
      <a class="btn" data-variant="ghost" href="#" aria-label="Go to previous page">
        ${chevronLeft}
        <span data-slot="label" aria-hidden="true">Previous</span>
      </a>
    </li>
    <li><a class="btn" data-variant="ghost" href="#">1</a></li>
    <li><a class="btn" data-variant="ghost" href="#">2</a></li>
    <li><a class="btn" data-variant="ghost" href="#">3</a></li>
    <li><span data-slot="ellipsis" aria-hidden="true">${moreHorizontal}</span></li>
    <li><a class="btn" data-variant="ghost" href="#">8</a></li>
    <li><a class="btn" data-variant="ghost" href="#">9</a></li>
    <li><a class="btn" data-variant="ghost" href="#" aria-current="page">10</a></li>
    <li>
      <a class="btn" data-variant="ghost" href="#" aria-label="Go to next page">
        <span data-slot="label" aria-hidden="true">Next</span>
        ${chevronRight}
      </a>
    </li>
  </ul>
</nav>`
    }
];
