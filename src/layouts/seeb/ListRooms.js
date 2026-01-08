import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEdit } from 'react-icons/md';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Toaster, toast } from 'react-hot-toast';
import ConfirmModal from 'components/modal/ConfirmModal';
import { apiCall } from 'utils/apiClient';

const ListRooms = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;
    const [roomData, setRoomData] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [Loader, setLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roomFormData, setRoomFormData] = useState({ name: '', slug: '', image: null, imagePreview: null, type: '' });
    const [editMode, setEditMode] = useState(false);
    const [roomIdToEdit, setRoomIdToEdit] = useState(null);
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    const confirmServiceDelete = (id) => {
        setSelectedRoomId(id);
        setShowDeleteModal(true);
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
            setFilteredRooms(result.data);
        } catch (error) {
            setLoader(false);
            console.error('Error fetching rooms:', error);
        }
    };

    // Generate slug from room name
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
            setFilteredRooms(roomData);
        } else {
            const filtered = roomData.filter(room =>
                room.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredRooms(filtered);
        }
    };

    // Handle room name change and auto-generate slug
    const handleRoomNameChange = (e) => {
        const name = e.target.value;
        const slug = generateSlug(name);
        setRoomFormData({ ...roomFormData, name, slug });
    };

    const handleRoomDelete = async () => {
        try {
            const result = await apiCall({
                endpoint: `/rooms/delete/${selectedRoomId}`,
                method: 'DELETE',
            });
            if (result.status === 200) {
                getAllRooms();
                toast.success("Room Deleted Successfully");
            }
        } catch (error) {
            console.log('Error deleting room:', error);
        }
        setShowDeleteModal(false);
        setSelectedRoomId(null);
    };

    const handleRoomSubmit = async (e) => {
        e.preventDefault();

        if (!roomFormData.imagePreview) {
            toast.error("Image is required.");
            return;
        }

        const data = {
            name: roomFormData.name,
            slug: roomFormData.slug,
            image: roomFormData.imagePreview,
            type: roomFormData.type
        };

        const endpoint = editMode
            ? `rooms/update/${roomIdToEdit}`
            : `rooms/create`;

        const method = editMode ? 'PUT' : 'POST';

        try {
            setLoader(true);
            const result = await apiCall({
                endpoint: endpoint,
                method: method,
                data: data,
            });

            if (result.status === (editMode ? 200 : 201)) {
                getAllRooms();
                toast.success(editMode ? "Room Updated Successfully" : "Room Added Successfully");
                resetForm();
            } else {
                toast.error("Failed to submit room. Please try again.");
            }
        } catch (error) {
            console.error('Error submitting room:', error);
            toast.error("Error while processing request.");
        } finally {
            setLoader(false);
        }
    };

    // Reset form state
    const resetForm = () => {
        setRoomFormData({ name: '', slug: '', image: null, imagePreview: null, type: '' });
        setEditMode(false);
        setRoomIdToEdit(null);
    };

    // Handle edit mode
    const handleRoomEdit = (room) => {
         const slug = generateSlug(room.name);
        setRoomFormData({ name: room.name, slug: slug || '', image: null, imagePreview: room.image, type: room.type });
        setRoomIdToEdit(room.id);
        setEditMode(true);
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRoomFormData({
                ...roomFormData,
                image: file,
            });
        }
    };

    const handleImageUpload = async () => {
        if (!roomFormData.image) {
            toast.error("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('image', roomFormData.image);

        try {
            const result = await apiCall({
                endpoint: 'services-type/upload-image',
                method: 'POST',
                data: formData,
            });
            if (result.status === 200) {
                setRoomFormData({
                    ...roomFormData,
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
                data: { image_path: roomFormData.imagePreview },
            });
            if (result.status === 200) {
                setRoomFormData({ ...roomFormData, imagePreview: null, image: null });
                toast.success("Image deleted successfully!");
            } else {
                toast.error("Failed to delete image.");
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error("Error while deleting image.");
        }
        
    };

    // Load rooms data when the component mounts
    useEffect(() => {
        getAllRooms();
    }, []);

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
                            {editMode ? 'Edit Room' : 'Add New Room'}
                        </h2>

                        {/* Add/Edit Room Form */}
                        <form onSubmit={handleRoomSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Room Name Input */}
                            <div className="relative w-full">
                                <label className="block mb-1.5 text-xs font-semibold text-gray-700">Room Name</label>
                                <input
                                    type="text"
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block w-full p-2 transition duration-200"
                                    placeholder="Enter room name"
                                    value={roomFormData.name}
                                    onChange={handleRoomNameChange}
                                    required
                                />
                            </div>

                            {/* Room Slug Input */}
                            <div className="relative w-full">
                                <label className="block mb-1.5 text-xs font-semibold text-gray-700">Room Slug</label>
                                <input
                                    type="text"
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block w-full p-2 transition duration-200"
                                    placeholder="room-slug (auto-generated)"
                                    value={roomFormData.slug}
                                    onChange={(e) => setRoomFormData({ ...roomFormData, slug: e.target.value })}
                                    required
                                />
                            </div>
                            {/* Select Room Type (residential/commercial) */}
                            <div className="relative w-full">
                                <label className="block mb-1.5 text-xs font-semibold text-gray-700">Room Type</label>
                                <select
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block w-full p-2 transition duration-200"
                                    value={roomFormData.type}
                                    onChange={(e) => setRoomFormData({ ...roomFormData, type: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Select Room Type</option>
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="retail">Retail</option>
                                </select>
                            </div>

                            {/* Image Upload Section */}
                            <div className='w-full'>
                                <label className="block mb-1.5 text-xs font-semibold text-gray-700">Room Icon</label>
                                <div className="flex gap-3 items-start">
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent block w-full p-2 transition duration-200"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    {roomFormData?.image && (
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
                                {roomFormData.imagePreview && (
                                    <div className="mt-2 relative inline-block">
                                        <img
                                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + roomFormData.imagePreview}
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
                                {editMode ? 'Update Room' : 'Add Room'}
                            </button>
                            <button 
                                type="button" 
                                onClick={resetForm} 
                                className="px-5 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium text-sm rounded-lg transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                    </div>

                    {/* Display Rooms Section */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex gap-4 items-end">
                                <div className="flex items-center">
                                    <h2 className="text-sm font-semibold text-gray-800 flex items-center whitespace-nowrap">
                                        <span className="w-1 h-5 bg-indigo-500 mr-2 rounded"></span>
                                        Rooms List
                                    </h2>
                                </div>
                                {/* Search Input */}
                                <div className="relative">
                                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search by room name..."
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
                                        <th className="py-2 px-3 font-semibold text-gray-800">Type</th>
                                        <th className="py-2 px-3 font-semibold text-gray-800">Image</th>
                                        <th className="py-2 px-3 font-semibold text-gray-800 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRooms?.length > 0 ? (
                                        filteredRooms.map((room, index) => (
                                            <tr className="border-b hover:bg-gray-50 transition duration-150" key={room.id}>
                                                <td className="py-2 px-3 font-medium text-gray-900">{index + 1}</td>
                                                <td className="py-2 px-3 text-gray-700">{room.name}</td>
                                                <td className="py-2 px-3 text-gray-600 font-mono text-xs bg-gray-50 rounded px-2 inline-block">{room.slug || 'N/A'}</td>
                                                <td className="py-2 px-3">
                                                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                                                        {room.type ? room.type.charAt(0).toUpperCase() + room.type.slice(1) : 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3">
                                                    {room.image && (
                                                        <img
                                                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + room.image}
                                                            alt={room.name}
                                                            className="w-10 h-10 object-cover rounded border border-gray-200"
                                                        />
                                                    )}
                                                </td>
                                                <td className="py-2 px-3">
                                                    <div className="flex gap-2 justify-center">
                                                        <button
                                                            onClick={() => {
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                handleRoomEdit(room)
                                                            }}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded transition duration-150"
                                                            title="Edit room"
                                                        >
                                                            <MdModeEdit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => confirmServiceDelete(room.id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition duration-150"
                                                            title="Delete room"
                                                        >
                                                            <RiDeleteBin6Fill size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-6 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className="w-10 h-10 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                    <p className="text-sm">No Rooms Available</p>
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
                            onConfirm={handleRoomDelete}
                            title="Are you sure?"
                            message="Do you really want to delete this Room? This action cannot be undone."
                            confirmText="Delete"
                            cancelText="Cancel"
                        />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ListRooms;
