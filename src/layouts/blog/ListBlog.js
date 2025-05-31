import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { FaPen, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import Toggle from "react-toggle";
import "react-toggle/style.css";

const ListBlog = () => {
  const navigate = useNavigate();

  const redirectToAddBlog = () => {
    navigate("/addblog");
  };

  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/get-all`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setBlogs(result.data || []);
      })
      .catch((error) => console.log("Error:", error));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleBlogDelete = async (id) => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/deleteBlog/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          fetchBlogs();
          toast.success("Blog deleted successfully");
        }
      })
      .catch((error) => console.log("Error:", error));
  };

  const handleStatusToggle = async (id, isActive) => {
    const newStatus = isActive === "1" ? 0 : 1;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
      redirect: "follow",
    };

    await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/updateStatus/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          fetchBlogs();
          toast.success("Status updated successfully");
        } else {
          toast.error("Failed to update status");
        }
      })
      .catch((error) => console.log("Error:", error));
  };

  // Function to truncate the description with ellipsis if it exceeds the limit
  const truncateDescription = (description, limit) => {
    if (description && description.length > limit) {
      return description.substring(0, limit) + "...";
    }
    return description;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="border-solid border-2 black-indigo-600 mt-6">
        <div style={{ fontSize: 15 }} className="px-8 mt-5">
          List of Blogs
        </div>
        <form className="flex items-center">
          <div className="relative w-1/2 m-4">
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
              placeholder="Search blogs..."
              required
            />
          </div>
          <button
            type="button"
            className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-500 rounded-lg"
            onClick={redirectToAddBlog}
          >
            Add New Blog
          </button>
          <button
            type="button"
            className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-500 rounded-lg"
            onClick={() => navigate("/dashboard")}
          >
            Back
          </button>
        </form>

        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full py-2">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b font-medium">
                    <tr>
                      <th className="px-6 text-center py-4">Sr.No</th>
                      <th className="px-6 text-center py-4">Image</th>
                      <th className="px-6 text-center py-4">Title</th>
                      <th className="px-6 text-center py-4">Description</th>
                      <th className="px-6 text-center py-4">Status</th> {/* New Status column */}
                      <th className="px-6 text-center py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {blogs.map((blog, index) => (
                      <tr className="border-b" key={blog.id}>
                        <td className="text-center px-6 py-4">{index + 1}</td>
                        <td className="text-center px-6 py-4">
                          {blog.blog_image && (
                            <div
                              className="inline-block cursor-pointer"
                              onClick={() => navigate('/blog-sections', { state: { blogId: blog.id } })}
                            >
                              <img
                                src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + blog.blog_image}
                                alt={blog.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                            </div>
                          )}
                        </td>

                        <td
                          className="text-center px-6 py-4 cursor-pointer text-blue-600 hover:underline"
                          onClick={() => navigate('/blog-sections', { state: { blogId: blog.id } })}
                        >
                          {blog.title}
                        </td>

                        <td className="text-center px-6 py-4">
                          {truncateDescription(blog.description, 250)}
                        </td>
                        <td className="text-center px-6 py-4">
                          <Toggle
                            checked={blog.status === "1"}
                            onChange={() => handleStatusToggle(blog.id, blog.status)}
                            icons={false}
                          />
                        </td>
                        <td className="flex justify-center text-center items-center gap-5 py-4">
                          <FaPen
                            className="text-green-600 hover:text-green-700"
                            size={20}
                            onClick={() => navigate(`/updateblog/${blog.id}`)}
                          />
                          <FaTrash
                            className="text-red-600 hover:text-red-700"
                            size={20}
                            onClick={() => handleBlogDelete(blog.id)}
                          />
                          <FaPlus
                            className="text-yellow-500 hover:text-yellow-600"
                            size={20}
                            onClick={() => navigate('/blog-sections', { state: { blogId: blog.id } })}
                          />
                          <FaEye
                            className="text-blue-600 hover:text-blue-700 mr-2"
                            size={20}
                            onClick={() => navigate(`/viewblog/${blog.id}`)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>

                <div className="mt-3 flex justify-end space-x-1">
                  {/* Pagination (if applicable) */}
                  <nav>
                    <ul className="inline-flex text-sm">
                      <li>
                        <a href="#" className="px-3 h-8">
                          Previous
                        </a>
                      </li>
                      <li>
                        <a href="#" className="px-3 h-8">
                          1
                        </a>
                      </li>
                      <li>
                        <a href="#" className="px-3 h-8">
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ListBlog;
