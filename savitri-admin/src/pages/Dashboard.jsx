import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Package, ShoppingBag, Users, TrendingUp, IndianRupee, Clock } from "lucide-react";
import { statsAPI } from "../services/api";
import { StatCard, StatusBadge, PageLoader } from "../components/ui";
import { Link } from "react-router-dom";

const COLORS = ["#d4a82a", "#10b981", "#0ea5e9", "#f43f5e", "#a855f7"];

const fd = (i) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: i * 0.08 },
});

// Group orders by month for chart
function buildRevenueChart(orders) {
  const map = {};
  (orders || []).forEach((o) => {
    const d = new Date(o.createdAt);
    const key = d.toLocaleString("default", { month: "short" });
    map[key] = (map[key] || 0) + (o.totalAmount || 0);
  });
  return Object.entries(map).map(([month, revenue]) => ({ month, revenue }));
}

function buildStatusChart(orders) {
  const map = {};
  (orders || []).forEach((o) => { map[o.status] = (map[o.status] || 0) + 1; });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function buildCategoryChart(products) {
  const map = {};
  (products || []).forEach((p) => { map[p.category || "other"] = (map[p.category || "other"] || 0) + 1; });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export default function Dashboard() {
  const [data,    setData]    = useState({ orders: [], users: [], products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      statsAPI.orders(),
      statsAPI.users(),
      statsAPI.products(),
    ]).then(([o, u, p]) => {
      setData({
        orders:   o.data.orders   || [],
        users:    u.data.users    || [],
        products: p.data.products || [],
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const { orders, users, products } = data;
  const paidOrders  = orders.filter(o => o.paymentStatus === "paid");
  const totalRev    = paidOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const pendingOrds = orders.filter(o => o.status === "ordered" || o.status === "processing");
  const revenueData = buildRevenueChart(paidOrders);
  const statusData  = buildStatusChart(orders);
  const catData     = buildCategoryChart(products);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div {...fd(0)}><StatCard icon={IndianRupee} label="Total Revenue"   value={`₹${(totalRev/1000).toFixed(1)}K`} sub={`${paidOrders.length} paid orders`}  color="gold" /></motion.div>
        <motion.div {...fd(1)}><StatCard icon={ShoppingBag} label="Total Orders"    value={orders.length}                     sub={`${pendingOrds.length} pending`}         color="amber" /></motion.div>
        <motion.div {...fd(2)}><StatCard icon={Users}       label="Customers"       value={users.length}                      sub="registered accounts"                    color="sky" /></motion.div>
        <motion.div {...fd(3)}><StatCard icon={Package}     label="Products"        value={products.length}                   sub="in catalogue"                           color="green" /></motion.div>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue area chart */}
        <motion.div {...fd(4)} className="lg:col-span-2 card p-5">
          <p className="text-xs font-mono text-ink-500 uppercase tracking-widest mb-1">Revenue over time</p>
          <p className="font-display text-2xl text-white mb-5">Monthly Revenue</p>
          {revenueData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-ink-600 text-sm">No revenue data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#d4a82a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d4a82a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#26262e" />
                <XAxis dataKey="month" tick={{ fill: "#7c7c93", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#7c7c93", fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
                  contentStyle={{ background:"#18181f", border:"1px solid #35353f", borderRadius:12, fontSize:12 }}
                  labelStyle={{ color:"#e8e8ec" }} itemStyle={{ color:"#d4a82a" }} />
                <Area type="monotone" dataKey="revenue" stroke="#d4a82a" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Order status pie */}
        <motion.div {...fd(5)} className="card p-5">
          <p className="text-xs font-mono text-ink-500 uppercase tracking-widest mb-1">Breakdown</p>
          <p className="font-display text-2xl text-white mb-5">Order Status</p>
          {statusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-ink-600 text-sm">No orders yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  paddingAngle={3} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background:"#18181f", border:"1px solid #35353f", borderRadius:12, fontSize:12 }}
                  itemStyle={{ color:"#e8e8ec" }} />
                <Legend iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ color:"#ababba", fontSize:11, textTransform:"capitalize" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Category bar chart + recent orders */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Category bar */}
        <motion.div {...fd(6)} className="card p-5">
          <p className="text-xs font-mono text-ink-500 uppercase tracking-widest mb-1">Catalogue</p>
          <p className="font-display text-2xl text-white mb-5">By Category</p>
          {catData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-ink-600 text-sm">No products yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={catData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#26262e" />
                <XAxis dataKey="name" tick={{ fill:"#7c7c93", fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"#7c7c93", fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:"#18181f", border:"1px solid #35353f", borderRadius:12, fontSize:12 }}
                  itemStyle={{ color:"#d4a82a" }} />
                <Bar dataKey="value" fill="#d4a82a" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Recent orders */}
        <motion.div {...fd(7)} className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-mono text-ink-500 uppercase tracking-widest mb-0.5">Latest</p>
              <p className="font-display text-2xl text-white">Recent Orders</p>
            </div>
            <Link to="/orders" className="btn-outline text-xs">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-700">
                  <th className="th">Order ID</th>
                  <th className="th">Customer</th>
                  <th className="th">Amount</th>
                  <th className="th">Status</th>
                  <th className="th">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o._id} className="table-row">
                    <td className="td font-mono text-gold-400 text-xs">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="td">{o.user?.fullName || "—"}</td>
                    <td className="td font-medium">₹{o.totalAmount?.toLocaleString("en-IN")}</td>
                    <td className="td"><StatusBadge status={o.status} /></td>
                    <td className="td text-ink-500 text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={5} className="td text-center text-ink-600 py-8">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
