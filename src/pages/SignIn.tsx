import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Zap, AlertTriangle } from 'lucide-react';
import { validateCredentials } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier.trim() || !formData.password) {
      setError('ALL FIELDS REQUIRED');
      return;
    }

    setIsLoading(true);

    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = validateCredentials(formData.identifier, formData.password);
    
    if (user) {
      login(user);
      navigate('/dashboard');
    } else {
      setError('INVALID CREDENTIALS');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 scanline">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Zap className="w-10 h-10 text-primary glow-text" />
            <h1 className="font-display text-3xl text-primary glow-text tracking-wider">
              ARCANE PROTOCOL
            </h1>
          </div>
          <p className="text-muted-foreground tracking-wide">
            AUTHENTICATE TO CONTINUE
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="system-panel p-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-xl text-center text-foreground tracking-wider mb-6">
            SYSTEM ACCESS
          </h2>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex items-center gap-3 p-4 border border-destructive/50 bg-destructive/10 rounded-sm"
            >
              <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
              <span className="text-destructive font-display tracking-wider">
                {error}
              </span>
            </motion.div>
          )}

          {/* Email/Username */}
          <div className="space-y-2">
            <label className="block text-sm text-muted-foreground tracking-wider">
              EMAIL / USERNAME
            </label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className="system-input w-full"
              placeholder="Enter email or username..."
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm text-muted-foreground tracking-wider">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="system-input w-full pr-12"
                placeholder="Enter password..."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 bg-background border-primary/50 rounded-sm accent-primary"
            />
            <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
              REMEMBER SESSION
            </label>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="system-button w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Zap size={20} />
              </motion.div>
            ) : (
              <>
                <LogIn size={18} />
                ACCESS SYSTEM
              </>
            )}
          </motion.button>

          <p className="text-center text-muted-foreground text-sm">
            NEW OPERATIVE?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              CREATE ACCOUNT
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default SignIn;
