

// src/pages/Dashboard.jsx

// import React, { useState, useEffect, useMemo } from "react";
// import { motion } from "framer-motion";
// import {
//   TrendingUp,
//   Package,
//   AlertTriangle,
//   Users,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   CartesianGrid,
//   XAxis,
//   YAxis,
// } from "recharts";
// import axiosInstance from "../lib/axios.js";
// import MetricCard from "../components/MetricCard";
// import ChartCard from "../components/ChartCard";
// import DateFilterBar from "../components/DataFilterBar.jsx";
// import Loader from "../components/Loader";

// const COLORS = ["#0f172a", "#f59e0b", "#10b981", "#ef4444"];

// const Dashboard = () => {
//   const [range, setRange] = useState({
//     startDate: "",
//     endDate: "",
//     preset: "Last 7 Days",
//   });

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // 📊 Fetch Dashboard Data with small client-side cache + background refresh
//   useEffect(() => {
//     let mounted = true;
//     const controller = new AbortController();
//     const cacheKey = `dashboardCache:${JSON.stringify(range)}`;
//     const TTL = 30 * 1000; // 30s

//     const doFetch = async (showLoader = true) => {
//       try {
//         if (showLoader) setLoading(true);
//         const res = await axiosInstance.get("dashboard/summary", { signal: controller.signal });
//         if (!mounted) return;
//         if (res?.data) {
//           setData(res.data.dashboard);
//           try {
//             sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data: res.data.dashboard }));
//           } catch (e) {
//             /* ignore storage errors */
//           }
//         }
//       } catch (err) {
//         if (err.name === 'AbortError' || err?.message === 'canceled' || err.name === 'CanceledError') return;
//         console.error("❌ Error fetching dashboard:", err);
//         if (mounted) setError("Failed to load dashboard data");
//       } finally {
//         if (mounted && showLoader) setLoading(false);
//       }
//     };

//     // try cache first
//     try {
//       const cached = sessionStorage.getItem(cacheKey);
//       if (cached) {
//         const parsed = JSON.parse(cached);
//         if (Date.now() - parsed.ts < TTL) {
//           setData(parsed.data);
//           setLoading(false);
//           // refresh in background without showing loader
//           doFetch(false);
//           return () => { mounted = false; controller.abort(); };
//         }
//       }
//     } catch (e) {
//       /* ignore parse errors */
//     }

//     // no fresh cache — fetch and show loader
//     doFetch(true);

//     return () => { mounted = false; controller.abort(); };
//   }, [range]);


//   // 🧮 KPI Cards
//   const metrics = useMemo(() => [
//     {
//       label: "Total Revenue",
//       value: `₹${data?.metrics?.totalRevenue?.toLocaleString() || 0}`,
//       icon: TrendingUp,
//     },
//     {
//       label: "Total Orders",
//       value: data?.metrics?.totalOrders || 0,
//       icon: Package,
//     },
//     {
//       label: "Delivered",
//       value: data?.metrics?.deliveredOrders || 0,
//       icon: Users,
//     },
//     {
//       label: "Cancelled",
//       value: data?.metrics?.cancelledOrders || 0,
//       icon: AlertTriangle,
//     },
//   ], [data]);

//   // 📈 Charts
//   const orderTrend = useMemo(() => data?.trends || [], [data]);
//   const paymentModeData = useMemo(() => [
//     { mode: "Cash", value: data?.payments?.totalCash || 0 },
//     { mode: "UPI", value: data?.payments?.totalUPI || 0 },
//   ], [data]);

//   // 📋 Recent Orders
//   const recentOrders = useMemo(() => data?.recentOrders || [], [data]);

//   if (loading)
//     return (
//       <div className="min-h-[300px] flex items-center justify-center">
//         <Loader text="Loading dashboard..." />
//       </div>
//     );
//   if (error)
//     return (
//       <p className="text-red-500 text-center mt-10">{error}</p>
//     );

//   return (
//     <div className="p-6 space-y-8 font-[Inter]">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h1 className="text-2xl font-semibold text-slate-900">
//           Bakra Admin Dashboard
//         </h1>
//         {/* <DateFilterBar range={range} setRange={setRange} /> */}
//       </div>

