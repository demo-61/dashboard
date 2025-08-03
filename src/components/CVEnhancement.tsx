import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

// Mobile detection utility
const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth < 768;
};

interface APIResponse {
  session_id: string;
  classic_resume_url: string;
  modern_resume_url: string;
  email: string;
  phone: string;
}

const CVEnhancement: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pdfUrls, setPdfUrls] = useState<{ classic: string; modern: string } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState<string>('');

  // Set mobile state on mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

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

  useEffect(() => {
    // Cleanup function when component unmounts
    return () => {
      // Only delete session if modal is still open when component unmounts
      if (showModal && sessionId) {
        deleteSession(sessionId);
        if (pdfUrls) {
          URL.revokeObjectURL(pdfUrls.classic);
          URL.revokeObjectURL(pdfUrls.modern);
        }
      }
    };
  }, [showModal, sessionId, pdfUrls]); // Dependencies updated to reflect the values we're using

  const deleteSession = async (sid: string) => {
    try {
      await fetch(`https://ai.cvaluepro.com/resume/delete-session/?session_id=${sid}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const downloadPDF = async (sessionId: string, filename: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://ai.cvaluepro.com/resume/download?session_id=${sessionId}&filename=${filename}`,
        {
          headers: {
            'Accept': 'application/pdf',
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      // Check if the response is actually a PDF
      if (!response.headers.get('content-type')?.includes('application/pdf')) {
        throw new Error('Server did not return a PDF');
      }

      // Create a blob from the PDF stream with the correct type
      const blob = new Blob([await response.arrayBuffer()], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      return url;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('https://ai.cvaluepro.com/resume/upload-resume', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const data: APIResponse = await uploadResponse.json();
      setSessionId(data.session_id);

      setIsDownloading(true);
      
      // Download both PDFs
      try {
        const [classicUrl, modernUrl] = await Promise.all([
          downloadPDF(data.session_id, data.classic_resume_url),
          downloadPDF(data.session_id, data.modern_resume_url)
        ]);

        setPdfUrls({ classic: classicUrl, modern: modernUrl });
        setShowModal(true);
      } catch (downloadError) {
        console.error('Error downloading PDFs:', downloadError);
        // Clean up the session if download fails
        deleteSession(data.session_id);
        setSessionId(null);
      } finally {
        setIsDownloading(false);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = async () => {
    setShowModal(false);
    
    // Clean up URLs
    if (pdfUrls) {
      URL.revokeObjectURL(pdfUrls.classic);
      URL.revokeObjectURL(pdfUrls.modern);
      setPdfUrls(null);
    }

    // Delete session
    if (sessionId) {
      await deleteSession(sessionId);
      setSessionId(null);
    }
  };

  const fontFamilyClass = language === "ar" ? "font-riwaya" : "font-hagrid";

  return (
    <div className={`max-w-7xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-900 min-h-screen transition-colors ${fontFamilyClass} ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <button
        onClick={() => navigate(-1)}
        className="mb-6 sm:mb-8 px-4 py-2 bg-black dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
      >
        {language === 'ar' ? '→' : '←'} {t('back')}
      </button>

      <div className="space-y-6 sm:space-y-8">
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

        <div className="flex justify-center">
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className={`px-6 sm:px-8 py-3 rounded-md font-medium transition-all duration-300 transform ${
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
        </div>

        {/* Modal */}
        {showModal && pdfUrls && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-7xl h-full max-h-[90vh] rounded-lg p-4 sm:p-6 relative overflow-hidden">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className={`h-full ${isMobile ? 'flex-col space-y-4' : 'flex gap-4'} pt-12 sm:pt-8`}>
                <div className={`${isMobile ? 'w-full' : 'w-1/2'} h-full`}>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Classic Resume</h2>
                  <div className="h-[calc(100%-3rem)] relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <object
                      data={pdfUrls.classic}
                      className="w-full h-full border border-gray-200 dark:border-gray-600 rounded"
                      type="application/pdf"
                    >
                      <embed
                        src={pdfUrls.classic}
                        className="w-full h-full"
                        type="application/pdf"
                      />
                    </object>
                  </div>
                </div>
                <div className={`${isMobile ? 'w-full' : 'w-1/2'} h-full`}>
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Modern Resume</h2>
                  <div className="h-[calc(100%-3rem)] relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <object
                      data={pdfUrls.modern}
                      className="w-full h-full border border-gray-200 dark:border-gray-600 rounded"
                      type="application/pdf"
                    >
                      <embed
                        src={pdfUrls.modern}
                        className="w-full h-full"
                        type="application/pdf"
                      />
                    </object>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-900 dark:text-white font-medium">{t('processing')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t('pleaseWait')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVEnhancement;
