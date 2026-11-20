import type { Example } from "./types";
import { check, copy, wrap } from "./icons";

export const codeBlockExamples: Example[] = [
    {
      title: "Default",
      html: `<div class="code-block" style="max-width: 32rem">
  <pre dir="ltr" tabindex="0"><code>pnpm add loseta</code></pre>
</div>`
    },
    {
      title: "Header and actions",
      html: `<div class="code-block">
  <header>
    <span data-slot="title">app/api/chat/route.ts</span>
    <div data-slot="actions">
      <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-slot="copy" aria-label="Copy code"><span data-slot="copy-icon">${copy}</span><span data-slot="check-icon">${check}</span></button>
    </div>
  </header>
  <pre dir="ltr" tabindex="0"><code>import { streamText } from "ai";

export async function POST(request: Request) {
  const { messages } = await request.json();
  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages
  });

  return result.toUIMessageStreamResponse();
}</code></pre>
</div>`
    },
    {
      title: "Line numbers",
      html: `<div class="code-block">
  <header>
    <span data-slot="title">app/dashboard/page.tsx</span>
    <div data-slot="actions">
      <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-slot="copy" aria-label="Copy code"><span data-slot="copy-icon">${copy}</span><span data-slot="check-icon">${check}</span></button>
    </div>
  </header>
  <pre data-line-numbers style="--line-start: 12" dir="ltr" tabindex="0"><code><span data-slot="line"><span data-slot="line-content">  if (!session) {</span></span>
<span data-slot="line"><span data-slot="line-content">    redirect("/login");</span></span>
<span data-slot="line"><span data-slot="line-content">  }</span></span>
<span data-slot="line"><span data-slot="line-content"></span></span>
<span data-slot="line"><span data-slot="line-content">  const projects = await db.project.findMany({</span></span>
<span data-slot="line"><span data-slot="line-content">    where: { ownerId: session.user.id },</span></span>
<span data-slot="line"><span data-slot="line-content">    orderBy: { updatedAt: "desc" }</span></span>
<span data-slot="line"><span data-slot="line-content">  });</span></span>
<span data-slot="line"><span data-slot="line-content">  return &lt;ProjectList projects={projects} /&gt;;</span></span>
<span data-slot="line"><span data-slot="line-content">}</span></span></code></pre>
</div>`
    },
    {
      title: "Diff and highlighted lines",
      html: `<div class="code-block">
  <header>
    <span data-slot="title">components/greeting.tsx</span>
    <div data-slot="actions">
      <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-slot="copy" aria-label="Copy code"><span data-slot="copy-icon">${copy}</span><span data-slot="check-icon">${check}</span></button>
    </div>
  </header>
  <pre dir="ltr" tabindex="0"><code><span data-slot="line"><span data-slot="line-content">export function Greeting({ name }: { name: string }) {</span></span>
<span data-slot="line"><span data-slot="line-content">  return &lt;p&gt;Hello, {name}&lt;/p&gt;;</span></span>
<span data-slot="line" data-variant="removed"><span data-slot="line-content">  return &lt;p className="text-sm text-muted-foreground"&gt;Hello, {name}!&lt;/p&gt;;</span></span>
<span data-slot="line" data-variant="added"><span data-slot="line-content">  return &lt;p&gt;Hello, {name}!&lt;/p&gt;;</span></span>
<span data-slot="line" data-variant="highlighted"><span data-slot="line-content">  const message = "Hello, " + name + "!";</span></span>
<span data-slot="line"><span data-slot="line-content">}</span></span></code></pre>
</div>`
    },
    {
      title: "Small, wrapped and destructive",
      html: `<div class="code-block" data-size="sm" data-variant="destructive">
  <header>
    <span data-slot="title">Error</span>
    <div data-slot="actions">
      <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-slot="wrap" aria-label="Wrap lines" aria-pressed="true">${wrap}</button>
      <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-slot="copy" aria-label="Copy output"><span data-slot="copy-icon">${copy}</span><span data-slot="check-icon">${check}</span></button>
    </div>
  </header>
  <pre data-wrap dir="ltr" tabindex="0"><code>TypeError: The model "anthropic/claude-sonnet-4.5" returned an error: Request too large. The prompt is 212,431 tokens but the context window is 200,000 tokens.</code></pre>
</div>`
    },
    {
      title: "Floating actions",
      html: `<div class="code-block">
  <div data-slot="actions">
    <button class="btn" data-variant="ghost" data-size="icon-xs" type="button" data-slot="copy" aria-label="Copy output"><span data-slot="copy-icon">${copy}</span><span data-slot="check-icon">${check}</span></button>
  </div>
  <pre dir="ltr" tabindex="0"><code>$ pnpm add ai @ai-sdk/react zod
Packages: +14
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0</code></pre>
</div>`
    }
];
