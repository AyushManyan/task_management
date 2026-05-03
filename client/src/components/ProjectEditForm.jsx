import { useState } from "react";
import { Save, X, FolderEdit, AlertCircle, CheckCircle } from "lucide-react";

export default function ProjectEditForm({ project, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: project.name || "",
    description: project.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Project name is required";
    } else if (form.name.length < 3) {
      newErrors.name = "Project name must be at least 3 characters";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    // Clear error when user starts typing
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
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl overflow-hidden animate-slide-down border border-gray-200">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <FolderEdit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Edit Project</h3>
            <p className="text-xs text-white/80">Update project details</p>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Project Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Project Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
              }`}
              placeholder="Enter project name"
              required
            />
            {errors.name && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.name && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
          {!errors.name && form.name && (
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Project name looks good
            </p>
          )}
        </div>

        {/* Description Field */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
            <span className="text-xs text-gray-400 font-normal ml-2">(Optional)</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none bg-white"
            placeholder="Describe what this project is about..."
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-400">
              Provide a clear description for team members
            </p>
            <p className="text-xs text-gray-400">
              {form.description.length} characters
            </p>
          </div>
        </div>

        {/* Character counter for name */}
        <div className="text-right mb-4">
          <p className={`text-xs ${form.name.length >= 3 ? "text-green-500" : "text-gray-400"}`}>
            {form.name.length}/50 characters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-md"
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
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-700 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Changes will be reflected immediately for all team members
          </p>
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
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}