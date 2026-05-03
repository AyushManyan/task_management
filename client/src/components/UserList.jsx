import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { 
  Users, 
  Mail, 
  Shield, 
  UserCheck, 
  Search,
  Crown,
  User,
  Filter
} from "lucide-react";

export default function UserList({ searchQuery = "" }) {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/auth/users");
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (!user || user.role !== "Admin") return null;

  const query = searchQuery.toLowerCase();
  
  // Filter by search query and role
  const filtered = users.filter(u => {
    const matchesSearch = !query || 
      u.name.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query);
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate statistics
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === "Admin").length,
    members: users.filter(u => u.role === "Member").length
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case "Admin": return <Crown className="w-4 h-4 text-purple-600" />;
      default: return <User className="w-4 h-4 text-green-600" />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case "Admin": return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
      default: return "bg-gradient-to-r from-green-500 to-green-600 text-white";
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary-600 animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      {/* Header Section */}
      <div className="mb-8">
     
        

        {/* Role Filter Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-200">
          {["all", "Admin", "Member"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 text-sm font-medium transition-all relative ${
                roleFilter === role
                  ? "text-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {role === "all" ? "All Roles" : role}
              {roleFilter === role && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full animate-slide-in"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          {searchQuery || roleFilter !== "all" ? (
            <>
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No matching members</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </>
          ) : (
            <>
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No users found</h3>
              <p className="text-sm text-gray-500">Team members will appear here</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((u, index) => (
            <div
              key={u._id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 animate-fade-up hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${getRoleBadgeClass(u.role)}`}>
                    {getInitials(u.name)}
                  </div>
                  
                  <div className="flex-1">
                    {/* Name and Role */}
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {u.name}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(u.role)}`}>
                        {getRoleIcon(u.role)}
                        {u.role}
                      </span>
                    </div>
                    
                    {/* Email */}
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <Mail className="w-3.5 h-3.5" />
                      <a href={`mailto:${u.email}`} className="hover:text-primary-600 transition-colors">
                        {u.email}
                      </a>
                    </div>
                    
                    {/* User Metadata */}
                    <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Shield className="w-3 h-3" />
                        <span>ID: {u._id.slice(-8)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <UserCheck className="w-3 h-3" />
                        <span>Member since {new Date(u.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      {filtered.length > 0 && (
        <div className="mt-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Filter className="w-3 h-3" />
              <span>Showing {filtered.length} of {users.length} members</span>
            </div>
            <div className="flex gap-3">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Admins
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Members
              </span>
            </div>
          </div>
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
        
        @keyframes slide-in {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        
        .animate-fade-up {
          animation: fade-up 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}