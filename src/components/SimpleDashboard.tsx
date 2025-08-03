import React, { useEffect, useState } from 'react';
import { Users, DollarSign, FileText, Calculator, TrendingUp, CheckCircle, Clock, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { getSalesData, getSalesTax, getProcessedResumes, getAvgProcessingTime, getFailedResume, getWeeklyResume } from '../api'
import { RxCrossCircled } from "react-icons/rx";
import { IoReload } from "react-icons/io5";
import Buttons from './Buttons';
interface SimpleDashboardProps {
  onLogout: () => void;
}

const SimpleDashboard: React.FC<SimpleDashboardProps> = ({ onLogout }) => {
  const { language, t } = useLanguage();
  interface SaleData {
    data?: {
      total_sales_this_month?: number;
    };
  }
  interface SaleTax {
    data?: {
      monthly_tax_total?: number;
    };
  }
  interface ProcessedResumes {
    data?: {
      total_processed_resumes?: number;
    };
  }
  interface FailedResume {
    data?: {
      total_failed_resumes?: number;
    };
  }
  interface AvgProcessingResume {
    data?: {
      average_processing_time_seconds?: number;
    };
  }
  const [saleData, setSaleData] = useState<SaleData | null>(null);
  const [saleTax, setSaleTax] = useState<SaleTax | null>(null);
  const [processedresumes, setProcessedResumes] = useState<ProcessedResumes | null>(null);
  const [avgprocessingresume, setAvgProcessingResume] = useState<AvgProcessingResume | null>(null);
  const [failedresume, setFailedResume] = useState<FailedResume | null>(null);
  interface WeeklyResumeItem {
    day_of_week?: string;
    day?: string;
    total_resumes?: number;
    resumes?: number;
  }
  interface WeeklyResumeData {
    weekly_resume_processing: WeeklyResumeItem[];
  }
  const [weeklyresume, setWeeklyResume] = useState<{ data?: WeeklyResumeData } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);



  const fetchSalesData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found in localStorage');
      return;
    }
    try {
      const response = await getSalesData(token);
      setSaleData(response);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  }

  useEffect(() => {
    fetchSalesData()
  }, [])


  const fetctSaleTax = async () => {
  const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found in localStorage');
      return;
    }
    try {
      const response = await getSalesTax (token);
      setSaleTax(response)
      
    } catch (error) {
      console.error('Error fetching sales Tax:', error);
    }
  }
  useEffect(() => {
fetctSaleTax()
  },[])

const fetchProcessedResumes = async() => {
  const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found in localStorage');
      return;
    }
    try {
      const response = await getProcessedResumes (token)
      setProcessedResumes (response)
    } catch (error) {
            console.error('Error fetching Processed Resumes:', error);
    }
}
useEffect(() => {
  fetchProcessedResumes()
}, [])

const fetchavgprocessingresume = async () => {
 const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found in localStorage');
      return;
    }
    try {
      const response = await getAvgProcessingTime(token)
      setAvgProcessingResume(response)
    } catch (error) {
       console.error('Error fetching Avg Processing Time:', error);
    }
}

useEffect(() => {
fetchavgprocessingresume()
},[])

const fetchFailedResume = async () => {
   const token = localStorage.getItem('access_token');
  if (!token) {
      console.error('No access token found in localStorage');
      return;
    }
  try {
    const response = await getFailedResume(token)
    setFailedResume(response)
  } catch (error) {
     console.error('Error fetching Failed Resume:', error);
  }
}
useEffect(() => {
  fetchFailedResume()
},[])

