/**
 * Forgot Password Page
 * Request password reset email
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

import { authAPI } from '../../lib/auth-api';
import { forgotPasswordSchema } from '../../lib/validations/auth';
import type { ForgotPasswordFormData } from '../../lib/validations/auth';

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    await authAPI.forgotPassword(data.email);

    // Always show success to prevent email enumeration
    // (even if the email doesn't exist in the system)
    setSuccess(true);

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphism container */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {!success ? (
            <>
              {/* Logo */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
                >
                  <Mail size={32} className="text-white" />
                </motion.div>

                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Forgot Password?
                </h1>
                <p className="text-gray-600 mt-2">
                  No worries, we'll send you reset instructions
                </p>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={20} className="text-gray-400" />
                    </div>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="you@example.com"
                      className={`
                        w-full pl-12 pr-4 py-3 rounded-xl
                        bg-white/50 backdrop-blur-sm
                        border-2 transition-all
                        ${errors.email
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-purple-500'
                        }
                        focus:outline-none focus:ring-4 focus:ring-purple-500/10
                        placeholder:text-gray-400
                      `}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="
                    w-full py-3.5 px-6 rounded-xl
                    bg-gradient-to-r from-purple-600 to-blue-600
                    text-white font-semibold
                    shadow-lg shadow-purple-500/30
                    hover:shadow-xl hover:shadow-purple-500/40
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                  "
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset link
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Back to login */}
              <div className="mt-6">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="
                      w-full py-3.5 px-6 rounded-xl
                      bg-white/50 backdrop-blur-sm
                      border-2 border-gray-200
                      text-gray-700 font-semibold
                      hover:border-purple-300 hover:bg-purple-50/50
                      transition-all duration-300
                      flex items-center justify-center gap-2
                    "
                  >
                    <ArrowLeft size={18} />
                    Back to login
                  </motion.button>
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg"
                >
                  <CheckCircle size={40} className="text-white" />
                </motion.div>

                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                  Check Your Email
                </h1>

                <p className="text-gray-600 mb-6">
                  If an account exists with that email, we've sent password reset instructions.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Didn't receive the email?</strong>
                    <br />
                    Check your spam folder or try again in a few minutes.
                  </p>
                </div>

                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="
                      w-full py-3.5 px-6 rounded-xl
                      bg-gradient-to-r from-purple-600 to-blue-600
                      text-white font-semibold
                      shadow-lg shadow-purple-500/30
                      hover:shadow-xl hover:shadow-purple-500/40
                      transition-all duration-300
                      flex items-center justify-center gap-2
                    "
                  >
                    Back to login
                    <ArrowRight size={20} />
                  </motion.button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Help text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Need help?{' '}
          <Link to="/support" className="text-purple-600 hover:underline">
            Contact support
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
