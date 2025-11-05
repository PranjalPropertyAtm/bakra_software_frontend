import React, { useState } from "react";
import { useReportsData } from "../hooks/useReportsData";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const CustomerGrowthReport = () => {
  const { data, loading, error } = useReportsData("reports/customer-growth");
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data.</p>;

  const growth = data?.growth || [];

  // Group data by year & month
  const groupedByYear = {};
  growth.forEach(g => {
    const year = g?._id?.year || currentYear;
    const month = g?._id?.month || 0;
    if (!groupedByYear[year]) groupedByYear[year] = {};
    groupedByYear[year][month] = g?.newCustomers || 0;
  });

  const chartData = monthNames.map((month, i) => ({
    month,
    newCustomers: groupedByYear[selectedYear]?.[i + 1] || 0,
  }));

  const availableYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  return (
    <div>
      <h2>Customer Growth</h2>

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

      {chartData.every(c => c.newCustomers === 0) ? (
        <p>No customers found for {selectedYear}</p>
      ) : (
        <table border="1" cellPadding="5" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Month</th>
              <th>New Customers</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, i) => (
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
