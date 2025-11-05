import React, { useState, useMemo } from "react";
import { useReportsData } from "../hooks/useReportsData";

// 🔹 Month name helper
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CustomerGrowthReport = () => {
  const { data, loading, error } = useReportsData("reports/customer-growth");

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  if (loading) return <p className="text-slate-500">Loading customer growth...</p>;
  if (error) return <p className="text-red-500">Failed to load data.</p>;

  // Group data by year & month
  const groupedByYear = {};
  data?.growth?.forEach((g) => {
    const year = g._id.year || currentYear;
    const month = g._id.month;
    if (!groupedByYear[year]) groupedByYear[year] = {};
    groupedByYear[year][month] = g.newCustomers;
  });

  // Prepare table data
  const tableData = useMemo(() => {
    const monthsData = groupedByYear[selectedYear] || {};
    return monthNames.map((month, index) => ({
      month,
      newCustomers: monthsData[index + 1] || 0,
    }));
  }, [selectedYear, groupedByYear]);

  const totalCustomers = tableData.reduce((sum, m) => sum + m.newCustomers, 0);

  const availableYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-6">
      {/* Header with Year Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">
          Customer Growth (Month-wise)
        </h2>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-slate-800 focus:outline-none"
        >
          {availableYears.length > 0 ? (
            availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))
          ) : (
            <option value={currentYear}>{currentYear}</option>
          )}
        </select>
      </div>

      {/* No Data */}
      {totalCustomers === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl shadow-sm border">
          <p className="text-slate-500">No customers found for {selectedYear} 🚫</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full text-sm text-slate-800">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-3 py-2 text-left">Month</th>
                <th className="px-3 py-2 text-left">New Customers</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} className="border-b hover:bg-slate-100">
                  <td className="px-3 py-2">{row.month}</td>
                  <td className="px-3 py-2">{row.newCustomers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerGrowthReport;
