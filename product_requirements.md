# STOP! DON'T EAT! - Product Requirements Document

## Overview
STOP! DON'T EAT! is a mobile-first web application designed to help users manage boredom-induced eating. By introducing a small point of friction—a "delay and distract" mechanic—the app helps users determine if their urge to snack is driven by genuine hunger or simply a need for a dopamine hit.

## 2. Target Audience
*   **Primary:** People who work from home and find themselves grazing or snacking out of boredom.
*   **Secondary:** Individuals with ADHD who seek quick dopamine hits through snacking.

## 3. Core Problem & Insight
*   **Problem:** Snacking often happens automatically as a response to boredom, under-stimulation, or the need for a quick reward (dopamine), rather than actual physical hunger.
*   **Insight:** If the user spends just 5 minutes (or less) engaged in a different activity, the immediate urge to snack usually dissipates because the brain has found another source of stimulation.

## 4. Current State (Prototype)
*   **Tech Stack:** React, Vite
*   **Flow:**
    1.  **Trigger:** User feels a craving and presses the big "I'm Hungry" button.
    2.  **Suggestion:** App randomly selects a quick activity from a categorized list (e.g., Quick & Healthy, Movement, Mind Engagement). User can re-roll or accept.
    3.  **Delay:** A visual timer (currently defaults to 10 minutes) runs to create space between the urge and the action.
    4.  **Decision:** Once the timer ends, the user is asked: "Are you still hungry?"
    5.  **Logging & Insights:** The decision is saved to local storage. A History view provides stats on "Mindful Minutes," completion rates, and ratio of skipping vs. eating.

## 5. MVP Decisions Log
*   **Target Audience:** Focus primarily on boredom eaters (WFH, ADHD) who need a quick dopamine distraction.
*   **Timer Duration:** Default the timer to 5 minutes instead of 10 minutes, as shorter bursts are more achievable and often sufficient to break the cycle.
*   **Monetization & Distraction:** The app will be monetized via ads. During the 5-minute countdown timer, ads will play on the screen while the user performs the suggested external activity (from the curated list). This ensures the user is distracted by the activity while the app still gets credit for ad impressions.


