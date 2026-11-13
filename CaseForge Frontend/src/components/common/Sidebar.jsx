import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileText, 
  User, 
  Users,
  Settings, 
  ShieldCheck, 
  Info, 
  HelpCircle,
  ClipboardList,
  CheckSquare,
  FileSignature,
  ClipboardCheck,
  Cpu,
  Package,
  History,
  Network
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { projects } = useSelector(state => state.project);
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const isActive = (path) => currentPath === path || currentPath.startsWith(`${path}/`);
  
  // Extract projectId if we are in a project flow
  const projectMatch = currentPath.match(/\/project\/([^\/]+)/);
  const currentProjectId = projectMatch ? projectMatch[1] : null;
  const currentProject = projects.find(p => p.id === currentProjectId);

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-y-auto">
      {/* Main Navigation */}
      <div className="py-6 px-4 flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/dashboard') && !currentPath.includes('/contract')
                  ? 'bg-primary-900/40 text-primary-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/projects"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/projects')
                  ? 'bg-primary-900/40 text-primary-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <FolderOpen size={20} />
              <span>Projects</span>
            </Link>
          </li>
          
         
          
          <li>
            <Link
              to="/outputs"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/outputs')
                  ? 'bg-primary-900/40 text-primary-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <Package size={20} />
              <span>Outputs & Exports</span>
            </Link>
          </li>
          
          {user?.role === 'EXPERT_REVIEWER' && (
            <>
              <li>
                <Link
                  to="/expert-queue"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/expert-queue')
                      ? 'bg-primary-900/40 text-primary-400 font-medium'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                >
                  <ClipboardCheck size={20} />
                  <span>Global Review Queue</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/audit-trail"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive('/audit-trail')
                      ? 'bg-primary-900/40 text-primary-400 font-medium'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }`}
                >
                  <History size={20} />
                  <span>Audit Trail</span>
                </Link>
              </li>
            </>
          )}
          {/* Dynamic Project Menu */}
          {currentProject && (
            <li className="mt-2 mb-4 border-l-2 border-primary-500 ml-4 pl-4 space-y-2">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Active Project
              </div>
              <div className="text-sm font-bold text-white mb-3 truncate" title={currentProject.name}>
                {currentProject.name}
              </div>
              
              <Link
                to={`/project/${currentProjectId}/dashboard`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isActive(`/project/${currentProjectId}/dashboard`) || isActive(`/project/${currentProjectId}/requirements`)
                    ? 'bg-primary-900/40 text-primary-400 font-medium'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <ClipboardList size={16} />
                <span>Requirements</span>
              </Link>
              
              <Link
                to={`/project/${currentProjectId}/generate`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isActive(`/project/${currentProjectId}/generate`) || isActive(`/project/${currentProjectId}/regenerate`)
                    ? 'bg-primary-900/40 text-primary-400 font-medium'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <Cpu size={16} />
                <span>Test Cases (AI)</span>
              </Link>
              
              <Link
                to={`/project/${currentProjectId}/review`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isActive(`/project/${currentProjectId}/review`)
                    ? 'bg-primary-900/40 text-primary-400 font-medium'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <CheckSquare size={16} />
                <span>Expert Review</span>
              </Link>

              <Link
                to={`/project/${currentProjectId}/contract/select`}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  isActive(`/project/${currentProjectId}/contract`)
                    ? 'bg-primary-900/40 text-primary-400 font-medium'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <FileSignature size={16} />
                <span>Contracts & Export</span>
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Management Section */}
      <div className="py-6 px-4 border-t border-gray-800">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-3">
          Management
        </h3>
        <ul className="space-y-1">
          <li>
            <Link
              to="/profile"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/profile')
                  ? 'bg-primary-900/40 text-primary-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <User size={18} />
              <span className="text-sm">Profile</span>
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/settings')
                  ? 'bg-primary-900/40 text-primary-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </Link>
          </li>
          <li>
            <Link
              to="/team"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/team')
                  ? 'bg-primary-900/40 text-primary-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <Users size={18} />
              <span className="text-sm">Team Directory</span>
            </Link>
          </li>
          <li>
            <Link
              to="/roles"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/roles')
                  ? 'bg-primary-900/40 text-primary-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <ShieldCheck size={18} />
              <span className="text-sm">Roles & Permissions</span>
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/about')
                  ? 'bg-primary-900/40 text-primary-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <Info size={18} />
              <span className="text-sm">About</span>
            </Link>
          </li>
          <li>
            <Link
              to="/help"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive('/help')
                  ? 'bg-primary-900/40 text-primary-400 font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <HelpCircle size={18} />
              <span className="text-sm">Help & Support</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
