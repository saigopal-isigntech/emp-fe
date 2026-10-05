import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { getPublicDepartments } from "../api/authApi";
import type { Department } from "../types/api";
import {
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Building2,
  Briefcase,
  Phone,
  Check,
  LogIn,
  UserPlus,
  ArrowRight
} from "lucide-react";

function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Unique URL paths: /login for Sign In, /register for Create Account
  const isRegisterRoute = location.pathname.includes("/register");
  const [isRegisterTab, setIsRegisterTab] = useState(isRegisterRoute);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Employee details fields for registration
  const [departmentId, setDepartmentId] = useState<number | "">("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setIsRegisterTab(location.pathname.includes("/register"));
  }, [location.pathname]);



  useEffect(() => {
    if (isRegisterTab && departments.length === 0) {
      setLoadingDepts(true);
      getPublicDepartments()
        .then((depts) => {
          setDepartments(depts || []);
          if (depts && depts.length > 0 && !departmentId) {
            setDepartmentId(depts[0].id);
          }
        })
        .catch(console.warn)
        .finally(() => setLoadingDepts(false));
    }
  }, [isRegisterTab, departments.length, departmentId]);

  const switchTab = (isReg: boolean) => {
    setIsRegisterTab(isReg);
    setError(null);
    setSuccess(null);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (isReg) {
      navigate("/register");
    } else {
      navigate("/login");
    }
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
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match. Please ensure both entered passwords are identical.");
        }
        if (!departmentId) {
          throw new Error("Please select your department");
        }

        const selectedDept = departments.find(d => d.id === Number(departmentId));

        await register({
          name: name.trim(),
          email: email.trim(),
          password,
          departmentId: Number(departmentId),
          departmentName: selectedDept?.name,
          designation: designation.trim() || "Staff Member",
          phone: phone.trim() || "0000000000",
        });

        setSuccess(`Account created successfully and assigned to ${selectedDept?.name || 'department'}! Please sign in.`);
        switchTab(false);
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
    <div className="min-h-screen relative overflow-hidden bg-[#f4f7fb] flex items-center justify-center p-4 py-10 selection:bg-indigo-500 selection:text-white">
      {/* Decorative ambient background shapes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Card Container */}
      <div className="relative w-full max-w-[490px] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(79,70,229,0.12)] border border-slate-100/80 p-8 sm:p-10 backdrop-blur-sm">
        
        {/* Header Title & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1e293b] tracking-tight">
            Employee HR Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-normal">
            {isRegisterTab
              ? "Create your employee profile to get started"
              : "Sign in to access your dashboard"}
          </p>
        </div>

        {/* Tab Segmented Control */}
        <div className="bg-[#f1f4f9] p-1.5 rounded-2xl flex items-center mb-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => switchTab(false)}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              !isRegisterTab
                ? "bg-[#4f46e5] text-white font-semibold shadow-md shadow-indigo-500/20"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => switchTab(true)}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isRegisterTab
                ? "bg-[#4f46e5] text-white font-semibold shadow-md shadow-indigo-500/20"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Registration Specific Fields */}
          {isRegisterTab && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                  Full Name *
                </label>
                <div className="relative flex items-center rounded-2xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 bg-white transition-all shadow-sm">
                  <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Leon Vance"
                    className="w-full bg-transparent pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none rounded-2xl"
                  />
                </div>
              </div>

              {/* Department Dropdown */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800">
                    Department *
                  </label>
                  {loadingDepts && (
                    <span className="text-[10px] text-slate-400">Loading units...</span>
                  )}
                </div>
                <div className="relative flex items-center rounded-2xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 bg-white transition-all shadow-sm">
                  <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <select
                    required
                    value={departmentId}
                    onChange={(e) => setDepartmentId(Number(e.target.value))}
                    className="w-full bg-transparent pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-800 outline-none rounded-2xl cursor-pointer font-medium"
                  >
                    <option value="" disabled>Choose your department unit</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} {dept.description ? `– ${dept.description}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Designation & Phone row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Designation / Role *
                  </label>
                  <div className="relative flex items-center rounded-2xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 bg-white transition-all shadow-sm">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. Software Engineer"
                      className="w-full bg-transparent pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none rounded-2xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative flex items-center rounded-2xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 bg-white transition-all shadow-sm">
                    <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full bg-transparent pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Work Email Address */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
              Work Email Address *
            </label>
            <div className="relative flex items-center rounded-2xl border border-indigo-200/80 focus-within:border-[#4f46e5] focus-within:ring-4 focus-within:ring-indigo-500/15 bg-white transition-all shadow-sm">
              <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="leon@gmail.com"
                className="w-full bg-transparent pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none rounded-2xl"
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className={isRegisterTab ? "grid grid-cols-1 sm:grid-cols-2 gap-3.5" : "space-y-4"}>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Password *
              </label>
              <div className="relative flex items-center rounded-2xl border border-slate-200 focus-within:border-[#4f46e5] focus-within:ring-4 focus-within:ring-indigo-500/15 bg-white transition-all shadow-sm">
                <div className="absolute left-4 text-slate-400 pointer-events-none flex items-center">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••"
                  className="w-full bg-transparent pl-11 pr-11 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none rounded-2xl tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 p-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {isRegisterTab && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800">
                    Confirm Password *
                  </label>
                  {confirmPassword && password === confirmPassword && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Matches</span>
                    </span>
                  )}
                </div>
                <div className={`relative flex items-center rounded-2xl border bg-white transition-all shadow-sm ${
                  confirmPassword && password !== confirmPassword
                    ? "border-rose-300 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-100"
                    : "border-slate-200 focus-within:border-[#4f46e5] focus-within:ring-4 focus-within:ring-indigo-500/15"
                }`}>
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="•••••••••"
                    className="w-full bg-transparent pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none rounded-2xl tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 p-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>



          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] hover:from-[#4338ca] hover:to-[#3730a3] text-white py-3.5 px-6 font-semibold text-xs sm:text-sm flex items-center justify-between shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
          >
            <span className="flex items-center gap-2.5">
              {isRegisterTab ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>
                {loading
                  ? "Processing..."
                  : isRegisterTab
                  ? "Complete Registration"
                  : "Sign In to Dashboard"}
              </span>
            </span>
            {loading ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* Bottom Footer Switcher */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-500">
          {isRegisterTab ? (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchTab(false)}
                className="font-semibold text-[#4f46e5] hover:text-[#4338ca] hover:underline cursor-pointer ml-1"
              >
                Sign in (/login)
              </button>
            </span>
          ) : (
            <span>
              New to the system?{" "}
              <button
                type="button"
                onClick={() => switchTab(true)}
                className="font-semibold text-[#4f46e5] hover:text-[#4338ca] hover:underline cursor-pointer ml-1"
              >
                Create an account (/register)
              </button>
            </span>
          )}
        </div>
      </div>


    </div>
  );
}

export default LoginPage;
