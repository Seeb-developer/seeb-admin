import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Toaster, toast } from 'react-hot-toast';

const UpdateBlogSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    title: '',
    description: '',
    section_link: '',
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [subSections, setSubSections] = useState([{ title: '', description: '', images: [] }]);
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
        });
        setBannerImageUrl(result.data.banner_image || '');
        // Parse sub_sections and handle images as string or array
        let parsedSubSections = [{ title: '', description: '', images: [] }];
        try {
          parsedSubSections = result.data.sub_sections
            ? JSON.parse(result.data.sub_sections).map(sub => ({
                ...sub,
                images: sub.images
                  ? (typeof sub.images === 'string' && sub.images !== '' ? [sub.images] : Array.isArray(sub.images) ? sub.images : [])
                  : [],
              }))
            : [{ title: '', description: '', images: [] }];
        } catch {
          // fallback to default
        }
        setSubSections(parsedSubSections.length ? parsedSubSections : [{ title: '', description: '', images: [] }]);
      } else {
        toast.error('Error fetching section data');
      }
    } catch (error) {
      toast.error('Failed to fetch section data');
    }
  };

  // Subsection handlers
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

  // Banner image upload
  const handleUploadFile = async () => {
    if (!bannerFile) {
      toast.error('Please select a file to upload');
      return;
    }
    const formData = new FormData();
    formData.append('blog_image', bannerFile);
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/createBlogImage`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.status === 200) {
        setBannerImageUrl(result.data.blog_image);
        toast.success('Banner uploaded successfully');
      } else {
        toast.error('Failed to upload banner');
      }
    } catch (error) {
      toast.error('Failed to upload banner');
    } finally {
      setIsSubmitting(false);
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
    const uploadedSubSections = [];
    for (let idx = 0; idx < subSections.length; idx++) {
      const formData = new FormData();
      const images = subSections[idx].images || [];
      let uploadedImages = [];

      // If images are File objects, upload them
      if (images.length > 0 && images[0] instanceof File) {
        images.forEach((img) => formData.append('blog_image', img));
        try {
          const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/createBlogImage`, {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          if (result.status === 200) {
            // If backend returns a single image string, wrap in array
            uploadedImages = result.data?.blog_image
              ? [result.data.blog_image]
              : result.data?.images || [];
          }
        } catch {
          toast.error(`Failed to upload images for subsection ${idx + 1}`);
          setIsSubmitting(false);
          return;
        }
      } else if (images.length > 0 && typeof images[0] === 'string') {
        // Already a URL from backend, keep as is
        uploadedImages = images;
      }

      uploadedSubSections.push({
        title: subSections[idx].title,
        description: subSections[idx].description,
        images: uploadedImages.length === 1 ? uploadedImages[0] : uploadedImages, // keep string if only one
      });
    }

    const payload = {
      title: blogData.title,
      description: blogData.description,
      section_link: blogData.section_link,
      banner_image: bannerImageUrlToSend,
      sub_sections: JSON.stringify(uploadedSubSections),
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
          <h2 className="text-2xl font-bold text-gray-800">Update Blog Section</h2>
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

          <div className="border rounded bg-gray-50 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Subsections</span>
              <button type="button" onClick={addSubSection} className="bg-green-500 text-white px-3 py-1 rounded">Add +</button>
            </div>
            {subSections.map((sub, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-stretch gap-4 border p-4 mb-4 rounded bg-white shadow-sm">
                <input
                  type="text"
                  placeholder="Title"
                  value={sub.title}
                  onChange={e => handleSubSectionChange(e, idx, 'title', e.target.value)}
                  className="flex-1 text-sm border rounded px-2 py-1"
                />
                <textarea
                  placeholder="Description"
                  value={sub.description}
                  onChange={e => handleSubSectionChange(e, idx, 'description', e.target.value)}
                  className="flex-1 text-sm border rounded px-2 py-1"
                  rows="1"
                  style={{ resize: 'vertical' }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    // If previous image exists on server, delete it
                    const prevImg = sub.images && typeof sub.images[0] === 'string' ? sub.images[0] : null;
                    if (prevImg) {
                      await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/deleteBlogImage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ blog_image: prevImg }),
                      });
                    }
                    const updated = [...subSections];
                    updated[idx].images = [file];
                    setSubSections(updated);
                  }}
                  className="flex-1 text-sm border rounded px-2 py-1"
                />

                {/* Show preview for new images */}
                {sub.images && sub.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sub.images.map((img, i) =>
                      typeof img === 'string' ? (
                        <img
                          key={i}
                          src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${img}`}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ) : (
                        <div key={i} className="relative group">
                          <img src={URL.createObjectURL(img)} alt="Preview" className="w-12 h-12 object-cover rounded border" />
                          <button type="button" className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 hidden group-hover:block" onClick={() => removeSubImage(idx, i)}>×</button>
                        </div>
                      )
                    )}
                  </div>
                )}
                <button type="button" onClick={() => removeSubSection(idx)} disabled={subSections.length === 1} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
              </div>
            ))}
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

export default UpdateBlogSection;
