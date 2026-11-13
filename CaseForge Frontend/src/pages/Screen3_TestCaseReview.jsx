import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Users, FileText, RefreshCw } from 'lucide-react';
import { openManageTeamModal } from '../store/projectSlice';

const ISTQB_TECHNIQUES = [
  'Equivalence Partitioning',
  'Boundary Value Analysis',
  'Decision Table Testing',
  'State Transition Testing',
  'Use Case Testing'
];

const Screen3_TestCaseReview = ({ userRole }) => {
  const { id, reqId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const projects = useSelector(state => state.project.projects);
  const currentProject = projects.find(p => p.id === id);

  const [feedback, setFeedback] = useState('');

  // Generate dynamic grouped test cases based on project requirements
  const groupedTestCases = currentProject?.requirements?.map(req => {
    const techs = req.techniques || [];
    return {
      requirement: req,
      testCases: [
        { 
          id: `TC-${req.id.substring(req.id.length - 4)}-01`, 
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
          priority: 'HIGH', 
          status: 'PENDING', 
          reqName: req.name 
        },
        { 
          id: `TC-${req.id.substring(req.id.length - 4)}-02`, 
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
          priority: 'MEDIUM', 
          status: 'PENDING', 
          reqName: req.name 
        },
      ]
    };
  }) || [];

  const allTestCases = groupedTestCases.flatMap(group => group.testCases);
  
  // Set default active test case
  const defaultTcId = allTestCases.length > 0 ? allTestCases[0].id : null;
  const [activeTestCase, setActiveTestCase] = useState(defaultTcId);

  // State to track per-test-case reviews
  const [tcReviews, setTcReviews] = useState({});

  // Regeneration State
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [selectedRegenTechs, setSelectedRegenTechs] = useState([]);

  const toggleRegenTech = (tech) => {
    setSelectedRegenTechs(prev => prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]);
  };

  const handleRegenSubmit = () => {
    handleTcDecision('REGENERATE');
    setShowRegenModal(false);
    setSelectedRegenTechs([]);
  };

  const handleTcFeedbackChange = (text) => {
    setTcReviews(prev => ({
      ...prev,
      [activeTestCase]: {
        ...prev[activeTestCase],
        feedback: text
      }
    }));
  };

  const handleTcPriorityChange = (priority) => {
    setTcReviews(prev => ({
      ...prev,
      [activeTestCase]: {
        ...prev[activeTestCase],
        priority
      }
    }));
  };

  const handleTcDecision = (decision) => {
    setTcReviews(prev => ({
      ...prev,
      [activeTestCase]: {
        ...prev[activeTestCase],
        status: decision
      }
    }));
    // Auto-advance to next pending test case if possible
    const currentIndex = allTestCases.findIndex(tc => tc.id === activeTestCase);
    if (currentIndex < allTestCases.length - 1) {
      setActiveTestCase(allTestCases[currentIndex + 1].id);
    }
  };

  const handleFinalize = () => {
    // In a real app, we would send the tcReviews back to the server
    // For now, if there are any rejections, go to regenerate, else go to contract
    const hasRejections = Object.values(tcReviews).some(r => r.status === 'REJECTED');
    if (hasRejections) {
      navigate(`/project/${id}/regenerate`, { state: { tcReviews } });
    } else {
      navigate(`/project/${id}/contract/select`);
    }
  };

  const currentTC = allTestCases.find(tc => tc.id === activeTestCase) || allTestCases[0];
  const currentReview = tcReviews[activeTestCase] || { status: 'PENDING', feedback: '' };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <div className="p-6 bg-gray-900 border-b border-primary-900/30 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Expert Review Panel</h1>
          <p className="text-gray-400 text-sm">Reviewing Project: {currentProject?.name || id}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => dispatch(openManageTeamModal())}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all border border-gray-700"
          >
            <Users size={18} /> Manage Team
          </button>
          <button
            onClick={handleFinalize}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-primary-900/20"
          >
            Finalize Review Batch
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Pane: Test Case List */}
        <div className="w-1/3 bg-gray-900/50 border-r border-primary-900/30 overflow-y-auto p-4">
          <h2 className="text-gray-400 font-bold mb-4 uppercase tracking-wider text-sm">Project Requirements</h2>
          <div className="space-y-6">
            {groupedTestCases.length === 0 ? (
              <div className="text-gray-500 text-sm italic">No test cases to review.</div>
            ) : (
              groupedTestCases.map(group => (
                <div key={group.requirement.id} className="mb-4">
                  <div className="flex items-center gap-2 mb-2 text-primary-400 border-b border-gray-800 pb-1">
                    <FileText size={14} />
                    <span className="text-sm font-bold truncate">{group.requirement.name}</span>
                  </div>
                  <div className="space-y-2 pl-2">
                    {group.testCases.map(tc => {
                      const status = tcReviews[tc.id]?.status || tc.status;
                      const statusColors = {
                        'PENDING': 'bg-yellow-900/30 text-yellow-500',
                        'APPROVED': 'bg-green-900/30 text-green-500 border border-green-500/30',
                        'REJECTED': 'bg-red-900/30 text-red-500 border border-red-500/30'
                      };
                      return (
                        <div 
                          key={tc.id}
                          onClick={() => setActiveTestCase(tc.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-all border ${
                            activeTestCase === tc.id 
                              ? 'bg-primary-900/30 border-primary-500 shadow-lg shadow-primary-900/20' 
                              : 'bg-gray-800 border-gray-700 hover:border-primary-500/50'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-xs text-primary-400">{tc.id}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${statusColors[status]}`}>
                              {status}
                            </span>
                          </div>
                          <h3 className="text-white text-sm font-semibold truncate">{tc.title}</h3>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Review details */}
        <div className="flex-1 flex flex-col bg-gray-950 overflow-y-auto p-8">
          {currentTC ? (
            <div className="max-w-3xl">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-3xl font-bold text-white">{currentTC.title}</h2>
                  {userRole === 'EXPERT_REVIEWER' ? (
                    <select
                      value={currentReview.priority || currentTC.priority}
                      onChange={(e) => handleTcPriorityChange(e.target.value)}
                      className={`px-3 py-1 text-sm rounded font-bold outline-none cursor-pointer border ${
                        (currentReview.priority || currentTC.priority) === 'HIGH' ? 'bg-red-900/30 text-red-400 border-red-500/30' :
                        (currentReview.priority || currentTC.priority) === 'MEDIUM' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' :
                        'bg-blue-900/30 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 text-sm rounded font-bold ${
                      (currentReview.priority || currentTC.priority) === 'HIGH' ? 'bg-red-900/30 text-red-400' :
                      (currentReview.priority || currentTC.priority) === 'MEDIUM' ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-blue-900/30 text-blue-400'
                    }`}>
                      {currentReview.priority || currentTC.priority}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                  <span>Source Requirement:</span>
                  <span className="text-primary-400 font-semibold">{currentTC.reqName}</span>
                </p>
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-6">
                  
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

              {/* Feedback Form */}
              <div className="bg-gray-900/50 p-6 rounded-lg border border-primary-900/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Review this Test Case</h3>
                  {currentReview.status !== 'PENDING' && (
                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${currentReview.status === 'APPROVED' ? 'bg-green-900/30 text-green-500 border border-green-500/30' : 'bg-red-900/30 text-red-500 border border-red-500/30'}`}>
                      Marked as {currentReview.status}
                    </span>
                  )}
                </div>
                
                {userRole === 'EXPERT_REVIEWER' ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-400 text-sm font-semibold mb-2">Expert Comments / Feedback (Optional)</label>
                      <textarea
                        value={currentReview.feedback}
                        onChange={e => handleTcFeedbackChange(e.target.value)}
                        placeholder="Add optional comments, feedback, or modification requests for this test case..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:border-primary-500 focus:outline-none h-24 resize-none"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleTcDecision('REJECTED')}
                        className={`flex-1 font-bold py-3 px-6 rounded-lg transition-all ${currentReview.status === 'REJECTED' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-red-400 border border-gray-700 hover:border-red-900/50'}`}
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => setShowRegenModal(true)}
                        className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg transition-all ${currentReview.status === 'REGENERATE' ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/20' : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-yellow-400 border border-gray-700 hover:border-yellow-900/50'}`}
                      >
                        <RefreshCw size={18} /> Regenerate
                      </button>
                      <button 
                        onClick={() => handleTcDecision('APPROVED')}
                        className={`flex-1 font-bold py-3 px-6 rounded-lg transition-all ${currentReview.status === 'APPROVED' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-green-400 border border-gray-700 hover:border-green-900/50'}`}
                      >
                        Approve
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-gray-800 rounded text-gray-400">
                    You are in View-Only mode. An EXPERT_REVIEWER must approve these test cases.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a test case to review
            </div>
          )}
        </div>
      </div>

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
  );
};

export default Screen3_TestCaseReview;
