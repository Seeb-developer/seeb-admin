import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster, toast } from "react-hot-toast";

const UpdateBlog = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    status: "1", // Default status
    blog_image: "",
  });
  const [prevBannerImage, setPrevBannerImage] = useState(""); // Track the previous banner image
  const [bannerFile, setBannerFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch blog data on component mount
  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/single-blog/${id}`);
      const result = await response.json();

      if (result.status === 200) {
        setBlogData({
          title: result.data.title,
          description: result.data.description,
          status: result.data.status,
          blog_image: result.data.blog_image,
        });
        setPrevBannerImage(result.data.blog_image);
      } else {
        toast.error("Error fetching blog data");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch blog data");
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: blogData.title,
      description: blogData.description,
      status: blogData.status,
      blog_image: blogData.blog_image,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/updateBlog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.status === 200) {
        toast.success("Blog updated successfully");
        navigate("/ListBlog"); // Navigate back to the blog list
      } else {
        toast.error("Failed to update blog");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating blog");
    }
  };

  const handleUploadFile = async () => {
    if (!bannerFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("blog_image", bannerFile);

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/createBlogImage`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.status === 200) {
        if (prevBannerImage) {
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ blog_image: prevBannerImage }), // Include the file path for deletion
          };

          await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "blog/deleteBlogImage", requestOptions);
        }

        setBlogData({ ...blogData, blog_image: result?.data?.blog_image });
        setPrevBannerImage(result?.data?.blog_image); // Update the tracked image
        toast.success("Banner uploaded successfully");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to upload banner");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster position="top-center" />
      <div className="border-solid border-2 black-indigo-600 mt-6">
        <div style={{ fontSize: 15 }} className="px-8 mt-5 font-bold">
          Update Blog
        </div>

        <div className="mt-6">
          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleOnSubmit}>
            <div className="px-4">
              <label className="text-gray-700 text-xs font-bold mb-2">Title</label>
              <input
                required
                value={blogData.title}
                onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                className="appearance-none block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                type="text"
                placeholder="Blog Title"
              />
            </div>
            <div className="px-4">
              <label className="text-gray-700 text-xs font-bold mb-2">Description</label>
              <textarea
                required
                value={blogData.description}
                onChange={(e) => setBlogData({ ...blogData, description: e.target.value })}
                className="appearance-none block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                rows="4"
                placeholder="Blog Description"
              ></textarea>
            </div>
            <div className="px-4">
              <label className="text-gray-700 text-xs font-bold mb-2">Status</label>
              <select
                value={blogData.status}
                onChange={(e) => setBlogData({ ...blogData, status: e.target.value })}
                className="appearance-none block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div className="px-4">
              <label className="text-gray-700 text-xs font-bold mb-2">Banner Image</label>
              <div className="flex items-center">
                <input
                  onChange={(e) => setBannerFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                  type="file"
                />
                <button
                  type="button"
                  className="ml-2 py-1 px-5 bg-black text-white rounded"
                  onClick={handleUploadFile}
                  disabled={isLoading}
                >
                  {isLoading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
            {blogData.blog_image && (
              <div className="px-4 mt-2">
                <label className="text-gray-700 text-xs font-bold mb-2">Current Banner Image</label>
                <img
                  src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}${blogData.blog_image}`}
                  alt="Current Banner"
                  style={{ height: "20em" }}
                  className="mt-2 w-full h-auto border rounded"
                />
              </div>
            )}
            <div className="px-4 col-span-2 flex justify-between">
              <button
                type="button"
                className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate("/ListBlog")}
              >
                Back
              </button>
              <button
                type="submit"
                className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Update Blog
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UpdateBlog;
