# Tasks

Ordering follows `design.md` — Migration Plan: the suite lands first against current code, so
each of the four fixes in group 6 is demonstrated by a test that was red beforehand.

## 1. Test tooling setup

- [x] 1.1 Add `@playwright/test` and `@axe-core/playwright` as devDependencies and verify `pnpm install` succeeds and `pnpm exec playwright --version` prints a version
- [x] 1.2 Install the Chromium browser binary only (per design: one engine) and verify `pnpm exec playwright install --dry-run chromium` reports it present
- [x] 1.3 Add `test:a11y` to `package.json` scripts and verify `pnpm test:a11y -- --list` enumerates tests without running them
- [x] 1.4 Add Playwright output paths (`test-results`, `playwright-report`, `.playwright`) to `.gitignore` and verify `git status --porcelain` is empty after a run that produces a report
- [x] 1.5 Write `playwright.config.ts` with a `webServer` that builds and previews the site, `reuseExistingServer: !process.env.CI`, and Chromium-only projects; verify `pnpm test:a11y` starts the server unaided from a state with nothing running

## 2. Shared test helpers

- [x] 2.1 Create the surface matrix module exporting locales (`ru` at `/`, `en` at `/en`), themes, and desktop/mobile viewports with widths either side of the 62rem header breakpoint, naming the breakpoint explicitly; verify a temporary test enumerates all expected combinations
- [x] 2.2 Write the locale-pinning helper that sets the context `locale` and pre-seeds the `i18n_redirected` cookie, then navigates to the locale path; verify it lands on `/` with `lang="ru"` and on `/en` with `lang="en"` across 10 consecutive runs with no redirect flake
- [x] 2.3 Write the theme helper using `addInitScript` to seed `localStorage['portfolio-theme']` before document scripts run; verify `documentElement.dataset.theme` equals the requested theme on first paint with no intermediate value observed
- [x] 2.4 Write the axe-scan helper that runs WCAG 2.2 A + AA rules over the whole document, fails on `violations`, and reports rule id, impact and element selectors plus the locale/theme/viewport under test; verify a deliberately broken fixture page produces a failure naming the rule and selector

## 3. Automated rule scanning

- [x] 3.1 Generate axe scans across the full locale × theme × viewport matrix and verify the run reports one test per combination, all passing against current code
- [x] 3.2 Add the mobile scan variant with the navigation menu expanded and verify the scan runs only below the 62rem breakpoint and that the menu is confirmed expanded before scanning
- [x] 3.3 Record the `color-contrast` incomplete baseline as an explicit list of node targets, each with a comment naming why axe cannot resolve it (translucent hero glow, `--accent-veil` backings); verify the suite fails when an unlisted incomplete contrast node appears and passes on the recorded set
- [x] 3.4 Confirm `pnpm check:contrast` still passes unchanged and document in the suite's README note that it remains authoritative for translucent layers

## 4. Structure and naming tests

- [x] 4.1 Test landmark structure — exactly one banner, main and contentinfo, and uniquely named navigation landmarks — and verify it passes for both locales
- [x] 4.2 Test heading structure — exactly one level-one heading and no skipped levels in document order — and verify it passes for both locales
- [x] 4.3 Test that every interactive control has a non-empty accessible name using role-and-name queries rather than `textContent`, covering icon-only controls; verify it passes at both viewports
- [x] 4.4 Test that the brand link retains its accessible name below 62rem where `.header__name` is visually hidden, and verify the test fails if that rule is changed to `display: none`
- [x] 4.5 Test that `ThemeToggle` exposes exactly one action name matching the active theme, never both, and verify it passes in each theme
- [x] 4.6 Test that external links announce opening in a new tab and declare opener-withholding `rel` values, and verify it passes for the profile's external links
- [x] 4.7 Test that decorative graphics and the language proficiency meter are absent from the accessibility tree, and verify icons are neither exposed nor focusable
- [x] 4.8 Test standalone control target sizes are at least 24×24 CSS pixels without overlapping, and verify it passes for header links, the burger, locale switcher links and buttons

## 5. Keyboard and behavioral tests

