import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
      title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Languages size={16} className="mr-2" />
      <span className="text-sm font-medium">
        {language === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
};

export default LanguageToggle;