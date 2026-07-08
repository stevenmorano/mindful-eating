# Changelog

## 2026-07-08 - Category-Aware Pause Selection

### Added
* Restored the large home screen "DON'T EAT" random-start action.
* Added compact category chips to the activity suggestion screen.
* Added category-aware activity selection so re-rolls stay inside the selected category.
* Added activity category metadata for labels and filtering.
* Stored `activityCategory` on newly created session records.
* Expanded active activity categories to 50 built-in tasks each.
* Expanded Quick & Healthy mindful snack recommendations to 50 options.
* Added inactive Custom and Emergency idea catalogs for future feature work.

### Changed
* Renamed the former SOS action to "Emergency Breathing" with clearer guided reset copy.
* Updated the activity suggestion screen to show the active category or Any state.
* Refined iOS standalone app layout handling for safe areas, dark-mode background coverage, and nested dashboard scrolling.
* Refreshed the PWA app icon with a darker STOP pause mark.

### Verified
* `npm run lint`
* `npm run build`

## 2026-07-08 - Codex Migration Hardening

### Fixed
* Enforced the Second-Pause Rule so mindful snacks unlock only after two completed pauses.
* Logged the first "still hungry" decision before starting the second pause.
* Fixed the existing ESLint baseline.
* Added safe parsing for session and custom activity localStorage data.
* Replaced undefined `--mm-primary` references with `--mm-accent-primary`.

### Improved
* Added accessibility semantics for theme toggles, decorative SVGs, the timer, raw log accordion, and heatmap cells.
* Added reduced-motion handling for confetti and CSS transitions.
* Added a branded `public/app-icon.svg` and updated app shell/manifest metadata.
* Removed unused Vite and React starter SVG assets.
* Cleaned text encoding drift across app copy, data, and docs.

### Verified
* `npm run lint`
* `npm run build`
* Browser smoke test covering:
  * Dev Mode
  * first and second pause timers
  * snack unlock after the second pause
  * session logging
  * dashboard and raw log
  * theme toggle
  * SOS flow
