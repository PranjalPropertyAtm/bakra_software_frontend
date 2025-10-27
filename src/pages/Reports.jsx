// // 📁 src/pages/Reports.jsx
// import React, { useEffect, useState } from "react";
// import axiosInstance from "../lib/axios.js";
// import { toast } from "react-toastify";
// import { Calendar, BarChart3, DollarSign, Users, FileText } from "lucide-react";
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// const Reports = () => {
//     const [summary, setSummary] = useState(null);
//     const [salesReport, setSalesReport] = useState(null);
//     const [growthReport, setGrowthReport] = useState([]);
//     const [cancellations, setCancellations] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [dateRange, setDateRange] = useState({
//         startDate: "",
//         endDate: "",
//     });

//     // ✅ Fetch today's summary
//     const fetchTodaySummary = async () => {
//         try {
//             setLoading(true);
//             const res = await axiosInstance.get("reports/today-summary");
//             setSummary(res.data);
//         } catch (err) {
//             toast.error("Error fetching today's summary");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ Fetch sales report
//     const fetchSalesReport = async () => {
//         if (!dateRange.startDate || !dateRange.endDate) {
//             return toast.warning("Please select start and end date");
//         }
//         try {
//             setLoading(true);
//             const res = await axiosInstance.get(
//                 `/reports/sales-report?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
//             );
//             setSalesReport(res.data.report);
//             toast.success("Sales report fetched successfully");
//         } catch (err) {
//             toast.error("Error fetching sales report");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ Fetch customer growth report
//     const fetchCustomerGrowth = async () => {
//         try {
//             const res = await axiosInstance.get("reports/customer-growth");
//             setGrowthReport(res.data.growth);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     // ✅ Fetch all cancellations
//     const fetchCancellations = async () => {
//         try {
//             const res = await axiosInstance.get("reports/cancellations");
//             setCancellations(res.data.cancellations);
//         } catch (err) {
//             toast.error("Error fetching cancellations");
//         }
//     };

//     useEffect(() => {
//         fetchTodaySummary();
//         fetchCustomerGrowth();
//         fetchCancellations();
//     }, []);

//     return (
//         <div className="p-6 space-y-6">
//             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                 <FileText className="text-indigo-600" /> Reports Dashboard
//             </h1>

//             {/* ✅ Today’s Summary Cards */}
//             {summary && (
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div className="shadow-md border-l-4 border-green-500 bg-white rounded-lg">
//                         <div className="p-4">
//                             <h2 className="text-gray-500 text-sm">Total Orders</h2>
//                             <p className="text-2xl font-bold">{summary.totalOrders}</p>

//                         </div>
//                     </div>

//                     <div className="shadow-md border-l-4 border-green-500 bg-white rounded-lg">
//                         <div className="p-4">
//                             <h2 className="text-gray-500 text-sm">Delivered</h2>
//                             <p className="text-2xl font-bold">{summary.delivered}</p>
//                         </div>
//                     </div>

//                     <div className="shadow-md border-l-4 border-green-500 bg-white rounded-lg">
//                         <div className="p-4">
//                             <h2 className="text-gray-500 text-sm">Pending</h2>
//                             <p className="text-2xl font-bold">{summary.pending}</p>
//                         </div>
//                     </div>

//                     <div className="shadow-md border-l-4 border-green-500 bg-white rounded-lg">
//                         <div className="p-4">
//                             <h2 className="text-gray-500 text-sm">Cancelled</h2>
//                             <p className="text-2xl font-bold">{summary.cancelled}</p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ✅ Sales Report by Date Range */}
//             <div className="p-4 border rounded-lg bg-white shadow">
//                 <div className="flex flex-wrap items-center gap-4 mb-4">
//                     <Calendar className="text-indigo-600" />
//                     <input
//                         type="date"
//                         value={dateRange.startDate}
//                         onChange={(e) =>
//                             setDateRange({ ...dateRange, startDate: e.target.value })
//                         }
//                         className="border rounded p-2"
//                     />
//                     <input
//                         type="date"
//                         value={dateRange.endDate}
//                         onChange={(e) =>
//                             setDateRange({ ...dateRange, endDate: e.target.value })
//                         }
//                         className="border rounded p-2"
//                     />
//                     <button
//                         onClick={fetchSalesReport}
//                         disabled={loading}
//                         className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
//                     >
//                         {loading ? "Loading..." : "Get Sales Report"}
//                     </button>
//                 </div>

