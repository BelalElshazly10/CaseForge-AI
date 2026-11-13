import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Network, Search, Filter, Download, FolderOpen, 
  CheckCircle2, XCircle, AlertTriangle, FileText, CheckSquare, 
  ChevronDown
} from 'lucide-react';

const TraceabilityMatrixPage = () => {
  const { projects } = useSelector(state => state.project);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || null);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, COVERED, UNCOVERED

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const requirements = selectedProject?.requirements || [];

  // Build the traceability mapping
  // A requirement can have multiple test cases. If 0, it's 'Uncovered'.
  const matrixData = requirements.flatMap(req => {
    // Mock mapping: if status is 'Generated', mock 2 test cases. Otherwise 0.
    const hasTestCases = req.status === 'Generated';
    const testCases = hasTestCases ? [
      {
        tcId: `TC-${req.id ? String(req.id).slice(-4) : '0000'}-01`,
        title: `Valid Input for ${req.name}`,
        priority: 'HIGH',
        technique: req.techniques?.[0] || 'Boundary Value',
        status: 'PASSED'
      },
      {
        tcId: `TC-${req.id ? String(req.id).slice(-4) : '0000'}-02`,
        title: `Invalid Edge Case for ${req.name}`,
        priority: 'MEDIUM',
        technique: req.techniques?.[1] || 'Equivalence Partitioning',
        status: 'PENDING'
      }
    ] : [];

    if (testCases.length === 0) {
      return [{
        reqId: req.id,
        reqName: req.name,
        reqType: req.type,
        coverage: 'UNCOVERED',
        tcId: '-',
        tcTitle: '-',
        tcPriority: '-',
        tcTechnique: '-',
        tcStatus: '-'
      }];
    }

    return testCases.map((tc, index) => ({
      reqId: req.id,
      reqName: req.name,
      reqType: req.type,
      coverage: 'COVERED',
      isFirstOfReq: index === 0,
      rowSpan: index === 0 ? testCases.length : 0,
      tcId: tc.tcId,
      tcTitle: tc.title,
      tcPriority: tc.priority,
      tcTechnique: tc.technique,
      tcStatus: tc.status
    }));
  });

  // Apply Filter
  const filteredData = matrixData.filter(row => {
    if (filterStatus === 'ALL') return true;
    return row.coverage === filterStatus;
  });

  // Calculate Metrics
  const totalReqs = requirements.length;
  const coveredReqs = requirements.filter(r => r.status === 'Generated').length;
  const totalTCs = coveredReqs * 2; // Mock logic
  const coveragePercent = totalReqs > 0 ? Math.round((coveredReqs / totalReqs) * 100) : 0;
  const orphanedReqs = totalReqs - coveredReqs;

  const handleExportCSV = () => {
    const headers = ['Requirement ID', 'Requirement Name', 'Type', 'Coverage', 'Test Case ID', 'Test Case Title', 'Priority', 'Technique', 'Execution Status'];
    const rows = filteredData.map(row => [
      row.reqId, 
      `"${row.reqName}"`, 
      row.reqType, 
      row.coverage, 
      row.tcId, 
      `"${row.tcTitle}"`, 
      row.tcPriority, 
      row.tcTechnique, 
      row.tcStatus
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Traceability_Matrix_${selectedProject?.name?.replace(/\s+/g, '_') || 'Project'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-8 bg-gray-950 overflow-y-auto animate-fade-in">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Network size={28} className="text-primary-400" />
              <h1 className="text-3xl font-bold text-white">Traceability Matrix</h1>
            </div>
            <p className="text-gray-400">Map requirements to test cases to ensure full coverage and compliance.</p>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* Project Selector */}
            <div className="relative">
              <select 
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="appearance-none bg-gray-900 border border-gray-700 text-white font-bold rounded-lg pl-10 pr-10 py-2.5 focus:ring-primary-500 focus:border-primary-500 shadow-lg cursor-pointer"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <FolderOpen size={16} className="absolute left-3 top-3.5 text-primary-400 pointer-events-none" />
              <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>

            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg transition-all text-sm shadow-lg shadow-blue-900/20"
            >
              <Download size={16} />
              Export RTM
            </button>
          </div>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">Total Requirements</div>
              <div className="text-2xl font-bold text-white">{totalReqs}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-900/40 flex items-center justify-center text-blue-400">
              <FileText size={24} />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">Total Test Cases</div>
              <div className="text-2xl font-bold text-white">{totalTCs}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary-900/40 flex items-center justify-center text-primary-400">
              <CheckSquare size={24} />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">Coverage Status</div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${coveragePercent === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {coveragePercent}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
              {/* Radial Progress */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" className="stroke-gray-700" strokeWidth="4" />
                <circle cx="18" cy="18" r="15" fill="none" 
                  className={coveragePercent === 100 ? "stroke-green-400" : "stroke-yellow-400"} 
                  strokeWidth="4" strokeDasharray={`${coveragePercent * 0.94}, 100`} strokeLinecap="round" 
                />
              </svg>
            </div>
          </div>

          <div className={`border rounded-xl p-5 flex items-center justify-between ${
            orphanedReqs > 0 ? 'bg-red-900/10 border-red-900/30' : 'bg-gray-900 border-gray-800'
          }`}>
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">Orphaned Reqs</div>
              <div className={`text-2xl font-bold ${orphanedReqs > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {orphanedReqs}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              orphanedReqs > 0 ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'
            }`}>
              {orphanedReqs > 0 ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
            </div>
          </div>
        </div>

        {/* Matrix Table container */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          {/* Table Toolbar */}
          <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Traceability Matrix Board
            </h2>
            <div className="flex items-center gap-3">
              <Filter size={16} className="text-gray-500" />
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button 
                  onClick={() => setFilterStatus('ALL')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterStatus === 'ALL' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                >All</button>
                <button 
                  onClick={() => setFilterStatus('COVERED')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterStatus === 'COVERED' ? 'bg-green-900/40 text-green-400' : 'text-gray-400 hover:text-white'}`}
                >Covered</button>
                <button 
                  onClick={() => setFilterStatus('UNCOVERED')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterStatus === 'UNCOVERED' ? 'bg-red-900/40 text-red-400' : 'text-gray-400 hover:text-white'}`}
                >Uncovered</button>
              </div>
            </div>
          </div>

          {/* Table */}
          {filteredData.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                <Network size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Requirements Found</h3>
              <p className="text-gray-400">Change your filters or select a different project.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-gray-800/80 text-gray-400 border-b border-gray-700">
                  <tr>
                    {/* Requirement Columns */}
                    <th colSpan="3" className="px-6 py-3 font-bold border-r border-gray-700 bg-blue-900/10 text-blue-400 uppercase tracking-wider text-center">
                      Requirement Origin
                    </th>
                    {/* Test Case Columns */}
                    <th colSpan="5" className="px-6 py-3 font-bold bg-primary-900/10 text-primary-400 uppercase tracking-wider text-center">
                      Test Case Coverage
                    </th>
                  </tr>
                  <tr className="border-b border-gray-700 bg-gray-800/40">
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Req ID</th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Requirement Name</th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider border-r border-gray-700">Coverage</th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">TC ID</th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Test Case Title</th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Technique</th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-700 text-gray-300">
                  {filteredData.map((row, i) => (
                    <tr key={i} className={`hover:bg-gray-800/30 transition-colors ${row.rowSpan ? 'border-t-2 border-t-gray-700/50' : ''}`}>
                      
                      {/* Requirement Cells (Merged vertically using rowSpan if multiple TCs) */}
                      {(row.rowSpan > 0 || row.coverage === 'UNCOVERED') && (
                        <>
                          <td className="px-6 py-4 align-top border-r border-gray-800" rowSpan={row.rowSpan || 1}>
                            <span className="font-mono text-xs text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-900/50">
                              {row.reqId}
                            </span>
                          </td>
                          <td className="px-6 py-4 align-top border-r border-gray-800 max-w-[250px]" rowSpan={row.rowSpan || 1}>
                            <div className="font-bold text-white mb-1">{row.reqName}</div>
                            <div className="text-xs text-gray-500">{row.reqType}</div>
                          </td>
                          <td className="px-6 py-4 align-top border-r border-gray-700" rowSpan={row.rowSpan || 1}>
                            {row.coverage === 'COVERED' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-900/30 text-green-400 border border-green-900/50">
                                <CheckCircle2 size={12} /> COVERED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-900/30 text-red-400 border border-red-900/50">
                                <XCircle size={12} /> UNCOVERED
                              </span>
                            )}
                          </td>
                        </>
                      )}

                      {/* Test Case Cells */}
                      {row.coverage === 'UNCOVERED' ? (
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500 italic bg-gray-800/10">
                          Pending AI Generation
                        </td>
                      ) : (
                        <>
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs text-primary-400">{row.tcId}</span>
                          </td>
                          <td className="px-6 py-4 font-medium max-w-[250px]">{row.tcTitle}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded font-bold ${
                              row.tcPriority === 'HIGH' ? 'bg-red-900/30 text-red-400' : 'bg-yellow-900/30 text-yellow-400'
                            }`}>
                              {row.tcPriority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-gray-800 text-gray-700 text-gray-300 text-xs rounded border border-gray-700 whitespace-nowrap">
                              {row.tcTechnique}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-1.5 text-xs font-bold ${
                              row.tcStatus === 'PASSED' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              {row.tcStatus === 'PASSED' && <CheckCircle2 size={12} />}
                              {row.tcStatus === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>}
                              {row.tcStatus}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
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

export default TraceabilityMatrixPage;
