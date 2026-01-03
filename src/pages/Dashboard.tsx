import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, Target, Flame, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/MainLayout';
import { 
  getRank, 
  getNextRank, 
  getXPProgress, 
  calculateLevel,
  getRankClass,
} from '@/lib/gameSystem';
import { 
  getSystemMessages, 
  getUserQuests, 
  checkAndApplyPenalties,
  checkDailyCompletion,
  stabilizeSystem,
  addSystemMessage,
} from '@/lib/storage';
import { formatDate } from '@/lib/gameSystem';

const Dashboard: React.FC = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Check penalties on load
    const penalties = checkAndApplyPenalties(user.id);
    
    if (penalties.streakReset) {
      addSystemMessage(user.id, 'STREAK RESET', 'danger');
    }
    if (penalties.xpLocked) {
      addSystemMessage(user.id, 'XP GAIN LOCKED', 'danger');
    }
    if (penalties.xpReduced) {
      addSystemMessage(user.id, 'XP VALUE REDUCED', 'danger');
    }

    // Check if system should stabilize
    if (checkDailyCompletion(user.id) && (user.xpLocked || user.xpReduced)) {
      stabilizeSystem(user.id);
      refreshUser();
    }

    // Add daily quest message
    const today = formatDate(new Date());
    const todayQuests = getUserQuests(user.id).filter(q => q.dueDate === today);
    if (todayQuests.length === 0) {
      addSystemMessage(user.id, 'DAILY QUEST INITIALIZED', 'info');
    }

    // Load messages
    setMessages(getSystemMessages(user.id));
  }, [user?.id]);

  if (!user) return null;

  const rank = getRank(user.xp);
  const nextRank = getNextRank(user.xp);
  const xpProgress = getXPProgress(user.xp);
  const level = calculateLevel(user.xp);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl md:text-3xl text-foreground tracking-wider mb-2">
            SYSTEM STATUS
          </h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="text-primary">{user.username}</span>
          </p>
        </motion.div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="system-panel p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground text-sm tracking-wider">LEVEL</span>
            </div>
            <p className="font-display text-4xl text-primary glow-text-subtle">{level}</p>
          </motion.div>

          {/* XP */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="system-panel p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-secondary" />
              <span className="text-muted-foreground text-sm tracking-wider">TOTAL XP</span>
            </div>
            <p className="font-display text-4xl text-secondary glow-text-subtle">{user.xp}</p>
          </motion.div>

          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="system-panel p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-muted-foreground text-sm tracking-wider">STREAK</span>
            </div>
            <p className="font-display text-4xl text-orange-500">{user.streak} <span className="text-lg">DAYS</span></p>
          </motion.div>

          {/* Quests Today */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="system-panel p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-green-500" />
              <span className="text-muted-foreground text-sm tracking-wider">TODAY</span>
            </div>
            <p className="font-display text-4xl text-green-400">
              {getUserQuests(user.id).filter(q => q.dueDate === formatDate(new Date()) && q.completed).length}
              <span className="text-lg text-muted-foreground">
                /{getUserQuests(user.id).filter(q => q.dueDate === formatDate(new Date())).length}
              </span>
            </p>
          </motion.div>
        </div>

        {/* Rank & XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="system-panel p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-muted-foreground text-sm tracking-wider">CURRENT RANK</span>
              <div className="flex items-center gap-4 mt-2">
                <span className={`rank-badge text-lg ${getRankClass(rank.name)}`}>
                  {rank.name}
                </span>
                {nextRank && (
                  <span className="text-muted-foreground text-sm">
                    → <span className={getRankClass(nextRank.name).replace('rank-', 'text-').replace('-', '-')}>
                      {nextRank.name}
                    </span> at {nextRank.minXP} XP
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground text-sm tracking-wider">PROGRESS</span>
              <p className="font-display text-xl text-primary mt-1">
                {xpProgress.current} / {xpProgress.max === Infinity ? '∞' : xpProgress.max} XP
              </p>
            </div>
          </div>
          
          <div className="xp-bar">
            <motion.div
              className="xp-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress.percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* System Status */}
        {(user.xpLocked || user.xpReduced) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="system-panel border-destructive/50 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive animate-pulse" />
              <h3 className="font-display text-lg text-destructive tracking-wider">
                SYSTEM ALERT
              </h3>
            </div>
            <div className="space-y-2">
              {user.xpLocked && (
                <div className="system-message-danger">
                  XP GAIN LOCKED — COMPLETE ALL DAILY QUESTS TO RESTORE
                </div>
              )}
              {user.xpReduced && (
                <div className="system-message-danger">
                  XP VALUE REDUCED — CONSECUTIVE MISSED DAYS DETECTED
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* System Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="system-panel p-6"
        >
          <h3 className="font-display text-lg text-foreground tracking-wider mb-4">
            SYSTEM LOG
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <AnimatePresence>
              {messages.length === 0 ? (
                <p className="text-muted-foreground text-sm">No system messages.</p>
              ) : (
                messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      flex items-center gap-3 p-3 border rounded-sm text-sm
                      ${msg.type === 'danger' 
                        ? 'border-destructive/30 bg-destructive/5 text-destructive' 
                        : msg.type === 'success'
                        ? 'border-green-500/30 bg-green-500/5 text-green-400'
                        : 'border-primary/30 bg-primary/5 text-primary'
                      }
                    `}
                  >
                    {msg.type === 'success' ? (
                      <CheckCircle size={16} />
                    ) : msg.type === 'danger' ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <Zap size={16} />
                    )}
                    <span className="font-display tracking-wider">{msg.message}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
