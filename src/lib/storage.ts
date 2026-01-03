import { Quest, UserProfile, SystemMessage, generateId, formatDate, isToday } from './gameSystem';

const STORAGE_KEYS = {
  USERS: 'arcane_users',
  CURRENT_USER: 'arcane_current_user',
  QUESTS: 'arcane_quests',
  MESSAGES: 'arcane_messages',
};

// User Management
export const getUsers = (): UserProfile[] => {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: UserProfile[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const createUser = (username: string, email: string, password: string): UserProfile => {
  const users = getUsers();
  const newUser: UserProfile = {
    id: generateId(),
    username,
    email,
    password,
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: formatDate(new Date()),
    xpLocked: false,
    xpReduced: false,
    consecutiveMissedDays: 0,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const findUserByEmail = (email: string): UserProfile | undefined => {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const findUserByUsername = (username: string): UserProfile | undefined => {
  return getUsers().find(u => u.username.toLowerCase() === username.toLowerCase());
};

export const validateCredentials = (identifier: string, password: string): UserProfile | null => {
  const user = findUserByEmail(identifier) || findUserByUsername(identifier);
  if (user && user.password === password) return user;
  return null;
};

// Session Management
export const getCurrentUser = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: UserProfile | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const updateCurrentUser = (updates: Partial<UserProfile>): UserProfile | null => {
  const current = getCurrentUser();
  if (!current) return null;
  
  const updated = { ...current, ...updates };
  setCurrentUser(updated);
  
  // Also update in users list
  const users = getUsers();
  const index = users.findIndex(u => u.id === current.id);
  if (index !== -1) {
    users[index] = updated;
    saveUsers(users);
  }
  
  return updated;
};

// Quest Management
export const getQuests = (): Quest[] => {
  const data = localStorage.getItem(STORAGE_KEYS.QUESTS);
  return data ? JSON.parse(data) : [];
};

export const saveQuests = (quests: Quest[]): void => {
  localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
};

export const getUserQuests = (userId: string): Quest[] => {
  const allQuests = getQuests();
  const userKey = `arcane_quests_${userId}`;
  const data = localStorage.getItem(userKey);
  return data ? JSON.parse(data) : [];
};

export const saveUserQuests = (userId: string, quests: Quest[]): void => {
  const userKey = `arcane_quests_${userId}`;
  localStorage.setItem(userKey, JSON.stringify(quests));
};

export const addQuest = (userId: string, quest: Omit<Quest, 'id' | 'createdAt'>): Quest => {
  const quests = getUserQuests(userId);
  const newQuest: Quest = {
    ...quest,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  quests.push(newQuest);
  saveUserQuests(userId, quests);
  return newQuest;
};

export const updateQuest = (userId: string, questId: string, updates: Partial<Quest>): Quest | null => {
  const quests = getUserQuests(userId);
  const index = quests.findIndex(q => q.id === questId);
  if (index === -1) return null;
  
  quests[index] = { ...quests[index], ...updates };
  saveUserQuests(userId, quests);
  return quests[index];
};

export const deleteQuest = (userId: string, questId: string): void => {
  const quests = getUserQuests(userId).filter(q => q.id !== questId);
  saveUserQuests(userId, quests);
};

// System Messages
export const getSystemMessages = (userId: string): SystemMessage[] => {
  const key = `arcane_messages_${userId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const addSystemMessage = (userId: string, message: string, type: SystemMessage['type'] = 'info'): SystemMessage => {
  const key = `arcane_messages_${userId}`;
  const messages = getSystemMessages(userId);
  const newMessage: SystemMessage = {
    id: generateId(),
    message,
    type,
    timestamp: new Date().toISOString(),
  };
  
  // Keep only last 20 messages
  const updated = [newMessage, ...messages].slice(0, 20);
  localStorage.setItem(key, JSON.stringify(updated));
  return newMessage;
};

export const clearSystemMessages = (userId: string): void => {
  const key = `arcane_messages_${userId}`;
  localStorage.removeItem(key);
};

// Penalty System
export const checkAndApplyPenalties = (userId: string): { 
  streakReset: boolean;
  xpLocked: boolean;
  xpReduced: boolean;
  stabilized: boolean;
} => {
  const user = getCurrentUser();
  if (!user) return { streakReset: false, xpLocked: false, xpReduced: false, stabilized: false };
  
  const today = formatDate(new Date());
  const lastActive = user.lastActiveDate;
  
  if (lastActive === today) {
    return { streakReset: false, xpLocked: user.xpLocked, xpReduced: user.xpReduced, stabilized: false };
  }
  
  const lastDate = new Date(lastActive);
  const todayDate = new Date(today);
  const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let streakReset = false;
  let xpLocked = user.xpLocked;
  let xpReduced = user.xpReduced;
  
  if (diffDays > 1) {
    // Missed days
    const newConsecutiveMissed = user.consecutiveMissedDays + diffDays - 1;
    
    if (newConsecutiveMissed >= 1) {
      streakReset = true;
      xpLocked = true;
    }
    
    if (newConsecutiveMissed >= 2) {
      xpReduced = true;
    }
    
    updateCurrentUser({
      streak: 0,
      consecutiveMissedDays: newConsecutiveMissed,
      xpLocked,
      xpReduced,
      lastActiveDate: today,
    });
  }
  
  return { streakReset, xpLocked, xpReduced, stabilized: false };
};

export const checkDailyCompletion = (userId: string): boolean => {
  const quests = getUserQuests(userId);
  const today = formatDate(new Date());
  const todayQuests = quests.filter(q => q.dueDate === today);
  
  if (todayQuests.length === 0) return true;
  return todayQuests.every(q => q.completed);
};

export const stabilizeSystem = (userId: string): void => {
  updateCurrentUser({
    xpLocked: false,
    xpReduced: false,
    consecutiveMissedDays: 0,
  });
  addSystemMessage(userId, 'SYSTEM STABILIZED', 'success');
};
