

// src/pages/Dashboard.jsx

import React, { useState, useEffect } from "react";
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

  // 📊 Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("dashboard/summary");
        console.log("✅ Dashboard API Response:", res.data);
        setData(res.data.dashboard);
      } catch (err) {
        console.error("❌ Error fetching dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [range]);

  if (loading)
    return <p className="text-slate-500 text-center mt-10">Loading Dashboard...</p>;
  if (error)
    return (
      <p className="text-red-500 text-center mt-10">{error}</p>
    );

  // 🧮 KPI Cards
  const metrics = [
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
  ];

  // 📈 Charts
  const orderTrend = data?.trends || [];
  const paymentModeData = [
    { mode: "Cash", value: data?.payments?.totalCash || 0 },
    { mode: "UPI", value: data?.payments?.totalUPI || 0 },
  ];

  // 📋 Recent Orders
  const recentOrders = data?.recentOrders || [];

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
        {/* Orders Trend */}
        <ChartCard title="📊 7-Day Revenue Trend">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={orderTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalCollection" stroke="#0f172a" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Payment Mode Distribution */}
        {/* <ChartCard title="💳 Payment Mode Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={paymentModeData}
                dataKey="value"
                nameKey="mode"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {paymentModeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard> */}
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
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-slate-800">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Payment Mode</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length ? (
                recentOrders.map((o, i) => (
                  <tr key={i} className="border-b hover:bg-slate-50">
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2">{o.customerId?.name}</td>
                    <td className="px-3 py-2">{o.customerId?.phone}</td>
                    <td className="px-3 py-2">{o.quantity}</td>
                    <td className="px-3 py-2">{o.paymentMode || "-"}</td>
                    <td
                      className={`px-3 py-2 font-medium ${
                        o.status === "Delivered"
                          ? "text-green-600"
                          : o.status === "Cancelled"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {o.status}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center text-slate-500 py-6 italic"
                  >
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};

export default Dashboard;
