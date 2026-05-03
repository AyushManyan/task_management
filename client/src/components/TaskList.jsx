import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import TaskStatusUpdater from "./TaskStatusUpdater";
import TaskEditForm from "./TaskEditForm";
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  FolderOpen, 
  AlertCircle,
  Edit,
  Trash2,
  Filter,
  Search,
  ChevronDown,
  X,
  Loader2
} from "lucide-react";

function isOverdue(task) {
  return task.deadline && new Date(task.deadline) < new Date() && task.status !== "Completed";
}

export default function TaskList({ onlyMine = true }) {
  const { user } = useContext(AuthContext);
  const userId = user?.id || user?._id;
  const [tasks, setTasks] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTasks = async () => {
    if (onlyMine && !userId) {
      setTasks([]);
      setInitialLoading(false);
      return;
    }

    try {
      setError(null);
      let url = "/tasks";
      if (onlyMine) url += `?assignedTo=${userId}`;
      const { data } = await API.get(url);
      setTasks(data);
    } catch {
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [onlyMine, userId]);

  const handleStatusChange = async (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    // Re-fetch tasks from server to ensure UI is up-to-date
    await fetchTasks();
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) return;
    setDeletingId(task._id);
    try {
      await API.delete(`/tasks/${task._id}`);
      setTasks(prev => prev.filter(t => t._id !== task._id));
    } catch {
      setError("Failed to delete task. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async (task, form) => {
    try {
      setError(null);
      await API.put(`/tasks/${task._id}`, {
        title: form.title,
        description: form.description,
        ...(form.deadline ? { deadline: form.deadline } : {}),
      });
      setEditingId(null);
      await fetchTasks();
    } catch (err) {
      console.error("Task save error:", err?.response?.data || err);
      setError("Failed to save task. Please try again.");
      setEditingId(null);
    }
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Completed").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    pending: tasks.filter(t => t.status === "Pending").length,
    overdue: tasks.filter(isOverdue).length
  };

  const getStatusColor = (status) => {
    const colors = {
      "Completed": "bg-gradient-to-r from-green-500 to-green-600",
      "In Progress": "bg-gradient-to-r from-blue-500 to-blue-600",
      "Pending": "bg-gradient-to-r from-yellow-500 to-yellow-600",
      default: "bg-gradient-to-r from-gray-500 to-gray-600"
    };
    return colors[status] || colors.default;
  };

  const getStatusIcon = (status) => {
    if (status === "Completed") return <CheckCircle className="w-4 h-4" />;
    if (status === "In Progress") return <Loader2 className="w-4 h-4 animate-spin" />;
    return <Clock className="w-4 h-4" />;
  };

  if (initialLoading) return (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock className="w-6 h-6 text-primary-600 animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {onlyMine ? "My Tasks" : "All Tasks"}
              <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                {stats.total} tasks
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage your assigned tasks
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="flex gap-2">
            <div className="bg-green-50 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-green-600">Completed</p>
            </div>
            <div className="bg-blue-50 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-xs text-blue-600">In Progress</p>
            </div>
            <div className="bg-yellow-50 rounded-xl px-3 py-2 text-center">
              <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-yellow-600">Pending</p>
            </div>
            {stats.overdue > 0 && (
              <div className="bg-red-50 rounded-xl px-3 py-2 text-center">
                <p className="text-lg font-bold text-red-600">{stats.overdue}</p>
                <p className="text-xs text-red-600">Overdue</p>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
            >
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                {statusFilter === "all" ? "All Status" : statusFilter}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 animate-fade-down">
                {["all", "Pending", "In Progress", "Completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setShowFilters(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl ${
                      statusFilter === status ? "text-primary-600 bg-primary-50" : "text-gray-700"
                    }`}
                  >
                    {status === "all" ? "All Tasks" : status}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {(searchTerm || statusFilter !== "all") && (
            <button
              onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
              className="flex items-center gap-1 px-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-all"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          {searchTerm || statusFilter !== "all" ? (
            <>
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No matching tasks</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </>
          ) : (
            <>
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No tasks found</h3>
              <p className="text-sm text-gray-500">Tasks assigned to you will appear here</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTasks.map((task, index) => {
            const overdue = isOverdue(task);
            return (
              <div
                key={task._id}
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border animate-fade-up hover:-translate-y-1 ${
                  overdue ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-100'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {editingId === task._id ? (
                  <div className="p-6">
                    <TaskEditForm
                      task={task}
                      onSave={(form) => handleSave(task, form)}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <div className="p-6">
                    {/* Task Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)} text-white`}>
                            {getStatusIcon(task.status)}
                            {task.status}
                          </span>
                          {overdue && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <AlertCircle className="w-3 h-3" />
                              Overdue
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(task.status)} shadow-md`}>
                        {getStatusIcon(task.status)}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {task.description || "No description provided"}
                    </p>

                    {/* Project Info */}
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FolderOpen className="w-4 h-4 text-primary-500" />
                        <span className="font-medium">Project:</span>
                        <span>{task.project?.name || "Unassigned"}</span>
                      </div>
                    </div>

                    {/* Deadline Info */}
                    <div className="mb-4 flex items-center gap-2 text-sm">
                      <Calendar className={`w-4 h-4 ${overdue ? 'text-red-500' : 'text-gray-400'}`} />
                      <span className={overdue ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                        Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        }) : "No deadline"}
                      </span>
                    </div>

                    {/* Status Updater */}
                    <div className="mb-4">
                      <TaskStatusUpdater task={task} onStatusChange={status => handleStatusChange(task._id, status)} />
                    </div>

                    {/* Action Buttons */}
                    {user?.role === "Admin" && (
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button
                          className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-all transform hover:scale-105"
                          onClick={() => setEditingId(task._id)}
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          className="flex items-center gap-1 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-all transform hover:scale-105 disabled:opacity-50"
                          onClick={() => handleDelete(task)}
                          disabled={deletingId === task._id}
                        >
                          {deletingId === task._id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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
        
        @keyframes fade-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-up {
          animation: fade-up 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-down {
          animation: fade-down 0.2s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}