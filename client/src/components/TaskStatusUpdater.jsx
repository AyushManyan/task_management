import { useContext, useState } from "react";
import { useRefresh } from "../context/RefreshContext";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { 
  CheckCircle, 
  Clock, 
  Loader2, 
  RefreshCw,
  AlertCircle,
  Zap
} from "lucide-react";

export default function TaskStatusUpdater({ task, onStatusChange, showQuickButtons = true }) {
  const { triggerRefresh } = useRefresh();
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await API.patch(`/tasks/${task._id}/status`, { status: newStatus });
      setStatus(newStatus);
      onStatusChange && onStatusChange(newStatus);
      triggerRefresh(); // Notify global refresh
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      setError("Failed to update status");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.id !== task.assignedTo?._id) return null;

  const statusOptions = [
    { value: "Pending", label: "Pending", icon: Clock, color: "bg-yellow-500", hoverColor: "hover:bg-yellow-600", textColor: "text-yellow-700" },
    { value: "In Progress", label: "In Progress", icon: Loader2, color: "bg-blue-500", hoverColor: "hover:bg-blue-600", textColor: "text-blue-700" },
    { value: "Completed", label: "Completed", icon: CheckCircle, color: "bg-green-500", hoverColor: "hover:bg-green-600", textColor: "text-green-700" }
  ];

  const currentStatus = statusOptions.find(opt => opt.value === status);

  return (
    <div className="mt-3">
      {/* Quick Action Buttons (Optional) */}
      {showQuickButtons && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">Quick Actions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(option => {
              const Icon = option.icon;
              const isActive = status === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleUpdate(option.value)}
                  disabled={loading || isActive}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all transform hover:scale-105
                    ${isActive 
                      ? `${option.color} text-white shadow-md` 
                      : `bg-gray-100 text-gray-600 hover:${option.hoverColor} hover:text-white`
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  `}
                >
                  <Icon className={`w-3 h-3 ${isActive ? "text-white" : ""}`} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dropdown Selector (Alternative to Quick Buttons) */}
      {!showQuickButtons && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Update Status
            </label>
            <select
              value={status}
              onChange={(e) => handleUpdate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white cursor-pointer"
              disabled={loading}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Current Status Display */}
      <div className="mt-2 flex items-center gap-2">
        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${currentStatus?.color} bg-opacity-10`}>
          {currentStatus && <currentStatus.icon className={`w-3 h-3 ${currentStatus.textColor}`} />}
          <span className={`text-xs font-medium ${currentStatus?.textColor}`}>
            Current: {status}
          </span>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200 animate-slide-down">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <p className="text-xs text-green-700">Status updated successfully!</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200 animate-shake">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-red-600" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}