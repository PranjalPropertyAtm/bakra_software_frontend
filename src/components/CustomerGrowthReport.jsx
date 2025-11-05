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
    <div style={{ padding: 20 }}>
      <h2>Customer Growth</h2>

      <div style={{ marginBottom: 10 }}>
        <label>
          Year:{" "}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
      </div>

      {tableData.every(c => c.newCustomers === 0) ? (
        <p>No customers found for {selectedYear}</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Month</th>
              <th>New Customers</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                <td>{row.month}</td>
                <td>{row.newCustomers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerGrowthReport;
