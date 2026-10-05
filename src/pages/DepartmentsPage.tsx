import React, { useState, useEffect } from "react";
import { getDepartments, createDepartment, deleteDepartment } from "../api/departmentApi";
import type { Department } from "../types/api";
import { useAuth } from "../context/AuthContext";
import { Building2, Plus, Trash2, X, AlertCircle } from "lucide-react";

function DepartmentsPage() {
  const { currentRole } = useAuth();
  const isAdmin = currentRole === "ADMIN";

  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({
    name: "",
    description: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDepts = async () => {
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data || []);
    } catch (e) {
      console.warn("Failed to load departments", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name.trim()) return;
    setErrorMsg(null);
    try {
      await createDepartment(newDept);
      setNewDept({ name: "", description: "", status: "ACTIVE" });
      setIsModalOpen(false);
      fetchDepts();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Failed to create department");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Delete department "${name}"?`)) {
      try {
        await deleteDepartment(id);
        fetchDepts();
      } catch (err: any) {
        alert(err?.response?.data?.message || "Cannot delete department with active employees.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#1e293b]">
              Department Units
            </h1>
            <span className="rounded-full bg-indigo-50 border border-indigo-100 text-[#4338ca] text-xs font-bold px-2.5 py-0.5">
              {departments.length} Units
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize company personnel into structured functional departments.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] hover:from-[#4338ca] hover:to-[#3730a3] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
          <div className="h-8 w-8 rounded-full border-2 border-[#4f46e5] border-t-transparent animate-spin"></div>
          <span>Loading departments...</span>
        </div>
      ) : departments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No departments configured yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5] flex-shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{dept.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">UNIT #{dept.id}</span>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                      dept.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {dept.status || "ACTIVE"}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-500 leading-relaxed bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                  {dept.description || "No specific departmental description provided."}
                </p>
              </div>

              {isAdmin && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleDelete(dept.id, dept.name)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Department"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5]">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Add Department Unit</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-xs">
              {errorMsg && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-700 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Research & Development"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Primary roles and responsibilities..."
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Status</label>
                <select
                  value={newDept.status}
                  onChange={(e) => setNewDept({ ...newDept, status: e.target.value as "ACTIVE" | "INACTIVE" })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all cursor-pointer font-medium"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-slate-100 bg-white shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] hover:from-[#4338ca] hover:to-[#3730a3] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all cursor-pointer text-center"
                >
                  Create Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentsPage;
