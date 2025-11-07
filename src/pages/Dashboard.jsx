

// src/pages/Dashboard.jsx

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  AlertTriangle,
  Users,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import axiosInstance from "../lib/axios.js";
import MetricCard from "../components/MetricCard";
import ChartCard from "../components/ChartCard";
import DateFilterBar from "../components/DataFilterBar.jsx";
import Loader from "../components/Loader";

const COLORS = ["#0f172a", "#f59e0b", "#10b981", "#ef4444"];

const Dashboard = () => {
  const [range, setRange] = useState({
    startDate: "",
    endDate: "",
    preset: "Last 7 Days",
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 📊 Fetch Dashboard Data with small client-side cache + background refresh
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();
    const cacheKey = `dashboardCache:${JSON.stringify(range)}`;
    const TTL = 30 * 1000; // 30s

    const doFetch = async (showLoader = true) => {
      try {
        if (showLoader) setLoading(true);
        const res = await axiosInstance.get("dashboard/summary", { signal: controller.signal });
        if (!mounted) return;
        if (res?.data) {
          setData(res.data.dashboard);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: res.data.dashboard }));
          } catch (e) {
            /* ignore storage errors */
          }
        }
      } catch (err) {
        if (err.name === 'AbortError' || err?.message === 'canceled' || err.name === 'CanceledError') return;
        console.error("❌ Error fetching dashboard:", err);
        if (mounted) setError("Failed to load dashboard data");
      } finally {
        if (mounted && showLoader) setLoading(false);
      }
    };

    // try cache first
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.ts < TTL) {
          setData(parsed.data);
          setLoading(false);
          // refresh in background without showing loader
          doFetch(false);
          return () => { mounted = false; controller.abort(); };
        }
      }
    } catch (e) {
      /* ignore parse errors */
    }

    // no fresh cache — fetch and show loader
    doFetch(true);

    return () => { mounted = false; controller.abort(); };
  }, [range]);


  // 🧮 KPI Cards
  const metrics = useMemo(() => [
    {
      label: "Total Revenue",
      value: `₹${data?.metrics?.totalRevenue?.toLocaleString() || 0}`,
      icon: TrendingUp,
    },
    {
      label: "Total Orders",
      value: data?.metrics?.totalOrders || 0,
      icon: Package,
    },
    {
      label: "Delivered",
      value: data?.metrics?.deliveredOrders || 0,
      icon: Users,
    },
    {
      label: "Cancelled",
      value: data?.metrics?.cancelledOrders || 0,
      icon: AlertTriangle,
    },
  ], [data]);

  // 📈 Charts
  const orderTrend = useMemo(() => data?.trends || [], [data]);
  const paymentModeData = useMemo(() => [
    { mode: "Cash", value: data?.payments?.totalCash || 0 },
    { mode: "UPI", value: data?.payments?.totalUPI || 0 },
  ], [data]);

  // 📋 Recent Orders
  const recentOrders = useMemo(() => data?.recentOrders || [], [data]);

  if (loading)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader text="Loading dashboard..." />
      </div>
    );
  if (error)
    return (
      <p className="text-red-500 text-center mt-10">{error}</p>
    );

  return (
    <div className="p-6 space-y-8 font-[Inter]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          Bakra Admin Dashboard
        </h1>
        {/* <DateFilterBar range={range} setRange={setRange} /> */}
      </div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
   
        

         <ChartCard title="📊 7-Day Revenue Trend">
    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-300">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={orderTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#475569", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
          />
          <YAxis
            tick={{ fill: "#475569", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e1" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              border: "none",
              color: "#1e293b",
            }}
            labelStyle={{ color: "#64748b", fontWeight: 500 }}
            cursor={{ stroke: "#94a3b8", strokeDasharray: "3 3" }}
          />
          <Line
            type="monotone"
            dataKey="totalCollection"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, fill: "#fff", stroke: "#2563eb", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            fill="url(#revenueGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </ChartCard>

        {/* 📅 Today's Order Status Distribution */}

<ChartCard title="📅 Today's Order Summary">
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={[
          { name: "Delivered", value: data?.today?.todayDelivered || 0 },
          { name: "Cancelled", value: data?.today?.todayCancelled || 0 },
          { name: "Pending", value: data?.today?.todayPending || 0 },
        ]}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={83}
        label={({ name, value }) => `${name}: ${value}`}
      >
        <Cell fill="#10b981" /> {/* Delivered - Green */}
        <Cell fill="#ef4444" /> {/* Cancelled - Red */}
        <Cell fill="#f59e0b" /> {/* Pending - Yellow */}
      </Pie>
      <Legend />
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</ChartCard>

      </div>

      {/* Recent Orders Table */}
    <ChartCard title="🧾 Recent Orders">
  <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-300">
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full text-sm text-slate-700">
        <thead>
          <tr className="bg-slate-900 text-white uppercase text-xs tracking-wider">
            <th className="py-3 px-4 text-left rounded-tl-lg">#</th>
            <th className="py-3 px-4 text-left">Customer</th>
            <th className="py-3 px-4 text-left">Phone</th>
            <th className="py-3 px-4 text-left">Quantity</th>
            <th className="py-3 px-4 text-left">Payment</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left rounded-tr-lg">Date</th>
          </tr>
        </thead>
        <tbody>
          {recentOrders.length ? (
            recentOrders.map((o, i) => (
              <tr
                key={i}
                className="border-b hover:bg-slate-50 transition duration-200"
              >
                <td className="px-4 py-3 font-medium text-slate-600">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{o.customerId?.name}</td>
                <td className="px-4 py-3">{o.customerId?.phone}</td>
                <td className="px-4 py-3">{o.quantity}</td>
                <td className="px-4 py-3 text-slate-600">{o.paymentMode || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      o.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : o.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(o.createdAt).toISOString().split("T")[0]}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center text-slate-500 py-8 italic bg-slate-50 rounded-b-lg"
              >
                No recent orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</ChartCard>

    </div>
  );
};

export default Dashboard;
