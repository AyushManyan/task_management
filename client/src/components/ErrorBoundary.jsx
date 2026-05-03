import React from "react";
import { AlertCircle, RefreshCw, Home, Bug, Shield, ArrowLeft } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleGoBack = () => {
    window.history.back();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development';
      
      return (
        <div className="relative min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-100 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Floating Icons */}
          <div className="absolute top-1/4 left-[10%] animate-float">
            <Bug className="w-8 h-8 text-red-200" />
          </div>
          <div className="absolute bottom-1/4 right-[15%] animate-float-delayed">
            <AlertCircle className="w-6 h-6 text-orange-200" />
          </div>

          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className="max-w-2xl w-full">
              {/* Error Illustration */}
              <div className="text-center mb-8 animate-fade-down">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-2xl mb-6 animate-bounce">
                  <Shield className="w-16 h-16 text-white" />
                </div>
                <h1 className="text-6xl font-extrabold text-gray-800 mb-4 tracking-tight">
                  Oops!
                </h1>
                <div className="inline-block px-4 py-2 bg-red-100 rounded-full mb-4">
                  <p className="text-red-700 font-semibold text-sm">
                    Unexpected Error Occurred
                  </p>
                </div>
              </div>

              {/* Error Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-6 animate-fade-up">
                <div className="flex items-start gap-3 mb-6">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Something went wrong
                    </h2>
                    <p className="text-gray-600">
                      The application encountered an unexpected error. Our team has been notified.
                    </p>
                  </div>
                </div>

                {/* Error Details (Development Only) */}
                {isDev && this.state.error && (
                  <div className="mb-6">
                    <div className="bg-gray-900 rounded-xl p-4 overflow-auto">
                      <p className="text-red-400 font-mono text-sm mb-2">
                        {this.state.error.toString()}
                      </p>
                      {this.state.errorInfo && (
                        <details className="mt-2">
                          <summary className="text-gray-400 text-sm cursor-pointer hover:text-gray-300">
                            Stack Trace
                          </summary>
                          <pre className="text-gray-300 text-xs mt-2 whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                )}

                {/* Error ID (For support) */}
                <div className="mb-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Error Reference ID</span>
                    <code className="text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      ERR-{Math.random().toString(36).substr(2, 8).toUpperCase()}
                    </code>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={this.handleTryAgain}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Try Again
                  </button>
                  <button
                    onClick={this.handleGoBack}
                    className="flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all transform hover:scale-105"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Go Back
                  </button>
                  <button
                    onClick={this.handleGoHome}
                    className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all transform hover:scale-105"
                  >
                    <Home className="w-5 h-5" />
                    Home Page
                  </button>
                </div>
              </div>

              {/* Help Section */}
              <div className="text-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                  <Bug className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-600">
                    Need help?{" "}
                    <a href="/support" className="text-primary-600 hover:underline font-semibold">
                      Contact Support
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Custom CSS */}
          <style jsx>{`
            @keyframes fade-down {
              from {
                opacity: 0;
                transform: translateY(-30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes fade-up {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes bounce {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-10px);
              }
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
            
            @keyframes float-delayed {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-15px); }
            }
            
            .animate-fade-down {
              animation: fade-down 0.6s ease-out;
            }
            
            .animate-fade-up {
              animation: fade-up 0.6s ease-out forwards;
              opacity: 0;
            }
            
            .animate-bounce {
              animation: bounce 2s ease-in-out infinite;
            }
            
            .animate-float {
              animation: float 6s ease-in-out infinite;
            }
            
            .animate-float-delayed {
              animation: float-delayed 5s ease-in-out infinite 1s;
            }
            
            .delay-1000 {
              animation-delay: 1s;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}