import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Folder, FileText, CheckCircle, XCircle, RefreshCw, ChevronRight, ClipboardCheck } from 'lucide-react';

const ISTQB_TECHNIQUES = [
  'Equivalence Partitioning',
  'Boundary Value Analysis',
  'Decision Table Testing',
  'State Transition Testing',
  'Use Case Testing'
];

const ExpertGlobalQueue = ({ userRole }) => {
  const navigate = useNavigate();
  const { projects } = useSelector(state => state.project);

  // Generate a flat list of all test cases across all projects, preserving hierarchy context
  const allTestCases = useMemo(() => {
    const list = [];
    projects.forEach(project => {
      (project.requirements || []).forEach(req => {
        const techs = req.techniques || [];
        // Mock 2 test cases per requirement
        const tcs = [
          { 
            id: `TC-${req.id ? String(req.id).slice(-4) : '0000'}-01`, 
            title: `Valid Input for ${req.name}`, 
            preCondition: `System is running and user is on the ${req.name} page.`,
            steps: [
              `Navigate to ${req.name} feature`,
              'Enter valid standard input parameters',
              'Click submit/execute'
            ],
            testData: 'Valid input values (e.g. standard username/password)',
            expectedOutput: 'The system should process the request successfully without errors.',
            technique: techs[0] || 'Boundary Value', 
            priority: 'HIGH'
          },
          { 
            id: `TC-${req.id ? String(req.id).slice(-4) : '0000'}-02`, 
            title: `Invalid Edge Case for ${req.name}`, 
            preCondition: `System is running and user is on the ${req.name} page.`,
            steps: [
              `Navigate to ${req.name} feature`,
              'Leave required fields blank',
              'Attempt to submit the form'
            ],
            testData: 'Empty strings or null values',
            expectedOutput: 'The system should prevent submission and display a validation error message.',
            technique: techs[1] || 'Equivalence Partitioning', 
            priority: 'MEDIUM'
          }
        ];

        tcs.forEach(tc => {
          list.push({
            ...tc,
            projectId: project.id,
            projectName: project.title,
            reqId: req.id,
            reqName: req.name,
            reqType: req.type,
            reqContent: req.content || req.fileName || 'Detailed requirement text goes here.',
            reqStatus: req.status
          });
        });
      });
    });
    return list;
  }, [projects]);

  // If user is not an expert, don't let them do this (though route is protected, just in case)
  if (userRole !== 'EXPERT_REVIEWER') {
    return (
      <div className="min-h-screen p-8 bg-gray-950 text-center flex items-center justify-center">
        <div className="bg-red-900/20 text-red-400 p-8 rounded-lg border border-red-500/30">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p>You must be an EXPERT_REVIEWER to access the Global Queue.</p>
        </div>
      </div>
    );
  }

  // State
  const [activeTcId, setActiveTcId] = useState(allTestCases.length > 0 ? allTestCases[0].id : null);
  const [reviews, setReviews] = useState({}); // { tcId: { status, feedback, priority, regenTechniques } }
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [selectedRegenTechs, setSelectedRegenTechs] = useState([]);

  const currentTC = allTestCases.find(tc => tc.id === activeTcId);
  const currentReview = currentTC ? (reviews[activeTcId] || { status: 'PENDING', feedback: '', priority: currentTC.priority }) : null;

  const handleDecision = (decision) => {
    setReviews(prev => ({
      ...prev,
      [activeTcId]: {
        ...(prev[activeTcId] || { status: 'PENDING', feedback: '', priority: currentTC.priority }),
        status: decision
      }
    }));
    
    if (decision !== 'REGENERATE') {
      advanceToNext();
    }
  };

  const advanceToNext = () => {
    const currentIndex = allTestCases.findIndex(tc => tc.id === activeTcId);
    // Find next pending
    let nextTcId = null;
    for (let i = currentIndex + 1; i < allTestCases.length; i++) {
      if (!reviews[allTestCases[i].id] || reviews[allTestCases[i].id].status === 'PENDING') {
        nextTcId = allTestCases[i].id;
        break;
      }
    }
    // If none after, wrap around and check from beginning
    if (!nextTcId) {
      for (let i = 0; i < currentIndex; i++) {
        if (!reviews[allTestCases[i].id] || reviews[allTestCases[i].id].status === 'PENDING') {
          nextTcId = allTestCases[i].id;
          break;
        }
      }
    }
    
    if (nextTcId) {
      setActiveTcId(nextTcId);
    } else {
      setActiveTcId(null); // All done!
    }
  };

  const handleRegenSubmit = () => {
    setReviews(prev => ({
      ...prev,
      [activeTcId]: {
        ...(prev[activeTcId] || { status: 'PENDING', feedback: '', priority: currentTC.priority }),
        status: 'REGENERATE',
        regenTechniques: selectedRegenTechs
      }
    }));
    setShowRegenModal(false);
    setSelectedRegenTechs([]);
    advanceToNext();
  };

  const toggleRegenTech = (tech) => {
    setSelectedRegenTechs(prev => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleTcPriorityChange = (val) => {
    setReviews(prev => ({
      ...prev,
      [activeTcId]: {
        ...(prev[activeTcId] || { status: 'PENDING', feedback: '', priority: currentTC.priority }),
        priority: val
      }
    }));
  };

  // Grouping for Sidebar
  const groupedByProject = projects.map(proj => {
    const reqs = proj.requirements || [];
    return {
      id: proj.id,
      name: proj.title,
      requirements: reqs.map(req => {
        const tcs = allTestCases.filter(tc => tc.reqId === req.id);
        return {
          id: req.id,
          name: req.name,
          testCases: tcs
        };
      }).filter(req => req.testCases.length > 0)
    };
  }).filter(proj => proj.requirements.length > 0);

  if (allTestCases.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-950 p-8">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg text-center max-w-md">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Queue is Empty!</h2>
          <p className="text-gray-400">There are no pending test cases to review across any projects.</p>
        </div>
      </div>
    );
  }

  // Check if ALL are processed
  const allProcessed = allTestCases.every(tc => reviews[tc.id] && reviews[tc.id].status !== 'PENDING');

  if (allProcessed && !activeTcId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-950 p-8">
        <div className="bg-gray-900 border border-primary-500/30 p-10 rounded-lg text-center max-w-lg shadow-2xl shadow-primary-900/20">
          <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">All Caught Up!</h2>
          <p className="text-gray-400 mb-8">You have processed all pending test cases across all projects. Great work!</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/dashboard')} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded font-bold transition-all">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden bg-gray-950">
      
      {/* LEFT SIDEBAR: Global Queue Tree */}
      <div className="w-80 border-r border-gray-800 flex flex-col bg-gray-900">
        <div className="p-4 border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ClipboardCheck size={20} className="text-primary-400" />
            Global Queue
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {allTestCases.filter(tc => !reviews[tc.id] || reviews[tc.id].status === 'PENDING').length} Pending
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {groupedByProject.map(proj => (
            <div key={proj.id} className="mb-6">
              <div className="flex items-center gap-2 text-white font-bold mb-3">
                <Folder size={16} className="text-blue-400" />
                {proj.name}
              </div>
              <div className="pl-4 space-y-4">
                {proj.requirements.map(req => (
                  <div key={req.id}>
                    <div className="flex items-center gap-2 text-gray-700 text-gray-300 text-sm font-semibold mb-2 truncate">
                      <FileText size={14} className="text-gray-500 shrink-0" />
                      {req.name}
                    </div>
                    <div className="pl-5 space-y-1">
                      {req.testCases.map(tc => {
                        const rStatus = reviews[tc.id]?.status || 'PENDING';
                        const isPending = rStatus === 'PENDING';
                        return (
                          <div 
                            key={tc.id}
                            onClick={() => setActiveTcId(tc.id)}
                            className={`p-2 rounded cursor-pointer text-xs font-medium border flex justify-between items-center transition-all ${
                              activeTcId === tc.id 
                                ? 'bg-primary-900/40 border-primary-500/50 text-white' 
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
                            }`}
                          >
                            <span className="truncate pr-2">{tc.id}</span>
                            {!isPending && (
                              <span className={`w-2 h-2 rounded-full shrink-0 ${
                                rStatus === 'ACCEPTED' ? 'bg-green-500' :
                                rStatus === 'REJECTED' ? 'bg-red-500' :
                                'bg-yellow-500'
                              }`} title={rStatus} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN PANE: Review Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {currentTC ? (
          <div className="flex-1 overflow-y-auto p-8 relative">
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Context Header */}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold mb-4 bg-gray-900 p-3 rounded-lg border border-gray-800 inline-flex">
                  <span className="text-blue-400">{currentTC.projectName}</span>
                  <ChevronRight size={14} />
                  <span className="text-primary-400">{currentTC.reqName}</span>
                </div>

                {/* Requirement Context Box */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5 mb-8">
                  <h3 className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-3">Requirement Details</h3>
                  <div className="text-gray-700 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {currentTC.reqContent}
                  </div>
                </div>
              </div>

              {/* Test Case Details */}
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-3xl font-bold text-white">{currentTC.title}</h2>
                  <select
                    value={currentReview.priority}
                    onChange={(e) => handleTcPriorityChange(e.target.value)}
                    className={`px-3 py-1 text-sm rounded font-bold outline-none cursor-pointer border ${
                      currentReview.priority === 'HIGH' ? 'bg-red-900/30 text-red-400 border-red-500/30' :
                      currentReview.priority === 'MEDIUM' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' :
                      'bg-blue-900/30 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mt-6 space-y-6">
                  <div>
                    <h4 className="text-gray-400 uppercase text-xs font-bold mb-2 tracking-wider">ISTQB Technique Applied</h4>
                    <span className="inline-block px-3 py-1 bg-blue-900/20 text-blue-400 text-sm rounded border border-blue-900/50 font-mono">
                      {currentTC.technique}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-950 p-4 rounded border border-gray-800">
                      <h4 className="text-primary-400/80 uppercase text-xs font-bold mb-2">Pre-Condition</h4>
                      <p className="text-gray-700 text-gray-300 text-sm leading-relaxed">{currentTC.preCondition}</p>
                    </div>
                    <div className="bg-gray-950 p-4 rounded border border-gray-800">
                      <h4 className="text-primary-400/80 uppercase text-xs font-bold mb-2">Test Data Required</h4>
                      <p className="text-gray-700 text-gray-300 text-sm leading-relaxed font-mono bg-gray-900 p-2 rounded">{currentTC.testData}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-primary-400 uppercase text-xs font-bold mb-3">Steps to Execute</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 text-gray-300 bg-gray-950 p-4 rounded border border-gray-800">
                      {currentTC.steps?.map((step, idx) => (
                        <li key={idx} className="text-sm pl-2">{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-green-900/10 p-4 rounded border border-green-900/30">
                    <h4 className="text-green-500 uppercase text-xs font-bold mb-2">Expected Output</h4>
                    <p className="text-gray-200 text-sm">{currentTC.expectedOutput}</p>
                  </div>
                </div>
              </div>

              {/* Action Panel */}
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Expert Decision</h3>
                  {currentReview.status !== 'PENDING' && (
                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                      currentReview.status === 'ACCEPTED' ? 'bg-green-900/30 text-green-500 border-green-500/30' : 
                      currentReview.status === 'REJECTED' ? 'bg-red-900/30 text-red-500 border-red-500/30' :
                      'bg-yellow-900/30 text-yellow-500 border-yellow-500/30'
                    } border`}>
                      Marked as {currentReview.status}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-400 text-sm font-semibold mb-2">Expert Comments / Feedback (Optional)</label>
                  <textarea
                    value={currentReview.feedback}
                    onChange={(e) => setReviews(prev => ({...prev, [activeTcId]: {...prev[activeTcId], feedback: e.target.value}}))}
                    placeholder="Add specific notes or reasons for rejection/regeneration..."
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-600 focus:border-primary-500 focus:outline-none h-20 resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleDecision('ACCEPTED')}
                    className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg transition-all ${
                      currentReview.status === 'ACCEPTED' 
                        ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-green-400 border border-gray-700 hover:border-green-900/50'
                    }`}
                  >
                    <CheckCircle size={18} /> Accept
                  </button>
                  <button 
                    onClick={() => handleDecision('REJECTED')}
                    className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg transition-all ${
                      currentReview.status === 'REJECTED' 
                        ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-900/50'
                    }`}
                  >
                    <XCircle size={18} /> Reject
                  </button>
                  <button 
                    onClick={() => setShowRegenModal(true)}
                    className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg transition-all ${
                      currentReview.status === 'REGENERATE' 
                        ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/20' 
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-yellow-400 border border-gray-700 hover:border-yellow-900/50'
                    }`}
                  >
                    <RefreshCw size={18} /> Regenerate
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : null}

        {/* REGENERATE MODAL */}
        {showRegenModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-2">Request Regeneration</h2>
              <p className="text-gray-400 text-sm mb-6">Select specific ISTQB techniques to focus the AI on during regeneration, or leave blank to regenerate freely.</p>
              
              <div className="space-y-3 mb-8">
                {ISTQB_TECHNIQUES.map(tech => {
                  const isSelected = selectedRegenTechs.includes(tech);
                  return (
                    <label key={tech} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-primary-900/20 border-primary-500/50' : 'bg-gray-950 border-gray-800 hover:border-gray-700'}`}>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleRegenTech(tech)}
                        className="w-4 h-4 rounded border-gray-600 text-primary-600 focus:ring-primary-600 bg-gray-800"
                      />
                      <span className={isSelected ? 'text-white font-medium' : 'text-gray-400'}>{tech}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowRegenModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRegenSubmit}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded shadow-lg shadow-primary-900/20 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} /> Send to AI
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExpertGlobalQueue;
