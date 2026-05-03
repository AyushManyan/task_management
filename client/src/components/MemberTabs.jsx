import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FolderKanban, ClipboardList, Sparkles, TrendingUp } from "lucide-react";
import ProjectList from "./ProjectList";
import TaskList from "./TaskList";

export default function MemberTabs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromQuery = searchParams.get("tab");
  const isValidTab = tabFromQuery === "project" || tabFromQuery === "mytask";
  const activeTab = isValidTab ? tabFromQuery : "project";

  useEffect(() => {
    if (isValidTab) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", "project");
      return next;
    }, { replace: true });
  }, [isValidTab, setSearchParams]);
  
  const tabs = [
    { id: "project", label: "Projects", icon: FolderKanban, color: "primary", description: "View all your projects" },
    { id: "mytask", label: "My Tasks", icon: ClipboardList, color: "purple", description: "Track your assigned tasks" }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);
  const Icon = currentTab?.icon;

  return (
    <div className="mt-8">
      {/* Modern Header with Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg">
              {Icon && <Icon className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {currentTab?.label}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {currentTab?.description}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700 font-medium">Active</span>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
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
                  className={`
                    relative group flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? `text-${tab.color}-600` 
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? `text-${tab.color}-600` : "text-gray-400 group-hover:text-gray-600"}`} />
                  <span>{tab.label}</span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color}-600 rounded-full animate-slide-in`}></div>
                  )}
                  
                  {/* Hover Effect */}
                  {!isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content with Animations */}
      <div className="relative">
        {activeTab === "project" && (
          <div className="animate-fade-in-up">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <p className="text-sm text-gray-600">
                    Projects you're part of or following
                  </p>
                </div>
                <div className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                  Active Projects
                </div>
              </div>
            </div>
            <ProjectList />
          </div>
        )}
        
        {activeTab === "mytask" && (
          <div className="animate-fade-in-up">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <p className="text-sm text-gray-600">
                    Tasks assigned specifically to you
                  </p>
                </div>
                <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                  Your Workload
                </div>
              </div>
            </div>
            <TaskList onlyMine={true} />
          </div>
        )}
      </div>

      {/* Quick Stats Banner */}
      <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Real-time updates</span>
          </div>
          <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">Last updated: Just now</span>
          </div>
          <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">All data is synced</span>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
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
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Color utilities for dynamic tab colors */
        .text-primary-600 { color: #3B82F6; }
        .bg-primary-600 { background-color: #3B82F6; }
        .bg-primary-50 { background-color: #EFF6FF; }
        
        .text-purple-600 { color: #8B5CF6; }
        .bg-purple-600 { background-color: #8B5CF6; }
        .bg-purple-50 { background-color: #F5F3FF; }
        
        .border-primary-600 { border-color: #3B82F6; }
        .border-purple-600 { border-color: #8B5CF6; }
      `}</style>
    </div>
  );
}