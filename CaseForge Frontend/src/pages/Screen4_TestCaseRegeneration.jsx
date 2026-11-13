import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const Screen4_TestCaseRegeneration = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Retrieve feedback passed from the Review screen
  const feedback = location.state?.feedback || "Ensure the test cases cover boundary values more aggressively.";

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      await api.post('/test-cases/regenerate', {
        requirement_id: 'REQ-MOCK',
        feedback: feedback
      });
      setLoading(false);
      navigate(`/project/${id}/generate`);
    } catch (err) {
      console.warn("API Error (likely Rate Limit). Falling back to mock transition:", err);
      setTimeout(() => {
        setLoading(false);
        navigate(`/project/${id}/generate`);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-950 via-primary-950 to-gray-950 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-gray-900 border border-red-500/30 rounded-lg shadow-2xl p-8">
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-red-900/50 rounded-full flex items-center justify-center text-red-500 text-2xl">
            ✕
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Test Case Rejected</h1>
            <p className="text-gray-400">The expert requested changes to the test cases.</p>
          </div>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Expert Feedback</h3>
          <p className="text-white italic">"{feedback}"</p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-all text-lg flex justify-center items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin mr-3">⚙️</div>
              Regenerating using AI...
            </>
          ) : (
            'Regenerate Test Cases'
          )}
        </button>

      </div>
    </div>
  );
};

export default Screen4_TestCaseRegeneration;
