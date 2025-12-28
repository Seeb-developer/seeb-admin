import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Toaster, toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { apiCall } from 'utils/apiClient';

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

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'image'];

  const fetchSectionData = async () => {
    try {
      const result = await apiCall({ endpoint: `blog/blog-section/${id}`, method: 'GET' });
      console.log("result =>", result.data);
      if (result.status === 200) {
        setBlogData({
          title: result.data.title,
          description: result.data.description,
          section_link: result.data.section_link,
        });
        setBannerImageUrl(result.data.banner_image || '');
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
    // e.preventDefault();
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
      const result = await apiCall({ endpoint: 'blog/createBlogImage', method: 'POST', data: formData });
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
        const result = await apiCall({ endpoint: 'blog/createBlogImage', method: 'POST', data: formData });
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
          const result = await apiCall({ endpoint: 'blog/createBlogImage', method: 'POST', data: formData });
          if (result.status === 200) {
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
      const result = await apiCall({ endpoint: `blog/blog-section/${id}`, method: 'PUT', data: payload });
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

  console.log("blogdata",blogData.title)

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster position="top-center" />
      <div className="w-full bg-white rounded-xl shadow-md p-8 mt-8">
        <div className="flex items-center mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded mr-4 text-sm"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-semibold text-gray-800">Update Blog Section</h2>
        </div>

        <form className="space-y-10" onSubmit={handleOnSubmit}>
          {/* Title + Link */}
          <div className="grid grid-cols-1 gap-6">
            <input
              type="text"
              placeholder="Title"
              required
              className="text-sm border rounded px-4 py-2"
              value={blogData.title}
              onChange={e => setBlogData({ ...blogData, title: e.target.value })}
            />
            {/* <input
              type="text"
              placeholder="Section Link"
              required
              className="text-sm border rounded px-4 py-2"
              value={blogData.section_link}
              onChange={e => setBlogData({ ...blogData, section_link: e.target.value })}
            /> */}
          </div>

          {/* Main Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <ReactQuill
              theme="snow"
              value={blogData.description}
              onChange={value => setBlogData({ ...blogData, description: value })}
              modules={modules}
              formats={formats}
              className="bg-white"
              placeholder="Write blog content here..."
            />
          </div>

          {/* Banner Image Upload */}
          <div className="flex flex-col md:flex-row gap-6">
            <input
              type="file"
              accept="image/*"
              onChange={async e => {
                const file = e.target.files[0];
                if (!file) return;

                // Delete previous
                if (bannerImageUrl) {
                  await apiCall({ endpoint: 'blog/deleteBlogImage', method: 'POST', data: { blog_image: bannerImageUrl } });
                }

                setBannerFile(file);
                setBannerImageUrl('');
              }}
              className="text-sm border rounded px-4 py-2 w-full md:w-auto"
            />
            {bannerImageUrl && (
              <img
                src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${bannerImageUrl}`}
                alt="Banner Preview"
                className="w-24 h-24 object-cover rounded border"
              />
            )}
          </div>

          {/* Subsections */}
          <div className="border rounded bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800 text-lg">Subsections</h3>
              <button
                type="button"
                onClick={addSubSection}
                className="bg-green-600 text-white px-4 py-1 text-sm rounded hover:bg-green-700"
              >
                + Add Subsection
              </button>
            </div>

            {subSections.map((sub, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-md shadow-sm mb-6 space-y-4 border border-gray-200"
              >
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

                {/* Upload Sub Image */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async e => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const prevImg = sub.images && typeof sub.images[0] === 'string' ? sub.images[0] : null;
                    if (prevImg) {
                      await apiCall({ endpoint: 'blog/deleteBlogImage', method: 'POST', data: { blog_image: prevImg } });
                    }

                    const updated = [...subSections];
                    updated[idx].images = [file];
                    setSubSections(updated);
                  }}
                  className="text-sm border rounded px-4 py-2 w-full"
                />

                {/* Image Previews */}
                {sub.images?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {sub.images.map((img, i) =>
                      typeof img === 'string' ? (
                        <img
                          key={i}
                          src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${img}`}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ) : (
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
                      )
                    )}
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

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Section'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default UpdateBlogSection;
