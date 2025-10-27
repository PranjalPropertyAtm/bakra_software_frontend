import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useReportsData } from "../hooks/useReportsData";

// 🔹 Helper: Convert month number → name (1 → "January")
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CustomerGrowthReport = () => {
  // API: GET /api/reports/customer-growth
  const { data, loading, error } = useReportsData("reports/customer-growth");

  if (loading) return <p className="text-slate-500">Loading customer growth...</p>;
  if (error) return <p className="text-red-500">Failed to load data.</p>;

  // ✅ Format data (convert month number → name)
  const chartData =
    data?.growth?.map((g) => ({
      month: monthNames[(g._id - 1) % 12], // handle 1-based month index
      newCustomers: g.newCustomers,
    })) || [];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">
        Customer Growth (Month-wise)
      </h2>

      {/* Chart Section */}
      <div className="w-full h-64 bg-slate-50 rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCust" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0f172a" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
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

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-slate-800">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="px-3 py-2 text-left">Month</th>
              <th className="px-3 py-2 text-left">New Customers</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, i) => (
              <tr key={i} className="border-b hover:bg-slate-100">
                <td className="px-3 py-2">{row.month}</td>
                <td className="px-3 py-2">{row.newCustomers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerGrowthReport;
