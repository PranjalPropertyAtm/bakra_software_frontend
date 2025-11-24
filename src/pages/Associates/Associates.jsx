import React, { useEffect, useState, useMemo } from "react";
import { Plus, Edit, Trash2, CheckCircle, Eye } from "lucide-react";
import Loader from "../../components/Loader.jsx";
import axiosInstance from "../../lib/axios.js";
import { notify } from "../../utils/toast.js";
import { useSearch } from "../../context/SearchContext.jsx";
import { useNavigate } from "react-router-dom";



const Associates = () => {
    const [associates, setAssociates] = useState([]);
 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAssociate, setSelectedAssociate] = useState(null);
    const [loading, setLoading] = useState(false);
 
    const [viewOrdersModal, setViewOrdersModal] = useState(false);
    const [viewBankDetailsModal, setViewBankDetailsModal] = useState(false);
    const [bankDetails, setBankDetails] = useState(null);
    const [orders, setOrders] = useState([]);
    const [ordersPage, setOrdersPage] = useState(1);
    const ordersPerPage = 6;
    const [selectedAssociateName, setSelectedAssociateName] = useState("");
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const associatesPerPage = 10;
    const { searchTerm } = useSearch();
    const navigate = useNavigate();

 

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
            notify.error("Failed to load designations");
        }
    };

    // ✅ Fetch all associates
    const fetchAssociates = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/associates/all");
            if (res.data.success) setAssociates(res.data.associates);
        } catch (error) {
            console.error("❌ Error fetching associates:", error);
            notify.error("Failed to fetch associates!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        fetchAssociates();
        fetchDesignations();
    }, []);




    // ✅ Delete associate
    const handleDeleteAssociate = async () => {
        try {
            const res = await axiosInstance.delete(`/associates/delete/${selectedAssociate._id}`);
            if (res.data.success) {
                notify.success("Associate deleted successfully!");
                fetchAssociates();
                setShowDeleteModal(false);
            }
        } catch (error) {
            console.error("❌ Error deleting associate:", error);
            notify.error("Failed to delete associate!");
        }
    };

    const handleViewOrders = async (associate) => {
        try {
            setSelectedAssociateName(associate.name);
            setOrdersPage(1);
            setLoadingOrders(true);
            const res = await axiosInstance.get(`/associates/by-associate/${associate._id}`);
            if (res.data.success) {
                setOrders(res.data.orders);
                setViewOrdersModal(true);
            }
        } catch (error) {
            console.error("❌ Error fetching orders:", error);
            notify.error("Failed to load orders!");
        } finally {
            setLoadingOrders(false);
        }
    };
    const fetchAssociateOrders = async (associate) => {
        if (!associate) {
            console.error("❌ Missing associate ID!");
            notify.error("Associate ID not found!");
            return;
        }

        try {
            setLoading(true);
            setOrdersPage(1);
            const res = await axiosInstance.get(`/associates/by-associate/${associate._id}`);
            if (res.data.success) {
                setOrders(res.data.orders);
                setViewOrdersModal(true);
            } else {
                notify.warning("No orders found for this associate!");
            }
        } catch (error) {
            console.error("❌ Error fetching orders:", error);
            notify.error("Failed to fetch associate orders!");
        } finally {
            setLoading(false);
        }
    };

    const fetchAssociateBankDetails = async (associate) => {
        if (!associate) {
            console.error("❌ Missing associate ID!");
            notify.error("Associate ID not found!");
            return;
        }
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/associates/bank-details/${associate._id}`);
            if (res.data.success) {

                setBankDetails(res.data.bankDetails);
                setViewBankDetailsModal(true);


            } else {
                notify.warning("No bank details found for this associate!");
            }
        } catch (error) {
            console.error("❌ Error fetching bank details:", error);
            notify.error("Failed to fetch bank details!");
        } finally {
            setLoading(false);
        }
    };


    // ✅ Search Filter
    const filteredAssociates = useMemo(() => {
        const search = searchTerm.toLowerCase();
        return associates.filter((a) =>
            [a.name, a.phone, a.email, a.region, a.designation]
                .some((f) => f?.toLowerCase().includes(search))
        );
    }, [associates, searchTerm]);

    // ✅ Pagination
    const indexOfLast = currentPage * associatesPerPage;
    const indexOfFirst = indexOfLast - associatesPerPage;
    const currentAssociates = filteredAssociates.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredAssociates.length / associatesPerPage);

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-[Inter]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Associates</h1>
                    <p className="text-gray-500 text-sm">Manage all sales team associates</p>
                </div>
                <button
                    onClick={() => navigate("/associates/add")}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm mt-3 sm:mt-0"
                >
                    <Plus size={18} /> Add Associate
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
                            <th className="py-3 px-4 text-left">Total Orders</th>
                            <th className="py-3 px-4 text-left">Total Revenue</th>
                            <th className="py-3 px-4 text-center">View Orders</th>
                            <th className="py-3 px-4 text-left">Region</th>
                            <th className="py-3 px-4 text-center">View Bank Details</th>
                            <th className="py-3 px-4 text-left">Designation</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAssociates.map((associate, index) => (
                            <tr key={associate._id} className="border-b hover:bg-gray-50 transition">
                                <td className="py-3 px-4">{indexOfFirst + index + 1}</td>
                                <td className="py-3 px-4 font-medium">{associate.name}</td>
                                <td className="py-3 px-4">{associate.phone}</td>
                                <td className="py-3 px-4">{associate.email || "—"}</td>
                                <td className="py-3 px-4">{associate.totalOrders}</td>
                                <td className="py-3 px-4">₹ {associate.totalRevenue}</td>
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => {
                                            console.log("🔍 Selected associate:", associate); // Debug
                                            fetchAssociateOrders(associate);
                                        }}
                                        className="text-green-600 hover:text-green-800 mr-2"
                                    >
                                        View Details
                                    </button>
                                </td>
                                <td className="py-3 px-4">{associate.region}</td>
                                <td className="py-3 px-4 text-center">

                                    <button
                                        onClick={() => {
                                            fetchAssociateBankDetails(associate);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        View Details
                                    </button>
                                </td>
                                <td className="py-3 px-4">{associate.designation}</td>
                                <td className="py-3 px-4 text-center">


                                    <button
                                        onClick={() => navigate("/associates/add", { state: { associate } })}
                                        className="text-blue-600 hover:text-blue-800 mr-2"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedAssociate(associate);
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18} />
                                    </button>



                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredAssociates.length === 0 && (
                    <p className="text-center text-gray-500 py-6">
                        {loading ? "Loading associates..." : "No associates found."}
                    </p>
                )}
            </div>

            {/* Pagination */}
            {filteredAssociates.length > 10 && (
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

         


            {/* Delete Modal */}
            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3">
                    <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Confirm Delete</h2>
                        <p className="text-gray-600 mb-5">
                            Are you sure you want to delete this associate?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAssociate}
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {viewOrdersModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3">
                    <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
                            <CheckCircle className="text-green-600" /> Orders by {selectedAssociateName}
                        </h2>

                        {loadingOrders ? (
                            <p className="text-center text-gray-500 py-6">Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <p className="text-center text-gray-500 py-6">No orders found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto text-sm text-gray-700">
                                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                        <tr>
                                            <th className="py-3 px-4 text-left">#</th>
                                            <th className="py-3 px-4 text-left">Customer</th>
                                            <th className="py-3 px-4 text-left">Phone</th>
                                            <th className="py-3 px-4 text-left">Quantity</th>
                                            <th className="py-3 px-4 text-left">Amount</th>
                                            <th className="py-3 px-4 text-left">Payment</th>
                                            <th className="py-3 px-4 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            const indexOfLastOrder = ordersPage * ordersPerPage;
                                            const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
                                            const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
                                            return currentOrders.map((order, index) => (
                                                <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                                                    <td className="py-3 px-4">{indexOfFirstOrder + index + 1}</td>
                                                    <td className="py-3 px-4 font-medium">{order.customerId?.name || "N/A"}</td>
                                                    <td className="py-3 px-4">{order.customerId?.phone || "-"}</td>
                                                    <td className="py-3 px-4">{order.quantity}</td>
                                                    <td className="py-3 px-4">₹ {order.amount}</td>
                                                    <td className="py-3 px-4">{order.paymentMode}</td>
                                                    <td className="py-3 px-4">{order.status}</td>
                                                </tr>
                                            ));
                                        })()}
                                    </tbody>
                                </table>
                                {/* Orders Pagination */}
                                {orders.length > ordersPerPage && (
                                    <div className="flex justify-center items-center gap-3 mt-4">
                                        <button
                                            disabled={ordersPage === 1}
                                            onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                                            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                                        >
                                            Prev
                                        </button>
                                        <span className="text-gray-600 text-sm">
                                            Page {ordersPage} of {Math.ceil(orders.length / ordersPerPage)}
                                        </span>
                                        <button
                                            disabled={ordersPage === Math.ceil(orders.length / ordersPerPage)}
                                            onClick={() => setOrdersPage((p) => Math.min(Math.ceil(orders.length / ordersPerPage), p + 1))}
                                            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setViewOrdersModal(false)}
                                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {viewBankDetailsModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-3">

                    <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-2xl border border-gray-100 font-[Inter] relative">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
                                <CheckCircle className="text-green-600 w-6 h-6" />
                                Bank Details of {selectedAssociateName}
                            </h2>

                            <button
                                onClick={() => setViewBankDetailsModal(false)}
                                className="text-gray-500 hover:text-gray-800 text-xl transition"
                            >
                                ✖
                            </button>
                        </div>

                        {/* Body */}
                        {loading ? (
                            <p className="text-center text-gray-500 py-10 text-sm">Loading bank details...</p>
                        ) : bankDetails ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">

                                {/* Bank Name */}
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Bank Name</p>
                                    <p className="text-gray-900 font-semibold mt-1">
                                        {bankDetails.bankName || "—"}
                                    </p>
                                </div>

                                {/* Account Holder Name */}
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Account Holder Name</p>
                                    <p className="text-gray-900 font-semibold mt-1">
                                        {bankDetails.accountHolderName || "—"}
                                    </p>
                                </div>

                                {/* Account Number */}
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Account Number</p>
                                    <p className="text-gray-900 font-semibold mt-1">
                                        {bankDetails.accountNumber || "—"}
                                    </p>
                                </div>

                                {/* IFSC Code */}
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">IFSC Code</p>
                                    <p className="text-gray-900 font-semibold mt-1">
                                        {bankDetails.ifscCode || "—"}
                                    </p>
                                </div>

                                {/* UPI ID */}
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">UPI ID</p>
                                    <p className="text-gray-900 font-semibold mt-1">
                                        {bankDetails.upiId || "—"}
                                    </p>
                                </div>

                                {/* Registered UPI Name */}
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Registered UPI Holder Name</p>
                                    <p className="text-gray-900 font-semibold mt-1">
                                        {bankDetails.registeredUpiName || "—"}
                                    </p>
                                </div>

                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-10 text-sm">No bank details found.</p>
                        )}

                        {/* Footer */}
                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => setViewBankDetailsModal(false)}
                                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Associates;
