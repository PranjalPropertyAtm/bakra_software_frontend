import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Eye, XCircle, CheckCircle } from "lucide-react";
import axiosInstance from "../lib/axios.js";
import { notify } from "../utils/toast.js";
import { useSearch } from "../context/SearchContext.jsx";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 6;

  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [editCustomer, setEditCustomer] = useState({
    _id: "",
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const { searchTerm } = useSearch();

  // ✅ Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("customers/all");
      if (res.data.success) setCustomers(res.data.customers);
    } catch (error) {
      console.error("❌ Error fetching customers:", error);
      notify.error("Failed to fetch customers!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new customer
  const handleAddCustomer = async () => {
    const { name, phone, address } = newCustomer;
    if (!name || !phone || !address) {
      notify.warning("Please fill all required fields!");
      return;
    }

    if (phone.length !== 10) {
      notify.error("Phone number must be 10 digits long.");
      return;
    }

    try {
      const res = await axiosInstance.post("customers/add", newCustomer);
      if (res.data.success) {
        notify.success("Customer added successfully!");
        setShowModal(false);
        setNewCustomer({ name: "", phone: "", email: "", address: "" });
        fetchCustomers();
      }
    } catch (error) {
      console.error("❌ Error adding customer:", error);
      notify.error(error.response?.data?.message || "Failed to add customer!");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ✅ Edit customer
  const handleEditCustomer = (cust) => {
    setEditCustomer(cust);
    setShowEditModal(true);
  };

  const handleUpdateCustomer = async () => {
    try {
      const res = await axiosInstance.put(
        `customers/update/${editCustomer._id}`,
        editCustomer
      );
      if (res.data.success) {
        notify.success("Customer updated successfully!");
        setShowEditModal(false);
        fetchCustomers();
      }
    } catch (err) {
      console.error("❌ Error updating customer:", err);
      notify.error("Failed to update customer!");
    }
  };

  // ✅ View orders of a specific customer
  const handleViewOrders = async (id) => {
    try {
      const res = await axiosInstance.get(`customers/get/${id}`);
      if (res.data.success) {
        setSelectedCustomer(res.data.customer);
        setCustomerOrders(res.data.orders);
        setOrdersPage(1);
        setShowOrdersModal(true);
      }
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      notify.error("Failed to fetch customer orders!");
    }
  };

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return customers.filter((o) => {
      const name = o.name?.toLowerCase() || "";
      const phone = o.phone?.toLowerCase() || "";
      const address = o.address?.toLowerCase() || "";
      const totalOrders = o.totalOrders?.toString().toLowerCase() || "";
      const payment = o.paymentMode?.toLowerCase() || "";
      const status = o.status?.toLowerCase() || "";
      const source = o.source?.toLowerCase() || "";

      return (
        name.includes(search) ||
        phone.includes(search) ||
        address.includes(search) ||
        payment.includes(search) ||
        totalOrders.includes(search) ||
        status.includes(search) ||
        source.includes(search)
      );
    });
  }, [searchTerm, customers]);


  // ✅ Pagination
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-[Inter]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>
          <p className="text-gray-500 text-sm">
            Manage and view all registered customers
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm mt-3 sm:mt-0"
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full table-auto text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="py-3 px-4 text-left">S.No</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Total Orders</th>
              <th className="py-3 px-4 text-left">Joined On</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.slice(indexOfFirst, indexOfLast).map((cust, index) => (
              <tr
                key={cust._id}
                className="border-b hover:bg-gray-50 transition duration-150"
              >
                <td className="py-3 px-4">{indexOfFirst + index + 1}</td>
                <td className="py-3 px-4 font-medium">{cust.name}</td>
                <td className="py-3 px-4">{cust.phone}</td>
                <td className="py-3 px-4">{cust.email || "—"}</td>
                <td className="py-3 px-4">{cust.address}</td>
                <td className="py-3 px-4">{cust.totalOrders}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                {new Date(cust.createdAt).toISOString().split("T")[0]}
                </td>
                <td className="py-3 px-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleEditCustomer(cust)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Edit size={18} /> 
                  </button>
                  <button
                    onClick={() => handleViewOrders(cust._id)}
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <Eye size={18} /> 
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {/* No customers after search */}
        {/* {filteredCustomers.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            {loading ? "Loading customers..." : "No customers found."}
          </p>
        )} */}


        {/* No Customers */}
        {/* {customers.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            {loading ? "" : "No customers found."}
          </p>
        )} */}

        {filteredCustomers.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-6">
            No customers found.
          </p>
        )}

        {loading && (
          <p className="text-center text-gray-500 py-6">Loading customers...</p>
        )}
      </div>

      {/* ✅ Pagination Controls */}
      {customers.length > 10 && (
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

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <CheckCircle className="text-green-600" /> Add New Customer
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value.trimStart() })
                }
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              />

              <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
                <span className="text-slate-600 font-medium select-none">+91</span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={newCustomer.phone}
                  onChange={(e) => {
                    // ✅ Only digits allowed
                    let input = e.target.value.replace(/\D/g, "");

                    // ✅ Restrict to 10 digits max
                    if (input.length > 10) input = input.slice(0, 10);

                    setNewCustomer({ ...newCustomer, phone: input });
                  }}
                  className={`flex-1 ml-2 outline-none ${newCustomer.phone.length > 0 && newCustomer.phone.length < 10
                    ? "text-slate-900"
                    : "text-slate-900"
                    }`}
                  maxLength="10"
                  inputMode="numeric"
                />
              </div>
              <input
                type="email"
                placeholder="Email (optional)"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value.trimStart() })
                }
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                placeholder="Address"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value.trimStart() })
                }
                rows={2}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <Edit className="text-blue-600" /> Edit Customer
            </h2>
            <div className="space-y-4">
              {["name", "email", "address"].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={`Enter ${field}`}
                  value={editCustomer[field]}
                  onChange={(e) =>
                    setEditCustomer({ ...editCustomer, [field]: e.target.value.trimStart() })
                  }
                  className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}

              <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
                <span className="text-slate-600 font-medium select-none">+91</span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={editCustomer.phone}
                  onChange={(e) => {
                    // ✅ Only digits allowed
                    let input = e.target.value.replace(/\D/g, "");

                    // ✅ Restrict to 10 digits max
                    if (input.length > 10) input = input.slice(0, 10);

                    setEditCustomer({ ...editCustomer, phone: input });
                  }}
                  className={`flex-1 ml-2 outline-none ${editCustomer.phone.length > 0 && editCustomer.phone.length < 10
                    ? "text-slate-900"
                    : "text-slate-900"
                    }`}
                  maxLength="10"
                  inputMode="numeric"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCustomer}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Orders Modal */}
      {showOrdersModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3">
          <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Eye className="text-green-600" />
                Orders of {selectedCustomer?.name}
              </h2>
              <button
                onClick={() => setShowOrdersModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={22} />
              </button>
            </div>
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Payment</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {customerOrders.length > 0 ? (
                  (() => {
                    const indexOfLastOrder = ordersPage * ordersPerPage;
                    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
                    const currentOrders = customerOrders.slice(indexOfFirstOrder, indexOfLastOrder);
                    return currentOrders.map((order, idx) => (
                      <tr key={order._id} className="border-t">
                        <td className="p-2">{order.orderDate}</td>
                        <td className="p-2">{order.quantity}</td>
                        <td className="p-2">{order.paymentMode}</td>
                        <td className="p-2">{order.status}</td>
                      </tr>
                    ));
                  })()
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-4 text-center text-gray-500 italic"
                    >
                      No orders found for this customer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Orders Pagination */}
            {customerOrders.length > ordersPerPage && (
              <div className="flex justify-center items-center gap-3 mt-4">
                <button
                  disabled={ordersPage === 1}
                  onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-gray-600 text-sm">
                  Page {ordersPage} of {Math.ceil(customerOrders.length / ordersPerPage)}
                </span>
                <button
                  disabled={ordersPage === Math.ceil(customerOrders.length / ordersPerPage)}
                  onClick={() => setOrdersPage((p) => Math.min(Math.ceil(customerOrders.length / ordersPerPage), p + 1))}
                  className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
