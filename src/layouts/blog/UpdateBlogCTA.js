import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Toaster, toast } from 'react-hot-toast';

const UpdateBlogCTA = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        section_link: '',
        cta_text: '', // new CTA input
    });
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerImageUrl, setBannerImageUrl] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchSectionData();
        // eslint-disable-next-line
    }, []);

    const fetchSectionData = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/blog-section/${id}`);
            const result = await response.json();
            if (result.status === 200) {
                setBlogData({
                    title: result.data.title,
                    description: result.data.description,
                    section_link: result.data.section_link,
                    cta_text: result.data.cta_text || '', // new CTA input
                });
                setBannerImageUrl(result.data.banner_image || '');
                // Parse sub_sections and handle images as string or array
            } else {
                toast.error('Error fetching section data');
            }
        } catch (error) {
            toast.error('Failed to fetch section data');
        }
    };


    // Submit handler
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 1. Upload banner image if a new file is selected
        let bannerImageUrlToSend = bannerImageUrl;
        if (bannerFile) {
            const formData = new FormData();
            formData.append('blog_image', bannerFile);
            try {
                const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/createBlogImage`, {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                if (result.status === 200) {
                    bannerImageUrlToSend = result.data.blog_image;
                } else {
                    toast.error('Failed to upload banner');
                    setIsSubmitting(false);
                    return;
                }
            } catch {
                toast.error('Failed to upload banner');
                setIsSubmitting(false);
                return;
            }
        }

        // 2. Upload subsection images if any


        const payload = {
            title: blogData.title,
            description: blogData.description,
            section_link: blogData.section_link,
            banner_image: bannerImageUrlToSend,
            cta_text: blogData.cta_text, // include CTA here
            sub_sections: JSON.stringify([]),
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
                fetchSectionData();
            } else {
                toast.error('Failed to update section');
            }
        } catch (error) {
            toast.error('Error updating section');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" />
            <div className="w-full bg-white rounded shadow p-8 mt-8">
                <div className="flex items-center mb-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mr-4"
                    >
                        ← Back
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Update Blog CTA Section</h2>
                </div>
                <form className="space-y-6" onSubmit={handleOnSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="Title"
                            required
                            className="flex-1 text-sm border rounded px-2 py-2"
                            value={blogData.title}
                            onChange={e => setBlogData({ ...blogData, title: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Section Link"
                            required
                            className="flex-1 text-sm border rounded px-2 py-2"
                            value={blogData.section_link}
                            onChange={e => setBlogData({ ...blogData, section_link: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            rows={3}
                            className="border px-4 py-2 text-sm rounded col-span-2"
                            value={blogData.description}
                            onChange={e => setBlogData({ ...blogData, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="CTA Button Text"
                            className="border px-4 py-2 text-sm rounded col-span-2"
                            value={blogData.cta_text}
                            onChange={e => setBlogData({ ...blogData, cta_text: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-start">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async e => {
                                const file = e.target.files[0];
                                if (!file) return;
                                // If previous banner image exists on server, delete it
                                if (bannerImageUrl) {
                                    await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/deleteBlogImage`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ blog_image: bannerImageUrl }),
                                    });
                                }
                                setBannerFile(file);
                                setBannerImageUrl(''); // Remove preview until upload
                            }}
                            className="text-sm border rounded px-4 py-2"
                        />
                        {bannerImageUrl && (
                            <div className="relative group">
                                <img
                                    src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${bannerImageUrl}`}
                                    alt="Banner Preview"
                                    className="w-20 h-20 object-cover rounded border"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded text-lg" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update Section'}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default UpdateBlogCTA;
