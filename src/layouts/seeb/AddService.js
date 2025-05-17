import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { Toaster, toast } from 'react-hot-toast';
import { Select, Tag } from 'antd';
import Addon from './component/Addon';

const AddService = () => {
    const location = useLocation();
    const serviceId = location.state?.id || null;

    const [formData, setFormData] = useState({
        name: '',
        service_type_id: '',
        rate: '',
        rate_type: '',
        description: '',
        materials: '',
        features: '',
        care_instructions: '',
        warranty_details: '',
        quality_promise: '',
        status: 'active',
        images: [],
        imagePreviews: [],
        room_ids: [],
        addons: []
    });
    const [loading, setLoading] = useState(false);
    const [serviceTypeData, setServiceTypeData] = useState([])
    const [rooms, setRooms] = useState([])
    const [addons, setAddons] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name == "service_type_id") {
            getServiesRooms(e.target.value)
        }
    };

    // const handleImageChange = (e) => {
    //     const files = Array.from(e.target.files);
    //     const validImages = [];

    //     files.forEach((file) => {
    //         const img = new Image();
    //         img.src = URL.createObjectURL(file);

    //         img.onload = () => {
    //             if (img.width === 770 && img.height === 770) {
    //                 setFormData((prevData) => ({
    //                     ...prevData,
    //                     images: [...prevData.images, ...validImages], // Append only valid images
    //                 }));
    //                 validImages.push(file);
    //             } else {
    //                 toast.error("Image must be exactly 1000x1000 pixels.");
    //             }
    //         };
    //     });
    // };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setFormData((prevData) => ({
            ...prevData,
            images: [...prevData.images, ...files],
        }));
    };



    const handleImageUpload = async () => {
        if (!formData.images || formData.images.length === 0) {
            toast.error("Please select images to upload.");
            return;
        }

        const formBody = new FormData();
        for (let i = 0; i < formData.images.length; i++) {
            formBody.append('images[]', formData.images[i]); // Append multiple images
        }

        try {
            const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + 'services/upload-image', {
                method: 'POST',
                body: formBody,
            });

            const result = await response.json();
            if (result.status === 200) {
                setFormData((prevData) => ({
                    ...prevData,
                    imagePreviews: [...(prevData.imagePreviews || []), ...result.image_urls], // Ensure array exists
                }));
                toast.success("Images uploaded successfully!");
            } else {
                toast.error("Image upload failed. Please try again.");
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error("Error while uploading images.");
        }
    };


    // Handle image deletion
    const handleImageDelete = async (index) => {
        try {
            const imageToDelete = formData.imagePreviews[index];

            const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + 'services/delete-image', {
                method: 'POST',
                body: JSON.stringify({ image_path: imageToDelete }), // Send image path to backend
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();
            if (result.status === 200) {
                setFormData((prevData) => {
                    const newImages = prevData.images.filter((_, i) => i !== index);
                    const newPreviews = prevData.imagePreviews.filter((_, i) => i !== index);
                    return { ...prevData, images: newImages, imagePreviews: newPreviews };
                });

                toast.success("Image deleted successfully!");
            } else if (result.status === 404) {
                setFormData((prevData) => {
                    const newImages = prevData.images.filter((_, i) => i !== index);
                    const newPreviews = prevData.imagePreviews.filter((_, i) => i !== index);
                    return { ...prevData, images: newImages, imagePreviews: newPreviews };
                });

                toast.success("Image deleted successfully!");
            } else {
                toast.error("Failed to delete image.");
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error("Error while deleting image.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateFormData(formData, addons)) return;

        setLoading(true);

        const raw = {
            name: formData.name,
            service_type_id: formData.service_type_id,
            rate: formData.rate,
            rate_type: formData.rate_type,
            description: formData.description,
            materials: formData.materials,
            features: formData.features,
            care_instructions: formData.care_instructions,
            warranty_details: formData.warranty_details,
            quality_promise: formData.quality_promise,
            status: formData.status,
            image: JSON.stringify(formData.imagePreviews),
            room_ids: formData.room_ids,
            addons: addons.map((addon) => ({
                id: addon?.id,
                group_name: addon.group_name,
                name: addon.name,
                price_type: addon.price_type,
                qty: addon.qty,
                price: addon.price,
                is_required: addon.is_required,
                description: addon.description
            }))
        };
        console.log(raw)

        const requestOptions = {
            method: serviceId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(raw),
            redirect: "follow"
        };

        try {
            const response = await fetch(
                process.env.REACT_APP_HAPS_MAIN_BASE_URL + `services/${serviceId ? `update/${serviceId}` : 'create'}`,
                requestOptions
            );
            const result = await response.json();
            if (result.status === (serviceId ? 200 : 201)) {
                toast.success(`Service ${serviceId ? "Updated" : "Added"} Successfully`);
                navigate('/services');
            }
        } catch (error) {
            console.error(`Error ${serviceId ? "updating" : "adding"} service:`, error);
            toast.error(`Failed to ${serviceId ? "update" : "add"} service`);
        }
        setLoading(false);
    };


    const validateFormData = (formData, addons) => {
        const requiredFields = [
            'name',
            'service_type_id',
            'rate',
            'rate_type',
            'description',
            'materials',
            'features',
            'care_instructions',
            'warranty_details',
            'quality_promise',
            'status',
        ];

        for (const field of requiredFields) {
            if (!formData[field] || formData[field].toString().trim() === '') {
                toast.error(`"${field.replace(/_/g, ' ')}" is required`);
                return false;
            }
        }

        if (!formData.room_ids || formData.room_ids.length === 0) {
            toast.error('At least one room must be selected');
            return false;
        }

        if (addons.length > 1) {
            for (let i = 0; i < addons.length; i++) {
                const addon = addons[i];
                const addonFields = ['group_name', 'name', 'price_type', 'qty', 'price', 'description'];
                for (const field of addonFields) {
                    if (!addon[field] || addon[field].toString().trim() === '') {
                        toast.error(`Addon ${i + 1}: "${field.replace(/_/g, ' ')}" is required`);
                        return false;
                    }
                }
            }
        }

        return true;
    };

    const getAllServicesType = async () => {
        setLoading(true);
        const requestOptions = { method: 'GET', redirect: 'follow' };
        await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "services-type", requestOptions)
            .then(response => response.json())
            .then(result => {
                setServiceTypeData(result.data);
                // getServiesRooms(result?.data?.service_type_id)

            })
            .catch(error => {
                console.error('Error fetching services:', error);
            })
            .finally(() =>
                setLoading(false)
            )
    };
    const getServiesRooms = async (id) => {

        setLoading(true);
        const requestOptions = { method: 'GET', redirect: 'follow' };
        await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `services-type/${id}/rooms`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setRooms(result.data);
            })
            .catch(error => {
                console.error('Error fetching service types:', error);
            })
            .finally(() =>
                setLoading(false)
            )
    };

    const fetchServiceDetails = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `services/${id}`);
            const result = await response.json();

            if (result.status === 200) {
                const images = result.data.image ? JSON.parse(result.data.image) : []; // Parse JSON string
                setFormData({
                    ...result.data,
                    imagePreviews: images,
                    images: []
                });
                setAddons(result?.data?.addons || []);

                getServiesRooms(result?.data?.service_type_id);
            }
        } catch (error) {
            console.error('Error fetching service details:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getAllServicesType();
        if (serviceId) {
            fetchServiceDetails(serviceId);
        }
    }, [serviceId]);


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
            <div className="border-solid border-2 black-indigo-600 mt-6">
                <div className="px-8 mt-5 font-bold">
                    {serviceId ? "Update Service" : "Add New Service"}
                </div>
                <div className="mt-6">
                    <form className="w-full" onSubmit={handleSubmit}>
                        {/* Name & Service ID */}
                        <div className="flex">
                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    required
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                    placeholder="Service Name"
                                />
                            </div>
                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">Service Type</label>
                                <select
                                    name="service_type_id"
                                    value={formData.service_type_id} // Ensure the selected value is tracked in state
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                >
                                    <option value="" disabled>Select option</option> {/* Keeps the default option inactive */}
                                    {serviceTypeData.map((el, i) => (
                                        <option key={el.id} value={el.id}>{el.name}</option> // Assigning a key and removing fragment
                                    ))}
                                </select>
                            </div>

                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">
                                    Select Rooms
                                </label>
                                <Select
                                    mode="multiple"
                                    tagRender={tagRender}
                                    value={formData.room_ids?.map(String)}
                                    style={{ width: "100%" }}
                                    placeholder="Select rooms"
                                    onChange={(selectedValues) => {
                                        setFormData({ ...formData, room_ids: selectedValues });
                                    }}
                                >
                                    {rooms?.map((room) => (
                                        <Select.Option key={room.id} value={room.id}>
                                            {room.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                        </div>

                        {/* Rate & Rate Type */}
                        <div className="flex">
                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">Rate</label>
                                <input
                                    type="number"
                                    name="rate"
                                    value={formData.rate}
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                    placeholder="Rate"
                                />
                            </div>
                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">Rate Type</label>
                                <select
                                    name="rate_type"
                                    value={formData.rate_type}
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                >
                                    <option value="" disabled>Select option</option>
                                    <option value="unit">Unit</option>
                                    <option value="square_feet">Square Feet</option>
                                    <option value="running_feet">Running Feet</option>
                                    <option value="running_meter">Running Meter</option>
                                    <option value="points">Points</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex">
                            {/* Description */}
                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                    placeholder="Enter Description"
                                />
                            </div>
                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">Materials</label>
                                <textarea
                                    name="materials"
                                    value={formData.materials}
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                    placeholder="Materials Used"
                                />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">Features</label>
                                <textarea
                                    name="features"
                                    value={formData.features}
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                    placeholder="Key Features"
                                />
                            </div>
                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">Care Instructions</label>
                                <textarea
                                    name="care_instructions"
                                    value={formData.care_instructions}
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                    placeholder="Care Instructions"
                                />
                            </div>
                        </div>
                        {/* Care Instructions & Warranty Details */}
                        <div className="flex">
                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">Warranty Details</label>
                                <textarea
                                    name="warranty_details"
                                    value={formData.warranty_details}
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                    placeholder="Warranty Details"
                                />
                            </div>
                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">Quality Promise</label>
                                <textarea
                                    name="quality_promise"
                                    value={formData.quality_promise}
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                    placeholder="Quality Assurance"
                                />
                            </div>
                        </div>
                        {/* Quality Promise & Status */}
                        <div className="flex">
                            <div className="w-full px-4">
                                <label className="text-gray-700 text-xs font-bold mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="w-full px-4">
                                <div className="flex">
                                    <div className='w-full'>
                                        <label className="text-gray-700 text-xs font-bold mb-2">Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple  // Allow multiple image selection
                                            className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    {formData?.images && (
                                        <div className="w-full m-8">
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
                                {formData?.imagePreviews?.length > 0 && (
                                    <div className="grid grid-cols-3 gap-3 mt-2">
                                        {formData?.imagePreviews?.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + preview}
                                                    alt="Preview"
                                                    className="w-full h-32 object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleImageDelete(index)}
                                                    className="absolute top-2 left-2 text-red-500 bg-white rounded-full p-1 shadow-md  transition"
                                                >
                                                    <RiDeleteBin6Fill color="red" size={24} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <Addon addons={addons} setAddons={setAddons} />

                        {/* Submit Button */}
                        <div className="flex justify-center m-6 px-4">
                            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
                                disabled={loading}>
                                {loading ? "Processing..." : serviceId ? "Update" : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </DashboardLayout>
    );
};

export default AddService;
