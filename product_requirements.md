# STOP! DON'T EAT! - Product Requirements Document

## Overview
STOP! DON'T EAT! is a mobile-first web application designed to help users manage boredom-induced eating. By introducing a small point of friction - a "delay and distract" mechanic - the app helps users determine if their urge to snack is driven by genuine hunger or simply a need for a dopamine hit.

## 2. Target Audience
*   **Primary:** People who work from home and find themselves grazing or snacking out of boredom.
*   **Secondary:** Individuals with ADHD who seek quick dopamine hits through snacking.

## 3. Core Problem & Insight
*   **Problem:** Snacking often happens automatically as a response to boredom, under-stimulation, or the need for a quick reward (dopamine), rather than actual physical hunger.
*   **Insight:** If the user spends just 5 minutes (or less) engaged in a different activity, the immediate urge to snack usually dissipates because the brain has found another source of stimulation.

## 4. Current State (Production-Ready Candidate)
*   **Tech Stack:** React, Vite
*   **Flow:**
    1.  **Trigger:** User feels a craving and presses the large "DON'T EAT" action on the home screen.
    2.  **Suggestion:** App selects a quick 5-minute activity from the full activity pool.
    3.  **Category Steering:** On the suggestion screen, the user can optionally tap compact category chips (e.g., Movement, Creative, Productive) to swap the suggestion into that category.
    4.  **Delay:** A 5-minute visual timer runs (with Dev Mode available to shorten this to 5 seconds for testing).
    5.  **Decision:** Once the timer ends, the user is asked: "Are you still hungry?"
    6.  **Extension:** If they are still hungry after the first pause, they must complete one more 5-minute task before being offered a "Mindful Snack". The second pause respects the selected category when applicable.
    7.  **Mindful Snack Unlock:** If they are still hungry after the second completed pause, the app offers a random healthy snack suggestion.
    8.  **Gamification & Logging:** Decisions are saved to local storage. A gamified Dashboard features a Day Streak (with reduced-motion-aware confetti celebrations), a 28-day Craving Heatmap, actionable metrics (Money Saved, Danger Hour), and unlockable badges in a Trophy Case.
    9.  **Emergency Breathing:** A dedicated emergency action bypasses activity selection and immediately starts guided box breathing for intense cravings.
*   **Catalog:**
    *   Active distraction categories contain 50 built-in activities each.
    *   Quick & Healthy contains 50 mindful snack recommendations.
    *   Custom and Emergency catalogs are stored for future expansion but are not exposed as normal suggestion categories yet.

## 5. Quality & Accessibility Requirements
*   The app must pass `npm run lint` and `npm run build` before release.
*   The app must support rapid manual QA through Dev Mode.
*   Timer, theme toggle, raw log accordion, and icon-only controls must expose accessible labels or state.
*   The app should respect reduced-motion preferences for celebratory effects.
*   Malformed local storage data must not crash the app.
*   PWA metadata and install icon must use STOP! DON'T EAT! branding, not starter Vite assets.
*   iPhone standalone/web-app mode must keep top controls clear of the status bar and avoid white background leakage in dark mode.
*   Category selection must remain optional; the large home action must preserve the fully random path.

## 6. MVP Decisions Log
*   **Target Audience:** Focus primarily on boredom eaters (WFH, ADHD) who need a quick dopamine distraction.
*   **Timer Duration:** Default the timer to 5 minutes instead of 10 minutes, as shorter bursts are more achievable and often sufficient to break the cycle.
*   **Monetization & Distraction:** The app will be monetized via ads. During the 5-minute countdown timer, ads will play on the screen while the user performs the suggested external activity (from the curated list). This ensures the user is distracted by the activity while the app still gets credit for ad impressions.
*   **Category Selection:** Keep the home screen focused on the large random action, then expose category steering as compact chips on the suggestion screen.
*   **Emergency Naming:** Rename the former SOS path to Emergency Breathing so users understand it starts a guided 5-minute box-breathing reset.
*   **Custom Activities:** Keep custom activity ideas parked behind a future paywall feature; do not surface them in the active app flow until that feature is designed.
*   **App Icon:** Use the custom dark STOP pause icon as the current PWA/favicon asset.

## 7. Verified Smoke-Test Coverage
The latest browser smoke test covered:
*   Dev Mode timer shortening.
*   Normal craving flow through the first pause.
*   Enforced second-pause requirement before snack unlock.
*   Session logging for both pause rounds.
*   Dashboard rendering and raw log expansion.
*   Theme toggle behavior.
*   Emergency Breathing timer flow.
