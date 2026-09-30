# Design

## Context

See `proposal.md` — Why. The constraints that actually shape the approach:

- **No test tooling exists.** `package.json` has no runner, no CI config, no `tests/`
  directory. Every convention here is being set for the first time, so it should be the one
  a later general E2E suite can also live under.
- **Theme is applied pre-paint by an inline script**, not by Vue. `nuxt.config.ts` injects a
  synchronous head script that reads `localStorage['portfolio-theme']` (falling back to
  `prefers-color-scheme`) and sets `document.documentElement.dataset.theme`. `useTheme()`
  only reads that attribute back. Tests therefore cannot set the theme by mutating component
  state; they must influence it before the first paint or drive the toggle.
- **Locale is redirect-sensitive.** `detectBrowserLanguage` is enabled with cookie
  `i18n_redirected` and `redirectOn: 'root'`. A browser advertising `en` that lands on `/`
  can be redirected to `/en`. A test that navigates to `/` and asserts `lang="ru"` is flaky
  unless the browser locale and that cookie are pinned.
- **axe cannot compute the contrast of the translucent layers.** This is exactly why
  `scripts/check-contrast.mjs` exists: it parses the palette tokens out of `main.css` and
  composites semi-transparent layers (the hero glow, `--accent-veil` card backings) against
  the base background. axe returns these as *incomplete*, not *pass* or *violation*.
- **The site prerenders to static output.** `nitro.prerender.routes` covers `/` and `/en`,
  and `dist` symlinks to `.output/public`. The shipped artifact is static HTML, so it can be
  tested exactly as it will be served.
- **Two breakpoints matter.** The header collapses at `max-width: 62rem` (992px). Below it
  the burger appears, `.header__nav` becomes `display: none` until opened, and
  `.header__name` becomes visually hidden. Above it the burger is `display: none` and the
  menu logic is unreachable. No single viewport exercises both paths.

## Goals / Non-Goals

**Goals:**

- One command, zero manual setup, deterministic result.
- A layered suite where each layer catches what the layer below cannot: rule scanning →
  structure assertions → keyboard/focus behavior.
- A surface matrix expressed as data, so adding a locale or a page is a one-line change
  rather than a new copy of a test file.
- Helpers that make the non-obvious setup (theme, locale pinning) a single call, so
  individual tests stay readable.

**Non-Goals:**

- No CI pipeline definition. The command must be CI-ready; wiring it into a provider is a
  separate change (there is no CI config in the repo to extend).
- No screenshot or visual-regression baselines. They would fail on font rendering
  differences across machines and add review burden without catching a11y defects.
- No replacement of `check:contrast`. It stays authoritative for translucent layers.
- No real screen-reader automation (NVDA/VoiceOver). Not scriptable cross-platform; the
  suite asserts the accessibility tree instead.
- No component-level unit tests. There is no component-test harness, and the requirements
  here are about rendered-page behavior.

## Decisions

### Run against the production preview, not the dev server

`playwright.config.ts` uses a `webServer` that builds and previews the site
(`nuxt build && nuxt preview`, or `generate` + a static server), with
`reuseExistingServer: !process.env.CI`.

*Why:* the dev server injects HMR client code, dev-only overlays and the Nuxt devtools
(`devtools: { enabled: true }`), none of which ship. Scanning it risks both false positives
from devtools markup and false negatives where a dev-only style masks a production problem.
Preview serves the same prerendered output users get.

*Alternative rejected:* running against `nuxt dev` for speed. It trades the accuracy that is
the entire point of the gate for a build step contributors pay once per run.

*Trade-off:* each run pays a full build. `reuseExistingServer` locally means an already
running preview is reused, so the iteration loop is not build-bound.

*The preview runs on its own port (3100), not the development port.* Reuse keyed on port 3000
would happily adopt a running `nuxt dev` — which injects the Vite client and the devtools
frame, and whose markup fails the scan on `color-contrast` inside `nuxt-devtools-frame`. That
is the exact false positive this decision exists to avoid, so reuse must not be able to pick
up a dev server. A separate port makes the two coexist: the suite always tests built output,
and a dev server on 3000 is left alone rather than conflicting.

### Pin locale and theme through browser context, not UI interaction

Two helpers wrap the setup:

- **Locale:** set the context's `locale` and pre-seed the `i18n_redirected` cookie to the
  locale under test, then navigate directly to that locale's path. This defeats
  `redirectOn: 'root'` rather than racing it.
- **Theme:** `page.addInitScript` writes `localStorage['portfolio-theme']` before any
  document script runs, so the existing pre-paint head script picks it up and applies the
  theme on the first paint.

