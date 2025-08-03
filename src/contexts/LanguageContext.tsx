import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    // Login Page
    adminLogin: 'تسجيل دخول المدير',
    resumeEnhancerDashboard: 'لوحة تحكم محسن السيرة الذاتية',
    'Resumes Not Purchased': 'السير الذاتية غير المشتراة',
    'Incomplete Payments': 'المدفوعات غير المكتملة',
    emailAddress: 'عنوان البريد الإلكتروني',
    password: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    signingIn: 'جاري تسجيل الدخول...',
    invalidCredentials: 'بريد إلكتروني أو كلمة مرور غير صحيحة',
    demoCredentials: 'بيانات التجربة:',
    email: 'البريد الإلكتروني',
    enterPassword: 'أدخل كلمة المرور',
    
    // Dashboard
    dashboardTitle: 'لوحة تحكم محسن السيرة الذاتية',
    dashboardSubtitle: 'راقب أداء منصة معالجة السيرة الذاتية',
    logout: 'تسجيل الخروج',
    
    // Metrics
    activeUsers: 'المستخدمون النشطون',
    totalSales: 'إجمالي المبيعات',
    totalTax: 'إجمالي الضرائب',
    processedResumes: 'السير الذاتية المعالجة',
    successRate: 'معدل النجاح',
    avgProcessingTime: 'متوسط وقت المعالجة',
    
    // Descriptions
    currentlyActiveUsers: 'المستخدمون النشطون حالياً',
    revenueThisMonth: 'الإيرادات هذا الشهر',
    taxCollectedThisMonth: 'الضرائب المحصلة هذا الشهر',
    totalResumesProcessed: 'إجمالي السير الذاتية المعالجة',
    processingSuccessRate: 'معدل نجاح المعالجة',
    averageTimePerResume: 'متوسط الوقت لكل سيرة ذاتية',
    
    // Chart
    weeklyResumeProcessing: 'معالجة السير الذاتية الأسبوعية',
    dailyResumeProcessingVolume: 'حجم معالجة السير الذاتية اليومية',
    resumes: 'سيرة ذاتية',
    
    // Days
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
    saturday: 'السبت',
    sunday: 'الأحد',
    
    // System Status
    systemStatus: 'حالة النظام',
    processingEngine: 'محرك المعالجة',
    database: 'قاعدة البيانات',
    apiServices: 'خدمات API',
    operational: 'يعمل',
    healthy: 'سليم',
    
    // Theme Toggle
    dark: 'داكن',
    light: 'فاتح',
    switchToDark: 'التبديل إلى الوضع الداكن',
    switchToLight: 'التبديل إلى الوضع الفاتح',
    
    // Common UI
    back: 'رجوع',
    upload: 'رفع',
    cancel: 'إلغاء',
    download: 'تحميل',
    preview: 'معاينة',
    processing: 'جاري المعالجة...',
    pleaseWait: 'يرجى الانتظار',
    refreshing: 'جاري التحديث',
    retry: 'إعادة المحاولة',
    error: 'خطأ',
    success: 'نجح',
    
    // File Upload
    dragDropFile: 'اسحب وأفلت ملف PDF هنا',
    clickToUpload: 'انقر للرفع',
    orDragDrop: 'أو اسحب وأفلت',
    pdfFilesOnly: 'ملفات PDF فقط (حد أقصى 10 ميجابايت)',
    fileSelected: 'تم اختيار الملف',
    removeFile: 'إزالة الملف',
    uploadFailed: 'فشل في الرفع. يرجى المحاولة مرة أخرى.',
    
    // Forms
    companyName: 'اسم الشركة',
    companyLocation: 'موقع الشركة',
    jobTitle: 'المسمى الوظيفي',
    jobDescription: 'الوصف الوظيفي',
    enterCompanyName: 'أدخل اسم الشركة',
    enterCompanyLocation: 'أدخل موقع الشركة',
    enterJobTitle: 'أدخل المسمى الوظيفي',
    enterJobDescription: 'أدخل الوصف الوظيفي (50 حرف على الأقل)',
    
    // Navigation
    cvEnhancement: 'تحسين السيرة الذاتية',
    coverLetter: 'خطاب التغطية',
    linkedinOptimization: 'تحسين لينكد إن',
  },
  en: {
    // Login Page
    // adminLogin: 'Admin Login',
     adminLogin: ' Login',
    resumeEnhancerDashboard: 'Resume Enhancer Dashboard',
    'Resumes Not Purchased': 'Resumes Not Purchased',
    'Incomplete Payments': 'Incomplete Payments',
        // resumeEnhancerDashboard: ' Dashboard',
    emailAddress: 'Email Address',
    password: 'Password',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    invalidCredentials: 'Invalid email or password',
    demoCredentials: 'Demo Credentials:',
    email: 'Email',
    enterPassword: 'Enter your password',
    
    // Dashboard
    dashboardTitle: 'Resume Enhancer Dashboard',
    dashboardSubtitle: 'Monitor your resume processing platform performance',
    logout: 'Logout',
    
    // Metrics
    activeUsers: 'Active Users',
    totalSales: 'Total Sales',
    totalTax: 'Total Tax',
    processedResumes: 'Processed Resumes',
    successRate: 'Success Rate',
    avgProcessingTime: 'Avg. Processing Time',
    
    // Descriptions
    currentlyActiveUsers: 'Currently active users',
    revenueThisMonth: 'Revenue this month',
    taxCollectedThisMonth: 'Tax collected this month',
    totalResumesProcessed: 'Total resumes processed',
    processingSuccessRate: 'Processing success rate',
    averageTimePerResume: 'Average time per resume',
    
    // Chart
    weeklyResumeProcessing: 'Weekly Resume Processing',
    dailyResumeProcessingVolume: 'Daily resume processing volume',
    resumes: 'resumes',
    
    // Days
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
    
    // System Status
    systemStatus: 'System Status',
    processingEngine: 'Processing Engine',
    database: 'Database',
    apiServices: 'API Services',
    operational: 'Operational',
    healthy: 'Healthy',
    
    // Theme Toggle
    dark: 'Dark',
    light: 'Light',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    
    // Common UI
    back: 'Back',
    upload: 'Upload',
    cancel: 'Cancel',
    download: 'Download',
    preview: 'Preview',
    processing: 'Processing...',
    pleaseWait: 'Please wait',
    refreshing: 'Refreshing',
    retry: 'Retry',
    error: 'Error',
    success: 'Success',
    
    // File Upload
    dragDropFile: 'Drag and drop a PDF file here',
    clickToUpload: 'Click to upload',
    orDragDrop: 'or drag and drop',
    pdfFilesOnly: 'PDF files only (max 10MB)',
    fileSelected: 'File selected',
    removeFile: 'Remove file',
    uploadFailed: 'Failed to upload. Please try again.',
    
    // Forms
    companyName: 'Company Name',
    companyLocation: 'Company Location',
    jobTitle: 'Job Title',
    jobDescription: 'Job Description',
    enterCompanyName: 'Enter company name',
    enterCompanyLocation: 'Enter company location',
    enterJobTitle: 'Enter job title',
    enterJobDescription: 'Enter job description (minimum 50 characters)',
    
    // Navigation
    cvEnhancement: 'CV Enhancement',
    coverLetter: 'Cover Letter',
    linkedinOptimization: 'LinkedIn Optimization',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};