import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<LinkedInResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ToastContainer position="bottom-right" />
      <button
        onClick={() => navigate(-1)}
        className="mb-8 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
      >
        ← Back
      </button>

      <div className="space-y-8">
        {!response && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 transition-all duration-300 hover:border-gray-400">
            <DropzoneArea file={file} setFile={setFile} />
            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className={`mt-6 px-8 py-3 bg-black text-white rounded-md transition-all duration-300 transform ${
                !file || isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-800 hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                'Upload PDF'
              )}
            </button>
          </div>
        )}

        {response && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Profile Tag Line</h2>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(response.tag_line);
                    toast.success('Tag line copied to clipboard!');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Copy tag line"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
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
              <p className="text-gray-700">{response.tag_line}</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Profile Summary</h2>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(response.profile_summary);
                    toast.success('Profile summary copied to clipboard!');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Copy profile summary"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
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
              <p className="text-gray-700">{response.profile_summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInOptimization;
