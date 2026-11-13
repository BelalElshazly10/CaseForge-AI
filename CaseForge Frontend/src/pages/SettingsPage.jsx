import React, { useState } from 'react';
import { User, Shield, Bell, Palette, Sliders, CheckCircle2 } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [strictness, setStrictness] = useState(50);
  const [aiTechniques, setAiTechniques] = useState({
    equivalence: true,
    boundary: true,
    decision: true,
    stateTransition: true,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    expertReview: true,
    projectUpdates: true,
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTechniqueToggle = (key) => {
    setAiTechniques(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and AI configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-2 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'profile' ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <User size={18} /> Account Profile
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ai' ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Sliders size={18} /> AI Preferences
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'notifications' ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Bell size={18} /> Notifications
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'appearance' ? 'bg-primary-600/20 text-primary-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Palette size={18} /> Appearance
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 min-h-[500px]">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="text-primary-400" /> Personal Information
              </h2>
              <form className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input type="text" defaultValue="Belal El Shazly" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                    <input type="email" defaultValue="belal@caseforge.ai" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-500 focus:outline-none" disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Company / Organization</label>
                    <input type="text" defaultValue="CaseForge Inc." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Job Title</label>
                    <input type="text" defaultValue="Lead QA Engineer" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none" />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="button" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* AI PREFERENCES TAB */}
          {activeTab === 'ai' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sliders className="text-primary-400" /> AI Generation Preferences
              </h2>
              <div className="max-w-2xl space-y-8">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Generation Strictness</label>
                  <p className="text-sm text-gray-400 mb-4">Control how rigidly the AI adheres to ISTQB standards vs exploring edge cases.</p>
                  
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={strictness}
                    onChange={(e) => setStrictness(e.target.value)}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  
                  <div className="flex justify-between text-xs font-bold text-gray-500 mt-2 uppercase tracking-wider">
                    <span>Creative (Exploratory)</span>
                    <span className="text-primary-400">{strictness}%</span>
                    <span>Strict (ISTQB Compliant)</span>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-8">
                  <h3 className="text-sm font-medium text-white mb-4">Default Techniques Applied</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer transition-colors ${aiTechniques.equivalence ? 'border border-primary-500/30' : 'border border-gray-700 hover:border-gray-600'}`}>
                      <input type="checkbox" checked={aiTechniques.equivalence} onChange={() => handleTechniqueToggle('equivalence')} className="accent-primary-500 w-4 h-4" />
                      <span className="text-sm text-gray-700 text-gray-300">Equivalence Partitioning</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer transition-colors ${aiTechniques.boundary ? 'border border-primary-500/30' : 'border border-gray-700 hover:border-gray-600'}`}>
                      <input type="checkbox" checked={aiTechniques.boundary} onChange={() => handleTechniqueToggle('boundary')} className="accent-primary-500 w-4 h-4" />
                      <span className="text-sm text-gray-700 text-gray-300">Boundary Value Analysis</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer transition-colors ${aiTechniques.decision ? 'border border-primary-500/30' : 'border border-gray-700 hover:border-gray-600'}`}>
                      <input type="checkbox" checked={aiTechniques.decision} onChange={() => handleTechniqueToggle('decision')} className="accent-primary-500 w-4 h-4" />
                      <span className="text-sm text-gray-700 text-gray-300">Decision Table Testing</span>
                    </label>
                    <label className={`flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer transition-colors ${aiTechniques.stateTransition ? 'border border-primary-500/30' : 'border border-gray-700 hover:border-gray-600'}`}>
                      <input type="checkbox" checked={aiTechniques.stateTransition} onChange={() => handleTechniqueToggle('stateTransition')} className="accent-primary-500 w-4 h-4" />
                      <span className="text-sm text-gray-700 text-gray-300">State Transition Testing</span>
                    </label>
                  </div>
                  <div className="pt-8">
                    <button type="button" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-lg shadow-primary-900/20">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Bell className="text-primary-400" /> Notification Settings
              </h2>
              <div className="max-w-2xl space-y-6">
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-400">Receive daily summaries and critical alerts via email.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('email')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications.email ? 'bg-primary-600' : 'bg-gray-600'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.email ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Expert Review Alerts</h3>
                    <p className="text-sm text-gray-400">Notify me immediately when an Expert reviews my test cases.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('expertReview')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications.expertReview ? 'bg-primary-600' : 'bg-gray-600'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.expertReview ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Project Updates</h3>
                    <p className="text-sm text-gray-400">Notify me when someone invites me to a project or changes my role.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('projectUpdates')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications.projectUpdates ? 'bg-primary-600' : 'bg-gray-600'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.projectUpdates ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Palette className="text-primary-400" /> Appearance
              </h2>
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-4">Theme Preference</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-primary-500 bg-gray-950 p-4 rounded-xl cursor-pointer relative overflow-hidden">
                      <div className="absolute top-2 right-2 text-primary-500"><CheckCircle2 size={20} /></div>
                      <div className="h-20 bg-gray-900 rounded-lg border border-gray-800 mb-3 p-2">
                        <div className="w-1/2 h-2 bg-gray-800 rounded mb-2"></div>
                        <div className="w-3/4 h-2 bg-gray-800 rounded"></div>
                      </div>
                      <p className="text-center text-sm font-bold text-white">Dark Theme</p>
                    </div>
                    <div className="border border-gray-700 bg-gray-100 p-4 rounded-xl cursor-not-allowed opacity-50 relative overflow-hidden">
                      <div className="absolute top-2 right-2 text-gray-400"><Shield size={20} /></div>
                      <div className="h-20 bg-white rounded-lg border border-gray-300 mb-3 p-2">
                        <div className="w-1/2 h-2 bg-gray-200 rounded mb-2"></div>
                        <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                      </div>
                      <p className="text-center text-sm font-bold text-gray-800">Light Theme <span className="text-xs text-primary-600 ml-1">(Coming Soon)</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
