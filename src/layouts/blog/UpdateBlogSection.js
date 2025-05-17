import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Toaster, toast } from 'react-hot-toast';

const UpdateBlogSection = () => {
    const { id } = useParams(); // Get the section ID from the URL
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        banner_image: '',
        section_link: '',
    });
    const [prevBannerImage, setPrevBannerImage] = useState(''); // Track the previous banner image
    const [bannerFile, setBannerFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch the section data on component mount
    useEffect(() => {
        fetchSectionData();
    }, []);

    const fetchSectionData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/blog-section/${id}`);
            const result = await response.json();

            if (result.status === 200) {
                setBlogData({
                    blog_id : result.data.blog_id,
                    title: result.data.title,
                    description: result.data.description,
                    banner_image: result.data.banner_image,
                    section_link: result.data.section_link,
                });
                setPrevBannerImage(result.data.banner_image);
            } else {
                toast.error('Error fetching section data');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch section data');
        }
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title: blogData.title,
            description: blogData.description,
            banner_image: blogData.banner_image,
            section_link: blogData.section_link,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/blog-section/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json();

            if (result.status === 200) {
                toast.success('Section updated successfully');
                navigate(`/AddBlogSection/${blogData.blog_id}`); 
            } else {
                toast.error('Failed to update section');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error updating section');
        }
    };

    const handleUploadFile = async () => {
        if (!bannerFile) {
            toast.error('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('blog_image', bannerFile);

        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/createBlogImage`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (result.status === 200) {
                // Delete the previous image if it exists
                if (prevBannerImage) {
                    const requestOptions = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ blog_image: prevBannerImage }), // Include the file path for deletion
                    };

                    const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "blog/deleteBlogImage", requestOptions);
                }

                setBlogData({ ...blogData, banner_image: result?.data?.blog_image });
                setPrevBannerImage(result?.data?.blog_image); // Update the tracked image
                toast.success('Banner uploaded successfully');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to upload banner');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" />
            <div className="border-solid border-2 black-indigo-600 mt-6">
                <div style={{ fontSize: 15 }} className="px-8 mt-5 font-bold">
                    Update Blog Section
                </div>

                <div className="mt-6">
                    <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleOnSubmit}>
                        <div className="px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Title</label>
                            <input
                                required
                                value={blogData.title}
                                onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                                className="appearance-none block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                type="text"
                                placeholder="Blog Section Title"
                            />
                        </div>
                        <div className="px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Description</label>
                            <textarea
                                required
                                value={blogData.description}
                                onChange={(e) => setBlogData({ ...blogData, description: e.target.value })}
                                className="appearance-none block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                rows="4"
                                placeholder="Blog Section Description"
                            ></textarea>
                        </div>
                        <div className="px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Section Link</label>
                            <input
                                required
                                value={blogData.section_link}
                                onChange={(e) => setBlogData({ ...blogData, section_link: e.target.value })}
                                className="appearance-none block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                type="text"
                                placeholder="Section Link"
                            />
                        </div>
                        <div className="px-4">
                            <label className="text-gray-700 text-xs font-bold mb-2">Banner Section Image</label>
                            <div className="flex items-center">
                                <input
                                    onChange={(e) => setBannerFile(e.target.files[0])}
                                    className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                                    type="file"
                                />
                                <button
                                    type="button"
                                    className="ml-2 py-1 px-5 bg-black text-white rounded"
                                    onClick={handleUploadFile}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </div>
                        {blogData.banner_image && (
                            <div className="px-4 mt-2">
                                <label className="text-gray-700 text-xs font-bold mb-2">Current Banner Image</label>
                                <img
                                    src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${blogData.banner_image}`}
                                    alt="Current Banner"
                                    style={{ height: '20em' }}
                                    className="mt-2 w-full h-auto border rounded"
                                />
                            </div>
                        )}
                        <div className="px-4 col-span-2  flex justify-between">
                            <button
                                type="button"
                                className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => navigate('/ListBlog')}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Update Section
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UpdateBlogSection;