*Why:* both mirror how the mechanism actually works. Seeding `localStorage` is the only way
to get a deterministic theme on first paint, because the head script — not Vue — is the
source of truth.

*Alternative rejected:* clicking the theme toggle after load. It works, but it means every
themed scan starts from an unknown theme, adds a transition to wait out, and asserts against
a post-hydration state rather than the delivered one. Reserved for the one test that
specifically covers toggle behavior and persistence.

*Alternative rejected:* Playwright's `colorScheme` emulation alone. It only drives
`prefers-color-scheme`, which the head script consults *only* when no stored preference
exists — so it cannot pin a theme against a stored one. It is still used for the test
asserting the no-stored-preference path.

### Treat axe `incomplete` results as review material, not failures

The scan fails on `violations`. `incomplete` results are attached to the test report but do
not fail the run, **except** that the suite asserts the set of incomplete `color-contrast`
nodes has not grown beyond a recorded baseline.

*Why:* axe genuinely cannot resolve contrast over the translucent hero glow and accent
veils — that limitation is documented in `check-contrast.mjs` and is why that script exists.
Failing on `incomplete` would make the suite red for a known-good palette. Ignoring it
entirely would let a new unresolvable-contrast surface appear unnoticed. Baselining the count
keeps `check:contrast` authoritative while still flagging new blind spots for a human.

*Alternative rejected:* disabling the `color-contrast` rule. That would also drop contrast
checking on the majority of text where axe computes it correctly.

*The baseline is keyed on component class, not on axe's node targets.* Measured against the
built site, axe cannot resolve 47 nodes on desktop and 39 on mobile — the `--glow` radial
gradient, `backdrop-filter: blur(14px)` on the sticky header, and the `--accent-veil` card
backings put most body text over a layer it will not composite. That is far more than a
per-node list can carry, and axe's targets are unusable as keys anyway: they embed scoped
style hashes (`data-v-…`), `:nth-child` positions, and content values such as dates and the
contact address, so any content edit or style recompile would churn the baseline.

Each node is therefore mapped to its nearest ancestor carrying a BEM component class, and the
baseline is that set — roughly 25 entries, grouped with a reason. It stays stable when content
grows, because a new job role reuses `.role__title` rather than adding a new selector, and it
still fails when a genuinely new surface becomes unresolvable.

*Why not a count:* adding a project or a role changes the number of nodes without changing
which components are unresolvable, so a count fails spuriously on ordinary content edits.

### Express the surface matrix as data

A single exported matrix — locales × themes × viewports — drives generated tests, rather
than a file per combination. Viewports are two named entries (desktop, mobile) whose widths
sit deliberately either side of the 62rem header breakpoint, with the breakpoint referenced
by name so the relationship is explicit.

*Why:* the spec's coverage requirements are combinatorial. Encoding them once means the
suite cannot drift out of sync with the spec by someone adding a locale and forgetting a
file.

### Separate rule scanning from behavioral testing

Two directories: axe scans over the matrix, and behavioral specs for keyboard, focus and
announcement.

*Why:* they fail for different reasons and are debugged differently. A scan failure names a
rule and a selector; a behavioral failure names an interaction. Mixing them makes it unclear
whether a red run means "markup regressed" or "interaction regressed". The split also keeps
the expensive combinatorial scans separate from the behavioral tests, which only need one
viewport each (except the mobile menu).

### Assert accessible names through the accessibility tree, not the DOM

Name assertions use role-and-name queries and `aria-snapshot`, not selectors plus
`textContent`.

*Why:* several components deliberately depend on the computed name rather than visible text:
`.header__name` is visually hidden below 62rem but must stay in the name of the brand link;
`ThemeToggle` relies on `display: none` removing one of two `sr-only` spans from the tree.
Reading `textContent` would pass on markup that is broken for a screen reader, which is the
failure mode most worth catching here.

### Fix focus obscuring with `scroll-padding-top` on the scroll container

`html` gets `scroll-padding-top` matching the sticky header's height. `.section` keeps its
existing `scroll-margin-top` for in-page anchors.

*Why:* `scroll-padding-top` applies to *every* scroll-into-view the browser performs on that
container, including the implicit one when focus moves to an offscreen element — which is
the 2.4.11 case. `scroll-margin-top` only helps elements that declare it, and only
`.section` does.

*Alternative rejected:* adding `scroll-margin-top` to every focusable element. It has the
same effect but must be maintained on every new component, and is the kind of rule that
silently stops being applied.

*The test asserts geometry, not the property:* it compares the focused element's bounding box
against the header's, so the requirement stays satisfied regardless of how the CSS achieves
it.

### `aria-current="location"` for in-page sections

