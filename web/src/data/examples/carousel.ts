import type { Example } from "./types";
import { chevronLeft, chevronRight } from "./icons";

export const carouselExamples: Example[] = [
    {
      title: "Default",
      html: `<section class="carousel" data-orientation="horizontal" aria-roledescription="carousel" aria-label="Featured components" data-demo="carousel">
  <div class="carousel-viewport" tabindex="0">
    <div class="carousel-track">
      <div class="carousel-item" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="card">
          <header>
            <h3 data-slot="title">Accordion</h3>
            <p data-slot="description">Disclosure patterns</p>
          </header>
          <section>
            <p>Native details and summary with exclusive groups.</p>
          </section>
        </div>
      </div>
      <div class="carousel-item" role="group" aria-roledescription="slide" aria-label="2 of 3">
        <div class="card">
          <header>
            <h3 data-slot="title">Avatar</h3>
            <p data-slot="description">Identity at a glance</p>
          </header>
          <section>
            <p>Images, fallback initials, badges and overlapping groups.</p>
          </section>
        </div>
      </div>
      <div class="carousel-item" role="group" aria-roledescription="slide" aria-label="3 of 3">
        <div class="card">
          <header>
            <h3 data-slot="title">Breadcrumb</h3>
            <p data-slot="description">Navigation context</p>
          </header>
          <section>
            <p>Ordered links with a current page and collapsed paths.</p>
          </section>
        </div>
      </div>
    </div>
  </div>
  <div class="carousel-controls">
    <button type="button" class="carousel-button" data-demo-carousel-prev aria-label="Previous slide">${chevronLeft}</button>
    <div class="carousel-indicators" role="group" aria-label="Slides">
      <button type="button" class="carousel-indicator" aria-label="Go to slide 1" aria-current="true" data-demo-carousel-go="0"></button>
      <button type="button" class="carousel-indicator" aria-label="Go to slide 2" data-demo-carousel-go="1"></button>
      <button type="button" class="carousel-indicator" aria-label="Go to slide 3" data-demo-carousel-go="2"></button>
    </div>
    <button type="button" class="carousel-button" data-demo-carousel-next aria-label="Next slide">${chevronRight}</button>
  </div>
</section>`
    }
];
