# Spec Delta

## Purpose

Defines the site's accessibility contract at WCAG 2.2 Level AA: the landmark and heading
structure, accessible names, keyboard operability, focus management, state announcement,
and user-preference handling that every page must uphold in both locales and both themes.

## ADDED Requirements

### Requirement: Conformance to WCAG 2.2 Level AA

Every rendered page SHALL satisfy WCAG 2.2 Level AA. No automatically detectable violation
of a Level A or AA success criterion may be present in any supported combination of locale
(`ru`, `en`), theme (light, dark), and viewport (desktop, m obile).

#### Scenario: No detectable violations on the default locale

- **WHEN** the page at `/` is examined against WCAG 2.2 A and AA rules
- **THEN** zero violations are reported

#### Scenario: No detectable violations on the English locale

- **WHEN** the page at `/en` is examined against WCAG 2.2 A and AA rules
- **THEN** zero violations are reported

#### Scenario: Conformance holds in both themes

- **WHEN** a page is examined with the light theme active, and again with the dark theme active
- **THEN** zero violations are reported in either theme

#### Scenario: Conformance holds at mobile width

- **WHEN** a page is examined at a viewport narrower than the 62rem header breakpoint, with the
  navigation menu both collapsed and expanded
- **THEN** zero violations are reported in either menu state

### Requirement: Document language is declared and correct

Each page SHALL declare its primary language on the root element, and content written in a
language other than the page's primary language SHALL declare its own language.

#### Scenario: Root language matches the active locale

- **WHEN** the page at `/` is served
- **THEN** the root element's `lang` declares Russian (a well-formed language tag whose
  primary subtag is `ru`)
- **AND** when the page at `/en` is served, the root element's `lang` declares English in the
  same way

#### Scenario: Text direction is declared

- **WHEN** any page is served
- **THEN** the root element declares a text direction of `ltr`

#### Scenario: Language names are marked with their own language

- **WHEN** the language switcher exposes the name of a selectable language
- **THEN** that name carries a `lang` matching the language it names, so speech synthesis
  pronounces it correctly

### Requirement: Landmark structure

Each page SHALL expose exactly one banner, one main, and one contentinfo landmark. Every
navigation landmark SHALL have an accessible name that distinguishes it from other
navigation landmarks on the page.

#### Scenario: Unique top-level landmarks

- **WHEN** the accessibility tree of any page is inspected
- **THEN** exactly one banner, exactly one main, and exactly one contentinfo landmark are present

#### Scenario: Navigation landmarks are individually named

- **WHEN** a page exposes more than one navigation landmark
- **THEN** each has a non-empty accessible name
- **AND** no two navigation landmarks on the page share the same name

#### Scenario: All content sits within a landmark

- **WHEN** the page's perceivable content is inspected
- **THEN** no perceivable content falls outside a landmark region

### Requirement: Heading structure

Headings SHALL form a single logical outline. Each page SHALL have exactly one level-one
heading, and heading levels SHALL NOT skip a level when descending.

#### Scenario: One level-one heading per page

- **WHEN** any page is rendered
- **THEN** exactly one level-one heading is present

#### Scenario: No skipped heading levels

- **WHEN** headings are read in document order
- **THEN** each heading's level is at most one greater than the preceding heading's level

#### Scenario: Every section is named by its heading

- **WHEN** a content section is inspected
- **THEN** its accessible name is derived from its own visible heading

### Requirement: Accessible names for all controls

Every interactive control SHALL have a non-empty accessible name. Controls conveyed only by
an icon SHALL carry a textual name available to assistive technology, and the icon itself
SHALL be excluded from the accessibility tree.

#### Scenario: Icon-only control is named

- **WHEN** a control's visible content is an icon alone
- **THEN** the control has a non-empty accessible name describing the action it performs
- **AND** the icon graphic is excluded from the accessibility tree and is not focusable

#### Scenario: Theme toggle names the action it performs

- **WHEN** the dark theme is active
- **THEN** the theme toggle's accessible name describes switching to the light theme
- **AND** when the light theme is active, it describes switching to the dark theme
- **AND** in each case exactly one such name is exposed, never both

#### Scenario: Back-to-top link is unambiguous out of context

- **WHEN** the footer's back-to-top link is inspected
- **THEN** its accessible name identifies both the action and its target, rather than a bare
  directional word

