// import React from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
// import { useReportsData } from "../hooks/useReportsData";

// const OrdersReport = ({ startDate, endDate }) => {
//   const { data, loading } = useReportsData("reports/orders-by-date", {
//     startDate,
//     endDate,
//   });

//   if (loading) return <p className="text-slate-500">Loading...</p>;

//   const chartData =
//     data?.orders?.map((o) => ({
//       date: new Date(o._id).toLocaleDateString(),
//       total: o.totalOrders,
//     })) || [];

//   return (
//     <div className="space-y-6">
//       <h2 className="text-lg font-semibold text-slate-800">
//         Orders Overview ({startDate} → {endDate})
//       </h2>

//       {/* Chart */}
//       <div className="w-full h-64 bg-slate-50 rounded-xl p-4">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="total" fill="#0f172a" radius={6} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Summary Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full border text-sm text-slate-800">
//           <thead className="bg-slate-900 text-white">
//             <tr>
//               <th className="px-3 py-2 text-left">Date</th>
//               <th className="px-3 py-2 text-left">Total Orders</th>
//             </tr>
//           </thead>
//           <tbody>
//             {chartData.map((row, i) => (
//               <tr key={i} className="border-b hover:bg-slate-100">
//                 <td className="px-3 py-2">{row.date}</td>
//                 <td className="px-3 py-2">{row.total}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrdersReport;

// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import { useReportsData } from "../hooks/useReportsData";

// const OrdersReport = ({ startDate, endDate }) => {
//   const { data, loading, error } = useReportsData("reports/orders-by-date", {
//     startDate,
//     endDate,
//   });

//   if (loading) return <p className="text-slate-500">Loading...</p>;
//   if (error) return <p className="text-red-500">Failed to load data.</p>;

//   const chartData =
//     data?.orders?.map((o) => ({
//       date: o._id, // backend aggregation ke hisaab se
//       total: o.totalOrders,
//     })) || [];

//   return (
//     <div className="space-y-6">
//       <h2 className="text-lg font-semibold text-slate-800">
//         Orders Overview ({startDate} → {endDate})
//       </h2>

//       {chartData.length === 0 ? (
//         <p className="text-slate-500">No orders found for this date range.</p>
//       ) : (
//         <>
//           <div className="w-full h-64 bg-slate-50 rounded-xl p-4">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="total" fill="#0f172a" radius={6} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full border text-sm text-slate-800">
//               <thead className="bg-slate-900 text-white">
//                 <tr>
//                <th className="py-3 px-4 text-left">S.No</th>
//                <th className="py-3 px-4 text-left">Customer</th>
//                <th className="py-3 px-4 text-left">Phone</th>
//                <th className="py-3 px-4 text-left">Amount</th>
//                <th className="py-3 px-4 text-left">Quantity</th>
//               <th className="py-3 px-4 text-left">Payment</th>
//               <th className="py-3 px-4 text-left">Status</th>
//               <th className="py-3 px-4 text-left">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {chartData.map((row, i) => (
//                   <tr key={i} className="border-b hover:bg-slate-100">
//                     <td className="px-3 py-2">{row.customerId?.name }</td>
//                     <td className="px-3 py-2">{row.customerId?.phone}</td>
//                     <td className="px-3 py-2">{row.amount}</td>

//                     <td className="px-3 py-2">{row.quantity}</td>

//                     <td className="px-3 py-2">{row.paymentMode}</td>

//                     <td className="px-3 py-2">{row.status}</td>

//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}
//     </div>
        
//       )
// };

// export default OrdersReport;

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useReportsData } from "../hooks/useReportsData";

const OrdersReport = ({ startDate, endDate }) => {
  const { data, loading, error } = useReportsData("reports/orders-by-date", {
    startDate,
    endDate,
  });

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (error) return <p className="text-red-500">Failed to load data.</p>;

  // 🟢 Chart data
//   const chartData =
//     data?.orders?.map((o) => ({
//       date: o._id,
//       total: o.totalOrders,
//     })) || [];

  // 🟢 Detailed orders
  const allOrders = data?.ordersList || data?.orders || [];

  return (
    <div className="space-y-6">
    
          <h2 className="text-lg font-semibold text-slate-800">
        Orders Overview {" "}
        <span className="text-slate-500 text-sm font-normal">
          ({startDate} → {endDate})
        </span>
      </h2>
      

      {/* Chart */}
      {/* {chartData.length > 0 ? (
        <div className="w-full h-64 bg-slate-50 rounded-xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#0f172a" radius={6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-slate-500">No orders found for this date range.</p>
      )} */}

      {/* Table */}
      {allOrders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-slate-800">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="py-3 px-4 text-left">S.No</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Payment</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((row, i) => (
                <tr key={i} className="border-b hover:bg-slate-100">
                  <td className="px-3 py-2">{i + 1}</td>
                  <td className="px-3 py-2">{row.customerId?.name || "-"}</td>
                  <td className="px-3 py-2">{row.customerId?.phone || "-"}</td>
                  <td className="px-3 py-2">₹{row.amount}</td>
                  <td className="px-3 py-2">{row.quantity}</td>
                  <td className="px-3 py-2">{row.paymentMode}</td>
                  <td className="px-3 py-2">{row.status}</td>
                  <td className="px-3 py-2">
                    {new Date(row.orderDate).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersReport;
