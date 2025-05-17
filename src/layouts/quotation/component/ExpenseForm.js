import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTrash } from 'react-icons/fa';

const ExpenseForm = ({ handleOnSubmit, formData, setFormData, }) => {

    const handleRowChange = (index, key, value) => {
        const updatedRows = [...formData];
        updatedRows[index][key] = value;
        setFormData(updatedRows);
    };

    const handleAddRow = () => {
        setFormData([
            ...formData,
            {
                transaction_type: "Expense",
                category: "",
                amount: "",
                payment_method: "",
                transaction_no: "",
                vendor_or_client: "",
                remarks: "",
                description: "",
            }
        ]);
    };

    const handleRemoveRow = (index) => {
        if (formData.length > 1) {
            const updatedRows = formData.filter((_, i) => i !== index);
            setFormData(updatedRows);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleOnSubmit();
    };

    const fields = [
        { label: "Transaction Type", key: "transaction_type", type: "dropdown", options: ["Expense", "Income"] },
        { label: "Category", key: "category", type: "dropdown", options: ["Material", "Labour", "Sales", "Services","Advance", "Installment 1", "Installment 2", "Installment 3", "Installment 4","Final", "Other"] },
        { label: "Amount", key: "amount", type: "number" },
        { label: "Payment Method", key: "payment_method", type: "dropdown", options: ["Cash", "Online", "Cheque", "Other"] },
        { label: "Transaction No.", key: "transaction_no", type: "text" },
        { label: "Vendor/Client", key: "vendor_or_client", type: "text" },
        { label: "Remarks", key: "remarks", type: "text" },
        { label: "Description", key: "description", type: "textarea" },
    ];

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            {/* Labels Row */}
            <div className="hidden sm:grid grid-cols-9 gap-x-6 mt-4 mb-4 px-4">
                {fields.map(({ label }, index) => (
                    <div key={index} className={`col-span-1 ${label === "Description" ? "col-span-1" : ""}`}>
                        <label className="block text-gray-700 text-sm font-bold">{label}</label>
                    </div>
                ))}
                <div className="col-span-1 text-center">
                    <span className="block text-gray-700 text-sm font-bold">Actions</span>
                </div>
            </div>

            {/* Input Rows */}
            {formData?.map((row, index) => (
                <div key={index} className="sm:grid grid-cols-9 gap-x-6 mb-4 px-4 flex flex-col sm:flex-row">
                    {fields.map(({ key, type, options }, fieldIndex) => (
                        <div key={fieldIndex} className={`col-span-1 ${key === "description" ? "col-span-1" : ""}`}>
                            {type === "dropdown" ? (
                                <select
                                    required
                                    value={row[key]}
                                    onChange={(e) => handleRowChange(index, key, e.target.value)}
                                    className="block w-full text-sm text-gray-700 border rounded px-2 py-2"
                                >
                                    <option value="" disabled>Select {key}</option>
                                    {options.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : type === "textarea" ? (
                                <textarea
                                    required
                                    value={row[key]}
                                    onChange={(e) => handleRowChange(index, key, e.target.value)}
                                    className="block w-full text-sm text-gray-700 border rounded px-2 py-2"
                                    placeholder={key}
                                ></textarea>
                            ) : (
                                <input
                                    required
                                    type={type}
                                    value={row[key]}
                                    onChange={(e) => handleRowChange(index, key, e.target.value)}
                                    className="block w-full text-sm text-gray-700 border rounded px-2 py-2"
                                    placeholder={key}
                                />
                            )}
                        </div>
                    ))}
                    <div className="col-span-1 flex items-center justify-end sm:justify-center mt-2 sm:mt-0">
                        <button
                            type="button"
                            onClick={() => handleRemoveRow(index)}
                            className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold px-1.5 py-1.5 rounded"
                        >
                            <FaTrash className="text-white" />
                        </button>
                    </div>
                </div>
            ))}

            {/* Add Row and Submit Buttons */}
            <div className="flex justify-center items-center">
                <button
                    type="button"
                    onClick={handleAddRow}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2 px-3 m-2 rounded-md shadow-sm"
                >
                    Add Row
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-2 px-3 m-2 rounded-md shadow-sm"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

ExpenseForm.propTypes = {
    handleOnSubmit: PropTypes.func.isRequired,
    setFormData: PropTypes.func.isRequired,
    quotation_id: PropTypes.string,
    formData: PropTypes.arrayOf(
        PropTypes.shape({
            quotation_id: PropTypes.string,
            transaction_type: PropTypes.string,
            category: PropTypes.string,
            amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            payment_method: PropTypes.string,
            transaction_no: PropTypes.string,
            vendor_or_client: PropTypes.string,
            remarks: PropTypes.string,
            description: PropTypes.string,
            date: PropTypes.string
        })
    ),
};

ExpenseForm.defaultProps = {
    initialData: [],
};

export default ExpenseForm;