//                 {salesReport && (
//                     <div className="flex gap-6 mt-4">
//                         <div className="shadow-md border-l-4 border-green-500 bg-white rounded-lg">
//                             <div className="p-4">
//                                 <h2 className="text-gray-500 text-sm">Total Delivered Orders</h2>
//                                 <p className="text-2xl font-bold">{salesReport.totalOrders}</p>
//                             </div>
//                         </div>
//                         <div className="shadow-md border-l-4 border-green-500 bg-white rounded-lg">
//                             <div className="p-4">
//                                 <h2 className="text-gray-500 text-sm">Total Revenue</h2>
//                                 <p className="text-2xl font-bold">₹{salesReport.totalRevenue}</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* ✅ Customer Growth Chart */}
//             <div className="p-4 border rounded-lg bg-white shadow">
//                 <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <BarChart3 className="text-indigo-600" /> Customer Growth
//                 </h2>
//                 {growthReport.length > 0 ? (
//                     <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={growthReport}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="_id" />
//                             <YAxis />
//                             <Tooltip />
//                             <Bar dataKey="newCustomers" fill="#6366f1" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 ) : (
//                     <p className="text-gray-500 text-center">No growth data available</p>
//                 )}
//             </div>

//             {/* ✅ Cancellation Summary Table */}
//             <div className="p-4 border rounded-lg bg-white shadow">
//                 <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                     <Users className="text-red-600" /> All Cancellations
//                 </h2>
//                 {cancellations.length > 0 ? (
//                     <table className="w-full border text-sm">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="p-2 text-left">Customer</th>
//                                 <th className="p-2 text-left">Order ID</th>
//                                 <th className="p-2 text-left">Reason</th>
//                                 <th className="p-2 text-left">Date</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {cancellations.map((c) => (
//                                 <tr key={c._id} className="border-t hover:bg-gray-50">
//                                     <td className="p-2">{c.customerId?.name}</td>
//                                     <td className="p-2">{c.orderId?._id}</td>
//                                     <td className="p-2">{c.reason}</td>
//                                     <td className="p-2">
//                                         {new Date(c.cancelledAt).toLocaleDateString()}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 ) : (
//                     <p className="text-gray-500 text-center">No cancellations found</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Reports;


// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Calendar, BarChart3, DollarSign, Users, FileText } from "lucide-react";

// // 📊 Dummy report components (you’ll later connect APIs here)
// const OrdersReport = () => (
//   <div className="p-6">
//     <h2 className="text-xl font-semibold mb-2">📦 Orders Report</h2>
//     <p className="text-gray-400">View and analyze all orders by date range.</p>
//   </div>
// );

// const SalesReport = () => (
//   <div className="p-6">
//     <h2 className="text-xl font-semibold mb-2">💰 Sales Report</h2>
//     <p className="text-gray-400">Track revenue and sales trends by time period.</p>
//   </div>
// );

// const CustomerGrowthReport = () => (
//   <div className="p-6">
//     <h2 className="text-xl font-semibold mb-2">👥 Customer Growth</h2>
//     <p className="text-gray-400">Analyze customer acquisition month by month.</p>
//   </div>
// );

// const CancellationsReport = () => (
//   <div className="p-6">
//     <h2 className="text-xl font-semibold mb-2">❌ Cancellations Report</h2>
//     <p className="text-gray-400">Review cancelled orders and reasons for cancellations.</p>
//   </div>
// );

// export default function Reports() {
//   const [activeTab, setActiveTab] = useState("orders");

//   const tabs = [
//     { id: "orders", label: "Orders Report" },
//     { id: "sales", label: "Sales Report" },
//     { id: "growth", label: "Customer Growth" },
//     { id: "cancellations", label: "Cancellations Report" },
//   ];

//   return (
//     // <div className="min-h-screen bg-slate-900 text-white p-6">
//     //   {/* Header */}
//     //   <h1 className="text-3xl font-bold mb-6">📊 Reports Dashboard</h1>
//     <div className="p-6 space-y-6">
//             <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                <FileText className="text-indigo-600" /> Reports Dashboard
//            </h1>

