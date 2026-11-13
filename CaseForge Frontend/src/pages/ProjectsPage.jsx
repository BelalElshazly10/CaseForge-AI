import React, { useState } from 'react';
import { FolderOpen, Plus, MoreVertical, Calendar, FileText, CheckCircle2, Users, ArrowRight, X, UserPlus, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addProject, deleteProject } from '../store/projectSlice';
import ManageTeamModal from '../components/common/ManageTeamModal';

const MOCK_TEAM_MEMBERS = [
  { id: 1, name: 'Belal El Shazly', initial: 'B' },
  { id: 2, name: 'Amr El Dowaik', initial: 'A' },
  { id: 3, name: 'Omar Wahdan', initial: 'O' },
  { id: 4, name: 'Kenz Kamal', initial: 'K' },
  { id: 5, name: 'Yara Ahmed', initial: 'Y' }
];

const ROLES = ['Owner (QA)', 'Owner (Expert)', 'QA', 'Expert'];

const getStatusBadge = (status) => {
  if (status === 'ACTIVE') {
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-900/40 text-green-400 border border-green-900"><CheckCircle2 size={12} /> Active</span>;
  }
  return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-900/40 text-amber-400 border border-amber-900"><Calendar size={12} /> On Hold</span>;
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(state => state.project.projects);

  // Get logged in user
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageTeamModal, setShowManageTeamModal] = useState(false);
  
  // Create Project State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Manage Team State
  const [activeProjectForTeam, setActiveProjectForTeam] = useState(null);
  const [manageSelectedMembers, setManageSelectedMembers] = useState([]);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMemberSelection = (member) => {
    const existing = selectedMembers.find(m => m.id === member.id);
    if (existing) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, { ...member, role: 'QA' }]);
    }
  };

  const handleRoleChange = (memberId, newRole) => {
    setSelectedMembers(prev => 
      prev.map(m => m.id === memberId ? { ...m, role: newRole } : m)
    );
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProj = {
      id: `prj-00${projects.length + 1}`,
      name: newProjectName,
      description: newProjectDesc,
      status: 'ACTIVE',
      updatedAt: 'Just now',
      requirementsCount: 0,
      testCasesCount: 0,
      owner: { id: 1, name: 'Belal El Shazly' }, // Mocking owner
      members: selectedMembers
    };

    dispatch(addProject(newProj));
    setShowCreateModal(false);
    
    // Navigate straight to the Requirement Input flow
    navigate(`/project/${newProj.id}/requirements`);
  };

  const openManageTeamModal = (project) => {
    setActiveProjectForTeam(project);
    setManageSelectedMembers([...project.members]);
    setShowManageTeamModal(true);
  };

  const handleDeleteProject = (projectId, projectName) => {
  const confirmed = window.confirm(`Are you sure you want to delete "${projectName}"?`);

  if (!confirmed) return;

  dispatch(deleteProject(projectId));
};

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-fade-in relative pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FolderOpen className="text-primary-400" size={32} />
            Projects Workspace
          </h1>
          <p className="text-gray-400">Manage all your testing projects, requirements, and generated contracts.</p>
        </div>
        {user?.role !== 'EXPERT_REVIEWER' && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-primary-900/20"
          >
            <Plus size={18} />
            New Project
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-md bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-primary-500 focus:bg-gray-800 focus:outline-none transition-all shadow-sm"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-gray-900 border border-gray-800 rounded-xl hover:border-primary-500/50 transition-all group flex flex-col h-full shadow-sm relative overflow-hidden">
            {/* Top color bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                  {getStatusBadge(project.status)}
                  {project.owner && (
                    <span className="text-[10px] text-primary-400 flex items-center gap-1 bg-primary-900/20 px-2 py-0.5 rounded border border-primary-900/30 w-fit">
                      <ShieldCheck size={10} /> {project.owner.name}
                    </span>
                  )}
                </div>
                
                {/* Custom Action Menu (Simplified for demo) */}
                <div className="flex items-center gap-2 z-10">
  {user?.role !== 'EXPERT_REVIEWER' && (
    <button 
      onClick={() => openManageTeamModal(project)}
      className="text-gray-500 hover:text-primary-400 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-gray-800 px-2 py-1 rounded"
    >
      <UserPlus size={14} /> Add Member
    </button>
  )}

  <button
    onClick={() => handleDeleteProject(project.id, project.name)}
    className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-red-900/20 px-2 py-1 rounded"
  >
    Delete
  </button>
</div>
              </div>

              <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">{project.name}</h2>
              <p className="text-sm text-gray-400 mb-6 flex-1 line-clamp-2">{project.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-800">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <FileText size={14} /> Reqs
                  </div>
                  <div className="text-xl font-bold text-white">{project.requirementsCount}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-800">
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={14} /> Tests
                  </div>
                  <div className="text-xl font-bold text-white">{project.testCasesCount}</div>
                </div>
              </div>

              {/* Team Members assigned to project */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2 flex items-center gap-1"><Users size={14}/> Team:</span>
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 3).map((member, idx) => (
                      <div key={idx} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-700 flex items-center justify-center text-xs font-bold text-white z-10" title={member.name}>
                        {member.initial}
                      </div>
                    ))}
                    {project.members.length === 0 && (
                      <span className="text-xs text-gray-600 italic">None</span>
                    )}
                    {project.members.length > 3 && (
                      <div className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 z-0">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Updated {project.updatedAt}
                </div>
              </div>
            </div>

            {/* Action Overlay */}
            <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <Link 
                to={`/project/${project.id}/dashboard`}
                className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg pointer-events-auto flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
              >
                Open Project <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            <FolderOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p>No projects found matching your search.</p>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="p-6 overflow-y-auto">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <FolderOpen className="text-primary-400" size={20} />
                Create New Project
              </h2>
              <p className="text-sm text-gray-400 mb-6">Initialize a new workspace for test case generation.</p>
              
              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Project Name <span className="text-red-400">*</span></label>
                  <input 
                    type="text" 
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="e.g., Payments API Service"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:bg-gray-800 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    placeholder="Brief description of the project..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:bg-gray-800 focus:outline-none transition-all min-h-[80px]"
                  />
                </div>

                {/* Team Member Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2 flex items-center justify-between">
                    <span>Assign Team Members</span>
                    <span className="text-primary-400 font-normal normal-case text-xs">{selectedMembers.length} selected</span>
                  </label>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                    {MOCK_TEAM_MEMBERS.map(member => {
                      const selectedMemberData = selectedMembers.find(m => m.id === member.id);
                      const isSelected = !!selectedMemberData;
                      
                      return (
                        <div 
                          key={member.id} 
                          className={`flex flex-col sm:flex-row sm:items-center gap-3 p-2 rounded transition-colors border ${isSelected ? 'bg-primary-900/30 border-primary-500/50' : 'hover:bg-gray-700 border-transparent'}`}
                        >
                          <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleMemberSelection(member)}>
                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'bg-gray-900 border-gray-600'}`}>
                              {isSelected && <CheckCircle2 size={14} />}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-white block">{member.name}</span>
                              {isSelected && selectedMemberData.role && (
                                <span className="text-[10px] text-gray-400 mt-0.5 block">{selectedMemberData.role}</span>
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
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-800">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-primary-900/20 disabled:opacity-50"
                    disabled={!newProjectName.trim()}
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ManageTeamModal 
        isOpen={showManageTeamModal}
        onClose={() => {
          setShowManageTeamModal(false);
          setActiveProjectForTeam(null);
        }}
        project={activeProjectForTeam}
      />
    </div>
  );
};

export default ProjectsPage;