const fetchWeeklyResume = async () => {
   const token = localStorage.getItem('access_token');
  if (!token) {
      console.error('No access token found in localStorage');
      return;
    }
try {
  const response = await getWeeklyResume(token) 
 setWeeklyResume(response)
} catch (error) {
  console.error('Error fetching Weekly Resume :', error);
}
}
useEffect(() => {
fetchWeeklyResume()
},[])

  const getColorClasses = (color: string) => {
    return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600';
  };

  // Use weeklyresume data if available, else fallback to static chartData
  const chartData: WeeklyResumeItem[] = weeklyresume?.data?.weekly_resume_processing || [
    { day_of_week: t('monday'), resumes: 180 },
    { day_of_week: t('tuesday'), resumes: 160 },
    { day_of_week: t('wednesday'), resumes: 220 },
    { day_of_week: t('thursday'), resumes: 195 },
    { day_of_week: t('friday'), resumes: 280 },
    { day_of_week: t('saturday'), resumes: 350 },
    { day_of_week: t('sunday'), resumes: 290 }
  ];
  const maxResumes = chartData.length > 0 ? Math.max(...chartData.map((d: WeeklyResumeItem) => d.resumes ?? d.total_resumes ?? 0)) : 0;

  const fontFamilyClass = language === "ar" ? "font-riwaya" : "font-hagrid";

  return (
    <>
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors ${fontFamilyClass} ${language === 'ar' ? 'ltr' : 'ltr'} relative`}>
      {isRefreshing && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-50 backdrop-blur-[2px] transition-all duration-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 min-w-[200px] transform transition-all duration-500 scale-100 opacity-100">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700 animate-[spin_3s_linear_infinite]">
                  <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 dark:border-blue-400 animate-[spin_1.5s_cubic-bezier(0.5,0,0.5,1)_infinite]"></div>
                </div>
                <IoReload className="absolute inset-0 m-auto text-2xl text-gray-600 dark:text-gray-300" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-gray-900 dark:text-white font-medium">{t('refreshing') || 'Refreshing Dashboard'}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('pleaseWait') || 'Please wait while we update your data'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('dashboardTitle')}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t('dashboardSubtitle')}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex  items-center space-x-4">
             <button
              onClick={async () => {
                setIsRefreshing(true);
                try {
                  await Promise.all([
                    fetchSalesData(),
                    fetctSaleTax(),
                    fetchProcessedResumes(),
                    fetchavgprocessingresume(),
                    fetchFailedResume(),
                    fetchWeeklyResume()
                  ]);
                } finally {
                  setIsRefreshing(false);
                }
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border rounded-xl"
              disabled={isRefreshing}
            >
              <IoReload className={`text-black dark:text-white ${isRefreshing ? 'animate-spin' : ''}`}/>
            </button>
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
          {/* Manually render each metric card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl border ${getColorClasses('gray')}`}> 
                <Users size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2,847</h3>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('activeUsers')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('currentlyActiveUsers')}</p>
            </div>
          </div>
          

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl border ${getColorClasses('gray')}`}> 
                <DollarSign size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{saleData?.data?.total_sales_this_month}</h3>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('totalSales')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('revenueThisMonth')}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl border ${getColorClasses('gray')}`}> 
                <Calculator size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{saleTax?.data?.monthly_tax_total}</h3>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('totalTax')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('taxCollectedThisMonth')}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl border ${getColorClasses('gray')}`}> 
                <FileText size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{processedresumes?.data?.total_processed_resumes}</h3>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('processedResumes')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('totalResumesProcessed')}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl border ${getColorClasses('gray')}`}> 
                <RxCrossCircled  size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{failedresume?.data?.total_failed_resumes}</h3>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('Resumes Not Purchased')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('Incomplete Payments')}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl border ${getColorClasses('gray')}`}> 
                <Clock size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{avgprocessingresume?.data?.average_processing_time_seconds}</h3>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('avgProcessingTime')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('averageTimePerResume')}</p>
            </div>
          </div>
        </div>

        {/* Weekly Resume Processing Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-300 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('weeklyResumeProcessing')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dailyResumeProcessingVolume')}</p>
          </div>

          <div className="space-y-4">
            {chartData.map((item: WeeklyResumeItem, index: number) => {
              // Support both API and fallback data
              const day = item.day_of_week || item.day;
              const resumes = item.total_resumes ?? item.resumes ?? 0;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{day}</span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">{resumes} {t('resumes')}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 bg-gray-800 dark:bg-gray-400 transition-all duration-700 ease-out rounded-full"
                      style={{ width: `${maxResumes ? (resumes / maxResumes) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
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
    <Buttons />
    </>
  );
};

export default SimpleDashboard;