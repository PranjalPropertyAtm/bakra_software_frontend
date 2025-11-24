

// import React, { useState, useEffect } from "react";
// import axiosInstance from "../../lib/axios";
// import { notify } from "../../utils/toast";
// import { useNavigate, useLocation } from "react-router-dom";

// const AddAssociate = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // If we got associate via navigate state, that's edit mode
//   const initialState = {
//     name: "",
//     phone: "",
//     email: "",
//     region: "",
//     designation: "",
//     bankName: "",
//     accountHolderName: "",
//     accountNumber: "",
//     ifscCode: "",
//     upiId: "",
//     registeredUpiName: "",
//     // _id will be present in edit mode
//   };

//   const [form, setForm] = useState(initialState);
//   const [designations, setDesignations] = useState([]);
//   const [submitting, setSubmitting] = useState(false);

//   // detect edit mode from location.state
//   const editAssociate = location.state?.associate;
//   const isEdit = Boolean(editAssociate && editAssociate._id);

//   useEffect(() => {
//     // fetch designations
//     const fetchDesignations = async () => {
//       try {
//         const res = await axiosInstance.get("/settings/get");
//         setDesignations(res.data?.settings?.designations || []);
//       } catch (err) {
//         console.error("Failed to load designations", err);
//       }
//     };
//     fetchDesignations();

//     // if navigate provided an associate (edit), prefill form
//     if (isEdit) {
//       // Normalize nested bankDetails
//       const bank = editAssociate.bankDetails || {};
//       setForm({
//         _id: editAssociate._id,
//         name: editAssociate.name || "",
//         phone: editAssociate.phone || "",
//         email: editAssociate.email || "",
//         region: editAssociate.region || "",
//         designation: editAssociate.designation || "",
//         bankName: bank.bankName || "",
//         accountHolderName: bank.accountHolderName || "",
//         accountNumber: bank.accountNumber || "",
//         ifscCode: bank.ifscCode || "",
//         upiId: bank.upiId || "",
//         registeredUpiName: bank.registeredUpiName || "",
//       });
//     }
//   }, []); // eslint-disable-line

//   const handleChange = (field, value) => {
//     setForm((s) => ({ ...s, [field]: value }));
//   };

//   const handleSubmit = async () => {
//     // basic validation
//     if (!form.name || !form.phone || !form.region || !form.designation) {
//       return notify.error("Please fill all required fields (Name, Phone, Region, Designation).");
//     }
//     if (form.phone.replace(/\D/g, "").length !== 10) {
//       return notify.error("Phone must be 10 digits");
//     }

//     setSubmitting(true);
//     try {
//       if (isEdit) {
//         // update flow
//         const payload = {
//           name: form.name,
//           phone: form.phone,
//           email: form.email === "" ? undefined : form.email,
//           region: form.region,
//           designation: form.designation,
//           bankName: form.bankName,
//           accountHolderName: form.accountHolderName,
//           accountNumber: form.accountNumber,
//           ifscCode: form.ifscCode,
//           upiId: form.upiId,
//           registeredUpiName: form.registeredUpiName,
//         };

//         const res = await axiosInstance.put(`/associates/update/${form._id}`, payload);
//         if (res.data.success) {
//           notify.success("Associate updated successfully!");
//           navigate("/associates");
//         } else {
//           notify.error(res.data.message || "Failed to update associate");
//         }
//       } else {
//         // create flow
//         const payload = {
//           name: form.name,
//           phone: form.phone,
//           email: form.email === "" ? undefined : form.email,
//           region: form.region,
//           designation: form.designation,
//           bankName: form.bankName,
//           accountHolderName: form.accountHolderName,
//           accountNumber: form.accountNumber,
//           ifscCode: form.ifscCode,
//           upiId: form.upiId,
//           registeredUpiName: form.registeredUpiName,
//         };

