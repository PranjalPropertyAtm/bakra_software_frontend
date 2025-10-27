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
    </div>
  );
};

export default SalesReport;
