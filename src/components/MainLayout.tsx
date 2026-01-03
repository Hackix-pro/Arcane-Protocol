import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sword, 
  Calendar, 
  Flame, 
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getRank, getRankClass, calculateLevel } from '@/lib/gameSystem';

const navItems = [
  { path: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
  { path: '/quests', label: 'QUESTS', icon: Sword },
  { path: '/calendar', label: 'CALENDAR', icon: Calendar },
  { path: '/forge', label: 'FORGE', icon: Flame },
  { path: '/profile', label: 'PROFILE', icon: User },
];

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const rank = getRank(user.xp);
  const level = calculateLevel(user.xp);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="system-panel border-b border-primary/20 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto relative">
          <div className="flex-1">
            {/* Left side empty for balance */}
          </div>
          <motion.div 
            className="absolute left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-2xl text-primary glow-text-subtle tracking-wider whitespace-nowrap">
              ARCANE PROTOCOL
            </h1>
          </motion.div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <span className="text-muted-foreground text-sm">LVL {level}</span>
              <span className={`rank-badge ${getRankClass(rank.name)}`}>
                {rank.name}
              </span>
              <span className="text-primary font-bold">{user.xp} XP</span>
            </div>
            
            <button
              onClick={logout}
              className="system-button-danger px-4 py-2 flex items-center gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">EXIT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <nav className="hidden md:flex flex-col w-64 system-panel border-r border-primary/20 p-4">
          <div className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300
                      ${isActive 
                        ? 'bg-primary/20 text-primary border border-primary/50' 
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent'
                      }
                    `}
                  >
                    <Icon size={20} className={isActive ? 'text-primary' : ''} />
                    <span className="font-display text-sm tracking-wider">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute right-0 w-1 h-full bg-primary"
                        layoutId="activeIndicator"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* User Stats in Sidebar */}
          <div className="mt-auto pt-6 border-t border-primary/20">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">STREAK</span>
                <span className="text-primary font-bold">{user.streak} DAYS</span>
              </div>
              {user.xpLocked && (
                <div className="system-message-danger text-center text-xs">
                  XP GAIN LOCKED
                </div>
              )}
              {user.xpReduced && (
                <div className="system-message-danger text-center text-xs">
                  XP VALUE REDUCED
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 system-panel border-t border-primary/20 z-50">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-sm transition-all
                    ${isActive ? 'text-primary' : 'text-muted-foreground'}
                  `}
                >
                  <Icon size={20} />
                  <span className="text-xs font-display">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 p-6 pb-24 md:pb-6 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};
