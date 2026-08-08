import { AppData, LogEntry, TwinStage, Challenge, UserProfile } from '../types';

import { calculateFootprint } from '../data/emissionFactors';
import { ALL_CHALLENGES, ALL_BADGES, getSampleHistory } from '../data/staticData';

const LOCAL_STORAGE_KEY = 'ecotwin_app_data_v1';

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.history)) {
        return ensureStateIntegrity(parsed);
      }
    }
  } catch (e) {
    console.warn('Failed to load EcoTwin data from localStorage, fallback to initial state', e);
  }

  // Initial Seed Data with Sample History for immediate interactive experience
  const sampleHistory = getSampleHistory();
  const initialState: AppData = {
    history: sampleHistory,
    greenScore: 78,
    twinStage: 4,
    streakDays: 6,
    badgesUnlocked: ['first-log', 'streak-3', 'digital-detox', 'thriving-twin'],
    challengesCompleted: ['digital-720p', 'transport-transit'],
    lastLoggedDate: sampleHistory[sampleHistory.length - 1]?.date,
    activeChallengeId: 'digital-720p'
  };

  saveAppData(initialState);
  return initialState;
}

export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save EcoTwin data to localStorage', e);
  }
}

export function updateUserProfile(currentState: AppData, name: string): AppData {
  const userProfile: UserProfile = {
    name: name.trim() || 'EcoExplorer',
    createdAt: currentState.userProfile?.createdAt || new Date().toISOString()
  };

  const updatedState: AppData = {
    ...currentState,
    userProfile
  };

  saveAppData(updatedState);
  return updatedState;
}

export function resetAppData(): AppData {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  return loadAppData();
}

/**
 * Calculates rolling average trend and derives Twin Stage (1-5)
 */
export function deriveTwinStage(history: LogEntry[]): TwinStage {
  if (!history || history.length === 0) return 3; // Default fresh sapling budding

  // Use up to last 7 days of logs
  const recentLogs = history.slice(-7);
  const avg7Day = recentLogs.reduce((acc, curr) => acc + curr.totalFootprint, 0) / recentLogs.length;

  // Weight latest log heavily (65%) so user's daily habits directly drive tree growth
  const latestLog = history[history.length - 1];
  const latestFootprint = latestLog ? latestLog.totalFootprint : avg7Day;

  const effectiveFootprint = (latestFootprint * 0.65) + (avg7Day * 0.35);

  if (effectiveFootprint > 11.5) return 1;      // Wilted
  if (effectiveFootprint > 8.5) return 2;       // Recovering
  if (effectiveFootprint > 6.0) return 3;       // Budding
  if (effectiveFootprint > 3.8) return 4;       // Thriving
  return 5;                                     // Flourishing
}

/**
 * Calculates Green Score (0-100) based on emissions, streak, and challenges
 */
export function calculateGreenScore(
  history: LogEntry[],
  streakDays: number,
  challengesCompletedCount: number
): number {
  if (!history || history.length === 0) return 70;

  const recentLogs = history.slice(-7);
  const avgFootprint = recentLogs.reduce((acc, curr) => acc + curr.totalFootprint, 0) / recentLogs.length;

  // Base score inversely proportional to footprint (avg 3kg => base ~80)
  let baseScore = 100 - (avgFootprint * 6.5);
  
  // Bonus points for streak and challenge completion
  const streakBonus = Math.min(15, streakDays * 2);
  const challengeBonus = Math.min(15, challengesCompletedCount * 3);

  const totalScore = Math.round(baseScore + streakBonus + challengeBonus);
  return Math.min(100, Math.max(0, totalScore));
}

/**
 * Selects a personalized challenge based on the worst category
 */
export function getPersonalizedChallenge(worstCategory: string, completedIds: string[]): Challenge {
  const eligible = ALL_CHALLENGES.filter(
    c => c.category === worstCategory && !completedIds.includes(c.id)
  );

  if (eligible.length > 0) {
    return eligible[0];
  }

  // Fallback to any uncompleted challenge or first challenge
  const fallback = ALL_CHALLENGES.find(c => !completedIds.includes(c.id)) || ALL_CHALLENGES[0];
  return fallback;
}

/**
 * Checks for any newly unlocked badges based on current app state
 */
export function updateBadges(data: AppData): string[] {
  const unlocked = new Set(data.badgesUnlocked);
  const totalLogs = data.history.length;
  const latestLog = data.history[data.history.length - 1];

  for (const badge of ALL_BADGES) {
    if (unlocked.has(badge.id)) continue;

    let qualifies = false;
    if (badge.conditionType === 'total_logs' && totalLogs >= badge.targetValue) qualifies = true;
    if (badge.conditionType === 'streak' && data.streakDays >= badge.targetValue) qualifies = true;
    if (badge.conditionType === 'stage' && data.twinStage >= badge.targetValue) qualifies = true;
    if (badge.conditionType === 'challenges' && data.challengesCompleted.length >= badge.targetValue) qualifies = true;
    
    if (badge.conditionType === 'digital_low' && latestLog) {
      if (latestLog.footprintByCategory.digital <= badge.targetValue) qualifies = true;
    }

    if (badge.conditionType === 'balanced' && latestLog) {
      const cats = latestLog.footprintByCategory;
      if (cats.transport <= 2.5 && cats.food <= 2.5 && cats.energy <= 2.5 && cats.digital <= 2.5) {
        qualifies = true;
      }
    }

    if (qualifies) {
      unlocked.add(badge.id);
    }
  }

  return Array.from(unlocked);
}

