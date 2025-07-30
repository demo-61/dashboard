import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

interface LoginPageProps {
  onLogin: () => void;
}

interface ApiResponse {
  access_token: string;
  token_type: string;
  // Add other response fields if needed
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('https://admin.cvaluepro.com/dashboard/token', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t('invalidCredentials'));
      }

      const data: ApiResponse = await response.json();
      
      // Store the access token in localStorage
      localStorage.setItem('access_token', data.access_token);
      
      // Call the onLogin callback
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const fontFamilyClass = language === "ar" ? "font-riwaya" : "font-hagrid";

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${fontFamilyClass} ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-md w-full mx-4">
        {/* Language and Theme Toggles */}
        <div className="flex justify-between my-6">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <Lock className="w-8 h-8 text-gray-800 dark:text-gray-200" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('adminLogin')}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t('resumeEnhancerDashboard')}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full ${language === 'ar' ? 'pr-10 pl-3' : 'pl-10 pr-3'} py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="example@admin.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full ${language === 'ar' ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder={t('enterPassword')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${language === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 dark:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t('signingIn')}
                </div>
              ) : (
                t('signIn')
              )}
            </button>
          </form>

         
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 