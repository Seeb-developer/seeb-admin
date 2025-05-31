import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
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
    <HelmetProvider>
      <DashboardLayout>
        <Helmet>
          <title>{blog.title} | Seeb Blog</title>
          <meta name="description" content={blog.description?.slice(0, 150)} />
          {/* Add more meta tags as needed */}
        </Helmet>
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
              {blog.blog_sections.map((section) => {
                // Parse sub_sections if present and valid
                let subSections = [];
                try {
                  subSections = section.sub_sections ? JSON.parse(section.sub_sections) : [];
                } catch {
                  subSections = [];
                }
                return (
                  <div key={section.id} className="border rounded p-4 shadow">
                    <h4 className="font-bold text-lg mb-2">{section.title}</h4>
                    <img
                      src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${section.banner_image}`}
                      alt={section.title}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                    <p className="text-gray-600 mb-2">{section.description}</p>

                    {/* Render Subsections */}
                    {subSections.length > 0 && (
                      <div className="mt-2 pl-4 border-l-4 border-blue-200">
                        {/* <h5 className="font-semibold text-blue-700 mb-2">Subsections:</h5> */}
                        <div className="space-y-3">
                          {subSections.map((sub, i) => (
                            <div key={i} className="mb-2">
                              <div className="font-medium">{sub.title}</div>
                              {sub.images && (
                                <img
                                  src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${typeof sub.images === 'string' ? sub.images : sub.images[0]}`}
                                  alt={sub.title}
                                  className="w-32 h-20 object-cover rounded my-1"
                                />
                              )}
                              <div className="text-gray-600 text-sm">{sub.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </HelmetProvider>
  );
};

export default ViewSingleBlog;
