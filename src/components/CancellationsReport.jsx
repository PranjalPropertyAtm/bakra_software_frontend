import React from "react";
import { useReportsData } from "../hooks/useReportsData";

const CancellationsReport = ({ startDate, endDate }) => {
  const { data, loading, error } = useReportsData(
    "reports/cancellations-by-date",
    { startDate, endDate }
  );

  if (loading) return <p className="text-slate-500">Loading cancellations...</p>;
  if (error) return <p className="text-red-500">Failed to load cancellations.</p>;

  const cancellations = data?.cancellations || [];

  return (
    <div className="space-y-6">
     

 <h2 className="text-lg font-semibold text-slate-800">
         Cancellations Report{" "}
        <span className="text-slate-500 text-sm font-normal">
          ({startDate} → {endDate})
        </span>
      </h2>
      

      {/* Summary */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <p className="text-slate-700 text-sm">
          Total cancellations:{" "}
          <strong>{data?.total || cancellations.length}</strong>
        </p>
        <p className="text-slate-700 text-sm">
          Total cancellation charges collected:{" "}
          <strong>
            ₹
            {(data?.totalCancellationCharges || cancellations.reduce((sum, c) => sum + (c.totalCancellationCharge || 0), 0)).toLocaleString("en-IN")}
          </strong>
        </p>
      </div>

      {/* Table */}
      {cancellations.length === 0 ? (
        <p className="text-slate-500">No cancellations found for this range.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-slate-800">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Phone No.</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Quantity</th>
                <th className="p-2 text-left">Cancellation Charge</th>
                <th className="p-2 text-left">Reason</th>
                <th className="p-2 text-left">Cancelled Date</th>
              </tr>
            </thead>
            <tbody>
              {cancellations.map((c, i) => (
                <tr
                  key={c._id || i}
                  className="border-b hover:bg-slate-100 transition"
                >
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{c.customerId?.name || "—"}</td>
                  <td className="p-2">{c.customerId?.phone || "—"}</td>
                  <td className="p-2">₹{c.orderId?.amount?.toLocaleString("en-IN") || "0"}</td>
                  <td className="p-2">{c.orderId?.quantity || "0"}</td>
                    <td className="p-2">₹{c.totalCancellationCharge?.toLocaleString("en-IN") || "0"}</td>
                  <td className="p-2">{c.reason || "—"}</td>
                
                  <td className="p-2">
                    {c.cancelledAt
                      ? new Date(c.cancelledAt).toISOString().split("T")[0]
                      : "—"}
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

export default CancellationsReport;
