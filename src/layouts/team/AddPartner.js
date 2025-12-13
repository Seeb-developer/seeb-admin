import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

const AddPartner = () => {
    const navigate = useNavigate();

    const [staffData, setStaffData] = useState({
        name: '',
        mobile: '',
        age: '',
        work: '',
        labour_count: '',
        area: '',
        service_areas: '',
        aadhaar_no: '',
        aadhaar_front: null,
        aadhaar_back: null,
        pan_no: '',
        pan_file: null,
        address_proof: null,
        photo: null,
    });

    const [errors, setErrors] = useState({});

    // Handle Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStaffData({
            ...staffData,
            [name]: value,
        });
    };

    // Handle File Change
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setStaffData({
            ...staffData,
            [name]: files[0],
        });
    };

    // Validate the Form
    // const validateForm = () => {
    //     const newErrors = {};
    //     const regex = {
    //         mobile: /^[0-9]{10}$/,
    //         aadhaar: /^[0-9]{12}$/,
    //         pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    //     };

    //     // Required Fields Check
    //     for (let field in staffData) {
    //         if (field !== 'aadhaar_front' && field !== 'aadhaar_back' && field !== 'pan_file' && field !== 'address_proof' && field !== 'photo' && !staffData[field]) {
    //             newErrors[field] = `${field} is required`;
    //         }
    //     }

    //     // Specific Field Validations
    //     if (staffData.mobile && !regex.mobile.test(staffData.mobile)) {
    //         newErrors.mobile = 'Mobile number must be 10 digits';
    //     }
    //     if (staffData.aadhaar_no && !regex.aadhaar.test(staffData.aadhaar_no)) {
    //         newErrors.aadhaar_no = 'Aadhaar number must be 12 digits';
    //     }
    //     if (staffData.pan_no && !regex.pan.test(staffData.pan_no)) {
    //         newErrors.pan_no = 'Invalid PAN number format';
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    const validateForm = () => {
        const newErrors = {};
        const regex = {
            mobile: /^[0-9]{10}$/,
            aadhaar: /^[0-9]{12}$/,
            pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        };

        // ✅ Only these fields are required
        const requiredFields = ['name', 'mobile', 'work'];

        requiredFields.forEach((field) => {
            if (!staffData[field]) {
                newErrors[field] = `${field.replace('_', ' ')} is required`;
            }
        });

        // ✅ Validate only if value exists
        if (staffData.mobile && !regex.mobile.test(staffData.mobile)) {
            newErrors.mobile = 'Mobile number must be 10 digits';
        }

        if (staffData.aadhaar_no && !regex.aadhaar.test(staffData.aadhaar_no)) {
            newErrors.aadhaar_no = 'Aadhaar number must be 12 digits';
        }

        if (staffData.pan_no && !regex.pan.test(staffData.pan_no)) {
            newErrors.pan_no = 'Invalid PAN number format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData();
        for (let key in staffData) {
            formData.append(key, staffData[key]);
        }

        try {
            const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "partner/register", {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.status === 200 || result.status === 'success') {
                toast.success('Partner added successfully');
                navigate('/partner-list'); // Redirect to partner list after successful form submission
            } else {
                toast.error(result.message || 'Error adding partner');
            }
        } catch (error) {
            console.log('Error:', error);
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />
            <div className="border-solid border-2 black-indigo-600 mt-6 p-6 rounded-lg shadow-lg bg-white">
                <div className="px-8 mt-5 text-lg font-semibold">Add Partner</div>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {/* Name and Mobile */}
                    <div className="flex mt-6">
                        <div className="w-full px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={staffData.name}
                                onChange={handleInputChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                                placeholder="Full Name"
                            />
                            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                        </div>

                        <div className="w-full px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">
                                Phone No. <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="mobile"
                                value={staffData.mobile}
                                onChange={handleInputChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                                placeholder="000-000-0000"
                            />
                            {errors.mobile && <span className="text-red-500 text-xs">{errors.mobile}</span>}
                        </div>
                    </div>

                    {/* Aadhaar Number */}
                    <div className="flex mt-4">
                        <div className="w-full px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Aadhaar Number</label>
                            <input
                                type="text"
                                name="aadhaar_no"
                                value={staffData.aadhaar_no}
                                onChange={handleInputChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                                placeholder="Aadhaar Number"
                            />
                            {errors.aadhaar_no && <span className="text-red-500 text-xs">{errors.aadhaar_no}</span>}
                        </div>
                        <div className="w-full px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">PAN Number</label>
                            <input
                                type="text"
                                name="pan_no"
                                value={staffData.pan_no}
                                onChange={handleInputChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                                placeholder="PAN Number"
                            />
                            {errors.pan_no && <span className="text-red-500 text-xs">{errors.pan_no}</span>}
                        </div>
                    </div>

                    {/* Age, Work, Labour Count */}
                    <div className="flex mt-4">
                        <div className="w-full px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={staffData.age}
                                onChange={handleInputChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                                placeholder="Age"
                            />
                            {errors.age && <span className="text-red-500 text-xs">{errors.age}</span>}
                        </div>

                        <div className="w-full px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">
                                Work <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="work"
                                value={staffData.work}
                                onChange={handleInputChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                                placeholder="Work"
                            />
                            {errors.work && <span className="text-red-500 text-xs">{errors.work}</span>}
                        </div>
                    </div>

                    {/* Labour Count, Area */}
                    <div className="flex mt-4">
                        <div className="w-full px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Labour Count</label>
                            <input
                                type="number"
                                name="labour_count"
                                value={staffData.labour_count}
                                onChange={handleInputChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                                placeholder="Labour Count"
                            />
                            {errors.labour_count && <span className="text-red-500 text-xs">{errors.labour_count}</span>}
                        </div>

                        <div className="w-full px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Area</label>
                            <input
                                type="text"
                                name="area"
                                value={staffData.area}
                                onChange={handleInputChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                                placeholder="Area"
                            />
                            {errors.area && <span className="text-red-500 text-xs">{errors.area}</span>}
                        </div>
                    </div>

                    {/* Service Areas */}
                    <div className="flex mt-4">
                        <div className="w-1/2 px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Service Areas</label>
                            <input
                                type="text"
                                name="service_areas"
                                value={staffData.service_areas}
                                onChange={handleInputChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                                placeholder="Service Areas"
                            />
                            {errors.service_areas && <span className="text-red-500 text-xs">{errors.service_areas}</span>}
                        </div>
                    </div>

                    {/* Aadhaar, PAN, Address Proof and Photo */}
                    <div className="flex mt-4">
                        <div className="w-full px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Aadhaar Front</label>
                            <input
                                type="file"
                                name="aadhaar_front"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                            />
                            {errors.aadhaar_front && <span className="text-red-500 text-xs">{errors.aadhaar_front}</span>}
                        </div>

                        <div className="w-full px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Aadhaar Back</label>
                            <input
                                type="file"
                                name="aadhaar_back"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                            />
                            {errors.aadhaar_back && <span className="text-red-500 text-xs">{errors.aadhaar_back}</span>}
                        </div>
                    </div>

                    {/* PAN File */}
                    <div className="flex mt-4">
                        <div className="w-full px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">PAN File</label>
                            <input
                                type="file"
                                name="pan_file"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                            />
                            {errors.pan_file && <span className="text-red-500 text-xs">{errors.pan_file}</span>}
                        </div>
                        <div className="w-full px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Address Proof</label>
                            <input
                                type="file"
                                name="address_proof"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                            />
                            {errors.address_proof && <span className="text-red-500 text-xs">{errors.address_proof}</span>}
                        </div>
                    </div>

                    {/* Address Proof File */}
                    <div className="flex mt-4">

                        <div className="w-1/2 px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Photo</label>
                            <input
                                type="file"
                                name="photo"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                            />
                            {errors.photo && <span className="text-red-500 text-xs">{errors.photo}</span>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-5">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                            Add Partner
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default AddPartner;