//       {/* Tabs */}
//       <div className="flex overflow-x-auto border-b border-slate-700 mb-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActiveTab(tab.id)}
//             className={`px-4 py-2 whitespace-nowrap text-sm md:text-base transition-all duration-300 
//               ${
//                 activeTab === tab.id
//                   ? "border-b-2 border-blue-500 text-blue-400 font-semibold"
//                   : "text-gray-400 hover:text-blue-300"
//               }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Animated Content */}
//       <div className="bg-slate-800 rounded-2xl shadow-md p-4 md:p-6">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeTab}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -15 }}
//             transition={{ duration: 0.3 }}
//           >
//             {activeTab === "orders" && <OrdersReport />}
//             {activeTab === "sales" && <SalesReport />}
//             {activeTab === "growth" && <CustomerGrowthReport />}
//             {activeTab === "cancellations" && <CancellationsReport />}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

// src/pages/Reports.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast } from "react-toastify";
// import { Plus, RefreshCw } from "lucide-react";
// import axiosInstance from "../lib/axios.js"; // your axios instance

// const PAGE_SIZE = 10;
// const COLORS = ["#dc2626", "#f59e0b", "#10b981", "#6366f1", "#ef4444", "#fb923c"];

// function formatMonthNumToName(n) {
//   const months = [
//     "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
//   ];
//   return months[(n - 1 + 12) % 12] || `M${n}`;
// }

// export default function Reports() {
//   const [activeTab, setActiveTab] = useState("orders");

//   // Common loading / errors
//   const [loading, setLoading] = useState(false);

//   // ---------- ORDERS TAB ----------
//   const [orders, setOrders] = useState([]); // raw orders for orders tab
//   const [ordersDateRange, setOrdersDateRange] = useState({ startDate: "", endDate: "" });
//   const [ordersPage, setOrdersPage] = useState(1);

//   // ---------- SALES TAB ----------
//   const [salesDateRange, setSalesDateRange] = useState({ startDate: "", endDate: "" });
//   const [salesSummary, setSalesSummary] = useState(null); // { totalRevenue, totalOrders }
//   const [salesChartData, setSalesChartData] = useState([]); // array of { date, revenue }

//   // ---------- CUSTOMER GROWTH ----------
//   const [growthData, setGrowthData] = useState([]); // array { _id: monthNumber, newCustomers }
//   const [growthLoading, setGrowthLoading] = useState(false);

//   // ---------- CANCELLATIONS ----------
//   const [cancellations, setCancellations] = useState([]);
//   const [cancelReasonSummary, setCancelReasonSummary] = useState([]);
//   const [cancellationsDateRange, setCancellationsDateRange] = useState({ startDate: "", endDate: "" });

//   // ----------------- HELPERS -----------------
//   const resetPagination = () => setOrdersPage(1);

//   // ----------------- API CALLS -----------------

//   // Orders by date range (Orders tab)
//   const fetchOrdersByRange = async (startDate, endDate) => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get(
//         `reports/orders-range?startDate=${startDate}&endDate=${endDate}`
//       );
//       if (res.data.success) {
//         setOrders(res.data.orders || []);
//         setOrdersPage(1);
//       } else {
//         toast.error("Failed to fetch orders");
//       }
//     } catch (err) {
//       console.error("fetchOrdersByRange:", err);
//       toast.error(err?.response?.data?.message || "Failed to fetch orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Sales report aggregated (controller returns totals)
//   const fetchSalesReport = async (startDate, endDate) => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get(`reports/sales-report?startDate=${startDate}&endDate=${endDate}`);
//       if (res.data.success) {
//         setSalesSummary(res.data.report || { totalRevenue: 0, totalOrders: 0 });
//       } else {
//         toast.error("Failed to fetch sales report");
//       }
//       // For chart, fetch orders in same range to build a daily revenue series
//       const ordersRes = await axiosInstance.get(`reports/orders-range?startDate=${startDate}&endDate=${endDate}`);
//       if (ordersRes.data.success) {
//         // create date->revenue map
//         const map = {};
//         ordersRes.data.orders.forEach(o => {
//           const d = o.orderDate || new Date(o.createdAt).toISOString().split("T")[0];
//           map[d] = (map[d] || 0) + (o.amount || 0);
//         });
//         const chart = Object.keys(map).sort().map(date => ({ date, revenue: map[date] }));
//         setSalesChartData(chart);
//       } else {
//         setSalesChartData([]);
//       }
//     } catch (err) {
//       console.error("fetchSalesReport:", err);
//       toast.error("Error fetching sales data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Customer growth
//   const fetchCustomerGrowth = async () => {
//     try {
//       setGrowthLoading(true);
//       const res = await axiosInstance.get("reports/customer-growth");
//       if (res.data.success) setGrowthData(res.data.growth || []);
//       else toast.error("Failed to fetch growth data");
//     } catch (err) {
//       console.error("fetchCustomerGrowth:", err);
//       toast.error("Error fetching growth data");
//     } finally {
//       setGrowthLoading(false);
//     }
//   };

