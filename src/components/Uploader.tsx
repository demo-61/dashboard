import { useCallback, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { useDropzone } from 'react-dropzone';
import { User, MapPin, Briefcase } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
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
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isDarkMode = useTheme();
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
            setError('Please upload only PDF files');
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

    const handleUpload = async (file: File) => {
        if (!file) {
            setError('Please select a file first');
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
            setError('Failed to upload. Please try again.');
            setIsLoading(false);
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
        <>
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 mt-10">{title}</h1>
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload</h2>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : error
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        {isDragActive ? (
                            <p className="text-blue-600 font-medium">Drop your PDF here</p>
                        ) : (
                            <>
                                <p className="text-gray-700 mb-2">
                                    <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-sm text-gray-500">PDF files only (max 10MB)</p>
                            </>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
                )}

                {uploadedFile && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-800 truncate max-w-xs">{uploadedFile.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className="text-gray-500 hover:text-red-500 transition-colors"
                                aria-label="Remove file"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>

                        {isPreviewOpen && previewImages.length > 0 && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
                                    <div className="flex justify-between items-center p-4 border-b">
                                        <h3 className="text-lg font-semibold">Cover Letter Preview</h3>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className="text-gray-500 hover:text-blue-600"
                                                title="Download as PDF"
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
                                                className="text-gray-500 hover:text-gray-700"
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
                                <div className="bg-white rounded-lg p-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    <p className="mt-2 text-center">Generating Cover Letter...</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {title.toLowerCase().includes('cover letter') && (
                    <div className="mt-8 space-y-6">
                        <div>
                            <label className="flex items-center mb-2 font-medium">
                                <User className="w-4 h-4 mr-2" />
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={e => handleFormChange('company', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'
                                    }`}
                                placeholder="Enter company name"
                            />
                        </div>
                        <div>
                            <label className="flex items-center mb-2 font-medium">
                                <MapPin className="w-4 h-4 mr-2" />
                                Company Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={e => handleFormChange('location', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'
                                    }`}
                                placeholder="Enter company location"
                            />
                        </div>
                        <div>
                            <label className="flex items-center mb-2 font-medium">
                                <Briefcase className="w-4 h-4 mr-2" />
                                Job Title
                            </label>
                            <input
                                type="text"
                                value={formData.job_title}
                                onChange={e => handleFormChange('job_title', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'
                                    }`}
                                placeholder="Enter job title"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Job Description</label>
                            <textarea
                                rows={6}
                                value={formData.job_description}
                                onChange={e => handleFormChange('job_description', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'
                                    }`}
                                placeholder="Enter job description (minimum 50 characters)"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-end space-x-4">
                    <button
                        onClick={() => {
                            handleDeleteSession(sessionId || '');
                            window.history.back()
                        }
                        }
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                    Cancel
                </button>
                <button
                    onClick={() => uploadedFile && handleUpload(uploadedFile)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={!uploadedFile}
                >
                    Upload
                </button>
            </div>
        </div >
        </>
    );
};

export default PDFUploader;
