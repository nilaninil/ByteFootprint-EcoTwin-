export type FootprintCategory = 'transport' | 'food' | 'energy' | 'digital';

export type TransportMode = 'car' | 'bus' | 'train' | 'ev' | 'bike_walk';

export type StreamingQuality = '4K' | '1080p' | '720p' | 'audio_only';

export interface CategoryFootprint {
  transport: number;
  food: number;
  energy: number;
  digital: number;
}

export interface LogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  transportKm: number;
  transportMode: TransportMode;
  meals: number;
  meatMeals: number;
  energyLevel: number; // 1: low, 2: medium, 3: high
  streamingHours: number;
  streamingQuality: StreamingQuality;
  emailsSent: number;
  cloudBackupGB: number;
  worstCategory: FootprintCategory;
  footprintByCategory: CategoryFootprint;
  totalFootprint: number; // in kg CO2e
}

export type TwinStage = 1 | 2 | 3 | 4 | 5;

export interface TwinStageInfo {
  stage: TwinStage;
  name: string;
  statusLine: string;
  description: string;
  color: string;
  bgGradient: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: FootprintCategory;
  impactKgSaved: number;
  points: number;
  actionText: string;
  digitalFact?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: FootprintCategory | 'general';
  requirement: string;
  conditionType: 'streak' | 'digital_low' | 'total_logs' | 'stage' | 'challenges' | 'balanced';
  targetValue: number;
}

export interface EcoTip {
  id: string;
  title: string;
  content: string;
  category: FootprintCategory;
  funFact: string;
}

export interface RecyclingItem {
  id: string;
  name: string;
  category: 'electronics' | 'plastics' | 'paper' | 'glass' | 'compost' | 'metal' | 'hazardous';
  binName: string;
  binColor: string;
  instructions: string;
  prepTip: string;
  digitalRelated?: boolean;
}

export interface UserProfile {
  name: string;
  createdAt: string;
  avatarColor?: string;
}

export interface AppData {
  userProfile?: UserProfile;
  history: LogEntry[];
  greenScore: number;
  twinStage: TwinStage;
  streakDays: number;
  badgesUnlocked: string[];
  challengesCompleted: string[];
  activeChallengeDate?: string;
  activeChallengeId?: string;
  lastLoggedDate?: string;
}
