import { categoryMeta } from './activities';

export const CATEGORY_TARGETS = [
    ['Movement', 'Move Your Mood', 'Body Reset'],
    ['Mind Engagement', 'Mind Game', 'Brain Saver'],
    ['Productive', 'Tiny Tidy', 'Clean Slate'],
    ['Mindfulness', 'Calm Choice', 'Grounded'],
    ['Creative', 'Creative Detour', 'Maker Mode'],
    ['Social', 'Reach Out', 'Connection Wins'],
    ['Self-Improvement', 'Level Up', 'Better Me Builder'],
    ['Personal Care', 'Care Check', 'Self-Care Streak'],
    ['Environment', 'Room Shift', 'Environment Architect'],
];

const ACHIEVEMENT_SEEN_KEY = 'mm-achievement-seen';

const clampProgress = (value, target) => Math.min(value, target);

function getStreak(completedSessions) {
    if (completedSessions.length === 0) return 0;
    const sortedCompleted = [...completedSessions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDateToCheck = new Date(today);

    const mostRecentDate = new Date(sortedCompleted[0].timestamp);
    mostRecentDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - mostRecentDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;
    if (diffDays === 1) currentDateToCheck.setDate(today.getDate() - 1);

    const uniqueDates = [...new Set(sortedCompleted.map(session => {
        const date = new Date(session.timestamp);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }))];

    let currentExpectedDate = currentDateToCheck.getTime();
    for (const timestamp of uniqueDates) {
        if (timestamp === currentExpectedDate) {
            streak++;
            currentExpectedDate -= (1000 * 60 * 60 * 24);
        } else if (timestamp < currentExpectedDate) {
            break;
        }
    }
    return streak;
}

function buildAchievement(id, group, title, description, current, target, icon) {
    const progress = clampProgress(current, target);
    return {
        id,
        group,
        title,
        description,
        current: progress,
        target,
        icon,
        unlocked: progress >= target,
    };
}

export function getAchievementStats(sessions) {
    const completedSessions = sessions.filter(session => session.completed);
    const passedSessions = sessions.filter(session => session.completed && session.stillHungry === false);
    const cravingStreak = getStreak(completedSessions);

    const categoryCounts = {};
    const passedCategoryCounts = {};
    completedSessions.forEach((session) => {
        const category = session.activityCategory;
        if (!category || category === 'Emergency') return;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        if (session.stillHungry === false) {
            passedCategoryCounts[category] = (passedCategoryCounts[category] || 0) + 1;
        }
    });

    const completedCategories = Object.keys(categoryCounts).length;
    const categoriesWithThree = CATEGORY_TARGETS.filter(([category]) => (categoryCounts[category] || 0) >= 3).length;
    const categoriesWithTen = CATEGORY_TARGETS.filter(([category]) => (categoryCounts[category] || 0) >= 10).length;
    const secondPauseWins = completedSessions.filter(session => session.pauseRound >= 2 && session.stillHungry === false).length;
    const emergencySessions = sessions.filter(session => session.activityCategory === 'Emergency' || session.activityTitle === 'Emergency Breathing');
    const emergencyWins = emergencySessions.filter(session => session.completed && session.stillHungry === false).length;
    const snackSessions = completedSessions.filter(session => session.stillHungry === true).length;
    const randomSessions = completedSessions.filter(session => !session.activityCategory).length;
    const lateNightPassed = passedSessions.filter(session => {
        const hour = new Date(session.timestamp).getHours();
        return hour >= 21 || hour < 3;
    }).length;
    const morningPauses = completedSessions.filter(session => new Date(session.timestamp).getHours() < 10).length;
    const afternoonPauses = completedSessions.filter(session => {
        const hour = new Date(session.timestamp).getHours();
        return hour >= 12 && hour < 17;
    }).length;
    const weekendPauses = completedSessions.filter(session => {
        const day = new Date(session.timestamp).getDay();
        return day === 0 || day === 6;
    }).length;

    const achievements = [
        buildAchievement('first_pause', 'Core', 'First Pause', 'Complete your first pause.', completedSessions.length, 1, '1'),
        buildAchievement('three_pauses', 'Core', 'Three Pauses', 'Complete 3 total pauses.', completedSessions.length, 3, '3'),
        buildAchievement('ten_pauses', 'Core', 'Ten Pauses', 'Complete 10 total pauses.', completedSessions.length, 10, '10'),
        buildAchievement('fifty_pauses', 'Core', 'Distraction Master', 'Complete 50 total pauses.', completedSessions.length, 50, '50'),
        buildAchievement('century_pause', 'Core', 'Century Pause', 'Complete 100 total pauses.', completedSessions.length, 100, '100'),
        buildAchievement('iron_will', 'Streaks', 'Iron Will', 'Hit a 7-day craving streak.', cravingStreak, 7, '7'),
        buildAchievement('steady_flame', 'Streaks', 'Steady Flame', 'Hit a 14-day craving streak.', cravingStreak, 14, '14'),
        buildAchievement('momentum_builder', 'Streaks', 'Momentum Builder', 'Hit a 30-day craving streak.', cravingStreak, 30, '30'),
        buildAchievement('urge_defeated', 'Cravings', 'Urge Defeated', 'Pass one craving.', passedSessions.length, 1, 'P'),
        buildAchievement('five_wins', 'Cravings', 'Five Wins', 'Pass 5 cravings.', passedSessions.length, 5, '5'),
        buildAchievement('twenty_wins', 'Cravings', 'Twenty Wins', 'Pass 20 cravings.', passedSessions.length, 20, '20'),
        buildAchievement('craving_veteran', 'Cravings', 'Craving Veteran', 'Pass 50 cravings.', passedSessions.length, 50, '50'),
        buildAchievement('second_thought', 'Cravings', 'Second Thought', 'Complete the second-pause rule.', completedSessions.filter(session => session.pauseRound >= 2).length, 1, '2'),
        buildAchievement('double_pause_win', 'Cravings', 'Double Pause Win', 'Finish a second pause and skip the snack.', secondPauseWins, 1, '2X'),
        buildAchievement('sampler', 'Variety', 'Sampler', 'Complete pauses in 3 different categories.', completedCategories, 3, '3C'),
        buildAchievement('well_rounded', 'Variety', 'Well-Rounded', 'Complete one pause in every category.', completedCategories, CATEGORY_TARGETS.length, 'ALL'),
        buildAchievement('category_explorer', 'Variety', 'Category Explorer', 'Complete 3 pauses in every category.', categoriesWithThree, CATEGORY_TARGETS.length, 'EX'),
        buildAchievement('full_toolkit', 'Variety', 'Full Toolkit', 'Complete 10 pauses in every category.', categoriesWithTen, CATEGORY_TARGETS.length, 'KIT'),
        buildAchievement('surprise_me', 'Variety', 'Surprise Me', 'Complete 5 random Any pauses.', randomSessions, 5, '?'),
        buildAchievement('open_mind', 'Variety', 'Open Mind', 'Complete 20 random Any pauses.', randomSessions, 20, '20'),
        buildAchievement('morning_reset', 'Timing', 'Morning Reset', 'Complete 5 pauses before 10 AM.', morningPauses, 5, 'AM'),
        buildAchievement('afternoon_save', 'Timing', 'Afternoon Save', 'Complete 5 pauses between noon and 5 PM.', afternoonPauses, 5, 'PM'),
        buildAchievement('night_guardian', 'Timing', 'Night Guardian', 'Pass 5 cravings after 9 PM.', lateNightPassed, 5, '9P'),
        buildAchievement('weekend_warrior', 'Timing', 'Weekend Warrior', 'Complete 5 pauses on weekends.', weekendPauses, 5, 'WE'),
        buildAchievement('emergency_reset', 'Emergency', 'Emergency Reset', 'Use Emergency Breathing once.', emergencySessions.length, 1, 'SOS'),
        buildAchievement('breathe_through_it', 'Emergency', 'Breathe Through It', 'Use Emergency Breathing 5 times.', emergencySessions.length, 5, '5'),
        buildAchievement('still_here', 'Emergency', 'Still Here', 'Complete Emergency Breathing and skip eating.', emergencyWins, 1, 'BR'),
        buildAchievement('no_shame_snack', 'Snacks', 'No Shame Snack', 'Unlock a mindful snack after two pauses.', snackSessions, 1, 'SN'),
        buildAchievement('snack_with_intention', 'Snacks', 'Snack With Intention', 'Choose 5 mindful snacks.', snackSessions, 5, '5'),
        buildAchievement('nourished_not_numb', 'Snacks', 'Nourished Not Numb', 'Choose 20 mindful snacks.', snackSessions, 20, '20'),
        buildAchievement('first_savings', 'Savings', 'First $3 Saved', 'Pass one craving.', passedSessions.length * 3, 3, '$3'),
        buildAchievement('snack_budget_saver', 'Savings', 'Snack Budget Saver', 'Save an estimated $15.', passedSessions.length * 3, 15, '$15'),
        buildAchievement('wallet_wins', 'Savings', 'Wallet Wins', 'Save an estimated $50.', passedSessions.length * 3, 50, '$50'),
        buildAchievement('big_saver', 'Savings', 'Big Saver', 'Save an estimated $100.', passedSessions.length * 3, 100, '$100'),
    ];

    CATEGORY_TARGETS.forEach(([category, firstTitle, secondTitle]) => {
        const label = categoryMeta[category]?.label || category;
        const count = categoryCounts[category] || 0;
        const passedCount = passedCategoryCounts[category] || 0;
        achievements.push(buildAchievement(`${category}_5`, 'Categories', firstTitle, `Complete 5 ${label} pauses.`, count, 5, label.slice(0, 2).toUpperCase()));
        achievements.push(buildAchievement(`${category}_20`, 'Categories', secondTitle, `Complete 20 ${label} pauses.`, count, 20, '20'));
        achievements.push(buildAchievement(`${category}_passed_5`, 'Category Wins', `${label} Wins`, `Pass 5 cravings after ${label} pauses.`, passedCount, 5, 'W'));
    });

    return {
        achievements,
        completedSessions,
        passedSessions,
        cravingStreak,
    };
}

export function getUnlockedAchievements(sessions) {
    return getAchievementStats(sessions).achievements.filter(achievement => achievement.unlocked);
}

export function loadSeenAchievementIds() {
    try {
        const raw = localStorage.getItem(ACHIEVEMENT_SEEN_KEY);
        if (!raw) return new Set();
        const parsed = JSON.parse(raw);
        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
        return new Set();
    }
}

export function saveSeenAchievementIds(ids) {
    const nextIds = Array.from(new Set(ids));
    localStorage.setItem(ACHIEVEMENT_SEEN_KEY, JSON.stringify(nextIds));
    return new Set(nextIds);
}

export function seedSeenAchievementIdsFromSessions(sessions) {
    const unlockedIds = getUnlockedAchievements(sessions).map(achievement => achievement.id);
    return saveSeenAchievementIds(unlockedIds);
}

export function getNewlyUnlockedAchievements(sessions, seenIds = null) {
    const seenSet = seenIds instanceof Set ? seenIds : loadSeenAchievementIds();
    return getUnlockedAchievements(sessions).filter(achievement => !seenSet.has(achievement.id));
}
