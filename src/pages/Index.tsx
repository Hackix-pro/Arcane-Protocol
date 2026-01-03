import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Sword, Flame, TrendingUp, ChevronRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 scanline">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-3xl"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-4 mb-8"
        >
          <Zap className="w-16 h-16 text-primary glow-text animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-display text-5xl md:text-7xl text-foreground tracking-wider mb-4"
        >
          ARCANE <span className="text-primary glow-text">PROTOCOL</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-muted-foreground mb-12 tracking-wide"
        >
          SELF-LEVELING QUEST SYSTEM
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {[
            { icon: Sword, label: 'QUESTS', desc: 'Complete tasks for XP' },
            { icon: TrendingUp, label: 'RANKS', desc: '9 progression tiers' },
            { icon: Flame, label: 'STREAKS', desc: 'Build momentum' },
          ].map((item, i) => (
            <div key={item.label} className="system-panel p-6">
              <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-display text-lg text-foreground mb-1">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="system-button text-lg px-8 py-4 flex items-center gap-2"
            >
              INITIALIZE <ChevronRight size={20} />
            </motion.button>
          </Link>
          <Link to="/signin">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="system-button-secondary text-lg px-8 py-4"
            >
              ACCESS SYSTEM
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