#### Scenario: Links to the same destination agree

- **WHEN** two controls point at the same destination
- **THEN** their accessible names do not conflict

#### Scenario: Visually hidden names survive responsive hiding

- **WHEN** a control's visible label is hidden at a given viewport width for layout reasons
- **THEN** the control retains a non-empty accessible name at that width

### Requirement: Links that open a new context are announced

A link that opens its destination in a new browsing context SHALL announce that fact to
assistive technology, and SHALL not expose the opener to the new context.

#### Scenario: External link announces new tab

- **WHEN** a link targets an external destination in a new tab
- **THEN** its accessible name includes an indication that it opens in a new tab

#### Scenario: External link is opened safely

- **WHEN** a link opens in a new browsing context
- **THEN** it declares `rel` values that withhold the opener reference

### Requirement: Keyboard operability

All functionality SHALL be operable through a keyboard alone. Focus SHALL NOT become
trapped, and the tab order SHALL follow the visual reading order.

#### Scenario: Every control is reachable

- **WHEN** the user traverses the page forward with the Tab key from the document start
- **THEN** every interactive control is reached in turn
- **AND** focus is never trapped in any subset of controls

#### Scenario: Tab order follows reading order

- **WHEN** controls are visited in tab order
- **THEN** that order matches the visual reading order of the page

#### Scenario: No positive tab indices

- **WHEN** the page's focusable elements are inspected
- **THEN** none declares a tab index greater than zero

#### Scenario: Hidden controls leave the tab order

- **WHEN** a control is not visible at the current viewport or in the current state
- **THEN** it is absent from both the tab order and the accessibility tree

### Requirement: Skip link bypasses repeated navigation

The first focusable element of each page SHALL be a link that moves both focus and the
viewport to the main content, allowing keyboard users to bypass the header.

#### Scenario: Skip link is first in the tab order

- **WHEN** the user presses Tab once from the start of the document
- **THEN** the skip-to-content link receives focus

#### Scenario: Skip link becomes visible on focus

- **WHEN** the skip link receives focus
- **THEN** it is rendered visibly within the viewport

#### Scenario: Activating the skip link moves focus

- **WHEN** the user activates the skip link
- **THEN** keyboard focus moves into the main landmark, so that the next Tab continues from
  the main content rather than returning to the header

### Requirement: Focus is always visible and unobscured

A visible focus indicator SHALL be shown for any element focused via keyboard, and no part
of a keyboard-focused element may be hidden by author-created content such as the sticky
header.

#### Scenario: Keyboard focus is indicated

- **WHEN** an element receives focus from the keyboard
- **THEN** a focus indicator is visible against the element's background in both themes

#### Scenario: Focus indicator is not suppressed without replacement

- **WHEN** a component removes the default focus outline
- **THEN** it provides an alternative visible focus indication for keyboard users

#### Scenario: Sticky header never covers the focused element

- **WHEN** the page is scrolled and the keyboard moves focus to an element that the browser
  must scroll into view
- **THEN** the focused element comes to rest fully below the sticky header, with no part of it
  covered

#### Scenario: In-page anchor targets clear the header

- **WHEN** the user follows an in-page link to a section
- **THEN** that section's heading is positioned clear of the sticky header

#### Scenario: Focus indication survives forced-colors mode

- **WHEN** the operating system's forced-colors mode is active
- **THEN** focused elements show a focus indicator using a system highlight color

### Requirement: Disclosure state is exposed and dismissible

A control that expands and collapses content SHALL expose its current state and the
relationship to the content it controls. The expanded content SHALL be dismissible from the
keyboard without moving focus away from it.

#### Scenario: Collapsed state is exposed

- **WHEN** the navigation menu is collapsed
- **THEN** its trigger reports itself as not expanded and references the region it controls

#### Scenario: Expanded state is exposed

- **WHEN** the user activates the trigger
- **THEN** the trigger reports itself as expanded
- **AND** the menu's links become reachable by keyboard

#### Scenario: Escape collapses the menu and restores focus

- **WHEN** the menu is expanded and the user presses Escape
- **THEN** the menu collapses
- **AND** focus returns to the trigger that opened it

#### Scenario: Choosing a destination collapses the menu

- **WHEN** the user activates a link inside the expanded menu
- **THEN** the menu collapses

