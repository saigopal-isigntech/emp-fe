import React, { useState, useEffect } from "react";
import { getDepartments, createDepartment, deleteDepartment } from "../api/departmentApi";
import type { Department } from "../types/api";
import { useAuth } from "../context/AuthContext";

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
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Departments ({departments.length})
          </h1>
          <p className="text-xs text-slate-500">Manage company divisions and teams.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          New Department
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-slate-500">Loading departments...</div>
      ) : departments.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          No departments found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-bold text-slate-800">{dept.name}</h3>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${
                      dept.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {dept.status || "ACTIVE"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  {dept.description || "No description provided."}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="text-slate-400">ID: #{dept.id}</span>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(dept.id, dept.name)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800">New Department</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3 text-xs">
              {errorMsg && (
                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  required
                  placeholder="e.g. Engineering"
                  className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDept.description}
                  onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                  placeholder="Department details..."
                  className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Create Department
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
