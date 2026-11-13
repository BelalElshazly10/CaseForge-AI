import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Users, Printer } from 'lucide-react';
import api from '../services/api';
import { openManageTeamModal } from '../store/projectSlice';

const Screen7_ExportDownload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async (format) => {
    try {
      const response = await api.get(`/test-cases/projects/${id || 'proj-123'}/export?format=${format.toLowerCase()}`);
      
      // Extract data depending on format
      let dataStr = "";
      if (format === 'csv') {
        dataStr = response.data.data;
      } else {
        dataStr = JSON.stringify(response.data.data, null, 2);
      }
      
      // Trigger browser download
      const blob = new Blob([dataStr], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Project_${id || 'Contract'}_Export.${format.toLowerCase()}`;
      a.click();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.warn("API Export Error:", err);
      
      // Fallback mock download if API fails
      let dataStr = "";
      if (format === 'csv') {
        dataStr = "ID,Title,Priority,Status\nTC-001,Valid Login,CRITICAL,APPROVED\nTC-002,Invalid Password,HIGH,APPROVED";
      } else {
        dataStr = JSON.stringify([
          { id: 'TC-001', title: 'Valid Login', priority: 'CRITICAL', status: 'APPROVED' },
          { id: 'TC-002', title: 'Invalid Password', priority: 'HIGH', status: 'APPROVED' }
        ], null, 2);
      }

      const blob = new Blob([dataStr], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Project_${id || 'Contract'}_Export.${format.toLowerCase()}`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-primary-950 to-gray-950 p-8">
      {/* Header with Manage Team */}
      <div className="flex justify-end mb-8 w-full max-w-4xl mx-auto">
        <button
          onClick={() => dispatch(openManageTeamModal())}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-primary-900/20"
        >
          <Users size={18} /> Manage Team
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-gray-900 border border-green-500/30 rounded-lg shadow-2xl p-10 text-center">
          
          <div className="w-24 h-24 bg-green-900/30 rounded-full flex items-center justify-center text-green-500 text-5xl mx-auto mb-6">
            ✓
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Contract Finalized</h1>
          <p className="text-gray-400 text-lg mb-10">
            Your AI-generated contract and test cases have been securely saved and are ready for download.
          </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <button
            onClick={() => handleDownload('csv')}
            className="flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-100 font-bold py-4 px-6 rounded-lg transition-all text-lg"
          >
            <span>📄</span> CSV
          </button>
          
          <button
            onClick={() => handleDownload('json')}
            className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-blue-100 font-bold py-4 px-6 rounded-lg transition-all text-lg"
          >
            <span>📝</span> JSON
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 font-bold py-4 px-6 rounded-lg transition-all text-lg"
          >
            <Printer size={20} /> Print
          </button>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="text-primary-400 hover:text-primary-300 font-semibold underline"
        >
          Return to Dashboard
        </button>

        </div>
      </div>
    </div>
  );
};

export default Screen7_ExportDownload;
