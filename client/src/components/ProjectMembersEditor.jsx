import { useState, useEffect } from "react";
import API from "../services/api";
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  X, 
  Save, 
  Search,
  CheckCircle,
  AlertCircle,
  Shield,
  Mail,
  UserCheck
} from "lucide-react";

export default function ProjectMembersEditor({ project, onSave, onCancel }) {
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState(project.members.map(m => m._id));
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    API.get("/auth/users").then(({ data }) => setUsers(data));
  }, []);

  const handleAdd = (id) => {
    if (!members.includes(id)) setMembers([...members, id]);
  };

  const handleRemove = (id) => {
    setMembers(members.filter(m => m !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(members);
    setLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const availableUsers = users.filter(u => !members.includes(u._id));
  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role) => {
    const colors = {
      Admin: "bg-gradient-to-r from-purple-500 to-purple-600",
      Manager: "bg-gradient-to-r from-blue-500 to-blue-600",
      Member: "bg-gradient-to-r from-green-500 to-green-600",
      default: "bg-gradient-to-r from-gray-500 to-gray-600"
    };
    return colors[role] || colors.default;
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 animate-slide-down">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Edit Team Members</h3>
              <p className="text-xs text-white/80">Manage project team members</p>
            </div>
          </div>
          {showSuccess && (
            <div className="flex items-center gap-2 bg-green-500 px-3 py-1.5 rounded-xl animate-slide-in">
              <CheckCircle className="w-4 h-4 text-white" />
              <span className="text-xs text-white font-medium">Members Updated!</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Current Members Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-primary-600" />
              <label className="text-sm font-semibold text-gray-700">
                Current Team Members
              </label>
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                {members.length} members
              </span>
            </div>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No members assigned yet</p>
              <p className="text-xs text-gray-400">Add members using the dropdown below</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-1">
              {members.map(memberId => {
                const member = users.find(u => u._id === memberId);
                if (!member) return null;
                return (
                  <div
                    key={memberId}
                    className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 group hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${getRoleBadgeColor(member.role)} flex items-center justify-center shadow-md`}>
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs px-2 py-0.5 bg-white rounded-full text-gray-600">
                            {member.role}
                          </span>
                          {member.email && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {member.email.split('@')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(memberId)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all hover:scale-110"
                      title="Remove member"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Members Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <UserPlus className="w-4 h-4 text-green-600" />
            <label className="text-sm font-semibold text-gray-700">
              Add New Members
            </label>
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Users Dropdown */}
          <div className="relative">
            <select
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              value=""
              onChange={e => {
                if (e.target.value) {
                  handleAdd(e.target.value);
                  setSearchTerm("");
                }
              }}
            >
              <option value="" disabled>
                {filteredUsers.length === 0 ? "No available members to add" : "Select a member to add..."}
              </option>
              {filteredUsers.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role}) {user.email ? `- ${user.email}` : ''}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <UserPlus className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {filteredUsers.length === 0 && availableUsers.length > 0 && (
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              No users match your search
            </p>
          )}

          {availableUsers.length === 0 && members.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-700 flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                All available team members have been added to this project
              </p>
            </div>
          )}
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
                <span>Save Members</span>
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
            <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Added members will immediately gain access to this project and receive email notifications.
              Members can view and update tasks assigned to them.
            </p>
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