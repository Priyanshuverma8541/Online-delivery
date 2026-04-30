import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Trash2, RefreshCw, User } from "lucide-react";
import { userAPI } from "../services/api";
import { ConfirmDialog, Empty, PageLoader, StatusBadge, SearchInput } from "../components/ui";
import toast from "react-hot-toast";

export default function Users() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [roleF,   setRoleF]   = useState("all");
  const [delId,   setDelId]   = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getAll();
      setUsers(data.users || []);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    if (!delId) return;
    try {
      await userAPI.delete(delId);
      toast.success("User deleted");
      setDelId(null);
      fetchUsers();
    } catch { toast.error("Delete failed"); }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.fullName?.toLowerCase().includes(search.toLowerCase())
      || u.email?.toLowerCase().includes(search.toLowerCase())
      || u.userId?.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleF === "all" || u.role === roleF;
    return matchSearch && matchRole;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-mono text-ink-500 uppercase tracking-widest mb-0.5">Management</p>
          <h1 className="page-title">Customers</h1>
        </div>
        <button onClick={fetchUsers} className="btn-icon" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Users",  value: users.length },
          { label: "Admins",       value: users.filter(u => u.role === "admin").length },
          { label: "Customers",    value: users.filter(u => u.role === "user").length },
        ].map(({ label, value }) => (
          <div key={label} className="card-sm text-center">
            <p className="font-display text-3xl text-white">{value}</p>
            <p className="text-xs text-ink-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, user ID…" />
        </div>
        <select className="select w-36" value={roleF} onChange={(e) => setRoleF(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="user"  className="bg-ink-900">Customer</option>
          <option value="admin" className="bg-ink-900">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-ink-700 bg-ink-900/60">
              <tr>
                <th className="th">User</th>
                <th className="th">User ID</th>
                <th className="th">Email</th>
                <th className="th">Role</th>
                <th className="th">Joined</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6}><Empty title="No users found" message="Try adjusting your search." /></td></tr>
              )}
              {filtered.map((u) => (
                <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${u.role === "admin" ? "bg-gold-gradient text-ink-900 shadow-gold" : "bg-ink-700 text-ink-300"}`}>
                        {u.fullName?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-white text-sm font-medium">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="td font-mono text-ink-400 text-xs">{u.userId}</td>
                  <td className="td text-ink-300 text-sm">{u.email}</td>
                  <td className="td"><StatusBadge status={u.role} /></td>
                  <td className="td text-ink-500 text-xs">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td className="td">
                    <div className="flex justify-end">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => setDelId(u._id)}
                          className="btn-icon hover:bg-rose-500/15 hover:text-rose-400"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-ink-700 text-xs text-ink-500 font-mono">
          {filtered.length} user{filtered.length !== 1 ? "s" : ""} shown
        </div>
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        open={Boolean(delId)}
        title="Delete Customer"
        message="This will permanently delete the customer account. All their data will be removed."
        onConfirm={handleDelete}
        onCancel={() => setDelId(null)}
      />
    </div>
  );
}