//   // All cancellations & reason summary
//   const fetchCancellationsAll = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get("reports/cancellations");
//       if (res.data.success) setCancellations(res.data.cancellations || []);
//       else toast.error("Failed to fetch cancellations");
//     } catch (err) {
//       console.error("fetchCancellationsAll:", err);
//       toast.error("Error fetching cancellations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCancelReasonSummary = async () => {
//     try {
//       const res = await axiosInstance.get("reports/cancellation-summary");
//       if (res.data.success) setCancelReasonSummary(res.data.summary || []);
//     } catch (err) {
//       console.error("fetchCancelReasonSummary:", err);
//     }
//   };

//   // Filter cancellations by date
//   const fetchCancellationsByDate = async (startDate, endDate) => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get(`/reports/cancellations-by-date?startDate=${startDate}&endDate=${endDate}`);
//       if (res.data.success) setCancellations(res.data.cancellations || []);
//       else toast.error("Failed to filter cancellations");
//     } catch (err) {
//       console.error("fetchCancellationsByDate:", err);
//       toast.error("Error filtering cancellations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ----------------- LIFECYCLE -----------------
//   useEffect(() => {
//     // Load default summaries when component mounts
//     fetchCustomerGrowth();
//     fetchCancellationsAll();
//     fetchCancelReasonSummary();
//     // load today's orders summary for orders tab default: we won't auto-fetch orders list without dates
//   }, []);

//   // ----------------- PAGINATION for ORDERS -----------------
//   const ordersTotalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
//   const currentOrders = useMemo(() => {
//     const start = (ordersPage - 1) * PAGE_SIZE;
//     return orders.slice(start, start + PAGE_SIZE);
//   }, [orders, ordersPage]);

//   // ----------------- RENDER HELPERS -----------------
//   const OrdersTable = () => (
//     <div>
//       <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-4">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-200">Orders Report</h2>
//           <p className="text-sm text-gray-400">Filter orders by date range and view details.</p>
//         </div>
//         <div className="flex gap-2 items-center">
//           <input
//             type="date"
//             className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-2 text-sm"
//             value={ordersDateRange.startDate}
//             onChange={(e) => setOrdersDateRange(prev => ({ ...prev, startDate: e.target.value }))}
//           />
//           <input
//             type="date"
//             className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-2 text-sm"
//             value={ordersDateRange.endDate}
//             onChange={(e) => setOrdersDateRange(prev => ({ ...prev, endDate: e.target.value }))}
//           />
//           <button
//             onClick={() => {
//               if (!ordersDateRange.startDate || !ordersDateRange.endDate) {
//                 toast.warn("Please select both start and end date");
//                 return;
//               }
//               fetchOrdersByRange(ordersDateRange.startDate, ordersDateRange.endDate);
//             }}
//             className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm text-white flex items-center gap-2"
//           >
//             <RefreshCw size={14} /> Fetch
//           </button>
//         </div>
//       </div>

