import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Home } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Mock credentials
      const validEmail = "admin@selffix.ai";
      const validPassword = "123456";

      if (email === validEmail && password === validPassword) {
        // Store authentication token
        localStorage.setItem("isAdminAuthenticated", "true");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid email or password");
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
      >
        <Home className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">SelfFix AI</div>
            <div className="text-xs text-slate-500">Service Agent Portal</div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Service Agent Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@selffix.ai"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          {/* <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 mb-3">Demo Credentials:</p>
            <div className="space-y-2 bg-slate-50 p-3 rounded-lg">
              <p className="text-xs text-slate-600">
                <span className="font-semibold">Email:</span> admin@selffix.ai
              </p>
              <p className="text-xs text-slate-600">
                <span className="font-semibold">Password:</span> 123456
              </p>
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          <p>© 2024 SelfFix AI. Service Agent Portal.</p>
        </div>
      </div>
    </div>
  );
}
