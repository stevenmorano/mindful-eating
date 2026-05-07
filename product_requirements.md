# STOP! DON'T EAT! - Product Requirements Document

## Overview
STOP! DON'T EAT! is a mobile-first web application designed to help users manage boredom-induced eating. By introducing a small point of friction—a "delay and distract" mechanic—the app helps users determine if their urge to snack is driven by genuine hunger or simply a need for a dopamine hit.

## 2. Target Audience
*   **Primary:** People who work from home and find themselves grazing or snacking out of boredom.
*   **Secondary:** Individuals with ADHD who seek quick dopamine hits through snacking.

## 3. Core Problem & Insight
*   **Problem:** Snacking often happens automatically as a response to boredom, under-stimulation, or the need for a quick reward (dopamine), rather than actual physical hunger.
*   **Insight:** If the user spends just 5 minutes (or less) engaged in a different activity, the immediate urge to snack usually dissipates because the brain has found another source of stimulation.

## 4. Current State (Production-Ready)
*   **Tech Stack:** React, Vite
*   **Flow:**
    1.  **Trigger:** User feels a craving and presses "I'm Hungry" (or the Emergency SOS button for immediate intervention).
    2.  **Suggestion:** App randomly selects a quick 5-minute activity (e.g., Movement, Creative, Productive).
    3.  **Delay:** A 5-minute visual timer runs (with Dev Mode available to shorten this to 5 seconds for testing).
    4.  **Decision:** Once the timer ends, the user is asked: "Are you still hungry?"
    5.  **Extension:** If they are still hungry, they are forced to complete one more 5-minute task before being offered a "Mindful Snack".
    6.  **Gamification & Logging:** Decisions are saved to local storage. A gamified Dashboard features a Day Streak (with confetti celebrations), a 28-day Craving Heatmap, actionable metrics (Money Saved, Danger Hour), and unlockable badges in a Trophy Case.

## 5. MVP Decisions Log
*   **Target Audience:** Focus primarily on boredom eaters (WFH, ADHD) who need a quick dopamine distraction.
*   **Timer Duration:** Default the timer to 5 minutes instead of 10 minutes, as shorter bursts are more achievable and often sufficient to break the cycle.
*   **Monetization & Distraction:** The app will be monetized via ads. During the 5-minute countdown timer, ads will play on the screen while the user performs the suggested external activity (from the curated list). This ensures the user is distracted by the activity while the app still gets credit for ad impressions.


