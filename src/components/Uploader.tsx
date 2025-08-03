import { useCallback, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { useDropzone } from 'react-dropzone';
import { User, MapPin, Briefcase } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PDFUploaderProps {
    title: string;
}

interface FormData {
    company: string;
    location: string;
    job_title: string;
    job_description: string;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ title }) => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        company: '',
        location: '',
        job_title: '',
        job_description: ''
    });

    const handleFormChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        setError(null);

        if (rejectedFiles.length > 0) {
            setError(t('uploadFailed'));
            return;
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setUploadedFile(file);
            const previewUrl = URL.createObjectURL(file);
            setFilePreviewUrl(previewUrl);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (filePreviewUrl) {
                URL.revokeObjectURL(filePreviewUrl);
            }
        };
    }, [filePreviewUrl]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024, // 10MB max size
    });

    const removeFile = () => {
        setUploadedFile(null);
        setFilePreviewUrl(null);
        setError(null);
    };

    const fontFamilyClass = language === "ar" ? "font-riwaya" : "font-hagrid";

    const handleUpload = async (file: File) => {
        if (!file) {
            setError(t('uploadFailed'));
            return;
        }

        try {
            const form = new FormData();
            form.append('file', file);
            form.append('company', formData.company);
            form.append('location', formData.location);
            form.append('job_title', formData.job_title);
            form.append('job_description', formData.job_description);

            setIsLoading(true);
            const response = await axios.post(
                "https://ai.cvaluepro.com/cover/generate-cover-letter",
                form,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );

            if (response.data.session_id && response.data.cover_letter_filename) {
                // First call the download API
                const downloadUrl = `https://ai.cvaluepro.com/cover/download?session_id=${response.data.session_id}&filename=${response.data.cover_letter_filename}`;
                const res = await axios.get(downloadUrl, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
                const sessionId = response.data.session_id;
                setSessionId(sessionId);
                console.log(res)
                const imagesResponse = await axios.post(
                    'https://ai.cvaluepro.com/cover/images',
                    {
                        session_id: response.data.session_id,
                        filename: response.data.cover_letter_filename
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        }
                    }
                );

                if (imagesResponse.data && imagesResponse.data.images) {
                    console.log('Images response:', imagesResponse.data);
                    setPreviewImages(
                        Array.isArray(imagesResponse.data.images)
                            ? imagesResponse.data.images
                            : [imagesResponse.data.images]
                    );
                    setIsPreviewOpen(true);
                }
            }
            setIsLoading(false);

        } catch (err) {
            console.error('Error uploading file:', err);
            setError(t('uploadFailed'));
            setIsLoading(false);
        }finally {
            setFormData({
                company: '',
                location: '',
                job_title: '',
                job_description: ''
            });
        }
    };
    const handleDeleteSession = async (sessionId: string) => {
        try {
            const response = await axios.delete(
                'https://ai.cvaluepro.com/cover/delete-session/?session_id=' + sessionId,
                
            );
            console.log('Session deleted:', response.data);
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };

    return (
        <div className={`min-h-screen bg-white dark:bg-gray-900 transition-colors ${fontFamilyClass} ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-900 dark:text-white mt-6 sm:mt-10">{title}</h1>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('upload')}</h2>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-102'
                        : error
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-700'
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px]">
                        <svg className={`w-10 h-10 sm:w-12 sm:h-12 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        {isDragActive ? (
                            <p className="text-blue-600 font-medium">{t('dragDropFile')}</p>
                        ) : (
                            <>
                                <p className="text-gray-700 dark:text-gray-300 mb-2 text-base sm:text-lg font-medium">
                                    {uploadedFile ? `${t('fileSelected')}: ${uploadedFile.name}` : (
                                        <>
                                            <span className="text-blue-600 dark:text-blue-400 font-medium">{t('clickToUpload')}</span> {t('orDragDrop')}
                                        </>
                                    )}
                                </p>
                                {!uploadedFile && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('pdfFilesOnly')}</p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm border border-red-200 dark:border-red-800">{error}</div>
                )}

                {uploadedFile && (
                    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0 flex-1">
                                <svg className="w-8 h-8 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{uploadedFile.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className="ml-4 text-gray-500 hover:text-red-500 transition-colors flex-shrink-0"
                                aria-label={t('removeFile')}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        {isPreviewOpen && previewImages.length > 0 && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                                    <div className="flex justify-between items-center p-4 border-b">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('preview')}</h3>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                                title={t('download')}
                                                onClick={() => {
                                                    const pdf = new jsPDF();
                                                    previewImages.forEach((img, idx) => {
                                                        // Add each image as a new page
                                                        if (idx > 0) pdf.addPage();
                                                        pdf.addImage(img, 'PNG', 10, 10, 190, 277); // fit to A4
                                                    });
                                                    pdf.save('cover_letter.pdf');
                                                    handleDeleteSession(sessionId || '');
                                                    setPreviewImages([]);
                                                    setIsPreviewOpen(false);
                                                }}
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>{
                                                    handleDeleteSession(sessionId || '');
                                                     setIsPreviewOpen(false)}}
                                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4 overflow-y-auto">
                                        <div className="space-y-4">
                                            {previewImages.map((imageUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imageUrl}
                                                    alt={`Cover Letter Page ${index + 1}`}
                                                    className="w-full h-auto rounded-lg shadow-lg"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
                )}

                {title.toLowerCase().includes('cover letter') && (
                    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                        <div>
                            <label className="flex items-center mb-2 font-medium text-gray-900 dark:text-white">
                                <User className="w-4 h-4 mr-2" />
                                {t('companyName')}
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={e => handleFormChange('company', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                                    }`}
                                placeholder={t('enterCompanyName')}
                            />
                        </div>
                        <div>
                            <label className="flex items-center mb-2 font-medium text-gray-900 dark:text-white">
                                <MapPin className="w-4 h-4 mr-2" />
                                {t('companyLocation')}
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={e => handleFormChange('location', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                                    }`}
                                placeholder={t('enterCompanyLocation')}
                            />
                        </div>
                        <div>
                            <label className="flex items-center mb-2 font-medium text-gray-900 dark:text-white">
                                <Briefcase className="w-4 h-4 mr-2" />
                                {t('jobTitle')}
                            </label>
                            <input
                                type="text"
                                value={formData.job_title}
                                onChange={e => handleFormChange('job_title', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                                    }`}
                                placeholder={t('enterJobTitle')}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium text-gray-900 dark:text-white">{t('jobDescription')}</label>
                            <textarea
                                rows={6}
                                value={formData.job_description}
                                onChange={e => handleFormChange('job_description', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                                    }`}
                                placeholder={t('enterJobDescription')}
                            />
                        </div>
                    </div>
                )}

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={() => {
                            handleDeleteSession(sessionId || '');
                            window.history.back()
                        }
                        }
                        className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        {t('cancel')}
                </button>
                <button
                    onClick={() => uploadedFile && handleUpload(uploadedFile)}
                    className="px-6 py-2.5 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!uploadedFile}
                >
                    {t('upload')}
                </button>
            </div>
                </div>
            </div>
        </div>
    );
};

export default PDFUploader;
