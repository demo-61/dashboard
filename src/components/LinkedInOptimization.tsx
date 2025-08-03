import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

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
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {response && (
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div>
              <h2 className="text-xl font-semibold mb-2">Profile Tag Line</h2>
              <p className="text-gray-700">{response.tag_line}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Profile Summary</h2>
              <p className="text-gray-700">{response.profile_summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInOptimization;
