import React, { useState } from 'react';
import { Users, Mail, Clock, Building2, ShieldCheck, Search, Filter, X, CheckCircle2 } from 'lucide-react';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Belal El Shazly',
    role: 'ADMIN',
    position: 'Lead System Architect',
    lastActive: '2 mins ago',
    email: 'belal@caseforge.ai',
    status: 'Online'
  },
  {
    id: 2,
    name: 'Amr El Dowaik',
    role: 'QA_ENGINEER',
    position: 'Senior Automation Engineer',
    lastActive: '1 hour ago',
    email: 'amr@caseforge.ai',
    status: 'Offline'
  },
  {
    id: 3,
    name: 'Omar Wahdan',
    role: 'REVIEWER',
    position: 'Expert Domain Analyst',
    lastActive: '5 mins ago',
    email: 'omar@caseforge.ai',
    status: 'Online'
  },
  {
    id: 4,
    name: 'Kenz Kamal',
    role: 'BUSINESS_ANALYST',
    position: 'Product Owner',
    lastActive: '1 day ago',
    email: 'kenz@caseforge.ai',
    status: 'Offline'
  },
  {
    id: 5,
    name: 'Yara Ahmed',
    role: 'QA_ENGINEER',
    position: 'Test Data Specialist',
    lastActive: '3 hours ago',
    email: 'yara@caseforge.ai',
    status: 'Offline'
  }
];

const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'ADMIN': return 'bg-red-900/50 text-red-400 border-red-900';
    case 'QA_ENGINEER': return 'bg-cyan-900/50 text-cyan-400 border-cyan-900';
    case 'REVIEWER': return 'bg-primary-900/50 text-primary-400 border-primary-900';
    case 'BUSINESS_ANALYST': return 'bg-emerald-900/50 text-emerald-400 border-emerald-900';
    default: return 'bg-gray-800 text-gray-400 border-gray-700';
  }
};

const TeamPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('QA_ENGINEER');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setShowInviteModal(false);
      setInviteEmail('');
    }, 2000);
  };

  const filteredTeam = TEAM_MEMBERS.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="text-primary-400" size={32} />
            Team Directory
          </h1>
          <p className="text-gray-400">Manage your workspace members, view their roles, and get in touch.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-primary-900/20"
        >
          <ShieldCheck size={18} />
          Invite Member
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search members by name or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:border-primary-500 focus:bg-gray-800 focus:outline-none transition-all shadow-sm"
          />
        </div>
        <button className="bg-gray-900 border border-gray-800 hover:bg-gray-800 text-white py-3 px-4 rounded-lg transition-all flex items-center gap-2 shrink-0">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTeam.map((member) => (
          <div key={member.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-primary-500/50 transition-all group flex flex-col h-full shadow-sm">
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center text-xl border-2 border-gray-700 group-hover:border-primary-500 transition-colors">
                    {member.name.charAt(0)}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-gray-900 ${member.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{member.name}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider mt-1 ${getRoleBadgeColor(member.role)}`}>
                    {member.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Building2 size={16} className="text-gray-500" />
                <span className="text-gray-700 text-gray-300">{member.position}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Clock size={16} className="text-gray-500" />
                <span>Last active: {member.lastActive}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800 mt-auto">
              <a 
                href={`mailto:${member.email}?subject=CaseForge Project Inquiry`}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-600"
              >
                <Mail size={16} className="text-primary-400" />
                Send Email
              </a>
            </div>
          </div>
        ))}

        {filteredTeam.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p>No team members found matching your search.</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden relative">
            <div className="p-6">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Mail className="text-primary-400" size={20} />
                Invite New Member
              </h2>
              <p className="text-sm text-gray-400 mb-6">Send an email invitation to join your CaseForge workspace.</p>
              
              {inviteSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center animate-fade-in">
                  <CheckCircle2 size={48} className="text-green-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-1">Invitation Sent!</h3>
                  <p className="text-gray-400 text-sm">They will receive an email shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleInviteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:bg-gray-800 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Assign Role</label>
                    <select 
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:bg-gray-800 focus:outline-none transition-all appearance-none"
                    >
                      <option value="QA_ENGINEER">QA Engineer</option>
                      <option value="REVIEWER">Expert Reviewer</option>
                      <option value="BUSINESS_ANALYST">Business Analyst</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="px-4 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-primary-900/20"
                    >
                      Send Invite
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
