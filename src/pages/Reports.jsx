import React, { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { DateRange } from "react-date-range";
import { Calendar, BarChart3, Users, XCircle } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DATE_PRESETS, toYYYYMMDD } from "../utils/dataPresets.jsx";

// 🧩 child report components (placeholders for now)
import OrdersReport from "../components/OrdersReport.jsx";
import SalesReport from "../components/SalesReport.jsx";
import CustomerGrowthReport from "../components/CustomerGrowthReport.jsx";
import CancellationsReport from "../components/CancellationsReport.jsx";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const startDate = toYYYYMMDD(range[0].startDate);
  const endDate = toYYYYMMDD(range[0].endDate);

  const tabs = [
    { id: "orders", label: "Orders Report", icon: <BarChart3 size={18} /> },
    { id: "sales", label: "Sales Report", icon: <Calendar size={18} /> },
    { id: "growth", label: "Customer Growth", icon: <Users size={18} /> },
    { id: "cancellations", label: "Cancellations", icon: <XCircle size={18} /> },
  ];

  const applyPreset = (label) => {
    const preset = DATE_PRESETS[label];
    if (preset) {
      const { startDate, endDate } = preset.range();
      setRange([{ startDate, endDate, key: "selection" }]);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersReport startDate={startDate} endDate={endDate} />;
      case "sales":
        return <SalesReport startDate={startDate} endDate={endDate} />;
      case "growth":
        return <CustomerGrowthReport startDate={startDate} endDate={endDate} />;
      case "cancellations":
        return <CancellationsReport startDate={startDate} endDate={endDate} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 font-[Inter]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-4 md:mb-0">
          Reports Dashboard
        </h1>

        {/* Date Presets */}
        <div className="flex flex-wrap gap-2 items-center">
          {Object.keys(DATE_PRESETS).map((key) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="px-3 py-1 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              {DATE_PRESETS[key].label}
            </button>
          ))}

          <button
            onClick={() => setShowCalendar((p) => !p)}
            className="px-3 py-1 text-sm border border-slate-300 rounded-lg flex items-center gap-2 hover:bg-slate-100 transition"
          >
            <Calendar size={16} />{" "}
            {`${format(range[0].startDate, "MMM dd")} - ${format(
              range[0].endDate,
              "MMM dd, yyyy"
            )}`}
          </button>
        </div>
      </div>

      {/* Calendar Picker */}
      {showCalendar && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl p-4 shadow-md w-fit mb-4"
  >
    <DateRange
      editableDateInputs
      onChange={(item) => {
        const { startDate, endDate } = item.selection;

        setRange([item.selection]);

        // ✅ Close only when user selects endDate *after* startDate
        // (i.e., second selection)
        if (startDate && endDate && startDate !== endDate) {
          setTimeout(() => setShowCalendar(false), 200);
        }
      }}
      moveRangeOnFirstSelection={false}
      ranges={range}
      rangeColors={["#0f172a"]}
    />
  </motion.div>
)}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === tab.id
              ? "bg-slate-900 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              } transition`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="bg-white shadow-md rounded-xl p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Reports;

