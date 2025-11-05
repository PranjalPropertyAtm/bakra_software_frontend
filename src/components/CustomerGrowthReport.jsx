import React, { useState } from "react";

// Example API response
const apiData = {
  success: true,
  growth: [
    { _id: { year: 2025, month: 11 }, newCustomers: 54 }
  ]
};

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const CustomerGrowthReport = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const growth = apiData?.growth || [];

  // Group data by year & month
  const groupedByYear = {};
  growth.forEach(g => {
    const year = g?._id?.year || currentYear;
    const month = g?._id?.month || 0;
    if (!groupedByYear[year]) groupedByYear[year] = {};
    groupedByYear[year][month] = g?.newCustomers || 0;
  });

  // Prepare table data for selected year
  const tableData = monthNames.map((month, i) => ({
    month,
    newCustomers: groupedByYear[selectedYear]?.[i + 1] || 0,
  }));

  const availableYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-800">Customer Growth</h2>
          <div>
            <label className="text-sm text-slate-600 mr-2">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* No Data */}
        {tableData.every(c => c.newCustomers === 0) ? (
          <div className="text-center py-10 text-slate-500">
            No customers found for {selectedYear} 🚫
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-200 rounded-lg text-sm text-slate-800">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left">Month</th>
                  <th className="px-4 py-2 text-left">New Customers</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-2">{row.month}</td>
                    <td className="px-4 py-2">{row.newCustomers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerGrowthReport;
