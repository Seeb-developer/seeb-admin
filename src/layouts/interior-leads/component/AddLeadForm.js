import PropTypes from "prop-types";
import { useState } from "react";

const AddLeadForm = ({ handleSubmit, handleChange, formData, loading }) => {


    return (
        <form onSubmit={handleSubmit} className=" p-6">
            <h2 className="text-lg font-semibold mb-4">Add New Lead</h2>

            <div className="flex flex-wrap gap-4">
                {/* Name Field */}
                <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-bold">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="block w-full text-sm text-gray-700 border rounded px-2 py-2"
                        placeholder="Enter name"
                    />
                </div>

                {/* Phone No. Field */}
                <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-bold">Phone No.</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="block w-full text-sm text-gray-700 border rounded px-2 py-2"
                        placeholder="Enter phone number"
                    />
                </div>

                {/* Email Field */}
                <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-bold">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="block w-full text-sm text-gray-700 border rounded px-2 py-2"
                        placeholder="Enter email"
                    />
                </div>

                {/* Message Field */}
                <div className="flex-1">
                    <label className="block text-gray-700 text-sm font-bold">Message</label>
                    <input
                        type="text"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-700 border rounded px-2 py-2"
                        placeholder="Enter message"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex items-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Adding Lead..." : "Submit"}
                    </button>
                </div>
            </div>
        </form>

    );
};

AddLeadForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        name: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
        message: PropTypes.string,
    }).isRequired,
    loading: PropTypes.bool.isRequired,
};

export default AddLeadForm;
