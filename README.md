# STOP! DON'T EAT!

A mobile-first, web-based "Delay & Distract" application designed to help users combat boredom eating, emotional eating, and dopamine-seeking snacking (especially useful for individuals working from home or managing ADHD).

## The Core Concept
Snacking often happens automatically as a response to under-stimulation, rather than actual physical hunger. **STOP! DON'T EAT!** introduces a small point of friction. When you feel an urge to snack, you press a button and the app gives you a random 5-minute activity to do instead. 

If you spend just 5 minutes engaged in a different activity, the immediate urge to snack usually dissipates because the brain has found another source of stimulation.

## Key Features
*   **Dopamine Distractions:** Randomly suggests a 5-minute activity from curated categories (Movement, Creative, Productive, Social, Personal Care).
*   **Enforced Second-Pause Loop:** If the user is still hungry after the first timer, the app requires one more 5-minute pause before a mindful snack can be unlocked.
*   **Emergency SOS:** A dedicated panic button for severe cravings that immediately launches a 5-minute guided Box Breathing exercise.
*   **Gamified Stats Dashboard:**
    *   **Day Streaks:** Tracks consecutive days of successfully passing cravings.
    *   **Craving Heatmap:** A GitHub-style 28-day contribution graph showing daily outcomes.
    *   **Trophy Case:** Unlockable achievements like "Iron Will" and "Night Guardian".
    *   **Estimated Savings:** Calculates money saved by not buying junk food or eating out.
    *   **Raw Log:** Expandable chronological session history for debugging and review.
*   **Accessibility Pass:** Theme toggles, timers, dashboard accordion controls, and decorative SVGs include improved screen-reader semantics.
*   **PWA Branding:** App shell and manifest use a branded STOP icon instead of Vite starter assets.
*   **Dev Mode:** A local storage toggle speeds up 5-minute timers to 5 seconds for rapid UI/UX testing.

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

*   Enable **Dev Mode** from the home screen to shorten timers to 5 seconds.
*   Session data is stored in `localStorage` under `mindful_eating_sessions`.
*   Custom activities are stored in `localStorage` under `mm-custom-activities`.
*   Theme preference is stored under `mm-theme`.
*   The app now guards malformed local storage data and falls back to empty arrays instead of crashing.

## Validation Checklist

Use these checks before treating a change as complete:

```bash
npm run lint
npm run build
```

The latest smoke test also verified the mobile Dev Mode flow, enforced second pause, mindful snack unlock, dashboard/raw log, theme toggle, and SOS path.
