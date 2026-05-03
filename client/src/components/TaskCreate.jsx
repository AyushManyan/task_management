import { useState, useEffect } from "react";
import API from "../services/api";
import { 
  PlusCircle, 
  User, 
  Calendar, 
  FileText, 
  AlertCircle,
  CheckCircle,
  X,
  Users,
  Clock
} from "lucide-react";

export default function TaskCreate({ projectId, onCreated }) {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", assignedTo: "", deadline: "" });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!projectId) return;
    API.get(`/projects/${projectId}`).then(({ data }) => {
      setMembers(data.members || []);
    });
  }, [projectId]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Task title is required";
    if (!form.assignedTo) newErrors.assignedTo = "Please assign a team member";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    try {
      await API.post("/tasks", { ...form, project: projectId });
      setForm({ title: "", description: "", assignedTo: "", deadline: "" });
      setErrors({});
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      if (onCreated) onCreated();
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getSelectedMember = () => {
    return members.find(m => m._id === form.assignedTo);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 animate-slide-down">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create New Task</h3>
              <p className="text-xs text-white/80">Assign and track project tasks</p>
            </div>
          </div>
          {showSuccess && (
            <div className="flex items-center gap-2 bg-green-500 px-3 py-1.5 rounded-xl animate-slide-in">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-xs text-white font-medium">Task Created!</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Task Title Field */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Task Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className={`w-5 h-5 transition-colors ${errors.title ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              placeholder="Enter task title"
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.title ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
              }`}
              value={form.title}
              onChange={e => {
                setForm(f => ({ ...f, title: e.target.value }));
                if (errors.title) setErrors({ ...errors, title: "" });
              }}
              required
            />
          </div>
          {errors.title && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
            <span className="text-xs text-gray-400 font-normal ml-2">(Optional)</span>
          </label>
          <textarea
            placeholder="Describe the task details, requirements, or notes..."
            rows="3"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none bg-white"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-400">
              Provide clear instructions for the assignee
            </p>
            <p className="text-xs text-gray-400">
              {form.description.length} characters
            </p>
          </div>
        </div>

        {/* Assign To Field */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Assign To <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className={`w-5 h-5 transition-colors ${errors.assignedTo ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <select
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none cursor-pointer ${
                errors.assignedTo ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
              }`}
              value={form.assignedTo}
              onChange={e => {
                setForm(f => ({ ...f, assignedTo: e.target.value }));
                if (errors.assignedTo) setErrors({ ...errors, assignedTo: "" });
              }}
              required
            >
              <option value="" disabled>Select team member...</option>
              {members.map(m => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Users className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          {errors.assignedTo && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.assignedTo}
            </p>
          )}
          
          {/* Selected Member Preview */}
          {form.assignedTo && getSelectedMember() && (
            <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-gray-700">
                Assigning to: <span className="font-semibold text-green-700">{getSelectedMember().name}</span>
              </span>
            </div>
          )}
        </div>

        {/* Deadline Field */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deadline
            <span className="text-xs text-gray-400 font-normal ml-2">(Optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
              value={form.deadline}
              min={getMinDate()}
              onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
            />
          </div>
          {form.deadline && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Deadline set for {new Date(form.deadline).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Task...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Create Task</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setForm({ title: "", description: "", assignedTo: "", deadline: "" });
              setErrors({});
            }}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Once created, the task will be visible to all project members. 
              The assignee will receive a notification about this new task.
            </p>
          </div>
        </div>

        {/* Members Count */}
        {members.length === 0 && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-xs text-yellow-700 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              No members assigned to this project yet. Please add members first.
            </p>
          </div>
        )}
      </form>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}