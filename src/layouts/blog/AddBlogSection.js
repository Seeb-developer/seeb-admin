import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Toaster, toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { apiCall } from 'utils/apiClient';

const AddBlogSection = () => {
  const location = useLocation();
  const blogId = location.state?.blogId;
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState({
    title: '',
    description: '',
    section_link: '',
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [subSections, setSubSections] = useState([
    { title: '', description: '', images: [] }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image'
  ];

  const handleSubSectionChange = (e, idx, field, value) => {
    e.preventDefault();
    const updated = [...subSections];
    updated[idx][field] = value;
    setSubSections(updated);
  };

  const handleSubSectionImageChange = (e, idx, files) => {
    e.preventDefault();
    const updated = [...subSections];
    updated[idx].images = [...(updated[idx].images || []), ...Array.from(files)];
    setSubSections(updated);
  };

  const removeSubImage = (idx, imgIdx) => {
    const updated = [...subSections];
    updated[idx].images.splice(imgIdx, 1);
    setSubSections(updated);
  };

  const addSubSection = () => {
    setSubSections([...subSections, { title: '', description: '', images: [] }]);
  };

  const removeSubSection = (idx) => {
    if (subSections.length === 1) return;
    const updated = [...subSections];
    updated.splice(idx, 1);
    setSubSections(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let bannerImageUrl = '';
    if (bannerFile) {
      const formData = new FormData();
      formData.append('blog_image', bannerFile);
      try {
        const result = await apiCall({ endpoint: 'blog/createBlogImage', method: 'POST', data: formData });
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

    const uploadedSubSections = [];
    for (let idx = 0; idx < subSections.length; idx++) {
      const formData = new FormData();
      const images = subSections[idx].images || [];
      images.forEach((img) => formData.append('blog_image', img));

      let uploadedImages = '';
      if (images.length > 0) {
        try {
          const result = await apiCall({ endpoint: 'blog/createBlogImage', method: 'POST', data: formData });
          if (result.status === 200) {
            uploadedImages = result.data?.blog_image || '';
          }
        } catch {
          toast.error(`Failed to upload images for subsection ${idx + 1}`);
          setIsSubmitting(false);
          return;
        }
      }

      uploadedSubSections.push({
        title: subSections[idx].title,
        description: subSections[idx].description,
        images: uploadedImages,
      });
    }

    const payload = {
      blog_id: blogId,
      title: blogData.title,
      description: blogData.description,
      section_link: blogData.section_link || "NA",
      banner_image: bannerImageUrl,
      sub_sections: JSON.stringify(uploadedSubSections),
    };

    try {
      const result = await apiCall({ endpoint: 'blog/blog-section', method: 'POST', data: payload });
      if (result.status === 201) {
        toast.success('Section added');
        // Clear form
        setBlogData({ title: '', description: '', section_link: '' });
        setBannerFile(null);
        setSubSections([{ title: '', description: '', images: [] }]);
      } else {
        toast.error('Failed to add section');
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
      <div className="w-full bg-white rounded-xl shadow-lg p-8 mt-8">
        <div className="flex items-center mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded mr-4 text-sm"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-semibold text-gray-800">Add Blog Section</h2>
        </div>

        <form className="space-y-10" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <input
              name="title"
              type="text"
              placeholder="Title"
              required
              className="text-sm border rounded px-4 py-2 w-full"
              value={blogData.title}
              onChange={e => setBlogData({ ...blogData, title: e.target.value })}
            />
            {/* <input
              type="text"
              placeholder="Section Link"
              required
              className="text-sm border rounded px-4 py-2 w-full"
              value={blogData.section_link}
              onChange={e => setBlogData({ ...blogData, section_link: e.target.value })}
            /> */}
            <div className="col-span-1 md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">Description</label>
              <ReactQuill
                theme="snow"
                value={blogData.description}
                onChange={value => setBlogData({ ...blogData, description: value })}
                modules={modules}
                formats={formats}
                className="rounded bg-white"
                placeholder="Write your blog content here..."
              />
            </div>
          </div>

          {/* Banner Upload */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <input
              type="file"
              accept="image/*"
              onChange={e => setBannerFile(e.target.files[0])}
              className="text-sm border rounded px-4 py-2 w-full md:w-auto"
            />
            {bannerFile && (
              <div className="relative group">
                <img
                  src={URL.createObjectURL(bannerFile)}
                  alt="Banner Preview"
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 hidden group-hover:block"
                  onClick={() => setBannerFile(null)}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Subsections */}
          <div className="border rounded bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 text-lg">Subsections</h3>
              <button
                type="button"
                onClick={addSubSection}
                className="bg-green-600 text-white px-4 py-1.5 text-sm rounded hover:bg-green-700"
              >
                + Add Subsection
              </button>
            </div>

            {subSections.map((sub, idx) => (
              <div key={idx} className="bg-white p-4 rounded-md shadow-md mb-6 space-y-4">
                <input
                  type="text"
                  placeholder="Subsection Title"
                  value={sub.title}
                  onChange={e => handleSubSectionChange(e, idx, 'title', e.target.value)}
                  className="w-full text-sm border rounded px-4 py-2"
                />

                <ReactQuill
                  theme="snow"
                  value={sub.description}
                  onChange={value => handleSubSectionChange(null, idx, 'description', value)}
                  modules={modules}
                  formats={formats}
                  className="bg-white"
                  placeholder="Write subsection content here..."
                />

                <input
                  type="file"
                  multiple
                  onChange={e => handleSubSectionImageChange(e, idx, e.target.files)}
                  className="w-full text-sm border rounded px-4 py-2"
                />

                {/* Image Previews */}
                {sub.images?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sub.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={URL.createObjectURL(img)}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 hidden group-hover:block"
                          onClick={() => removeSubImage(idx, i)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => removeSubSection(idx)}
                    disabled={subSections.length === 1}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove Subsection
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddBlogSection;
