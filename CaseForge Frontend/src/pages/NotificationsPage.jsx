import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, RefreshCw, FileText, ExternalLink, Filter } from 'lucide-react';
import { markNotificationAsRead, markAllNotificationsAsRead } from '../store/projectSlice';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector(state => state.project.notifications || []);
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'UNREAD'

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'SUBMISSION':
        return <FileText size={20} className="text-blue-400" />;
      case 'REGENERATE':
        return <RefreshCw size={20} className="text-yellow-400" />;
      case 'APPROVED':
        return <CheckCircle2 size={20} className="text-green-400" />;
      default:
        return <Bell size={20} className="text-primary-400" />;
    }
  };

  const getBgColor = (type, read) => {
    if (read) return 'bg-gray-900 border-gray-800 opacity-60 hover:opacity-100';
    switch (type) {
      case 'SUBMISSION':
        return 'bg-blue-900/10 border-blue-500/30';
      case 'REGENERATE':
        return 'bg-yellow-900/10 border-yellow-500/30';
      case 'APPROVED':
        return 'bg-green-900/10 border-green-500/30';
      default:
        return 'bg-primary-900/10 border-primary-500/30';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full animate-fade-in relative pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary-900/40 flex items-center justify-center border border-primary-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Bell className="text-primary-400" size={24} />
            </div>
            Notification Center
          </h1>
          <p className="text-gray-400">Stay updated on your team's testing activities.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-1 flex items-center">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-1.5 text-sm font-bold rounded transition-colors ${filter === 'ALL' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700 text-gray-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('UNREAD')}
              className={`px-4 py-1.5 text-sm font-bold rounded transition-colors ${filter === 'UNREAD' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-700 text-gray-300'}`}
            >
              Unread
            </button>
          </div>
          <button 
            onClick={() => dispatch(markAllNotificationsAsRead())}
            className="bg-gray-800 hover:bg-gray-700 text-gray-700 text-gray-300 font-bold py-2.5 px-4 rounded-lg border border-gray-700 transition-colors"
          >
            Mark all read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifs.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 border border-gray-800 rounded-3xl">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="text-gray-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">All caught up!</h3>
            <p className="text-gray-500 max-w-sm mx-auto">You don't have any notifications matching this filter.</p>
          </div>
        ) : (
          filteredNotifs.map(notif => (
            <div 
              key={notif.id}
              onClick={() => {
                dispatch(markNotificationAsRead(notif.id));
                navigate(notif.link);
              }}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start group hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/10 ${getBgColor(notif.type, notif.read)}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border bg-gray-950 transition-colors ${notif.read ? 'border-gray-800' : 'border-gray-700 group-hover:border-primary-500/50'}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-lg font-bold ${notif.read ? 'text-gray-400' : 'text-white group-hover:text-primary-300 transition-colors'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">{notif.time}</span>
                </div>
                <p className={`text-sm mb-3 ${notif.read ? 'text-gray-500' : 'text-gray-700 text-gray-300'}`}>
                  {notif.message}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details <ExternalLink size={12} />
                </div>
              </div>
              {!notif.read && (
                <div className="w-3 h-3 rounded-full bg-primary-500 shrink-0 mt-2 shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
