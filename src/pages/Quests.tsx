import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Check, 
  Trash2, 
  Sword, 
  Zap, 
  FileText,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/MainLayout';
import { 
  Quest,
  determinePriority, 
  getXPForPriority,
  formatDate,
  generateId,
  parsePlanIntoQuests,
  calculateLevel,
} from '@/lib/gameSystem';
import { 
  getUserQuests, 
  addQuest, 
  updateQuest, 
  deleteQuest,
  addSystemMessage,
} from '@/lib/storage';

const Quests: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPlanInput, setShowPlanInput] = useState(false);
  const [planText, setPlanText] = useState('');
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    dueDate: formatDate(new Date()),
    recurring: false,
  });

  useEffect(() => {
    if (user) {
      loadQuests();
    }
  }, [user?.id]);

  const loadQuests = () => {
    if (!user) return;
    const userQuests = getUserQuests(user.id);
    setQuests(userQuests);
  };

  const handleAddQuest = () => {
    if (!user || !newQuest.title.trim()) return;

    const priority = determinePriority(newQuest.title, newQuest.description);
    const xp = getXPForPriority(priority);

    addQuest(user.id, {
      title: newQuest.title,
      description: newQuest.description,
      priority,
      xp,
      completed: false,
      dueDate: newQuest.dueDate,
      recurring: newQuest.recurring,
    });

    addSystemMessage(user.id, `SYSTEM ASSIGNED +${xp} XP`, 'info');
    
    setNewQuest({
      title: '',
      description: '',
      dueDate: formatDate(new Date()),
      recurring: false,
    });
    setShowAddForm(false);
    loadQuests();
  };

  const handleParsePlan = () => {
    if (!user || !planText.trim()) return;

    const parsedQuests = parsePlanIntoQuests(planText);
    
    parsedQuests.forEach(quest => {
      addQuest(user.id, quest);
      addSystemMessage(user.id, `SYSTEM ASSIGNED +${quest.xp} XP`, 'info');
    });

    setPlanText('');
    setShowPlanInput(false);
    loadQuests();
  };

  const handleCompleteQuest = (quest: Quest) => {
    if (!user || quest.completed) return;

    // Check if XP is locked
    if (user.xpLocked) {
      addSystemMessage(user.id, 'XP GAIN BLOCKED — SYSTEM LOCKED', 'danger');
      updateQuest(user.id, quest.id, { completed: true });
      loadQuests();
      return;
    }

    // Apply XP reduction if active
    const xpGain = user.xpReduced ? Math.floor(quest.xp * 0.5) : quest.xp;
    const newXP = user.xp + xpGain;
    const oldLevel = calculateLevel(user.xp);
    const newLevel = calculateLevel(newXP);

    updateQuest(user.id, quest.id, { completed: true });
    updateUser({ 
      xp: newXP,
      level: newLevel,
      streak: user.streak + (oldLevel !== newLevel ? 0 : 0),
      lastActiveDate: formatDate(new Date()),
    });

    addSystemMessage(user.id, `QUEST COMPLETED +${xpGain} XP`, 'success');
    
    if (newLevel > oldLevel) {
      addSystemMessage(user.id, `LEVEL UP! NOW LEVEL ${newLevel}`, 'success');
    }

    loadQuests();
  };

  const handleDeleteQuest = (questId: string) => {
    if (!user) return;
    deleteQuest(user.id, questId);
    loadQuests();
  };

  if (!user) return null;

  const today = formatDate(new Date());
  const todayQuests = quests.filter(q => q.dueDate === today);
  const upcomingQuests = quests.filter(q => q.dueDate > today);
  const completedQuests = quests.filter(q => q.completed);

  const priorityColors = {
    high: 'border-destructive/50 bg-destructive/5',
    medium: 'border-secondary/50 bg-secondary/5',
    low: 'border-primary/50 bg-primary/5',
  };

  const priorityText = {
    high: 'text-destructive',
    medium: 'text-secondary',
    low: 'text-primary',
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-2xl md:text-3xl text-foreground tracking-wider">
              QUEST LOG
            </h1>
            <p className="text-muted-foreground">Complete quests to gain XP</p>
          </motion.div>

          <div className="flex gap-3">
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowPlanInput(!showPlanInput)}
              className="system-button-secondary flex items-center gap-2"
            >
              <FileText size={18} />
              PARSE PLAN
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowAddForm(!showAddForm)}
              className="system-button flex items-center gap-2"
            >
              <Plus size={18} />
              NEW QUEST
            </motion.button>
          </div>
        </div>

        {/* Plan Input */}
        <AnimatePresence>
          {showPlanInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="system-panel p-6"
            >
              <h3 className="font-display text-lg text-foreground tracking-wider mb-4">
                PARSE PLAN INTO QUESTS
              </h3>
              <textarea
                value={planText}
                onChange={(e) => setPlanText(e.target.value)}
                placeholder="Paste your plan here... Each line will become a quest.&#10;&#10;Example:&#10;- Complete project proposal&#10;- Review documentation&#10;- Submit final report"
                className="system-input w-full h-40 resize-none mb-4"
              />
              <div className="flex gap-3">
                <button onClick={handleParsePlan} className="system-button">
                  PROCESS PLAN
                </button>
                <button 
                  onClick={() => setShowPlanInput(false)} 
                  className="system-button-danger"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Quest Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="system-panel p-6"
            >
              <h3 className="font-display text-lg text-foreground tracking-wider mb-4">
                CREATE NEW QUEST
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground tracking-wider">TITLE</label>
                  <input
                    type="text"
                    value={newQuest.title}
                    onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
                    className="system-input w-full"
                    placeholder="Quest title..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground tracking-wider">DUE DATE</label>
                  <input
                    type="date"
                    value={newQuest.dueDate}
                    onChange={(e) => setNewQuest({ ...newQuest, dueDate: e.target.value })}
                    className="system-input w-full"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <label className="text-sm text-muted-foreground tracking-wider">DESCRIPTION</label>
                <textarea
                  value={newQuest.description}
                  onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                  className="system-input w-full h-20 resize-none"
                  placeholder="Quest description (optional)..."
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={newQuest.recurring}
                  onChange={(e) => setNewQuest({ ...newQuest, recurring: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="recurring" className="text-sm text-muted-foreground">
                  RECURRING QUEST
                </label>
              </div>
              <div className="mt-4 p-3 border border-primary/30 rounded-sm bg-primary/5">
                <p className="text-sm text-muted-foreground">
                  PRIORITY & XP WILL BE ASSIGNED BY SYSTEM
                </p>
                {newQuest.title && (
                  <p className="text-primary mt-2">
                    ESTIMATED: {determinePriority(newQuest.title, newQuest.description).toUpperCase()} PRIORITY 
                    → +{getXPForPriority(determinePriority(newQuest.title, newQuest.description))} XP
                  </p>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleAddQuest} className="system-button">
                  CREATE QUEST
                </button>
                <button 
                  onClick={() => setShowAddForm(false)} 
                  className="system-button-danger"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Today's Quests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-display text-xl text-foreground tracking-wider mb-4 flex items-center gap-2">
            <Sword className="w-5 h-5 text-primary" />
            TODAY'S QUESTS
          </h2>
          
          {todayQuests.length === 0 ? (
            <div className="system-panel p-8 text-center">
              <p className="text-muted-foreground">No quests scheduled for today.</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="system-button mt-4"
              >
                ADD FIRST QUEST
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayQuests.filter(q => !q.completed).map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`quest-card ${priorityColors[quest.priority]}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-display tracking-wider ${priorityText[quest.priority]}`}>
                          {quest.priority.toUpperCase()}
                        </span>
                        <span className="text-primary font-bold">+{quest.xp} XP</span>
                      </div>
                      <h3 className="font-display text-lg text-foreground">{quest.title}</h3>
                      {quest.description && (
                        <p className="text-muted-foreground text-sm mt-1">{quest.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCompleteQuest(quest)}
                        className="p-2 border border-green-500/50 rounded-sm text-green-400 hover:bg-green-500/20"
                      >
                        <Check size={20} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteQuest(quest.id)}
                        className="p-2 border border-destructive/50 rounded-sm text-destructive hover:bg-destructive/20"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upcoming Quests */}
        {upcomingQuests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-xl text-foreground tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              UPCOMING
            </h2>
            <div className="space-y-3">
              {upcomingQuests.map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`quest-card opacity-75 ${priorityColors[quest.priority]}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs text-muted-foreground">{quest.dueDate}</span>
                        <span className={`text-xs font-display tracking-wider ${priorityText[quest.priority]}`}>
                          {quest.priority.toUpperCase()}
                        </span>
                        <span className="text-primary font-bold">+{quest.xp} XP</span>
                      </div>
                      <h3 className="font-display text-lg text-foreground">{quest.title}</h3>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteQuest(quest.id)}
                      className="p-2 border border-destructive/50 rounded-sm text-destructive hover:bg-destructive/20"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Completed Quests */}
        {todayQuests.filter(q => q.completed).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display text-xl text-foreground tracking-wider mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              COMPLETED TODAY
            </h2>
            <div className="space-y-3">
              {todayQuests.filter(q => q.completed).map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="quest-card border-green-500/30 bg-green-500/5"
                >
                  <div className="flex items-center gap-4">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="line-through text-muted-foreground">{quest.title}</span>
                    <span className="text-green-400 text-sm">+{quest.xp} XP</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default Quests;
