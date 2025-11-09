/**
 * Email Verification Notice Page
 * Shown after successful signup
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

const VerifyEmailNoticePage: React.FC = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendMessage(null);

    // TODO: Implement resend verification email endpoint
    // For now, just show a success message
    setTimeout(() => {
      setResendMessage({
        type: 'success',
        text: 'Verification email sent! Check your inbox.',
      });
      setIsResending(false);
    }, 1000);
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
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg"
          >
            <CheckCircle size={40} className="text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            Check Your Email
          </h1>

          <p className="text-gray-600 mb-6">
            We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
          </p>

          {/* Email Icon with Animation */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-purple-100"
          >
            <Mail size={32} className="text-purple-600" />
          </motion.div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Didn't receive the email?</strong>
              <br />
              Check your spam folder or click the button below to resend.
            </p>
          </div>

          {/* Resend Message */}
          {resendMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-3 rounded-xl text-sm ${
                resendMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {resendMessage.text}
            </motion.div>
          )}

          {/* Resend Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleResendEmail}
            disabled={isResending}
            className="
              w-full py-3.5 px-6 rounded-xl mb-4
              bg-gradient-to-r from-purple-600 to-blue-600
              text-white font-semibold
              shadow-lg shadow-purple-500/30
              hover:shadow-xl hover:shadow-purple-500/40
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {isResending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Resend verification email
              </>
            )}
          </motion.button>

          {/* Back to Login */}
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
              Back to login
              <ArrowRight size={18} />
            </motion.button>
          </Link>
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

export default VerifyEmailNoticePage;
