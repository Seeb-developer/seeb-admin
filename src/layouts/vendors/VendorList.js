import React from "react";

// @mui material components
import Card from "@mui/material/Card";
import { Modal, Spin } from "antd";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import NontAuthorized401 from "NontAuthorized401";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import Loader from "layouts/loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { createSearchParams, useNavigate } from "react-router-dom";

// import Footer from "examples/Footer";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function VendorList() {
  let Navigate = useNavigate();
  const [loading, setLoading] = useState("");
  const [vendorList, setVendorList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullMessage, setFullMessage] = useState("");
  const handleViewClick = (description) => {
    setFullMessage(description);
    setModalVisible(true);
  };

  const getAllVendors = () => {
    var myHeaders = new Headers();
    setLoading(true);
    myHeaders.append("Cookie", "ci_session=9d1aaubqaqsgicacrka5l9o95oodfqn1");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "brand/getAllBrand", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setVendorList(result.Brand);
        if (result.status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllVendors();
  }, []);

  // delete vendors
  const removeVendor = (index) => {
    const updateVendors = vendorList.filter((_, i) => i !== index);
    setVendorList(updateVendors);
  };
  const deleteVendors = (index, id) => {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "ci_session=9d1aaubqaqsgicacrka5l9o95oodfqn1");

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `brand/deleteBrand/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        removeVendor(index);
        if (result.status === 200) {
          setLoading(false);
          toast.success("Vendor deleted successfully", {
            theme: "light",
            autoClose: "2000",
          });
        }
      })
      .catch((error) => console.log("error", error));
    setTimeout(() => {
      setLoading(false);
    }, 3000);
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
                      <th scope="col" className="px-6 py-3">
                        Sr No
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                      <th scope="col" className="px-6 py-3">
                        For View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorList.map((Brand, index) => (
                      <tr
                        key={Brand.id}
                        className={`border-b dark:bg-gray-800 dark:border-gray-700 ${
                          index % 2 === 0
                            ? "odd:bg-white even:bg-gray-50"
                            : "odd:dark:bg-gray-800 even:dark:bg-gray-700"
                        }`}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                        >
                          {/* {(currentPage - 1) * itemsPerPage + index + 1} */}
                          {index + 1}
                        </th>
                        <td className="px-6 py-4">
                          <a>{Brand.name}</a>
                        </td>
                        <td
                          className="px-6 py-4"
                          style={{ wordWrap: "break-word", maxWidth: "200px" }}
                        >
                          {Brand.description.split(" ").slice(0, 5).join(" ")}
                          {Brand.description.split(" ").length > 10 && (
                            <button
                              className="text-blue-500 underline ml-2"
                              onClick={() => handleViewClick(Brand.description)}
                            >
                              View
                            </button>
                          )}
                        </td>
                        {modalVisible && (
                          <Modal
                            title="Description"
                            open={modalVisible}
                            onCancel={() => setModalVisible(false)}
                            footer={null}
                            maskStyle={{ backgroundColor: "transparent" }}
                          >
                            <p>{fullMessage}</p>
                          </Modal>
                        )}
                        <td className="px-6 py-4 text-right flex gap-6">
                          <button
                            onClick={() =>
                              Navigate({
                                pathname: "/update-vendors",
                                search: createSearchParams({
                                  id: Brand.id,
                                }).toString(),
                              })
                            }
                            className="AiFillEdit"
                          >
                            <AiFillEdit />
                          </button>
                          <button onClick={() => deleteVendors(index, Brand.id)}>
                            <AiOutlineDelete />
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              Navigate({
                                pathname: "/vendor-details",
                                search: createSearchParams({
                                  id: Brand.id,
                                }).toString(),
                              })
                            }
                            className="bg-black text-white px-2 py-1 ml-1 rounded-sm text-xs"
                          >
                            View
                          </button>
                          {/* <AiOutlineDelete /> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

export default VendorList;
