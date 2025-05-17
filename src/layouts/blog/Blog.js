import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Toaster, toast } from "react-hot-toast";

const Blog = () => {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({});
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const RedirectToBlogList = () => {
    navigate("/ListBlog");
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      title: blogData.title,
      description: blogData.description,
      blog_image: uploadedFilePath,
      status: 0,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "blog/createBlog", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          toast.success("Blog Added Successfully");
          setTimeout(() => {
            RedirectToBlogList();
          }, 1000);
        } else {
          toast.error(result.Message || "Failed to add blog");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleFileUpload = async () => {
    if (!fileToUpload) return;

    const formData = new FormData();
    formData.append("blog_image", fileToUpload);

    setIsLoading(true);

    const requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };

    await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "blog/createBlogImage", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          setUploadedFilePath(result?.data?.blog_image);
          setFileToUpload(null); // Clear the file input
          toast.success("File Uploaded Successfully");
        } else {
          toast.error(result.Message || "File upload failed");
        }
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setIsLoading(false));
  };

  const handleRemoveFile = async () => {
    if (!uploadedFilePath) return;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blog_image: uploadedFilePath }), // Include the file path for deletion
    };

    try {
      const response = await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "blog/deleteBlogImage", requestOptions);
      const result = await response.json();

      if (response.ok && result.status === 200) {
        setUploadedFilePath(null);
        toast.success("File removed successfully");
      } else {
        toast.error(result.Message || "Failed to delete the file");
      }
    } catch (error) {
      console.error("Error while deleting file:", error);
      toast.error("An error occurred while deleting the file");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="border-solid border-2 black-indigo-600 mt-6">
        <div style={{ fontSize: 15 }} className="px-8 mt-5 font-bold">
          Add Blog
        </div>
        <div className="mt-6">
          <form className="w-full" onSubmit={handleOnSubmit}>
            <div className="flex">
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">Title</label>
                <input
                  required
                  onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                  className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                  type="text"
                  placeholder="Blog Title"
                />
              </div>
            </div>

            <div className="flex">
              <div className="w-full px-4">
                <label className="text-gray-700 text-xs font-bold mb-2">Description</label>
                <textarea
                  required
                  onChange={(e) => setBlogData({ ...blogData, description: e.target.value })}
                  className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                  placeholder="Blog Description"
                ></textarea>
              </div>
            </div>

            <div className="flex px-4 mt-4">
              <div className="w-full">
                <label className="text-gray-700 text-xs font-bold mb-2">Blog Image</label>
                <div className="flex flex-col items-start">
                  {!uploadedFilePath ? (
                    <div className="flex items-center">
                      <input
                        onChange={(e) => setFileToUpload(e.target.files[0])}
                        className="block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5"
                        type="file"
                      />
                      {fileToUpload && (
                        <button
                          type="button"
                          className="ml-2 py-1 px-5 bg-black text-white rounded"
                          onClick={handleFileUpload}
                          disabled={isLoading}
                        >
                          {isLoading ? "Uploading..." : "Upload"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-start">
                      <img
                        src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + uploadedFilePath}
                        alt="Uploaded Preview"
                        className="w-32 h-32 object-cover rounded mb-2"
                      />
                      <button
                        type="button"
                        className="py-1 px-4 bg-red-500 text-white rounded flex items-center"
                        onClick={handleRemoveFile}
                      >
                        <i className="fas fa-trash-alt mr-2"></i> Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex mt-6 px-4">
              <button
                type="button"
                className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={RedirectToBlogList}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Blog;
