export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_FORMAT = "png";
export const OG_SITE_DESCRIPTION = "Native CSS component scaffolds with the shadcn feel.";

const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => HTML_ESCAPES[character]);
}

function normalizeText(value, fallback) {
  const text = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > 0 ? text : fallback;
}

/**
 * Builds the Open Graph card as an HTML document. Takumi renders this with the
 * local Inter variable font; keep the layout self-contained and free of
 * network resources.
 */
export function createOgCardHtml({ title, description }) {
  const cardTitle = normalizeText(title, "loseta");
  const cardDescription = normalizeText(description, OG_SITE_DESCRIPTION);

  return `<!doctype html>
<html lang="en">
  <head>
    <style>
      html,
      body {
        width: ${OG_IMAGE_WIDTH}px;
        height: ${OG_IMAGE_HEIGHT}px;
        margin: 0;
        padding: 0;
        background: #0a0a0a;
      }

      * {
        box-sizing: border-box;
      }

      .card {
        position: relative;
        width: ${OG_IMAGE_WIDTH}px;
        height: ${OG_IMAGE_HEIGHT}px;
        overflow: hidden;
        background: #0a0a0a;
        color: #fafafa;
        font-family: Inter;
        /* Match the docs site's Inter feature settings. */
        font-feature-settings: "ss02";
      }

      .frame {
        position: absolute;
        top: 48px;
        right: 48px;
        bottom: 48px;
        left: 48px;
        border: 1px solid #262626;
      }

      .tick {
        position: absolute;
        background: #262626;
      }

      .tick-v {
        width: 1px;
        height: 48px;
      }

      .tick-h {
        width: 48px;
        height: 1px;
      }

      .tick-top-left-v {
        top: 0;
        left: 48px;
      }

      .tick-top-left-h {
        top: 48px;
        left: 0;
      }

      .tick-top-right-v {
        top: 0;
        right: 48px;
      }

      .tick-top-right-h {
        top: 48px;
        right: 0;
      }

      .tick-bottom-left-v {
        bottom: 0;
        left: 48px;
      }

      .tick-bottom-left-h {
        bottom: 48px;
        left: 0;
      }

      .tick-bottom-right-v {
        bottom: 0;
        right: 48px;
      }

      .tick-bottom-right-h {
        bottom: 48px;
        right: 0;
      }

      .content {
        position: absolute;
        top: 48px;
        right: 48px;
        bottom: 48px;
        left: 48px;
        padding: 80px;
      }

      .title {
        display: -webkit-box;
        max-width: 900px;
        margin: 45px 0 0;
        overflow: hidden;
        color: #fafafa;
        font-size: 72px;
        font-weight: 600;
        line-height: 1.08;
        letter-spacing: -0.035em;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
      }

      .description {
        display: -webkit-box;
        max-width: 760px;
        margin: 54px 0 0;
        overflow: hidden;
        color: #a1a1aa;
        font-size: 38px;
        font-weight: 400;
        line-height: 1.35;
        letter-spacing: -0.01em;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-clamp: 3;
      }

      .brand {
        position: absolute;
        right: 80px;
        bottom: 80px;
        display: flex;
        align-items: center;
        gap: 14px;
        color: #fafafa;
        font-size: 30px;
        font-weight: 600;
        letter-spacing: -0.02em;
      }

      .mark {
        width: 34px;
        height: 34px;
      }
    </style>
  </head>
  <body>
    <main class="card">
      <div class="frame"></div>
      <div class="tick tick-v tick-top-left-v"></div>
      <div class="tick tick-h tick-top-left-h"></div>
      <div class="tick tick-v tick-top-right-v"></div>
      <div class="tick tick-h tick-top-right-h"></div>
      <div class="tick tick-v tick-bottom-left-v"></div>
      <div class="tick tick-h tick-bottom-left-h"></div>
      <div class="tick tick-v tick-bottom-right-v"></div>
      <div class="tick tick-h tick-bottom-right-h"></div>
      <div class="content">
        <h1 class="title">${escapeHtml(cardTitle)}</h1>
        <p class="description">${escapeHtml(cardDescription)}</p>
        <div class="brand">
          <svg class="mark" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m887.62 680.36-207.25 207.25m165.8-435.23-393.78 393.78"
              stroke="#fafafa"
              stroke-linecap="round"
              stroke-width="64.767"
            />
          </svg>
          <span>loseta</span>
        </div>
      </div>
    </main>
  </body>
</html>`;
}
