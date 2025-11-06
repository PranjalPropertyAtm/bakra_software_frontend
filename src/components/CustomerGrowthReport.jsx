import React, { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import { notify } from "../utils/toast";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const CustomerGrowthReport = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGrowth = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/reports/customer-growth");
        if (res.data.success) setGrowthData(res.data.growth);
        else setGrowthData([]);
      } catch (error) {
        console.error("❌ Error fetching customer growth:", error);
        notify.error("Failed to fetch customer growth data!");
      } finally {
        setLoading(false);
      }
    };
    fetchGrowth();
  }, []);

  const growth = growthData || [];
  const groupedByYear = {};
  growth.forEach(g => {
    const year = g?._id?.year || currentYear;
    const month = g?._id?.month || 0;
    if (!groupedByYear[year]) groupedByYear[year] = {};
    groupedByYear[year][month] = g?.newCustomers || 0;
  });

  const tableData = monthNames.map((month, i) => ({
    month,
    newCustomers: groupedByYear[selectedYear]?.[i + 1] || 0,
  }));

  const availableYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  if (loading)
    return (
      <div className="text-center py-10 text-slate-500 border rounded-md bg-slate-50 shadow-sm">
        Loading customer growth data...
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">
        Customer Growth{" "}
        <span className="text-slate-500 text-sm font-normal">({selectedYear})</span>
      </h2>

      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm text-slate-600">Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {tableData.every(c => c.newCustomers === 0) ? (
        <div className="text-center py-10 text-slate-500 border rounded-md bg-slate-50 shadow-sm">
          No customers found for {selectedYear} 🚫
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full text-sm text-slate-800">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Month</th>
                <th className="px-4 py-2 text-left">New Customers</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={i} className="border-b hover:bg-slate-100">
                  <td className="px-4 py-2">{row.month}</td>
                  <td className="px-4 py-2">{row.newCustomers}</td>
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
