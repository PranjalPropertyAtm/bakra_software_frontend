

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

//   // 🟢 Chart data
// //   const chartData =
// //     data?.orders?.map((o) => ({
// //       date: o._id,
// //       total: o.totalOrders,
// //     })) || [];

//   // 🟢 Detailed orders
//   const allOrders = data?.ordersList || data?.orders || [];

//   return (
//     <div className="space-y-6">
    
//           <h2 className="text-lg font-semibold text-slate-800">
//         Orders Overview {" "}
//         <span className="text-slate-500 text-sm font-normal">
//           ({startDate} → {endDate})
//         </span>
//       </h2>
      

//       {/* Chart */}
//       {/* {chartData.length > 0 ? (
//         <div className="w-full h-64 bg-slate-50 rounded-xl p-4">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="total" fill="#0f172a" radius={6} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       ) : (
//         <p className="text-slate-500">No orders found for this date range.</p>
//       )} */}

//       {/* Table */}
//       {allOrders.length > 0 && (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border text-sm text-slate-800">
//             <thead className="bg-slate-900 text-white">
//               <tr>
//                 <th className="py-3 px-4 text-left">S.No</th>
//                 <th className="py-3 px-4 text-left">Customer</th>
//                 <th className="py-3 px-4 text-left">Phone</th>
//                 <th className="py-3 px-4 text-left">Amount</th>
//                 <th className="py-3 px-4 text-left">Quantity</th>
//                 <th className="py-3 px-4 text-left">Payment</th>
//                 <th className="py-3 px-4 text-left">Status</th>
//                 <th className="py-3 px-4 text-left">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {allOrders.map((row, i) => (
//                 <tr key={i} className="border-b hover:bg-slate-100">
//                   <td className="px-3 py-2">{i + 1}</td>
//                   <td className="px-3 py-2">{row.customerId?.name || "-"}</td>
//                   <td className="px-3 py-2">{row.customerId?.phone || "-"}</td>
//                   <td className="px-3 py-2">₹{row.amount}</td>
//                   <td className="px-3 py-2">{row.quantity}</td>
//                   <td className="px-3 py-2">{row.paymentMode}</td>
//                   <td className="px-3 py-2">{row.status}</td>
//                   <td className="px-3 py-2">
//                     {new Date(row.orderDate).toLocaleDateString("en-IN")}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdersReport;

import React, { useState } from "react";
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

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (error) return <p className="text-red-500">Failed to load data.</p>;

  const allOrders = data?.ordersList || data?.orders || [];

  // 🧮 Pagination logic
  const totalPages = Math.ceil(allOrders.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = allOrders.slice(indexOfFirstRow, indexOfLastRow);

  // 🧭 Pagination functions
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">
        Orders Overview{" "}
        <span className="text-slate-500 text-sm font-normal">
          ({startDate} → {endDate})
        </span>
      </h2>

      {/* Table */}
      {allOrders.length > 0 ? (
        <>
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
                {currentRows.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-slate-100">
                    <td className="px-3 py-2">{indexOfFirstRow + i + 1}</td>
                    <td className="px-3 py-2">{row.customerId?.name || "-"}</td>
                    <td className="px-3 py-2">{row.customerId?.phone || "-"}</td>
                    <td className="px-3 py-2">₹{row.amount}</td>
                    <td className="px-3 py-2">{row.quantity}</td>
                    <td className="px-3 py-2">{row.paymentMode}</td>
                    <td className="px-3 py-2">{row.status}</td>
                    <td className="px-3 py-2">
                      {new Date(row.orderDate).toISOString().split("T")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {/* <div className="flex items-center justify-between mt-4"> */}
            {/* <p className="text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </p> */}

            {allOrders.length > 10 && (
  <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">
    <button
      onClick={() => setCurrentPage((p) => p - 1)}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded-md border text-sm ${
        currentPage === 1
          ? "disabled:opacity-50 "
          : "bg-white hover:bg-gray-100"
      }`}
    >
      Prev
    </button>

    <span className="text-gray-600 text-sm">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => setCurrentPage((p) => p + 1)}
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded-md border text-sm ${
        currentPage === totalPages
          ? "disabled:opacity-50 "
          : "bg-white hover:bg-gray-100"
      }`}
    >
      Next
    </button>
  </div>
)}
          {/* </div> */}
        </>
      ) : (
        <p className="text-slate-500">No orders found for this date range.</p>
      )}
    </div>
  );
};

export default OrdersReport;
