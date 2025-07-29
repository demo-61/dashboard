import React from 'react';
import { Users, DollarSign, FileText, Calculator, TrendingUp, CheckCircle, Clock, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

interface SimpleDashboardProps {
  onLogout: () => void;
}

const SimpleDashboard: React.FC<SimpleDashboardProps> = ({ onLogout }) => {
  const { language, t } = useLanguage();

  const metrics = [
    {
      title: t('activeUsers'),
      value: '2,847',
      icon: Users,
      color: 'gray',
      description: t('currentlyActiveUsers')
    },
    {
      title: t('totalSales'),
      value: '$47,892',

      icon: DollarSign,
      color: 'gray',
      description: t('revenueThisMonth')
    },
    {
      title: t('totalTax'),
      value: '$7,663',

      icon: Calculator,
      color: 'gray',
      description: t('taxCollectedThisMonth')
    },
    {
      title: t('processedResumes'),
      value: '8,394',

      icon: FileText,
      color: 'gray',
      description: t('totalResumesProcessed')
    },
    {
      title: t('successRate'),
      value: '98.7%',

      icon: CheckCircle,
      color: 'gray',
      description: t('processingSuccessRate')
    },
    {
      title: t('avgProcessingTime'),
      value: '2.4 min',

      icon: Clock,
      color: 'gray',
      description: t('averageTimePerResume')
    }
  ];

  const getColorClasses = (color: string) => {
    return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
  };

  const chartData = [
    { day: t('monday'), resumes: 180 },
    { day: t('tuesday'), resumes: 160 },
    { day: t('wednesday'), resumes: 220 },
    { day: t('thursday'), resumes: 195 },
    { day: t('friday'), resumes: 280 },
    { day: t('saturday'), resumes: 350 },
    { day: t('sunday'), resumes: 290 }
  ];

  const maxResumes = Math.max(...chartData.map(d => d.resumes));

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('dashboardTitle')}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t('dashboardSubtitle')}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <LogOut size={16} className={`${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {t('logout')}
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl border ${getColorClasses(metric.color)}`}>
                    <Icon size={24} />
                  </div>

                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</h3>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{metric.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Resume Processing Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('weeklyResumeProcessing')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dailyResumeProcessingVolume')}</p>
          </div>
          
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.day}</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{item.resumes} {t('resumes')}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="h-3 bg-gray-800 dark:bg-gray-400 transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${(item.resumes / maxResumes) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700 p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('systemStatus')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <div className="w-3 h-3 bg-gray-800 dark:bg-gray-400 rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{t('processingEngine')}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t('operational')}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <div className="w-3 h-3 bg-gray-800 dark:bg-gray-400 rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{t('database')}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t('healthy')}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <div className="w-3 h-3 bg-gray-800 dark:bg-gray-400 rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{t('apiServices')}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{t('healthy')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;