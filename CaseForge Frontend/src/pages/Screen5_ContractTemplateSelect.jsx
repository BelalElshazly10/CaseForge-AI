import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkipForward } from 'lucide-react';

const Screen5_ContractTemplateSelect = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSelect = (templateType) => {
    navigate(`/project/${id}/contract/edit`, { state: { templateType } });
  };

  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-950 via-primary-950 to-gray-950 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <span className="px-3 py-1 bg-green-900/50 text-green-400 text-sm rounded font-bold mb-4 inline-block">TEST CASES APPROVED</span>
          <h1 className="text-4xl font-bold text-white mb-4">Generate Contract</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The expert has approved the test cases. Select a contract template, and the AI will generate a comprehensive document based on the original requirements and the approved test cases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div 
            onClick={() => handleSelect('Software Contract')}
            className="bg-gray-900 border border-primary-500/30 rounded-lg p-8 hover:border-primary-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all cursor-pointer flex flex-col items-center text-center group"
          >
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📜</div>
            <h3 className="text-2xl font-bold text-white mb-2">Software Contract</h3>
            <p className="text-gray-400 text-sm">Formal legal document outlining deliverables, test cases, and acceptance criteria.</p>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => handleSelect('Project Proposal')}
            className="bg-gray-900 border border-primary-500/30 rounded-lg p-8 hover:border-primary-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all cursor-pointer flex flex-col items-center text-center group"
          >
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">💼</div>
            <h3 className="text-2xl font-bold text-white mb-2">Project Proposal</h3>
            <p className="text-gray-400 text-sm">Client-facing document detailing the project scope and the testing methodology.</p>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => handleSelect('SLA')}
            className="bg-gray-900 border border-primary-500/30 rounded-lg p-8 hover:border-primary-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all cursor-pointer flex flex-col items-center text-center group"
          >
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🤝</div>
            <h3 className="text-2xl font-bold text-white mb-2">Service Level Agreement</h3>
            <p className="text-gray-400 text-sm">Agreement focusing on quality metrics and exact boundary testing standards.</p>
          </div>
        </div>

        {/* Skip Contract Button */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate(`/project/${id}/dashboard`)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-medium py-3 px-6 rounded-lg transition-all hover:bg-gray-800/50 border border-transparent hover:border-gray-700"
          >
            <SkipForward size={18} />
            <span>Skip — Contract is Optional</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Screen5_ContractTemplateSelect;
