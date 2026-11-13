import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

import LandingPage from './pages/LandingPage';
import Screen0_Auth from './pages/Screen0_Auth';
import DashboardPage from './pages/DashboardPage';
import Screen1_RequirementInput from './pages/Screen1_RequirementInput';
import Screen2_TestCaseGeneration from './pages/Screen2_TestCaseGeneration';
import Screen3_TestCaseReview from './pages/Screen3_TestCaseReview';

import Screen4_TestCaseRegeneration from './pages/Screen4_TestCaseRegeneration';
import Screen5_ContractTemplateSelect from './pages/Screen5_ContractTemplateSelect';
import Screen6_ContractPreview from './pages/Screen6_ContractPreview';
import Screen7_ExportDownload from './pages/Screen7_ExportDownload';

import RolesPermissionsPage from './pages/RolesPermissionsPage';
import ProfilePage from './pages/ProfilePage';
import TeamPage from './pages/TeamPage';
import ProjectsPage from './pages/ProjectsPage';
import PlaceholderPage from './pages/PlaceholderPage';
import SettingsPage from './pages/SettingsPage';
import HelpSupportPage from './pages/HelpSupportPage';
import AboutPage from './pages/AboutPage';
import ProjectDashboardPage from './pages/ProjectDashboardPage';
import ExpertGlobalQueue from './pages/ExpertGlobalQueue';
import OutputsExportsPage from './pages/OutputsExportsPage';
import AuditTrailPage from './pages/AuditTrailPage';
/*import TraceabilityMatrixPage from './pages/TraceabilityMatrixPage';*/
import NotificationsPage from './pages/NotificationsPage';

import Sidebar from './components/common/Sidebar';
import GlobalNavbar from './components/common/GlobalNavbar';

// A simple wrapper to protect routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = React.useState(null);

  // Re-check auth state on mount and custom event
  const checkAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  React.useEffect(() => {
    checkAuth();
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/'; // hard reload to go to landing page
  };

  return (
    <Provider store={store}>
      <Router>
        <div className="h-screen bg-gray-950 text-white font-sans flex flex-col">
          <GlobalNavbar user={user} handleLogout={handleLogout} />

          {/* Main Layout Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar (Only show if logged in) */}
            {user && <Sidebar />}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto">
              <Routes>
                {/* Public Auth & Landing */}
                <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
                <Route path="/login" element={<Screen0_Auth />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
                
                {/* Project Flow */}
                <Route path="/project/:id/dashboard" element={<ProtectedRoute><ProjectDashboardPage /></ProtectedRoute>} />
                <Route path="/project/:id/requirements/new" element={<ProtectedRoute><Screen1_RequirementInput /></ProtectedRoute>} />
                <Route path="/project/:id/generate" element={<ProtectedRoute><Screen2_TestCaseGeneration userRole={user?.role || 'QA_ENGINEER'} /></ProtectedRoute>} />
                <Route path="/project/:id/review" element={<ProtectedRoute><Screen3_TestCaseReview userRole={user?.role || 'QA_ENGINEER'} /></ProtectedRoute>} />
                <Route path="/project/:id/regenerate" element={<ProtectedRoute><Screen4_TestCaseRegeneration /></ProtectedRoute>} />
                <Route path="/project/:id/contract/select" element={<ProtectedRoute><Screen5_ContractTemplateSelect /></ProtectedRoute>} />
                <Route path="/project/:id/contract/edit" element={<ProtectedRoute><Screen6_ContractPreview /></ProtectedRoute>} />
                <Route path="/project/:id/contract/export" element={<ProtectedRoute><Screen7_ExportDownload /></ProtectedRoute>} />
                
                {/* Global Expert Route */}
                <Route path="/expert-queue" element={<ProtectedRoute><ExpertGlobalQueue userRole={user?.role} /></ProtectedRoute>} />
                
                {/* Outputs & Exports */}
                <Route path="/outputs" element={<ProtectedRoute><OutputsExportsPage /></ProtectedRoute>} />
                <Route path="/audit-trail" element={<ProtectedRoute><AuditTrailPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                
                {/* Management Routes */}
                <Route path="/roles" element={<ProtectedRoute><RolesPermissionsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/team" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
                <Route path="/help" element={<ProtectedRoute><HelpSupportPage /></ProtectedRoute>} />
                
                {/* Fallback routing */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