Header section links switch from `aria-current="true"` to `aria-current="location"`;
`LocaleSwitcher` keeps `true`.

*Why:* `location` is defined for "the current location within an environment or context" —
the closest match for a scroll-tracked section in the current document. `page` would be wrong
because the link does not navigate. The locale switcher does change document, but it is not
the "current page" in a set of pages either, so the generic `true` remains correct there.

*Note:* `useActiveSection` intentionally leaves `active` null until after mount, so the
marking appears only post-hydration. Tests must wait for it rather than assert on the
delivered HTML — and a separate test confirms the delivered and hydrated markup agree, which
is the point of that design.

### Close the mobile menu on outside interaction and route change

Add a pointerdown listener on the document that closes the menu when the event target is
outside both the nav and the burger, plus a watcher on the route. Escape handling and
focus-return stay as they are.

*Why:* the menu is a non-modal disclosure, so a focus trap would be wrong — but leaving it
open with `aria-expanded="true"` after attention has moved elsewhere misreports state.
Listening on `pointerdown` rather than `click` means the menu closes before a click inside
the newly revealed content lands.

*Deliberately not added:* a focus trap, or moving focus into the menu on open. Non-modal
disclosures should leave focus where the user put it; the next Tab naturally enters the
revealed menu because it follows the burger in DOM order.

### Name the back-to-top link with the existing key

`AppFooter` gets `:aria-label="t('a11y.backToTop')"` on the link, keeping the visible "Top"
text. `a11y.sectionsNav` names the header's section list.

*Why:* both keys already exist in `en.json` and `ru.json` with appropriate wording — this is
wiring up translations that were written and never referenced, not new copy. Using
`aria-label` overrides the terse visible text without changing the visual design.

*Constraint to respect:* the `aria-label` must contain the visible text so that speech
input users saying "Top" still match the control (WCAG 2.5.3 Label in Name). The existing
`backToTop` strings satisfy this; the tests assert it rather than assuming it.

## Risks / Trade-offs

**Playwright's browser download makes install heavier and CI-cache-dependent** → Install
only Chromium by default. One engine is enough for the assertions here: these are ARIA-tree
and geometry checks, not rendering-engine differences. Document adding engines if
cross-browser coverage is later wanted.

**A full build per run discourages contributors from running the suite** → `reuseExistingServer`
locally, so a running preview is reused; scope the behavioral specs to a single viewport
where the requirement does not concern responsive behavior.

**The incomplete-contrast baseline becomes a dumping ground** → Keep it as an explicit list
of node targets with a comment naming why each is unresolvable, not a bare count. A new entry
requires a deliberate edit and shows up in review.

**axe passing gets mistaken for "accessible"** → axe detects a minority of WCAG failures.
The behavioral layer exists precisely because of this, and the README note should say the
suite is a regression gate, not a conformance claim.

**Scroll-driven assertions are inherently timing-sensitive** → Assert on settled state after
waiting for an observable condition (the `aria-current` marking appearing, the scroll
position stabilizing), never on a fixed delay. `prefers-reduced-motion` is emulated in tests
that assert geometry, so smooth scrolling cannot race the assertion.

**`scroll-padding-top` could push in-page anchor targets too far down**, since `.section`
already has `scroll-margin-top` and the two compose → Verify anchor landing positions
visually once during implementation, and keep the assertion on "not obscured" rather than an
exact offset so the spec does not over-constrain the layout.

**Pinning the locale cookie could mask a real redirect bug** → The locale-pinning helper is
for tests whose subject is not redirection. Leave `detectBrowserLanguage` behavior itself out
of scope here (it is SEO/routing, not a11y) rather than half-testing it.

## Migration Plan

Additive throughout — no existing behavior is removed, so there is nothing to migrate and no
data change. Ordering that matters:

1. Land the tooling and the suite against current `main` first. The scans and behavioral
   tests should pass on the existing code apart from the four known gaps, which confirms the
   suite is measuring the real site and not a fixture.
2. Land the four fixes, converting the corresponding tests from failing to passing.

Doing it in this order means each fix is demonstrated by a test that was red before it. If
the suite is added after the fixes, a test that never failed proves nothing.

**Rollback:** remove `playwright.config.ts`, the `tests/` directory, the `test:a11y` script
and the two dev dependencies. The four source fixes are independently valuable and stand on
their own; `.gitignore` additions are inert.

## Open Questions

- Whether to add engines beyond Chromium. Deferrable: it is a config-only change that adds
  no test code and does not affect the specs or the task breakdown.
- Whether `test:a11y` should eventually also invoke `check:contrast` as one `test` script.
  Deferrable: both commands exist and pass independently either way; composing them is
  cosmetic.
