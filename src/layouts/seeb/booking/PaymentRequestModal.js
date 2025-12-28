import { useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { apiCall } from "utils/apiClient";


const PaymentRequestModal = ({ onClose, bookingId, userId, onSubmit }) => {
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !reason) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true)
        try {
            const result = await apiCall({
                endpoint: "payment/request",
                method: "POST",
                data: {
                    booking_id: bookingId,
                    user_id: userId,
                    amount: parseFloat(amount),
                    reason: reason.trim(),
                },
            });

            if (result && (result.status === 201 || result.success === true)) {
                toast.success("Payment request submitted successfully!");
                onSubmit();
                onClose();
            } else {
                toast.error(result?.Message || result?.message || "Failed to save expense");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Payment Request</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Requested Amount (₹)</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Reason for Payment</label>
                        <textarea
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

PaymentRequestModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    bookingId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
};

export default PaymentRequestModal;
