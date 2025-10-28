import React from "react";

const DateFilterBar = ({ range, setRange }) => {
  const presets = ["Today", "Last 7 Days", "Last 30 Days", "This Month"];

  return (
    <div className="flex gap-2 flex-wrap">
      {presets.map((p) => (
        <button
          key={p}
          onClick={() => setRange({ ...range, preset: p })}
          className={`px-4 py-2 text-sm rounded-lg border ${
            range.preset === p
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default DateFilterBar;
