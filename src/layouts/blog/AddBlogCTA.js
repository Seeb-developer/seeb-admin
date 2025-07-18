import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Toaster, toast } from 'react-hot-toast';

const AddBlogCTA = () => {
    const location = useLocation();
    const blogId = location.state?.blogId;
    const navigate = useNavigate();

    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        section_link: '',
        cta_text: '', // new CTA input
    });
    const [bannerFile, setBannerFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        let bannerImageUrl = '';
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
                    bannerImageUrl = result.data?.blog_image;
                } else {
                    toast.error('Failed to upload banner image');
                    setIsSubmitting(false);
                    return;
                }
            } catch {
                toast.error('Error uploading banner image');
                setIsSubmitting(false);
                return;
            }
        }


        const payload = {
            blog_id: blogId,
            title: blogData.title,
            description: blogData.description,
            section_link: "NA",
            cta_text: blogData.cta_text, // include CTA here
            banner_image: bannerImageUrl,
            sub_sections: JSON.stringify([]),
        };

        try {
            const res = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/blog-section`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await res.json();
            if (result.status === 201) {
                toast.success('Section added');
                setBlogData({ title: '', description: '', section_link: '', cta_text: '' });
                setBannerFile(null);
                setSubSections([{ title: '', description: '', images: [] }]);
            }
        } catch {
            toast.error('Failed to add section');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Toaster position="top-center" />
            <div className="w-full bg-white rounded-xl shadow-md p-8 mt-8">
                <div className="flex items-center mb-8">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-3 py-1 rounded mr-4"
                    >
                        ← Back
                    </button>
                    <h2 className="text-3xl font-semibold text-gray-800">Add Blog CTA</h2>
                </div>

                <form className="space-y-10" onSubmit={handleSubmit}>
                    {/* Optional Form Inputs (Uncomment when needed) */}
                    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* <input
        type="text"
        placeholder="Title"
        required
        className="text-sm border rounded px-4 py-2"
        value={blogData.title}
        onChange={e => setBlogData({ ...blogData, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Section Link"
        required
        className="text-sm border rounded px-4 py-2"
        value={blogData.section_link}
        onChange={e => setBlogData({ ...blogData, section_link: e.target.value })}
      />
      <textarea
        placeholder="Description"
        rows={3}
        className="text-sm border rounded px-4 py-2 col-span-2 resize-none"
        value={blogData.description}
        onChange={e => setBlogData({ ...blogData, description: e.target.value })}
      /> */}
      <input
        type="text"
        placeholder="CTA Button Text"
        className="text-sm border rounded px-4 py-2 col-span-2"
        value={blogData.cta_text}
        onChange={e => setBlogData({ ...blogData, cta_text: e.target.value })}
      />
    </div>
   

                    {/* Banner Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload CTA Image</label>
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setBannerFile(e.target.files[0])}
                                className="text-sm border rounded px-4 py-2 w-full md:w-auto cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 hover:file:bg-gray-200"
                            />

                            {bannerFile && (
                                <div className="relative group">
                                    <img
                                        src={URL.createObjectURL(bannerFile)}
                                        alt="Preview"
                                        className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setBannerFile(null)}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-1 hover:bg-red-700"
                                        title="Remove"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-700 text-white text-base px-6 py-2 rounded-md shadow-sm transition"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>

        </DashboardLayout>
    );
};

export default AddBlogCTA;