//       <div className="overflow-x-auto bg-slate-800 rounded-xl shadow-md border border-slate-700">
//         <table className="min-w-full table-auto text-sm text-gray-200">
//           <thead className="bg-slate-900 text-gray-300 uppercase text-xs">
//             <tr>
//               <th className="py-3 px-4 text-left">S.No</th>
//               <th className="py-3 px-4 text-left">Customer</th>
//               <th className="py-3 px-4 text-left">Phone</th>
//               <th className="py-3 px-4 text-left">Amount</th>
//               <th className="py-3 px-4 text-left">Quantity</th>
//               <th className="py-3 px-4 text-left">Payment</th>
//               <th className="py-3 px-4 text-left">Status</th>
//               <th className="py-3 px-4 text-left">Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentOrders.map((o, idx) => (
//               <tr key={o._id || idx} className="border-b border-slate-700 hover:bg-slate-800/60">
//                 <td className="py-3 px-4">{(ordersPage - 1) * PAGE_SIZE + idx + 1}</td>
//                 <td className="py-3 px-4 font-medium">{o.customerId?.name || (o.customer || "—")}</td>
//                 <td className="py-3 px-4">{o.customerId?.phone || "—"}</td>
//                 <td className="py-3 px-4">₹{o.amount || 0}</td>
//                 <td className="py-3 px-4">{o.quantity || "—"}</td>
//                 <td className="py-3 px-4">{o.paymentMode || "—"}</td>
//                 <td className="py-3 px-4">{o.status}</td>
//                 <td className="py-3 px-4">{o.orderDate || new Date(o.createdAt).toISOString().split("T")[0]}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {orders.length === 0 && (
//           <p className="text-center text-gray-400 py-6">{loading ? "Loading orders..." : "No orders found for the selected range."}</p>
//         )}
//       </div>

//       {/* pagination */}
//       {orders.length > PAGE_SIZE && (
//         <div className="flex justify-center items-center gap-3 mt-4">
//           <button
//             disabled={ordersPage === 1}
//             onClick={() => setOrdersPage(p => Math.max(1, p - 1))}
//             className="px-4 py-2 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span className="text-gray-300 text-sm">Page {ordersPage} of {ordersTotalPages}</span>
//           <button
//             disabled={ordersPage === ordersTotalPages}
//             onClick={() => setOrdersPage(p => Math.min(ordersTotalPages, p + 1))}
//             className="px-4 py-2 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   const SalesPanel = () => (
//     <div>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-200">Sales Report</h2>
//           <p className="text-sm text-gray-400">Revenue, delivered orders and trends.</p>
//         </div>

//         <div className="flex gap-2 items-center">
//           <input
//             type="date"
//             value={salesDateRange.startDate}
//             onChange={(e) => setSalesDateRange(prev => ({ ...prev, startDate: e.target.value }))}
//             className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-2 text-sm"
//           />
//           <input
//             type="date"
//             value={salesDateRange.endDate}
//             onChange={(e) => setSalesDateRange(prev => ({ ...prev, endDate: e.target.value }))}
//             className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-2 text-sm"
//           />
//           <button
//             onClick={() => {
//               if (!salesDateRange.startDate || !salesDateRange.endDate) {
//                 toast.warn("Select start and end date");
//                 return;
//               }
//               fetchSalesReport(salesDateRange.startDate, salesDateRange.endDate);
//             }}
//             className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm text-white flex items-center gap-2"
//           >
//             <RefreshCw size={14} /> Generate
//           </button>
//         </div>
//       </div>

//       {/* summary cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
//         <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm">
//           <p className="text-sm text-gray-400">Total Revenue</p>
//           <p className="text-2xl font-bold text-green-400">₹{salesSummary?.totalRevenue ?? 0}</p>
//         </div>
//         <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm">
//           <p className="text-sm text-gray-400">Delivered Orders</p>
//           <p className="text-2xl font-bold text-blue-300">{salesSummary?.totalOrders ?? 0}</p>
//         </div>
//         <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm">
//           <p className="text-sm text-gray-400">Days</p>
//           <p className="text-2xl font-bold text-gray-200">{salesChartData.length || 0}</p>
//         </div>
//       </div>

//       {/* revenue chart */}
//       <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md">
//         <h3 className="text-sm text-gray-300 mb-3">Revenue by Date</h3>
//         {salesChartData && salesChartData.length > 0 ? (
//           <div style={{ width: "100%", height: 300 }}>
//             <ResponsiveContainer>
//               <BarChart data={salesChartData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
//                 <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#cbd5e1" }} />
//                 <YAxis tick={{ fontSize: 12, fill: "#cbd5e1" }} />
//                 <Tooltip wrapperStyle={{ background: "#0f172a", borderRadius: 6 }} />
//                 <Bar dataKey="revenue" fill="#10b981" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         ) : (
//           <p className="text-gray-400">No revenue data for selected range.</p>
//         )}
//       </div>
//     </div>
//   );

