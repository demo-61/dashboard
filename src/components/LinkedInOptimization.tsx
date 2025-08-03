import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface DropzoneAreaProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

const DropzoneArea: React.FC<DropzoneAreaProps> = ({ file, setFile }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        setFile(acceptedFiles[0]);
      }
    }
  });

  return (
    <div 
      {...getRootProps()} 
      className={`cursor-pointer transition-all duration-300 ${
        isDragActive ? 'bg-gray-100 scale-102' : ''
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <svg 
          className={`w-12 h-12 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div className="text-gray-600 text-lg font-medium mb-2">
          {isDragActive ? (
            <p className="text-blue-500">Drop the PDF file here...</p>
          ) : (
            <p>{file ? `Selected: ${file.name}` : 'Drag and drop a PDF file here'}</p>
          )}
        </div>
        <p className="text-gray-500 text-sm">
          {!file && 'or click to select from your computer'}
        </p>
      </div>
    </div>
  );
};

interface LinkedInResponse {
  tag_line: string;
  profile_summary: string;
  email: string;
  phone: string;
}

const LinkedInOptimization: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<LinkedInResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      setError('');
      if (rejectedFiles.length > 0) {
        setError(t('uploadFailed'));
        return;
      }
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    }
  });

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://ai.cvaluepro.com/linkedin/generate-linkedin', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fontFamilyClass = language === "ar" ? "font-riwaya" : "font-hagrid";

  return (
    <div className={`max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 min-h-screen transition-colors ${fontFamilyClass} ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <ToastContainer 
        position="bottom-right" 
        theme={theme}
        toastClassName="dark:bg-gray-800 dark:text-white"
      />
      <button
        onClick={() => navigate(-1)}
        className="mb-6 sm:mb-8 px-4 py-2 bg-black dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
      >
        {language === 'ar' ? '→' : '←'} {t('back')}
      </button>

      <div className="space-y-6 sm:space-y-8">
        {!response && (
          <>
            <div 
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-102' 
                  : error
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px]">
                <svg 
                  className={`w-10 h-10 sm:w-12 sm:h-12 mb-4 ${
                    isDragActive ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <div className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-medium mb-2">
                  {isDragActive ? (
                    <p className="text-blue-500">{t('dragDropFile')}</p>
                  ) : (
                    <p>{file ? `${t('fileSelected')}: ${file.name}` : t('dragDropFile')}</p>
                  )}
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {!file && (
                    <>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">{t('clickToUpload')}</span> {t('orDragDrop')}
                      <br />
                      {t('pdfFilesOnly')}
                    </>
                  )}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            {file && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <svg className="w-8 h-8 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setError('');
                    }}
                    className="ml-4 text-gray-500 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label={t('removeFile')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-md font-medium transition-all duration-300 transform ${
                !file || isLoading 
                  ? 'opacity-50 cursor-not-allowed bg-gray-400 dark:bg-gray-600 text-white' 
                  : 'bg-black dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('processing')}
                </div>
              ) : (
                t('upload')
              )}
            </button>
          </>
        )}

        {response && (
          <div className="space-y-6 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Profile Tag Line</h2>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(response.tag_line);
                    toast.success(t('success'));
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Copy tag line"
                >
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-6 0a2 2 0 00-2 2v1"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{response.tag_line}</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Profile Summary</h2>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(response.profile_summary);
                    toast.success(t('success'));
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Copy profile summary"
                >
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-6 0a2 2 0 00-2 2v1"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{response.profile_summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInOptimization;
