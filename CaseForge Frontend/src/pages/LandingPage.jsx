import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Network, Bot, Users, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-y-auto">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded flex items-center justify-center font-bold text-xl text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            CF
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">CaseForge AI</span>
        </div>
        <div>
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-full border border-primary-500/50 text-primary-400 hover:bg-primary-900/20 hover:text-primary-300 font-semibold transition-all"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-8 pt-32 pb-40 overflow-hidden flex flex-col items-center text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 z-10 max-w-5xl">
          Automate QA with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-600">CaseForge AI</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl z-10">
          The ultimate AI-powered test generation and traceability platform. Instantly convert product requirements into comprehensive, ISTQB-compliant test cases.
        </p>
        <div className="flex gap-4 z-10">
          <Link
            to="/login"
            className="px-8 py-4 rounded-full bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)]"
          >
            Get Started Free
          </Link>
          <a
            href="#about"
            className="px-8 py-4 rounded-full border border-gray-700 bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg transition-all"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="border-y border-gray-800 bg-gray-900/50 py-16">
        <div className="max-w-6xl mx-auto px-8 flex flex-wrap justify-between items-center gap-10">
          <div className="text-center flex-1">
            <h3 className="text-5xl font-extrabold text-primary-400 mb-2">10,000+</h3>
            <p className="text-gray-400 font-medium">Test Cases Generated</p>
          </div>
          <div className="text-center flex-1 border-l border-r border-gray-800 px-8">
            <h3 className="text-5xl font-extrabold text-primary-400 mb-2">500+</h3>
            <p className="text-gray-400 font-medium">Active Projects</p>
          </div>
          <div className="text-center flex-1">
            <h3 className="text-5xl font-extrabold text-primary-400 mb-2">95%</h3>
            <p className="text-gray-400 font-medium">Time Saved on QA</p>
          </div>
        </div>
      </section>

      {/* About Us / What We Do */}
      <section id="about" className="py-32 px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What We Do</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              CaseForge AI bridges the gap between product management and quality assurance. We use advanced LLMs to parse complex requirements, generate edge cases, and maintain perfect traceability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-primary-500/50 transition-all group">
              <div className="w-14 h-14 bg-primary-900/30 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
                <Bot className="text-primary-400 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Requirement Parsing</h3>
              <p className="text-gray-400 leading-relaxed">
                Upload your PRDs, PDFs, or User Stories. Our AI instantly extracts requirements, detects ambiguities, and structures them for testing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-primary-500/50 transition-all group">
              <div className="w-14 h-14 bg-primary-900/30 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
                <Zap className="text-primary-400 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Test Generation</h3>
              <p className="text-gray-400 leading-relaxed">
                Automatically apply testing techniques like Equivalence Partitioning and Boundary Value Analysis to generate comprehensive test suites in seconds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-primary-500/50 transition-all group">
              <div className="w-14 h-14 bg-primary-900/30 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
                <Network className="text-primary-400 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Traceability Matrix</h3>
              <p className="text-gray-400 leading-relaxed">
                Never miss an edge case. Our dynamic traceability board maps every test case back to its origin requirement to guarantee 100% test coverage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Compliance */}
      <section className="py-24 px-8 bg-gray-900/30 border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Built for Expert Teams</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="text-primary-500" size={20} /> ISTQB Compliant Methodologies
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="text-primary-500" size={20} /> Multi-tier Expert Review System
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="text-primary-500" size={20} /> Automated Contract Generation
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <CheckCircle className="text-primary-500" size={20} /> End-to-end Audit Trails
              </li>
            </ul>
          </div>
          <div className="flex-1 relative">
             <div className="absolute inset-0 bg-primary-600/10 blur-3xl rounded-full"></div>
             <div className="relative bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl">
               <div className="flex items-center gap-4 border-b border-gray-800 pb-4 mb-4">
                 <ShieldCheck className="text-primary-400" size={32} />
                 <div>
                   <h4 className="font-bold">Enterprise Security</h4>
                   <p className="text-sm text-gray-500">Bank-grade encryption for your PRDs</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <Users className="text-primary-400" size={32} />
                 <div>
                   <h4 className="font-bold">Role-Based Access</h4>
                   <p className="text-sm text-gray-500">QA, Reviewers, and Project Owners</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-12 border-t border-gray-900 text-center text-gray-500">
        <p>© 2026 CaseForge AI. All rights reserved.</p>
        <p className="mt-2 text-sm">Empowering Quality Assurance with Artificial Intelligence.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
