import React from 'react';
import { useNavigate } from 'react-router-dom';

const Buttons: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row gap-4 mb-10 max-w-4xl mx-auto items-center justify-between">
      <button 
        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        onClick={() => navigate('/cv-enhancement')}
      >
        CV Enhancement
      </button>
      <button 
        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        onClick={() => navigate('/cover-letter')}
      >
        Cover Letter
      </button>
      <button 
        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        onClick={() => navigate('/linkedin-optimization')}
      >
        LinkedIn Optimization
      </button>
    </div>
  );
};

export default Buttons;
