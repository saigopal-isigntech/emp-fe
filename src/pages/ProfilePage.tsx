import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useEmployeeContext } from "../context/EmployeeContext";
import { getMyProfile, getEmployeeById } from "../api/employeeApi";
import type { Employee } from "../types/api";
import { Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

function ProfilePage() {
  const { user, currentRole } = useAuth();
  const { employees } = useEmployeeContext();
  const [profile, setProfile] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        // 1. Fetch verified personal profile directly from /employees/me
        try {
          const liveProfile = await getMyProfile();
          if (liveProfile && liveProfile.id) {
            setProfile(liveProfile);
            return;
          }
        } catch {
          // Fallback to next strategy
        }

        // 2. If employeeId is available in session
        if (user?.employeeId) {
          try {
            const byId = await getEmployeeById(user.employeeId);
            if (byId && byId.id) {
              setProfile(byId);
              return;
            }
          } catch {}
        }

        // 3. Check in employee context (if admin or cached)
        const found = employees.find(
          (e) => e.userId === user?.userId || (user?.employeeId && e.id === user.employeeId) || e.email === user?.email
        );
        if (found) {
          setProfile(found);
          return;
        }

        // 4. Fallback from auth context
        setProfile({
          id: user?.employeeId || user?.userId || 1,
          employeeCode: "EMP-" + (user?.userId || 1),
          firstName: user?.name?.split(" ")[0] || "Staff",
          lastName: user?.name?.split(" ").slice(1).join(" ") || "Member",
          name: user?.name || user?.email || "Employee",
          email: user?.email || "user@ems.com",
          phone: "–",
          designation: currentRole === "ADMIN" ? "System Administrator" : currentRole === "HR" ? "HR Manager" : "Employee",
          dateOfJoining: new Date().toISOString().split("T")[0],
          salary: 0,
          status: "ACTIVE",
          departmentId: 1,
          department: "General",
        });
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [user?.email, currentRole, employees, user?.employeeId, user?.name, user?.userId]);

  const fullName =
    profile?.name ||
    `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() ||
    user?.name ||
    "Staff Member";

  const getInitials = () => {
    const parts = fullName.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return fullName.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
        <div className="h-8 w-8 rounded-full border-2 border-[#4f46e5] border-t-transparent animate-spin"></div>
        <span>Loading personal credentials...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#4338ca] via-[#4f46e5] to-[#6366f1] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-black/10">
            {getInitials()}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-white">{fullName}</h1>
              <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-0.5 text-xs font-semibold border border-white/30">
                {currentRole}
              </span>
            </div>
            <p className="text-indigo-100 text-sm mt-1">{profile?.designation || "Staff Member"}</p>
            <p className="text-indigo-200 text-xs mt-1 font-mono">
              Employee ID: {profile?.employeeCode || `EMP-${profile?.id}`}
            </p>
          </div>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#4f46e5]" />
            Department Unit
          </span>
          <p className="text-base font-bold text-slate-800">
            {profile?.department || profile?.departmentName || "General"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#4f46e5]" />
            Official Role
          </span>
          <p className="text-base font-bold text-slate-800">{profile?.designation || "Staff"}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Account Status
          </span>
          <p className="text-base font-bold text-emerald-700">{profile?.status || "ACTIVE"}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#4f46e5]" />
            Work Email
          </span>
          <p className="text-sm font-semibold text-slate-800 truncate">{profile?.email || user?.email}</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#4f46e5]" />
            Phone Number
          </span>
          <p className="text-sm font-semibold text-slate-800">
            {profile?.phone || profile?.mobile || "–"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#4f46e5]" />
            Joining Date
          </span>
          <p className="text-sm font-semibold text-slate-800">{profile?.dateOfJoining || "–"}</p>
        </div>
      </div>

      {/* Security notice */}
      <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3 text-xs text-slate-600">
        <UserCheck className="w-5 h-5 text-[#4f46e5] flex-shrink-0" />
        <span>
          Your employment records and department affiliations are managed by system administrators. Contact HR for updates.
        </span>
      </div>
    </div>
  );
}

export default ProfilePage;
