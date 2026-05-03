import TaskCreate from "./TaskCreate";
import React, { useContext, useState, useEffect } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import UserList from "./UserList";
import ProjectEditForm from "./ProjectEditForm";
import ProjectCancelButton from "./ProjectCancelButton";
import ProjectMembersEditor from "./ProjectMembersEditor";
import SearchBar from "./SearchBar";
import ProgressBar from "./ProgressBar";
import TaskPanel from "./TaskPanel";
import { computeCompletionPercentage } from "../utils/progress";
import { useRefresh } from "../context/RefreshContext";
import { useSearchParams } from "react-router-dom";
import { 
  FolderPlus, 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  UserCheck, 
  PlusCircle,
  X,
  Search,
  LayoutList,
  UserCircle,
  Briefcase,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Settings,
  Shield
} from "lucide-react";

/* ===================== MY PROJECT LIST ===================== */
function MyProjectList({ refresh }) {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingMembersId, setEditingMembersId] = useState(null);
  const [showTaskCreateId, setShowTaskCreateId] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [expandedIds, setExpandedIds] = useState({});

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    API.get("/projects").then(({ data }) => {
      const filtered = data.filter((p) =>
        (p.members && p.members.some((m) => m._id === user._id)) ||
        (p.createdBy === user._id || p.owner === user._id)
      );
      setProjects(filtered);
      setLoading(false);
    });
  }, [user, refresh]);

  useEffect(() => {
    API.get("/projects/progress")
      .then(({ data }) => {
        const map = {};
        data.forEach((p) => {
          map[p.projectId] = p;
        });
        setProgressMap(map);
      })
      .catch(() => {
        console.warn("Failed to fetch project progress data");
      });
  }, [refresh]);

  const handleEditSave = async (projectId, form) => {
    await API.put(`/projects/${projectId}`, form);
    setEditingId(null);
    setProjects((prev) => prev.map(p => p._id === projectId ? { ...p, ...form } : p));
  };

  const handleCancelProject = async (projectId) => {
    await API.delete(`/projects/${projectId}`);
    setProjects((prev) => prev.filter(p => p._id !== projectId));
  };

  const handleEditMembers = async (projectId, members) => {
    await API.post(`/projects/${projectId}/assign`, { members });
    setEditingMembersId(null);
    setProjects((prev) => prev.map(p => p._id === projectId ? { ...p, members: members.map(id => {
      const userObj = p.members.find(m => m._id === id) || { _id: id, name: "", role: "" };
      return userObj;
    }) } : p));
  };

  const toggleExpanded = (projectId) => {
    setExpandedIds((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
  
  if (!projects.length) return (
    <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
      <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">No projects found.</p>
    </div>
  );

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Projects</h2>
          <p className="text-sm text-gray-500 mt-1">Projects you own or are part of</p>
        </div>
        <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
          {projects.length} Projects
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => {
          const isOwner = project.createdBy === user._id || project.owner === user._id;
          const prog = progressMap[project._id];
          const percentage = prog
            ? computeCompletionPercentage(prog.total, prog.completed)
            : 0;
          const isExpanded = !!expandedIds[project._id];

          return (
            <div 
              key={project._id} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="p-6">
                {editingId === project._id ? (
                  <ProjectEditForm
                    project={project}
                    onSave={async (form) => await handleEditSave(project._id, form)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : editingMembersId === project._id ? (
                  <ProjectMembersEditor
                    project={project}
                    onSave={async (members) => await handleEditMembers(project._id, members)}
                    onCancel={() => setEditingMembersId(null)}
                  />
                ) : (
                  <>
                    {/* Project Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{project.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                      </div>
                      {isOwner && (
                        <div className="flex gap-1">
                          <button
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            onClick={() => setEditingId(project._id)}
                            title="Edit Project"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <ProjectCancelButton
                            projectId={project._id}
                            onCancel={async () => await handleCancelProject(project._id)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Members Section */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">Team Members</span>
                        </div>
                        {isOwner && (
                          <button
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                            onClick={() => setEditingMembersId(project._id)}
                          >
                            <UserPlus className="w-3 h-3" />
                            Manage
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.members.slice(0, 3).map((member) => (
                          <span key={member._id} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                            <UserCircle className="w-3 h-3" />
                            {member.name}
                          </span>
                        ))}
                        {project.members.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                            +{project.members.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Overall Progress</span>
                        <span className="font-semibold text-primary-600">{percentage}%</span>
                      </div>
                      <ProgressBar percentage={percentage} />
                    </div>

                    {/* Action Buttons */}
                    {isOwner && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button
                          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                          onClick={() => setShowTaskCreateId(showTaskCreateId === project._id ? null : project._id)}
                        >
                          <PlusCircle className="w-4 h-4" />
                          {showTaskCreateId === project._id ? "Cancel" : "Assign Task"}
                        </button>
                        <button
                          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-700 transition-all"
                          onClick={() => toggleExpanded(project._id)}
                        >
                          {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          {isExpanded ? "Hide Tasks" : "View Tasks"}
                        </button>
                      </div>
                    )}

                    {showTaskCreateId === project._id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <TaskCreate projectId={project._id} onCreated={() => {}} />
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Task Panel */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-6">
                  <TaskPanel projectId={project._id} expanded={isExpanded} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===================== ADMIN PANEL PROJECT LIST ===================== */
function AdminProjectList({ refresh, searchQuery }) {
  const { refresh: globalRefresh } = useRefresh();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    API.get("/projects/all")
      .then(({ data }) => setProjects(data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [refresh, globalRefresh]);

  useEffect(() => {
    API.get("/projects/progress")
      .then(({ data }) => {
        const map = {};
        data.forEach((p) => {
          map[p.projectId] = p;
        });
        setProgressMap(map);
      })
      .catch(() => {
        console.warn("Failed to fetch project progress data");
      });
  }, [refresh, globalRefresh]);

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  const query = searchQuery.toLowerCase();
  const filtered = query
    ? projects.filter((p) => p.name.toLowerCase().includes(query))
    : projects;

  if (filtered.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
        <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No projects match your search "{searchQuery}"</p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No projects found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {filtered.map((project, index) => {
        const prog = progressMap[project._id];
        const percentage = prog
          ? computeCompletionPercentage(prog.total, prog.completed)
          : 0;
        return (
          <div
            key={project._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 animate-fade-up group"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{project.name}</h3>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                </div>
                <div className="bg-primary-100 text-primary-700 px-2 py-1 rounded-lg text-xs font-semibold">
                  {project.members.length} Members
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Team Members</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.members.slice(0, 4).map((member) => (
                    <span key={member._id} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                      <UserCircle className="w-3 h-3" />
                      {member.name}
                    </span>
                  ))}
                  {project.members.length > 4 && (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                      +{project.members.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Completion Progress</span>
                  <span className="font-semibold text-primary-600">{percentage}%</span>
                </div>
                <ProgressBar percentage={percentage} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===================== ADMIN PANEL ===================== */
export default function AdminPanel() {
  const { refresh, triggerRefresh } = useRefresh();
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [show, setShow] = useState(false);
  // Removed local refresh, use global refresh context
  const [projectSearch, setProjectSearch] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    members: [],
  });
  const [users, setUsers] = useState([]);
  const tabFromQuery = searchParams.get("tab");
  const isValidTab = tabFromQuery === "project" || tabFromQuery === "member" || tabFromQuery === "myproject";
  const activeTab = isValidTab ? tabFromQuery : "project";

  useEffect(() => {
    if (!user) return;
    API.get("/auth/users").then(({ data }) => setUsers(data));
  }, [user]);

  useEffect(() => {
    if (isValidTab) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", "project");
      return next;
    }, { replace: true });
  }, [isValidTab, setSearchParams]);

  useEffect(() => {
    setShow(false);
  }, [activeTab]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await API.post("/projects", form);
    setShow(false);
    setForm({ name: "", description: "", members: [] });
    triggerRefresh();
  };

  if (!user) return null;

  const tabs = [
    { id: "project", label: "Projects", icon: LayoutList, color: "primary" },
    { id: "member", label: "Members", icon: Users, color: "purple" },
    { id: "myproject", label: "My Projects", icon: Briefcase, color: "green" }
  ];

  return (
    <div className="mt-8">
      {/* Modern Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("tab", tab.id);
                    return next;
                  }, { replace: true });
                }}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? `text-${tab.color}-600`
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? `text-${tab.color}-600` : ""}`} />
                {tab.label}
                {isActive && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color}-600 rounded-full`}></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Tab */}
      {activeTab === "project" && (
        <div key="project" className="animate-fade-in">
          {/* Create Project Button */}
          <div className="mb-6">
            <button
              onClick={() => setShow(!show)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-medium hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <FolderPlus className="w-5 h-5" />
              {show ? "Cancel" : "Create New Project"}
            </button>
          </div>

          {/* Create Project Form */}
          {show && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-slide-down">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-primary-600" />
                Create New Project
              </h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    placeholder="Enter project name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the project..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign Team Members
                  </label>
                  <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {form.members.map((memberId) => {
                        const member = users.find((u) => u._id === memberId);
                        if (!member) return null;
                        return (
                          <span
                            key={memberId}
                            className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                          >
                            {member.name} ({member.role})
                            <button
                              type="button"
                              className="ml-1 text-primary-600 hover:text-red-600 transition-colors"
                              onClick={() =>
                                setForm((f) => ({
                                  ...f,
                                  members: f.members.filter((id) => id !== memberId),
                                }))
                              }
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                      value=""
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !form.members.includes(val)) {
                          setForm((f) => ({
                            ...f,
                            members: [...f.members, val],
                          }));
                        }
                      }}
                    >
                      <option value="" disabled>
                        + Add team members...
                      </option>
                      {users
                        .filter((u) => !form.members.includes(u._id))
                        .map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.name} ({u.role})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
                  >
                    Create Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShow(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-xl font-medium hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-4">
            <SearchBar
              placeholder="Search projects by name..."
              value={projectSearch}
              onChange={setProjectSearch}
            />
          </div>

          <AdminProjectList refresh={refresh} searchQuery={projectSearch} />
        </div>
      )}

      {/* Member Tab */}
      {activeTab === "member" && (
        <div key="member" className="animate-fade-in">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Team Members</h3>
                <p className="text-sm text-gray-500 mt-1">Manage and view all team members</p>
              </div>
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                {users.length} Members
              </div>
            </div>
            <SearchBar
              placeholder="Search members by name or email..."
              value={memberSearch}
              onChange={setMemberSearch}
            />
          </div>
          <UserList searchQuery={memberSearch} />
        </div>
        
      )}

      {/* My Project Tab */}
      {activeTab === "myproject" && (
        <div key="myproject" className="animate-fade-in">
          <MyProjectList refresh={refresh} />
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
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-up {
          animation: fade-up 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
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