import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
  CheckCircle2, XCircle, ChevronDown, ChevronUp,
  Printer, Send, Download, ArrowLeft, Shield,
  FileText, Users, AlertTriangle, Eye, Code
} from 'lucide-react';
import api from '../services/api';

const CONTRACT_CRITERIA = [
  {
    id: 'scope',
    name: 'Scope of Testing',
    description: 'Defines the boundaries of what will and will not be tested.',
    passReason: 'Contract clearly defines the testing scope.',
    failReason: 'Contract does not define the testing scope.'
  },
  {
    id: 'acceptance',
    name: 'Acceptance Criteria',
    description: 'Clear, measurable conditions that must be met for sign-off.',
    passReason: 'Acceptance criteria are clearly stated.',
    failReason: 'Acceptance criteria are missing or vague.'
  },
  {
    id: 'coverage',
    name: 'Test Coverage',
    description: 'Maps test cases to requirements ensuring full traceability.',
    passReason: 'Test coverage is included.',
    failReason: 'Test coverage is missing.'
  },
  {
    id: 'timeline',
    name: 'Timeline & Deadlines',
    description: 'Project milestones, delivery dates, and review periods.',
    passReason: 'Timeline and milestones are included.',
    failReason: 'Timeline is missing.'
  },
  {
    id: 'roles',
    name: 'Roles & Responsibilities',
    description: 'Defines who is responsible for what.',
    passReason: 'Roles and responsibilities are defined.',
    failReason: 'Roles are missing.'
  },
  {
    id: 'defect',
    name: 'Defect Management',
    description: 'Process for reporting, tracking, and resolving defects.',
    passReason: 'Defect management is included.',
    failReason: 'Defect management is missing.'
  },
  {
    id: 'entry_exit',
    name: 'Entry & Exit Criteria',
    description: 'Conditions required to begin and end testing phases.',
    passReason: 'Entry and exit criteria are included.',
    failReason: 'Entry/exit criteria are missing.'
  },
  {
    id: 'risk',
    name: 'Risk Assessment',
    description: 'Identified risks, impact, and mitigation strategies.',
    passReason: 'Risk assessment is included.',
    failReason: 'Risk assessment is missing.'
  },
  {
    id: 'signoff',
    name: 'Sign-off Requirements',
    description: 'Who must approve and how sign-off is obtained.',
    passReason: 'Sign-off requirements are included.',
    failReason: 'Sign-off process is missing.'
  }
];

