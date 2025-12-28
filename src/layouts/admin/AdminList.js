// @mui material components
import Card from "@mui/material/Card";
import NontAuthorized401 from "NontAuthorized401";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loader from "layouts/loader/Loader";
// import Footer from "examples/Footer";

import React, { useState, useEffect } from "react";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiCall } from "utils/apiClient";

function AdminList() {
  let Navigate = useNavigate();
  const [listAdmin, setListAdmin] = useState([]);
  const [loading, setLoading] = useState(true);

  // list categories
  const getAllAdmin = async () => {
    setLoading(true);
    try {
      const result = await apiCall({ endpoint: "admin/getAdmin", method: "GET" });
      setListAdmin(result.data);
      if (result.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getAllAdmin();
  }, []);

  // delete Admin
  const removeAdmin = (index) => {
    const updateAdmin = listAdmin.filter((_, i) => i !== index);
    setListAdmin(updateAdmin);
  };
  const handleAdminDelete = async (index, id) => {
    try {
      const result = await apiCall({ endpoint: `admin/deleteAdmin/${id}`, method: "DELETE" });
      removeAdmin(index);
      if (result.status === 200) {
        setLoading(false);
        toast.success("Admin deleted successfully", { theme: "light", autoClose: "2000" });
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  };

  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />
          {loading ? (
            <>
              <div className="relative bg-white h-screen overflow-hidden" />
              {loading && (
                <div className="flex justify-center">
                  <div className="absolute top-[30%]">
                    <Loader />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              {/* {console.log(currentPage)} */}
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-center">
                        Sr No
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Mobile Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listAdmin.map((el, index) => (
                      <tr
                        key={el.id}
                        className={`border-b dark:bg-gray-800 dark:border-gray-700 ${
                          index % 2 === 0
                            ? "odd:bg-white even:bg-gray-50"
                            : "odd:dark:bg-gray-800 even:dark:bg-gray-700"
                        }`}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap text-center"
                        >
                          {/* {(currentPage - 1) * itemsPerPage + index + 1} */}
                          {index + 1}
                        </th>
                        <td className="px-6 py-4 text-center">
                          <a>{el.name}</a>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <a>{el.email}</a>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <a>{el.mobile_no}</a>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <a>{el.role_title}</a>
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-6 ">
                          <button
                            onClick={() =>
                              Navigate({
                                pathname: "/update-admin-registration",
                                search: createSearchParams({
                                  slug: el.id,
                                }).toString(),
                              })
                            }
                            className="AiFillEdit"
                          >
                            <AiFillEdit />
                          </button>
                          <button onClick={() => handleAdminDelete(index, el.id)}>
                            <AiOutlineDelete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* <div className="flex justify-center mt-4">
        <div className="flex">
          {(currentPage === 1) ? '' : <button
            onClick={() => paginate(currentPage - 1)}
            className={`px-3 mx-3 rounded-md w-[110px] focus:outline-none bg-black text-white text-md ${currentPage === 1 ? 'cursor-not-allowed' : ''}`}
          // disabled={currentPage === 1}
          >
            Previous
          </button>}
          {(currentPage !== pageCount) ? <button
            onClick={() => paginate(currentPage + 1)}
            className={`px-3 mx-3 rounded-md w-[110px] focus:outline-none bg-black text-white text-md ${currentItems.length < itemsPerPage ? 'cursor-allowed' : ''}`}
          // disabled={currentItems.length < itemsPerPage}
          >
            Next
          </button> : ""}

        </div>
      </div> */}
            </div>
          )}
          <ToastContainer />
          {/* <Footer /> */}
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default AdminList;
