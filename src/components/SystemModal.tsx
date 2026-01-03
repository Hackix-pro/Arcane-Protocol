import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'danger' | 'success';
}

export const SystemModal: React.FC<SystemModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info'
}) => {
  const borderColor = {
    info: 'border-primary',
    danger: 'border-destructive',
    success: 'border-green-500',
  }[type];

  const glowColor = {
    info: 'shadow-[0_0_30px_hsl(190_100%_50%/0.3)]',
    danger: 'shadow-[0_0_30px_hsl(0_100%_50%/0.3)]',
    success: 'shadow-[0_0_30px_hsl(150_100%_50%/0.3)]',
  }[type];

  const textColor = {
    info: 'text-primary',
    danger: 'text-destructive',
    success: 'text-green-400',
  }[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md system-panel ${borderColor} ${glowColor} p-6`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className={`inline-block px-4 py-2 border ${borderColor} rounded-sm mb-4`}
              >
                <span className={`font-display text-lg ${textColor} glow-text-subtle tracking-wider`}>
                  {title}
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-foreground font-display tracking-wide"
              >
                {message}
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={onClose}
                className={`mt-6 system-button ${type === 'danger' ? 'system-button-danger' : ''}`}
              >
                ACKNOWLEDGED
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