//         const res = await axiosInstance.post("/associates/add", payload);
//         if (res.data.success) {
//           notify.success("Associate added successfully!");
//           navigate("/associates");
//         } else {
//           notify.error(res.data.message || "Failed to add associate");
//         }
//       }
//     } catch (error) {
//       console.error("Submit error:", error);
//       notify.error("Server error. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800">
//           {isEdit ? "Edit Associate" : "Add New Associate"}
//         </h1>
//         <div className="space-x-2">
//           <button
//             onClick={() => navigate("/associates")}
//             className="px-4 py-2 rounded-md border bg-white hover:bg-gray-100"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={submitting}
//             className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
//           >
//             {submitting ? (isEdit ? "Updating..." : "Adding...") : (isEdit ? "Update Associate" : "Add Associate")}
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Basic Details */}
//         <div className="bg-white shadow-md rounded-xl p-6">
//           <h2 className="text-lg font-semibold mb-4 text-slate-800">Basic Details</h2>
//           <div className="space-y-4">
//             <input
//               className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="Full Name *"
//               value={form.name}
//               onChange={(e) => handleChange("name", e.target.value)}
//             />

//             <div className="flex items-center border rounded-md px-3 py-2 bg-white">
//               <span className="font-medium text-gray-600">+91</span>
//               <input
//                 className="ml-2 flex-1 outline-none"
//                 placeholder="Phone Number *"
//                 value={form.phone}
//                 maxLength={10}
//                 onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, ""))}
//               />
//             </div>

//             <input
//               className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="Email (optional)"
//               value={form.email}
//               onChange={(e) => handleChange("email", e.target.value)}
//             />

//             <input
//               className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="Region *"
//               value={form.region}
//               onChange={(e) => handleChange("region", e.target.value)}
//             />

//             <select
//               className="w-full border rounded-md px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-green-600"
//               value={form.designation}
//               onChange={(e) => handleChange("designation", e.target.value)}
//             >
//               <option value="">Select Designation *</option>
//               {designations.map((d, i) => (
//                 <option key={i} value={d.title}>
//                   {d.title}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Bank Details */}
//         <div className="bg-white shadow-md rounded-xl p-6">
//           <h2 className="text-lg font-semibold mb-4 text-slate-800">Bank Details</h2>
//           <div className="space-y-4">
//             <input
//               className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="Bank Name"
//               value={form.bankName}
//               onChange={(e) => handleChange("bankName", e.target.value)}
//             />
//             <input
//               className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="Account Holder Name"
//               value={form.accountHolderName}
//               onChange={(e) => handleChange("accountHolderName", e.target.value)}
//             />
//             <input
//               className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="Account Number"
//               value={form.accountNumber}
//               onChange={(e) => handleChange("accountNumber", e.target.value)}
//             />
//             <input
//               className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="IFSC Code"
//               value={form.ifscCode}
//               onChange={(e) => handleChange("ifscCode", e.target.value.toUpperCase())}
//             />
//             <input
//               className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="UPI ID"
//               value={form.upiId}
//               onChange={(e) => handleChange("upiId", e.target.value)}
//             />
//             <input
//               className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
//               placeholder="Registered UPI Holder Name"
//               value={form.registeredUpiName}
//               onChange={(e) => handleChange("registeredUpiName", e.target.value)}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddAssociate;


import React, { useState, useEffect } from "react";
import axiosInstance from "../../lib/axios";
import { notify } from "../../utils/toast";
import { useNavigate, useLocation } from "react-router-dom";

