import React, { useEffect, useState, useMemo } from "react";
import { Plus, Edit, Trash2, CheckCircle,Eye } from "lucide-react";
import axiosInstance from "../lib/axios";
import { notify } from "../utils/toast";
import { useSearch } from "../context/SearchContext.jsx";

const Associates = () => {
    const [associates, setAssociates] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAssociate, setSelectedAssociate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewOrdersModal, setViewOrdersModal] = useState(false);
    const [orders, setOrders] = useState([]);
    const [selectedAssociateName, setSelectedAssociateName] = useState("");
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const associatesPerPage = 10;
    const { searchTerm } = useSearch();

    const [newAssociate, setNewAssociate] = useState({
        name: "",
        phone: "",
        email: "",
        region: "",
        designation: "",
    });

    const [editAssociate, setEditAssociate] = useState({
        _id: "",
        name: "",
        phone: "",
        email: "",
        region: "",
        designation: "",
    });

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
    }, []);

    // ✅ Add new associate
    const handleAddAssociate = async () => {
        const { name, phone, email, region, designation } = newAssociate;
        if (!name || !phone || !email || !region || !designation) {
            notify.warning("Please fill all required fields!");
            return;
        }

        if (phone.length !== 10) {
            notify.error("Phone number must be 10 digits long.");
            return;
        }

        try {
            const res = await axiosInstance.post("/associates/add", newAssociate);
            if (res.data.success) {
                notify.success("Associate added successfully!");
                setShowModal(false);
                setNewAssociate({
                    name: "",
                    phone: "",
                    email: "",
                    region: "",
                    designation: "",
                });
                fetchAssociates();
            }
        } catch (error) {
            console.error("❌ Error adding associate:", error);
            notify.error("Failed to add associate!");
        }
    };

    // ✅ Edit associate
    const handleEditAssociate = async () => {
        const { name, phone, email, region, designation, _id } = editAssociate;
        if (!name || !phone || !email || !region || !designation) {
            notify.warning("Please fill all required fields!");
            return;
        }

        if (phone.length !== 10) {
            notify.error("Phone number must be 10 digits long.");
            return;
        }

        try {
            const res = await axiosInstance.put(`/associates/update/${_id}`, editAssociate);
            if (res.data.success) {
                notify.success("Associate updated successfully!");
                setShowEditModal(false);
                fetchAssociates();
            }
        } catch (error) {
            console.error("❌ Error updating associate:", error);
            notify.error("Failed to update associate!");
        }
    };

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
                    onClick={() => setShowModal(true)}
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
                            <th className="py-3 px-4 text-left">Region</th>
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
                                <td className="py-3 px-4">{associate.email}</td>
                                <td className="py-3 px-4">{associate.totalOrders}</td>
                                <td className="py-3 px-4">₹ {associate.totalRevenue}</td>
                                <td className="py-3 px-4">{associate.region}</td>
                                <td className="py-3 px-4">{associate.designation}</td>
                                <td className="py-3 px-4 text-center">
                                    <button
                                        onClick={() => {
                                            console.log("🔍 Selected associate:", associate); // Debug
                                            fetchAssociateOrders(associate);
                                        }}
                                        className="text-green-600 hover:text-green-800 mr-2"
                                    >
                                        <Eye size={18}/>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditAssociate(associate);
                                            setShowEditModal(true);

                                        }}
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

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3">
                    <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
                            <CheckCircle className="text-green-600" /> Add Associate
                        </h2>

                        <div className="space-y-4">
                            {["name", "email", "region"].map((field) => (
                                <input
                                    key={field}
                                    type="text"
                                    placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                    value={newAssociate[field]}
                                    onChange={(e) =>
                                        setNewAssociate({ ...newAssociate, [field]: e.target.value.trimStart() })
                                    }
                                    className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                                />
                            ))}

                            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
                                <span className="text-slate-600 font-medium select-none">+91</span>
                                <input
                                    type="tel"
                                    placeholder="Enter 10-digit number"
                                    value={newAssociate.phone}
                                    onChange={(e) => {
                                        // ✅ Only digits allowed
                                        let input = e.target.value.replace(/\D/g, "");

                                        // ✅ Restrict to 10 digits max
                                        if (input.length > 10) input = input.slice(0, 10);

                                        setNewAssociate({ ...newAssociate, phone: input });
                                    }}
                                    className={`flex-1 ml-2 outline-none ${newAssociate.phone.length > 0 && newAssociate.phone.length < 10
                                        ? "text-slate-900"
                                        : "text-slate-900"
                                        }`}
                                    maxLength="10"
                                    inputMode="numeric"
                                />
                            </div>
                            <select
                                value={newAssociate.designation}
                                onChange={(e) =>
                                    setNewAssociate({ ...newAssociate, designation: e.target.value })
                                }
                                className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select Designation</option>
                                {[
                                    "Sales Executive",
                                    "Sales Manager"
                                ].map((slot) => (
                                    <option key={slot} value={slot}>
                                        {slot}
                                    </option>
                                ))}
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
                                onClick={handleAddAssociate}
                                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                            >
                                Add Associate
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
                            <Edit className="text-blue-600" /> Edit Associate
                        </h2>

                        <div className="space-y-4">
                            {["name", "email", "region"].map((field) => (
                                <input
                                    key={field}
                                    type="text"
                                    placeholder={`Enter ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                                    value={editAssociate[field]}
                                    onChange={(e) =>
                                        setEditAssociate({ ...editAssociate, [field]: e.target.value.trimStart() })
                                    }
                                    className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}

                            <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                                <span className="text-slate-600 font-medium select-none">+91</span>
                                <input
                                    type="tel"
                                    placeholder="Enter 10-digit number"
                                    value={editAssociate.phone}
                                    onChange={(e) => {
                                        let input = e.target.value.replace(/\D/g, "");
                                        if (input.length > 10) input = input.slice(0, 10);
                                        setEditAssociate({ ...editAssociate, phone: input });
                                    }}
                                    className="flex-1 ml-2 outline-none text-slate-900"
                                    maxLength="10"
                                    inputMode="numeric"
                                />
                            </div>
                            <select
                                value={editAssociate.designation}
                                onChange={(e) =>
                                    setEditAssociate({ ...editAssociate, designation: e.target.value })
                                }
                                className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select Designation</option>
                                {[
                                    "Sales Executive",
                                    "Sales Manager"
                                ].map((slot) => (
                                    <option key={slot} value={slot}>
                                        {slot}
                                    </option>
                                ))}
                            </select>
                        </div>



                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditAssociate}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Update
                            </button>
                           


                        </div>
                    </div>
                </div>
            )}

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
                                        {orders.map((order, index) => (
                                            <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                                                <td className="py-3 px-4">{index + 1}</td>
                                                <td className="py-3 px-4 font-medium">{order.customerId?.name || "N/A"}</td>
                                                <td className="py-3 px-4">{order.customerId?.phone || "-"}</td>
                                                <td className="py-3 px-4">{order.quantity}</td>
                                                <td className="py-3 px-4">₹ {order.amount}</td>
                                                <td className="py-3 px-4">{order.paymentMode}</td>
                                                <td className="py-3 px-4">{order.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

        </div>
    );
};

export default Associates;
