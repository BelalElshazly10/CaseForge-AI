import React from 'react';
import { Sparkles, Terminal, Shield, GitBranch, Globe, Code, Users, Palette, Database } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full animate-fade-in flex flex-col items-center justify-center min-h-[80vh]">
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-600 to-blue-600 mb-6 shadow-xl shadow-primary-900/50">
          <Sparkles size={40} className="text-white" />
        </div>
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400 mb-4">
          CaseForge AI
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Revolutionizing Quality Assurance through Artificial Intelligence. 
          We transform raw requirements into ISTQB-compliant test cases and secure smart contracts in seconds.
        </p>
        <div className="mt-6 inline-block px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-900/20 text-primary-400 text-sm font-bold tracking-widest uppercase">
          Version 1.0.0 (Beta)
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center shadow-lg hover:border-primary-500/50 transition-colors">
          <Terminal size={32} className="text-primary-400 mx-auto mb-4" />
          <h3 className="text-white font-bold mb-2">Automated QA</h3>
          <p className="text-sm text-gray-400">Instantly generate edge cases using Boundary Value Analysis and more.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center shadow-lg hover:border-blue-500/50 transition-colors">
          <Shield size={32} className="text-blue-400 mx-auto mb-4" />
          <h3 className="text-white font-bold mb-2">Smart Contracts</h3>
          <p className="text-sm text-gray-400">Map approved test cases directly to blockchain-ready smart contracts.</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl text-center shadow-lg hover:border-green-500/50 transition-colors">
          <Users size={32} className="text-green-400 mx-auto mb-4" />
          <h3 className="text-white font-bold mb-2">Expert Review</h3>
          <p className="text-sm text-gray-400">Built-in workflows for QA Engineers and Expert Reviewers to collaborate.</p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-12">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Built With Cutting-Edge Tech</h2>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Code size={24} className="text-blue-400" />
            <span className="font-bold">React & Vite</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Palette size={24} className="text-cyan-400" />
            <span className="font-bold">Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Database size={24} className="text-primary-400" />
            <span className="font-bold">Redux Toolkit</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Sparkles size={24} className="text-yellow-400" />
            <span className="font-bold">Google Gemini AI</span>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="flex gap-6 text-gray-500">
        <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
          <GitBranch size={18} /> GitHub Repository
        </a>
        <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
          <Globe size={18} /> Official Website
        </a>
      </div>

    </div>
  );
};

export default AboutPage;
