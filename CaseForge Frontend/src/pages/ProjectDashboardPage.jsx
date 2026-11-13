import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PlusCircle, FileText, CheckCircle2, Bot, Play, Eye, CheckSquare, Shield, ChevronRight } from 'lucide-react';
import { setProject } from '../store/projectSlice';

const ProjectDashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const projects = useSelector(state => state.project.projects);
  const project = projects.find(p => p.id === id);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isExpert = user?.role === 'EXPERT_REVIEWER';

  useEffect(() => {
    if (id) {
      dispatch(setProject(id));
    }
  }, [id, dispatch]);

  if (!project) {
    return (
      <div className="flex-1 p-8 text-center text-gray-400">
        Project not found.
      </div>
    );
  }

  const requirements = project.requirements || [];
  
  const [selectedReqs, setSelectedReqs] = useState([]);
  const [expandedReqId, setExpandedReqId] = useState(null);

  const toggleExpand = (reqId) => {
    setExpandedReqId(prev => prev === reqId ? null : reqId);
  };

  const toggleSelectAll = () => {
    const readyReqs = requirements.filter(r => r.status === 'Ready').map(r => r.id);
    if (selectedReqs.length === readyReqs.length && readyReqs.length > 0) {
      setSelectedReqs([]);
    } else {
      setSelectedReqs(readyReqs);
    }
  };

  const toggleSelectReq = (reqId) => {
    if (selectedReqs.includes(reqId)) {
      setSelectedReqs(selectedReqs.filter(rid => rid !== reqId));
    } else {
      setSelectedReqs([...selectedReqs, reqId]);
    }
  };

  const handleGenerate = (reqIds) => {
    navigate(`/project/${id}/generate`, { state: { selectedReqs: reqIds } });
  };

  // Mock test case count per requirement
  const getTestCaseCount = (req) => {
    if (req.status === 'Generated') return 2;
    return 0;
  };

  // ============ EXPERT VIEW ============
  if (isExpert) {
    return (
      <div className="flex-1 p-8 bg-gray-950 overflow-y-auto w-full animate-fade-in">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield size={24} className="text-primary-400" />
                <span className="px-3 py-1 bg-primary-900/30 text-primary-400 text-xs rounded-full font-bold uppercase tracking-wider border border-primary-500/20">
                  Expert View
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
              <p className="text-gray-400">{project.description || 'Review requirements and associated test cases for this project.'}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-400">
                <FileText size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{requirements.length}</div>
                <div className="text-sm text-gray-400">Total Requirements</div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-900/40 flex items-center justify-center text-primary-400">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{project.testCasesCount || 0}</div>
                <div className="text-sm text-gray-400">Test Cases Generated</div>
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-900/40 flex items-center justify-center text-green-400">
                <CheckSquare size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{requirements.filter(r => r.status === 'Generated').length}</div>
                <div className="text-sm text-gray-400">Ready for Review</div>
              </div>
            </div>
          </div>

          {/* Requirements List — Expert Read-Only */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50">
              <h2 className="text-lg font-bold text-white">Project Requirements</h2>
              <p className="text-gray-500 text-sm mt-1">Click a requirement to go to the expert review screen.</p>
            </div>
            
            {requirements.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                  <FileText size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No requirements submitted yet</h3>
                <p className="text-gray-400">The QA team has not submitted any requirements for this project.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {requirements.map((req) => {
                  const tcCount = getTestCaseCount(req);
                  return (
                    <div 
                      key={req.id}
                      onClick={() => {
                        if (req.status === 'Generated') {
                          navigate(`/project/${id}/review`);
                        }
                      }}
                      className={`px-6 py-5 flex items-center justify-between group transition-all ${
                        req.status === 'Generated' 
                          ? 'cursor-pointer hover:bg-primary-900/10' 
                          : 'cursor-default opacity-70'
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          req.status === 'Generated' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-500'
                        }`}>
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-primary-400 bg-primary-900/20 px-2 py-0.5 rounded border border-primary-900/50">
                              {req.id}
                            </span>
                            <span className="font-bold text-white truncate">{req.name}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1.5">
                            <span className="px-2 py-0.5 bg-gray-800 text-gray-700 text-gray-300 text-xs rounded border border-gray-700">{req.type}</span>
                            <span className="text-xs text-gray-500">{req.date}</span>
                            {req.techniques && req.techniques.length > 0 && (
                              <div className="flex gap-1">
                                {req.techniques.map((tech, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 bg-blue-900/20 text-blue-400 text-xs rounded">{tech}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Test Case Count Badge */}
                        <div className={`text-center px-4 py-2 rounded-lg ${
                          tcCount > 0 ? 'bg-green-900/20 border border-green-900/30' : 'bg-gray-800/50 border border-gray-700/50'
                        }`}>
                          <div className={`text-lg font-bold ${tcCount > 0 ? 'text-green-400' : 'text-gray-500'}`}>{tcCount}</div>
                          <div className="text-xs text-gray-500">Test Cases</div>
                        </div>

                        {/* Status */}
                        {req.status === 'Generated' ? (
                          <span className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
                            <CheckCircle2 size={16} />
                            Review
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-yellow-400 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                            Pending
                          </span>
                        )}

                        {req.status === 'Generated' && (
                          <ChevronRight size={20} className="text-gray-600 group-hover:text-primary-400 transition-colors" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============ QA / OWNER VIEW ============
  return (
    <div className="flex-1 p-8 bg-gray-950 overflow-y-auto w-full animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
            <p className="text-gray-400">{project.description || 'Manage your requirements and test cases for this project.'}</p>
          </div>
          <div className="flex gap-3">
            {requirements.some(r => r.status === 'Ready') && (
              <button 
                onClick={() => handleGenerate(selectedReqs.length > 0 ? selectedReqs : requirements.filter(r => r.status === 'Ready').map(r => r.id))}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-green-900/20"
              >
                <Play size={20} className="fill-current" />
                <span>{selectedReqs.length > 0 ? `Generate Selected (${selectedReqs.length})` : 'Generate All Ready'}</span>
              </button>
            )}
            <button 
              onClick={() => navigate(`/project/${id}/requirements/new`)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2"
            >
              <PlusCircle size={20} />
              <span>Add New Requirement</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-400">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{requirements.length}</div>
              <div className="text-sm text-gray-400">Total Requirements</div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-900/40 flex items-center justify-center text-primary-400">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{project.testCasesCount || 0}</div>
              <div className="text-sm text-gray-400">Test Cases Generated</div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-900/40 flex items-center justify-center text-yellow-400">
              <Bot size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Active</div>
              <div className="text-sm text-gray-400">AI Status</div>
            </div>
          </div>
        </div>

        {/* Requirements Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50">
            <h2 className="text-lg font-bold text-white">Submitted Requirements</h2>
          </div>
          
          {requirements.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No requirements yet</h3>
              <p className="text-gray-400 mb-6">Start by submitting your first PRD, PDF, or text requirement.</p>
              <button 
                onClick={() => navigate(`/project/${id}/requirements/new`)}
                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-all"
              >
                Submit Requirement
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-wider">
                    <th className="px-4 py-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-primary-500 focus:ring-offset-gray-900"
                        checked={selectedReqs.length === requirements.filter(r => r.status === 'Ready').length && requirements.some(r => r.status === 'Ready')}
                        onChange={toggleSelectAll}
                        disabled={!requirements.some(r => r.status === 'Ready')}
                      />
                    </th>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Requirement Name</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">AI Techniques Detected</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {requirements.map((req) => (
                    <React.Fragment key={req.id}>
                      <tr 
                        className={`transition-colors cursor-pointer ${selectedReqs.includes(req.id) ? 'bg-primary-900/20' : 'hover:bg-gray-800/30'}`}
                        onClick={() => toggleExpand(req.id)}
                      >
                        <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-primary-600 focus:ring-primary-500 focus:ring-offset-gray-900"
                            checked={selectedReqs.includes(req.id)}
                            onChange={() => toggleSelectReq(req.id)}
                            disabled={req.status !== 'Ready'}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs text-primary-400 bg-primary-900/20 px-2 py-1 rounded border border-primary-900/50">
                            {req.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-white">{req.name}</div>
                          <div className="text-xs text-gray-500">{req.date}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-gray-800 text-gray-700 text-gray-300 text-xs rounded border border-gray-700 font-medium">
                            {req.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {req.techniques && req.techniques.length > 0 ? (
                              req.techniques.map((tech, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-900/20 text-blue-400 text-xs rounded border border-blue-900/50">
                                  {tech}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 text-xs italic">Pending Analysis</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {req.status === 'Ready' ? (
                            <span className="flex items-center gap-1.5 text-yellow-400 text-sm font-medium">
                              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                              Ready for AI
                            </span>
                          ) : req.status === 'Generated' ? (
                            <span className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
                              <CheckCircle2 size={16} />
                              Completed
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm font-medium">{req.status}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          {req.status === 'Ready' ? (
                            <button 
                              onClick={() => handleGenerate([req.id])}
                              className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary-900/20"
                            >
                              <Play size={14} className="fill-current" />
                              Generate
                            </button>
                          ) : (
                            <button 
                              onClick={() => navigate(`/project/${id}/review`)}
                              className="inline-flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
                            >
                              <Eye size={16} />
                              View Tests
                            </button>
                          )}
                        </td>
                      </tr>
                      {/* Expandable Details Row */}
                      {expandedReqId === req.id && (
                        <tr className="bg-gray-950/80 border-t border-primary-900/30">
                          <td colSpan="7" className="px-8 py-6">
                            <h3 className="text-primary-400 text-sm font-bold uppercase tracking-wider mb-3">Requirement Details</h3>
                            <div className="bg-gray-900 p-4 rounded border border-gray-800 text-gray-700 text-gray-300 text-sm whitespace-pre-wrap leading-relaxed shadow-inner mb-6">
                              {req.content ? req.content : (
                                <span className="italic text-gray-500">No content available for this mock requirement. Please add a new requirement to see its content.</span>
                              )}
                            </div>
                            
                            {/* Show Test Cases if Generated */}
                            {req.status === 'Generated' && (
                              <div>
                                <h3 className="text-primary-400 text-sm font-bold uppercase tracking-wider mb-3">Generated Test Cases</h3>
                                <div className="grid gap-4">
                                  {[1, 2].map(num => (
                                    <div key={num} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                                      <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                          <span className="text-primary-400 font-mono font-bold">TC-{req.id ? String(req.id).slice(-4) : '0000'}-0{num}</span>
                                          <h4 className="text-lg font-bold text-white">{num === 1 ? `Valid Input for ${req.name}` : `Invalid Edge Case for ${req.name}`}</h4>
                                        </div>
                                        <div className="flex gap-2">
                                          <span className={`px-2 py-1 text-xs rounded font-bold ${num === 1 ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                                            {num === 1 ? 'HIGH' : 'MEDIUM'}
                                          </span>
                                          <span className="px-2 py-1 bg-blue-900/50 text-blue-400 text-xs rounded font-bold">
                                            {req.techniques?.[num - 1] || (num === 1 ? 'Boundary Value' : 'Equivalence Partitioning')}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                                        <div className="bg-gray-800/50 p-3 rounded">
                                          <span className="text-gray-400 font-bold block mb-1">Pre-Condition</span>
                                          <span className="text-gray-700 text-gray-300">System is running and user is on the {req.name} page.</span>
                                        </div>
                                        <div className="bg-gray-800/50 p-3 rounded">
                                          <span className="text-gray-400 font-bold block mb-1">Expected Output</span>
                                          <span className="text-gray-700 text-gray-300">{num === 1 ? 'The system should process the request successfully.' : 'The system should prevent submission and display an error.'}</span>
                                        </div>
                                        <div className="bg-gray-800/50 p-3 rounded">
                                          <span className="text-gray-400 font-bold block mb-1">Steps to Execute</span>
                                          <ol className="list-decimal list-inside text-gray-700 text-gray-300">
                                            <li>Navigate to {req.name} feature</li>
                                            <li>{num === 1 ? 'Enter valid parameters' : 'Leave required fields blank'}</li>
                                            <li>Attempt to submit</li>
                                          </ol>
                                        </div>
                                        <div className="bg-gray-800/50 p-3 rounded">
                                          <span className="text-gray-400 font-bold block mb-1">Test Data Required</span>
                                          <span className="text-gray-700 text-gray-300 font-mono">{num === 1 ? 'Valid standard inputs' : 'Empty strings or nulls'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboardPage;
