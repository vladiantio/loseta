import type { Example } from "./types";
import { chevronDown, chevronRight, dot, moreHorizontal } from "./icons";

const separator = chevronRight.replace(
  'aria-hidden="true"',
  'aria-hidden="true" data-rtl-flip'
);

const menuIcon = chevronDown.replace(
  'aria-hidden="true"',
  'aria-hidden="true" style="inline-size: 0.875rem; block-size: 0.875rem"'
);

export const breadcrumbExamples: Example[] = [
    {
      title: "Default",
      html: `<nav class="breadcrumb" aria-label="breadcrumb">
  <ol>
    <li><a href="#">Home</a></li>
    <li role="presentation" aria-hidden="true">${separator}</li>
    <li><a href="#">Components</a></li>
    <li role="presentation" aria-hidden="true">${separator}</li>
    <li><span aria-current="page">Breadcrumb</span></li>
  </ol>
</nav>`
    },
    {
      title: "Ellipsis",
      html: `<nav class="breadcrumb" aria-label="breadcrumb">
  <ol>
    <li><a href="#">Home</a></li>
    <li role="presentation" aria-hidden="true">${separator}</li>
    <li><span data-slot="ellipsis" aria-hidden="true">${moreHorizontal}</span></li>
    <li role="presentation" aria-hidden="true">${separator}</li>
    <li><a href="#">Components</a></li>
    <li role="presentation" aria-hidden="true">${separator}</li>
    <li><span aria-current="page">Breadcrumb</span></li>
  </ol>
</nav>`
    },
    {
      title: "Ellipsis menu",
      html: `<div style="display: flex; align-items: flex-start; justify-content: center; width: 100%; min-height: 12rem; padding-block-start: 0.5rem">
  <nav class="breadcrumb" aria-label="breadcrumb">
    <ol>
      <li><a href="#">Home</a></li>
      <li role="presentation" aria-hidden="true">${separator}</li>
      <li>
        <div class="dropdown-menu" data-demo="dropdown">
          <button type="button" class="btn" data-variant="ghost" data-size="icon-sm" data-demo-trigger aria-haspopup="menu" aria-expanded="false" aria-controls="demo-breadcrumb-ellipsis-panel" aria-label="Show more breadcrumb items">
            <span data-slot="ellipsis" aria-hidden="true">${moreHorizontal}</span>
          </button>
          <div data-popover data-side="bottom" data-align="start" id="demo-breadcrumb-ellipsis-panel" aria-hidden="true">
            <div role="menu">
              <button type="button" role="menuitem">Documentation</button>
              <button type="button" role="menuitem">Themes</button>
              <button type="button" role="menuitem">GitHub</button>
            </div>
          </div>
        </div>
      </li>
      <li role="presentation" aria-hidden="true">${separator}</li>
      <li><a href="#">Components</a></li>
      <li role="presentation" aria-hidden="true">${separator}</li>
      <li><span aria-current="page">Breadcrumb</span></li>
    </ol>
  </nav>
</div>`
    },
    {
      title: "Dropdown",
      html: `<div style="display: flex; align-items: flex-start; justify-content: center; width: 100%; min-height: 12rem; padding-block-start: 0.5rem">
  <nav class="breadcrumb" aria-label="breadcrumb">
    <ol>
      <li><a href="#">Home</a></li>
      <li role="presentation" aria-hidden="true">${separator}</li>
      <li>
        <div class="dropdown-menu" data-demo="dropdown">
          <button type="button" data-demo-trigger aria-haspopup="menu" aria-expanded="false" aria-controls="demo-breadcrumb-dropdown-panel">
            Components ${menuIcon}
          </button>
          <div data-popover data-side="bottom" data-align="start" id="demo-breadcrumb-dropdown-panel" aria-hidden="true">
            <div role="menu">
              <button type="button" role="menuitem">Documentation</button>
              <button type="button" role="menuitem">Themes</button>
              <button type="button" role="menuitem">GitHub</button>
            </div>
          </div>
        </div>
      </li>
      <li role="presentation" aria-hidden="true">${separator}</li>
      <li><span aria-current="page">Breadcrumb</span></li>
    </ol>
  </nav>
</div>`
    },
    {
      title: "Custom separator",
      html: `<nav class="breadcrumb" aria-label="breadcrumb">
  <ol>
    <li><a href="#">Home</a></li>
    <li role="presentation" aria-hidden="true">${dot}</li>
    <li><a href="#">Components</a></li>
    <li role="presentation" aria-hidden="true">${dot}</li>
    <li><span aria-current="page">Breadcrumb</span></li>
  </ol>
</nav>`
    },
    {
      title: "Right-to-left",
      html: `<div dir="rtl" lang="ar" style="display: flex; justify-content: center; width: 100%">
  <nav class="breadcrumb" aria-label="مسار التنقل">
    <ol>
      <li><a href="#">الرئيسية</a></li>
      <li role="presentation" aria-hidden="true">${separator}</li>
      <li><span data-slot="ellipsis" aria-hidden="true">${moreHorizontal}</span></li>
      <li role="presentation" aria-hidden="true">${separator}</li>
      <li><a href="#">المكونات</a></li>
      <li role="presentation" aria-hidden="true">${separator}</li>
      <li><span aria-current="page">مسار التنقل</span></li>
    </ol>
  </nav>
</div>`
    }
];