const AddAssociate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Default form fields
  const emptyForm = {
    name: "",
    phone: "",
    email: "",
    region: "",
    designation: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    registeredUpiName: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [designations, setDesignations] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Check if editing
  const editAssociate = location.state?.associate;
  const isEdit = Boolean(editAssociate?._id);

  useEffect(() => {
    // Fetch designations
    const fetchDesignations = async () => {
      try {
        const res = await axiosInstance.get("/settings/get");
        setDesignations(res.data?.settings?.designations || []);
      } catch (err) {
        console.error("❌ Error loading designations:", err);
      }
    };

    fetchDesignations();

    // Prefill form in edit mode
    if (isEdit) {
      const bank = editAssociate.bankDetails || {};
      setForm({
        _id: editAssociate._id,
        name: editAssociate.name,
        phone: editAssociate.phone,
        email: editAssociate.email || "",
        region: editAssociate.region,
        designation: editAssociate.designation,
        bankName: bank.bankName || "",
        accountHolderName: bank.accountHolderName || "",
        accountNumber: bank.accountNumber || "",
        ifscCode: bank.ifscCode || "",
        upiId: bank.upiId || "",
        registeredUpiName: bank.registeredUpiName || "",
      });
    }
  }, []);

  const updateField = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.region || !form.designation) {
      return notify.error("Please fill all required fields.");
    }
    if (form.phone.replace(/\D/g, "").length !== 10) {
      return notify.error("Phone number must be 10 digits.");
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email?.trim() || "",
        region: form.region,
        designation: form.designation,
        bankName: form.bankName,
        accountHolderName: form.accountHolderName,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
        upiId: form.upiId,
        registeredUpiName: form.registeredUpiName,
      };

      let response;

      if (isEdit) {
        response = await axiosInstance.put(
          `/associates/update/${form._id}`,
          payload
        );
      } else {
        response = await axiosInstance.post(`/associates/add`, payload);
      }

      if (response.data.success) {
        notify.success(
          isEdit
            ? "Associate updated successfully!"
            : "Associate added successfully!"
        );
        navigate("/associates");
      } else {
        notify.error(response.data.message);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      notify.error("Server error, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 font-[Inter]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            {isEdit ? "Edit Associate" : "Add New Associate"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEdit
              ? "Modify associate details"
              : "Fill the details to add a new associate"}
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={() => navigate("/associates")}
            className="px-5 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 rounded-md bg-green-600 text-white shadow hover:bg-green-700 transition disabled:bg-green-300"
          >
            {submitting
              ? isEdit
                ? "Updating..."
                : "Adding..."
              : isEdit
              ? "Update"
              : "Add Associate"}
          </button>
        </div>
      </div>

      {/* Form Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Details */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Basic Details
          </h2>

          <div className="space-y-5">

            <input
              placeholder="Full Name *"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <div className="flex items-center border rounded-md px-4 py-2">
              <span className="text-gray-600 font-medium">+91</span>
              <input
                maxLength={10}
                placeholder="Phone Number *"
                value={form.phone}
                onChange={(e) =>
                  updateField("phone", e.target.value.replace(/\D/g, ""))
                }
                className="ml-3 flex-1 outline-none"
              />
            </div>

            <input
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              placeholder="Region *"
              value={form.region}
              onChange={(e) => updateField("region", e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <select
              value={form.designation}
              onChange={(e) => updateField("designation", e.target.value)}
              className="w-full border rounded-md px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Designation *</option>
              {designations.map((d, i) => (
                <option key={i} value={d.title}>
                  {d.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Bank Details
          </h2>

          <div className="space-y-5">
            <input
              placeholder="Bank Name"
              value={form.bankName}
              onChange={(e) => updateField("bankName", e.target.value)}
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              placeholder="Account Holder Name"
              value={form.accountHolderName}
              onChange={(e) => updateField("accountHolderName", e.target.value)}
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              placeholder="Account Number"
              value={form.accountNumber}
              onChange={(e) => updateField("accountNumber", e.target.value)}
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              placeholder="IFSC Code"
              value={form.ifscCode}
              onChange={(e) => updateField("ifscCode", e.target.value.toUpperCase())}
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 uppercase"
            />

            <input
              placeholder="UPI ID"
              value={form.upiId}
              onChange={(e) => updateField("upiId", e.target.value)}
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
            />

            <input
              placeholder="Registered UPI Holder Name"
              value={form.registeredUpiName}
              onChange={(e) => updateField("registeredUpiName", e.target.value)}
              className="w-full border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAssociate;
