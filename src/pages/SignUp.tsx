import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Zap } from 'lucide-react';
import { createUser, findUserByEmail, findUserByUsername } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'USERNAME REQUIRED';
    } else if (formData.username.length < 3) {
      newErrors.username = 'MINIMUM 3 CHARACTERS';
    } else if (findUserByUsername(formData.username)) {
      newErrors.username = 'USERNAME ALREADY EXISTS';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'EMAIL REQUIRED';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'INVALID EMAIL FORMAT';
    } else if (findUserByEmail(formData.email)) {
      newErrors.email = 'EMAIL ALREADY REGISTERED';
    }

    if (!formData.password) {
      newErrors.password = 'PASSWORD REQUIRED';
    } else if (formData.password.length < 6) {
      newErrors.password = 'MINIMUM 6 CHARACTERS';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'PASSWORDS DO NOT MATCH';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newUser = createUser(formData.username, formData.email, formData.password);
    setSuccess(true);

    setTimeout(() => {
      login(newUser);
      navigate('/dashboard');
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
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
            INITIALIZE NEW OPERATIVE
          </p>
        </motion.div>

        {/* Success State */}
        {success ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="system-panel p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-green-500 flex items-center justify-center"
              style={{ boxShadow: '0 0 30px hsl(150 100% 50% / 0.5)' }}
            >
              <UserPlus className="w-10 h-10 text-green-400" />
            </motion.div>
            <h2 className="font-display text-xl text-green-400 glow-text-subtle mb-2">
              ACCOUNT CREATED
            </h2>
            <p className="text-foreground">WELCOME, OPERATIVE</p>
            <div className="mt-4 system-message-success">
              INITIALIZING SYSTEM...
            </div>
          </motion.div>
        ) : (
          /* Form */
          <motion.form
            onSubmit={handleSubmit}
            className="system-panel p-8 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display text-xl text-center text-foreground tracking-wider mb-6">
              CREATE ACCOUNT
            </h2>

            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm text-muted-foreground tracking-wider">
                USERNAME
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="system-input w-full"
                placeholder="Enter username..."
              />
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-destructive text-sm"
                >
                  {errors.username}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm text-muted-foreground tracking-wider">
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="system-input w-full"
                placeholder="Enter email..."
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-destructive text-sm"
                >
                  {errors.email}
                </motion.p>
              )}
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
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-destructive text-sm"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm text-muted-foreground tracking-wider">
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="system-input w-full pr-12"
                  placeholder="Confirm password..."
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-destructive text-sm"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              className="system-button w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              INITIALIZE ACCOUNT
            </motion.button>

            <p className="text-center text-muted-foreground text-sm">
              ALREADY REGISTERED?{' '}
              <Link to="/signin" className="text-primary hover:underline">
                SIGN IN
              </Link>
            </p>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default SignUp;
