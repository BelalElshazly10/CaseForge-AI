import React, { useState } from 'react';
import { Check, X, Shield, Edit3, Settings } from 'lucide-react';

const RolesPermissionsPage = () => {
  const [showModal, setShowModal] = useState(false);

  const permissions = [
    { name: 'View Project Details', qaOwner: true, qa: true, expertOwner: true, expert: true },
    { name: 'Write Requirements', qaOwner: true, qa: true, expertOwner: false, expert: false },
    { name: 'Generate Test Cases (AI)', qaOwner: true, qa: true, expertOwner: false, expert: false },
    { name: 'Edit Test Cases Manually', qaOwner: true, qa: true, expertOwner: false, expert: false },
    { name: 'Submit for Expert Review', qaOwner: true, qa: true, expertOwner: false, expert: false },
    { name: 'Review & Approve Test Cases', qaOwner: false, qa: false, expertOwner: true, expert: true },
    { name: 'Generate Contracts', qaOwner: false, qa: false, expertOwner: true, expert: true },
    { name: 'Invite Team Members', qaOwner: true, qa: false, expertOwner: true, expert: false },
    { name: 'Assign Roles', qaOwner: true, qa: false, expertOwner: true, expert: false },
    { name: 'Delete Project', qaOwner: true, qa: false, expertOwner: true, expert: false },
  ];

  const roleStats = [
    { role: 'QA Owner', count: 2, icon: <Shield size={24} className="text-primary-400" /> },
    { role: 'QA Engineer', count: 12, icon: <Edit3 size={24} className="text-blue-400" /> },
    { role: 'Expert Owner', count: 1, icon: <Shield size={24} className="text-green-400" /> },
    { role: 'Expert Reviewer', count: 4, icon: <Check size={24} className="text-emerald-400" /> },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto w-full animate-fade-in relative pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Roles & Permissions</h1>
          <p className="text-gray-400">Manage user access levels and permissions across your workspace.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-primary-900/20"
        >
          <Settings size={18} /> Custom Role (Pro)
        </button>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {roleStats.map((stat, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4 shadow-lg hover:border-primary-500/30 transition-colors">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">{stat.role}</p>
              <h2 className="text-3xl font-bold text-white">{stat.count}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-950 border-b border-gray-800 text-xs uppercase tracking-wider text-gray-500">
                <th className="p-4 font-bold w-1/3">Permission / Capability</th>
                <th className="p-4 font-bold text-center">QA Owner</th>
                <th className="p-4 font-bold text-center">QA</th>
                <th className="p-4 font-bold text-center">Expert Owner</th>
                <th className="p-4 font-bold text-center">Expert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {permissions.map((perm, idx) => (
                <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                  <td className="p-4 text-gray-700 text-gray-300 font-medium">{perm.name}</td>
                  <td className="p-4 text-center">
                    {perm.qaOwner ? <Check size={20} className="text-primary-500 mx-auto" /> : <X size={20} className="text-gray-700 mx-auto" />}
                  </td>
                  <td className="p-4 text-center">
                    {perm.qa ? <Check size={20} className="text-blue-400 mx-auto" /> : <X size={20} className="text-gray-700 mx-auto" />}
                  </td>
                  <td className="p-4 text-center">
                    {perm.expertOwner ? <Check size={20} className="text-emerald-400 mx-auto" /> : <X size={20} className="text-gray-700 mx-auto" />}
                  </td>
                  <td className="p-4 text-center">
                    {perm.expert ? <Check size={20} className="text-green-400 mx-auto" /> : <X size={20} className="text-gray-700 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Role Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-primary-500/30 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Create Custom Role</h2>
            <p className="text-sm text-primary-400 mb-6 font-bold flex items-center gap-1">
              <Settings size={14}/> Pro Feature
            </p>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-primary-500 focus:outline-none"
                  placeholder="e.g. Audit Manager"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">Select Permissions</label>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                  {permissions.map((perm, idx) => (
                    <label key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 cursor-pointer transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-600 text-primary-600 focus:ring-primary-600 bg-gray-900" />
                      <span className="text-sm text-gray-700 text-gray-300">{perm.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-bold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-primary-900/20"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default RolesPermissionsPage;
