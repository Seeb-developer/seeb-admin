import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster, toast } from "react-hot-toast";

const ViewSingleBlog = () => {
  const { id } = useParams(); // Extract blog ID from URL params
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch single blog details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/single-blog/${id}`);
        const result = await response.json();
        if (result.status === 200) {
          setBlog(result.data);
        } else {
          toast.error(result.Message || "Failed to fetch blog details");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while fetching the blog details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!blog) {
    return <div>Blog not found.</div>;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="mt-6 px-4">
        <div className="border rounded p-4 shadow">
          <img
            src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${blog.blog_image}`}
            alt={blog.title}
            className="w-full h-60 object-cover rounded mb-4"
          />
          <h2 className="font-bold text-2xl mb-2">{blog.title}</h2>
          <p className="text-gray-600 mb-4">{blog.description}</p>
          <h3 className="text-lg font-bold mb-3">Sections:</h3>
          <div className="space-y-4">
            {blog.blog_sections.map((section) => (
              <div key={section.id} className="border rounded p-4 shadow">
                <h4 className="font-bold text-lg mb-2">{section.title}</h4>
                <img
                  src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${section.banner_image}`}
                  alt={section.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <p className="text-gray-600 mb-2">{section.description}</p>
                {section.section_link && (
                  <a
                    href={section.section_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Learn more
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewSingleBlog;
