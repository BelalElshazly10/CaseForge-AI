import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  FolderPlus, 
  Clock, 
  Bot, 
  FileText, 
  PlusCircle, 
  Activity, 
  Sparkles, 
  CalendarDays,
  FolderOpen
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addProject } from '../store/projectSlice';

const MOCK_TEAM_MEMBERS = [
  { id: 1, name: 'Belal El Shazly', initial: 'B' },
  { id: 2, name: 'Amr El Dowaik', initial: 'A' },
  { id: 3, name: 'Omar Wahdan', initial: 'O' },
  { id: 4, name: 'Kenz Kamal', initial: 'K' },
  { id: 5, name: 'Yara Ahmed', initial: 'Y' }
];

const ROLES = ['Owner (QA)', 'Owner (Expert)', 'QA', 'Expert'];

const MOCK_ACTIVITY = [
  { id: 1, icon: <Bot size={16} className="text-primary-400" />, text: "AI generated 42 test cases for Auth Service.", time: "2 hours ago" },
  { id: 2, icon: <CheckCircle2 size={16} className="text-green-400" />, text: "Yara Ahmed approved 15 test cases.", time: "5 hours ago" },
  { id: 3, icon: <FileText size={16} className="text-blue-400" />, text: "Smart Contract finalized for Project Alpha.", time: "1 day ago" },
  { id: 4, icon: <ShieldCheck size={16} className="text-yellow-400" />, text: "Expert Review completed by Amr.", time: "2 days ago" },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(state => state.project.projects);
  const [loading, setLoading] = useState(false);
  
  // Get logged in user
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;
  const firstName = user?.name ? user.name.split(' ')[0] : 'User';
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // Relying on global Redux state now instead of API fetch for mock
    setLoading(false);
  };

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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    // Create new project object
    const newProj = {
      id: `prj-00${projects.length + 1}`,
      name: newProjectName,
      description: newProjectDesc,
      status: 'ACTIVE',
      updatedAt: 'Just now',
      requirementsCount: 0,
      testCasesCount: 0,
      owner: { id: user?.id || 1, name: user?.name || 'User' },
      members: selectedMembers
    };

    // Dispatch to Redux store
    dispatch(addProject(newProj));

    setCreating(false);
    setShowModal(false);
    
    // Navigate to the Project Dashboard
    navigate(`/project/${newProj.id}/dashboard`);
  };

  // Helper to get formatted date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full animate-fade-in flex flex-col lg:flex-row gap-8">
      
      {/* Main Content Area */}
      <div className="flex-1 space-y-8">
        
        {/* 1. Hero Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900/50 to-blue-900/20 border border-primary-500/30 p-8 shadow-2xl shadow-primary-900/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-primary-500/20 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-2 text-primary-300 font-medium">
            <CalendarDays size={18} />
            <span>{dateString}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-200 mb-4">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-lg text-gray-700 text-gray-300 max-w-2xl">
            CaseForge AI is ready. You have <span className="text-white font-bold">{projects.length} active projects</span>. Let's generate some test cases today.
          </p>
        </div>

        {/* 2. Global AI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 hover:border-primary-500/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary-900/40 flex items-center justify-center shrink-0">
              <FolderOpen size={24} className="text-primary-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{projects.length}</div>
              <div className="text-sm text-gray-400">Total Projects</div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 hover:border-blue-500/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-900/40 flex items-center justify-center shrink-0">
              <Bot size={24} className="text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">1,204</div>
              <div className="text-sm text-gray-400">AI Test Cases</div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 hover:border-green-500/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-green-900/40 flex items-center justify-center shrink-0">
              <FileText size={24} className="text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-gray-400">Finalized Contracts</div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 hover:border-yellow-500/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-yellow-900/40 flex items-center justify-center shrink-0">
              <Clock size={24} className="text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">42 hrs</div>
              <div className="text-sm text-gray-400">Time Saved by AI</div>
            </div>
          </div>
        </div>

        {/* 3. Project Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Workspaces</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Create New Project Card (Hidden for Experts) */}
            {user?.role !== 'EXPERT_REVIEWER' && (
              <div 
                onClick={() => setShowModal(true)}
                className="bg-gray-900/50 border-2 border-dashed border-gray-800 hover:border-primary-500/50 rounded-2xl p-6 cursor-pointer transition-all hover:bg-gray-900 group flex flex-col items-center justify-center min-h-[220px]"
              >
                <div className="w-16 h-16 rounded-full bg-gray-800 group-hover:bg-primary-900/40 flex items-center justify-center transition-colors mb-4">
                  <FolderPlus size={32} className="text-gray-500 group-hover:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 group-hover:text-white mb-2 transition-colors">Create Project</h3>
                <p className="text-sm text-gray-500 text-center">Set up a new workspace for AI-powered testing.</p>
              </div>
            )}

            {/* Existing Projects */}
            {projects.map((proj, idx) => {
              // Mock progress based on index just for visual flair
              const progress = Math.max(20, 100 - (idx * 25));
              const radius = 24;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (progress / 100) * circumference;

              return (
                <div 
                  key={proj.id}
                  onClick={() => navigate(`/project/${proj.id}/dashboard`)}
                  className="bg-gray-900 border border-gray-800 hover:border-primary-500/50 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-2xl group-hover:bg-primary-900/30 transition-colors">
                        📄
                      </div>
                      <div>
                        <span className="text-xs font-bold px-2 py-1 bg-primary-900/30 text-primary-400 rounded-full uppercase tracking-wider border border-primary-500/20">
                          {proj.status}
                        </span>
                      </div>
                    </div>

                    {/* Circular Progress Ring */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="transform -rotate-90 w-14 h-14">
                        <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-800" />
                        <circle 
                          cx="28" 
                          cy="28" 
                          r="24" 
                          stroke="currentColor" 
                          strokeWidth="4" 
                          fill="transparent" 
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          className="text-primary-500 transition-all duration-1000 ease-out" 
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-white">{progress}%</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{proj.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">{proj.description}</p>
                  
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800">
                    <div className="flex -space-x-2">
                      {proj.members && proj.members.slice(0, 3).map((m, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-white">
                          {m.initial}
                        </div>
                      ))}
                      {proj.members && proj.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-xs font-bold text-gray-400">
                          +{proj.members.length - 3}
                        </div>
                      )}
                    </div>
                    {proj.owner && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <ShieldCheck size={12} className="text-primary-400" /> {proj.owner.name.split(' ')[0]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar Area (Activity & Tips) */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        
        {/* System Activity Timeline */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={20} className="text-white" />
            <h3 className="text-lg font-bold text-white">System Activity</h3>
          </div>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-800 before:to-transparent">
            {MOCK_ACTIVITY.map((activity) => (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-700 bg-gray-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                  {activity.icon}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-800/50 p-4 rounded-xl border border-gray-800">
                  <p className="text-sm text-gray-700 text-gray-300">{activity.text}</p>
                  <span className="text-[10px] text-gray-500 mt-2 block">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tip Widget */}
        <div className="bg-gradient-to-br from-primary-900/40 to-blue-900/20 border border-primary-500/30 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-500/20 blur-2xl rounded-full"></div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={20} className="text-primary-400" />
            <h3 className="text-md font-bold text-primary-300">AI Tip of the Day</h3>
          </div>
          <p className="text-sm text-gray-700 text-gray-300 leading-relaxed">
            Did you know? Gemini can automatically identify boundary value edge cases directly from your uploaded PRD PDFs.
          </p>
        </div>

      </div>

      {/* Create Project Modal (Kept Existing Logic) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-primary-500 focus:outline-none"
                  placeholder="e.g. Auth Service Rewrite"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-1">Description (Optional)</label>
                <textarea
                  value={newProjectDesc}
                  onChange={e => setNewProjectDesc(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-primary-500 focus:outline-none resize-none h-24"
                  placeholder="Brief description of the project..."
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

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
