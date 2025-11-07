

import React, { useState, useMemo } from "react";
import { useReportsData } from "../hooks/useReportsData";

const SalesReport = ({ startDate, endDate }) => {
  // 🔹 Fetch sales data from backend
  const { data, loading, error } = useReportsData("reports/sales-report", {
    startDate,
    endDate,
  });

  const allOrders = data?.report?.deliveredOrders || [];

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(allOrders.length / itemsPerPage);

  // 🔹 Paginated data
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return allOrders.slice(start, end);
  }, [allOrders, currentPage]);

  if (loading) return <p className="text-slate-500">Loading sales data...</p>;
  if (error) return <p className="text-red-500">Failed to load sales report.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-slate-800">
        Sales Report{" "}
        <span className="text-slate-500 text-sm font-normal">
          ({startDate} → {endDate})
        </span>
      </h2>

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
      {paginatedOrders.length > 0 ? (
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
                {paginatedOrders.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-slate-100">
                    <td className="px-3 py-2">
                      {(currentPage - 1) * itemsPerPage + (i + 1)}
                    </td>
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
          {allOrders.length > 10 && (
            <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md border text-sm ${
                  currentPage === 1
                    ? "disabled:opacity-50"
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
                    ? "disabled:opacity-50"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-slate-500">No orders found for this date range.</p>
      )}
    </div>
  );
};

export default SalesReport;

