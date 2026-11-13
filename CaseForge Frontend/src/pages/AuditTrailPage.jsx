import React, { useState } from 'react';
import { 
  History, Search, Filter, ArrowRight, Shield, 
  CheckCircle2, PlusCircle, Play, FileText, User, 
  Download, FileSignature 
} from 'lucide-react';

// Mock Audit Logs
const MOCK_AUDIT_LOGS = [
  {
    id: 'ADT-9012',
    timestamp: '2026-06-25T10:45:12',
    user: 'Sarah Connor',
    role: 'EXPERT_REVIEWER',
    action: 'Approved Test Cases',
    target: 'Project: E-Commerce Payment Gateway',
    details: 'Approved 2 test cases for requirement "Stripe Payment API Specs"',
    type: 'approval'
  },
  {
    id: 'ADT-9011',
    timestamp: '2026-06-25T10:15:05',
    user: 'Alex Chen',
    role: 'QA_ENGINEER',
    action: 'Generated AI Test Cases',
    target: 'Project: E-Commerce Payment Gateway',
    details: 'Initiated generation for requirement "Stripe Payment API Specs"',
    type: 'generation'
  },
  {
    id: 'ADT-9010',
    timestamp: '2026-06-24T16:30:22',
    user: 'Alex Chen',
    role: 'QA_ENGINEER',
    action: 'Submitted Requirement',
    target: 'Project: E-Commerce Payment Gateway',
    details: 'Uploaded PRD document for Stripe integration',
    type: 'creation'
  },
  {
    id: 'ADT-9009',
    timestamp: '2026-06-24T14:12:00',
    user: 'Michael Scott',
    role: 'ADMIN',
    action: 'Created Project',
    target: 'Project: E-Commerce Payment Gateway',
    details: 'Initialized new project workspace',
    type: 'creation'
  },
  {
    id: 'ADT-9008',
    timestamp: '2026-06-23T09:05:44',
    user: 'Sarah Connor',
    role: 'EXPERT_REVIEWER',
    action: 'Exported Contract',
    target: 'Project: Mobile App V2',
    details: 'Downloaded Service Level Agreement as PDF',
    type: 'export'
  },
  {
    id: 'ADT-9007',
    timestamp: '2026-06-22T11:20:15',
    user: 'Alex Chen',
    role: 'QA_ENGINEER',
    action: 'Regenerated Test Cases',
    target: 'Project: Mobile App V2',
    details: 'Applied "Boundary Value Analysis" technique specifically',
    type: 'generation'
  }
];

const getActionIcon = (type) => {
  switch (type) {
    case 'approval': return <CheckCircle2 size={16} className="text-green-400" />;
    case 'creation': return <PlusCircle size={16} className="text-primary-400" />;
    case 'generation': return <Play size={16} className="text-blue-400" />;
    case 'export': return <Download size={16} className="text-yellow-400" />;
    default: return <FileText size={16} className="text-gray-400" />;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(date);
};

const AuditTrailPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  const filteredLogs = MOCK_AUDIT_LOGS.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'ALL' || log.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex-1 p-8 bg-gray-950 overflow-y-auto animate-fade-in">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <History size={28} className="text-primary-400" />
              <h1 className="text-3xl font-bold text-white">Audit Trail</h1>
            </div>
            <p className="text-gray-400">Comprehensive log of all user activities, system actions, and compliance events.</p>
          </div>
          
          <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 px-5 rounded-lg transition-all text-sm border border-gray-700">
            <Download size={16} />
            Export Logs (CSV)
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search by user, action, or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter size={18} className="text-gray-500" />
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 pr-8"
            >
              <option value="ALL">All Roles</option>
              <option value="QA_ENGINEER">QA Engineers</option>
              <option value="EXPERT_REVIEWER">Expert Reviewers</option>
              <option value="ADMIN">Administrators</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs uppercase bg-gray-800/80 text-gray-400 border-b border-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold tracking-wider">Timestamp / ID</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-wider">User & Role</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-wider">Action Event</th>
                  <th scope="col" className="px-6 py-4 font-bold tracking-wider">Target Resource</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-white mb-1">{formatDate(log.timestamp)}</div>
                        <div className="text-xs text-gray-500 font-mono">{log.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700">
                            <User size={14} className="text-gray-400" />
                          </div>
                          <div>
                            <div className="font-bold text-white">{log.user}</div>
                            <div className="text-xs text-primary-400 font-medium tracking-wide">{log.role.replace('_', ' ')}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          {getActionIcon(log.type)}
                          <span className="font-bold text-gray-200">{log.action}</span>
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1" title={log.details}>
                          {log.details}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded px-3 py-1.5 inline-flex items-center gap-2 text-xs text-gray-700 text-gray-300">
                          <span className="truncate max-w-[200px]">{log.target}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <Shield size={32} className="text-gray-600 mx-auto mb-3" />
                      <div className="text-white font-bold mb-1">No audit records found</div>
                      <div className="text-gray-500 text-sm">Try adjusting your search filters.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AuditTrailPage;
