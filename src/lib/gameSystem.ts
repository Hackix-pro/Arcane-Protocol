// Rank System Configuration
export const RANKS = [
  { name: 'Null', minXP: 0, maxXP: 99 },
  { name: 'Awakened', minXP: 100, maxXP: 299 },
  { name: 'Branded', minXP: 300, maxXP: 499 },
  { name: 'Warden', minXP: 500, maxXP: 799 },
  { name: 'Reaper', minXP: 800, maxXP: 1099 },
  { name: 'Harbinger', minXP: 1100, maxXP: 1399 },
  { name: 'Overlord', minXP: 1400, maxXP: 1699 },
  { name: 'Voidborne', minXP: 1700, maxXP: 1999 },
  { name: 'Black Sovereign', minXP: 2000, maxXP: Infinity },
] as const;

export type RankName = typeof RANKS[number]['name'];

export interface Quest {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  xp: number;
  completed: boolean;
  dueDate: string;
  createdAt: string;
  recurring: boolean;
  recurringDays?: number[];
  isDaily?: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  password: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  xpLocked: boolean;
  xpReduced: boolean;
  consecutiveMissedDays: number;
  createdAt: string;
}

export interface SystemMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  timestamp: string;
}

// XP Assignment based on priority
export const getXPForPriority = (priority: 'high' | 'medium' | 'low'): number => {
  switch (priority) {
    case 'high': return 50;
    case 'medium': return 30;
    case 'low': return 10;
    default: return 10;
  }
};

// Auto-determine priority based on task content
export const determinePriority = (title: string, description: string): 'high' | 'medium' | 'low' => {
  const text = `${title} ${description}`.toLowerCase();
  
  const highPriorityKeywords = [
    'urgent', 'critical', 'important', 'deadline', 'asap', 'emergency',
    'must', 'required', 'essential', 'priority', 'exam', 'interview',
    'presentation', 'meeting', 'submit', 'final', 'project', 'workout',
    'exercise', 'training', 'study', 'learn', 'master'
  ];
  
  const lowPriorityKeywords = [
    'optional', 'maybe', 'someday', 'whenever', 'leisure', 'relax',
    'fun', 'entertainment', 'browse', 'watch', 'play', 'chill'
  ];
  
  if (highPriorityKeywords.some(k => text.includes(k))) return 'high';
  if (lowPriorityKeywords.some(k => text.includes(k))) return 'low';
  return 'medium';
};

// Get current rank based on XP
export const getRank = (xp: number): typeof RANKS[number] => {
  return RANKS.find(r => xp >= r.minXP && xp <= r.maxXP) || RANKS[0];
};

// Get next rank
export const getNextRank = (xp: number): typeof RANKS[number] | null => {
  const currentIndex = RANKS.findIndex(r => xp >= r.minXP && xp <= r.maxXP);
  if (currentIndex === RANKS.length - 1) return null;
  return RANKS[currentIndex + 1];
};

// Calculate level from XP (every 100 XP = 1 level)
export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

// Get XP progress within current rank
export const getXPProgress = (xp: number): { current: number; max: number; percentage: number } => {
  const rank = getRank(xp);
  const current = xp - rank.minXP;
  const max = rank.maxXP === Infinity ? 500 : rank.maxXP - rank.minXP + 1;
  const percentage = Math.min((current / max) * 100, 100);
  return { current, max, percentage };
};

// Get rank CSS class
export const getRankClass = (rankName: RankName): string => {
  const classMap: Record<RankName, string> = {
    'Null': 'rank-null',
    'Awakened': 'rank-awakened',
    'Branded': 'rank-branded',
    'Warden': 'rank-warden',
    'Reaper': 'rank-reaper',
    'Harbinger': 'rank-harbinger',
    'Overlord': 'rank-overlord',
    'Voidborne': 'rank-voidborne',
    'Black Sovereign': 'rank-sovereign',
  };
  return classMap[rankName];
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format date
export const formatDate = (date: string | Date): string => {
  return new Date(date).toISOString().split('T')[0];
};

// Check if date is today
export const isToday = (date: string): boolean => {
  return formatDate(date) === formatDate(new Date());
};

// Parse plan text into quests
export const parsePlanIntoQuests = (planText: string): Omit<Quest, 'id' | 'createdAt'>[] => {
  const lines = planText.split('\n').filter(line => line.trim());
  const quests: Omit<Quest, 'id' | 'createdAt'>[] = [];
  
  for (const line of lines) {
    const cleanLine = line.replace(/^[-*•\d.)\s]+/, '').trim();
    if (cleanLine.length < 3) continue;
    
    const priority = determinePriority(cleanLine, '');
    quests.push({
      title: cleanLine,
      description: '',
      priority,
      xp: getXPForPriority(priority),
      completed: false,
      dueDate: formatDate(new Date()),
      recurring: false,
    });
  }
  
  return quests;
};
