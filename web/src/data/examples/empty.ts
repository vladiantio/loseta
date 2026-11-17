import type { Example } from "./types";
import { arrowUpRight, bell, emptyIllustration, folderCode, plusInline, refresh, search } from "./icons";

export const emptyExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="empty">
  <header>
    <figure>${search}</figure>
    <h2>No results found</h2>
    <p>Try adjusting your search or filters.</p>
  </header>
  <section>
    <button class="btn" data-variant="outline">Clear filters</button>
  </section>
</div>`
    },
    {
      title: "Actions",
      html: `<div class="empty">
  <header>
    <figure>${folderCode}</figure>
    <h2>No projects yet</h2>
    <p>You haven't created any projects yet. Get started by creating your first project.</p>
  </header>
  <section style="flex-direction: row; justify-content: center">
    <button class="btn">Create project</button>
    <button class="btn" data-variant="outline">Import project</button>
  </section>
  <footer>
    <a class="btn" data-variant="link" data-size="sm" href="#">Learn more ${arrowUpRight}</a>
  </footer>
</div>`
    },
    {
      title: "Background",
      html: `<div class="empty" style="background-color: color-mix(in oklab, var(--muted) 50%, transparent)">
  <header>
    <figure>${bell}</figure>
    <h2>No notifications</h2>
    <p>You're all caught up. New notifications will appear here.</p>
  </header>
  <section>
    <button class="btn" data-variant="outline">${refresh} Refresh</button>
  </section>
</div>`
    },
    {
      title: "Avatar",
      html: `<div class="empty">
  <header>
    <figure>
      <span class="avatar" data-size="lg"><span data-slot="fallback">LR</span></span>
    </figure>
    <h2>User offline</h2>
    <p>This user is currently offline. You can leave a message to notify them or try again later.</p>
  </header>
  <section>
    <button class="btn" data-size="sm">Leave message</button>
  </section>
</div>`
    },
    {
      title: "Avatar group",
      html: `<div class="empty">
  <header>
    <figure>
      <div class="avatar-group">
        <span class="avatar" data-size="lg"><span data-slot="fallback">CN</span></span>
        <span class="avatar" data-size="lg"><span data-slot="fallback">LR</span></span>
        <span class="avatar" data-size="lg"><span data-slot="fallback">ER</span></span>
      </div>
    </figure>
    <h2>No team members</h2>
    <p>Invite your team to collaborate on this project.</p>
  </header>
  <section>
    <button class="btn" data-size="sm">${plusInline} Invite members</button>
  </section>
</div>`
    },
    {
      title: "Image",
      html: `<div class="empty">
  <header>
    <figure><img src="${emptyIllustration}" alt=""></figure>
    <h2>No previews yet</h2>
    <p>Upload an image to see a preview here.</p>
  </header>
  <section>
    <button class="btn" data-variant="outline">Upload image</button>
  </section>
</div>`
    },
    {
      title: "Search",
      html: `<div class="empty">
  <header>
    <h2>404 - Not found</h2>
    <p>The page you're looking for doesn't exist. Try searching for what you need below.</p>
  </header>
  <section>
    <div class="input-group" role="group" aria-label="Search pages">
      <input class="input" type="search" placeholder="Try searching for pages..." aria-label="Search pages">
      <span data-slot="addon" data-align="inline-start" aria-hidden="true">${search}</span>
      <span data-slot="addon" data-align="inline-end" aria-hidden="true"><span class="kbd">/</span></span>
    </div>
  </section>
  <footer>
    <a class="btn" data-variant="link" data-size="sm" href="#">Contact support</a>
  </footer>
</div>`
    },
    {
      title: "Right-to-left",
      html: `<div class="empty" dir="rtl" lang="ar">
  <header>
    <figure>${folderCode}</figure>
    <h2>لا توجد مشاريع بعد</h2>
    <p>لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.</p>
  </header>
  <section style="flex-direction: row; justify-content: center">
    <button class="btn">إنشاء مشروع</button>
    <button class="btn" data-variant="outline">استيراد مشروع</button>
  </section>
  <footer>
    <a class="btn" data-variant="link" data-size="sm" href="#">تعرف على المزيد</a>
  </footer>
</div>`
    }
];
