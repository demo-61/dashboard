import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
      title={theme === 'light' ? t('switchToDark') : t('switchToLight')}
    >
      {theme === 'light' ? (
        <Moon size={16} className="mr-2" />
      ) : (
        <Sun size={16} className="mr-2" />
      )}
      <span className="text-sm font-medium">
        {theme === 'light' ? t('dark') : t('light')}
      </span>
    </button>
  );
};

export default ThemeToggle;