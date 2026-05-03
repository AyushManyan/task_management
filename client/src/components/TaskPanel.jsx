import { useContext, useEffect, useState } from "react";
import { useRefresh } from "../context/RefreshContext";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import TaskEditForm from "./TaskEditForm";
import { 
  CheckCircle, 
  Clock, 
  Loader2, 
  AlertCircle, 
  User, 
  Calendar,
  ListTodo,
  ChevronUp,
  Edit
} from "lucide-react";

const statusConfig = {
  Pending: { color: "bg-yellow-500", textColor: "text-yellow-700", bgColor: "bg-yellow-50", icon: Clock },
  "In Progress": { color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50", icon: Loader2 },
  Completed: { color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50", icon: CheckCircle },
};

export default function TaskPanel({ projectId, expanded }) {
  const { refresh: globalRefresh } = useRefresh();
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/tasks?project=${projectId}`);
      setTasks(data);
      setFetched(true);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectMembers = async () => {
    try {
      const { data } = await API.get(`/projects/${projectId}`);
      setProjectMembers(data?.members || []);
    } catch {
      setProjectMembers([]);
    }
  };

  useEffect(() => {
    if (!expanded) return;

    fetchTasks();
    if (user?.role === "Admin") {
      fetchProjectMembers();
    }
  }, [expanded, projectId, fetched, globalRefresh]);

  const handleSave = async (task, form) => {
    try {
      setError(null);
      await API.put(`/tasks/${task._id}`, {
        title: form.title,
        description: form.description,
        deadline: form.deadline || null,
      });
      setEditingId(null);
      await fetchTasks();
    } catch {
      setError("Failed to update task");
    }
  };

  const handleReassign = async (taskId, nextAssigneeId) => {
    try {
      setError(null);
      setAssigningId(taskId);
      await API.post(`/tasks/${taskId}/assign`, {
        assignedTo: nextAssigneeId || null,
      });
      await fetchTasks();
    } catch (err) {
      setError(err?.response?.data?.msg || "Failed to reassign task");
    } finally {
      setAssigningId(null);
    }
  };

  // Calculate task statistics
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Completed").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    pending: tasks.filter(t => t.status === "Pending").length
  };

  const completionPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div
      className="overflow-hidden transition-all duration-500 ease-in-out"
      style={{
        maxHeight: expanded ? "2000px" : "0px",
        opacity: expanded ? 1 : 0,
      }}
    >
      <div className="mt-4 pt-4 border-t border-gray-200">
        {/* Tasks Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-primary-600" />
            <h4 className="font-semibold text-gray-800">Project Tasks</h4>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {stats.total} tasks
            </span>
          </div>
          {expanded && tasks.length > 0 && (
            <div className="text-xs text-gray-500 animate-fade-in">
              <ChevronUp className="w-3 h-3 inline ml-1" />
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-3 h-3 text-primary-600 animate-pulse" />
              </div>
            </div>
            <span className="ml-3 text-sm text-gray-500">Loading tasks...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-200 animate-shake">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && tasks.length === 0 && fetched && (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
              <ListTodo className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 font-medium">No tasks yet</p>
            <p className="text-xs text-gray-400 mt-1">Tasks assigned to this project will appear here</p>
          </div>
        )}

        {/* Tasks List */}
        {!loading && !error && tasks.length > 0 && (
          <>
            {/* Progress Summary */}
            <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Task Progress</span>
                <span className="font-semibold text-primary-600">{Math.round(completionPercentage)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">{stats.completed} completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">{stats.inProgress} in progress</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">{stats.pending} pending</span>
                </div>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
              {tasks.map((task, index) => {
                const config = statusConfig[task.status] || statusConfig.Pending;
                const Icon = config.icon;
                const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "Completed";
                
                return (
                  <div
                    key={task._id}
                    className="group bg-white hover:bg-gray-50 rounded-xl p-3 border border-gray-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-fade-up"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    {editingId === task._id ? (
                      <TaskEditForm
                        task={task}
                        onSave={(form) => handleSave(task, form)}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Task Title */}
                          <h5 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">
                            {task.title}
                          </h5>
                          
                          {/* Task Description */}
                          {task.description && (
                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          
                          {/* Task Meta Info */}
                          <div className="flex flex-wrap gap-3 mt-2">
                            {/* Status Badge */}
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
                              <Icon className={`w-3 h-3 ${config.textColor === "text-yellow-700" ? "text-yellow-600" : ""}`} />
                              {task.status}
                            </span>
                            
                            {/* Assignee */}
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <User className="w-3 h-3" />
                              {task.assignedTo?.name || "Unassigned"}
                            </span>
                            
                            {/* Deadline */}
                            <span className={`inline-flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                              <Calendar className="w-3 h-3" />
                              {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                            </span>
                          </div>
                          
                          {/* Overdue Warning */}
                          {isOverdue && (
                            <div className="mt-2 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-red-500" />
                              <span className="text-xs text-red-600 font-medium">Overdue</span>
                            </div>
                          )}

                          {user?.role === "Admin" && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingId(task._id)}
                                className="inline-flex items-center gap-1 bg-yellow-500 text-white px-2.5 py-1 rounded-md text-xs font-medium hover:bg-yellow-600 transition-colors"
                              >
                                <Edit className="w-3 h-3" />
                                Edit Task
                              </button>

                              <select
                                value={task.assignedTo?._id || ""}
                                disabled={assigningId === task._id}
                                onChange={(e) => handleReassign(task._id, e.target.value)}
                                className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white disabled:bg-gray-100"
                              >
                                <option value="">Unassigned</option>
                                {projectMembers.map((member) => (
                                  <option key={member._id} value={member._id}>
                                    {member.name}
                                  </option>
                                ))}
                              </select>

                              {assigningId === task._id && (
                                <span className="inline-flex items-center gap-1 text-xs text-primary-600">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Reassigning...
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Status Indicator Dot */}
                        <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse ml-2 mt-2`}></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(10px);
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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-up {
          animation: fade-up 0.3s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
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
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}