


import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../lib/axios"; // must have baseURL and withCredentials true
import { notify } from "../../utils/toast"; // your toast util

// Simple clean Add / Edit Order page (Option A)
const AddOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if present -> edit mode
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false); // overall page loading (for edit fetch)
  const [submitting, setSubmitting] = useState(false);

  const [timeSlots, setTimeSlots] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [associates, setAssociates] = useState([]);
  const [loadingAssociates, setLoadingAssociates] = useState(true);

  const [openAssociateDropdown, setOpenAssociateDropdown] = useState(false);
const [associateSearch, setAssociateSearch] = useState("");

const filteredAssociates = associates.filter(a =>
  a.name.toLowerCase().includes(associateSearch.toLowerCase())
);



  // form state
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    source: "",
    associateId: "", // only when source === "Associates"
    deliveryTimeSlot: "",
    quantity: "",
    paymentMode: "",
    couponCode: "",
  });

  // handle input changes
  const handleChange = (field, value) => {
    setForm((s) => ({ ...s, [field]: value }));
  };

  // load settings (time slots, quantities), associates and order details (if edit)
  useEffect(() => {
    fetchSettings();
    fetchAssociates();
    if (isEdit) fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosInstance.get("/settings/get");
      const data = res.data?.settings || {};

      // safe guards (in case data shape is different)
      setTimeSlots((data.timeSlots || []).map((t) => t.slot).filter(Boolean));
      setQuantities((data.prices || []).map((p) => p.quantity).filter(Boolean));
    } catch (err) {
      console.error("Error fetching settings:", err);
      // not fatal — let user type manually if nothing found
    }
  };

  const fetchAssociates = async () => {
    try {
      setLoadingAssociates(true);
      const res = await axiosInstance.get("/associates/all");
      setAssociates(res.data.associates || []);
    } catch (err) {
      console.error("Error fetching associates:", err);
    } finally {
      setLoadingAssociates(false);
    }
  };

  // Fetch a single order for edit mode
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // Note: backend route used here must exist: GET /orders/get/:id
      const res = await axiosInstance.get(`/orders/get/${id}`);
      const o = res.data.order;

      // populate form (customer data may be in customerId subdoc)
      setForm({
        name: o.customerId?.name || "",
        phone: o.customerId?.phone || "",
        address: o.customerId?.address || "",
        source: o.source || "",
        associateId:
          typeof o.associateId === "object" ? o.associateId?._id : o.associateId || "",
        deliveryTimeSlot: o.deliveryTimeSlot || "",
        quantity: o.quantity || "",
        paymentMode: o.paymentMode || "",
        couponCode: o.couponUsed || "",
      });
    } catch (err) {
      console.error("Error fetching order details:", err);
      notify.error("Failed to load order. Please try again.");
      // optional: navigate back
      // navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  // client-side validation
  const validate = () => {
    const { name, phone, address, deliveryTimeSlot, quantity, paymentMode, source } = form;
    if (!name || !phone || !address || !deliveryTimeSlot || !quantity || !paymentMode || !source) {
      notify.error("Please fill all required fields.");
      return false;
    }
    if (phone.replace(/\D/g, "").length !== 10) {
      notify.error("Phone must be 10 digits.");
      return false;
    }
    if (source === "Associates" && !form.associateId) {
      notify.error("Please select an associate.");
      return false;
    }
    return true;
  };

  // submit handler (POST add or PUT edit)
  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.replace(/\D/g, ""),
        address: form.address.trim(),
        source: form.source,
        associateId: form.source === "Associates" ? form.associateId : null,
        deliveryTimeSlot: form.deliveryTimeSlot,
        quantity: form.quantity,
        paymentMode: form.paymentMode,
        couponCode: form.couponCode?.trim() || undefined,
      };

      let res;
      if (isEdit) {
        // backend expected: PUT /orders/edit/:id
        res = await axiosInstance.put(`/orders/edit/${id}`, payload);
      } else {
        // backend expected: POST /orders/add
        res = await axiosInstance.post("/orders/add", payload);
      }

      if (res.data?.success) {
        notify.success(isEdit ? "Order updated successfully!" : "Order added successfully!");
        navigate("/orders");
      } else {
        notify.error(res.data?.message || "Operation failed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      notify.error(err.response?.data?.message || "Server error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // simple small loader UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-[Inter]">
        <div className="text-gray-600">Loading order...</div>
      </div>
    );
  }

  return (
  <div className="p-6 min-h-screen bg-gray-50 font-[Inter]">
    {/* Header */}
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">
          {isEdit ? "Edit Order" : "Add New Order"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill the order details below to continue.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60"
        >
          {submitting ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Order" : "Add Order")}
        </button>
      </div>
    </div>

    {/* MAIN FORM */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* LEFT CARD — CUSTOMER INFO */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Customer Details
        </h2>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-600">Customer Name *</label>
            <input
              className="w-full mt-1 border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone Number *</label>
            <div className="flex items-center mt-1 border rounded-lg px-4 py-2.5 bg-white">
              <span className="text-gray-600 select-none">+91</span>
              <input
                className="ml-2 flex-1 outline-none"
                placeholder="10-digit phone number"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value.replace(/\D/g, ""))
                }
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Delivery Address *</label>
            <textarea
              className="w-full mt-1 border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-400"
              rows={3}
              placeholder="Complete delivery address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* RIGHT CARD — ORDER DETAILS */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Order Details
        </h2>

        <div className="space-y-5">
          {/* Delivery Time */}
          <div>
            <label className="text-sm text-gray-600">Delivery Time *</label>
            <select
              value={form.deliveryTimeSlot}
              onChange={(e) => handleChange("deliveryTimeSlot", e.target.value)}
              className="w-full mt-1 border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-400 bg-white"
            >
              <option value="">Select time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-sm text-gray-600">Quantity *</label>
            <select
              value={form.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              className="w-full mt-1 border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select quantity</option>
              {quantities.map((q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="text-sm text-gray-600">Payment Mode *</label>
            <select
              value={form.paymentMode}
              onChange={(e) => handleChange("paymentMode", e.target.value)}
              className="w-full mt-1 border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select payment type</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Online Payment">Online Payment</option>
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="text-sm text-gray-600">Order Source *</label>
            <select
              value={form.source}
              onChange={(e) => {
                const val = e.target.value;
                handleChange("source", val);
                if (val !== "Associates") handleChange("associateId", "");
              }}
              className="w-full mt-1 border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select source</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Call">Call</option>
              <option value="Associates">Associates</option>
              {/* <option value="Employee Reference">Employee Reference</option> */}
            </select>
          </div>

        

          {form.source === "Associates" && (
  <div className="relative mt-3">
    <label className="text-sm text-gray-600">Select Associate *</label>

    {/* MAIN SELECT BUTTON */}
    <div
      onClick={() => setOpenAssociateDropdown(!openAssociateDropdown)}
      className="mt-1 border rounded-lg px-4 py-2.5 bg-white cursor-pointer flex justify-between items-center hover:border-green-400 transition"
    >
      <span>
        {form.associateId
          ? associates.find((a) => a._id === form.associateId)?.name
          : "Search & Select Associate"}
      </span>
      <span className="text-gray-500 text-sm">▼</span>
    </div>

    {/* FLOATING SEARCH DROPDOWN */}
    {openAssociateDropdown && (
      <div
        className="
          fixed left-1/2 top-1/2 
          -translate-x-1/2 -translate-y-1/2
          bg-white border rounded-2xl shadow-xl
          z-[9999] p-5 w-[90%] max-w-md 
          max-h-[60vh] overflow-y-auto space-y-4
        "
      >
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setOpenAssociateDropdown(false)}
            className="text-gray-500 hover:text-black text-lg"
          >
            ✖
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search Associate..."
          value={associateSearch}
          onChange={(e) => setAssociateSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Filtered List */}
        {loadingAssociates ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : filteredAssociates.length > 0 ? (
          filteredAssociates.map((a) => (
            <div
              key={a._id}
              onClick={() => {
                handleChange("associateId", a._id);
                setOpenAssociateDropdown(false);
              }}
              className="
                px-4 py-2 rounded-lg 
                hover:bg-green-100 cursor-pointer 
                transition flex justify-between items-center
                border-b border-gray-100
              "
            >
              <span className="text-gray-800 font-medium truncate w-[150px]">
                {a.name}
              </span>
              <span className="text-gray-500 text-sm truncate w-[120px] text-right">
                {a.designation}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No associates found</p>
        )}
      </div>
    )}
  </div>
)}


      
        </div>
      </div>
    </div>
  </div>
);

};

export default AddOrder;
