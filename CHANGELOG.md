# Changelog

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