#### Scenario: Interaction elsewhere collapses the menu

- **WHEN** the menu is expanded and the user interacts with the page outside both the menu and
  its trigger
- **THEN** the menu collapses and reports itself as not expanded

#### Scenario: Navigation collapses the menu

- **WHEN** the menu is expanded and the active route changes
- **THEN** the menu collapses and reports itself as not expanded

### Requirement: Current location is indicated programmatically

Navigation controls SHALL programmatically indicate the item representing the user's
current location, using a token that describes the kind of location it marks.

#### Scenario: Active section is marked as a location

- **WHEN** a page section occupies the reading area
- **THEN** the corresponding in-page navigation link is marked as representing the current
  location within the page
- **AND** at most one in-page navigation link is so marked at any time

#### Scenario: Active language is marked

- **WHEN** a locale is active
- **THEN** the language switcher marks that locale's control as current
- **AND** does not mark any other locale's control as current

#### Scenario: Server and client markup agree

- **WHEN** the page is first delivered and then hydrated
- **THEN** no current-location marking differs between the delivered markup and the hydrated
  result

### Requirement: Status changes are announced without moving focus

A change of state that is conveyed visually and does not require the user's immediate
attention SHALL be announced to assistive technology without moving focus.

#### Scenario: Copy confirmation is announced

- **WHEN** the user activates the control that copies the contact address
- **THEN** a confirmation is announced through a polite live region
- **AND** keyboard focus remains on the control the user activated

#### Scenario: Live region exists before its content

- **WHEN** the page loads
- **THEN** the live region is already present in the document and empty, so that later content
  is announced rather than treated as initial markup

### Requirement: Target sizes are adequate

Controls SHALL present a pointer target of at least 24 by 24 CSS pixels, except where the
control is inline within a sentence of text.

#### Scenario: Standalone control meets the minimum

- **WHEN** a control rendered outside a sentence of text is measured
- **THEN** both its width and its height are at least 24 CSS pixels

#### Scenario: Targets do not overlap

- **WHEN** two adjacent standalone controls are measured
- **THEN** their 24-pixel target areas do not overlap

### Requirement: Decorative content is hidden from assistive technology

Content that conveys no information beyond what adjacent text already conveys SHALL be
excluded from the accessibility tree, and SHALL NOT be the only means of conveying
information.

#### Scenario: Purely decorative graphic is hidden

- **WHEN** a graphic exists only for visual effect
- **THEN** it is excluded from the accessibility tree

#### Scenario: Visual scale duplicating text is hidden

- **WHEN** a value is shown both as text and as a graphical scale
- **THEN** the scale is excluded from the accessibility tree and the text remains available

#### Scenario: Hidden decoration never carries unique meaning

- **WHEN** an element is excluded from the accessibility tree
- **THEN** no information available only from that element is lost to assistive technology

### Requirement: User preferences are respected

The site SHALL honor the user's declared preferences for reduced motion, color scheme, and
forced colors.

#### Scenario: Reduced motion suppresses animation

- **WHEN** the user prefers reduced motion
- **THEN** animations and transitions are suppressed
- **AND** scrolling triggered by in-page navigation is instant rather than smooth

#### Scenario: Color scheme preference selects the initial theme

- **WHEN** the user has expressed no explicit theme choice
- **THEN** the theme matching the operating system's color-scheme preference is applied before
  the first paint, with no flash of the opposite theme

#### Scenario: Explicit theme choice persists

- **WHEN** the user has chosen a theme and later revisits the site
- **THEN** the chosen theme is applied, overriding the operating system preference

#### Scenario: Forced colors preserves boundaries

- **WHEN** forced-colors mode is active
- **THEN** component boundaries remain visible using system colors

### Requirement: Text contrast meets the AA threshold

Text and its background SHALL meet a contrast ratio of at least 4.5:1, or 3:1 for
large-scale text. Boundaries of interactive controls SHALL meet at least 3:1 against their
adjacent background.

#### Scenario: Body text contrast in both themes

- **WHEN** any text is measured against its background in the light theme, and again in the
  dark theme
- **THEN** the ratio is at least 4.5:1, or at least 3:1 where the text is large-scale

#### Scenario: Control boundary contrast

- **WHEN** an interactive control's visible boundary is measured against the adjacent
  background
- **THEN** the ratio is at least 3:1
