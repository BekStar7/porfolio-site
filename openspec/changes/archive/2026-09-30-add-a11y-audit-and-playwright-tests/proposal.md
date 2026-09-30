# Proposal

## Why

The site already has a deliberate accessibility baseline — a skip link, `aria-labelledby` on
every section, `sr-only` names for icon-only controls, `prefers-reduced-motion` and
`forced-colors` handling — but none of it is verified by anything. The repo has no test
runner at all, so every one of those decisions can be silently broken by an unrelated edit,
and the two remaining gaps below went unnoticed precisely because nothing checks them.

Codifying the accessibility contract as WCAG 2.2 AA requirements and enforcing it with an
automated Playwright + axe-core suite turns the current implicit, comment-documented intent
into a regression gate.

## What Changes

**Close the concrete gaps found in the current implementation:**

- `html` has no `scroll-padding-top`, while the header is `position: sticky` at
  `z-index: 50`. `.section` carries `scroll-margin-top`, so in-page anchors land correctly,
  but any other element the browser scrolls into view on keyboard focus can end up under
  the header — a WCAG 2.2 AA **2.4.11 Focus Not Obscured (Minimum)** failure.
- `a11y.backToTop` and `a11y.sectionsNav` exist in both `en.json` and `ru.json` but are
  referenced nowhere. The footer's back-to-top link is named only "Top" / "Наверх" next to
  an `aria-hidden` icon, which is thin out of context.
- Header section links use `aria-current="true"`. For "the section currently in view within
  this page", `aria-current="location"` is the semantically correct token; `true` is the
  generic fallback.
- The mobile menu closes on Escape and on link click, but not on outside click or route
  change, so it can stay expanded with `aria-expanded="true"` while attention has moved on.

**Add the missing verification layer:**

- Add Playwright (`@playwright/test`) and `@axe-core/playwright` as dev dependencies — the
  first test tooling in this repo.
- Automated axe-core WCAG 2.2 AA scans across both locales (`/`, `/en`), both themes, and
  both the desktop and mobile viewports.
- Keyboard and semantics tests that axe cannot detect: skip-link focus transfer, focus
  order, the burger menu's `aria-expanded` / Escape / focus-return cycle, the copy-email
  live region, and the accessible names of every icon-only control.
- `test:a11y` package script; the existing `check:contrast` script stays as-is and is not
  replaced.

Non-goals: no visual redesign, no palette changes, no general-purpose E2E coverage of
routing, SEO or JSON-LD, and no AAA-level conformance work.

No breaking changes — all markup changes are additive or swap one valid ARIA token for a
more precise one.

## Capabilities

### New Capabilities

- `accessibility`: The site's WCAG 2.2 AA conformance contract — landmark and heading
  structure, accessible names for controls, keyboard operability and focus management,
  state announcement, and respect for user motion/contrast/theme preferences.
- `accessibility-testing`: The automated accessibility regression gate — how the suite is
  run, what surfaces it must cover, and what it must assert beyond automated rule scanning.

### Modified Capabilities

None. `openspec/specs/` is currently empty, so there are no existing requirements to
change.

## Impact

**New dev dependencies:** `@playwright/test`, `@axe-core/playwright`. Playwright also
downloads browser binaries on install, which adds a post-install step and CI cache
consideration.

**New files:** `playwright.config.ts`, a `tests/a11y/` directory, and shared test helpers.

**Modified files:**

- `app/assets/css/main.css` — add `scroll-padding-top`.
- `app/components/AppFooter.vue` — apply `a11y.backToTop`.
- `app/components/AppHeader.vue` — `aria-current` token, `a11y.sectionsNav`, menu dismissal.
- `package.json` — `test:a11y` script and the new dev dependencies.
- `.gitignore` — Playwright report and artifact output.

**Unaffected:** `app/data/profile.ts`, `shared/types/profile.ts`, the i18n message files
(the needed keys already exist in both locales), `nuxt.config.ts`, and SEO/JSON-LD output.

**Process:** the suite needs a built or dev-served site to run against, so it becomes a
real gate on the build pipeline rather than a pure unit-test step.
