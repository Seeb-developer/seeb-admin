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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Footer from "examples/Footer";

import React, { useState, useEffect } from "react";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { BsFilter } from "react-icons/bs";
import { Modal, Select } from "antd";
import { apiCall } from "utils/apiClient";

function ListSubCategory() {
  let Navigate = useNavigate();

  {
    /* const [customer, setCustomer] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10);
const [customerDetails, setCustomerDetails] = useState(null);

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = (indexOfFirstItem, indexOfLastItem); */
  }

  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [homeZoneAppliancesID, setHomeZoneAppliancesID] = useState(null);

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  // Event handler to close the modal
  const handleModalClose = () => {
    setModalVisible(false);
  };

  // list categories
  const listHomeAppliances = async (id) => {
    setLoading(true);
    try {
      const endpoint = "admin/getHomeZoneCaterory" + (id != null ? `?home_zone_appliances_id=${id}` : "");
      const result = await apiCall({ endpoint, method: "GET" });
      setListing(result.data);
      if (result.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  //
  // Get Categories API
  //
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await apiCall({ endpoint: "admin/getHomeZoneAppliances", method: "GET" });
        setCategories(result.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    listHomeAppliances();
  }, []);

  // delete category
  const removeCategory = (index) => {
    const updatedCategories = listing.filter((_, i) => i !== index);
    setListing(updatedCategories);
  };
  const handleDeleteProduct = async (index, id) => {
    try {
      const result = await apiCall({ endpoint: `admin/deleteHomeZoneCaterory/${id}`, method: "DELETE" });
      removeCategory(index);
      if (result.status === 200) {
        setLoading(false);
        toast.success("Sub-category deleted successfully", {
          theme: "light",
          autoClose: "2000",
        });
      }
    } catch (error) {
      console.log("error", error);
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const { Option } = Select;

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const handleCategoryChange = async (event) => {
    setHomeZoneAppliancesID(event);
    try {
      const result = await apiCall({ endpoint: `admin/getHomeZoneCateroryByid/${event}`, method: "GET" });
      setSubCategories(result.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleSearchByCategory = () => {
    setModalVisible(true);
    listHomeAppliances(homeZoneAppliancesID);
    setModalVisible(false);
  };

  const handleListAllHomezoneCategories =  () => {
    setModalVisible(true);
    listHomeAppliances(null);
   setHomeZoneAppliancesID(null);
    setModalVisible(false);
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
                <div className="mt-4 ml-4">
                <button
                  className={`border p-2 rounded-full px-4 text-xl font-semibold text-gray-700 hover:bg-gray-600 hover:text-white`}
                  onClick={handleButtonClick} // Add the click event handler
                >
                  <BsFilter />
                </button>
                </div>
                <Modal
                  title="Filter" // Replace with your desired title
                  open={modalVisible}
                  onCancel={handleModalClose} // Add the cancel event handler
                  footer={null} // Set to null if you don't want a footer in the modal
                  style={{ maxHeight: "80vh" }}
                >
                  {/* Add your content inside the modal */}

                  <Select
                    // mode="multiple"
                    id="category"
                    value={homeZoneAppliancesID}
                    onChange={handleCategoryChange}
                    className="w-full"
                    placeholder='Select Category'
                    
                  >
                    {/* {!homeZoneAppliancesID && (
                      <Option value="" disabled>
                        Select Category
                      </Option>
                    )} */}
                    {categories.map((category) => (
                      <Option key={category.id} value={category.id} >
                        {category.title}
                      </Option>
                    ))}
                  </Select>

                  <button
                    className="border p-1.5 rounded-full px-4 text-sm font-semibold mt-6 left-0 "
                    onClick={handleSearchByCategory}
                  >
                    search
                  </button>

                  <button
                    className="border p-1.5 rounded-full px-4 text-sm font-semibold mt-6 ml-4 "
                    onClick={handleListAllHomezoneCategories}
                  >
                    clear filter
                  </button>
                </Modal>
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-center">
                        Sr No
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Category Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Image
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Name
                      </th>
                      {/* <th scope="col" className="px-6 py-3">
                                    Product Code
                                </th> */}
                      <th scope="col" className="px-6 py-3 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listing.map((el, index) => (
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
                          <a>{el.home_zone_appliances_title}</a>
                        </td>
                        <td className="px-6 py-4 flex justify-center">
                          <img
                            alt={el.image}
                            src={`${process.env.REACT_APP_HAPS_MAIN_BASE_URL + el.image}`}
                            className="w-[50px] h-[50px] rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <a>{el.title}</a>
                        </td>
                        {/* <td className="px-6 py-4 ">{product.product_code}</td> */}
                        <td className="px-6 py-4 flex justify-center gap-6">
                          <button
                          onClick={() => {
                            const newTab = window.open(
                              `/update-sub-category?${createSearchParams({ data: JSON.stringify(el) }).toString()}`,
                              '_blank'
                            );
                            newTab.focus();
                          }}
                            className="AiFillEdit"
                          >
                            <AiFillEdit />
                          </button>
                          <button onClick={() => handleDeleteProduct(index, el.id)}>
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

export default ListSubCategory;
