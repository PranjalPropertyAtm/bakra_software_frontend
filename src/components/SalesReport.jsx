import React from "react";
import { useReportsData } from "../hooks/useReportsData";

const SalesReport = ({ startDate, endDate }) => {
  // 🔹 Fetch sales data from backend
  const { data, loading, error } = useReportsData("reports/sales-report", {
    startDate,
    endDate,
  });

  if (loading) return <p className="text-slate-500">Loading sales data...</p>;
  if (error) return <p className="text-red-500">Failed to load sales report.</p>;

    const allOrders = data?.report?.deliveredOrders ||  [];

  // 🔹 Prepare chart data
  // const chartData =
  //   data?.report?.dailySales?.map((d) => ({
  //     date: new Date(d._id).toLocaleDateString("en-IN", {
  //       day: "2-digit",
  //       month: "short",
  //     }),
  //     revenue: d.totalRevenue,
  //   })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-slate-800">
        Sales Report{" "}
        <span className="text-slate-500 text-sm font-normal">
          ({startDate} → {endDate})
        </span>
      </h2>

      {/* Chart Section */}
     

      {/* Summary Section */}
      <div className="text-slate-700 text-sm space-y-1 bg-slate-100 rounded-lg p-3">
        <p>
          Total Orders:{" "}
          <strong className="text-slate-900">
            {data?.report?.totalOrders || 0}
          </strong>
        </p>
        <p>
          Total Revenue:{" "}
          <strong className="text-slate-900">
            ₹{(data?.report?.totalRevenue || 0).toLocaleString("en-IN")}
          </strong>
        </p>
        <p>
          Average Order Value:{" "}
          <strong className="text-slate-900">
            ₹
            {data?.report?.avgOrderValue
              ? data.report.avgOrderValue.toFixed(2)
              : (
                  (data?.report?.totalRevenue || 0) /
                  (data?.report?.totalOrders || 1)
                ).toFixed(2)}
          </strong>
        </p>
      </div>

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

export default SalesReport;
