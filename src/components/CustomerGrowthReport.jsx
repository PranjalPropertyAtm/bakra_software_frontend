import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useReportsData } from "../hooks/useReportsData";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const CustomerGrowthReport = () => {
  // 🔹 Fetch data
  const { data, loading, error } = useReportsData("reports/customer-growth");

  // 🔹 Current year as default
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // 🔹 Loading & error handling
  if (loading) return <p className="text-slate-500">Loading customer growth...</p>;
  if (error) return <p className="text-red-500">Error loading data</p>;

  // ✅ Ensure data shape is correct
  const growthData = Array.isArray(data?.growth) ? data.growth : [];

  // 🧮 Group by year
  const groupedByYear = {};
  growthData.forEach((g) => {
    const year = g._id?.year ?? currentYear;
    const month = g._id?.month ?? 0;
    const count = g.newCustomers ?? 0;
    if (!groupedByYear[year]) groupedByYear[year] = {};
    groupedByYear[year][month] = count;
  });

  // 🧮 Prepare chart data
  const chartData = useMemo(() => {
    const monthsData = groupedByYear[selectedYear] || {};
    return monthNames.map((m, i) => ({
      month: m,
      newCustomers: monthsData[i + 1] || 0,
    }));
  }, [selectedYear, groupedByYear]);

  const totalCustomers = chartData.reduce((a, b) => a + b.newCustomers, 0);
  const availableYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  // 🧾 Render
  return (
    <div className="space-y-6">
      {/* Header + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">
          Customer Growth (Month-wise)
        </h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700"
        >
          {availableYears.length ? (
            availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))
          ) : (
            <option value={currentYear}>{currentYear}</option>
          )}
        </select>
      </div>

      {/* No data case */}
      {totalCustomers === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border shadow-sm">
          <p className="text-slate-500">No customers found for {selectedYear} 🚫</p>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="w-full h-64 bg-slate-50 border rounded-xl p-4 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCust" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
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

          {/* Table */}
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full text-sm text-slate-800">
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
        </>
      )}
    </div>
  );
};

export default CustomerGrowthReport;
