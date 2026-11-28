# loseta

loseta is a copy-paste registry of native CSS component styles with a documented markup contract. This glossary fixes the vocabulary used across the registry, the CLI, the documentation and the CSS itself.

## Distribution

**Registry**:
The authored catalog of installable CSS items and optional behavior modules,
served as static JSON and copied into a project by the CLI.
_Avoid_: package, bundle, library

**Catalog**:
The content-free registry manifest served at `<registry>/registry.json`: wire
schema version, minimum CLI version, build identifier, styles and per-item
hashes.
_Avoid_: index, package manifest

**Item payload**:
The installable JSON for one item and style, with CSS, behavior and example
content inlined. Official payloads are hash-verified against the catalog.
_Avoid_: item file, download

**Registry URL**:
The base URL the CLI reads the catalog and payloads from. It resolves from
`--registry`, `LOSETA_REGISTRY`, `loseta.json`, then the default
`https://loseta.vladiantio.com/r`.
_Avoid_: endpoint, source URL

**Build**:
The git identifier the catalog reports for the content it serves. It is
diagnostic: registry content is mutable and is not version-pinned.
_Avoid_: version, release

**URL install**:
An item payload fetched from an absolute URL instead of the configured
registry. It is style-bound, confirmed separately and recorded with its source.
_Avoid_: external install, remote item

**Item**:
One named entry in the registry with its own files, root selectors and dependency metadata.
_Avoid_: entry, module, asset

**Copy-paste distribution**:
A delivery model in which installed files become part of the consumer's project and can be edited freely.
_Avoid_: dependency install, runtime import

**Install target**:
The location inside the consumer's CSS directory where an item file is written.
_Avoid_: output path, destination

**CSS directory**:
The consumer-owned directory that receives all installed files.
_Avoid_: output folder, build directory

**Manifest**:
The record of installed items, optional URL sources, the registry URL and build,
and the hash of every installed file.
_Avoid_: lockfile, state file

**Generated entrypoint**:
The stylesheet the CLI regenerates from the manifest to declare layer order and import installed files.
_Avoid_: bundle, main stylesheet

## Item kinds

**Foundation**:
An item that provides a global prerequisite shared by every component, such as tokens, reset, base defaults or utilities.
_Avoid_: core, globals

**Primitive**:
An internal item installed automatically to provide shared structure for one or more public components.
_Avoid_: base component, helper, utility component

**Component**:
A public UI element with its own root class, structural file and style file.
_Avoid_: widget, block, element

**Style**:
The visual interpretation of the system. The shipped styles are Nova (default), Vega, Maia, Lyra, Mira, Luma, Sera and Rhea.
_Avoid_: theme, skin, preset

**Nova**:
The default and reference visual style: reduced padding and tighter margins.
_Avoid_: theme, skin

**Vega**:
The classic shadcn/ui visual style: medium radii and balanced spacing.
_Avoid_: classic theme, default style

## Architecture

**Base file**:
The structural half of an item: markup expectations, layout and behavior hooks.
_Avoid_: core CSS, style file

**Style file**:
The visual half of an item: color, typography, spacing and surface treatment.
_Avoid_: theme file, override, skin

**Layer**:
One of the fixed, namespaced cascade layers that order tokens, reset, base, components, style and utilities.
_Avoid_: level, tier

**Token**:
A named design decision expressed as a CSS custom property and reused across components.
_Avoid_: variable, constant

**Color role**:
A semantic token that describes intent rather than a literal color, such as background, primary, muted or destructive.
_Avoid_: palette entry, color name

**Color scheme**:
The light or dark rendering of the same tokens. It follows the OS preference by default; `.dark` or `.light` on any element forces it.
_Avoid_: theme, mode, appearance

**Behavior module**:
An optional, copy-paste ESM file that supplies interaction the CSS cannot
express, such as focus management, keyboard navigation or dismissal.
_Avoid_: script, runtime, plugin

**Entry module**:
A behavior module that self-initializes on import and registers delegated
handlers with `core.js`.
_Avoid_: controller, initializer

**Support module**:
A behavior module that exports helpers and never auto-initializes, such as
`core.js` and `listbox.js`.
_Avoid_: utility, helper library

**Behavior index**:
The generated `behaviors/index.js` that imports the installed entry modules so
the consumer loads one script per page.
_Avoid_: bundle, manifest, entrypoint

**Action hook**:
A public attribute that names an imperative action with no semantic carrier,
currently `data-open-dialog` and `data-close-dialog`.
_Avoid_: state attribute, behavior attribute

**Demo hook**:
A `data-demo-*` attribute used only by the docs site; the generator strips it
from installed examples.
_Avoid_: public hook, fixture hook

**Configuration attribute**:
A public data attribute that supplies behavior data or options rather than a
visual state: `data-duration`, `data-type` and `data-toast-limit` on toast and
`data-selection`, `data-min`, `data-max`, `data-unavailable`, `data-month` and
`data-date` on calendar.
_Avoid_: state attribute, data-state

**Toast manager**:
The `.toaster` element augmented by `behaviors/toast.js` with `addToast`,
`updateToast`, `closeToast` and `promiseToast`. It clones the authored toast
template instead of building markup in JavaScript.
_Avoid_: toast service, toaster library

