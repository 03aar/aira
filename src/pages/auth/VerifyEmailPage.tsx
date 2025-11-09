/**
 * Email Verification Page
 * Handles email verification when user clicks the link
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { authAPI } from '../../lib/auth-api';

type VerificationState = 'verifying' | 'success' | 'error';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<VerificationState>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setState('error');
        setErrorMessage('Verification token is missing');
        return;
      }

      const { data, error } = await authAPI.verifyEmail(token);

      if (data) {
        setState('success');
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setState('error');
        setErrorMessage(error || 'Verification failed. The link may have expired.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

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
          {/* Verifying State */}
          {state === 'verifying' && (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 shadow-lg"
              >
                <Loader2 size={40} className="text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Verifying Your Email
              </h1>

              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {/* Success State */}
          {state === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg"
              >
                <CheckCircle size={40} className="text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Email Verified!
              </h1>

              <p className="text-gray-600 mb-6">
                Your email has been successfully verified. You can now sign in to your account.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-green-800">
                  You'll be redirected to the login page in a few seconds...
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
                  Continue to login
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
            </>
          )}

          {/* Error State */}
          {state === 'error' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-red-400 to-red-500 shadow-lg"
              >
                <XCircle size={40} className="text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                Verification Failed
              </h1>

              <p className="text-gray-600 mb-6">
                {errorMessage}
              </p>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-800">
                  The verification link may have expired or is invalid. Please request a new verification email.
                </p>
              </div>

              <Link to="/verify-email-notice">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    w-full py-3.5 px-6 rounded-xl mb-3
                    bg-gradient-to-r from-purple-600 to-blue-600
                    text-white font-semibold
                    shadow-lg shadow-purple-500/30
                    hover:shadow-xl hover:shadow-purple-500/40
                    transition-all duration-300
                  "
                >
                  Request new verification email
                </motion.button>
              </Link>

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
                  "
                >
                  Back to login
                </motion.button>
              </Link>
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

export default VerifyEmailPage;
