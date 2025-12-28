import React, { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { apiCall } from "utils/apiClient";

const BASE_URL = process.env.REACT_APP_HAPS_MAIN_BASE_URL;

const UpdateAddressModal = ({ booking, onClose }) => {
  const [address, setAddress] = useState(
    booking.customer_address || ""
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!address.trim()) {
      toast.error("Address cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const result = await apiCall({
        endpoint: `customer-address/update/${booking.address_id}`,
        method: "PUT",
        data: {
          address: address.trim(),
        },
      });

      if (result && result.status === 200) {
        toast.success("Address updated successfully");
        onClose(true); // 🔁 refresh booking
      } else {
        toast.error(result?.message || "Update failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-base font-semibold">
            Update Customer Address
          </h3>
          <button
            onClick={() => onClose(false)}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-4">
          <label className="block text-sm font-medium mb-1">
            Address
          </label>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={4}
            className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter customer address"
          />

          <p className="text-xs text-gray-500 mt-1">
            This will update the customer address only.
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-4 py-3 border-t">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 border rounded text-sm"
            disabled={saving}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

UpdateAddressModal.propTypes = {
  booking: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpdateAddressModal;
