import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Lock, 
  Dumbbell, 
  Heart, 
  Wind,
  Terminal,
  ShieldAlert,
  Camera,
  AlertTriangle,
  X
} from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';

const Forge: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleInteraction = () => {
    setShowModal(true);
  };

  const trainingTracks = [
    { 
      id: 'strength', 
      name: 'STRENGTH PROTOCOL', 
      icon: Dumbbell, 
      status: 'LOCKED',
      description: 'SYSTEM CONTROLLED',
      color: 'text-destructive'
    },
    { 
      id: 'endurance', 
      name: 'ENDURANCE PROTOCOL', 
      icon: Heart, 
      status: 'LOCKED',
      description: 'SYSTEM CONTROLLED',
      color: 'text-orange-500'
    },
    { 
      id: 'mobility', 
      name: 'MOBILITY PROTOCOL', 
      icon: Wind, 
      status: 'LOCKED',
      description: 'SYSTEM CONTROLLED',
      color: 'text-purple-500'
    },
  ];

  const exercises = [
    { name: 'PUSH-UPS', reps: '×10', status: 'INACTIVE' },
    { name: 'SQUATS', reps: '×15', status: 'INACTIVE' },
    { name: 'PLANK', reps: '×30s', status: 'INACTIVE' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Flame className="w-8 h-8 text-destructive animate-pulse" />
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-foreground tracking-wider">
              THE FORGE
            </h1>
            <p className="text-destructive glow-text-subtle">PHYSICAL TRAINING SUBSYSTEM</p>
          </div>
        </motion.div>

        {/* System Status Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="system-panel forge-panel p-6 border-destructive/30"
        >
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive animate-pulse" />
            <span className="font-display text-lg text-destructive tracking-wider">
              SUBSYSTEM STATUS: OFFLINE
            </span>
          </div>
          <p className="text-muted-foreground">
            The Forge physical training module is currently in development. 
            All features are UI previews only.
          </p>
        </motion.div>

        {/* Training Tracks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-display text-xl text-foreground tracking-wider mb-4">
            TRAINING TRACKS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trainingTracks.map((track, index) => (
              <motion.button
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                onClick={handleInteraction}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="system-panel forge-panel p-6 text-left border-destructive/20 hover:border-destructive/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <track.icon className={`w-6 h-6 ${track.color}`} />
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">{track.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-destructive border border-destructive/30 px-2 py-1 rounded-sm">
                    {track.status}
                  </span>
                  <span className="text-xs text-muted-foreground">{track.description}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Forge Console */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleInteraction}
          className="system-panel forge-panel p-6 border-destructive/20 cursor-pointer hover:border-destructive/50 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-5 h-5 text-destructive" />
            <h2 className="font-display text-xl text-foreground tracking-wider">
              FORGE CONSOLE
            </h2>
          </div>
          <div className="bg-background/50 p-4 rounded-sm font-mono text-sm space-y-2 border border-destructive/10">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">FORGE STATUS:</span>
              <span className="text-destructive animate-pulse">OFFLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">PHYSICAL INPUT:</span>
              <span className="text-destructive">NOT DETECTED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">CAMERA VERIFICATION:</span>
              <span className="text-destructive">DISABLED</span>
            </div>
            <div className="mt-4 pt-4 border-t border-destructive/10">
              <span className="text-muted-foreground animate-pulse">
                AWAITING SYSTEM ACTIVATION...
              </span>
            </div>
          </div>
        </motion.div>

        {/* Exercise Command List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-display text-xl text-foreground tracking-wider mb-4">
            EXERCISE COMMANDS
          </h2>
          <div className="space-y-2">
            {exercises.map((exercise, index) => (
              <motion.button
                key={exercise.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                onClick={handleInteraction}
                className="w-full system-panel forge-panel p-4 border-destructive/20 hover:border-destructive/50 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Dumbbell className="w-5 h-5 text-destructive" />
                  <span className="font-display text-foreground">{exercise.name}</span>
                  <span className="text-muted-foreground">{exercise.reps}</span>
                </div>
                <span className="text-xs text-destructive border border-destructive/30 px-2 py-1 rounded-sm">
                  {exercise.status}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Anti-Fraud Verification Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={handleInteraction}
          className="system-panel forge-panel p-6 border-destructive/20 cursor-pointer hover:border-destructive/50 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-5 h-5 text-destructive" />
            <h2 className="font-display text-xl text-foreground tracking-wider">
              ANTI-FRAUD VERIFICATION SYSTEM
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-destructive/20 rounded-sm bg-background/30">
              <Camera className="w-8 h-8 text-destructive mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">CAMERA VERIFICATION</p>
              <p className="text-destructive text-xs mt-1">OFFLINE</p>
            </div>
            <div className="p-4 border border-destructive/20 rounded-sm bg-background/30">
              <ShieldAlert className="w-8 h-8 text-destructive mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">INTEGRITY CHECK</p>
              <p className="text-destructive text-xs mt-1">OFFLINE</p>
            </div>
            <div className="p-4 border border-destructive/20 rounded-sm bg-background/30">
              <AlertTriangle className="w-8 h-8 text-destructive mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">FRAUD DETECTION</p>
              <p className="text-destructive text-xs mt-1">OFFLINE</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md system-panel border-destructive p-6"
              style={{ boxShadow: '0 0 60px hsl(0 100% 50% / 0.3)' }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-destructive mb-4"
                  style={{ boxShadow: '0 0 30px hsl(0 100% 50% / 0.5)' }}
                >
                  <Lock className="w-8 h-8 text-destructive" />
                </motion.div>

                <h2 className="font-display text-xl text-destructive glow-text-subtle tracking-wider mb-4">
                  SYSTEM NOTICE
                </h2>

                <p className="text-foreground font-display tracking-wide text-lg">
                  THIS SUBSYSTEM WILL BE ACTIVATED IN FUTURE UPDATES
                </p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => setShowModal(false)}
                  className="mt-6 system-button-danger"
                >
                  ACKNOWLEDGED
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default Forge;
