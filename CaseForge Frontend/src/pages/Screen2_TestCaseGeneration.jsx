import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Users, ArrowRight, CheckCircle, FileText } from 'lucide-react';
import api from '../services/api';
import { openManageTeamModal, saveGeneratedTestCases } from '../store/projectSlice';

const Screen2_TestCaseGeneration = ({ userRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const selectedReqIds = location.state?.selectedReqs || [];

  const projects = useSelector(state => state.project.projects);
  const currentProject = projects.find(p => p.id === id);

  const [loading, setLoading] = useState(true);
  const [groupedTestCases, setGroupedTestCases] = useState([]);
  const [expandedTcId, setExpandedTcId] = useState(null);

  const toggleExpand = (tcId) => {
    setExpandedTcId(prev => prev === tcId ? null : tcId);
  };

  useEffect(() => {
  const generateTestCases = async () => {
    setLoading(true);

    try {
      let reqsToProcess = currentProject?.requirements || [];

      if (selectedReqIds.length > 0) {
        reqsToProcess = reqsToProcess.filter(r => selectedReqIds.includes(r.id));
      }

      if (!currentProject || reqsToProcess.length === 0) {
        setGroupedTestCases([]);
        setLoading(false);
        return;
      }

      const grouped = [];

      for (const req of reqsToProcess) {
        console.log("CALLING REAL AI FOR:", req.name);

        const response = await api.post('/analyze', {
          requirement: req.content
        });

        const analysis = response.data;

        grouped.push({
          requirement: req,
          testCases: (analysis.testCases || []).map(tc => ({
            id: tc.id,
            title: tc.title,
            preCondition: tc.preconditions || "N/A",
            steps: tc.steps || [],
            testData: tc.testData || "N/A",
            expectedOutput: tc.expectedResult || "N/A",
            technique: tc.techniqueUsed || "AI Generated",
            priority: "HIGH",
            status: "DRAFT"
          }))
        });
      }

      setGroupedTestCases(grouped);
      dispatch(saveGeneratedTestCases({
  projectId: id,
  groupedTestCases: grouped
}));

    } catch (err) {
      console.error("AI generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  generateTestCases();
}, [id, currentProject]);

  const handleSubmitForReview = () => {
    navigate(`/project/${id}/review`);
  };

  const handleExpertApproveAll = () => {
    // If expert approves all directly from here, go to contract select
    navigate(`/project/${id}/contract/select`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
        <div className="animate-spin text-6xl mb-4">⚙️</div>
        <h2 className="text-2xl font-bold mb-2">AI is Generating Test Cases</h2>
        <p className="text-gray-400">Applying ISTQB techniques automatically...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-950 via-primary-950 to-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Master Test Case List</h1>
            <p className="text-gray-400">Review all generated test cases across the entire project.</p>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => dispatch(openManageTeamModal())}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all border border-gray-700"
            >
              <Users size={18} /> Team
            </button>
            
            {userRole === 'EXPERT_REVIEWER' ? (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/project/${id}/review`)}
                  className="bg-gray-800 hover:bg-gray-700 border border-primary-500/50 text-white font-bold py-3 px-6 rounded-lg transition-all"
                >
                  Detailed Review
                </button>
                <button
                  onClick={handleExpertApproveAll}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg flex items-center gap-2"
                >
                  <CheckCircle size={18} /> Approve All
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmitForReview}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary-900/20 flex items-center gap-2"
              >
                Submit for Expert Review <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-8">
          {groupedTestCases.length === 0 ? (
            <div className="text-gray-400 text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
              No requirements found in this project.
            </div>
          ) : (
            groupedTestCases.map((group) => (
              <div key={group.requirement.id} className="mb-4">
                <div className="flex items-center gap-3 mb-4 p-4 bg-primary-900/20 border border-primary-500/30 rounded-lg">
                  <FileText className="text-primary-400" size={24} />
                  <div>
                    <p className="text-sm text-gray-400 uppercase font-bold tracking-wider">Requirement: {group.requirement.id}</p>
                    <p className="text-lg text-white font-bold">{group.requirement.name}</p>
                  </div>
                </div>
                
                <div className="grid gap-4 pl-4 border-l-2 border-primary-900/50">
                  {group.testCases.map((tc) => (
                    <div 
                      key={tc.id} 
                      onClick={() => toggleExpand(tc.id)}
                      className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-primary-500/30 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-primary-400 font-mono font-bold">{tc.id}</span>
                          <h3 className="text-xl font-bold text-white">{tc.title}</h3>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 text-xs rounded font-bold ${tc.priority === 'CRITICAL' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                            {tc.priority}
                          </span>
                          <span className="px-2 py-1 bg-blue-900/50 text-blue-400 text-xs rounded font-bold">
                            {tc.technique}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div className="bg-gray-800/50 p-3 rounded">
                          <span className="text-gray-400 font-bold block mb-1">Pre-Condition</span>
                          <span className="text-gray-700 text-gray-300">{tc.preCondition}</span>
                        </div>
                        <div className="bg-gray-800/50 p-3 rounded">
                          <span className="text-gray-400 font-bold block mb-1">Expected Output</span>
                          <span className="text-gray-700 text-gray-300">{tc.expectedOutput}</span>
                        </div>
                      </div>
                      
                      {expandedTcId === tc.id && (
                        <div className="mt-6 pt-6 border-t border-gray-800 animate-fade-in cursor-default" onClick={e => e.stopPropagation()}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-primary-400 uppercase text-xs font-bold mb-3 tracking-wider">Steps to Execute</h4>
                              <ol className="list-decimal list-inside space-y-2 text-gray-700 text-gray-300 bg-gray-950 p-4 rounded border border-gray-800">
                                {tc.steps?.map((step, idx) => (
                                  <li key={idx} className="text-sm pl-2">{step}</li>
                                ))}
                              </ol>
                            </div>
                            <div>
                              <h4 className="text-primary-400 uppercase text-xs font-bold mb-3 tracking-wider">Test Data Required</h4>
                              <p className="text-gray-700 text-gray-300 text-sm leading-relaxed font-mono bg-gray-950 p-4 rounded border border-gray-800">
                                {tc.testData}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Screen2_TestCaseGeneration;
