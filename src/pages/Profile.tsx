import React from 'react';
import { motion } from 'framer-motion';
import { User, Zap, TrendingUp, Flame, Calendar, Award } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/MainLayout';
import { 
  getRank, 
  getNextRank, 
  getXPProgress, 
  calculateLevel,
  getRankClass,
  RANKS,
} from '@/lib/gameSystem';
import { getUserQuests } from '@/lib/storage';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const rank = getRank(user.xp);
  const nextRank = getNextRank(user.xp);
  const xpProgress = getXPProgress(user.xp);
  const level = calculateLevel(user.xp);
  const quests = getUserQuests(user.id);
  const completedQuests = quests.filter(q => q.completed).length;
  const totalXPEarned = quests.filter(q => q.completed).reduce((sum, q) => sum + q.xp, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl md:text-3xl text-foreground tracking-wider">
            OPERATIVE PROFILE
          </h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="system-panel p-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div 
                className="w-32 h-32 rounded-sm border-2 border-primary flex items-center justify-center bg-primary/10"
                style={{ boxShadow: '0 0 30px hsl(190 100% 50% / 0.3)' }}
              >
                <User className="w-16 h-16 text-primary" />
              </div>
              <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-background border border-primary rounded-sm">
                <span className="font-display text-sm text-primary">LVL {level}</span>
              </div>
            </motion.div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display text-2xl text-foreground mb-2">{user.username}</h2>
              <p className="text-muted-foreground mb-4">{user.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                <span className={`rank-badge text-lg ${getRankClass(rank.name)}`}>
                  {rank.name}
                </span>
                <div className="flex items-center gap-2 text-primary">
                  <Zap size={18} />
                  <span className="font-bold">{user.xp} XP</span>
                </div>
                <div className="flex items-center gap-2 text-orange-500">
                  <Flame size={18} />
                  <span className="font-bold">{user.streak} Day Streak</span>
                </div>
              </div>

              {/* XP Progress */}
              <div className="max-w-md">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">RANK PROGRESS</span>
                  <span className="text-primary">
                    {xpProgress.current} / {xpProgress.max === Infinity ? '∞' : xpProgress.max} XP
                  </span>
                </div>
                <div className="xp-bar h-4">
                  <motion.div
                    className="xp-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                {nextRank && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Next rank: <span className="text-secondary">{nextRank.name}</span> at {nextRank.minXP} XP
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="system-panel p-6 text-center"
          >
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="font-display text-3xl text-primary mb-1">{level}</p>
            <p className="text-sm text-muted-foreground">LEVEL</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="system-panel p-6 text-center"
          >
            <Zap className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="font-display text-3xl text-secondary mb-1">{totalXPEarned}</p>
            <p className="text-sm text-muted-foreground">XP EARNED</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="system-panel p-6 text-center"
          >
            <Award className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="font-display text-3xl text-green-400 mb-1">{completedQuests}</p>
            <p className="text-sm text-muted-foreground">COMPLETED</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="system-panel p-6 text-center"
          >
            <Calendar className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="font-display text-3xl text-orange-400 mb-1">
              {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
            </p>
            <p className="text-sm text-muted-foreground">DAYS ACTIVE</p>
          </motion.div>
        </div>

        {/* Rank Progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="system-panel p-6"
        >
          <h3 className="font-display text-xl text-foreground tracking-wider mb-6">
            RANK PROGRESSION
          </h3>
          <div className="space-y-4">
            {RANKS.map((r, index) => {
              const isCurrentRank = r.name === rank.name;
              const isUnlocked = user.xp >= r.minXP;
              
              return (
                <motion.div
                  key={r.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className={`
                    flex items-center justify-between p-4 border rounded-sm transition-all
                    ${isCurrentRank 
                      ? 'border-primary bg-primary/10' 
                      : isUnlocked 
                        ? 'border-primary/30 bg-primary/5' 
                        : 'border-muted/30 bg-muted/5 opacity-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <span className={`rank-badge ${getRankClass(r.name)}`}>
                      {r.name}
                    </span>
                    {isCurrentRank && (
                      <span className="text-xs text-primary border border-primary/30 px-2 py-1 rounded-sm">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {r.minXP} - {r.maxXP === Infinity ? '∞' : r.maxXP} XP
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* System Status */}
        {(user.xpLocked || user.xpReduced) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="system-panel border-destructive/50 p-6"
          >
            <h3 className="font-display text-lg text-destructive tracking-wider mb-4">
              SYSTEM PENALTIES ACTIVE
            </h3>
            <div className="space-y-2">
              {user.xpLocked && (
                <div className="system-message-danger">
                  XP GAIN LOCKED
                </div>
              )}
              {user.xpReduced && (
                <div className="system-message-danger">
                  XP VALUE REDUCED (50%)
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-4">
                Complete all daily quests to restore system functionality.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default Profile;
