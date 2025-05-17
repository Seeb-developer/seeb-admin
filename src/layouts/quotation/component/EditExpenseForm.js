import React from 'react';
import PropTypes from 'prop-types';

const EditExpenseForm = ({ handleOnSubmit, formData, setFormData, handleCancel }) => {
    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleOnSubmit();
    };

    const fields = [
        { label: "Transaction Type", key: "transaction_type", type: "dropdown", options: ["Expense", "Income"] },
        { label: "Category", key: "category", type: "dropdown", options: ["Material", "Labour", "Sales", "Services", "Advance", "Installment 1", "Installment 2", "Installment 3", "Installment 4", "Final", "Other"] },
        { label: "Amount", key: "amount", type: "number" },
        { label: "Payment Method", key: "payment_method", type: "dropdown", options: ["Cash", "Online", "Cheque", "Other"] },
        { label: "Transaction No.", key: "transaction_no", type: "text" },
        { label: "Vendor/Client", key: "vendor_or_client", type: "text" },
        { label: "Remarks", key: "remarks", type: "text" },
        { label: "Description", key: "description", type: "textarea" },
    ];

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            {/* Grid Structure */}
            <div className="sm:grid grid-cols-8 gap-x-6 mb-4 px-4 flex flex-col sm:flex-row items-center">
                {fields.map(({ key, label, type, options }) => (
                    <div key={key} className="col-span-1 w-full">
                        <label  className="block text-gray-700 text-sm font-bold mb-4 mt-4">{label}</label>
                        {type === "dropdown" ? (
                            <select
                                required
                                value={formData[key] || ""}
                                onChange={(e) => handleChange(key, e.target.value)}
                                 className="block w-full text-sm text-gray-700 border rounded px-2 py-2"
                            >
                                <option value="" disabled>Select {label}</option>
                                {options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : type === "textarea" ? (
                            <textarea
                                required
                                value={formData[key] || ""}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className="block w-full text-sm text-gray-700 border rounded px-2 py-2"
                                placeholder={label}
                            ></textarea>
                        ) : (
                            <input
                                required
                                type={type}
                                value={formData[key] || ""}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className="block w-full text-sm text-gray-700 border rounded px-2 py-2"
                                placeholder={label}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center space-x-4 mt-3 mb-3">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-2 px-4 rounded-md shadow"
                >
                    Update
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-red-500 hover:bg-gray-600 text-white font-semibold text-sm py-2 px-4 rounded-md shadow"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

EditExpenseForm.propTypes = {
    handleOnSubmit: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    setFormData: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        id: PropTypes.string,
        transaction_type: PropTypes.string,
        category: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        payment_method: PropTypes.string,
        transaction_no: PropTypes.string,
        vendor_or_client: PropTypes.string,
        remarks: PropTypes.string,
        description: PropTypes.string,
        date: PropTypes.string,
    }).isRequired,
};

export default EditExpenseForm;