/**
 * Helper to ensure state completeness
 */
function ensureStateIntegrity(state: AppData): AppData {
  const history = state.history || [];
  const twinStage = deriveTwinStage(history);
  const greenScore = calculateGreenScore(history, state.streakDays || 0, (state.challengesCompleted || []).length);
  const latestWorstCat = history[history.length - 1]?.worstCategory || 'digital';
  
  const activeChallenge = getPersonalizedChallenge(latestWorstCat, state.challengesCompleted || []);

  const updatedState: AppData = {
    ...state,
    history,
    twinStage,
    greenScore,
    streakDays: state.streakDays || 1,
    badgesUnlocked: state.badgesUnlocked || ['first-log'],
    challengesCompleted: state.challengesCompleted || [],
    activeChallengeId: activeChallenge.id
  };

  updatedState.badgesUnlocked = updateBadges(updatedState);
  return updatedState;
}

/**
 * Main action: Adds a new daily habit log entry
 */
export function submitHabitLog(
  currentState: AppData,
  input: {
    transportKm: number;
    transportMode: any;
    meals: number;
    meatMeals: number;
    energyLevel: number;
    streamingHours: number;
    streamingQuality: any;
    emailsSent: number;
    cloudBackupGB: number;
  }
): { updatedState: AppData; newEntry: LogEntry; isNewStreak: boolean; newlyUnlockedBadges: string[] } {
  const todayStr = new Date().toISOString().split('T')[0];
  const { footprintByCategory, totalFootprint, worstCategory } = calculateFootprint(input);

  const newEntry: LogEntry = {
    id: `log-${todayStr}-${Date.now()}`,
    date: todayStr,
    transportKm: input.transportKm,
    transportMode: input.transportMode,
    meals: input.meals,
    meatMeals: input.meatMeals,
    energyLevel: input.energyLevel,
    streamingHours: input.streamingHours,
    streamingQuality: input.streamingQuality,
    emailsSent: input.emailsSent,
    cloudBackupGB: input.cloudBackupGB,
    worstCategory,
    footprintByCategory,
    totalFootprint
  };

  // Check if replacing today's log or adding new day
  let history = [...currentState.history];
  const existingIdx = history.findIndex(h => h.date === todayStr);

  let streakDays = currentState.streakDays;
  let isNewStreak = false;

  if (existingIdx >= 0) {
    // Replace today's existing log
    history[existingIdx] = newEntry;
  } else {
    // Append new log and update streak
    history.push(newEntry);
    
    const lastDate = currentState.lastLoggedDate;
    if (lastDate) {
      const last = new Date(lastDate);
      const current = new Date(todayStr);
      const diffDays = Math.round((current.getTime() - last.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) {
        streakDays += 1;
        isNewStreak = true;
      } else if (diffDays > 1) {
        streakDays = 1; // streak reset
      }
    } else {
      streakDays = 1;
      isNewStreak = true;
    }
  }

  // Derive new stage and green score
  const newTwinStage = deriveTwinStage(history);
  const newGreenScore = calculateGreenScore(history, streakDays, currentState.challengesCompleted.length);
  const activeChallenge = getPersonalizedChallenge(worstCategory, currentState.challengesCompleted);

  const previousBadges = new Set(currentState.badgesUnlocked);

  let newState: AppData = {
    ...currentState,
    history,
    twinStage: newTwinStage,
    greenScore: newGreenScore,
    streakDays,
    lastLoggedDate: todayStr,
    activeChallengeId: activeChallenge.id
  };

  const updatedBadges = updateBadges(newState);
  newState.badgesUnlocked = updatedBadges;

  const newlyUnlockedBadges = updatedBadges.filter(b => !previousBadges.has(b));

  saveAppData(newState);

  return {
    updatedState: newState,
    newEntry,
    isNewStreak,
    newlyUnlockedBadges
  };
}

/**
 * Main action: Complete current personalized challenge
 */
export function completeChallengeAction(currentState: AppData, challengeId: string): AppData {
  if (currentState.challengesCompleted.includes(challengeId)) {
    return currentState;
  }

  const challengesCompleted = [...currentState.challengesCompleted, challengeId];
  
  // Challenge completion gives +5 score boost and helps twin stage
  const newScore = Math.min(100, currentState.greenScore + 5);

  const previousBadges = new Set(currentState.badgesUnlocked);

  const latestWorstCat = currentState.history[currentState.history.length - 1]?.worstCategory || 'digital';
  const newActiveChallenge = getPersonalizedChallenge(latestWorstCat, challengesCompleted);

  let updatedState: AppData = {
    ...currentState,
    challengesCompleted,
    greenScore: newScore,
    activeChallengeId: newActiveChallenge.id
  };

  updatedState.badgesUnlocked = updateBadges(updatedState);
  saveAppData(updatedState);

  return updatedState;
}
