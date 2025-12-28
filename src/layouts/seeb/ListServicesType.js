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
    const [serviceFormData, setServiceFormData] = useState({ name: '', image: null, imagePreview: null, room_ids: [] });
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


    const handleServiceSubmit = async (e) => {
        e.preventDefault();

        if (!serviceFormData.imagePreview) {
            toast.error("Image is required.");
            return;
        }

        const data = {
            name: serviceFormData.name,
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


    // Reset form state
    const resetForm = () => {
        setServiceFormData({ name: '', image: null, imagePreview: null, room_ids: [] });
        setEditMode(false);
        setServiceIdToEdit(null);
    };

    // Handle edit mode
    const handleServiceEdit = (service) => {
        setServiceFormData({
            name: service.name,
            image: null,
            imagePreview: service.image,
            room_ids: service.room_ids?.map(String), // Convert each ID to a string
        });
        setServiceIdToEdit(service.id);
        setEditMode(true);
    };

    // Handle service subservices view
    const handleViewSubservices = (serviceId) => {
        navigate(`/subservices/${serviceId}`);
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
        // const { label, value, closable, onClose } = props;
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
                <div className="border-solid border-2 black-indigo-600 mt-6">
                    <div style={{ fontSize: 15 }} className="px-8 mt-5">
                        {editMode ? 'Edit Service' : 'Add New Service Type'}
                    </div>

                    {/* Add/Edit Service Form */}
                    <form className="" onSubmit={handleServiceSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 px-8 mt-4">
                            {/* Service Name Input */}
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 p-2.5"
                                    placeholder="Service Type Name"
                                    value={serviceFormData.name}
                                    onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Image Upload Section */}
                            <div className="flex">
                                <div className="relative w-1/2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-3 p-2.5"
                                        onChange={handleImageChange}
                                    />
                                    {serviceFormData.imagePreview && (
                                        <div className="mt-2 relative">
                                            <img
                                                src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + serviceFormData.imagePreview}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleImageDelete}
                                                className="absolute top-0 left-0 text-red-500 bg-white rounded-full p-1 shadow-md"
                                            >
                                                <RiDeleteBin6Fill color='red' size={24} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Button */}
                                {serviceFormData?.image && (
                                    <div className="flex justify-center items-center ml-4 sm:mt-0">
                                        <button
                                            type="button"
                                            onClick={handleImageUpload}
                                            className="p-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none"
                                        >
                                            Upload Image
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Multi-Select for Rooms */}
                            <div className="relative w-full">
                                <label className="block mb-1 text-sm font-medium text-gray-900">
                                    Select Rooms
                                </label>
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
                        </div>

                        {/* Submit Form */}
                        <div className='flex items-center justify-center'>
                            <button
                                type="submit"
                                className="m-6 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none"
                            >
                                {editMode ? 'Update Service' : 'Add Service'}
                            </button>
                            {editMode && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="p-2.5 ml-2 text-sm font-medium text-white bg-red-500 rounded-lg border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>


                    {/* Search Input */}
                    <form className="flex items-center mt-6 mx-4">
                        <div className="relative w-1/2 m-4">
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </form>
                    <ConfirmModal
                        show={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleConfirmDelete}
                        title="Are you sure?"
                        message="Do you really want to delete this service type? This action cannot be undone."
                        confirmText="Delete"
                        cancelText="Cancel"
                    />


                    {/* Services List */}
                    <div className="flex flex-col mt-4 mx-6">
                        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                <div className="overflow-hidden">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th className="py-3 px-4 w-12">Sr.No</th>
                                                <th className="py-3 px-6 w-1/6">Service Name</th>
                                                <th className="py-3 px-6 w-8">Image</th>
                                                <th className="py-3 px-6 w-1/3">Rooms</th>
                                                <th className="py-3 px-6 w-8">Status</th>
                                                <th className="py-3 px-6 w-8">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredServices?.length > 0 ? (
                                                filteredServices.map((service, index) => (
                                                    <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                                                        <td className="py-4 px-4 text-center">{index + 1}</td>
                                                        <td className="py-4 px-6">{service.name}</td>
                                                        <td className="py-4 px-6">
                                                            {service.image && (
                                                                <img
                                                                    src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + service.image}
                                                                    alt={service.name}
                                                                    className="w-16 h-16 object-cover rounded-full"
                                                                />
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-6 w-48 break-words whitespace-normal">
                                                            {service?.room_names?.length > 0 ? service.room_names.join(', ') : <span className="text-gray-500">No Rooms</span>}
                                                        </td>
                                                        <td className="py-4 px-6">
                                                            <Toggle
                                                                checked={service.status === "1"}
                                                                onChange={() => handleToggleStatus(service.id, service.status)}
                                                                icons={false}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-6 flex items-center">
                                                            <MdModeEdit
                                                                style={editstyle}
                                                                onClick={() => {
                                                                    handleServiceEdit(service);
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                }}
                                                            />

                                                            <RiDeleteBin6Fill
                                                                size={24}
                                                                className='ml-4'
                                                                style={deletstyle}
                                                                onClick={() => confirmServiceDelete(service.id)}
                                                            />
                                                            {/* <button
                                                                type="button"
                                                                onClick={() => handleViewSubservices(service.id)}
                                                                className="px-4 py-2 ml-4 text-sm font-medium text-white bg-blue-500 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none"
                                                            >
                                                                View Work Type
                                                            </button> */}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="py-4 text-center">No Services Available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};


export default ListServicesType;
