import { useState } from "react";
import { Search, X, Filter, Clock } from "lucide-react";

export default function SearchBar({ 
  placeholder = "Search...", 
  value, 
  onChange,
  onClear,
  showRecent = false,
  recentSearches = [],
  onRecentClick,
  className = ""
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showRecentDropdown, setShowRecentDropdown] = useState(false);

  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  const handleRecentClick = (term) => {
    onChange(term);
    setShowRecentDropdown(false);
    if (onRecentClick) onRecentClick(term);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input Container */}
      <div className={`
        relative group transition-all duration-200
        ${isFocused ? 'transform scale-[1.01]' : ''}
      `}>
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`w-5 h-5 transition-colors duration-200 ${
            isFocused ? 'text-primary-500' : 'text-gray-400'
          }`} />
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (showRecent && recentSearches.length > 0) {
              setShowRecentDropdown(true);
            }
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowRecentDropdown(false), 200);
          }}
          aria-label={placeholder}
          className={`
            w-full pl-10 pr-12 py-3 
            border rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            bg-white
            ${isFocused 
              ? 'border-primary-300 shadow-md' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 hover:scale-110 transition-transform" />
          </button>
        )}

        {/* Filter Icon (optional) */}
        {!value && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Filter className="w-4 h-4 text-gray-300" />
          </div>
        )}
      </div>

      {/* Recent Searches Dropdown */}
      {showRecentDropdown && showRecent && recentSearches.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-down">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-gray-500" />
              <span className="text-xs font-semibold text-gray-600">Recent Searches</span>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {recentSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => handleRecentClick(term)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 group"
              >
                <Search className="w-3 h-3 text-gray-400 group-hover:text-primary-500" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{term}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Stats (optional) */}
      {value && (
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2 animate-fade-in">
          <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
          <span>Showing results for: <span className="font-medium text-gray-700">"{value}"</span></span>
        </div>
      )}

      <style jsx>{`
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
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-down {
          animation: fade-down 0.2s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}