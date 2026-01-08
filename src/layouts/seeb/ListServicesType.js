import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEdit } from 'react-icons/md';
import { LoadingOutlined } from '@ant-design/icons';
import { Select, Spin, Tag } from 'antd';
import { Toaster, toast } from 'react-hot-toast';
import { Option } from 'antd/es/mentions';
import ConfirmModal from 'components/modal/ConfirmModal';
import Toggle from 'react-toggle';
import { apiCall } from 'utils/apiClient';

const ListServicesType = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;
    const deletstyle = { color: "red" };
    const editstyle = { color: "green" };

    const [serviceData, setServiceData] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [Loader, setLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceFormData, setServiceFormData] = useState({ name: '', slug: '', image: null, imagePreview: null, room_ids: [] });
    const [editMode, setEditMode] = useState(false);
    const [serviceIdToEdit, setServiceIdToEdit] = useState(null);
    const [rooms, setRoomData] = useState([])
    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    const confirmServiceDelete = (id) => {
        setSelectedServiceId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const result = await apiCall({
                endpoint: `services-type/delete/${selectedServiceId}`,
                method: 'DELETE',
            });
            if (result.status === 200) {
                getAllServices();
                toast.success("Service Type Deleted Successfully");
            }
        } catch (error) {
            console.log('Error deleting service:', error);
        }
        setShowDeleteModal(false);
        setSelectedServiceId(null);
    };

    const getAllServices = async () => {
        setLoader(true);
        try {
            const result = await apiCall({
                endpoint: "services-type",
                method: 'GET',
            });
            setLoader(false);
            setServiceData(result.data);
            setFilteredServices(result.data);
        } catch (error) {
            setLoader(false);
            console.error('Error fetching services:', error);
        }
    };

    // Generate slug from service name
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '');
    };

    // Handle search change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value === '') {
            setFilteredServices(serviceData);
        } else {
            const filtered = serviceData.filter(service =>
                service.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredServices(filtered);
        }
    };

    // Handle service name change and auto-generate slug
    const handleServiceNameChange = (e) => {
        const name = e.target.value;
        const slug = generateSlug(name);
        setServiceFormData({ ...serviceFormData, name, slug });
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();

        if (!serviceFormData.imagePreview) {
            toast.error("Image is required.");
            return;
        }

        const data = {
            name: serviceFormData.name,
            slug: serviceFormData.slug,
            image: serviceFormData.imagePreview,
            room_ids: serviceFormData.room_ids
        };

        const endpoint = editMode
            ? `services-type/update/${serviceIdToEdit}`
            : `services-type/create`;

        const method = editMode ? 'PUT' : 'POST';

        try {
            setLoader(true);
            const result = await apiCall({
                endpoint: endpoint,
                method: method,
                data: data,
            });

            if (result.status === (editMode ? 200 : 201)) {
                getAllServices();
                toast.success(editMode ? "Service Type Updated Successfully" : "Service Type Added Successfully");
                resetForm();
            } else {
                toast.error("Failed to submit service. Please try again.");
            }
        } catch (error) {
            console.error('Error submitting service:', error);
            toast.error("Error while processing request.");
        } finally {
            setLoader(false);
        }
    };

    const resetForm = () => {
        setServiceFormData({ name: '', slug: '', image: null, imagePreview: null, room_ids: [] });
        setEditMode(false);
        setServiceIdToEdit(null);
    };

    // Handle edit mode
    const handleServiceEdit = (service) => {
        setServiceFormData({
            name: service.name,
            slug: service.slug || '',
            image: null,
            imagePreview: service.image,
            room_ids: service.room_ids?.map(String),
        });
        setServiceIdToEdit(service.id);
        setEditMode(true);
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setServiceFormData({
                ...serviceFormData,
                image: file,
            });
        }
    };

    const handleImageUpload = async () => {
        if (!serviceFormData.image) {
            toast.error("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('image', serviceFormData.image);

        try {
            const result = await apiCall({
                endpoint: 'services-type/upload-image',
                method: 'POST',
                data: formData,
            });
            if (result.status === 200) {
                setServiceFormData({
                    ...serviceFormData,
                    imagePreview: result.image_url
                })
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Image upload failed. Please try again.");
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error("Error while uploading image.");
        }
    };

    const handleImageDelete = async () => {
        try {
            const result = await apiCall({
                endpoint: 'services/delete-image',
                method: 'POST',
                data: { image_path: serviceFormData.imagePreview },
            });
            if (result.status === 200) {
                setServiceFormData({ ...serviceFormData, imagePreview: null, image: null });
                toast.success("Image deleted successfully!");
            } else {
                toast.error("Failed to delete image.");
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error("Error while deleting image.");
        }
    };

    const getAllRooms = async () => {
        setLoader(true);
        try {
            const result = await apiCall({
                endpoint: "rooms",
                method: 'GET',
            });
            setLoader(false);
            if (result.status === 200)
                setRoomData(result.data);
        } catch (error) {
            setLoader(false);
            console.error('Error fetching rooms:', error);
        }
    };

    // Load services data when the component mounts
    useEffect(() => {
        getAllServices();
        getAllRooms();
    }, []);

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "1" ? "0" : "1";

        try {
            const result = await apiCall({
                endpoint: `services-type/change-status/${id}`,
                method: "PUT",
                data: { status: newStatus },
            });

            if (result.status === 200) {
                setFilteredServices(prevData => prevData.map(el =>
                    el.id === id ? { ...el, status: newStatus } : el
                ));
            } else {
                console.error("Error updating status:", result.message);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    const tagRender = ({ label, value, closable, onClose }) => {
        const onPreventMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };

        return (
            <Tag
                color="blue"
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{ marginInlineEnd: 4 }}
            >
                {label}
            </Tag>
        );
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" reverseOrder={false} />

            {Loader ? (
                <div className='flex justify-center items-center h-[75vh] w-full'>
                    <Spin indicator={antIcon} />
                </div>
            ) : (
                <div className="mt-4 mx-4 md:mx-6">
                    {/* Form Section */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4">
                        <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="w-1 h-5 bg-indigo-500 mr-2 rounded"></span>
                            {editMode ? 'Edit Service Type' : 'Add New Service Type'}
                        </h2>

                        {/* Add/Edit Service Form */}
                        <form onSubmit={handleServiceSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Service Type Name Input */}
                                <div className="relative w-full">
                                    <label className="block mb-1.5 text-xs font-semibold text-gray-700">Service Type Name</label>
                                    <input
                                        type="text"
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block w-full p-2 transition duration-200"
                                        placeholder="Enter service type name"
                                        value={serviceFormData.name}
                                        onChange={handleServiceNameChange}
                                        required
                                    />
                                </div>

                                {/* Service Slug Input */}
                                <div className="relative w-full">
                                    <label className="block mb-1.5 text-xs font-semibold text-gray-700">Slug</label>
                                    <input
                                        type="text"
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block w-full p-2 transition duration-200"
                                        placeholder="service-type-slug (auto-generated)"
                                        value={serviceFormData.slug}
                                        onChange={(e) => setServiceFormData({ ...serviceFormData, slug: e.target.value })}
                                        required
                                    />
                                    <div className="mt-1 flex items-center gap-2">
                                        <p className="text-xs text-gray-500">Suggested:</p>
                                        <button
                                            type="button"
                                            onClick={() => setServiceFormData({ ...serviceFormData, slug: generateSlug(serviceFormData.name) })}
                                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                                        >
                                            {generateSlug(serviceFormData.name)}
                                        </button>
                                    </div>
                                </div>

                                {/* Select Rooms */}
                                <div className="relative w-full">
                                    <label className="block mb-1.5 text-xs font-semibold text-gray-700">Select Rooms</label>
                                    <Select
                                        mode="multiple"
                                        tagRender={tagRender}
                                        value={serviceFormData.room_ids}
                                        style={{ width: "100%" }}
                                        placeholder="Select rooms"
                                        onChange={(selectedValues) => {
                                            setServiceFormData({ ...serviceFormData, room_ids: selectedValues });
                                        }}
                                    >
                                        {rooms?.map((room) => (
                                            <Option key={room.id} value={room.id}>
                                                {room.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>

                                {/* Image Upload Section */}
                                <div className='w-full'>
                                    <label className="block mb-1.5 text-xs font-semibold text-gray-700">Service Icon</label>
                                    <div className="flex gap-3 items-start">
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block w-full p-2 transition duration-200"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                        {serviceFormData?.image && (
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleImageUpload}
                                                    className="py-1.5 px-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition duration-200 whitespace-nowrap"
                                                >
                                                    Upload
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {serviceFormData.imagePreview && (
                                        <div className="mt-2 relative inline-block">
                                            <img
                                                src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + serviceFormData.imagePreview}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleImageDelete}
                                                className="absolute -top-2 -right-2 text-red-500 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition duration-200"
                                                title="Delete image"
                                            >
                                                <RiDeleteBin6Fill color='red' size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Submit/Cancel Buttons */}
                            </div>
                            <div className="flex gap-2 justify-center mt-4 pt-4 border-t border-gray-200">
                                <button 
                                    type="submit" 
                                    className="px-5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-sm rounded-lg transition duration-200 shadow-sm hover:shadow-md"
                                >
                                    {editMode ? 'Update Service Type' : 'Add Service Type'}
                                </button>
                                {editMode && (
                                    <button 
                                        type="button" 
                                        onClick={resetForm} 
                                        className="px-5 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium text-sm rounded-lg transition duration-200"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Display Services Section */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex gap-4 items-end">
                                <div className="flex items-center">
                                    <h2 className="text-sm font-semibold text-gray-800 flex items-center whitespace-nowrap">
                                        <span className="w-1 h-5 bg-indigo-500 mr-2 rounded"></span>
                                        Service Types List
                                    </h2>
                                </div>
                                {/* Search Input */}
                                <div className="relative flex-1">
                                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search by service type name..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-9 pr-4 py-2 transition duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left text-gray-700">
                                <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
                                    <tr>
                                        <th className="py-2 px-3 font-semibold text-gray-800">Sr.</th>
                                        <th className="py-2 px-3 font-semibold text-gray-800">Name</th>
                                        <th className="py-2 px-3 font-semibold text-gray-800">Slug</th>
                                        <th className="py-2 px-3 font-semibold text-gray-800">Image</th>
                                        <th className="py-2 px-3 font-semibold text-gray-800">Rooms</th>
                                        <th className="py-2 px-3 font-semibold text-gray-800">Status</th>
                                        <th className="py-2 px-3 font-semibold text-gray-800 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredServices?.length > 0 ? (
                                        filteredServices.map((service, index) => (
                                            <tr className="border-b hover:bg-gray-50 transition duration-150" key={service.id}>
                                                <td className="py-2 px-3 font-medium text-gray-900">{index + 1}</td>
                                                <td className="py-2 px-3 text-gray-700">{service.name}</td>
                                                <td className="py-2 px-3 text-gray-600 font-mono text-xs bg-gray-50 rounded px-2 inline-block">{service.slug || 'N/A'}</td>
                                                <td className="py-2 px-3">
                                                    {service.image && (
                                                        <img
                                                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + service.image}
                                                            alt={service.name}
                                                            className="w-10 h-10 object-cover rounded border border-gray-200"
                                                        />
                                                    )}
                                                </td>
                                                <td className="py-2 px-3">
                                                    <span className="text-xs text-gray-600">
                                                        {service?.room_names?.length > 0 ? service.room_names.join(', ') : <span className="text-gray-400">No Rooms</span>}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3">
                                                    <Toggle
                                                        checked={service.status === "1"}
                                                        onChange={() => handleToggleStatus(service.id, service.status)}
                                                        icons={false}
                                                        className="scale-75"
                                                    />
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => {
                                                                handleServiceEdit(service);
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition duration-150"
                                                            title="Edit service type"
                                                        >
                                                            <MdModeEdit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => confirmServiceDelete(service.id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition duration-150"
                                                            title="Delete service type"
                                                        >
                                                            <RiDeleteBin6Fill size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="py-6 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-10 h-10 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                    <p className="text-sm">No Service Types Available</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <ConfirmModal
                            show={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                            onConfirm={handleConfirmDelete}
                            title="Are you sure?"
                            message="Do you really want to delete this service type? This action cannot be undone."
                            confirmText="Delete"
                            cancelText="Cancel"
                        />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ListServicesType;
