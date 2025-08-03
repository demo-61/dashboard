import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pdfUrls, setPdfUrls] = useState<{ classic: string; modern: string } | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set mobile state on mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
      >
        ← Back
      </button>

      <div className="space-y-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block mb-4 text-gray-600"
          >
            {file ? file.name : 'Click to upload PDF file'}
          </label>
          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className={`px-6 py-3 bg-black text-white rounded-md transition-colors ${
              !file || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
            }`}
          >
            {isLoading ? 'Processing...' : 'Upload'}
          </button>
        </div>

        {/* Modal */}
        {showModal && pdfUrls && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-11/12 h-5/6 rounded-lg p-6 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-black"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className={`h-full ${isMobile ? 'flex-col' : 'flex'} gap-4 pt-8`}>
                <div className={isMobile ? 'w-full mb-8' : 'w-1/2 h-full'}>
                  <h2 className="text-xl font-semibold mb-4">Classic Resume</h2>
                  <div className="h-[90%] relative bg-gray-50 rounded-lg overflow-hidden">
                    <object
                      data={pdfUrls.classic}
                      className="w-full h-full border border-gray-200 rounded"
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
                <div className={isMobile ? 'w-full' : 'w-1/2 h-full'}>
                  <h2 className="text-xl font-semibold mb-4">Modern Resume</h2>
                  <div className="h-[90%] relative bg-gray-50 rounded-lg overflow-hidden">
                    <object
                      data={pdfUrls.modern}
                      className="w-full h-full border border-gray-200 rounded"
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
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVEnhancement;
