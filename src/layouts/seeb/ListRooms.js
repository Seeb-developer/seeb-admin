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
    const deletstyle = { color: "red" };
    const editstyle = { color: "green" };

    const [roomData, setRoomData] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [Loader, setLoader] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roomFormData, setRoomFormData] = useState({ name: '', image: null, imagePreview: null, type: '' });
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
        setRoomFormData({ name: '', image: null, imagePreview: null, type: '' });
        setEditMode(false);
        setRoomIdToEdit(null);
    };

    // Handle edit mode
    const handleRoomEdit = (room) => {
        setRoomFormData({ name: room.name, image: null, imagePreview: room.image, type: room.type });
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
                <div className="border-solid border-2 black-indigo-600 mt-6">
                    <div style={{ fontSize: 15 }} className="px-8 mt-5">
                        {editMode ? 'Edit Room' : 'Add New Room'}
                    </div>

                    {/* Add/Edit Room Form */}
                    <form className="" onSubmit={handleRoomSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-8 mt-4">
                            {/* Room Name Input */}
                            <div className="relative w-full">
                                <label className="block mb-1 text-sm font-medium text-gray-900">Room Name</label>
                                <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 p-2.5"
                                    placeholder="Room Name"
                                    value={roomFormData.name}
                                    onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
                                    required
                                />
                            </div>
                            {/* Select Room Type (residential/commercial) */}
                            <div className="relative w-full">
                                <label className="block mb-1 text-sm font-medium text-gray-900">Room Type</label>
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 p-2.5"
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
                            <div className='flex relative w-full'>
                                <div className="relative w-1/2">
                                    <label className="block mb-1 text-sm font-medium text-gray-900">Room Icon</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-3 p-2.5"
                                        onChange={handleImageChange}
                                    />
                                    {roomFormData.imagePreview && (
                                        <div className="mt-2 relative">
                                            <img
                                                src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + roomFormData.imagePreview}
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
                                {roomFormData?.image && (
                                    <div className="flex justify-center items-center ml-4 sm:mt-0">
                                        <button
                                            type="button"
                                            onClick={handleImageUpload}
                                            className="py-2 px-3 text-center bg-indigo-500 text-white rounded-lg"
                                        >
                                            Upload Image
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Submit/Cancel Buttons */}
                        </div>
                        <div className="flex justify-center mt-6">
                            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-lg mr-4">
                                {editMode ? 'Update Room' : 'Add Room'}
                            </button>
                            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-400 text-white rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </form>

                    {/* Display Rooms */}
                    <div className="overflow-x-auto relative mt-6 mx-6">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 w-1/4">Sr. No</th>
                                    <th className="py-3 px-6 w-1/4">Name</th>
                                    <th className="py-3 px-6 w-1/6">Type</th>
                                    <th className="py-3 px-6 w-1/6">Image</th>
                                    <th className="py-3 px-6 w-1/8">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRooms?.length > 0 ? (
                                    filteredRooms.map((room, index) => (
                                        <tr className="bg-white border-b hover:bg-gray-50" key={room.id}>
                                            <td className="py-4 px-4">{index + 1}</td>
                                            <td className="py-4 px-6">{room.name}</td>
                                            <td className="py-4 px-6">{room.type ? room.type.charAt(0).toUpperCase() + room.type.slice(1) : 'N/A'}</td>
                                            <td className="py-4 px-4">
                                                {room.image && (
                                                    <img
                                                        src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + room.image}
                                                        alt={room.name}
                                                        className="w-16 h-16 object-cover rounded-full"
                                                    />
                                                )}
                                            </td>
                                            <td className="py-4 px-6 flex items-center">
                                                <MdModeEdit
                                                    size={24}
                                                    style={editstyle}
                                                    onClick={() => {
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        handleRoomEdit(room)
                                                    }}
                                                />
                                                <RiDeleteBin6Fill
                                                    size={24}
                                                    className='ml-4'
                                                    style={deletstyle}
                                                    onClick={() => confirmServiceDelete(room.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center">No Rooms Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
