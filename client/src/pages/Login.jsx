import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, LogIn, User, Lock, Shield, Sparkles } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/login", form);
      login(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.msg || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full blur-3xl"></div>
      
      {/* Floating shapes */}
      <div className="absolute top-32 left-[15%] animate-float">
        <div className="w-3 h-3 bg-white/30 rounded-full"></div>
      </div>
      <div className="absolute bottom-32 right-[20%] animate-float-delayed">
        <div className="w-2 h-2 bg-white/20 rounded-full"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md transform transition-all duration-500">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8 animate-fade-down">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-white/80 text-sm font-medium">
              Collaborate seamlessly with your team
            </p>
          </div>

          {/* Login Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl animate-fade-up"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-center text-sm mt-1">
                Login to access your dashboard
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl animate-shake">
                <p className="text-red-600 text-sm text-center font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mb-6">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </div>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors hover:underline"
                >
                  Sign up now
                </Link>
              </p>
            </div>

            {/* Info Banner */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-start space-x-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-semibold text-indigo-600">Admins:</span> Create and manage projects & tasks •{" "}
                  <span className="font-semibold text-indigo-600">Members:</span> Update task status and collaborate
                </p>
              </div>
            </div>
          </form>

          {/* Demo Credentials Hint */}
          <div className="mt-6 text-center">
            <p className="text-white/70 text-xs backdrop-blur-sm inline-block px-4 py-2 rounded-full bg-black/20">
              Demo: admin@example.com / password123
            </p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
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
          animation: fade-up 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
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
        
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}