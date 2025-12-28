import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEdit } from 'react-icons/md';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Toaster, toast } from 'react-hot-toast';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { apiCall } from 'utils/apiClient';

const GuideImages = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;
    const deletestyle = { color: "red", cursor: "pointer" };
    const editstyle = { color: "green", cursor: "pointer" };

    const [guideImages, setGuideImages] = useState([]);
    const [formData, setFormData] = useState({ title: '', image: null, imagePreview: null, service_type_id: '', room_id: '' });
    const [editMode, setEditMode] = useState(false);
    const [imageIdToEdit, setImageIdToEdit] = useState(null);
    const [Loader, setLoader] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        getAllGuideImages();
        getAllRooms();
        getAllServicesType();
    }, []);

    const getAllGuideImages = async () => {
        setLoader(true);
        try {
            const result = await apiCall({ endpoint: "guide-images", method: "GET" });
            setLoader(false);
            if (result && result.status === 200) {
                setGuideImages(result.data);
            }
        } catch (error) {
            setLoader(false);
            console.error('Error fetching guide images:', error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.service_type_id || !formData.room_id) {
            toast.error("All fields are required.");
            return;
        }

        let imageUrl = formData.imagePreview; // Use existing image if editing

        // Upload image if a new one is selected
        if (formData.image) {
            const uploadFormData = new FormData();
            uploadFormData.append("image", formData.image);

            try {
                const uploadResult = await apiCall({ endpoint: "guide-images/upload-image", method: "POST", data: uploadFormData });
                if (uploadResult && uploadResult.status === 200) {
                    imageUrl = uploadResult.image_url; // Assign uploaded image path
                } else {
                    toast.error("Image upload failed.");
                    return;
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Error while uploading image.");
                return;
            }
        }

        const data = {
            title: formData.title,
            image_url: imageUrl, // Use uploaded image URL
            service_type_id: formData.service_type_id,
            room_id: formData.room_id
        };

        const endpoint = editMode
            ? `guide-images/update/${imageIdToEdit}`
            : `guide-images/create`;

        const method = editMode ? "PUT" : "POST";

        try {
            setLoader(true);
            const result = await apiCall({ endpoint, method, data });
            if (result && result.status === (editMode ? 200 : 201)) {
                getAllGuideImages();
                toast.success(editMode ? "Guide Image Updated Successfully" : "Guide Image Added Successfully");
                resetForm();
            } else {
                toast.error("Failed to submit guide image. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting guide image:", error);
            toast.error("Error while processing request.");
        } finally {
            setLoader(false);
        }
    };


    const resetForm = () => {
        setFormData({ title: '', image: null, imagePreview: null, service_type_id: '', room_id: '' });
        setEditMode(false);
        setImageIdToEdit(null);
    };

    const handleEdit = (image) => {
        setFormData({ title: image.title, image: null, imagePreview: image.image_url, service_type_id: image.service_type_id, room_id: image.room_id });
        setImageIdToEdit(image.id);
        setEditMode(true);
    };

    const handleDelete = async (id) => {
        try {
            const result = await apiCall({ endpoint: `guide-images/${id}`, method: 'DELETE' });
            if (result && result.status === 200) {
                getAllGuideImages();
                toast.success("Guide Image Deleted Successfully");
            }
        } catch (error) {
            console.error('Error deleting guide image:', error);
            toast.error("Error while deleting image.");
        }
    };
    const getAllRooms = async () => {
        setLoader(true);
        try {
            const result = await apiCall({ endpoint: "rooms", method: "GET" });
            setLoader(false);
            if (result && result.status === 200) {
                setRooms(result.data);
            }
        } catch (error) {
            setLoader(false);
            console.error('Error fetching rooms:', error);
        }
    };

    const getAllServicesType = async () => {
        // setLoading(true);
        try {
            const result = await apiCall({ endpoint: "services-type", method: 'GET' });
            if (result && result.data) {
                setServices(result.data);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        }
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
                <div className="border-solid border-2 black-indigo-600 mt-6 p-6 rounded-lg shadow-lg bg-white">
                    <h2 className="text-lg font-semibold text-gray-800">{editMode ? 'Edit Guide Image' : 'Add New Guide Image'}</h2>

                    <form className="mt-4" onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="relative w-full">
                                <label className="block text-sm font-medium text-gray-900">Title</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    placeholder="Enter Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="relative w-full">
                                <label className="block text-sm font-medium text-gray-900">Service Type</label>
                                <select
                                    className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    value={formData.service_type_id}
                                    onChange={(e) => setFormData({ ...formData, service_type_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Service</option>
                                    {services.map(service => (
                                        <option key={service.id} value={service.id}>{service.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative w-full">
                                <label className="block text-sm font-medium text-gray-900">Room</label>
                                <select
                                    className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    value={formData.room_id}
                                    onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Room</option>
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="relative w-full">
                                <label className="block text-sm font-medium text-gray-900">Upload Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                />
                                {formData.imagePreview && (
                                    <div className="mt-2">
                                        <img src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + formData.imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-lg mr-4">
                                {editMode ? 'Update Guide Image' : 'Add Guide Image'}
                            </button>
                            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-400 text-white rounded-lg">
                                Cancel
                            </button>
                        </div>
                    </form>

                    <div className="overflow-x-auto relative mt-6">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 w-1/6">Sr. No</th>
                                    <th className="py-3 px-6 w-1/4">Title</th>
                                    <th className="py-3 px-6 w-1/6">Service Type ID</th>
                                    <th className="py-3 px-6 w-1/6">Room ID</th>
                                    <th className="py-3 px-6 w-1/6">Image</th>
                                    <th className="py-3 px-6 w-1/8">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guideImages.length > 0 ? (
                                    guideImages.map((image, index) => (
                                        <tr className="bg-white border-b hover:bg-gray-50" key={image.id}>
                                            <td className="py-4 px-4">{index + 1}</td>
                                            <td className="py-4 px-6">{image.title}</td>
                                            <td className="py-4 px-6">{image.service_type_id}</td>
                                            <td className="py-4 px-6">{image.room_id}</td>
                                            <td className="py-4 px-4">
                                                {image.image_url && (
                                                    <img
                                                        src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + image.image_url}
                                                        alt="Guide"
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                )}
                                            </td>
                                            <td className="py-4 px-6 flex items-center">
                                                <MdModeEdit
                                                    size={24}
                                                    style={editstyle}
                                                    onClick={() => handleEdit(image)}
                                                />
                                                <RiDeleteBin6Fill
                                                    size={24}
                                                    className="ml-4"
                                                    style={deletestyle}
                                                    onClick={() => handleDelete(image.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center">No Guide Images Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
        </DashboardLayout>
    );
};

export default GuideImages;
