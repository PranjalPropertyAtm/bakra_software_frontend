// import React from "react";

// const MetricCard = ({ label, value, icon: Icon }) => (
//   <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-3 hover:shadow-md transition">
//     <div className="p-3 bg-slate-100 rounded-lg">
//       <Icon className="w-6 h-6 text-slate-700" />
//     </div>
//     <div>
//       <p className="text-sm text-slate-500">{label}</p>
//       <p className="text-xl font-semibold text-slate-900">{value}</p>
//     </div>
//   </div>
// );

// export default MetricCard;

import React, { memo } from "react";

const MetricCard = memo(({ label, value, icon: Icon }) => (
  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center gap-3 hover:shadow-md transition">
    <div className="p-3 bg-slate-100 rounded-lg">
      <Icon className="w-6 h-6 text-slate-700" />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-xl font-semibold text-slate-900">{value}</p>
    </div>
  </div>
));

MetricCard.displayName = 'MetricCard';

export default MetricCard;