- [x] 5.1 Test the skip link is first in the tab order, becomes visible on focus, and moves focus into the main landmark on activation so the next Tab continues past the header; verify all three assertions pass against current code
- [x] 5.2 Test forward keyboard traversal reaches every interactive control in visual reading order without trapping, and that no element declares a positive tab index; verify it passes at both viewports
- [x] 5.3 Test that a keyboard-focused element shows a visible focus indicator in both themes, and verify the test fails if the `:focus-visible` outline rule is removed
- [x] 5.4 Test the mobile menu disclosure cycle — `aria-expanded` before and after activation, `aria-controls` targeting the nav, Escape collapsing and returning focus to the trigger, and link activation collapsing it — and verify it passes against current code at mobile width
- [x] 5.5 Test that collapsed menu links are absent from both the tab order and the accessibility tree below 62rem, and that the burger is absent above it
- [x] 5.6 Test the copy-email flow announces confirmation through the polite live region while focus stays on the button, and that the region exists and is empty on load; verify it passes against current code
- [x] 5.7 Test that at most one in-page navigation link is marked as the current location and that it corresponds to the section in the reading area, waiting for the post-hydration marking rather than asserting on delivered HTML
- [x] 5.8 Test that the delivered markup and the hydrated result carry no differing current-location marking, and verify the test would catch a hydration mismatch
- [x] 5.9 Test that reduced-motion preference suppresses transitions and makes in-page scrolling instant, and that forced-colors mode preserves component boundaries and focus indication
- [x] 5.10 Test that the operating system color-scheme preference selects the theme when no stored preference exists (using `colorScheme` emulation, not a seeded value), and that an explicit stored choice overrides it across a reload
- [x] 5.11 Test that a theme or locale preference set by one test is not visible to another, and verify the suite produces identical results across two consecutive runs and under a different `--workers` count (Playwright 1.63 has no `--shuffle` flag; varying worker count is the available lever on execution/interleaving order)

## 6. Close the accessibility gaps

Each task converts a test written above from failing to passing.

- [x] 6.1 Add `scroll-padding-top` matching the header height to the scroll container in `app/assets/css/main.css`, keeping `.section`'s existing `scroll-margin-top`
- [x] 6.2 Write the focus-not-obscured test — scroll the page, move focus by keyboard to an element the browser must scroll into view, assert the focused element's bounding box does not intersect the header's — and verify it fails without 6.1 and passes with it
- [x] 6.3 Verify in-page anchor landing positions are not pushed too far down now that `scroll-padding-top` and `scroll-margin-top` compose, by following each header section link and confirming each section heading is visible and clear of the header
- [x] 6.4 Apply `a11y.backToTop` as the `aria-label` on the footer's back-to-top link in `AppFooter.vue`, keeping the visible text; verify the accessible name test now finds a name identifying both action and target
- [x] 6.5 Test that the back-to-top link's accessible name contains its visible text (WCAG 2.5.3 Label in Name) in both locales, and verify it passes with the existing `backToTop` strings
- [x] 6.6 Apply `a11y.sectionsNav` to name the header's section navigation in `AppHeader.vue`; verify the uniquely-named-navigation-landmarks test from 4.1 still passes and no two navigation landmarks share a name
- [x] 6.7 Change header section links from `aria-current="true"` to `aria-current="location"` in `AppHeader.vue`, leaving `LocaleSwitcher` on `true`; verify the 5.7 test asserts `location` and passes, and that the locale switcher's marking is unchanged
- [x] 6.8 Add document `pointerdown` dismissal (target outside both nav and burger) and route-change dismissal to `AppHeader.vue`, leaving Escape handling and focus-return intact and adding no focus trap; verify the menu collapses and reports `aria-expanded="false"` in both cases
- [x] 6.9 Write the outside-interaction and route-change dismissal tests and verify each fails without 6.8 and passes with it, and that focus is not moved into the menu on open

## 7. Integration verification

- [x] 7.1 Run `pnpm test:a11y` from a clean checkout after `pnpm install` only, and verify every check passes with no manual setup and exit status zero
- [x] 7.2 Verify a deliberately introduced violation (remove a `sr-only` label from one icon-only control) makes the run exit non-zero with a message naming the rule, the element and the locale/theme/viewport, then revert it
- [x] 7.3 Verify `git status --porcelain` reports no changes after both a passing and a failing run
- [x] 7.4 Run `pnpm typecheck` and `pnpm check:contrast` and verify both pass with the test files and source changes in place
- [x] 7.5 Document the suite in `README.md` — the command, what it covers, how to add a surface to the matrix, and a note that it is a regression gate rather than a conformance claim — and verify the documented commands run as written
