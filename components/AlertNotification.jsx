import { useState } from 'react';
import { Bell, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function AlertNotification({ alerts = [], onClear }) {
  const [visibleAlerts, setVisibleAlerts] = useState(alerts);

  const handleRemove = (id) => {
    setVisibleAlerts(prev => prev.filter(alert => alert.id !== id));
    if (visibleAlerts.length === 1 && onClear) {
      onClear();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <Bell className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="font-medium text-gray-700">Recent Alerts ({visibleAlerts.length})</h3>
        {visibleAlerts.length > 0 && (
          <button
            onClick={() => {
              setVisibleAlerts([]);
              if (onClear) onClear();
            }}
            className="ml-auto text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {visibleAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border ${getBgColor(alert.type)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getIcon(alert.type)}
                <div>
                  <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                  {alert.timestamp && (
                    <p className="text-xs text-gray-500 mt-1">
                      {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemove(alert.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}