//   const GrowthPanel = () => {
//     // prepare chart data sorted by month index
//     const chartData = growthData
//       .map(item => ({ month: formatMonthNumToName(item._id), newCustomers: item.newCustomers || 0 }))
//       .sort((a, b) => {
//         // try to sort by month name order using months index
//         const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//         return months.indexOf(a.month) - months.indexOf(b.month);
//       });

//     const totalNew = growthData.reduce((s, it) => s + (it.newCustomers || 0), 0);

//     return (
//       <div>
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-200">Customer Growth</h2>
//             <p className="text-sm text-gray-400">Monthly new customers</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//           <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
//             <p className="text-sm text-gray-400">New Customers (total)</p>
//             <p className="text-2xl font-bold text-indigo-300">{totalNew}</p>
//           </div>
//           <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 md:col-span-2">
//             <p className="text-sm text-gray-300 mb-2">Monthly trend</p>
//             {chartData.length > 0 ? (
//               <div style={{ width: "100%", height: 260 }}>
//                 <ResponsiveContainer>
//                   <LineChart data={chartData}>
//                     <CartesianGrid stroke="#1f2937" />
//                     <XAxis dataKey="month" tick={{ fill: "#cbd5e1" }} />
//                     <YAxis tick={{ fill: "#cbd5e1" }} />
//                     <Tooltip wrapperStyle={{ background: "#0f172a", borderRadius: 6 }} />
//                     <Line type="monotone" dataKey="newCustomers" stroke="#6366f1" strokeWidth={3} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             ) : (
//               <p className="text-gray-400">No growth data available.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const CancellationsPanel = () => {
//     const pieData = cancelReasonSummary.map((s) => ({ name: s._id || "Unknown", value: s.count }));
//     return (
//       <div>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-200">Cancellations</h2>
//             <p className="text-sm text-gray-400">See cancellations and reasons.</p>
//           </div>

//           <div className="flex gap-2">
//             <input
//               type="date"
//               value={cancellationsDateRange.startDate}
//               onChange={(e) => setCancellationsDateRange(prev => ({ ...prev, startDate: e.target.value }))}
//               className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-2 text-sm"
//             />
//             <input
//               type="date"
//               value={cancellationsDateRange.endDate}
//               onChange={(e) => setCancellationsDateRange(prev => ({ ...prev, endDate: e.target.value }))}
//               className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-2 text-sm"
//             />
//             <button
//               onClick={() => {
//                 if (!cancellationsDateRange.startDate || !cancellationsDateRange.endDate) {
//                   toast.warn("Select date range");
//                   return;
//                 }
//                 fetchCancellationsByDate(cancellationsDateRange.startDate, cancellationsDateRange.endDate);
//               }}
//               className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm text-white"
//             >
//               Filter
//             </button>
//             <button
//               onClick={() => {
//                 fetchCancellationsAll();
//                 fetchCancelReasonSummary();
//                 setCancellationsDateRange({ startDate: "", endDate: "" });
//               }}
//               className="bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded text-sm text-white"
//             >
//               Reset
//             </button>
//           </div>
//         </div>

//         <div className="grid md:grid-cols-3 gap-4">
//           <div className="md:col-span-2 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md overflow-x-auto">
//             <table className="min-w-full text-sm text-gray-200">
//               <thead className="bg-slate-900 text-gray-300 uppercase text-xs">
//                 <tr>
//                   <th className="p-2 text-left">#</th>
//                   <th className="p-2 text-left">Customer</th>
//                   <th className="p-2 text-left">Order</th>
//                   <th className="p-2 text-left">Reason</th>
//                   <th className="p-2 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cancellations.map((c, i) => (
//                   <tr key={c._id || i} className="border-b border-slate-700 hover:bg-slate-800/60">
//                     <td className="p-2">{i + 1}</td>
//                     <td className="p-2">{c.customerId?.name || "—"}</td>
//                     <td className="p-2">{c.orderId?._id || "—"}</td>
//                     <td className="p-2">{c.reason}</td>
//                     <td className="p-2">{new Date(c.cancelledAt).toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {cancellations.length === 0 && <p className="text-center text-gray-400 py-6">No cancellations found.</p>}
//           </div>

