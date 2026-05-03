import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  Shield, 
  Sparkles,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/signup", form);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setForm({ ...form, password: newPassword });
    checkPasswordStrength(newPassword);
  };

  const getStrengthColor = () => {
    const colors = {
      0: "bg-gray-200",
      1: "bg-red-500",
      2: "bg-orange-500",
      3: "bg-yellow-500",
      4: "bg-green-500",
    };
    return colors[passwordStrength] || "bg-gray-200";
  };

  const getStrengthText = () => {
    const texts = {
      0: "No password",
      1: "Weak",
      2: "Fair",
      3: "Good",
      4: "Strong",
    };
    return texts[passwordStrength] || "";
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFormValid = () => {
    return form.name.trim() && 
           validateEmail(form.email) && 
           form.password.length >= 6;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/10 to-teal-500/10 rounded-full blur-3xl"></div>
      
      {/* Floating shapes */}
      <div className="absolute top-32 right-[15%] animate-float">
        <div className="w-3 h-3 bg-white/30 rounded-full"></div>
      </div>
      <div className="absolute bottom-32 left-[20%] animate-float-delayed">
        <div className="w-2 h-2 bg-white/20 rounded-full"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md transform transition-all duration-500">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8 animate-fade-down">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg mb-4">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Join TaskFlow
            </h1>
            <p className="text-white/80 text-sm font-medium">
              Start collaborating with your team today
            </p>
          </div>

          {/* Signup Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl animate-fade-up"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Create Account
              </h2>
              <p className="text-gray-500 text-center text-sm mt-1">
                Fill in your details to get started
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl animate-shake">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-red-600 text-sm font-medium flex-1">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Name Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onBlur={() => setTouched({ ...touched, name: true })}
                  required
                />
              </div>
              {touched.name && !form.name && (
                <p className="text-xs text-red-500 mt-1">Name is required</p>
              )}
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  required
                />
              </div>
              {touched.email && form.email && !validateEmail(form.email) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  value={form.password}
                  onChange={handlePasswordChange}
                  onBlur={() => setTouched({ ...touched, password: true })}
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

            {/* Password Strength Indicator */}
            {form.password && (
              <div className="mb-4 space-y-1">
                <div className="flex gap-1 h-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        passwordStrength >= level
                          ? getStrengthColor()
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Password strength:{" "}
                    <span className={`font-semibold`}>
                      {getStrengthText()}
                    </span>
                  </p>
                  {passwordStrength >= 3 && (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  Password must be at least 6 characters
                </p>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="mb-6 flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                required
              />
              <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-emerald-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-emerald-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="relative w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up</span>
                </div>
              )}
            </button>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors hover:underline"
                >
                  Login here
                </Link>
              </p>
            </div>

            {/* Benefits Banner */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-start space-x-2 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                <Sparkles className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-semibold text-emerald-600">Free account includes:</span>{" "}
                  Task management, team collaboration, project tracking, and real-time updates
                </p>
              </div>
            </div>
          </form>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm">
              <Shield className="w-3 h-3 text-white/80" />
              <p className="text-white/70 text-xs">
                Your data is encrypted and secure
              </p>
            </div>
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
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
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