// import React from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { useReportsData } from "../hooks/useReportsData";

// // 🔹 Month name helper
// const monthNames = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];

// const CustomerGrowthReport = () => {
//   // 🧩 Fetch API data
//   const { data, loading, error } = useReportsData("reports/customer-growth");

//   if (loading) return <p className="text-slate-500">Loading customer growth...</p>;
//   if (error) return <p className="text-red-500">Failed to load data.</p>;

//   // 🧮 Step 1: Convert API data → map (monthNumber → count)
//   const customerMap = {};
//   data?.growth?.forEach((g) => {
//     customerMap[g._id] = g.newCustomers;
//   });

//   // 🧮 Step 2: Fill all 12 months with 0 if missing
//   const chartData = monthNames.map((month, index) => ({
//     month,
//     newCustomers: customerMap[index + 1] || 0,
//   }));

//   // ⚠️ Step 3: Check if all months are 0
//   const totalCustomers = chartData.reduce((sum, m) => sum + m.newCustomers, 0);
//   if (totalCustomers === 0) {
//     return (
//       <div className="text-center py-10 bg-slate-50 rounded-xl shadow-sm border">
//         <h2 className="text-lg font-semibold text-slate-800 mb-2">
//           Customer Growth (Month-wise)
//         </h2>
//         <p className="text-slate-500">No customers found yet 🚫</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-lg font-semibold text-slate-800">
//         Customer Growth (Month-wise)
//       </h2>

//       {/* 📈 Chart Section */}
//       <div className="w-full h-64 bg-slate-50 rounded-xl p-4 shadow-sm border">
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart data={chartData}>
//             <defs>
//               <linearGradient id="colorCust" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#0f172a" stopOpacity={0.8} />
//                 <stop offset="95%" stopColor="#0f172a" stopOpacity={0.1} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//             <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 12 }} />
//             <YAxis stroke="#475569" />
//             <Tooltip />
//             <Area
//               type="monotone"
//               dataKey="newCustomers"
//               stroke="#0f172a"
//               fillOpacity={1}
//               fill="url(#colorCust)"
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>

//       {/* 📋 Table Section */}
//       <div className="overflow-x-auto border rounded-lg shadow-sm">
//         <table className="min-w-full text-sm text-slate-800">
//           <thead className="bg-slate-900 text-white">
//             <tr>
//               <th className="px-3 py-2 text-left">Month</th>
//               <th className="px-3 py-2 text-left">New Customers</th>
//             </tr>
//           </thead>
//           <tbody>
//             {chartData.map((row, i) => (
//               <tr key={i} className="border-b hover:bg-slate-100">
//                 <td className="px-3 py-2">{row.month}</td>
//                 <td className="px-3 py-2">{row.newCustomers}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CustomerGrowthReport;
import React from "react";
import { useReportsData } from "../hooks/useReportsData";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomerGrowthReport = () => {
  const { data, loading, error } = useReportsData("reports/customer-growth");

  if (loading) return <p>Loading customer growth...</p>;
  if (error) return <p>Error fetching report: {error.message}</p>;

  // ✅ Safely map only if data?.growth is valid
  const chartData = Array.isArray(data?.growth)
    ? data.growth.map((item) => ({
        month: `${item._id.month}-${item._id.year}`,
        newCustomers: item.newCustomers,
      }))
    : [];

  console.log("📊 Chart Data:", chartData);

  if (chartData.length === 0) {
    return <p>No customer growth data available.</p>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Customer Growth Report
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 12 }} />
            <YAxis stroke="#475569" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="newCustomers"
              stroke="#0f172a"
              fillOpacity={1}
              fill="url(#colorCust)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerGrowthReport;