**Toast template**:
The `template[data-slot="toast-template"]` inside a `.toaster` that supplies the
`li.toast` skeleton, plus the sibling `template[data-toast-icon="success|info|warning|error|loading"]`
elements that supply the status icons.
_Avoid_: toast factory, toast snippet

**Limited toast**:
A toast beyond the toaster's `data-toast-limit` (3 by default). It stays mounted
with `data-limited` and `inert`, hidden until newer toasts close.
_Avoid_: hidden toast, overflow toast

**Selection mode**:
The calendar `data-selection` value: `single`, `range` or `multiple`.
_Avoid_: selection state

**Unavailable date**:
A calendar date excluded from selection by `data-unavailable`, `data-min` or
`data-max`; it renders `aria-disabled="true"`.
_Avoid_: disabled date

**Following**:
The message-scroller state where the viewport is within the bottom threshold
and new messages are scrolled into view.
_Avoid_: auto-scroll state

**Registry dependency**:
A hard dependency that the CLI installs automatically because the item cannot work without it.
_Avoid_: peer dependency, required package

**Optional dependency**:
An item that composes well with another item but is never installed automatically.
_Avoid_: suggested dependency, nice-to-have

**Composition**:
Using items together in markup without requiring CSS coupling between them.
_Avoid_: inheritance, extension

**Conversation**:
A sequence of message rows, bubbles, markers, attachments and traces around a
chat or agent transcript.
_Avoid_: chat, thread, transcript

**Message**:
The row layout of one turn: avatar, header, content and footer.
_Avoid_: chat bubble, entry

**Bubble**:
The visible surface of a message, with variants, reactions and alignment.
_Avoid_: chat bubble, balloon

**Marker**:
An inline note, status or divider between conversation turns.
_Avoid_: separator, label, footnote

**Attachment**:
A file or media card inside a message, with busy and error states.
_Avoid_: file chip, upload, media item

**Trace**:
One expandable step in agent work, built on native `<details>`.
_Avoid_: timeline, log, tool call

**Questionnaire**:
A multi-step form of fieldset questions, native choices and progress.
_Avoid_: quiz, survey, wizard

## Public API

**Root class**:
The class on a component's outermost element that scopes all of its styles.
_Avoid_: wrapper class, component selector

**Part**:
An element inside a component that has a named role in the markup contract and can be styled independently.
_Avoid_: subcomponent, child class

**Slot**:
The public name that identifies a part, shared across components with the same anatomy.
_Avoid_: role, region

**Addon**:
A leading or trailing part inside an input group that is not itself a control.
_Avoid_: prefix, suffix, icon

**Listbox**:
A composite widget that presents options for selection, expressed with
`role="listbox"` and `role="option"`.
_Avoid_: dropdown, picker, menu

**Option**:
A selectable choice inside a listbox or menu.
_Avoid_: item, entry

**Series**:
A data series in a chart, identified by `data-series` and colored with a
`--chart-*` token.
_Avoid_: line, dataset, metric

**Variant**:
A named visual alternative of a component.
_Avoid_: type, kind, style, modifier

**Size**:
A named dimension preset of a component.
_Avoid_: scale, density

**State contract**:
The documented set of platform states and ARIA attributes through which a component's interaction and validation state is expressed.
_Avoid_: state API, props

**Highlighted**:
The transient highlight on the item a menu or listbox-like composite is about
to activate through keyboard or pointer.
_Avoid_: active, hovered, focused

**Copied**:
The transient confirmation state on a copy control, expressed with
`data-copied` and cleared by the behavior after the feedback interval.
_Avoid_: copied state, success class

**Pressed**:
The on state of a toggle button, expressed with `aria-pressed`.
_Avoid_: active, checked, selected, on

**Current**:
The active destination in a navigation hierarchy, expressed with
`aria-current`.
_Avoid_: active, selected, open

**Selected**:
A persistent choice in a selection widget.
_Avoid_: active, current

**Invalid**:
A control that has failed validation.
_Avoid_: error, data-invalid

**Disabled**:
A control that cannot be operated.
_Avoid_: inactive, data-disabled

## Maturity

**Stable**:
Covered by the public compatibility contract, documented and included when installing all stable components.
_Avoid_: production-ready, GA

**Experimental**:
Available for exploration and installable by name with `--experimental`, but
outside the v1 compatibility contract. Experimental items ship Nova only and
must not be used where stable guarantees are required.
_Avoid_: beta, preview, draft

## Documentation

**Design baseline**:
The durable contract for visual language, component API, accessibility and compatibility that the registry promises to keep stable.
_Avoid_: style guide, design system docs

**Example**:
A canonical HTML fragment shipped with an item and rendered in the docs.
_Avoid_: demo, snippet, sample

**Docs client**:
The browser-side module of the docs site that applies stored preferences and mounts per-page behavior across client-side navigation.
_Avoid_: docs runtime, docs shell

**Block**:
A docs-only page or section composition of multiple registry items, such as
Dashboard, Sidebar, Login or Signup. Blocks are browsable in the docs but are not
registry items and do not install application files.
_Avoid_: component, registry item, installable template

**Recipe**:
A docs-only composition of registry items that is not installable and has no
registry entry, such as Form, Data table or Date picker.
_Avoid_: block, template, example
