import { useState, useEffect } from "react";
import { Save, X, FileText, Calendar, AlertCircle, CheckCircle, Edit3 } from "lucide-react";

export default function TaskEditForm({ task, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: task.title || "",
    description: task.description || "",
    deadline: task.deadline ? task.deadline.slice(0, 10) : "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (form.title.length < 3) {
      newErrors.title = "Task title must be at least 3 characters";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    await onSave(form);
    setLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 animate-slide-down">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Edit Task</h3>
              <p className="text-xs text-white/80">Update task details</p>
            </div>
          </div>
          {showSuccess && (
            <div className="flex items-center gap-2 bg-green-500 px-3 py-1.5 rounded-xl animate-slide-in">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-xs text-white font-medium">Saved!</span>
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
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.title ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
              }`}
              placeholder="Enter task title"
              required
            />
          </div>
          {errors.title && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.title}
            </p>
          )}
          {!errors.title && form.title && (
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Title looks good
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
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white"
            placeholder="Describe the task details, requirements, or notes..."
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
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              min={getMinDate()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
          {form.deadline && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                Deadline: <span className="font-semibold">{new Date(form.deadline).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </p>
            </div>
          )}
        </div>

        {/* Task Status Info (if task has status) */}
        {task.status && (
          <div className="mb-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                task.status === 'completed' ? 'bg-green-500' :
                task.status === 'in-progress' ? 'bg-blue-500' :
                'bg-yellow-500'
              }`}></div>
              <p className="text-xs text-gray-600">
                Current Status: <span className="font-semibold text-gray-800">{task.status}</span>
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Changes will be saved and visible to all project members immediately.
              The assignee will be notified of any updates to this task.
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Task ID: {task._id?.slice(-8)}</span>
            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
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