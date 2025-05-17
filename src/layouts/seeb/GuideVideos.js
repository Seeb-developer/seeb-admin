import React, { useEffect, useState } from 'react';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { MdModeEdit } from 'react-icons/md';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Toaster, toast } from 'react-hot-toast';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

const GuideVideos = () => {
    const antIcon = <LoadingOutlined style={{ fontSize: 60 }} spin />;
    const deletestyle = { color: "red", cursor: "pointer" };
    const editstyle = { color: "green", cursor: "pointer" };

    const [guideVideos, setGuideVideos] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '', service_type_id: '', room_id: '', videoLink: '' });
    const [editMode, setEditMode] = useState(false);
    const [videoIdToEdit, setVideoIdToEdit] = useState(null);
    const [Loader, setLoader] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        getAllGuideVideos();
        getAllRooms();
        getAllServicesType();
    }, []);

    const getAllGuideVideos = async () => {
        setLoader(true);
        try {
            const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "guide-videos");
            const result = await response.json();
            setLoader(false);
            if (result.status === 200) {
                setGuideVideos(result.data);
            }
        } catch (error) {
            setLoader(false);
            console.error('Error fetching guide videos:', error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!formData.videoPreview && !formData.videoLink) {
            toast.error("Video file or link is required.");
            return;
        }

        const data = {
            title: formData.title,
            description: formData.description,
            video_link: formData.videoLink,
            service_type_id: formData.service_type_id,
            room_id: formData.room_id
        };

        const url = editMode
            ? `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}guide-videos/update/${videoIdToEdit}`
            : `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}guide-videos/create`;

        const method = editMode ? 'PUT' : 'POST';

        try {
            setLoader(true);
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (result.status === (editMode ? 200 : 201)) {
                getAllGuideVideos();
                toast.success(editMode ? "Guide Video Updated Successfully" : "Guide Video Added Successfully");
                resetForm();
            } else {
                toast.error("Failed to submit guide video. Please try again.");
            }
        } catch (error) {
            console.error('Error submitting guide video:', error);
            toast.error("Error while processing request.");
        } finally {
            setLoader(false);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', service_type_id: '', room_id: '', videoLink: '' });
        setEditMode(false);
        setVideoIdToEdit(null);
    };

    const handleEdit = (video) => {
        setFormData({
            title: video.title,
            description: video.description,
            service_type_id: video.service_type_id,
            room_id: video.room_id,
            videoLink: video.video_url.startsWith('http') ? video.video_link : '',
        });
        setVideoIdToEdit(video.id);
        setEditMode(true);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}guide-videos/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.status === 200) {
                getAllGuideVideos();
                toast.success("Guide Video Deleted Successfully");
            }
        } catch (error) {
            console.error('Error deleting guide video:', error);
            toast.error("Error while deleting video.");
        }
    };

    const getAllRooms = async () => {
        setLoader(true);
        try {
            const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "rooms");
            const result = await response.json();
            setLoader(false);
            if (result.status === 200) {
                setRooms(result.data);
            }
        } catch (error) {
            setLoader(false);
            console.error('Error fetching rooms:', error);
        }
    };

    const getAllServicesType = async () => {
        // setLoading(true);
        const requestOptions = { method: 'GET', redirect: 'follow' };
        await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "services-type", requestOptions)
            .then(response => response.json())
            .then(result => {
                setServices(result.data);
            })
            .catch(error => {
                console.error('Error fetching services:', error);
            })

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
                    <h2 className="text-lg font-semibold text-gray-800">{editMode ? 'Edit Guide Video' : 'Add New Guide Video'}</h2>

                    <form className="mt-4" onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="relative w-full">
                                <label className="block text-sm font-medium text-gray-900">Title</label>
                                <input type="text" className="border border-gray-300 text-sm rounded-lg w-full p-2.5" placeholder="Enter Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>

                            <div className="relative w-full">
                                <label className="block text-sm font-medium text-gray-900">Description</label>
                                <textarea className="border border-gray-300 text-sm rounded-lg w-full p-2.5" placeholder="Enter Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
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
                                <label className="block text-sm font-medium text-gray-900">Video Link</label>
                                <input type="text" className="border border-gray-300 text-sm rounded-lg w-full p-2.5" placeholder="Paste video link" value={formData.videoLink} onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-lg mr-4">{editMode ? 'Update Guide Video' : 'Add Guide Video'}</button>
                            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Cancel</button>
                        </div>
                    </form>

                    <div className="overflow-x-auto relative mt-6">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 w-1/6">Sr. No</th>
                                    <th className="py-3 px-6 w-1/4">Title</th>
                                    <th className="py-3 px-6 w-1/4">Description</th>
                                    <th className="py-3 px-6 w-1/6">Video</th>
                                    <th className="py-3 px-6 w-1/8">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guideVideos.length > 0 ? guideVideos.map((video, index) => (
                                    <tr key={video.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="py-4 px-4">{index + 1}</td>
                                        <td className="py-4 px-6">{video.title}</td>
                                        <td className="py-4 px-6">{video.description}</td>
                                        <td className="py-4 px-6">
                                            <a href={video.video_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {video.video_link}
                                            </a>
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
                                )) : <tr><td colSpan="5" className="py-4 text-center">No Guide Videos Available</td></tr>}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
        </DashboardLayout>
    );
};

export default GuideVideos;
