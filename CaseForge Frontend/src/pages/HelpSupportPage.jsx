import React, { useState } from 'react';
import { HelpCircle, BookOpen, MessageSquare, ExternalLink, ChevronDown, ChevronUp, Cpu, Server } from 'lucide-react';

const HelpSupportPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { 
      q: "How does the AI generate test cases?", 
      a: "The AI parses your requirements and applies established ISTQB techniques such as Equivalence Partitioning and Boundary Value Analysis to generate comprehensive edge cases." 
    },
    { 
      q: "What is the difference between 'Creative' and 'Strict' AI Generation?", 
      a: "Strict generation strictly follows ISTQB formats and sticks closely to the provided requirements. Creative generation allows the AI to invent hypothetical edge cases and exploratory scenarios not explicitly stated in the requirements." 
    },
    { 
      q: "How do Expert Reviews work?", 
      a: "Once a QA Engineer generates test cases, they can submit them for review. Only users with the 'Expert Reviewer' role can approve or reject these test cases. Once approved, you can proceed to Contract Generation." 
    },
    { 
      q: "Can I edit test cases manually?", 
      a: "Yes! While the AI generates the initial set, QA Engineers have full ability to edit descriptions, techniques, and priorities before submitting them for review." 
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto w-full animate-fade-in">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Help & Support</h1>
          <p className="text-gray-400">Everything you need to master CaseForge AI.</p>
        </div>
        
        {/* System Status */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Gemini API Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-bold text-green-400">Operational</span>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-800 mx-1"></div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">Web App</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm font-bold text-green-400">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Knowledge Base & Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Interactive Knowledge Base */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="text-primary-400" /> Interactive Knowledge Base
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 hover:border-primary-500/50 transition-colors p-6 rounded-xl cursor-pointer group">
                <div className="bg-primary-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <Cpu size={24} />
                </div>
                <h3 className="text-white font-bold mb-2">Writing Good Requirements</h3>
                <p className="text-gray-400 text-sm">Learn how to format your inputs so the AI generates the most accurate ISTQB scenarios.</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition-colors p-6 rounded-xl cursor-pointer group">
                <div className="bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Server size={24} />
                </div>
                <h3 className="text-white font-bold mb-2">Contract Generation</h3>
                <p className="text-gray-400 text-sm">Understand how approved test cases are automatically mapped to smart contracts.</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="text-primary-400" /> Contact Support
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Issue Type</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none">
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                    <option>Billing Question</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Severity</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-primary-500 focus:outline-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:outline-none h-32 resize-none"
                  placeholder="Describe your issue in detail..."
                ></textarea>
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Submit Ticket
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: FAQ */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <HelpCircle className="text-primary-400" /> Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-800/50 transition-colors"
                >
                  <span className="font-medium text-white">{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={20} className="text-primary-400" /> : <ChevronDown size={20} className="text-gray-500" />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 border-t border-gray-800 text-gray-400 text-sm leading-relaxed bg-gray-800/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 border border-primary-500/30 bg-primary-900/10 rounded-xl flex items-start gap-3">
            <ExternalLink className="text-primary-400 shrink-0 mt-1" size={20} />
            <div>
              <h4 className="text-white font-bold text-sm">Need more help?</h4>
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Check out our official documentation at <a href="#" className="text-primary-400 hover:underline">docs.caseforge.ai</a> for deep-dives into the API and advanced configurations.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpSupportPage;
