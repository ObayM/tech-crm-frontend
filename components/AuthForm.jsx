"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      let response;
      if (isSignUp) {
        response = await signUp(email, password);
        if (!response.error && response.data?.user) {
          setMessage('Sign up successful! Check your email for confirmation if enabled.');
          setIsAlertOpen(true);
        }
      } else {
        response = await signIn(email, password);
        // Sign in success is handled by onAuthStateChange in AuthProvider
      }

      if (response.error) {
        throw response.error;
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}.`);
      setIsAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {isSignUp ? 'Create an Account' : 'Welcome Back'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="you@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder={isSignUp ? "Create a password (min. 6 characters)" : "Enter your password"}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-xl py-3 px-4 font-medium text-white transition ${
            loading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            isSignUp ? 'Create Account' : 'Sign In'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
        >
          {isSignUp 
            ? 'Already have an account? Sign In' 
            : 'Need an account? Create one'}
        </button>
      </div>

      {/* Success/Error Alert Dialog */}
      <Transition appear show={isAlertOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsAlertOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-start">
                    {message ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                      <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
                    )}
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {message ? 'Success' : 'Error'}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          {message || error}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsAlertOpen(false)}
                    >
                      Got it
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}