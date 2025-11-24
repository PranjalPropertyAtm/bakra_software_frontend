
import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit, CheckCircle, XCircle, Trash2 } from "lucide-react";
import Loader from "../../components/Loader.jsx";
import axiosInstance from "../../lib/axios.js";
import { notify } from "../../utils/toast.js";
import { useSearch } from "../../context/SearchContext.jsx";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [updatingDelivery, setUpdatingDelivery] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);
  const [editingOrder, setEditingOrder] = useState(false);
  const [cancelData, setCancelData] = useState({ id: "", reason: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("");
  const ordersPerPage = 10;




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
  const [addingOrder, setAddingOrder] = useState(false);

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
    if (cancellingOrder) return;

    if (!cancelData.reason.trim()) {
      notify.error("Please Enter a Cancellation Reason");
      return;
    }

    setCancellingOrder(true);
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
    } finally {
      setCancellingOrder(false);
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
          onClick={() => navigate("/orders/add")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm mt-3 sm:mt-0"
        >
          <Plus size={18} />Add Order
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
                 
                  <button
                    disabled={["Delivered", "Cancelled"].includes(order.status)}
                    onClick={() => navigate(`/orders/edit/${order._id}`)}
                    className="text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
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
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            {cancellingOrder && (
              <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center rounded-lg">
                <Loader text="Cancelling order..." />
              </div>
            )}
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <XCircle className="text-red-600" /> Cancel Order
            </h2>
            <textarea
              placeholder="Enter cancellation reason..."
              value={cancelData.reason}
              onChange={(e) =>
                setCancelData({ ...cancelData, reason: e.target.value })
              }
              disabled={cancellingOrder}
              rows={3}
              className="w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => !cancellingOrder && setShowCancelModal(false)}
                disabled={cancellingOrder}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Close
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancellingOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancellingOrder ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivey Modal */}
      {showDeliverModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            {updatingDelivery && (
              <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center rounded-xl">
                <Loader text="Updating status..." />
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Confirm Delivery</h2>
            <p className="text-gray-600 mb-5">
              Are you sure you want to mark this order as <b>Delivered</b>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => !updatingDelivery && setShowDeliverModal(false)}
                disabled={updatingDelivery}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (updatingDelivery) return;
                  setUpdatingDelivery(true);
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
                  } finally {
                    setUpdatingDelivery(false);
                  }
                }}
                disabled={updatingDelivery}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingDelivery ? 'Updating...' : 'Yes, Deliver'}
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
