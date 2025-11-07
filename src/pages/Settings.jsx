
import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios.js";
import { motion } from "framer-motion";
import { notify } from "../utils/toast.js";
import {
  Settings as SettingsIcon,
  Edit3,
  Lock,
  Clock,
  DollarSign,
  Trash2,Eye, EyeOff
} from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [slot, setSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("designations");

  // 🧩 Confirmation Modal States (Shared for all deletions)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // 'slot' | 'price' | 'designation'
  const [selectedItem, setSelectedItem] = useState(null);


  // 🧩 Change Password States
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
const [passwordErrors, setPasswordErrors] = useState({});
const [showCurrent, setShowCurrent] = useState(false);
const [showNew, setShowNew] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);
// ✅ Handle Password Change
// ✅ Validate password inputs
const validatePasswordForm = () => {
  const errors = {};

  if (!currentPassword.trim()) errors.currentPassword = "Current password is required";
  if (!newPassword.trim()) errors.newPassword = "New password is required";
  else if (newPassword.length < 6)
    errors.newPassword = "New password must be at least 6 characters long";
  else if (!/[A-Z]/.test(newPassword))
    errors.newPassword = "Must include at least one uppercase letter";
  else if (!/[a-z]/.test(newPassword))
    errors.newPassword = "Must include at least one lowercase letter";
  else if (!/[0-9]/.test(newPassword))
    errors.newPassword = "Must include at least one number";
  else if (!/[!@#$%^&*]/.test(newPassword))
    errors.newPassword = "Must include at least one special character";

  if (!confirmPassword.trim())
    errors.confirmPassword = "Please confirm your new password";
  else if (newPassword !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  setPasswordErrors(errors);
  return Object.keys(errors).length === 0;
};

// ✅ Submit handler
const handleChangePassword = async () => {
  if (!validatePasswordForm()) return;

  try {
    const { data } = await axiosInstance.put("settings/change-password", {
      oldPassword: currentPassword,
      newPassword,
      confirmPassword,
    });

    notify.success(data.message || "Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordErrors({});
    setShowPasswordConfirm(false);
  } catch (error) {
    notify.error(error.response?.data?.message || "Incorrect current password");
  }
};


  // ✅ Fetch all settings
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
  const handleAddDesignation = async () => {
    if (!title.trim()) return notify.error("Designation title is required");
    try {
      const { data } = await axiosInstance.post("settings/designation/add", {
        title,
        description,
      });
      notify.success(data.message);
      setSettings((prev) => ({ ...prev, designations: data.designations }));
      setTitle("");
      setDescription("");
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to add designation");
    }
  };

  // ✅ Open Confirmation Modal (For All)
  const openConfirmModal = (type, item) => {
    setDeleteType(type);
    setSelectedItem(item);
    setShowConfirmModal(true);
  };

  // ✅ Unified Delete Handler
  const confirmDelete = async () => {
    try {
      let data;
      if (deleteType === "slot") {
        const res = await axiosInstance.delete(`settings/timeslot/${selectedItem}`);
        data = res.data;
        setSettings((prev) => ({ ...prev, timeSlots: data.timeSlots }));
      } else if (deleteType === "price") {
        const res = await axiosInstance.delete(`settings/price/${selectedItem}`);
        data = res.data;
        setSettings((prev) => ({ ...prev, prices: data.prices }));
      } else if (deleteType === "designation") {
        const res = await axiosInstance.delete(`settings/designation/${selectedItem}`);
        data = res.data;
        setSettings((prev) => ({ ...prev, designations: data.designations }));
      }
      notify.success(data.message || "Deleted successfully");
    } catch (error) {
      console.error("❌ Delete Error:", error);
      notify.error(error.response?.data?.message || "Failed to delete item");
    } finally {
      setShowConfirmModal(false);
      setSelectedItem(null);
      setDeleteType("");
    }
  };

  // ✅ Add Price
  const handleAddPrice = async () => {
    if (!quantity.trim() || !price.trim())
      return notify.error("Both fields required");
    try {
      const { data } = await axiosInstance.post("settings/price/add", {
        quantity,
        price,
      });
      notify.success(data.message);
      setSettings((prev) => ({ ...prev, prices: data.prices }));
      setQuantity("");
      setPrice("");
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to add price");
    }
  };

  // ✅ Add Time Slot
  const handleAddSlot = async () => {
    if (!slot.trim()) return notify.error("Slot name required");
    try {
      const { data } = await axiosInstance.post("settings/timeslot/add", {
        slot,
      });
      notify.success(data.message);
      setSettings((prev) => ({ ...prev, timeSlots: data.timeSlots }));
      setSlot("");
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to add slot");
    }
  };

  // ✅ Tab Rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case "designations":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Add Designation */}
            <div className="border p-5 rounded-xl shadow-sm bg-white">
              <h2 className="text-lg font-semibold mb-3">➕ Add Designation</h2>
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
                  onClick={handleAddDesignation}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition w-fit"
                >
                  Add Designation
                </button>
              </div>
            </div>

            {/* All Designations */}
           <div className="border p-5 rounded-xl shadow-sm bg-white">
  <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
    📋 All Designations
  </h2>

  {loading ? (
    <p className="text-gray-500 text-sm italic">Loading...</p>
  ) : settings?.designations?.length ? (
    <ul className="space-y-2">
      {settings.designations.map((d, i) => (
        <li
          key={i}
          className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition-all duration-200"
        >
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-gray-800">{d.title}</p>
            {d.description && (
              <p className="text-xs text-gray-600">{d.description}</p>
            )}
          </div>

          <button
            onClick={() => openConfirmModal("designation", d.title)}
            className="text-xs text-red-600 hover:text-red-700 hover:underline transition"
          >
            <Trash2 size={14} />
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 italic text-center py-2 text-sm">
      No designations added yet.
    </p>
  )}
</div>

          </motion.div>
        );

      case "modify":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Prices Section */}
            <div className="border p-5 rounded-xl shadow-sm bg-white">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <DollarSign size={18} /> Manage Quantity & Prices
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Quantity (e.g. Quarter)"
                  className="border px-3 py-2 rounded-lg flex-1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="border px-3 py-2 rounded-lg flex-1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <button
                  onClick={handleAddPrice}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg"
                >
                  Add
                </button>
              </div>

              {/* Price List */}
   <ul className="mt-4 space-y-2">
  {settings?.prices?.length ? (
    settings.prices.map((p, i) => (
      <li
        key={i}
        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition-all duration-200"
      >
        <span className="text-sm text-gray-800 font-medium">
          {p.quantity} — <span className="text-gray-600">₹{p.price}</span>
        </span>

        <button
          onClick={() => openConfirmModal("price", p.quantity)}
          className="text-xs text-red-600 hover:text-red-700 hover:underline transition"
        >
            <Trash2 size={14} />
        </button>
      </li>
    ))
  ) : (
    <p className="text-gray-500 italic text-center py-2 text-sm">
      No prices added yet.
    </p>
  )}
</ul>

            </div>

            {/* Time Slots Section */}
            <div className="border p-5 rounded-xl shadow-sm bg-white">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Clock size={18} /> Manage Time Slots
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Time Slot (e.g. 9:30PM - 10PM)"
                  className="border px-3 py-2 rounded-lg flex-1"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                />
                <button
                  onClick={handleAddSlot}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg"
                >
                  Add Slot
                </button>
              </div>

            <ul className="mt-4 space-y-2">
  {settings?.timeSlots?.length ? (
    settings.timeSlots.map((t, i) => (
      <li
        key={i}
        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition-all duration-200"
      >
        <span className="text-sm text-gray-800 font-medium">{t.slot}</span>

        <button
          onClick={() => openConfirmModal("slot", t.slot)}
          className="text-xs text-red-600 hover:text-red-700 hover:underline transition"
        >
            <Trash2 size={14} />
        </button>
      </li>
    ))
  ) : (
    <p className="text-gray-500 italic text-center py-2 text-sm">
      No slots added yet.
    </p>
  )}
</ul>

            </div>
          </motion.div>
        );

      case "password":
        return (
          // <motion.div
          //   initial={{ opacity: 0, y: 10 }}
          //   animate={{ opacity: 1, y: 0 }}
          //   className="p-5 bg-white rounded-xl shadow-sm text-gray-700"
          // >
          //   <h2 className="text-lg font-semibold mb-3">🔒 Change Password</h2>
          //   <div className="flex flex-col gap-3 max-w-sm">
          //     <input
          //       type="password"
          //       placeholder="Current Password"
          //       className="border px-3 py-2 rounded-lg"
          //     />
          //     <input
          //       type="password"
          //       placeholder="New Password"
          //       className="border px-3 py-2 rounded-lg"
          //     />
          //     <input
          //       type="password"
          //       placeholder="Confirm New Password"
          //       className="border px-3 py-2 rounded-lg"
          //     />
          //     <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition w-fit">
          //       Update Password
          //     </button>
          //   </div>
          // </motion.div>
       <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 bg-white rounded-xl shadow-sm text-gray-700"
    >
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        🔒 Change Password
      </h2>

       <form autoComplete="off" className="flex flex-col gap-4 max-w-sm">
     
        {/* Current Password */}
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Current Password"
            autoComplete="current-password"
            className={`border px-3 py-2 rounded-lg w-full pr-10 ${
              passwordErrors.currentPassword ? "border-red-500" : ""
            }`}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            onClick={() => setShowCurrent(!showCurrent)}
          >
            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {passwordErrors.currentPassword && (
            <p className="text-xs text-red-500 mt-1">
              {passwordErrors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            placeholder="New Password"
             autoComplete="new-password"
            className={`border px-3 py-2 rounded-lg w-full pr-10 ${
              passwordErrors.newPassword ? "border-red-500" : ""
            }`}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {passwordErrors.newPassword && (
            <p className="text-xs text-red-500 mt-1">
              {passwordErrors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm New Password"
             autoComplete="new-password"
            className={`border px-3 py-2 rounded-lg w-full pr-10 ${
              passwordErrors.confirmPassword ? "border-red-500" : ""
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {passwordErrors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {passwordErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Update Button */}
        <button
          onClick={() => {
            if (validatePasswordForm()) setShowPasswordConfirm(true);
          }}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition w-fit"
        >
          Update Password
        </button>
     </form>

      {/* ✅ Confirmation Modal */}
      {showPasswordConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Confirm Password Change
            </h2>
            <p className="text-gray-600 mb-5">
              Are you sure you want to update your password?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-[Inter]">
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

      {/* ✅ Shared Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-5">
              Are you sure you want to delete <b>"{selectedItem}"</b>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}