//       {/* KPI Cards */}
//       <motion.div
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         {metrics.map((m, i) => (
//           <MetricCard key={i} {...m} />
//         ))}
//       </motion.div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
   
        

//          <ChartCard title="📊 7-Day Revenue Trend">
//     <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-300">
//       <ResponsiveContainer width="100%" height={260}>
//         <LineChart data={orderTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//           <defs>
//             <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
//               <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
//             </linearGradient>
//           </defs>

//           <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//           <XAxis
//             dataKey="date"
//             tick={{ fill: "#475569", fontSize: 12 }}
//             tickLine={false}
//             axisLine={{ stroke: "#cbd5e1" }}
//           />
//           <YAxis
//             tick={{ fill: "#475569", fontSize: 12 }}
//             tickLine={false}
//             axisLine={{ stroke: "#cbd5e1" }}
//           />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: "white",
//               borderRadius: "10px",
//               boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//               border: "none",
//               color: "#1e293b",
//             }}
//             labelStyle={{ color: "#64748b", fontWeight: 500 }}
//             cursor={{ stroke: "#94a3b8", strokeDasharray: "3 3" }}
//           />
//           <Line
//             type="monotone"
//             dataKey="totalCollection"
//             stroke="#2563eb"
//             strokeWidth={3}
//             dot={{ r: 4, fill: "#fff", stroke: "#2563eb", strokeWidth: 2 }}
//             activeDot={{ r: 6 }}
//             fill="url(#revenueGradient)"
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   </ChartCard>

//         {/* 📅 Today's Order Status Distribution */}

// <ChartCard title="📅 Today's Order Summary">
//   {(() => {
//     const todayData = [
//       { name: "Delivered", value: data?.today?.todayDelivered || 0 },
//       { name: "Cancelled", value: data?.today?.todayCancelled || 0 },
//       { name: "Pending", value: data?.today?.todayPending || 0 },
//     ];
//     const totalOrders = todayData.reduce((sum, item) => sum + item.value, 0);

//     if (totalOrders === 0) {
//       return (
//         <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
//           <div className="text-center">
//             <p className="text-gray-500 text-lg font-medium">No Orders Today</p>
//             <p className="text-gray-400 text-sm mt-2">Check back later for updates</p>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <ResponsiveContainer width="100%" height={280}>
//         <PieChart>
//           <Pie
//             data={todayData}
//             dataKey="value"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={90}
//             innerRadius={40}
//             paddingAngle={2}
//             label={({ name, value, percent }) => {
//               // Only show label if value > 0
//               if (value === 0) return null;
//               return `${name} ${value}`;
//             }}
//             labelLine={true}
//             labelPosition="outside"
//           >
//             <Cell fill="#10b981" /> {/* Delivered - Green */}
//             <Cell fill="#ef4444" /> {/* Cancelled - Red */}
//             <Cell fill="#f59e0b" /> {/* Pending - Yellow */}
//           </Pie>
//           <Legend 
//             verticalAlign="bottom" 
//             height={36}
//             wrapperStyle={{ paddingTop: "20px" }}
//             formatter={(value, entry) => `${value}: ${entry.payload.value}`}
//           />
//           <Tooltip 
//             formatter={(value) => `${value} order${value !== 1 ? 's' : ''}`}
//             contentStyle={{
//               backgroundColor: "white",
//               borderRadius: "8px",
//               border: "1px solid #e5e7eb",
//               padding: "8px 12px",
//             }}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     );
//   })()}
// </ChartCard>

//       </div>

//       {/* Recent Orders Table */}
//     <ChartCard title="🧾 Recent Orders">
//   <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all duration-300">
//     <div className="overflow-x-auto rounded-lg">
//       <table className="min-w-full text-sm text-slate-700">
//         <thead>
//           <tr className="bg-slate-900 text-white uppercase text-xs tracking-wider">
//             <th className="py-3 px-4 text-left rounded-tl-lg">#</th>
//             <th className="py-3 px-4 text-left">Customer</th>
//             <th className="py-3 px-4 text-left">Phone</th>
//             <th className="py-3 px-4 text-left">Quantity</th>
//             <th className="py-3 px-4 text-left">Payment</th>
//             <th className="py-3 px-4 text-left">Status</th>
//             <th className="py-3 px-4 text-left rounded-tr-lg">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {recentOrders.length ? (
//             recentOrders.map((o, i) => (
//               <tr
//                 key={i}
//                 className="border-b hover:bg-slate-50 transition duration-200"
//               >
//                 <td className="px-4 py-3 font-medium text-slate-600">{i + 1}</td>
//                 <td className="px-4 py-3 font-medium">{o.customerId?.name}</td>
//                 <td className="px-4 py-3">{o.customerId?.phone}</td>
//                 <td className="px-4 py-3">{o.quantity}</td>
//                 <td className="px-4 py-3 text-slate-600">{o.paymentMode || "-"}</td>
//                 <td className="px-4 py-3">
//                   <span
//                     className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                       o.status === "Delivered"
//                         ? "bg-green-100 text-green-700"
//                         : o.status === "Cancelled"
//                         ? "bg-red-100 text-red-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {o.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3 text-slate-500">
//                   {new Date(o.createdAt).toISOString().split("T")[0]}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td
//                 colSpan="7"
//                 className="text-center text-slate-500 py-8 italic bg-slate-50 rounded-b-lg"
//               >
//                 No recent orders found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   </div>
// </ChartCard>

//     </div>
//   );
// };

// export default Dashboard;



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

  // 📅 Today's Order Data
  const todayData = useMemo(() => [
    { name: "Delivered", value: data?.today?.todayDelivered || 0 },
    { name: "Cancelled", value: data?.today?.todayCancelled || 0 },
    { name: "Pending", value: data?.today?.todayPending || 0 },
  ], [data?.today]);
  
  const totalOrders = useMemo(() => todayData.reduce((sum, item) => sum + item.value, 0), [todayData]);

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
  {totalOrders === 0 ? (
        <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 text-lg font-medium">No Orders Today</p>
            <p className="text-gray-400 text-sm mt-2">Check back later for updates</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={todayData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={40}
              paddingAngle={2}
              label={({ name, value, percent }) => {
                // Only show label if value > 0
                if (value === 0) return null;
                return `${name} ${value}`;
              }}
              labelLine={true}
              labelPosition="outside"
            >
              <Cell fill="#10b981" /> {/* Delivered - Green */}
              <Cell fill="#ef4444" /> {/* Cancelled - Red */}
              <Cell fill="#f59e0b" /> {/* Pending - Yellow */}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value, entry) => `${value}: ${entry.payload.value}`}
            />
            <Tooltip 
              formatter={(value) => `${value} order${value !== 1 ? 's' : ''}`}
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                padding: "8px 12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
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

