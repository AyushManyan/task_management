import { useState, useEffect } from "react";
import { CheckCircle, TrendingUp, AlertCircle } from "lucide-react";

export default function ProgressBar({ 
  percentage, 
  showLabel = true, 
  showIcon = true,
  height = "h-2",
  animated = true,
  colorScheme = "primary",
  showStatus = false
}) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  // Animate progress on mount and when percentage changes
  useEffect(() => {
    if (animated) {
      let start = 0;
      const duration = 800;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setAnimatedPercentage(Math.floor(progress * percentage));
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    } else {
      setAnimatedPercentage(percentage);
    }
  }, [percentage, animated]);
  
  const getColorScheme = () => {
    if (colorScheme !== "auto") return colorScheme;
    
    if (percentage >= 80) return "green";
    if (percentage >= 50) return "primary";
    if (percentage >= 25) return "yellow";
    return "red";
  };
  
  const getStatusText = () => {
    if (percentage === 100) return "Complete! 🎉";
    if (percentage >= 80) return "Almost there!";
    if (percentage >= 50) return "Making progress";
    if (percentage >= 25) return "Getting started";
    return "Just begun";
  };
  
  const getStatusColor = () => {
    if (percentage === 100) return "text-green-600";
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 50) return "text-primary-500";
    if (percentage >= 25) return "text-yellow-500";
    return "text-red-400";
  };
  
  const scheme = getColorScheme();
  
  const colorClasses = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600",
    green: "bg-gradient-to-r from-green-500 to-green-600",
    yellow: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    red: "bg-gradient-to-r from-red-500 to-red-600",
    blue: "bg-gradient-to-r from-blue-500 to-blue-600",
    purple: "bg-gradient-to-r from-purple-500 to-purple-600",
  };
  
  const heightClasses = {
    "h-1": "h-1",
    "h-2": "h-2",
    "h-3": "h-3",
    "h-4": "h-4",
  };
  
  return (
    <div className="w-full">
      {/* Header with percentage and status */}
      {(showLabel || showStatus) && (
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {showIcon && percentage === 100 && (
              <CheckCircle className="w-4 h-4 text-green-500 animate-bounce" />
            )}
            {showIcon && percentage > 0 && percentage < 100 && (
              <TrendingUp className={`w-4 h-4 ${getStatusColor()}`} />
            )}
            {showIcon && percentage === 0 && (
              <AlertCircle className="w-4 h-4 text-gray-400" />
            )}
            
            {showLabel && (
              <span className="text-sm font-semibold text-gray-700">
                {animatedPercentage}% Complete
              </span>
            )}
          </div>
          
          {showStatus && (
            <span className={`text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          )}
        </div>
      )}
      
      {/* Progress Bar Container */}
      <div className={`relative w-full bg-gray-100 rounded-full overflow-hidden ${heightClasses[height]}`}>
        {/* Background animation for empty state */}
        {percentage === 0 && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
        )}
        
        {/* Progress Fill */}
        <div
          className={`${colorClasses[scheme]} ${heightClasses[height]} rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${animatedPercentage}%` }}
        >
          {/* Shine effect on progress bar */}
          {animatedPercentage > 0 && animatedPercentage < 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          )}
          
          {/* 100% celebration effect */}
          {animatedPercentage === 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-300 to-green-400 animate-pulse-slow"></div>
          )}
        </div>
      </div>
      
      {/* Milestone markers */}
      {percentage > 0 && percentage < 100 && (
        <div className="flex justify-between mt-1 px-1">
          {[25, 50, 75].map((milestone) => (
            <div
              key={milestone}
              className={`text-[10px] font-medium transition-colors duration-300 ${
                animatedPercentage >= milestone ? "text-primary-500" : "text-gray-300"
              }`}
            >
              {milestone}%
            </div>
          ))}
        </div>
      )}
      
      {/* Celebration message for 100% */}
      {percentage === 100 && (
        <div className="mt-2 text-center animate-fade-in">
          <p className="text-xs text-green-600 font-medium">
            ✨ Task completed! Great work! ✨
          </p>
        </div>
      )}
      
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 1.5s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}