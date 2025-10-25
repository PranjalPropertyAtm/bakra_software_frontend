

// import React, { useEffect, useState } from "react";
// import { Plus, CheckCircle } from "lucide-react";
// import axiosInstance from "../lib/axios.js";
// import { toast } from "react-toastify";

// const Customers = () => {
//   const [customers, setCustomers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [newCustomer, setNewCustomer] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     address: "",
//   });

//   // 🔹 Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const customersPerPage = 10;

//   // 🔹 Fetch All Customers
//   const fetchCustomers = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosInstance.get("customers/all");
//       if (res.data.success) setCustomers(res.data.customers);
//     } catch (error) {
//       console.error("❌ Error fetching customers:", error);
//       toast.error("Failed to fetch customers!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Add Customer
//   const handleAddCustomer = async () => {
//     const { name, phone, address } = newCustomer;
//     if (!name || !phone || !address) {
//       toast.warn("⚠️ Please fill all required fields!");
//       return;
//     }

//     try {
//       const res = await axiosInstance.post("customers/add", newCustomer);
//       if (res.data.success) {
//         toast.success("✅ Customer added successfully!");
//         setShowModal(false);
//         setNewCustomer({ name: "", phone: "", email: "", address: "" });
//         fetchCustomers();
//       }
//     } catch (error) {
//       console.error("❌ Error adding customer:", error);
//       toast.error(error.response?.data?.message || "Failed to add customer!");
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   // 🔹 Pagination calculations
//   const totalPages = Math.ceil(customers.length / customersPerPage);
//   const indexOfLastCustomer = currentPage * customersPerPage;
//   const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
//   const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

//   const handleNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50  p-4 sm:p-6 font-[Inter]">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>
//           <p className="text-gray-500">Manage and view all customer details</p>
//         </div>
//         <button
//           onClick={() => setShowModal(true)}
//           className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
//         >
//           <Plus size={18} />
//           Add Customer
//         </button>
//       </div>

//       {/* Customers Table */}
//       <div className="overflow-x-auto bg-white rounded-xl shadow-md">
//         <table className="min-w-full table-auto text-sm text-gray-700">
//           <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
//             <tr>
//               <th className="py-3 px-4 text-left">#</th>
//               <th className="py-3 px-4 text-left">Name</th>
//               <th className="py-3 px-4 text-left">Phone</th>
//               <th className="py-3 px-4 text-left">Email</th>
//               <th className="py-3 px-4 text-left">Address</th>
//               <th className="py-3 px-4 text-left">Joined On</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentCustomers.map((cust, index) => (
//               <tr
//                 key={cust._id}
//                 className="border-b hover:bg-gray-50 transition duration-150"
//               >
//                 <td className="py-3 px-4 font-medium">
//                   {indexOfFirstCustomer + index + 1}
//                 </td>
//                 <td className="py-3 px-4">{cust.name}</td>
//                 <td className="py-3 px-4">{cust.phone}</td>
//                 <td className="py-3 px-4">{cust.email || "—"}</td>
//                 <td className="py-3 px-4">{cust.address}</td>
//                 <td className="py-3 px-4">
//                   {new Date(cust.createdAt).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {customers.length === 0 && (
//           <p className="text-center text-gray-500 py-6">
//             {loading ? "Loading customers..." : "No customers found."}
//           </p>
//         )}
//       </div>

//       {/* Pagination */}
//       {customers.length > 0 && (
//         <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
//           <p className="text-gray-600 text-sm">
//             Showing {indexOfFirstCustomer + 1}–
//             {Math.min(indexOfLastCustomer, customers.length)} of{" "}
//             {customers.length} customers
//           </p>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={handlePrevPage}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded-md border text-sm ${
//                 currentPage === 1
//                   ? "text-gray-400 border-gray-200 cursor-not-allowed"
//                   : "text-gray-700 border-gray-300 hover:bg-gray-100"
//               }`}
//             >
//               Previous
//             </button>
//             <span className="text-gray-700 text-sm font-medium">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={handleNextPage}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded-md border text-sm ${
//                 currentPage === totalPages
//                   ? "text-gray-400 border-gray-200 cursor-not-allowed"
//                   : "text-gray-700 border-gray-300 hover:bg-gray-100"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Add Customer Modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-3">
//           <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl">
//             <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
//               <CheckCircle className="text-green-600" /> Add New Customer
//             </h2>

//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Customer Name"
//                 value={newCustomer.name}
//                 onChange={(e) =>
//                   setNewCustomer({ ...newCustomer, name: e.target.value })
//                 }
//                 className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
//               />
//               <input
//                 type="text"
//                 placeholder="Phone Number"
//                 value={newCustomer.phone}
//                 onChange={(e) =>
//                   setNewCustomer({ ...newCustomer, phone: e.target.value })
//                 }
//                 className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
//               />
//               <input
//                 type="email"
//                 placeholder="Email (optional)"
//                 value={newCustomer.email}
//                 onChange={(e) =>
//                   setNewCustomer({ ...newCustomer, email: e.target.value })
//                 }
//                 className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
//               />
//               <textarea
//                 placeholder="Address"
//                 value={newCustomer.address}
//                 onChange={(e) =>
//                   setNewCustomer({ ...newCustomer, address: e.target.value })
//                 }
//                 rows={2}
//                 className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>

//             <div className="flex justify-end gap-3 mt-6">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddCustomer}
//                 className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
//               >
//                 Add Customer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Customers;

import React, { useState, useEffect } from "react";
import { Plus, CheckCircle } from "lucide-react";
import axiosInstance from "../lib/axios.js";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // ✅ Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("customers/all");
      if (res.data.success) setCustomers(res.data.customers);
    } catch (error) {
      console.error("❌ Error fetching customers:", error);
      alert("Failed to fetch customers!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new customer
  const handleAddCustomer = async () => {
    const { name, phone, address } = newCustomer;
    if (!name || !phone || !address) {
      alert("⚠️ Please fill all required fields!");
      return;
    }

    try {
      const res = await axiosInstance.post("customers/add", newCustomer);
      if (res.data.success) {
        alert("✅ Customer added successfully!");
        setShowModal(false);
        setNewCustomer({ name: "", phone: "", email: "", address: "" });
        fetchCustomers();
      }
    } catch (error) {
      console.error("❌ Error adding customer:", error);
      alert(error.response?.data?.message || "Failed to add customer!");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ✅ Pagination
  const indexOfLast = currentPage * customersPerPage;
  const indexOfFirst = indexOfLast - customersPerPage;
  const currentCustomers = customers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(customers.length / customersPerPage);

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
              <th className="py-3 px-4 text-left">Joined On</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((cust, index) => (
              <tr
                key={cust._id}
                className="border-b hover:bg-gray-50 transition duration-150"
              >
                <td className="py-3 px-4">{indexOfFirst + index + 1}</td>
                <td className="py-3 px-4 font-medium">{cust.name}</td>
                <td className="py-3 px-4">{cust.phone}</td>
                <td className="py-3 px-4">{cust.email || "—"}</td>
                <td className="py-3 px-4">{cust.address}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {new Date(cust.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No Customers */}
        {customers.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            {loading ? "Loading customers..." : "No customers found."}
          </p>
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
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                placeholder="Address"
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
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
    </div>
  );
};

export default Customers;
