import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MainLayout } from '@/components/MainLayout';
import { Quest, formatDate } from '@/lib/gameSystem';
import { getUserQuests } from '@/lib/storage';

const Calendar: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setQuests(getUserQuests(user.id));
    }
  }, [user?.id]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getQuestsForDate = (date: string): Quest[] => {
    return quests.filter(q => q.dueDate === date);
  };

  const getDayStatus = (date: string): 'complete' | 'incomplete' | 'partial' | 'none' => {
    const dayQuests = getQuestsForDate(date);
    if (dayQuests.length === 0) return 'none';
    if (dayQuests.every(q => q.completed)) return 'complete';
    if (dayQuests.some(q => q.completed)) return 'partial';
    return 'incomplete';
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const today = formatDate(new Date());

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDayOfMonth + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
      const dateString = isCurrentMonth
        ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
        : '';
      const status = isCurrentMonth ? getDayStatus(dateString) : 'none';
      const isToday = dateString === today;
      const isSelected = dateString === selectedDate;

      days.push(
        <motion.button
          key={i}
          onClick={() => isCurrentMonth && setSelectedDate(dateString)}
          whileHover={isCurrentMonth ? { scale: 1.05 } : {}}
          whileTap={isCurrentMonth ? { scale: 0.95 } : {}}
          className={`
            relative aspect-square p-2 rounded-sm transition-all duration-200
            ${!isCurrentMonth ? 'opacity-20 cursor-default' : 'cursor-pointer'}
            ${isToday ? 'border-2 border-primary' : 'border border-primary/10'}
            ${isSelected ? 'bg-primary/20 border-primary' : 'hover:bg-primary/10'}
            ${status === 'complete' ? 'bg-green-500/10' : ''}
            ${status === 'incomplete' ? 'bg-destructive/10' : ''}
            ${status === 'partial' ? 'bg-secondary/10' : ''}
          `}
        >
          <span className={`
            font-display text-sm
            ${isToday ? 'text-primary font-bold' : 'text-foreground'}
          `}>
            {isCurrentMonth ? dayNumber : ''}
          </span>
          
          {isCurrentMonth && status !== 'none' && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
              {status === 'complete' && (
                <div className="w-2 h-2 rounded-full bg-green-500" />
              )}
              {status === 'incomplete' && (
                <div className="w-2 h-2 rounded-full bg-destructive" />
              )}
              {status === 'partial' && (
                <div className="w-2 h-2 rounded-full bg-secondary" />
              )}
            </div>
          )}
        </motion.button>
      );
    }

    return days;
  };

  const selectedQuests = selectedDate ? getQuestsForDate(selectedDate) : [];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl md:text-3xl text-foreground tracking-wider">
            MISSION CALENDAR
          </h1>
          <p className="text-muted-foreground">Track your quest schedule</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 system-panel p-6"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateMonth(-1)}
                className="p-2 border border-primary/30 rounded-sm text-primary hover:bg-primary/10"
              >
                <ChevronLeft size={24} />
              </motion.button>
              
              <h2 className="font-display text-xl text-foreground tracking-wider">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigateMonth(1)}
                className="p-2 border border-primary/30 rounded-sm text-primary hover:bg-primary/10"
              >
                <ChevronRight size={24} />
              </motion.button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs text-muted-foreground font-display tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {renderCalendarDays()}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-primary/20">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Complete</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-muted-foreground">Partial</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Incomplete</span>
              </div>
            </div>
          </motion.div>

          {/* Day Detail */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="system-panel p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg text-foreground tracking-wider">
                {selectedDate 
                  ? new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    }).toUpperCase()
                  : 'SELECT A DATE'
                }
              </h3>
            </div>

            {selectedDate && (
              <div className="space-y-3">
                {selectedQuests.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No quests scheduled.</p>
                ) : (
                  selectedQuests.map((quest, index) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        p-3 border rounded-sm
                        ${quest.completed 
                          ? 'border-green-500/30 bg-green-500/5' 
                          : 'border-primary/30 bg-primary/5'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {quest.completed ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-destructive" />
                        )}
                        <span className={quest.completed ? 'text-muted-foreground line-through' : 'text-foreground'}>
                          {quest.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className={`
                          ${quest.priority === 'high' ? 'text-destructive' : ''}
                          ${quest.priority === 'medium' ? 'text-secondary' : ''}
                          ${quest.priority === 'low' ? 'text-primary' : ''}
                        `}>
                          {quest.priority.toUpperCase()}
                        </span>
                        <span className="text-primary">+{quest.xp} XP</span>
                      </div>
                    </motion.div>
                  ))
                )}

                {/* Day Stats */}
                {selectedQuests.length > 0 && (
                  <div className="pt-3 mt-3 border-t border-primary/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">COMPLETED</span>
                      <span className="text-foreground">
                        {selectedQuests.filter(q => q.completed).length} / {selectedQuests.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-muted-foreground">XP EARNED</span>
                      <span className="text-primary">
                        +{selectedQuests.filter(q => q.completed).reduce((sum, q) => sum + q.xp, 0)} XP
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!selectedDate && (
              <p className="text-muted-foreground text-sm text-center py-8">
                Click on a date to view quest details.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
