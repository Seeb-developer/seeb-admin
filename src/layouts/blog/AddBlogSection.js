import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Toaster, toast } from 'react-hot-toast';
import { FaPen, FaTrash } from 'react-icons/fa';

const AddBlogSection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({});
  const [bannerFile, setBannerFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState([]); // State to hold sections data

  // Fetch the blog sections on component mount
  useEffect(() => {
    fetchBlogSections();
  }, [id]);

  // Fetch the sections associated with the blog
  const fetchBlogSections = async () => {
    await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/single-blog/${id}`)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          setSections(result?.data?.blog_sections); // Assuming the API returns sections in result.data
        } else {
          toast.error('Error fetching sections');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('Failed to fetch blog sections');
      });
  };

  const redirectToBlogList = () => {
    navigate('/ListBlog');
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      blog_id: id,
      title: blogData.title,
      description: blogData.description,
      banner_image: blogData.banner_image,
      section_link: blogData.section_link,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + 'blog/blog-section', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 201) {
          fetchBlogSections()
          toast.success('Section added successfully');
          setBlogData({
            title: '',
            description: '',
            banner_image: '',
            section_link: '',
          });
          setBannerFile(null);
        }
      })
      .catch((error) => console.error('Error:', error));
  };


  const handleUploadFile = async () => {
    if (!bannerFile) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('blog_image', bannerFile);

    setIsLoading(true);

    const requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    };

    await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + 'blog/createBlogImage', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          setBlogData({ ...blogData, banner_image: result?.data?.blog_image });
          toast.success('Banner uploaded successfully');
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  };

  const handleDeleteSection = async (sectionId) => {
    await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}blog/delete-blog-section/${sectionId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 200) {
          toast.success('Section deleted successfully');
          fetchBlogSections(); // Re-fetch sections after deletion
        } else {
          toast.error('Failed to delete section');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('Error deleting section');
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster position="top-center" />
      <div className="border-solid border-2 black-indigo-600 mt-6">
        <div style={{ fontSize: 15 }} className="px-8 mt-5 font-bold">
          Add Blog Section
        </div>

        <div className="mt-6">
          <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleOnSubmit}>
            <div className="px-4">
              <label className="text-gray-700 text-xs font-bold mb-2">Title</label>
              <input
                required
                value={blogData?.title}
                onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                className="appearance-none block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                type="text"
                placeholder="Blog Section Title"
              />
            </div>
            <div className="px-4">
              <label className="text-gray-700 text-xs font-bold mb-2">Description</label>
              <textarea
                required1
                value={blogData?.description}
                onChange={(e) => setBlogData({ ...blogData, description: e.target.value })}
                className="appearance-none block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                rows="4"
                placeholder="Blog Section Description"
              ></textarea>
            </div>
            <div className="px-4">
              <label className="text-gray-700 text-xs font-bold mb-2">Section Link</label>
              <input
                required
                value={blogData?.section_link}
                onChange={(e) => setBlogData({ ...blogData, section_link: e.target.value })}
                className="appearance-none block w-full text-sm text-gray-700 border rounded px-1.5 py-1.5 leading-tight"
                type="text"
                placeholder="Section Section Link"
              />
            </div>
            <div className="px-4">
              <label className="text-gray-700 text-xs font-bold mb-2">Banner Section Image</label>
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
                  {isLoading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
            <div className="px-4 col-span-2 mt-4 flex justify-between">
              <button
                type="button"
                className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={redirectToBlogList}
              >
                Back
              </button>
              <button
                type="submit"
                className="m-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </div>


        <div className="flex flex-col mt-8">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium">
                    <tr>
                      <th scope="col" className="px-6 text-center py-4">Sr. No</th>
                      <th scope="col" className="px-6 text-center py-4">Title</th>
                      <th scope="col" className="px-6 text-center py-4">Image</th>
                      <th scope="col" className="px-6 text-center py-4">Description</th>
                      <th scope="col" className="px-6 text-center py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections?.map((item, index) => (
                      <tr className="border-b" key={item.id}>
                        <td className="text-center whitespace-nowrap px-6 py-4 font-medium">
                          {index + 1}
                        </td>
                        <td className="text-center whitespace-nowrap px-6 py-4">{item.title}</td>
                        <td className="text-center">
                          <img
                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + item.banner_image || 'default-image-url'} // Add your image URL here
                            alt="Section Image"
                            className="w-16 h-16 object-cover py-2 mx-auto"
                          />
                        </td>
                        <td className="text-center px-6 py-4">
                          {item.description.length > 50
                            ? `${item.description.substring(0, 100)}...`
                            : item.description}
                        </td>
                        <td className="flex justify-center items-center gap-5 py-4">
                          <FaPen
                            className="text-green-600 hover:text-green-700"
                            size={20}
                            onClick={() => navigate(`/UpdateBlogSection/${item.id}`)}
                          />
                          <FaTrash
                            className="text-red-600 hover:text-red-700"
                            size={20}
                            onClick={() => handleDeleteSection(item.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AddBlogSection;
