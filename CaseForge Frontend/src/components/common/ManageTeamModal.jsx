import React, { useState, useEffect, useMemo } from 'react';
import { Users, X, CheckCircle2, Search, ShieldAlert, ShieldCheck, UserCheck, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateProjectTeam } from '../../store/projectSlice';

const MOCK_TEAM_MEMBERS = [
  { id: 1, name: 'Belal El Shazly', initial: 'B' },
  { id: 2, name: 'Amr El Dowaik', initial: 'A' },
  { id: 3, name: 'Omar Wahdan', initial: 'O' },
  { id: 4, name: 'Kenz Kamal', initial: 'K' },
  { id: 5, name: 'Yara Ahmed', initial: 'Y' }
];

const ROLES = ['Owner (QA)', 'Owner (Expert)', 'QA', 'Expert'];

const RoleIcon = ({ role }) => {
  if (!role) return null;
  if (role.includes('Owner')) return <ShieldCheck size={12} className="text-primary-400" />;
  if (role === 'Expert') return <Star size={12} className="text-amber-400" />;
  return <UserCheck size={12} className="text-blue-400" />;
};

const ManageTeamModal = ({ isOpen, onClose, project }) => {
  const dispatch = useDispatch();
  const [manageSelectedMembers, setManageSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (project && project.members) {
      setManageSelectedMembers([...project.members]);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const filteredMembers = MOCK_TEAM_MEMBERS.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMemberSelection = (member) => {
    const existing = manageSelectedMembers.find(m => m.id === member.id);
    if (existing) {
      setManageSelectedMembers(manageSelectedMembers.filter(m => m.id !== member.id));
    } else {
      setManageSelectedMembers([...manageSelectedMembers, { ...member, role: 'QA' }]);
    }
  };

  const handleRoleChange = (memberId, newRole) => {
    setManageSelectedMembers(prev => 
      prev.map(m => m.id === memberId ? { ...m, role: newRole } : m)
    );
  };

  const handleSaveTeam = () => {
    dispatch(updateProjectTeam({
      projectId: project.id,
      members: manageSelectedMembers
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        <div className="p-6 flex-1 flex flex-col overflow-hidden">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-gray-300 transition-colors z-10"
          >
            <X size={20} />
          </button>
          
          <div className="shrink-0 mb-6">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Users className="text-primary-400" size={20} />
              Manage Project Team
            </h2>
            <p className="text-sm text-gray-400 line-clamp-1">Assign members and roles for {project.name}</p>
          </div>

          <div className="relative mb-4 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-primary-500 focus:outline-none"
            />
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 flex-1 overflow-y-auto space-y-1 min-h-[250px]">
            {filteredMembers.map(member => {
              const selectedMemberData = manageSelectedMembers.find(m => m.id === member.id);
              const isSelected = !!selectedMemberData;
              
              return (
                <div 
                  key={member.id} 
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded transition-colors border ${isSelected ? 'bg-primary-900/20 border-primary-500/30' : 'hover:bg-gray-700/50 border-transparent'}`}
                >
                  <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleMemberSelection(member)}>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'bg-gray-900 border-gray-600'}`}>
                      {isSelected && <CheckCircle2 size={14} />}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white block">{member.name}</span>
                      {isSelected && selectedMemberData.role && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <RoleIcon role={selectedMemberData.role} /> {selectedMemberData.role}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="pl-8 sm:pl-0 shrink-0">
                      <select 
                        value={selectedMemberData.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded text-xs text-white px-2 py-1.5 focus:border-primary-500 focus:outline-none w-full sm:w-auto"
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredMembers.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No team members found matching "{searchTerm}"
              </div>
            )}
          </div>

          <div className="pt-6 shrink-0 flex justify-end gap-3 border-t border-gray-800 mt-4">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveTeam}
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-primary-900/20"
            >
              Save Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTeamModal;
