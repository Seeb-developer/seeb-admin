import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const AddExpensesModal = ({ onClose, onSubmit, bookingId, userId }) => {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [transactionId, setTransactionId] = useState("");
    const [vendorOrClient, setVendorOrClient] = useState("");
    const [description, setDescription] = useState("");
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

        if (!category) {
            setError("Please select a category.");
            setLoading(false);
            return;
        }

        const payload = {
            booking_id: bookingId,
            // user_id: userId,
            amount: parseFloat(amount),
            category,
            payment_method: paymentMethod.toLowerCase(),
            transaction_id: transactionId || `manual_${Date.now()}`, // Auto-generate if empty
            vendor_or_client: vendorOrClient,
            description,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}/expenses/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Expense added successfully!");
                onClose();
                onSubmit(); // Refresh data after successful submission
            } else {
                setError(result.message || "Failed to add expense.");
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
                <h3 className="text-xl font-semibold mb-4">Add Expense</h3>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Expense Amount (₹)</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Category</label>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Material">Material</option>
                            <option value="Labour">Labour</option>
                            <option value="Office Supplies">Office Supplies</option>
                            <option value="Travel">Travel</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                            <option value="Other">Other</option>
                            <option value="Vender">Vender</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium">Payment Method</label>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Bank Transfer">UPI</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Transaction ID (Optional)</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter transaction ID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Vendor/Client</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter vendor or client name"
                            value={vendorOrClient}
                            onChange={(e) => setVendorOrClient(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
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
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Expense"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddExpensesModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    bookingId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
};

export default AddExpensesModal;
