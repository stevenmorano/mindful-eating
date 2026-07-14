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
    8.  **Gamification & Logging:** Decisions are saved to local storage. A gamified Dashboard features a Day Streak (with reduced-motion-aware confetti celebrations), a 28-day Craving Heatmap, actionable metrics (Money Saved, Danger Hour), category insights, and 61 unlockable achievements in a Trophy Case. Achievement popups queue sequentially when multiple achievements unlock.
    9.  **Emergency Breathing:** A dedicated emergency action bypasses activity selection and immediately starts guided box breathing for intense cravings.
    10. **Personal Pause Toolkit (Phase One QA):** A local Private Tools unlock now exposes the planned personalization experience for testing: custom activities, hidden and favorite preferences, activity weighting, per-activity defaults, and bounded timer presets. This is not a payment entitlement and does not yet include accounts, checkout, sync, or server-side security.
*   **Catalog:**
    *   Active distraction categories contain 50 built-in activities each.
    *   Quick & Healthy contains 50 mindful snack recommendations.
    *   Personal activities can be assigned to My Ideas or any active built-in category; the Mine chip gathers all personal activities for quick access. Emergency activities remain a separate guided flow.

## 5. Quality & Accessibility Requirements
*   The app must pass `npm run lint` and `npm run build` before release.
*   The app must support rapid manual QA through the password-locked Private Tools panel: five-second timer mode, sample progress load/clear, achievement scanning, seen-unlock reset, and a popup-only achievement demo.
*   Timer, theme toggle, raw log accordion, and icon-only controls must expose accessible labels or state.
*   The app should respect reduced-motion preferences for celebratory effects.
*   Malformed local storage data must not crash the app.
*   PWA metadata and install icon must use STOP! DON'T EAT! branding, not starter Vite assets.
*   iPhone standalone/web-app mode must keep top controls clear of the status bar and avoid white background leakage in dark mode.
*   Category selection must remain optional; the large home action must preserve the fully random path.

## 6. MVP Decisions Log
*   **Target Audience:** Focus primarily on boredom eaters (WFH, ADHD) who need a quick dopamine distraction.
*   **Timer Duration:** Default the timer to 5 minutes instead of 10 minutes, as shorter bursts are more achievable and often sufficient to break the cycle.
*   **Monetization & Trust:** Timer ads are not an MVP commitment. Asking users to leave the screen while an ad plays is a poor fit for ad-quality and viewability expectations, can produce weak revenue, and risks turning a moment of self-support into an intrusive experience. Any future advertising must be evaluated carefully for network policy, content safety, and its effect on user trust; it must not interrupt the active craving-pause flow.
*   **Category Selection:** Keep the home screen focused on the large random action, then expose category steering as compact chips on the suggestion screen.
*   **Emergency Naming:** Rename the former SOS path to Emergency Breathing so users understand it starts a guided 5-minute box-breathing reset.
*   **Free Core:** Keep the essential support path free: random starts, category steering, Emergency Breathing, the standard 5-minute pause, mindful snack unlocks, and basic history.
*   **Personalization Upgrades:** Future optional paid features can focus on user control rather than withholding help. Candidates include custom activities, unlimited hiding of unwanted built-in activities or categories, favorites and priority weighting, custom pause lengths, per-custom-activity timer lengths, category-level timer defaults, richer insights, reminders, themes, and optional sync.
*   **Timer Guardrails:** The default 5-minute pause remains the product's simplest, most approachable path. Flexible presets such as 2, 5, 10, 15, and 20 minutes can be offered as an optional deeper-reset capability; custom activities may carry their own timer length.
*   **Custom Activities:** The Phase One local QA toolkit now covers activity creation, category assignment, deletion, hiding, favorite selection, weighting, and per-activity timer controls. Production payment and entitlement work remains deferred.
*   **Phase One Personalization:** Validate the local Personal Pause Toolkit before selecting a payment provider. The free experience keeps unlimited built-in random activity cycling and the complete pause flow; paid value should come from user control and saved preferences.
*   **App Icon:** Use the custom dark STOP pause icon as the current PWA/favicon asset.

## 7. Verified Smoke-Test Coverage
The latest browser smoke test covered:
*   Dev Mode timer shortening.
*   Private Tools unlock and controls for timer mode, sample progress, achievement scans, seen-unlock resets, and popup replay.
*   Achievement catalog rendering and sequential celebration popups across all achievement groups.
*   Normal craving flow through the first pause.
*   Enforced second-pause requirement before snack unlock.
*   Session logging for both pause rounds.
*   Dashboard rendering and raw log expansion.
*   Theme toggle behavior.
*   Emergency Breathing timer flow.
*   Personal Pause Toolkit QA flow: local unlock, custom activity creation, favorites, hidden-category fallback, custom category selection, timer presets, custom defaults, and restored free rerolls.
*   Mobile toolkit polish: 48px selects, 44px preference targets, collapsed timer adjustment, and no horizontal overflow in wrapped custom-activity controls.