const Screen6_ContractPreview = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const templateType = location.state?.templateType || "Software Contract";

  const projects = useSelector(state => state.project.projects);
  const project = projects.find(p => p.id === id);
  const members = project?.members || [];

  const [loading, setLoading] = useState(true);
  const [contractText, setContractText] = useState("");
  const [complianceResults, setComplianceResults] = useState([]);
  const [expandedCriteria, setExpandedCriteria] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [viewMode, setViewMode] = useState('preview');

  useEffect(() => {
    const generateContract = async () => {
      setLoading(true);

      try {
        const response = await api.post('/generate-document', {
          type: templateType,
          projectName: project?.name || `Project ${id}`,
          requirements: project?.requirements || []
        });

        setContractText(response.data.content);
      } catch (err) {
        console.error("Document generation error:", err);
        setContractText("Failed to generate document with AI.");
      } finally {
        setLoading(false);
      }
    };

    generateContract();
  }, [id, templateType, project]);

  useEffect(() => {
    if (!contractText) return;

    const text = contractText.toLowerCase();

    const results = CONTRACT_CRITERIA.map(criteria => {
      let passed = false;

      if (criteria.id === 'scope') {
        passed = text.includes('scope');
      } else if (criteria.id === 'acceptance') {
        passed = text.includes('acceptance');
      } else if (criteria.id === 'coverage') {
        passed = text.includes('coverage') || text.includes('test case');
      } else if (criteria.id === 'timeline') {
        passed = text.includes('timeline') || text.includes('milestone');
      } else if (criteria.id === 'roles') {
        passed = text.includes('responsibilities') || text.includes('roles');
      } else if (criteria.id === 'defect') {
        passed = text.includes('defect') || text.includes('bug');
      } else if (criteria.id === 'entry_exit') {
        passed = text.includes('entry') && text.includes('exit');
      } else if (criteria.id === 'risk') {
        passed = text.includes('risk');
      } else if (criteria.id === 'signoff') {
        passed = text.includes('sign-off') || text.includes('sign off') || text.includes('signature');
      }

      return {
        ...criteria,
        passed,
        reason: passed ? criteria.passReason : criteria.failReason
      };
    });

    setComplianceResults(results);
  }, [contractText]);

  const renderedHTML = useMemo(() => {
    if (!contractText) return '';
    const rawHTML = marked.parse(contractText, { breaks: true, gfm: true });
    return DOMPurify.sanitize(rawHTML);
  }, [contractText]);

  const passedCount = complianceResults.filter(c => c.passed).length;
  const totalCount = complianceResults.length;
  const complianceScore = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const blob = new Blob([contractText], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateType.replace(/\s+/g, '_')}_${project?.name?.replace(/\s+/g, '_') || id}.md`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSendToMembers = () => {
    setSendSuccess(true);
    setTimeout(() => {
      setShowSendModal(false);
      setSendSuccess(false);
      setSelectedMembers([]);
    }, 2000);
  };

  const toggleMember = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(m => m !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-950 text-white">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-primary-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText size={32} className="text-primary-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2">Generating Document</h2>
        <p className="text-gray-400">AI is building your {templateType}...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-950 overflow-hidden">
      <div className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{templateType}</h1>
            <p className="text-gray-500 text-sm">{project?.name || `Project ${id}`}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'preview' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye size={14} />
              Preview
            </button>

            <button
              onClick={() => setViewMode('source')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'source' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code size={14} />
              Source
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
          >
            <Download size={16} />
            Download
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
          >
            <Printer size={16} />
            Print
          </button>

          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
          >
            <Send size={16} />
            Send to Team
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'preview' ? (
            <div className="max-w-4xl mx-auto py-10 px-8">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary-900/40 via-primary-800/20 to-transparent px-8 py-5 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-900/50 flex items-center justify-center">
                      <FileText size={20} className="text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{templateType}</h2>
                      <p className="text-gray-500 text-xs">{project?.name} • Generated by CaseForge AI</p>
                    </div>
                  </div>
                </div>

                <div
                  className="contract-preview px-8 py-8"
                  dangerouslySetInnerHTML={{ __html: renderedHTML }}
                />
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto py-10 px-8">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gray-800/50 px-6 py-3 border-b border-gray-700 flex items-center gap-2">
                  <Code size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-mono">document.md</span>
                </div>
                <pre className="px-6 py-6 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {contractText}
                </pre>
              </div>
            </div>
          )}
        </div>

        {templateType === "Software Contract" && (
         <div className="w-[380px] bg-gray-900 border-l border-gray-800 flex flex-col overflow-y-auto shrink-0">  
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={20} className="text-primary-400" />
              <h2 className="text-lg font-bold text-white">Compliance Check</h2>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="transform -rotate-90 w-20 h-20" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#1f2937" strokeWidth="6" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke={complianceScore >= 80 ? '#22c55e' : complianceScore >= 50 ? '#eab308' : '#ef4444'}
                    strokeWidth="6"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - complianceScore / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold ${complianceScore >= 80 ? 'text-green-400' : complianceScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {complianceScore}%
                  </span>
                </div>
              </div>

              <div>
                <div className="text-white font-bold text-lg">{passedCount}/{totalCount} Passed</div>
                <div className="text-gray-400 text-sm">Document criteria met</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {complianceResults.map((criteria) => (
              <div key={criteria.id} className="border-b border-gray-800/50">
                <button
                  onClick={() => setExpandedCriteria(prev => prev === criteria.id ? null : criteria.id)}
                  className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-gray-800/30 transition-colors"
                >
                  {criteria.passed ? (
                    <CheckCircle2 size={20} className="text-green-400 shrink-0" />
                  ) : (
                    <XCircle size={20} className="text-red-400 shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm">{criteria.name}</div>
                    <div className="text-gray-500 text-xs truncate">{criteria.description}</div>
                  </div>

                  {expandedCriteria === criteria.id ? (
                    <ChevronUp size={16} className="text-gray-500 shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500 shrink-0" />
                  )}
                </button>

                {expandedCriteria === criteria.id && (
                  <div className="px-5 pb-4">
                    <div className={`p-3 rounded-lg text-sm leading-relaxed ${
                      criteria.passed
                        ? 'bg-green-900/20 border border-green-900/30 text-green-300'
                        : 'bg-red-900/20 border border-red-900/30 text-red-300'
                    }`}>
                      <div className="flex items-start gap-2">
                        {criteria.passed ? (
                          <CheckCircle2 size={14} className="text-green-400 mt-0.5 shrink-0" />
                        ) : (
                          <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
                        )}
                        <p>{criteria.reason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {complianceResults.length > 0 && (
            <div className="p-4 border-t border-gray-800 bg-gray-900/50">
              <button
                onClick={() => navigate(`/project/${id}/contract/export`)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition-all text-sm"
              >
                Finalize & Export Document
              </button>
            </div>
          )}
      

        </div>
        )}
       </div>

      {showSendModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-[440px] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-blue-400" />
                Send Document to Team
              </h3>
              <p className="text-gray-400 text-sm mt-1">Select team members to receive this document.</p>
            </div>

            <div className="p-4 max-h-64 overflow-y-auto space-y-2">
              {members.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No team members found.</p>
              ) : (
                members.map((member) => (
                  <label
                    key={member.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedMembers.includes(member.id)
                        ? 'bg-blue-900/20 border border-blue-500/30'
                        : 'bg-gray-800/50 border border-transparent hover:bg-gray-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => toggleMember(member.id)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="w-8 h-8 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-300 font-bold text-sm">
                      {member.initial || member.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{member.name}</div>
                      <div className="text-gray-500 text-xs">{member.role}</div>
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-800 flex gap-3">
              <button
                onClick={() => { setShowSendModal(false); setSelectedMembers([]); }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 rounded-lg transition-all text-sm"
              >
                Cancel
              </button>

              {sendSuccess ? (
                <button className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm">
                  <CheckCircle2 size={16} />
                  Sent Successfully!
                </button>
              ) : (
                <button
                  onClick={handleSendToMembers}
                  disabled={selectedMembers.length === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={14} />
                  Send ({selectedMembers.length})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Screen6_ContractPreview;