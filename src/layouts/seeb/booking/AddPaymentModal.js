import { useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { apiCall } from "utils/apiClient";

const AddPaymentModal = ({ onClose, bookingId, userId, onSubmit }) => {
    const [amount, setAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!amount || isNaN(amount) || amount <= 0) {
            setError("Please enter a valid amount.");
            setLoading(false);
            return;
        }

        const payload = {
            booking_id: bookingId,
            user_id: userId,
            amount: parseFloat(amount),
            payment_method: paymentMethod.toLowerCase(),
            transaction_id: transactionId || `manual_${Date.now()}`, // Auto-generate if empty
        };

        try {
            const result = await apiCall({
                endpoint: "booking/payment/manual",
                method: "POST",
                data: payload,
            });

            if (result && (result.status === 200 || result.success === true)) {
                toast.success("Payment added successfully!");
                onClose();
                onSubmit();
            } else {
                setError(result?.message || "Failed to add payment.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-semibold mb-4">Add Payment</h3>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Amount (₹)</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Transaction ID</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter transaction ID (optional)"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Payment Method</label>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option>Cash</option>
                            <option>Credit Card</option>
                            <option>Debit Card</option>
                            <option>UPI</option>
                            <option>Net Banking</option>
                        </select>
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
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddPaymentModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    bookingId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
};

export default AddPaymentModal;
