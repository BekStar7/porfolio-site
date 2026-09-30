# Spec Delta

## Purpose

Defines the automated accessibility regression gate for the site: how contributors run it,
which surfaces it must cover, what it must assert beyond automated rule scanning, and how it
reports failures so a regression is actionable rather than merely red.

## ADDED Requirements

### Requirement: Accessibility checks run from a single command

The project SHALL expose one documented command that runs the entire accessibility suite.
The command SHALL require no manual setup beyond dependency installation, and SHALL start
and stop whatever server the suite needs on its own.

#### Scenario: Suite runs from a clean checkout

- **WHEN** a contributor installs dependencies and runs the accessibility command
- **THEN** the suite starts the site, runs every check, and reports a result without further
  manual steps

#### Scenario: No pre-started server is required

- **WHEN** the accessibility command is run with no server already running
- **THEN** the suite starts one itself and shuts it down when finished

#### Scenario: A previously started preview server is reused

- **WHEN** a preview server started by an earlier run is still serving the built site on the
  suite's own port
- **THEN** the suite reuses it rather than rebuilding or failing on a port conflict

#### Scenario: A development server does not interfere

- **WHEN** a development server is already serving the site on the usual development port
- **THEN** the suite neither reuses nor conflicts with it, and scans the built output instead
- **AND** no development-only markup, such as an injected devtools frame, is present in the
  scanned page

#### Scenario: Exit status reflects the result

- **WHEN** every check passes
- **THEN** the command exits zero
- **AND** when any check fails, the command exits non-zero

#### Scenario: Existing contrast check is retained

- **WHEN** the accessibility suite is added
- **THEN** the pre-existing standalone contrast-check command remains available and functional

### Requirement: Automated rule scanning covers every surface combination

The suite SHALL scan each page against WCAG 2.2 Level A and AA rules, across every supported
combination of locale, theme, and viewport. A scan SHALL fail on any violation of those
rules.

#### Scenario: Both locales are scanned

- **WHEN** the suite runs
- **THEN** both the default-locale page and the English page are scanned

#### Scenario: Both themes are scanned

- **WHEN** the suite runs
- **THEN** each page is scanned once with the light theme applied and once with the dark theme
  applied

#### Scenario: Both viewports are scanned

- **WHEN** the suite runs
- **THEN** each page is scanned at a desktop width and at a width below the header's collapse
  breakpoint

#### Scenario: Expanded mobile menu is scanned

- **WHEN** the suite runs at mobile width
- **THEN** the page is scanned with the navigation menu collapsed and again with it expanded

#### Scenario: Scan scope is the whole page

- **WHEN** a page is scanned
- **THEN** the entire document is in scope, with no element or rule excluded

#### Scenario: Any violation fails the run

- **WHEN** a scan reports one or more violations of a Level A or AA rule
- **THEN** the run fails

### Requirement: Failures identify the offending element and rule

When a check fails, the suite SHALL report enough detail to locate and fix the cause without
re-running the scan manually.

#### Scenario: Violation report is actionable

- **WHEN** an automated scan reports a violation
- **THEN** the failure message names the violated rule, its impact, and a selector for each
  offending element

#### Scenario: Surface under test is identifiable

- **WHEN** a check fails
- **THEN** the failure identifies which locale, theme, and viewport combination produced it

### Requirement: Behavioral checks cover what rule scanning cannot

Automated rule scanning cannot observe keyboard interaction, focus movement, or announcement
over time. The suite SHALL therefore include behavioral checks driving the page as a keyboard
user would, asserting the outcomes required by the accessibility capability.

#### Scenario: Skip link is verified end to end

- **WHEN** the behavioral checks run
- **THEN** they assert that the skip link is first in the tab order, becomes visible on focus,
  and moves focus into the main landmark when activated

#### Scenario: Focus order is verified

- **WHEN** the behavioral checks run
- **THEN** they traverse the page by keyboard and assert that focus reaches every interactive
  control in visual reading order without becoming trapped

#### Scenario: Focus visibility is verified

- **WHEN** the behavioral checks run
- **THEN** they assert that a keyboard-focused element presents a visible focus indicator

#### Scenario: Focus is verified to clear the sticky header

- **WHEN** the behavioral checks run
- **THEN** they scroll the page, move focus by keyboard to an element the browser must scroll
  into view, and assert the focused element's bounding box does not intersect the header's

#### Scenario: Menu disclosure cycle is verified

- **WHEN** the behavioral checks run at mobile width
- **THEN** they assert the trigger's expanded state before and after activation, that Escape
  collapses the menu and returns focus to the trigger, and that activating a link or
  interacting outside the menu collapses it

#### Scenario: Live region announcement is verified

- **WHEN** the behavioral checks run
- **THEN** they activate the copy control and assert that the polite live region receives the
  confirmation text while focus stays on the control

#### Scenario: Accessible names are verified by role

- **WHEN** the behavioral checks run
- **THEN** they enumerate the page's interactive controls and assert each has a non-empty
  accessible name, including controls whose only visible content is an icon

#### Scenario: Landmark and heading structure are verified

- **WHEN** the behavioral checks run
- **THEN** they assert exactly one banner, main, contentinfo and level-one heading per page,
  uniquely named navigation landmarks, and no skipped heading levels

#### Scenario: Current-location marking is verified

- **WHEN** the behavioral checks run
- **THEN** they scroll through the page and assert that at most one in-page navigation link is
  marked as the current location, and that it corresponds to the section in the reading area

### Requirement: Checks are deterministic

The suite SHALL produce the same result for unchanged input. A check SHALL wait for an
observable condition rather than a fixed delay, and SHALL NOT depend on state left behind by
another check.

#### Scenario: Repeated runs agree

- **WHEN** the suite is run twice against an unchanged site
- **THEN** both runs produce the same result

#### Scenario: Checks are order-independent

- **WHEN** checks execute in a different order or in parallel
- **THEN** each produces the same result as it would in isolation

#### Scenario: Persisted preferences do not leak between checks

- **WHEN** a check sets a theme preference or dismisses a locale redirect
- **THEN** that state is not visible to any other check

#### Scenario: Animation does not affect assertions

- **WHEN** a check asserts the position or visibility of an element that animates
- **THEN** it waits for the animation to settle rather than sampling at a fixed time

### Requirement: Test output does not pollute the repository

Artifacts produced by a run SHALL be written to ignored paths and SHALL NOT appear as
uncommitted changes.

#### Scenario: Run leaves the working tree clean

- **WHEN** the suite has run to completion, whether passing or failing
- **THEN** no new tracked or untracked files are reported as changes in the working tree
