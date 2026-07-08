# STOP! DON'T EAT! - Project Roadmap

This document serves as the central tracking checklist for the "STOP! DON'T EAT!" project. We will update this file as we finalize the MVP requirements and execute them.

## Phase 1: Prototype / Proof of Concept (Completed)
- [x] Initial React + Vite setup
- [x] Core "Delay & Distract" loop implementation
- [x] Home screen with "I'm Hungry" trigger
- [x] Activity suggestion engine with categorized data
- [x] 10-minute visual countdown timer
- [x] Decision logging (Still Hungry: Yes / No)
- [x] History View with basic stats and insights (Completion Rate, Mindful Mins)
- [x] Local Storage persistence for session data

## Phase 2: MVP Definition & Planning (Completed)
- [x] Define precise target audience (Boredom eating / ADHD / WFH)
- [x] Finalize ideal timer duration logic (Default to 5 minutes)
- [x] Finalize dopamine-seeking activity types (Ads during countdown)
- [x] Brainstorm and define MVP scope
- [x] Create detailed task checklist based on MVP scope

## Phase 3: MVP Implementation (Completed)
- [x] Modify `TimerView.jsx` to default to 5 minutes (300 seconds).
- [x] Implement Ad placeholders / integration in `TimerView.jsx` to display alongside the countdown timer.
- [x] Explore / implement Screen Wake Lock API to prevent the phone from sleeping during the 5-minute ad/timer.
- [x] Update `HistoryView.jsx` or any logic relying on the hardcoded 10-minute value to use the new 5-minute baseline.

## Phase 4: Polish & Brainstorming Implementation (Completed)
- [x] Gamification: Craving Streaks & Confetti particle effects
- [x] Activity Categorization: Context-aware snack suggestions vs distractions
- [x] UI/UX: Post-Pause feedback loop & Progressive affirmations
- [x] Functional: Emergency SOS mode & PWA Manifest for Homescreen
## Phase 5: Gamified Stats Dashboard (Completed)
- [x] Convert History view to a Bento Grid layout
- [x] Build custom CSS Craving Heatmap (GitHub-style 28-day contribution graph)
- [x] Implement dynamic metrics (Danger Hour, Estimated Savings, Top Distraction)
- [x] Create Trophy Case and logic (Iron Will, Distraction Master, Night Guardian, SOS Survivor)
- [x] Hide raw text log behind an accordion toggle

## Phase 6: Codex Migration & Hardening (Completed)
- [x] Inspect React/Vite architecture after migration from Antigravity
- [x] Fix lint baseline and pass `npm run lint`
- [x] Enforce the Second-Pause Rule before mindful snack unlock
- [x] Log first-round "still hungry" sessions before starting the second pause
- [x] Harden localStorage parsing for sessions and custom activities
- [x] Improve accessibility semantics for theme toggles, timer, accordion, and icon controls
- [x] Respect reduced-motion preferences for confetti
- [x] Replace Vite/React starter assets with branded app icon metadata
- [x] Remove mojibake and non-ASCII drift from app/docs/data files
- [x] Run browser smoke test for Dev Mode, two-pause flow, dashboard, theme toggle, and SOS
- [x] Improve iOS standalone safe-area handling for installed web-app usage

## Phase 7: Category-First Pause Selection (Completed)
- [x] Add icon-based home screen category picker
- [x] Preserve fully random activity selection through "Surprise Me"
- [x] Filter initial activity suggestions by selected category
- [x] Keep "generate another idea" inside the selected category
- [x] Rename SOS action to Emergency Breathing with clearer helper copy
- [x] Store `activityCategory` on new session records for future stats
- [x] Add activity category metadata for labels, counts, and icons

## Phase 8: Finalization (Upcoming)
- [ ] Final production deployment
- [ ] Real ad integration decision and implementation
- [ ] Optional persistent analytics or sync strategy
- [ ] Optional category-level dashboard insights
- [ ] Optional automated test suite for core flows
