import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import ProgressBar from "./ProgressBar";
import { computeCompletionPercentage } from "../utils/progress";
import { 
  FolderOpen, 
  Users, 
  Calendar, 
  TrendingUp,
  Search,
  Filter,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function ProjectList() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressMap, setProgressMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const { data } = await API.get("/projects/progress");
      const map = {};
      data.forEach((p) => {
        map[p.projectId] = p;
      });
      setProgressMap(map);
    } catch {
      console.warn("Failed to fetch project progress data");
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchProgress();
  }, []);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "progress") {
      const progA = progressMap[a._id];
      const progB = progressMap[b._id];
      const percentA = progA ? computeCompletionPercentage(progA.total, progA.completed) : 0;
      const percentB = progB ? computeCompletionPercentage(progB.total, progB.completed) : 0;
      return percentB - percentA;
    }
    if (sortBy === "members") return b.members.length - a.members.length;
    return 0;
  });

  // Calculate statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => {
    const prog = progressMap[p._id];
    const percent = prog ? computeCompletionPercentage(prog.total, prog.completed) : 0;
    return percent < 100 && percent > 0;
  }).length;
  const completedProjects = projects.filter(p => {
    const prog = progressMap[p._id];
    const percent = prog ? computeCompletionPercentage(prog.total, prog.completed) : 0;
    return percent === 100;
  }).length;

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FolderOpen className="w-6 h-6 text-primary-600 animate-pulse" />
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
              <FolderOpen className="w-6 h-6 text-primary-600" />
              All Projects
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              View and track all your team projects
            </p>
          </div>
          
          {/* Stats Badges */}
          <div className="flex gap-3">
            <div className="bg-blue-50 rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-bold text-blue-600">{totalProjects}</p>
              <p className="text-xs text-blue-600 font-medium">Total</p>
            </div>
            <div className="bg-green-50 rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-bold text-green-600">{activeProjects}</p>
              <p className="text-xs text-green-600 font-medium">Active</p>
            </div>
            <div className="bg-purple-50 rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-bold text-purple-600">{completedProjects}</p>
              <p className="text-xs text-purple-600 font-medium">Completed</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by name or description..."
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
              <span className="text-sm text-gray-700">Sort by</span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 animate-fade-down">
                <button
                  onClick={() => { setSortBy("name"); setShowFilters(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-xl ${sortBy === "name" ? "text-primary-600 bg-primary-50" : "text-gray-700"}`}
                >
                  Sort by Name
                </button>
                <button
                  onClick={() => { setSortBy("progress"); setShowFilters(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === "progress" ? "text-primary-600 bg-primary-50" : "text-gray-700"}`}
                >
                  Sort by Progress
                </button>
                <button
                  onClick={() => { setSortBy("members"); setShowFilters(false); }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-xl ${sortBy === "members" ? "text-primary-600 bg-primary-50" : "text-gray-700"}`}
                >
                  Sort by Members
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {sortedProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No projects found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedProjects.map((project, index) => {
            const prog = progressMap[project._id];
            const percentage = prog
              ? computeCompletionPercentage(prog.total, prog.completed)
              : 0;
            
            const getStatusColor = () => {
              if (percentage === 100) return "bg-gradient-to-r from-green-500 to-green-600";
              if (percentage >= 75) return "bg-gradient-to-r from-primary-500 to-primary-600";
              if (percentage >= 50) return "bg-gradient-to-r from-blue-500 to-blue-600";
              if (percentage >= 25) return "bg-gradient-to-r from-yellow-500 to-yellow-600";
              return "bg-gradient-to-r from-gray-500 to-gray-600";
            };

            const getStatusIcon = () => {
              if (percentage === 100) return <CheckCircle className="w-4 h-4 text-green-600" />;
              if (percentage >= 50) return <TrendingUp className="w-4 h-4 text-primary-600" />;
              return <Clock className="w-4 h-4 text-gray-500" />;
            };

            const getStatusText = () => {
              if (percentage === 100) return "Completed";
              if (percentage >= 75) return "Near Complete";
              if (percentage >= 50) return "In Progress";
              if (percentage >= 25) return "Getting Started";
              return "Just Begun";
            };

            return (
              <div
                key={project._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 animate-fade-up hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Project Header with Status */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          percentage === 100 ? "bg-green-100 text-green-700" :
                          percentage >= 75 ? "bg-primary-100 text-primary-700" :
                          percentage >= 50 ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {getStatusIcon()}
                          {getStatusText()}
                        </span>
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor()} shadow-md`}>
                      <FolderOpen className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description || "No description provided"}
                  </p>

                  {/* Members Section */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Team Members</span>
                      <span className="text-xs text-gray-400">({project.members.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.members.slice(0, 4).map((member) => (
                        <span
                          key={member._id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-700"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {member.name}
                        </span>
                      ))}
                      {project.members.length > 4 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600">
                          +{project.members.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="mt-4">
                    <ProgressBar percentage={percentage} showStatus={true} />
                  </div>

                  {/* Footer Stats */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Active Project</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {percentage === 100 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      <span>{percentage === 100 ? "Completed" : "In Development"}</span>
                    </div>
                  </div>
                </div>
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
        
        .animate-fade-up {
          animation: fade-up 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-down {
          animation: fade-down 0.2s ease-out;
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