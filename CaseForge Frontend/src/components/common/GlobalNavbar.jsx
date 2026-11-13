import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Users, Bell } from 'lucide-react';
import ManageTeamModal from './ManageTeamModal';
import { openManageTeamModal, closeManageTeamModal } from '../../store/projectSlice';

const GlobalNavbar = ({ user, handleLogout }) => {
  const dispatch = useDispatch();
  const { projects, isManageTeamModalOpen, notifications = [] } = useSelector(state => state.project);
  const unreadCount = notifications.filter(n => !n.read).length;
  const location = useLocation();
  
  // Auto-detect project from URL e.g. /project/prj-001/requirements
  const projectMatch = location.pathname.match(/\/project\/([^\/]+)/);
  const currentProjectId = projectMatch ? projectMatch[1] : null;
  const currentProject = projects.find(p => p.id === currentProjectId);

  return (
    <>
      <nav className="border-b border-purple-900/30 bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="font-bold text-white text-lg">CF</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                CaseForge <span className="text-purple-400">AI</span>
              </span>
            </Link>
            <div className="flex items-center space-x-6">

              {user ? (
                <>
                  <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-purple-400 transition-colors bg-gray-800/50 hover:bg-gray-800 rounded-full border border-gray-700 hover:border-purple-500/50">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-gray-900 shadow-sm animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link to="/profile" className="flex items-center gap-3 group">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{user.name}</p>
                      <p className="text-xs text-purple-400">{user.role}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gray-800 border-2 border-gray-700 group-hover:border-purple-500 flex items-center justify-center overflow-hidden transition-all shadow-lg">
                      <span className="text-xl">🤖</span>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-800 hover:bg-red-900/30 border border-gray-700 hover:border-red-500/50 text-gray-300 hover:text-red-400 text-sm px-3 py-1.5 rounded transition-colors ml-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-sm text-purple-400 hover:text-purple-300 font-bold">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Render the modal globally if we are editing a project team here */}
      <ManageTeamModal 
        isOpen={isManageTeamModalOpen}
        onClose={() => dispatch(closeManageTeamModal())}
        project={currentProject}
      />
    </>
  );
};

export default GlobalNavbar;
