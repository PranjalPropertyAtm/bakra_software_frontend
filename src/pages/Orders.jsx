


import React, { useState, useEffect } from "react";
import { Plus, Edit, CheckCircle, XCircle } from "lucide-react";
import axiosInstance from "../lib/axios.js";
import { notify } from "../utils/toast.js";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelData, setCancelData] = useState({ id: "", reason: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const [newOrder, setNewOrder] = useState({
    name: "",
    phone: "",
    address: "",
    source: "Call",
    deliveryTimeSlot: "",
    quantity: "",
    paymentMode: "",
    couponCode: "",
  });

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

  // ✅ Add new order
  const handleAddOrder = async () => {
    const { name, phone, address, deliveryTimeSlot, quantity, paymentMode } = newOrder;
    if (!name || !phone || !address || !deliveryTimeSlot || !quantity || !paymentMode) {
     
notify.warning("Please fill all required fields!");
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
          source: "Call",
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

  // ✅ Handle status change
  const handleStatusChange = async (id, newStatus) => {
    if (newStatus === "Cancelled") {
      setCancelData({ id, reason: "" });
      setShowCancelModal(true);
      return;
    }

    if (!window.confirm(`Change order status to "${newStatus}"?`)) return;

    try {
      const res = await axiosInstance.put(`orders/${id}/status`, { status: newStatus });
      if (res.data.success) {
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

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Pagination logic
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

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
            {currentOrders.map((order, index) => (
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
                      disabled={order.status === "Cancelled"}
                    className={`px-2 py-1 rounded-md text-sm font-medium w-full sm:w-auto ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">{order.orderDate}</td>
                <td className="py-3 px-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No orders */}
        {orders.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            {loading ? "Loading orders..." : "No orders found."}
          </p>
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

      {/* Add Order Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <CheckCircle className="text-green-600" /> Add New Order
            </h2>

            <div className="space-y-4">
              {[
                { name: "name", placeholder: "Customer Name" },
                { name: "phone", placeholder: "Phone Number" },
              ].map((field) => (
                <input
                  key={field.name}
                  type="text"
                  placeholder={field.placeholder}
                  value={newOrder[field.name]}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, [field.name]: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}

              <textarea
                placeholder="Delivery Address"
                value={newOrder.address}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, address: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                rows={2}
              />

              <select
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
              </select>

              <select
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
    </div>
  );
};

export default Orders;
