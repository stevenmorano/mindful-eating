# STOP! DON'T EAT!

A mobile-first, web-based "Delay & Distract" application designed to help users combat boredom eating, emotional eating, and dopamine-seeking snacking (especially useful for individuals working from home or managing ADHD).

## The Core Concept
Snacking often happens automatically as a response to under-stimulation, rather than actual physical hunger. **STOP! DON'T EAT!** introduces a small point of friction. When you feel an urge to snack, the main action gives you a random 5-minute activity, with optional category chips available on the suggestion screen.

If you spend just 5 minutes engaged in a different activity, the immediate urge to snack usually dissipates because the brain has found another source of stimulation.

## Key Features
*   **Fast Random Start:** The home screen keeps a large "DON'T EAT" action that immediately starts a fully random pause suggestion.
*   **Dopamine Distractions:** Suggests 5-minute activities from curated categories (Movement, Mind Engagement, Productive, Mindfulness, Creative, Social, Self-Improvement, Personal Care, Environment), with 50 built-in activities per active category.
*   **Suggestion-Screen Category Chips:** Users can switch the suggestion to a specific category after starting, without cluttering the home screen.
*   **Category-Aware Re-rolls:** When a user selects a category chip, "another idea" stays inside that category. Any/Random continues to pull from the full activity pool.
*   **Enforced Second-Pause Loop:** If the user is still hungry after the first timer, the app requires one more 5-minute pause before a mindful snack can be unlocked.
*   **Emergency Breathing:** A clearer emergency action for intense cravings that immediately launches a 5-minute guided Box Breathing exercise.
*   **Gamified Stats Dashboard:**
    *   **Day Streaks:** Tracks consecutive days of successfully passing cravings.
    *   **Craving Heatmap:** A GitHub-style 28-day contribution graph showing daily outcomes.
    *   **Trophy Case:** 61 unlockable achievements across core pauses, streaks, craving wins, variety, timing, Emergency Breathing, mindful snacks, savings, and category-specific progress.
    *   **Achievement Popups:** Big celebratory unlock cards appear one after another when new achievements are earned.
    *   **Category Insights:** Shows category variety, strongest category, and top category pass rates.
    *   **Estimated Savings:** Calculates money saved by not buying junk food or eating out.
    *   **Raw Log:** Expandable chronological session history for debugging and review.
*   **Accessibility Pass:** Theme toggles, timers, dashboard accordion controls, and decorative SVGs include improved screen-reader semantics.
*   **PWA Branding:** App shell and manifest use a custom dark STOP pause icon instead of Vite starter assets.
*   **iOS Standalone Layout Support:** The app shell accounts for iPhone safe areas and standalone web-app viewport behavior.
*   **Dev Mode & Private QA Tools:** A password-locked panel provides the five-second timer shortcut, loads or clears sample dashboard progress, scans for newly unlocked achievements, resets seen-unlock state, and replays a scripted achievement popup sequence without changing real data.

## Product Direction

The core pause experience is intended to remain free: random starts, category steering, Emergency Breathing, the standard 5-minute pause, mindful snack unlocks, and basic history should not require payment. Future paid features should add personalization rather than restrict help at the moment of a craving.

Potential optional upgrades include custom activities, expanded hiding and favoriting controls, custom pause lengths, per-activity timer lengths, category timer defaults, deeper insights, reminders, themes, and optional sync. Timer ads are not a committed feature: an ad experience during a craving pause could undermine trust and may be difficult to monetize reliably if people are intentionally away from the screen.

## Tech Stack
*   **Frontend:** React, Vite
*   **Styling:** Custom CSS (built for mobile-first responsiveness)
*   **State Management:** React Hooks (`useState`, `useEffect`)
*   **Persistence:** Local Storage (`sessions.js`)
*   **Animations:** `canvas-confetti`
*   **Validation:** ESLint, Vite production build, and Playwright smoke testing

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
3.  **Build for Production:**
    ```bash
    npm run build
    ```

## Development Notes

*   Unlock **Private Tools** from the home screen to enable the five-second Dev Mode timer, load sample progress, inspect achievement behavior, or replay popup demos.
*   Session data is stored in `localStorage` under `mindful_eating_sessions`.
*   New sessions include `activityCategory` for future category-level stats and history features.
*   Custom activity storage still uses `localStorage` under `mm-custom-activities`, but custom activity UI is intentionally not active yet.
*   `src/data/activities.js` includes inactive `customActivityIdeas` and `emergencyActivities` lists for future personalization/emergency expansion.
*   Theme preference is stored under `mm-theme`.
*   The app now guards malformed local storage data and falls back to empty arrays instead of crashing.

## Validation Checklist

Use these checks before treating a change as complete:

```bash
npm run lint
npm run build
```

The latest smoke test also verified the mobile Dev Mode flow, enforced second pause, mindful snack unlock, dashboard/raw log, theme toggle, and Emergency Breathing path.
