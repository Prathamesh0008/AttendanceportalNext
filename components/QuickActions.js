'use client';

import { 
  CalendarDays, Download, Mail, Send, CheckCircle 
} from 'lucide-react';

const QuickActions = ({ 
  setLeaveOpen,
  sendCustomEmailToEmployee,
  sendDailySummaryToAll,
  empEmail,
  downloadExcel
}) => {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <div className="w-5 h-5 mr-2 text-blue-400">⚡</div>
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          onClick={() => setLeaveOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105"
        >
          <CalendarDays className="w-5 h-5" />
          <span>Apply Leave</span>
        </button>

        <button
          onClick={downloadExcel}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Download className="w-5 h-5" />
          <span>Download Report</span>
        </button>
        
        <button
          onClick={sendCustomEmailToEmployee}
          disabled={!empEmail}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Mail className="w-5 h-5" />
          <span>Email Employee</span>
        </button>
        
        <button
          onClick={sendDailySummaryToAll}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105"
        >
          <Send className="w-5 h-5" />
          <span>Send Daily Summary</span>
        </button>
        
        <button
          onClick={async () => {
            // Test email function
            alert('Test email button clicked - implement this function');
          }}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105"
        >
          <CheckCircle className="w-5 h-5" />
          <span>Test Email</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;