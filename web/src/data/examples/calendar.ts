import type { Example } from "./types";
import { chevronLeft, chevronRight } from "./icons";

export const calendarExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="calendar">
  <header>
    <button type="button" aria-label="Previous month">${chevronLeft}</button>
    <span data-slot="title" aria-live="polite">February 2026</span>
    <button type="button" aria-label="Next month">${chevronRight}</button>
  </header>
  <table role="grid">
    <caption class="sr-only">February 2026</caption>
    <thead>
      <tr>
        <th scope="col"><abbr title="Sunday">Su</abbr></th>
        <th scope="col"><abbr title="Monday">Mo</abbr></th>
        <th scope="col"><abbr title="Tuesday">Tu</abbr></th>
        <th scope="col"><abbr title="Wednesday">We</abbr></th>
        <th scope="col"><abbr title="Thursday">Th</abbr></th>
        <th scope="col"><abbr title="Friday">Fr</abbr></th>
        <th scope="col"><abbr title="Saturday">Sa</abbr></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 1, 2026">1</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 2, 2026">2</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 3, 2026">3</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 4, 2026">4</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 5, 2026">5</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 6, 2026">6</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 7, 2026">7</button></td>
      </tr>
      <tr>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 8, 2026">8</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 9, 2026">9</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 10, 2026">10</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 11, 2026">11</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 12, 2026">12</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 13, 2026">13</button></td>
        <td role="gridcell" aria-selected="true"><button type="button" aria-label="February 14, 2026">14</button></td>
      </tr>
      <tr>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 15, 2026">15</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 16, 2026">16</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 17, 2026">17</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 18, 2026">18</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 19, 2026">19</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 20, 2026">20</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 21, 2026">21</button></td>
      </tr>
      <tr>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 22, 2026">22</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 23, 2026">23</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 24, 2026">24</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 25, 2026">25</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 26, 2026">26</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 27, 2026">27</button></td>
        <td role="gridcell" aria-selected="false"><button type="button" aria-label="February 28, 2026">28</button></td>
      </tr>
    </tbody>
  </table>
</div>`
    }
];
