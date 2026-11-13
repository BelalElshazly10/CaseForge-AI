import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { 
  Download, Printer, FileText, CheckSquare, FileSignature, 
  ChevronRight, ChevronDown, FolderOpen, Package, 
  FileSpreadsheet, FileJson, FileType, Check
} from 'lucide-react';

const EXPORT_CATEGORIES = [
  {
    id: 'requirements',
    label: 'Requirements',
    icon: FileText,
    description: 'All submitted requirements for this project',
    color: 'blue'
  },
  {
    id: 'testcases',
    label: 'Approved Test Cases',
    icon: CheckSquare,
    description: 'AI-generated and expert-approved test cases',
    color: 'green'
  },
  {
    id: 'contract',
    label: 'Contract',
    icon: FileSignature,
    description: 'Generated contract document with compliance results',
    color: 'purple'
  }
];

const OutputsExportsPage = () => {
  const { projects } = useSelector(state => state.project);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedExports, setSelectedExports] = useState([]);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const printRef = useRef(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const generatedReqs = selectedProject?.requirements?.filter(
  r => r.status === 'Generated' || r.status === 'Ready'
) || [];
  const requirements = selectedProject?.requirements || [];
  const generatedTestCases = selectedProject?.generatedTestCases || [];
const approvedTestCases = generatedTestCases.flatMap(group =>
  group.testCases.filter(tc => tc.status === "APPROVED" || tc.status === "DRAFT")
);

  const toggleExport = (catId) => {
    setSelectedExports(prev => 
      prev.includes(catId) ? prev.filter(e => e !== catId) : [...prev, catId]
    );
  };

  const selectAllExports = () => {
    if (selectedExports.length === EXPORT_CATEGORIES.length) {
      setSelectedExports([]);
    } else {
      setSelectedExports(EXPORT_CATEGORIES.map(c => c.id));
    }
  };

  // Build export content
  const buildExportData = () => {
    const data = { project: selectedProject?.name, exportedAt: new Date().toISOString(), sections: {} };

    if (selectedExports.includes('requirements')) {
      data.sections.requirements = requirements.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        status: r.status,
        date: r.date,
        techniques: r.techniques || [],
        content: r.content || 'No content available'
      }));
    }

    if (selectedExports.includes('testcases')) {
     data.sections.testCases = generatedTestCases.flatMap(group =>
  group.testCases.map(tc => ({
    id: tc.id,
    requirement: group.requirement.name,
    title: tc.title,
    priority: tc.priority,
    technique: tc.technique,
    preCondition: tc.preCondition,
    steps: tc.steps,
    testData: tc.testData,
    expectedOutput: tc.expectedOutput,
    status: tc.status || "DRAFT"
  }))
);
    }

    if (selectedExports.includes('contract')) {
      const mockContractText = `# Software Contract - ${selectedProject?.name || 'Project'}

## 1. Introduction
This document outlines the formal testing agreement between stakeholders for the "${selectedProject?.name || 'Project'}" project. It establishes the framework for quality assurance activities, acceptance criteria, and deliverables.

## 2. Scope of Testing
### 2.1 In-Scope
- All submitted requirements and their corresponding test cases
- Functional testing using ISTQB techniques (Boundary Value Analysis, Equivalence Partitioning, State Transition, Decision Table)
- Edge case validation and error handling verification

### 2.2 Out-of-Scope
- Performance/load testing
- Security penetration testing
- Third-party integration testing (unless specified)

## 3. Approved Test Cases
${generatedReqs.map(r => `- **${r.name}**: 2 test cases (Valid Input, Edge Case)`).join('\n') || '- No test cases generated yet'}

## 4. Acceptance Criteria
- All CRITICAL priority test cases must pass before sign-off
- HIGH priority test cases require 95% pass rate
- MEDIUM/LOW priority failures must be documented with known-issue tickets

## 5. Timeline & Milestones
| Phase | Target Date | Status |
|-------|------------|--------|
| Requirements Submission | Week 1 | Complete |
| AI Test Generation | Week 1-2 | Complete |
| Expert Review | Week 2-3 | In Progress |
| Final Sign-off | Week 4 | Pending |

## 6. Roles & Responsibilities
- **QA Engineer**: Submit requirements, review generated test cases, execute tests
- **Expert Reviewer**: Validate test case quality, approve/reject/regenerate
- **Project Owner**: Final sign-off and stakeholder communication

## 7. Defect Management
- Defects classified as: Critical, High, Medium, Low
- Critical defects: 24-hour resolution SLA
- All defects tracked via integrated defect management system

## 8. Entry & Exit Criteria
### Entry Criteria
- Requirements approved and submitted
- Test environment available
- AI test generation completed

### Exit Criteria
- All critical test cases executed and passed
- Expert review completed
- Sign-off obtained from all stakeholders

## 9. Risk Assessment
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Incomplete Requirements | High | Medium | Iterative review process |
| AI Generation Errors | Medium | Low | Expert review validation |
| Timeline Delays | Medium | Medium | Buffer time in schedule |

## 10. Sign-off
This contract requires approval from:
- [ ] QA Lead
- [ ] Expert Reviewer
- [ ] Project Owner

Signatures: ___________________  Date: ___________`;

      data.sections.contract = {
        templateType: 'Software Contract',
        complianceScore: '78%',
        text: mockContractText,
        templateType: 'Software Contract',
        complianceScore: '78%',
        criteriaResults: [
          { name: 'Scope of Testing', passed: true },
          { name: 'Acceptance Criteria', passed: true },
          { name: 'Test Coverage', passed: true },
          { name: 'Timeline & Deadlines', passed: false },
          { name: 'Roles & Responsibilities', passed: true },
          { name: 'Defect Management', passed: true },
          { name: 'Entry & Exit Criteria', passed: true },
          { name: 'Risk Assessment', passed: false },
          { name: 'Sign-off Requirements', passed: true }
        ]
      };
    }

    return data;
  };

  const handleDownload = () => {
    setExporting(true);
    setTimeout(() => {
      const data = buildExportData();
      let content, mimeType, extension;

      if (exportFormat === 'json') {
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      } else if (exportFormat === 'csv') {
        // Build CSV from test cases (most tabular data)
        const rows = [['Section', 'ID', 'Name/Title', 'Priority', 'Status', 'Technique']];
        if (data.sections.requirements) {
          data.sections.requirements.forEach(r => {
            rows.push(['Requirement', r.id, r.name, '-', r.status, (r.techniques || []).join('; ')]);
          });
        }
        if (data.sections.testCases) {
          data.sections.testCases.forEach(tc => {
            rows.push(['Test Case', tc.id, tc.title, tc.priority, tc.status, tc.technique]);
          });
        }
        content = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        mimeType = 'text/csv';
        extension = 'csv';
      } else {
        // PDF-like: generate a printable HTML
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedProject?.name?.replace(/\s+/g, '_') || 'export'}_${selectedExports.join('_')}.${extension}`;
      a.click();
      window.URL.revokeObjectURL(url);

      setExporting(false);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
    }, 1200);
  };

  const handlePrint = () => {
    // Build a print-friendly window
    const data = buildExportData();
    const printWindow = window.open('', '_blank');
    
    let html = `
      <!DOCTYPE html>
      <html><head><title>CaseForge Export — ${selectedProject?.name}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #111; }
        h1 { font-size: 24px; border-bottom: 2px solid #7c3aed; padding-bottom: 8px; color: #1e1b4b; }
        h2 { font-size: 18px; color: #4c1d95; margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th { background: #f3f0ff; color: #4c1d95; text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #ddd6fe; }
        td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
        tr:hover { background: #faf5ff; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-red { background: #fee2e2; color: #991b1b; }
        .badge-yellow { background: #fef9c3; color: #854d0e; }
        .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 12px; color: #9ca3af; }
        .contract-doc { border: 1px solid #e5e7eb; padding: 24px; border-radius: 8px; margin-top: 10px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .contract-doc h1 { font-size: 20px; color: #111; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 0; }
        .contract-doc h2 { font-size: 16px; color: #333; margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
        .contract-doc h3 { font-size: 14px; color: #444; margin-top: 15px; }
        .contract-doc p, .contract-doc li { font-size: 13px; color: #333; line-height: 1.6; }
        .contract-doc ul, .contract-doc ol { margin: 8px 0; padding-left: 20px; }
        .contract-doc table { border: 1px solid #d1d5db; width: 100%; margin: 12px 0; }
        .contract-doc th { background: #f3f4f6; color: #374151; border: 1px solid #d1d5db; padding: 8px; font-weight: 600; text-transform: none; letter-spacing: normal; }
        .contract-doc td { border: 1px solid #d1d5db; padding: 8px; }
        @media print { 
          body { padding: 0; } 
          .contract-doc { box-shadow: none; border: none; padding: 0; }
        }
      </style></head><body>
      <h1>📋 CaseForge Export — ${selectedProject?.name}</h1>
      <p style="color:#6b7280; font-size:14px;">Exported: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    `;

    if (data.sections.requirements) {
      html += `<h2>📄 Requirements (${data.sections.requirements.length})</h2>
        <table><thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Status</th><th>Techniques</th></tr></thead><tbody>`;
      data.sections.requirements.forEach(r => {
        html += `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.type}</td><td><span class="badge ${r.status === 'Generated' ? 'badge-green' : 'badge-yellow'}">${r.status}</span></td><td>${(r.techniques || []).join(', ') || '—'}</td></tr>`;
      });
      html += `</tbody></table>`;
    }

    if (data.sections.testCases) {
      html += `<h2>✅ Approved Test Cases (${data.sections.testCases.length})</h2>
        <table><thead><tr><th>ID</th><th>Title</th><th>Requirement</th><th>Priority</th><th>Technique</th><th>Status</th></tr></thead><tbody>`;
      data.sections.testCases.forEach(tc => {
        html += `<tr><td>${tc.id}</td><td>${tc.title}</td><td>${tc.requirement}</td><td><span class="badge ${tc.priority === 'HIGH' ? 'badge-red' : 'badge-yellow'}">${tc.priority}</span></td><td>${tc.technique}</td><td><span class="badge badge-green">${tc.status}</span></td></tr>`;
      });
      html += `</tbody></table>`;
    }

    if (data.sections.contract) {
      const renderedHTML = DOMPurify.sanitize(marked.parse(data.sections.contract.text, { breaks: true, gfm: true }));
      
      html += `<h2>📝 Contract Document</h2>
        <div class="contract-doc">
          ${renderedHTML}
        </div>
        <h3 style="margin-top: 40px; color: #4c1d95; font-size: 18px; border-bottom: 2px solid #ddd6fe; padding-bottom: 8px;">AI Compliance Verification</h3>
        <p>Template: ${data.sections.contract.templateType} &nbsp;|&nbsp; Score: <strong>${data.sections.contract.complianceScore}</strong></p>
        <table><thead><tr><th>Criterion</th><th>Status</th></tr></thead><tbody>`;
      data.sections.contract.criteriaResults.forEach(c => {
        html += `<tr><td>${c.name}</td><td><span class="badge ${c.passed ? 'badge-green' : 'badge-red'}">${c.passed ? '✓ PASSED' : '✗ FAILED'}</span></td></tr>`;
      });
      html += `</tbody></table>`;
    }

    html += `<div class="footer">Generated by CaseForge AI • ${new Date().toLocaleDateString()}</div></body></html>`;

    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="flex-1 p-8 bg-gray-950 overflow-y-auto animate-fade-in">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package size={28} className="text-primary-400" />
            <h1 className="text-3xl font-bold text-white">Outputs & Exports</h1>
          </div>
          <p className="text-gray-400">Select a project, choose what to export, and download or print your documents.</p>
        </div>

        {/* Step 1: Select Project */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selectedProjectId ? 'bg-green-600 text-white' : 'bg-primary-600 text-white'}`}>
              {selectedProjectId ? <Check size={16} /> : '1'}
            </div>
            <h2 className="text-lg font-bold text-white">Select Project</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(proj => {
              const isSelected = selectedProjectId === proj.id;
              const reqCount = (proj.requirements || []).length;
              const tcCount = (proj.requirements || []).filter(r => r.status === 'Generated').length * 2;
              return (
                <button
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setSelectedExports([]);
                    setExportDone(false);
                  }}
                  className={`text-left p-5 rounded-xl border-2 transition-all ${
                    isSelected 
                      ? 'bg-primary-900/20 border-primary-500 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                      : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen size={18} className={isSelected ? 'text-primary-400' : 'text-gray-500'} />
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                        proj.status === 'ACTIVE' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                      }`}>{proj.status}</span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-bold mb-1 truncate">{proj.name}</h3>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{proj.description}</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-gray-400"><span className="text-white font-bold">{reqCount}</span> Requirements</span>
                    <span className="text-gray-400"><span className="text-white font-bold">{tcCount}</span> Test Cases</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select What to Export */}
        {selectedProjectId && (
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${selectedExports.length > 0 ? 'bg-green-600 text-white' : 'bg-primary-600 text-white'}`}>
                  {selectedExports.length > 0 ? <Check size={16} /> : '2'}
                </div>
                <h2 className="text-lg font-bold text-white">Select What to Export</h2>
              </div>
              <button 
                onClick={selectAllExports}
                className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                {selectedExports.length === EXPORT_CATEGORIES.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EXPORT_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedExports.includes(cat.id);
                const colorMap = {
                  blue: { bg: 'bg-blue-900/20', border: 'border-blue-500', icon: 'text-blue-400', ring: 'shadow-blue-500/15' },
                  green: { bg: 'bg-green-900/20', border: 'border-green-500', icon: 'text-green-400', ring: 'shadow-green-500/15' },
                  purple: { bg: 'bg-primary-900/20', border: 'border-primary-500', icon: 'text-primary-400', ring: 'shadow-primary-500/15' }
                };
                const colors = colorMap[cat.color];

                // Compute count
                let count = 0;
                if (cat.id === 'requirements') count = requirements.length;
                else if (cat.id === 'testcases') count = generatedReqs.length * 2;
                else if (cat.id === 'contract') count = generatedReqs.length > 0 ? 1 : 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleExport(cat.id)}
                    disabled={count === 0}
                    className={`text-left p-5 rounded-xl border-2 transition-all relative ${
                      count === 0 
                        ? 'bg-gray-900/50 border-gray-800 opacity-50 cursor-not-allowed' 
                        : isSelected 
                          ? `${colors.bg} ${colors.border} shadow-[0_0_20px] ${colors.ring}` 
                          : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      isSelected ? colors.bg : 'bg-gray-800'
                    }`}>
                      <Icon size={24} className={isSelected ? colors.icon : 'text-gray-500'} />
                    </div>
                    <h3 className="text-white font-bold mb-1">{cat.label}</h3>
                    <p className="text-gray-500 text-xs mb-3">{cat.description}</p>
                    <div className={`text-sm font-bold ${count > 0 ? 'text-white' : 'text-gray-600'}`}>
                      {count} {count === 1 ? 'item' : 'items'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Export Format & Actions */}
        {selectedExports.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${exportDone ? 'bg-green-600 text-white' : 'bg-primary-600 text-white'}`}>
                {exportDone ? <Check size={16} /> : '3'}
              </div>
              <h2 className="text-lg font-bold text-white">Export Format & Actions</h2>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              {/* Format Selection */}
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 block">Download Format</label>
                <div className="flex gap-3">
                  {[
                    { id: 'csv', label: 'CSV', icon: FileSpreadsheet, desc: 'Spreadsheet format' },
                    { id: 'json', label: 'JSON', icon: FileJson, desc: 'Structured data' },
                  ].map(fmt => (
                    <button
                      key={fmt.id}
                      onClick={() => setExportFormat(fmt.id)}
                      className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all ${
                        exportFormat === fmt.id 
                          ? 'bg-primary-900/20 border-primary-500 text-white' 
                          : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      <fmt.icon size={20} className={exportFormat === fmt.id ? 'text-primary-400' : 'text-gray-500'} />
                      <div className="text-left">
                        <div className="font-bold text-sm">{fmt.label}</div>
                        <div className="text-xs text-gray-500">{fmt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700/50">
                <div className="text-sm font-bold text-gray-700 text-gray-300 mb-2">Export Summary</div>
                <div className="flex flex-wrap gap-3">
                  <span className="text-gray-400 text-sm">
                    Project: <span className="text-white font-bold">{selectedProject?.name}</span>
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400 text-sm">
                    Sections: <span className="text-white font-bold">{selectedExports.map(e => EXPORT_CATEGORIES.find(c => c.id === e)?.label).join(', ')}</span>
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400 text-sm">
                    Format: <span className="text-white font-bold uppercase">{exportFormat}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  disabled={exporting}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all text-sm shadow-lg shadow-primary-900/20"
                >
                  {exporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Exporting...
                    </>
                  ) : exportDone ? (
                    <>
                      <Check size={18} />
                      Downloaded!
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Download {exportFormat.toUpperCase()}
                    </>
                  )}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all text-sm border border-gray-700"
                >
                  <Printer size={18} />
                  Print
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state if no project selected */}
        {!selectedProjectId && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={36} className="text-gray-600" />
            </div>
            <p className="text-gray-500 text-lg">Select a project above to start exporting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputsExportsPage;
