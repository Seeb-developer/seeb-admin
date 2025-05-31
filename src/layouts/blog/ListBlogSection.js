import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Toaster, toast } from 'react-hot-toast';
import { FaPen, FaTrash } from 'react-icons/fa';

const ListBlogSection = () => {
  const [sections, setSections] = useState([]);
  const location = useLocation();
  const blogId = location.state?.blogId;
  const navigate = useNavigate();

  const fetchBlogSections = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/single-blog/${blogId}`);
      const result = await response.json();
      if (result.status === 200) {
        setSections(result.data.blog_sections || []);
      } else {
        toast.error('Failed to fetch sections');
      }
    } catch {
      toast.error('Error fetching sections');
    }
  };

  const handleDeleteSection = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/delete-blog-section/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.status === 200) {
        toast.success('Section deleted');
        fetchBlogSections();
      } else toast.error('Failed to delete');
    } catch {
      toast.error('Error deleting');
    }
  };

  useEffect(() => {
    fetchBlogSections();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster position="top-center" />
      <div className="p-6">
        <div className="flex items-center mb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-3 py-1 rounded mr-4"
          >
            ← Back
          </button>
          <h2 className="text-lg font-bold">Blog Sections</h2>
          <div className="items-center ml-auto flex gap-4 txt-sm">
            <button
              onClick={() => navigate(`/blog-sections/add`, { state: { blogId } })}
              className="bg-blue-500 text-white px-4 py-2 rounded ml-auto text-sm"
            >
              Add Section
            </button>
            <button
              onClick={() => navigate(`/blog-cta/add`, { state: { blogId } })}
              className="bg-blue-500 text-white px-4 py-2 rounded ml-auto text-sm"
            >
              Add CTA
            </button>
          </div>
        </div>

        <table className="min-w-full text-left text-sm">
          <thead className="border-b font-medium">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">CTA Button Text</th>
              <th className="px-4 py-2">CTA Button link</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((item, index) => {
              // Parse sub_sections safely
              let subSections = [];
              try {
                subSections = item.sub_sections ? JSON.parse(item.sub_sections) : [];
              } catch {
                subSections = [];
              }
              return (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    {item.title}
                    {/* Show subsection titles below the main title */}
                    {subSections.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">
                        <span className="font-semibold">Subsections:</span>
                        <ul className="list-disc ml-4">
                          {subSections.map((sub, i) => (
                            <li key={i}>
                              <span className="font-medium">{sub.title}</span>
                              {sub.description && `: ${sub.description.slice(0, 40)}${sub.description.length > 40 ? '...' : ''}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <img src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${item.banner_image}`} alt="" className="w-16 h-16 object-cover" />
                  </td>
                  <td className="px-4 py-2">{item.description.slice(0, 100)}...</td>
                  <td className="px-4 py-2">{item.cta_text}</td>
                  <td className="px-4 py-2">{item.section_link}</td>
                  <td className="px-4 py-2 text-center flex gap-3 justify-center">
                    <FaPen className="text-green-600 cursor-pointer" onClick={() => {
                      if (item.cta_text) {
                        navigate(`/update-cta/${item.id}`);
                      } else {
                        navigate(`/UpdateBlogSection/${item.id}`)
                      }
                    }} />
                    <FaTrash className="text-red-600 cursor-pointer" onClick={() => handleDeleteSection(item.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ListBlogSection;
