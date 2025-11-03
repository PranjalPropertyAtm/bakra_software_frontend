
import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit, CheckCircle, XCircle, Trash2 } from "lucide-react";
import axiosInstance from "../lib/axios.js";
import { notify } from "../utils/toast.js";
import { useSearch } from "../context/SearchContext.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [cancelData, setCancelData] = useState({ id: "", reason: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("");
  const ordersPerPage = 10;

  const [newOrder, setNewOrder] = useState({
    name: "",
    phone: "",
    address: "",
    source: "",
    deliveryTimeSlot: "",
    quantity: "",
    paymentMode: "",
    couponCode: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editOrder, setEditOrder] = useState({
    _id: "",
    name: "",
    phone: "",
    address: "",
    source: "",
    associateId: "",
    deliveryTimeSlot: "",
    quantity: "",
    paymentMode: "",
  });


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { searchTerm } = useSearch();


  const [associates, setAssociates] = useState([]); // 🧾 Associates list
  const [loadingAssociates, setLoadingAssociates] = useState(true);

  // Fetch associates from API
  useEffect(() => {
    const fetchAssociates = async () => {
      try {
        const res = await axiosInstance.get("associates/all");
        setAssociates(res.data.associates);
      } catch (error) {
        console.error("❌ Error fetching associates:", error);
      } finally {
        setLoadingAssociates(false);
      }
    };
    fetchAssociates();
  }, []);

   const [designations, setDesignations] = useState([]);
  // ✅ Fetch designations from backend
  const fetchDesignations = async () => {
    try {
      const { data } = await axiosInstance.get("settings/get");
      if (data?.settings?.designations?.length) {
        setDesignations(data.settings.designations);
      } else {
        setDesignations([]);
      }
    } catch (error) {
      console.error("Error fetching designations:", error);
      toast.error("Failed to load designations");
    }
  };
  
  // ✅ Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/orders/all");
      if (res.data.success) setOrders(res.data.orders);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };
   const [timeSlots, setTimeSlots] = useState([]);
     const [quantities, setQuantities] = useState([]);

  const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get("settings/get");
        const data = res.data.settings;

        // Time slots & quantities extract karo
        setTimeSlots(data.timeSlots.map((t) => t.slot));
        setQuantities(data.prices.map((p) => p.quantity));
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

  // ✅ Add new order
  const handleAddOrder = async () => {
    const { name, phone, address, deliveryTimeSlot, quantity, paymentMode, source, associateId } = newOrder;



    if (!name || !phone || !address || !deliveryTimeSlot || !quantity || !paymentMode || !source) {
      notify.warning("Please fill all required fields!");
      return;
    }
    if (source === "Associates" && !associateId) {
      notify.error("Please select an Associate!");
      return;
    }

    if (phone.length !== 10) {
      notify.error("Phone number must be 10 digits long.");
      return;
    }

    try {
      const res = await axiosInstance.post("/orders/add", newOrder);
      if (res.data.success) {
        notify.success("Order added successfully!");
        setShowModal(false);
        setNewOrder({
          name: "",
          phone: "",
          address: "",
          source: "",
          deliveryTimeSlot: "",
          quantity: "",
          paymentMode: "",
          couponCode: "",
        });

        fetchOrders();
      }
    } catch (error) {
      console.error("❌ Error adding order:", error);
      notify.error(error.response?.data?.message || "Failed to add order!");
    }
  };

  // 🟢 Handle edit order submit
  const handleEditOrder = async () => {
    const { name, phone, address, deliveryTimeSlot, quantity, paymentMode, _id, source, associateId } = editOrder;



    if (!name || !phone || !address || !deliveryTimeSlot || !quantity || !paymentMode || !source) {
      notify.warning("Please fill all required fields!");
      return;
    }

    if (source === "Associates" && !associateId) {
      notify.error("Please select an Associate!");
      return;
    }

    if (phone.length !== 10) {
      notify.error("Phone number must be 10 digits long.");
      return;
    }

    try {
      const res = await axiosInstance.put(`/orders/edit/${_id}`, editOrder);
      if (res.data.success) {
        notify.success("Order updated successfully!");
        setShowEditModal(false);
        fetchOrders();
      }
    } catch (error) {
      console.error("❌ Error editing order:", error);
      notify.error(error.response?.data?.message || "Failed to update order!");
    }
  };


  // ✅ Handle status change
  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === "Cancelled") {
      setCancelData({ id, reason: "" });
      setShowCancelModal(true);
      return;
    }

    if (newStatus === "Delivered") {
      // 🟩 Open delivery confirmation modal
      setSelectedOrder(id);
      setPendingStatus(newStatus);
      setShowDeliverModal(true);
      return;
    }

    // if (!window.confirm(`Change order status to "${newStatus}"?`)) return;

    try {
      const res = await axiosInstance.put(`orders/${id}/status`, { status: newStatus });

      if (res.data.success) {
        setShowDeliverModal(false);
        notify.success(res.data.message || "Operation successful!");
        fetchOrders();
      }
    } catch (err) {
      console.error("❌ Status update error:", err);
      notify.error("Error updating order status!");
    }
  };



  // ✅ Cancel modal confirm
  const handleCancelOrder = async () => {
    if (!cancelData.reason.trim()) {
      notify.error("Please Enter a Cancellation Reason");
      return;
    }

    try {
      const res = await axiosInstance.put(`orders/${cancelData.id}/status`, {
        status: "Cancelled",
        cancelReason: cancelData.reason,
        cancelledBy: "Admin",
      });
      if (res.data.success) {
        notify.success("Order cancelled successfully!");
        setShowCancelModal(false);
        setCancelData({ id: "", reason: "" });
        fetchOrders();
      }
    } catch (err) {
      console.error("❌ Cancel error:", err);
      notify.error("Error cancelling order!");
    }
  };

  const handleDeleteOrder = async () => {
    try {
      if (!selectedOrder) return;

      const res = await axiosInstance.delete(
        `orders/delete/${selectedOrder._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("🗑️ Order deleted successfully!");
        // Optionally refresh your orders list
        fetchOrders();
      } else {
        toast.error(res.data.message || "Failed to delete order.");
      }
    } catch (error) {
      console.error("❌ Error deleting order:", error);
      toast.error("Server error while deleting order.");
    } finally {
      setShowDeleteModal(false);
      setSelectedOrder(null);
    }
  };


  useEffect(() => {
    fetchOrders();
    fetchSettings();
  }, []);

  const filteredOrders = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return orders.filter((o) => {
      const name = o.customerId?.name?.toLowerCase() || "";
      const phone = o.customerId?.phone?.toLowerCase() || "";
      const address = o.customerId?.address?.toLowerCase() || "";
      const payment = o.paymentMode?.toLowerCase() || "";
      const status = o.status?.toLowerCase() || "";
      const source = o.source?.toLowerCase() || "";

      return (
        name.includes(search) ||
        phone.includes(search) ||
        address.includes(search) ||
        payment.includes(search) ||
        status.includes(search) ||
        source.includes(search)
      );
    });
  }, [searchTerm, orders]);

  // ✅ Pagination logic
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-[Inter]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
          <p className="text-gray-500 text-sm">Manage and track all customer orders</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm mt-3 sm:mt-0"
        >
          <Plus size={18} />
          Add Order
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full table-auto text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="py-3 px-4 text-left">S.No</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Delivery Time</th>
              <th className="py-3 px-4 text-left">Quantity</th>
              <th className="py-3 px-4 text-left">Payment</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>

            {filteredOrders.slice(indexOfFirst, indexOfLast).map((order, index) => (

              <tr
                key={order._id}
                className="border-b hover:bg-gray-50 transition duration-150"
              >
                <td className="py-3 px-4">{indexOfFirst + index + 1}</td>
                <td className="py-3 px-4 font-medium">{order.customerId?.name}</td>
                <td className="py-3 px-4">{order.customerId?.phone}</td>
                <td className="py-3 px-4">{order.customerId?.address}</td>
                <td className="py-3 px-4">{order.deliveryTimeSlot}</td>
                <td className="py-3 px-4">{order.quantity}</td>
                <td className="py-3 px-4">{order.paymentMode}</td>
                <td className="py-3 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={order.status === "Cancelled" || order.status === "Delivered"}
                    className={`px-2 py-1 rounded-md text-sm font-medium w-full sm:w-auto ${order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">{order.orderDate}</td>
                <td className="py-3 px-4 text-center">
                  {/* <button className="text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button> */}
                  <button
                    disabled={["Delivered", "Cancelled"].includes(order.status)}
                    // onClick={() => {
                    //   setEditOrder({
                    //     _id: order._id,
                    //     name: order.customerId?.name || "",
                    //     phone: order.customerId?.phone || "",
                    //     address: order.customerId?.address || "",
                    //     source: order.source || "Call",
                    //     deliveryTimeSlot: order.deliveryTimeSlot,
                    //     quantity: order.quantity,
                    //     paymentMode: order.paymentMode,
                    //   });
                    //   setShowEditModal(true);
                    // }}
                    onClick={() => {
                      setEditOrder({
                        _id: order._id,
                        name: order.customerId?.name || "",
                        phone: order.customerId?.phone || "",
                        address: order.customerId?.address || "",
                        source: order.source || "Call",
                        associateId:
                          typeof order.associateId === "object"
                            ? order.associateId?._id // ✅ convert object to string id
                            : order.associateId || "",
                        deliveryTimeSlot: order.deliveryTimeSlot,
                        quantity: order.quantity,
                        paymentMode: order.paymentMode,
                      });
                      setShowEditModal(true);
                    }}
                    className={`text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    disabled={["Delivered", "Cancelled"].includes(order.status)}
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={18} />
                  </button>


                </td>
              </tr>
            ))}
          </tbody>





        </table>
        {/* No orders after search */}
        {/* {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            {loading ? "Loading orders..." : "No orders found."}
          </p>
        )} */}


        {/* No orders */}
        {/* {orders.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            {loading ? "" : "No orders found."}
          </p>
        )} */}

        {/* Loading State */}
        {loading && (
          <p className="text-center text-gray-500 py-6">Loading orders...</p>
        )}

        {/* No Orders (after loading) */}
        {!loading && filteredOrders.length === 0 && (
          <p className="text-center text-gray-500 py-6">No orders found.</p>
        )}
      </div>

      {/* ✅ Pagination Controls */}
      {orders.length > 10 && (
        <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-600 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border rounded-md text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <XCircle className="text-red-600" /> Cancel Order
            </h2>
            <textarea
              placeholder="Enter cancellation reason..."
              value={cancelData.reason}
              onChange={(e) =>
                setCancelData({ ...cancelData, reason: e.target.value })
              }
              rows={3}
              className="w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivey Modal */}
      {showDeliverModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Confirm Delivery</h2>
            <p className="text-gray-600 mb-5">
              Are you sure you want to mark this order as <b>Delivered</b>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeliverModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await axiosInstance.put(`orders/${selectedOrder}/status`, {
                      status: pendingStatus,
                    });
                    if (res.data.success) {
                      notify.success("Order delivered successfully!");
                      fetchOrders();
                      setShowDeliverModal(false);
                    }
                  } catch (err) {
                    console.error("❌ Delivery update error:", err);
                    notify.error("Failed to update order!");
                  }
                }}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Yes, Deliver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Order Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <CheckCircle className="text-green-600" /> Add New Order
            </h2>

            <div className="space-y-4">


              <input
                type="text"
                placeholder="Customer Name"
                value={newOrder.name}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, name: e.target.value.trimStart() })
                }
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              />
              {/* Phone Input with +91 fixed */}
              <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
                <span className="text-slate-600 font-medium select-none">+91</span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={newOrder.phone}
                  onChange={(e) => {
                    // ✅ Only digits allowed
                    let input = e.target.value.replace(/\D/g, "");

                    // ✅ Restrict to 10 digits max
                    if (input.length > 10) input = input.slice(0, 10);

                    setNewOrder({ ...newOrder, phone: input });
                  }}
                  className={`flex-1 ml-2 outline-none ${newOrder.phone.length > 0 && newOrder.phone.length < 10
                    ? "text-slate-900"
                    : "text-slate-900"
                    }`}
                  maxLength="10"
                  inputMode="numeric"
                />
              </div>

             
              <textarea
                placeholder="Delivery Address"
                value={newOrder.address}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, address: e.target.value.trimStart() })
                }
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                rows={2}
              />

              {/* <select
                value={newOrder.deliveryTimeSlot}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, deliveryTimeSlot: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Delivery Time</option>
                {[
                  "7PM - 7.30PM",
                  "7.30PM - 8PM",
                  "8PM - 8.30PM",
                  "8.30PM - 9PM",
                  "9PM - 9.30PM",
                  "9.30PM - 10PM",
                ].map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select> */}
               <select
        value={newOrder.deliveryTimeSlot}
        onChange={(e) =>
          setNewOrder({ ...newOrder, deliveryTimeSlot: e.target.value })
        }
        className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Select Delivery Time</option>
        {timeSlots.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>


              {/* <select
                value={newOrder.quantity}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, quantity: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Quantity</option>
                <option value="Quarter">Quarter</option>
                <option value="Half">Half</option>
                <option value="Full">Full</option>
              </select> */}

               {/* Quantity Dropdown */}
      <select
        value={newOrder.quantity}
        onChange={(e) =>
          setNewOrder({ ...newOrder, quantity: e.target.value })
        }
        className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Select Quantity</option>
        {quantities.map((q) => (
          <option key={q} value={q}>
            {q}
          </option>
        ))}
      </select>

              <select
                value={newOrder.paymentMode}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, paymentMode: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Online Payment">Online Payment</option>
              </select>

              {/* 🧭 Source Selection */}
             
              <select
  value={newOrder.source}
  onChange={(e) => {
    const value = e.target.value;
    if (value === "Associates") {
      setNewOrder({ ...newOrder, source: value, associateId: "" });
    } else {
      setNewOrder({ ...newOrder, source: value, associateId: null });
    }
  }}
  className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
>
  <option value="">Select Source</option>
  <option value="WhatsApp">WhatsApp</option>
  <option value="Call">Call</option>
  <option value="Associates">Associates</option>
</select>

{/* 👥 Associate Dropdown — only show when “Associates” selected */}
{newOrder.source === "Associates" && (
  <select
    value={newOrder.associateId || ""}
    onChange={(e) => setNewOrder({ ...newOrder, associateId: e.target.value })}
    className="w-full mt-3 border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
  >
    <option value="">Select Associate</option>
    {loadingAssociates ? (
      <option disabled>Loading...</option>
    ) : associates.length > 0 ? (
      associates.map((a) => (
        <option key={a._id} value={a._id}>
          {a.name} (
            {designations.find((d) => d._id === a.designation || d.title === a.designation)?.title || a.designation}
          )
        </option>
      ))
    ) : (
      <option disabled>No Associates Found</option>
    )}
  </select>
)}

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrder}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <Edit className="text-blue-600" /> Edit Order
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={editOrder.name}
                onChange={(e) =>
                  setEditOrder({ ...editOrder, name: e.target.value.trimStart() })
                }
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="text-slate-600 font-medium select-none">+91</span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={editOrder.phone}
                  onChange={(e) => {
                    let input = e.target.value.replace(/\D/g, "");
                    if (input.length > 10) input = input.slice(0, 10);
                    setEditOrder({ ...editOrder, phone: input });
                  }}
                  className="flex-1 ml-2 outline-none text-slate-900"
                  maxLength="10"
                  inputMode="numeric"
                />
              </div>

              <textarea
                placeholder="Delivery Address"
                value={editOrder.address}
                onChange={(e) =>
                  setEditOrder({ ...editOrder, address: e.target.value.trimStart() })
                }
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />

              {/* <select
                value={editOrder.deliveryTimeSlot}
                onChange={(e) =>
                  setEditOrder({ ...editOrder, deliveryTimeSlot: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Delivery Time</option>
                {[
                  "7PM - 7.30PM",
                  "7.30PM - 8PM",
                  "8PM - 8.30PM",
                  "8.30PM - 9PM",
                  "9PM - 9.30PM",
                  "9.30PM - 10PM",
                ].map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>

              <select
                value={editOrder.quantity}
                onChange={(e) =>
                  setEditOrder({ ...editOrder, quantity: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Quantity</option>
                <option value="Quarter">Quarter</option>
                <option value="Half">Half</option>
                <option value="Full">Full</option>
              </select> */}

            <select
  value={editOrder.deliveryTimeSlot}
  onChange={(e) =>
    setEditOrder({ ...editOrder, deliveryTimeSlot: e.target.value })
  }
  className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">Select Delivery Time</option>
  {timeSlots.length > 0 ? (
    timeSlots.map((slot) => (
      <option key={slot} value={slot}>
        {slot}
      </option>
    ))
  ) : (
    <option disabled>No Time Slots Found</option>
  )}
</select>

{/* 📦 Quantity Dropdown */}
<select
  value={editOrder.quantity}
  onChange={(e) =>
    setEditOrder({ ...editOrder, quantity: e.target.value })
  }
  className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">Select Quantity</option>
  {quantities.length > 0 ? (
    quantities.map((q) => (
      <option key={q} value={q}>
        {q}
      </option>
    ))
  ) : (
    <option disabled>No Quantities Found</option>
  )}
</select>
              <select
                value={editOrder.paymentMode}
                onChange={(e) =>
                  setEditOrder({ ...editOrder, paymentMode: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Online Payment">Online Payment</option>
              </select>
              {/* 🧭 Source Selection */}
              <select
                value={editOrder.source}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "Associates") {
                    setEditOrder({ ...editOrder, source: value, associateId: "" });
                  } else {
                    setEditOrder({ ...editOrder, source: value, associateId: null });
                  }
                }}
                className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Source</option>

                {/* Static sources */}
                <option value="WhatsApp">WhatsApp</option>
                <option value="Call">Call</option>
                <option value="Associates">Associates</option>
              </select>

              {/* 👥 Associate Dropdown — only show when “Associates” selected */}
              {editOrder.source === "Associates" && (
                <select
                  value={editOrder.associateId || ""}
                  onChange={(e) => setEditOrder({ ...editOrder, associateId: e.target.value })}
                  className="w-full mt-3 border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Associate</option>
                  {loadingAssociates ? (
                    <option disabled>Loading...</option>
                  ) : associates.length > 0 ? (
                    associates.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name} ({a.designation})
                      </option>
                    ))
                  ) : (
                    <option disabled>No Associates Found</option>
                  )}
                </select>
              )}


            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditOrder}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Update Order
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-5">
              Are you sure you want to <b>delete</b> this order? <br />
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    const res = await axiosInstance.delete(
                      `orders/delete/${selectedOrder._id}`
                    );
                    if (res.data.success) {
                      notify.success("Order deleted successfully!");
                      fetchOrders();
                      setShowDeleteModal(false);
                    }
                  } catch (err) {
                    console.error("❌ Delete error:", err);
                    notify.error("Failed to delete order!");
                  }
                }}
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
};

export default Orders;
