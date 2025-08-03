import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Buttons: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const fontFamilyClass = language === "ar" ? "font-riwaya" : "font-hagrid";

  return (
    <div className={`flex flex-col sm:flex-row gap-4 mb-10 max-w-4xl mx-auto items-center justify-center sm:justify-between p-4 ${fontFamilyClass} ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <button 
        className="w-full sm:w-auto px-6 py-3 bg-black dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
        onClick={() => navigate('/cv-enhancement')}
      >
        {t('cvEnhancement') || 'CV Enhancement'}
      </button>
      <button 
        className="w-full sm:w-auto px-6 py-3 bg-black dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
        onClick={() => navigate('/cover-letter')}
      >
        {t('coverLetter') || 'Cover Letter'}
      </button>
      <button 
        className="w-full sm:w-auto px-6 py-3 bg-black dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
        onClick={() => navigate('/linkedin-optimization')}
      >
        {t('linkedinOptimization') || 'LinkedIn Optimization'}
      </button>
    </div>
  );
};

export default Buttons;
