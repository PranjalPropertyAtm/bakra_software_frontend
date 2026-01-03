// import React from "react";

// const ChartCard = ({ title, children }) => (
//   <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
//     <h3 className="text-slate-800 font-medium mb-3">{title}</h3>
//     {children}
//   </div>
// );

// export default ChartCard;


import React, { memo } from "react";

const ChartCard = memo(({ title, children }) => (
  <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
    <h3 className="text-slate-800 font-medium mb-3">{title}</h3>
    {children}
  </div>
));

ChartCard.displayName = 'ChartCard';

export default ChartCard;
