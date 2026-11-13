import React, { useState, useEffect } from 'react';
import { User, Mail, Key, ShieldCheck, CheckCircle2, AlertTriangle, CalendarDays, Edit3, Camera, Building2, Phone, Briefcase, MapPin, Hash, Users } from 'lucide-react';
import api from '../services/api';

const ProfilePage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: 'QA_ENGINEER',
    status: 'Active',
    vettedLevel: 'ISTQB Level 1',
    joinedDate: 'June 2026',
    clearance: 'Fully Authorized - QA Automation and Strategy Hub',
    company: '',
    age: '',
    mobile_number: '',
    job_title: '',
    department: '',
    location: '',
  });

  const [currentEmail, setCurrentEmail] = useState('');

  // Load from local storage initially
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentEmail(parsed.email);
        setUserData(prev => ({
          ...prev,
          name: parsed.name || '',
          email: parsed.email || '',
          role: parsed.role || prev.role,
          company: parsed.company || '',
          age: parsed.age || '',
          mobile_number: parsed.mobile_number || '',
          job_title: parsed.job_title || '',
          department: parsed.department || '',
          location: parsed.location || '',
        }));
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }
  }, []);

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [generalSuccess, setGeneralSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    
    try {
      const res = await api.put('/auth/profile', {
        current_email: currentEmail,
        name: userData.name,
        email: userData.email,
        company: userData.company || null,
        age: userData.age ? parseInt(userData.age) : null,
        mobile_number: userData.mobile_number || null,
        job_title: userData.job_title || null,
        department: userData.department || null,
        location: userData.location || null,
      });
      
      // Update local storage
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('authChange')); // Trigger navbar update
      setCurrentEmail(res.data.user.email);
      
      setGeneralSuccess(true);
      setTimeout(() => setGeneralSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setErrorMsg('');

    try {
      await api.put('/auth/password', {
        current_email: currentEmail,
        current_password: passwords.current,
        new_password: passwords.new
      });

      setPasswordSuccess(true);
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Failed to update password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Workspace Profile</h1>
        <p className="text-gray-400">Review credentials, edit personal details, and configure account security parameters.</p>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-900/20 border border-red-500/50 p-4 rounded-lg flex items-center gap-3 text-red-400">
          <AlertTriangle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden relative group">
            {/* Background accent */}
            <div className="h-24 bg-gradient-to-r from-primary-900/50 to-indigo-900/50 relative">
              <button className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                <Edit3 size={16} />
              </button>
            </div>
            
            <div className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full border-4 border-gray-900 bg-gray-800 -mt-12 flex items-center justify-center relative overflow-hidden group/avatar cursor-pointer">
                <div className="text-4xl">🤖</div>
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-white mt-4 mb-1">{userData.name}</h2>
              {userData.job_title && (
                <p className="text-sm text-gray-400 mb-1">{userData.job_title}</p>
              )}
              {userData.company && (
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1 justify-center">
                  <Building2 size={12} /> {userData.company}
                </p>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-950/50 text-cyan-400 border border-cyan-900/50 mb-6 uppercase tracking-wider">
                <ShieldCheck size={14} />
                {userData.role}
              </span>

              <div className="w-full space-y-4 text-sm border-t border-gray-800 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Account Status:</span>
                  <span className="flex items-center gap-1.5 text-green-400 font-medium">
                    <CheckCircle2 size={14} />
                    {userData.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Vetted Level:</span>
                  <span className="text-cyan-400 font-medium">{userData.vettedLevel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <CalendarDays size={14} /> Joined Date:
                  </span>
                  <span className="text-gray-700 text-gray-300">{userData.joinedDate}</span>
                </div>
                {userData.mobile_number && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Phone size={14} /> Mobile:
                    </span>
                    <span className="text-gray-700 text-gray-300">{userData.mobile_number}</span>
                  </div>
                )}
                {userData.location && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <MapPin size={14} /> Location:
                    </span>
                    <span className="text-gray-700 text-gray-300">{userData.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Info Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-800 rounded-lg text-cyan-400">
                <User size={20} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">GENERAL PROFILE INFORMATION</h3>
            </div>

            <form onSubmit={handleGeneralSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <User size={16} />
                    </div>
                    <input 
                      type="text" 
                      value={userData.name}
                      onChange={e => setUserData({...userData, name: e.target.value})}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-cyan-500 focus:bg-gray-800 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Mail size={16} />
                    </div>
                    <input 
                      type="email" 
                      value={userData.email}
                      onChange={e => setUserData({...userData, email: e.target.value})}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-cyan-500 focus:bg-gray-800 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Company / Organization</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Building2 size={16} />
                    </div>
                    <input 
                      type="text" 
                      value={userData.company}
                      onChange={e => setUserData({...userData, company: e.target.value})}
                      placeholder="Acme Corp"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:border-cyan-500 focus:bg-gray-800 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Job Title</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Briefcase size={16} />
                    </div>
                    <input 
                      type="text" 
                      value={userData.job_title}
                      onChange={e => setUserData({...userData, job_title: e.target.value})}
                      placeholder="Senior QA Engineer"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:border-cyan-500 focus:bg-gray-800 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Hash size={16} />
                    </div>
                    <input 
                      type="number" 
                      min="16" 
                      max="120"
                      value={userData.age}
                      onChange={e => setUserData({...userData, age: e.target.value})}
                      placeholder="28"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:border-cyan-500 focus:bg-gray-800 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Phone size={16} />
                    </div>
                    <input 
                      type="tel" 
                      value={userData.mobile_number}
                      onChange={e => setUserData({...userData, mobile_number: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:border-cyan-500 focus:bg-gray-800 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Department</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Users size={16} />
                    </div>
                    <input 
                      type="text" 
                      value={userData.department}
                      onChange={e => setUserData({...userData, department: e.target.value})}
                      placeholder="Quality Assurance"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:border-cyan-500 focus:bg-gray-800 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location / Timezone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <MapPin size={16} />
                  </div>
                  <input 
                    type="text" 
                    value={userData.location}
                    onChange={e => setUserData({...userData, location: e.target.value})}
                    placeholder="San Francisco, CA (UTC-8)"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:border-cyan-500 focus:bg-gray-800 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Workspace Access Clearance Group</label>
                <div className="flex items-center gap-3 w-full bg-cyan-950/20 border border-cyan-900/50 rounded-lg px-4 py-3 text-cyan-100">
                  <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                  <span className="text-sm">{userData.clearance}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <div className="flex items-center gap-4">
                  {generalSuccess && (
                    <span className="text-green-400 text-sm flex items-center gap-1.5 animate-fade-in">
                      <CheckCircle2 size={16} /> Saved successfully
                    </span>
                  )}
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ShieldCheck size={18} />}
                    Save General Info
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Password Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-800 rounded-lg text-primary-400">
                <Key size={20} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">UPDATE ACCOUNT PASSWORD</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={passwords.current}
                  onChange={e => setPasswords({...passwords, current: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:bg-gray-800 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">New Security Password</label>
                  <input 
                    type="password" 
                    value={passwords.new}
                    onChange={e => setPasswords({...passwords, new: e.target.value})}
                    placeholder="Min 8 characters"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:bg-gray-800 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwords.confirm}
                    onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                    placeholder="Repeat new password"
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-primary-500 focus:bg-gray-800 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <div className="flex items-center gap-4">
                  {passwordSuccess && (
                    <span className="text-green-400 text-sm flex items-center gap-1.5 animate-fade-in">
                      <CheckCircle2 size={16} /> Password updated
                    </span>
                  )}
                  <button 
                    type="submit" 
                    disabled={isChangingPassword || !passwords.current || !passwords.new || passwords.new !== passwords.confirm}
                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChangingPassword ? 'Updating...' : 'Change Password'}
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
