import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Toaster, toast } from 'react-hot-toast';

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

    const uploadedSubSections = [];
    for (let idx = 0; idx < subSections.length; idx++) {
      const formData = new FormData();
      const images = subSections[idx].images || [];
      images.forEach((img) => formData.append('blog_image', img));

      let uploadedImages = '';
      if (images.length > 0) {
        try {
          const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/createBlogImage`, {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
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
      section_link: blogData.section_link,
      banner_image: bannerImageUrl,
      sub_sections: JSON.stringify(uploadedSubSections),
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
        // Clear form
        setBlogData({ title: '', description: '', section_link: '' });
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
      <div className="w-full bg-white rounded shadow p-8 mt-8">
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mr-4"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Add Blog Section</h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Title" required className="flex-1 text-sm border rounded px-2 py-2" value={blogData.title} onChange={e => setBlogData({ ...blogData, title: e.target.value })} />
            <input type="text" placeholder="Section Link" required className="flex-1 text-sm border rounded px-2 py-2" value={blogData.section_link} onChange={e => setBlogData({ ...blogData, section_link: e.target.value })} />
            <textarea placeholder="Description" rows={3} className="border px-4 py-2 text-sm rounded col-span-2" value={blogData.description} onChange={e => setBlogData({ ...blogData, description: e.target.value })} />
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start">
            <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])} className="text-sm border rounded px-4 py-2" />
            {bannerFile && (
              <div className="relative group">
                <img src={URL.createObjectURL(bannerFile)} alt="Banner Preview" className="w-20 h-20 object-cover rounded border" />
                <button type="button" className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 hidden group-hover:block" onClick={() => setBannerFile(null)}>×</button>
              </div>
            )}
          </div>

          <div className="border rounded bg-gray-50 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Subsections</span>
              <button type="button" onClick={addSubSection} className="bg-green-500 text-white px-3 py-1 rounded">Add +</button>
            </div>
            {subSections.map((sub, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-stretch gap-4 border p-4 mb-4 rounded bg-white shadow-sm">
                <input type="text" placeholder="Title" value={sub.title} onChange={e => handleSubSectionChange(e, idx, 'title', e.target.value)} className="flex-1 text-sm border rounded px-2 py-1" />
                <textarea placeholder="Description" value={sub.description} onChange={e => handleSubSectionChange(e, idx, 'description', e.target.value)} className="flex-1 text-sm border rounded px-2 py-1" rows="1" style={{ resize: 'vertical' }} />
                <input type="file" multiple onChange={e => handleSubSectionImageChange(e, idx, e.target.files)} className="flex-1 text-sm border rounded px-2 py-1" />

                {sub.images && sub.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sub.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={URL.createObjectURL(img)} alt="Preview" className="w-12 h-12 object-cover rounded border" />
                        <button type="button" className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 hidden group-hover:block" onClick={() => removeSubImage(idx, i)}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" onClick={() => removeSubSection(idx)} disabled={subSections.length === 1} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-green-600 text-white px-8 py-2 rounded text-lg" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddBlogSection;
