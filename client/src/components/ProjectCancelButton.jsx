import { useState } from "react";
import { Trash2, AlertCircle, X, Loader2 } from "lucide-react";

export default function ProjectCancelButton({ projectId, onCancel, projectName = "" }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    await onCancel();
    setLoading(false);
    setShowConfirm(false);
  };

  return (
    <>
      {/* Cancel Button */}
      <button
        className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:scale-105 active:scale-95"
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        <span className="flex items-center gap-2">
          <Trash2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
          <span>Cancel Project</span>
        </span>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-up overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Cancel Project</h3>
                </div>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-gray-700 font-medium mb-1">
                    Are you sure you want to cancel this project?
                  </p>
                  {projectName && (
                    <p className="text-sm text-gray-500">
                      Project: <span className="font-semibold text-gray-700">"{projectName}"</span>
                    </p>
                  )}
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    This action cannot be undone!
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Keep Project
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Yes, Cancel Project</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-up {
          animation: scale-up 0.2s ease-out;
        }
      `}</style>
    </>
  );
}