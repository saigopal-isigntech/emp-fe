import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isRegisterTab, setIsRegisterTab] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const switchTab = (isReg: boolean) => {
    setIsRegisterTab(isReg);
    setError(null);
    setSuccess(null);
    setPassword("");
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsRegisterTab(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isRegisterTab) {
        if (!name.trim()) {
          throw new Error("Please enter your full name");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }
        await register(name.trim(), email.trim(), password);
        setSuccess("Account created successfully! Please sign in.");
        switchTab(false);
        setName("");
      } else {
        await login(email.trim(), password);
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Authentication failed. Please check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 text-center bg-slate-50">
          <h1 className="text-lg font-bold text-slate-800">Employee Management System</h1>
          <p className="text-xs text-slate-500 mt-1">
            {isRegisterTab ? "Create a new account" : "Sign in to your account"}
          </p>
        </div>

        <div className="flex border-b border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => switchTab(false)}
            className={`flex-1 py-2.5 text-center ${
              !isRegisterTab ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchTab(true)}
            className={`flex-1 py-2.5 text-center ${
              isRegisterTab ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3 text-xs">
          {error && (
            <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-2.5 rounded bg-green-50 border border-green-200 text-green-700 font-medium">
              {success}
            </div>
          )}

          {isRegisterTab && (
            <div>
              <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@ems.com"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : isRegisterTab ? "Register" : "Sign In"}
          </button>
        </form>

        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-500">
          <p className="font-medium mb-1.5">Quick Demo Login:</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleFillDemo("admin@ems.com", "admin123")}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
            >
              Admin
            </button>
            <button
              onClick={() => handleFillDemo("hr@ems.com", "hr12345")}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
            >
              HR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
