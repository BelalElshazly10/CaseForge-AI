/*
 * CaseForge AI - Frontend - Screen 1: Requirement Input
 * Implements FR1-FR2: Accept natural language requirements
 * React + Vite + Tailwind CSS + Dark Mode with Purple Accents
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Users, Bot } from 'lucide-react';
import api from '../services/api';
import { openManageTeamModal, addRequirement } from '../store/projectSlice';
import './Screen1_RequirementInput.css';

const AVAILABLE_TECHNIQUES = [
  'Boundary Value Analysis',
  'Equivalence Partitioning',
  'State Transition',
  'Decision Table',
  'Use Case Testing'
];

const Screen1_RequirementInput = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputMethod, setInputMethod] = useState('text'); // 'text' or 'file'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validation, setValidation] = useState(null);
  const [selectedTechniques, setSelectedTechniques] = useState(AVAILABLE_TECHNIQUES);

  const toggleTechnique = (tech) => {
    if (selectedTechniques.includes(tech)) {
      setSelectedTechniques(prev => prev.filter(t => t !== tech));
    } else {
      setSelectedTechniques(prev => [...prev, tech]);
    }
  };

  const renderTechniquesSelection = () => (
    <div className="mb-6 bg-gray-800/50 p-4 rounded-lg border border-primary-500/20">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <Bot size={18} className="text-primary-400" />
        Targeted AI Testing Techniques
      </h3>
      <p className="text-gray-400 text-sm mb-4">
        Select which ISTQB techniques the AI should attempt to apply to this requirement.
      </p>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_TECHNIQUES.map(tech => {
          const isSelected = selectedTechniques.includes(tech);
          return (
            <button
              key={tech}
              type="button"
              onClick={() => toggleTechnique(tech)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 border ${
                isSelected 
                  ? 'bg-primary-600/20 text-primary-400 border-primary-500/50 hover:bg-primary-600/30' 
                  : 'bg-gray-800 text-gray-500 border-gray-700 hover:border-gray-500 hover:text-gray-700 text-gray-300'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-primary-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-gray-600'}`} />
              {tech}
            </button>
          );
        })}
      </div>
    </div>
  );

  // ===================================================================
  // TEXT INPUT HANDLING
  // ===================================================================

  const handleTextChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Real-time validation
    if (newContent.length < 50) {
      setValidation({
        status: 'warning',
        message: `${50 - newContent.length} characters required (${newContent.length}/50)`
      });
    } else if (newContent.length > 10000) {
      setValidation({
        status: 'error',
        message: 'Requirement exceeds 10,000 character limit'
      });
    } else {
      setValidation({
        status: 'valid',
        message: `✓ Valid (${newContent.length} characters)`
      });
    }
  };

  // ===================================================================
  // FILE UPLOAD HANDLING (FR2)
  // ===================================================================

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('File type not supported. Please use PDF, DOCX, or TXT.');
      setFile(null);
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setValidation({
      status: 'valid',
      message: `✓ ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`
    });
  };

  // ===================================================================
  // SUBMIT REQUIREMENT (FR1 & FR2)
  // ===================================================================

  const handleSubmitText = async (e) => {
  e.preventDefault();
  console.log("REAL AI HANDLE SUBMIT TEXT IS RUNNING");

  if (!title.trim()) {
    setError('Please enter a requirement title');
    return;
  }

  if (content.length < 50 || content.length > 10000) {
    setError('Requirement must be between 50-10,000 characters');
    return;
  }

  setLoading(true);
  setError(null);
  setSuccess({ message: 'AI is analyzing your requirement...' });

  try {
    const response = await api.post('/analyze', {
      requirement: content.trim()
    });

    const reqId = `REQ-${Date.now()}`;

    localStorage.setItem(`analysis_${reqId}`, JSON.stringify(response.data));

    const newReq = {
      id: reqId,
      name: title.trim(),
      type: 'Text',
      content: content.trim(),
      status: 'Ready',
      date: 'Just now',
      techniques: response.data.techniquesUsed || selectedTechniques || ['AI Analysis']
    };

    dispatch(addRequirement({
      projectId: projectId || "proj-123",
      requirement: newReq
    }));

    setSuccess({
      message: `AI analysis complete. Coverage score: ${response.data.coverageScore}%`,
      requirementId: reqId
    });

    navigate(`/project/${projectId || "proj-123"}/dashboard`);

  } catch (err) {
    console.error('AI analysis error:', err);
    setError(err.response?.data?.error || 'Failed to analyze requirement with AI');
  } finally {
    setLoading(false);
  }
};

 const handleSubmitFile = async (e) => {
  e.preventDefault();

  if (!file) {
    setError('Please select a file to upload');
    return;
  }

  setLoading(true);
  setError(null);
  setSuccess({ message: 'AI is analyzing document and extracting requirements...' });

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/extract-requirements', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const extractedRequirements = response.data.requirements || [];

    if (extractedRequirements.length === 0) {
      setError('No requirements were found in this file.');
      setLoading(false);
      return;
    }

    const baseId = `REQ-FILE-${Date.now()}`;

    extractedRequirements.forEach((req, index) => {
      const newReq = {
        id: `${baseId}-${index + 1}`,
        name: req.title || req.name || `Extracted Requirement ${index + 1}`,
        type: file.type === 'application/pdf' ? 'PDF Extracted' : 'File Extracted',
        content: req.content || req.description || '',
        status: 'Ready',
        date: 'Just now',
        techniques: selectedTechniques.length > 0 ? selectedTechniques : ['General Analysis'],
      };
      console.log("Current projectId:", projectId);
      dispatch(addRequirement({
        projectId: projectId || "proj-123",
        requirement: newReq,
      }));
    });

    setSuccess({
      message: `${extractedRequirements.length} requirement(s) extracted successfully.`
    });

    setTimeout(() => {
      navigate(`/project/${projectId || "proj-123"}/dashboard`);
    }, 1000);

  } catch (err) {
    console.error('File upload error:', err);
    setError(err.response?.data?.error || 'Failed to extract requirements from file');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="screen1-container min-h-screen bg-gradient-to-br from-gray-950 via-primary-950 to-gray-950 p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Create Test Cases
          </h1>
          <p className="text-gray-700 text-gray-300">
            Input your functional requirements to generate ISTQB-compliant test cases
          </p>
        </div>
        
        <button
          onClick={() => dispatch(openManageTeamModal())}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-primary-900/20"
        >
          <Users size={18} /> Manage Team
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Card Container with Purple Accent */}
        <div className="bg-gray-900 rounded-lg border border-primary-500/30 shadow-2xl overflow-hidden">
          
          {/* Input Method Selector */}
          <div className="flex border-b border-primary-500/20">
            <button
              onClick={() => {
                setInputMethod('text');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                inputMethod === 'text'
                  ? 'bg-primary-600/20 text-primary-400 border-b-2 border-primary-500'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-700 text-gray-300'
              }`}
            >
              📝 Text Input
            </button>
            <button
              onClick={() => {
                setInputMethod('file');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                inputMethod === 'file'
                  ? 'bg-primary-600/20 text-primary-400 border-b-2 border-primary-500'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-700 text-gray-300'
              }`}
            >
              📄 Upload File
            </button>
          </div>

          {/* Content Area */}
          <div className="p-8">
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400">
                  <span className="font-bold">⚠️ Error:</span> {error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                <p className="text-green-400 mb-2">
                  <span className="font-bold">✓ Success:</span> {success.message}
                </p>
                <p className="text-gray-700 text-gray-300 text-sm">
                  Requirement ID: <code className="bg-gray-800 px-2 py-1 rounded">{success.requirementId}</code>
                </p>
              </div>
            )}

            {/* TEXT INPUT METHOD */}
            {inputMethod === 'text' && (
              <form onSubmit={handleSubmitText}>
                
                {/* Title Input */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-2">
                    Requirement Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., User Password Reset Functionality"
                    className="w-full bg-gray-800 border border-primary-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none transition-all"
                    disabled={loading}
                  />
                </div>

                {/* Content Textarea */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-2">
                    Requirement Description *
                  </label>
                  <textarea
                    value={content}
                    onChange={handleTextChange}
                    placeholder="Enter your functional requirement in natural language. Be specific about actors, actions, preconditions, and expected outcomes..."
                    className="w-full bg-gray-800 border border-primary-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none transition-all resize-none"
                    rows={10}
                    disabled={loading}
                    maxLength="10000"
                  />
                  
                  {/* Character Counter */}
                  <div className="flex justify-between items-center mt-2">
                    <div className={`text-sm font-semibold ${
                      validation?.status === 'error' ? 'text-red-400' :
                      validation?.status === 'warning' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {validation?.message}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {content.length} / 10000
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        content.length < 50 ? 'bg-red-500 w-1/4' :
                        content.length < 5000 ? 'bg-yellow-500 w-1/2' :
                        'bg-primary-500 w-full'
                      }`}
                    />
                  </div>
                </div>

                {renderTechniquesSelection()}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !title.trim() || content.length < 50}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-lg transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin mr-2">⚙️</div>
                      Processing...
                    </span>
                  ) : (
                    'Submit Requirement'
                  )}
                </button>

              </form>
            )}

            {/* FILE UPLOAD METHOD */}
            {inputMethod === 'file' && (
              <form onSubmit={handleSubmitFile}>
                
                {/* File Drop Zone */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-4">
                    Upload Requirement Document *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      id="file-input"
                      disabled={loading}
                    />
                    <label
                      htmlFor="file-input"
                      className="border-2 border-dashed border-primary-500/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-900/10 transition-all"
                    >
                      <div className="text-5xl mb-4">📁</div>
                      <p className="text-white font-semibold mb-1">
                        Drag and drop your file here
                      </p>
                      <p className="text-gray-400 text-sm">
                        or click to select (PDF, DOCX, TXT up to 5MB)
                      </p>
                    </label>
                  </div>

                  {/* File Info */}
                  {file && (
                    <div className="mt-4 p-4 bg-primary-900/20 border border-primary-500/30 rounded-lg">
                      <p className="text-primary-400 font-semibold">
                        📄 {file.name}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Size: {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  )}
                </div>

                {renderTechniquesSelection()}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-lg transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin mr-2">⚙️</div>
                      Uploading...
                    </span>
                  ) : (
                    'Upload & Parse File'
                  )}
                </button>

              </form>
            )}

          </div>

        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gray-900 border border-primary-500/30 rounded-lg p-6">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="text-white font-bold mb-2">Clear Description</h3>
            <p className="text-gray-400 text-sm">
              Include actors, actions, preconditions, and expected results
            </p>
          </div>

          <div className="bg-gray-900 border border-primary-500/30 rounded-lg p-6">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="text-white font-bold mb-2">Specific Details</h3>
            <p className="text-gray-400 text-sm">
              The more details you provide, the better the test cases
            </p>
          </div>

          <div className="bg-gray-900 border border-primary-500/30 rounded-lg p-6">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-white font-bold mb-2">Real-time Analysis</h3>
            <p className="text-gray-400 text-sm">
              Your requirement is validated in real-time as you type
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Screen1_RequirementInput;

/* CSS for animations and styling - Screen1_RequirementInput.css */
/*
.screen1-container {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

input:focus,
textarea:focus {
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(168, 85, 247, 0.3);
}
*/
