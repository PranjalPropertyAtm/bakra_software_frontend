// import React, { useEffect, useState } from "react";
// import axiosInstance from "../lib/axios.js"; // ✅ axios setup
// import { toast } from "react-toastify";

// export default function Settings() {
//   const [settings, setSettings] = useState(null);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ Fetch settings from backend
//   const fetchSettings = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axiosInstance.get("settings/get");
//       setSettings(data?.settings || {}); // ✅ ensure non-null object
//     } catch (error) {
//       console.error("Error fetching settings:", error);
//       toast.error("Failed to fetch settings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   // ✅ Add Designation
//   const handleAdd = async () => {
//     if (!title.trim()) {
//       toast.error("Designation title is required");
//       return;
//     }

//     try {
//       const { data } = await axiosInstance.post("settings/designation/add", {
//         title,
//         description,
//       });

//       toast.success(data.message);
//       setSettings((prev) => ({
//         ...prev,
//         designations: data.designations, // ✅ overwrite latest list
//       }));
//       setTitle("");
//       setDescription("");
//     } catch (error) {
//       console.error("Error adding designation:", error);
//       toast.error(error.response?.data?.message || "Failed to add designation");
//     }
//   };

//   // ✅ Delete Designation
//   const handleDelete = async (title) => {
//     if (!window.confirm(`Delete "${title}" designation?`)) return;

//     try {
//       const { data } = await axiosInstance.delete(
//         `settings/designation/${title}`
//       );
//       toast.success(data.message);
//       setSettings((prev) => ({
//         ...prev,
//         designations: data.designations,
//       }));
//     } catch (error) {
//       console.error("Error deleting designation:", error);
//       toast.error(error.response?.data?.message || "Failed to delete");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">Settings</h1>

//       {loading ? (
//         <p>Loading settings...</p>
//       ) : (
//         <>
//           {/* --- Add Designation Section --- */}
//           <div className="mb-6 border p-4 rounded-lg shadow">
//             <h2 className="text-lg font-medium mb-3">Add Designation</h2>
//             <div className="flex flex-col gap-2">
//               <input
//                 type="text"
//                 placeholder="Designation title"
//                 className="border px-3 py-2 rounded"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//               />
//               <input
//                 type="text"
//                 placeholder="Description (optional)"
//                 className="border px-3 py-2 rounded"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//               <button
//                 onClick={handleAdd}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-fit"
//               >
//                 Add Designation
//               </button>
//             </div>
//           </div>

//           {/* --- Designation List --- */}
//           <div className="border p-4 rounded-lg shadow">
//             <h2 className="text-lg font-medium mb-3">All Designations</h2>
//             {settings?.designations?.length ? (
//               <ul className="space-y-2">
//                 {settings.designations.map((d, i) => (
//                   <li
//                     key={i}
//                     className="flex justify-between items-center border-b pb-2"
//                   >
//                     <div>
//                       <p className="font-medium">{d.title}</p>
//                       {d.description && (
//                         <p className="text-sm text-gray-600">{d.description}</p>
//                       )}
//                     </div>
//                     <button
//                       onClick={() => handleDelete(d.title)}
//                       className="text-red-600 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">No designations added yet.</p>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Edit3, Lock } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("designations");

  // ✅ Fetch settings from backend
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("settings/get");
      setSettings(data?.settings || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ✅ Add Designation
  const handleAdd = async () => {
    if (!title.trim()) return toast.error("Designation title is required");

    try {
      const { data } = await axiosInstance.post("settings/designation/add", {
        title,
        description,
      });

      toast.success(data.message);
      setSettings((prev) => ({
        ...prev,
        designations: data.designations,
      }));
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding designation:", error);
      toast.error(error.response?.data?.message || "Failed to add designation");
    }
  };

  // ✅ Delete Designation
  const handleDelete = async (title) => {
    if (!window.confirm(`Delete "${title}" designation?`)) return;

    try {
      const { data } = await axiosInstance.delete(
        `settings/designation/${title}`
      );
      toast.success(data.message);
      setSettings((prev) => ({
        ...prev,
        designations: data.designations,
      }));
    } catch (error) {
      console.error("Error deleting designation:", error);
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  // ✅ Render Tab Content
  const renderTabContent = () => {
    switch (activeTab) {
      case "designations":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* --- Add Designation --- */}
            <div className="border p-5 rounded-xl shadow-sm bg-white">
              <h2 className="text-lg font-semibold mb-3">
                ➕ Add Designation
              </h2>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Designation title"
                  className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button
                  onClick={handleAdd}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition w-fit"
                >
                  Add Designation
                </button>
              </div>
            </div>

            {/* --- All Designations --- */}
            <div className="border p-5 rounded-xl shadow-sm bg-white">
              <h2 className="text-lg font-semibold mb-3">📋 All Designations</h2>
              {loading ? (
                <p>Loading...</p>
              ) : settings?.designations?.length ? (
                <ul className="space-y-3">
                  {settings.designations.map((d, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{d.title}</p>
                        {d.description && (
                          <p className="text-sm text-gray-600">{d.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(d.title)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No designations added yet.</p>
              )}
            </div>
          </motion.div>
        );

      case "modify":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-white rounded-xl shadow-sm text-gray-700"
          >
            <h2 className="text-lg font-semibold mb-3">
              🛠 Modify Orders (Coming Soon)
            </h2>
            <p>Here you’ll be able to edit or update existing orders.</p>
          </motion.div>
        );

      case "password":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-white rounded-xl shadow-sm text-gray-700"
          >
            <h2 className="text-lg font-semibold mb-3">🔒 Change Password</h2>
            <div className="flex flex-col gap-3 max-w-sm">
              <input
                type="password"
                placeholder="Current Password"
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
              />
              <input
                type="password"
                placeholder="New Password"
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none"
              />
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition w-fit">
                Update Password
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-[Inter]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <SettingsIcon /> Settings Dashboard
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-200 pb-2">
        {[
          { id: "designations", label: "Add Designations", icon: <Edit3 size={16} /> },
          { id: "modify", label: "Modify Orders", icon: <SettingsIcon size={16} /> },
          { id: "password", label: "Change Password", icon: <Lock size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition ${
              activeTab === tab.id
                ? "bg-slate-900 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
}
