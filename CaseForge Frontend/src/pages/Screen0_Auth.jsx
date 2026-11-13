import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Screen0_Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'QA_ENGINEER'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

   try {
  let response;

  if (isLogin) {
    response = await api.post('/login', {
      email: formData.email,
      password: formData.password,
    });
  } else {
    await api.post('/register', {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    response = await api.post('/login', {
      email: formData.email,
      password: formData.password,
    });
  }

  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify({
    name: response.data.name,
    email: response.data.email,
    role: response.data.role
  }));

  window.dispatchEvent(new Event('authChange'));
  navigate('/dashboard');
} catch (err) {
  setError(err.response?.data?.error || "Authentication failed. Please check your credentials.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-950 font-sans">
      {/* Left side: Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 bg-gradient-to-br from-primary-950 to-gray-950 relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-600 blur-[120px]"></div>
          <div className="absolute top-[60%] left-[50%] w-[50%] h-[50%] rounded-full bg-blue-600 blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
             <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span className="font-bold text-white text-3xl">CF</span>
             </div>
             <h1 className="text-5xl font-bold text-white tracking-tight">CaseForge <span className="text-primary-400">AI</span></h1>
          </div>
          <p className="text-2xl text-gray-700 text-gray-300 font-light max-w-lg leading-relaxed">
            AI-Powered ISTQB-Compliant Test Case & Contract Generation Platform
          </p>
          <div className="mt-12 space-y-6 text-gray-400">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-primary-900/50 flex items-center justify-center text-primary-400">✓</div>
              <span>Automated Requirement Auto-Fixing</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-primary-900/50 flex items-center justify-center text-primary-400">✓</div>
              <span>ISTQB Technique Application</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-primary-900/50 flex items-center justify-center text-primary-400">✓</div>
              <span>Role-Based Expert Review Workflows</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Enter your credentials to access your workspace' : 'Sign up to start generating AI test cases'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-900/30 border border-red-500/50 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none appearance-none"
                >
                  <option value="QA_ENGINEER">QA Engineer</option>
                  <option value="EXPERT_REVIEWER">Expert Reviewer</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-lg transition-all mt-8"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Please wait...
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screen0_Auth;
