# STOP! DON'T EAT! 🛑

A mobile-first, web-based "Delay & Distract" application designed to help users combat boredom eating, emotional eating, and dopamine-seeking snacking (especially useful for individuals working from home or managing ADHD).

## The Core Concept
Snacking often happens automatically as a response to under-stimulation, rather than actual physical hunger. **STOP! DON'T EAT!** introduces a small point of friction. When you feel an urge to snack, you press a button and the app gives you a random 5-minute activity to do instead. 

If you spend just 5 minutes engaged in a different activity, the immediate urge to snack usually dissipates because the brain has found another source of stimulation.

## Key Features
*   **Dopamine Distractions:** Randomly suggests a 5-minute activity from curated categories (Movement, Creative, Productive, Social, Personal Care).
*   **The Second-Pause Loop:** If you're still hungry after the 5 minutes, the app challenges you to complete *one more* task before offering a mindful snack.
*   **Emergency SOS:** A dedicated panic button for severe cravings that immediately launches a 5-minute guided Box Breathing exercise.
*   **Gamified Stats Dashboard:**
    *   🔥 **Day Streaks:** Tracks consecutive days of successfully passing cravings.
    *   📅 **Craving Heatmap:** A GitHub-style 28-day contribution graph showing your daily wins.
    *   🏆 **Trophy Case:** Unlockable achievements like "Iron Will" and "Night Guardian".
    *   💰 **Estimated Savings:** Calculates money saved by not buying junk food or eating out.
*   **Dev Mode:** A local storage toggle to speed up the 5-minute timers to 5 seconds for rapid UI/UX testing.

## Tech Stack
*   **Frontend:** React, Vite
*   **Styling:** Custom CSS (built for mobile-first responsiveness)
*   **State Management:** React Hooks (`useState`, `useEffect`)
*   **Persistence:** Local Storage (`sessions.js`)
*   **Animations:** `canvas-confetti`

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
