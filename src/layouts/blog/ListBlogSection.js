import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { FaPen, FaTrash } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';

const ListBlogSection = () => {
  const navigate = useNavigate();

  const RedirectToAddBlog = () => {
    navigate("/AddBlogSection");
  };

  const [data, setData] = useState([]);

  const ApiFetch = async () => {
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "Blog/getAllBlogs", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setData(result.Data || []); // Ensure fallback if no data exists
      })
      .catch((error) => console.error('Error fetching blogs:', error));
  };

  useEffect(() => {
    ApiFetch();
  }, []);

  const HandleBlogDelete = (id) => {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };

    fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `Blog/Delete/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.Status === 200) {
          ApiFetch();
          toast.success("Blog Deleted Successfully");
        } else {
          toast.error("Failed to delete blog.");
        }
      })
      .catch((error) => console.error('Error deleting blog:', error));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Toaster position="top-center" reverseOrder={false} />

      <div className="border-solid border-2 black-indigo-600 mt-6">
        <div className="px-8 mt-5" style={{ fontSize: 15 }}>
          Blogs Section
        </div>
        <form className="flex items-center">
          <div className="relative w-1/2 m-4">
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Search blogs..."
              required
            />
          </div>
          <button
            type="button"
            className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-500 rounded-lg border border-blue-700 hover:bg-blue-800"
            onClick={RedirectToAddBlog}
          >
            Add New Blog Section
          </button>
          <button
            type="button"
            className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-500 rounded-lg border border-blue-700 hover:bg-blue-800"
          >
            Back
          </button>
        </form>

        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium">
                    <tr>
                      <th scope="col" className="px-6 text-center py-4">Sr. No</th>
                      <th scope="col" className="px-6 text-center py-4">Title</th>
                      <th scope="col" className="px-6 text-center py-4">Status</th>
                      <th scope="col" className="px-6 text-center py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr className="border-b" key={item.id}>
                        <td className="text-center whitespace-nowrap px-6 py-4 font-medium">
                          {index + 1}
                        </td>
                        <td className="text-center whitespace-nowrap px-6 py-4">{item.title}</td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="ml-2 text-xs font-medium text-white rounded-md px-4 py-1"
                            style={{
                              backgroundColor: item.status === 1 ? 'green' : 'red',
                              color: 'white',
                            }}
                          >
                            {item.status === 1 ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="flex justify-center items-center gap-5 py-4">
                          <FaPen
                            className="text-green-600 hover:text-green-700"
                            size={20}
                            onClick={() => navigate(`/UpdateBlog/${item.id}`)}
                          />
                          <FaTrash
                            className="text-red-600 hover:text-red-700"
                            size={20}
                            onClick={() => HandleBlogDelete(item.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Placeholder */}
                <div className="mt-3 flex justify-end space-x-1">
                  <nav aria-label="Page navigation">
                    <ul className="inline-flex -space-x-px text-sm">
                      <li>
                        <a href="#" className="px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100">
                          Previous
                        </a>
                      </li>
                      {/* Add dynamic page numbers here */}
                      <li>
                        <a href="#" className="px-3 h-8 text-gray-500 bg-white border border-gray-300 hover:bg-gray-100">
                          1
                        </a>
                      </li>
                      <li>
                        <a href="#" className="px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100">
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

export default ListBlogSection;
