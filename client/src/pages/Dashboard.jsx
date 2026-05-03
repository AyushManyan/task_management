import { useContext, useEffect, useState } from "react";
import { useRefresh } from "../context/RefreshContext";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import { 
  LogOut, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Calendar,
  BarChart3,
  LayoutDashboard,
  Projector,
  ListTodo,
  Award,
  Activity
} from "lucide-react";
import ProjectList from "../components/ProjectList";
import TaskList from "../components/TaskList";
import AdminPanel from "../components/AdminPanel";
import MemberTabs from "../components/MemberTabs";

export default function Dashboard() {
  const { refresh: globalRefresh } = useRefresh();
  const { logout, user } = useContext(AuthContext);
  const isAdmin = user && user.role === "Admin";

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const { data } = await API.get("/dashboard");
        setStats(data);
      } catch {
        setStatsError("Failed to load dashboard statistics.");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [globalRefresh]);

  const statCards = [
    { label: isAdmin ? 'Total Projects' : 'Total Tasks', key: 'total', icon: isAdmin ? Projector : ListTodo, color: 'from-blue-500 to-blue-600', textColor: 'text-blue-600' },
    { label: 'Completed', key: 'completed', icon: CheckCircle, color: 'from-green-500 to-green-600', textColor: 'text-green-600' },
    { label: 'In Progress', key: 'inProgress', icon: Activity, color: 'from-cyan-500 to-cyan-600', textColor: 'text-cyan-600' },
    { label: 'Pending', key: 'pending', icon: Clock, color: 'from-yellow-500 to-yellow-600', textColor: 'text-yellow-600' },
    { label: 'Overdue', key: 'overdue', icon: AlertCircle, color: 'from-red-500 to-red-600', textColor: 'text-red-600' },
  ];

  if (!isAdmin && stats?.projectCount) {
    statCards.splice(1, 0, {
      label: 'Projects Involved',
      key: 'projectCount',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600'
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Welcome back, <span className="font-semibold text-primary-600">{user?.name}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Role Badge */}
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                isAdmin 
                  ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700' 
                  : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
              }`}>
                {isAdmin ? 'Admin Portal' : 'Member Portal'}
              </div>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="group flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-xl shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                Analytics Overview
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Real-time statistics for your {isAdmin ? 'projects' : 'tasks'}
              </p>
            </div>
            <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              Live Updates
            </div>
          </div>

          {/* Loading State */}
          {statsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="h-10 w-10 bg-gray-200 rounded-xl mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {statsError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 font-medium">{statsError}</p>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                const value = stats[card.key];
                return (
                  <div
                    key={card.key}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${card.color} shadow-lg mb-4`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-gray-800">{value}</p>
                      <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                    </div>
                    {value > 0 && (
                      <div className="mt-3 flex items-center gap-1 text-xs">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-gray-400">Current status</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Role-specific Content */}
        <div className="space-y-8">
          {isAdmin ? (
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <AdminPanel />
            </div>
          ) : (
            <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <MemberTabs />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary-500" />
              <span>TaskFlow - Team Collaboration Platform</span>
            </div>
            <div className="flex gap-4">
              
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-up {
          animation: fade-up 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}