//           <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md">
//             <h3 className="text-sm text-gray-300 mb-3">Top Cancellation Reasons</h3>
//             {pieData.length > 0 ? (
//               <div style={{ width: "100%", height: 260 }}>
//                 <ResponsiveContainer>
//                   <PieChart>
//                     <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
//                       {pieData.map((entry, idx) => (
//                         <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             ) : (
//               <p className="text-gray-400">No reason summary available.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ---------- TAB LIST ----------
//   const tabs = [
//     { id: "orders", label: "Orders Report" },
//     { id: "sales", label: "Sales Report" },
//     { id: "growth", label: "Customer Growth" },
//     { id: "cancellations", label: "Cancellations" },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-900 text-white p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold">📊 Reports Dashboard</h1>
//           <p className="text-sm text-gray-400">Analyze orders, sales, customers and cancellations</p>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex overflow-x-auto gap-2 mb-4 border-b border-slate-800 pb-2">
//         {tabs.map(t => (
//           <button
//             key={t.id}
//             onClick={() => setActiveTab(t.id)}
//             className={`px-4 py-2 text-sm rounded-t-md transition-all ${
//               activeTab === t.id
//                 ? "border-b-2 border-green-500 text-green-300 font-semibold"
//                 : "text-gray-400 hover:text-green-300"
//             }`}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {/* Animated panel container (same rounded card look as Orders.jsx) */}
//       <div className="bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-700">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeTab}
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//             transition={{ duration: 0.2 }}
//           >
//             {/* Render matching panel */}
//             {activeTab === "orders" && <OrdersTable />}
//             {activeTab === "sales" && <SalesPanel />}
//             {activeTab === "growth" && <GrowthPanel />}
//             {activeTab === "cancellations" && <CancellationsPanel />}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { DateRange } from "react-date-range";
import { Calendar, BarChart3, Users, XCircle } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DATE_PRESETS, toYYYYMMDD } from "../utils/dataPresets.jsx";

// 🧩 child report components (placeholders for now)
import OrdersReport from "../components/OrdersReport.jsx";
import SalesReport from "../components/SalesReport.jsx";
import CustomerGrowthReport from "../components/CustomerGrowthReport.jsx";
import CancellationsReport from "../components/CancellationsReport.jsx";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const startDate = toYYYYMMDD(range[0].startDate);
  const endDate = toYYYYMMDD(range[0].endDate);

  const tabs = [
    { id: "orders", label: "Orders Report", icon: <BarChart3 size={18} /> },
    { id: "sales", label: "Sales Report", icon: <Calendar size={18} /> },
    { id: "growth", label: "Customer Growth", icon: <Users size={18} /> },
    { id: "cancellations", label: "Cancellations", icon: <XCircle size={18} /> },
  ];

  const applyPreset = (label) => {
    const preset = DATE_PRESETS[label];
    if (preset) {
      const { startDate, endDate } = preset.range();
      setRange([{ startDate, endDate, key: "selection" }]);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersReport startDate={startDate} endDate={endDate} />;
      case "sales":
        return <SalesReport startDate={startDate} endDate={endDate} />;
      case "growth":
        return <CustomerGrowthReport startDate={startDate} endDate={endDate} />;
      case "cancellations":
        return <CancellationsReport startDate={startDate} endDate={endDate} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-4 md:mb-0">
          Reports Dashboard
        </h1>

        {/* Date Presets */}
        <div className="flex flex-wrap gap-2 items-center">
          {Object.keys(DATE_PRESETS).map((key) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="px-3 py-1 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              {DATE_PRESETS[key].label}
            </button>
          ))}

          <button
            onClick={() => setShowCalendar((p) => !p)}
            className="px-3 py-1 text-sm border border-slate-300 rounded-lg flex items-center gap-2 hover:bg-slate-100 transition"
          >
            <Calendar size={16} />{" "}
            {`${format(range[0].startDate, "MMM dd")} - ${format(
              range[0].endDate,
              "MMM dd, yyyy"
            )}`}
          </button>
        </div>
      </div>

      {/* Calendar Picker */}
      {showCalendar && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 shadow-md w-fit mb-4"
        >
          <DateRange
            editableDateInputs
            onChange={(item) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={range}
            rangeColors={["#0f172a"]}
          />
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === tab.id
                ? "bg-slate-900 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            } transition`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="bg-white shadow-md rounded-xl p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Reports;

