// @mui material components
import Card from "@mui/material/Card";
import NontAuthorized401 from "NontAuthorized401";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { LoadingOutlined } from "@ant-design/icons";
// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Loader from "layouts/loader/Loader";
// import Footer from "examples/Footer";
import { ToastContainer, toast } from "react-toastify";
import { Empty, message } from "antd";
import "react-toastify/dist/ReactToastify.css";

import React, { useState, useEffect } from "react";
import { apiCall } from "utils/apiClient";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { Button, Modal, Spin } from "antd";

function TotalDesigner(getDetails) {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  let Navigate = useNavigate();
  const [listProduct, setListProduct] = useState([]);
  const [DesignerList, setDesignerList] = useState([]);
  const [DesignerDeletedList, setDesignerDeletedList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [EditDesignerModalOpen, setEditDesignerModalOpen] = useState(false);

  const [isAddDesignerModalOpen, setAddDesignerModalOpen] = useState(false);
  const [isDeletedDesignerModalOpen, setDeletedDesignerModalOpen] = useState(false);
  const [DesignerCatogorieslist, setDesignerCatogorieslist] = useState(false);
  const [DesignerTotalProductlist, setDesignerTotalProductlist] = useState(false);
  const [DesignerListbyCategory, setDesignerListbyCategory] = useState([]);
  const [DesignerId, setDesignerId] = useState("");
  const [DesignerProductData, setDesignerProductData] = useState("");

  // add feilds in addd designer
  const [name, setName] = useState("");
  const [ID, setID] = useState("");
  const [pancard, setpancard] = useState("");
  const [adharnumber, setadharnumber] = useState("");
  const [ImgPaths, setImgPaths] = useState({ pan_card: "", agreement: "", adhaar_card: "" });
  const [pancardimg, setpancardimg] = useState("");
  const [adharimg, setadharimg] = useState("");
  const [aggrementimg, setaggrementimg] = useState("");
  const [UploadLoader, setUploadLoader] = useState(false);
  const [UpdateFormData, setUpdateFormData] = useState({});
  // ...

  // add new designer modal
  const openAddDesignerModal = () => {
    setAddDesignerModalOpen(true);
  };

  const closeAddDesignerModal = () => {
    setAddDesignerModalOpen(false);
  };
  // add new designer modal

  // update modal
  const openupdateDesignerModal = () => {
    setEditDesignerModalOpen(true);
  };

  // update modal
  const openDeletedDesignerModal = () => {
    setDeletedDesignerModalOpen(true);
  };

  const closeDeletedDesignerModal = () => {
    setDeletedDesignerModalOpen(false);
  };

  // specific designer by catogories modal
  const openproductcatagoriesModal = (id) => {
    setDesignerCatogorieslist(true);
    setDesignerId(id);
  };

  const closeproductcatagoriesModal = () => {
    setDesignerCatogorieslist(false);
  };

  // specific designer by catoTotal

  // specific designer total product list modal
  const opentotalproductModal = (Products) => {
    setDesignerTotalProductlist(true);
    setDesignerCatogorieslist(false);
    setDesignerProductData(Products);
  };

  const closetotalproductModal = () => {
    setDesignerTotalProductlist(false);
  };
  // specific designer total product list modal

  // list categories
  const getAllOffer = async () => {
    setLoading(true);
    await apiCall({ endpoint: "Offers/getAllOffers", method: "GET" })
      .then((result) => {
        setListProduct(result.data);
        if (result.status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const getAllDesingner = async () => {
    setLoading(true);
    await apiCall({ endpoint: "Designer/GetAll", method: "GET" })
      .then((result) => {
        if (result.status === 200) {
          setDesignerList(result.data);
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const getAllDeletedDesingner = async () => {
    setLoading(true);
    await apiCall({ endpoint: "Designer/GetDeletedDesigner", method: "GET" })
      .then((result) => {
        setDesignerDeletedList(result.Data);
        if (result.Status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const handledesingnerDelete = async (id) => {
    setLoading(true);
    console.log("id", id);
    await apiCall({ endpoint: `Designer/Delete/${id}`, method: "DELETE" })
      .then((result) => {
        if (result.Status === 200) {
          getAllDesingner();
          getAllDeletedDesingner();
          // getDetails();
        }
      })
      .catch((error) => console.log("error", error));
  };

  const [UpdateIndex, setUpdateIndex] = useState(false);
  const adddesigner = () => {
    const data = {
      employee_id: ID,
      name,
      pan_number: pancard,
      adhaar_number: adharnumber,
      agreement: aggrementimg,
      pan_card: pancardimg,
      adhaar_card: adharimg,
    };

    apiCall({ endpoint: "Designer/Create", method: "POST", data })
      .then((result) => {
        if (result.Status === 201) {
          getAllDesingner();
          setAddDesignerModalOpen(false);
          getDetails();
          setName("");
          setID("");
          setpancard("");
          setadharnumber("");
          setpancardimg("");
          setadharimg("");
          setaggrementimg("");
        }
      })
      .catch((error) => console.log("error", error));
  };

  const updatedesingner = (userid) => {
    const data = {
      id: userid,
      employee_id: UpdateFormData.employee_id,
      name: UpdateFormData.name,
      pan_number: UpdateFormData.pan_number,
      adhaar_number: UpdateFormData.adhaar_number,
      agreement: "PathOfFile",
      pan_card: "PathOfFile",
      adhaar_card: "PathOfFile",
    };

    apiCall({ endpoint: "Designer/Update", method: "PUT", data })
      .then((result) => {
        if (result.Status === 200) {
          setEditDesignerModalOpen(false);
          getAllDesingner();
        }
      })
      .catch((error) => console.log("error", error));
  };
  const getAllDesignerByCategory = async () => {
    setLoading(true);
    await apiCall({ endpoint: `Designer/GetProductsByDesignerId//${DesignerId}`, method: "GET" })
      .then((result) => {
        if (result.Status === 200) {
          setDesignerListbyCategory(result.Data);
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getAllOffer();
    getAllDesingner();
    getAllDeletedDesingner();
    getAllDesignerByCategory();
  }, []);

  const [messageApi, contextHolder] = message.useMessage();
  const adddesingnertab = () => {
    console.log("dsdsd");
  };

  const HandleUploadImage = (id) => {
    setUploadLoader(id);
    var formdata = new FormData();
    formdata.append(
      "image",
      id == 1 ? ImgPaths.adhaar_card : id == 2 ? ImgPaths.agreement : ImgPaths.pan_card
    );

    apiCall({ endpoint: "Designer/createDesignerImage", method: "POST", data: formdata })
      .then((result) => {
        if (result.status === 200) {
          setUploadLoader(false);
          if (id == 1) {
            setadharimg(result.data);
          } else if (id == 2) {
            setaggrementimg(result.data);
          } else {
            setpancardimg(result.data);
          }

          messageApi.open({
            type: "success",
            content: "File Upload Successfully",
          });
          setTimeout(() => {
            id == 1
              ? (ImgPaths.adhaar_card = null)
              : id == 2
              ? (ImgPaths.agreement = null)
              : (ImgPaths.pan_card = null);
          }, 1000);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const closeupdateDesignerModal = () => {
    setUpdateIndex(false);
    setEditDesignerModalOpen(false);
  };
  return (
    <>
      {localStorage.getItem("Token") ? (
        <>
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
              {contextHolder}
              {/* {console.log(currentPage)} */}
              <div className="flex items-center justify-between mx-4">
                <h3 className="font-bold text-lg">Total Designer</h3>
                <div className="flex gap-5">
                  <button
                    onClick={openDeletedDesignerModal}
                    className="border border-red-600 tracking-wider bg-red-600 text-white font-semibold rounded-md p-1 px-5"
                  >
                    Deleted Designer
                  </button>
                  <button
                    onClick={openAddDesignerModal}
                    className="border border-[#027100] tracking-wider bg-[#027100] text-white font-semibold rounded-md p-1 px-5"
                  >
                    Add Designer
                  </button>
                </div>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-center">
                        Sr No
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Designer Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Designer Id
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {DesignerList.map((el, index) => (
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
                          {/* <a>{el.offer_title}</a> */}
                          {el.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {/* <a>{el.offer_title}</a> */}
                          {el.employee_id}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {/* <a>{el.offer_title}</a> */}
                          {el.Product}
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-6 ">
                          <td className="text-centre ">
                            <button
                              onClick={() => openproductcatagoriesModal(el.id)}
                              className="bg-white text-black px-2 rounded-md border-2 border-black"
                            >
                              View
                            </button>
                          </td>
                          <button
                            onClick={() => {
                              setUpdateIndex(index);
                              openupdateDesignerModal(true);
                            }}
                            className="AiFillEdit"
                          >
                            <AiFillEdit />
                          </button>
                          <button
                            onClick={() => {
                              handledesingnerDelete(el.id);
                            }}
                          >
                            <AiOutlineDelete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Designer Modal */}

              <Modal
                title="Add Designer"
                open={isAddDesignerModalOpen}
                onCancel={() => setAddDesignerModalOpen(false)}
                className="modal-wrapper"
                footer={""}
                width={1000}
              >
                <div className="relative bg-white overflow-hidden" />
                <div className="modal-content mt-5">
                  <div className=" grid grid-cols-2  items-center gap-5">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-semibold">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="ID" className="block text-gray-700 font-semibold">
                        ID
                      </label>
                      <input
                        type="text"
                        id="ID"
                        name="ID"
                        placeholder="Enter ID"
                        value={ID}
                        onChange={(e) => setID(e.target.value)}
                        className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="modal-column mt-5">
                    <div className=" grid grid-cols-2  items-center gap-5">
                      <div>
                        <label htmlFor="pancard" className="block text-gray-700 font-semibold">
                          Pan Number
                        </label>
                        <input
                          type="number"
                          id="pancard"
                          name="pancard"
                          placeholder="Enter pancard"
                          value={pancard}
                          onChange={(e) => setpancard(e.target.value)}
                          className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="aadhar" className="block text-gray-700 font-semibold ">
                          Aadhar Number
                        </label>
                        <input
                          type="number"
                          id="adharnumber"
                          name="aadhar"
                          placeholder="Enter Aadhar number"
                          value={adharnumber}
                          onChange={(e) => setadharnumber(e.target.value)}
                          className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className=" grid grid-cols-2  items-center gap-5">
                      <div>
                        <label htmlFor="pancard" className="block text-gray-700 font-semibold">
                          Adhaar Card
                        </label>
                        <div className="flex justify-center flex-row">
                          <input
                            type="file"
                            name="adhaar_card"
                            placeholder="upload image"
                            // onChange={(e) => HandleUploadImage(e.target)}
                            onChange={(e) => {
                              setImgPaths({ ...ImgPaths, [e.target.name]: e.target.files[0] });
                            }}
                            className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {ImgPaths.adhaar_card ? (
                            <button
                              className="px-4 rounded-r-xl bg-black text-white"
                              onClick={() => HandleUploadImage(1)}
                            >
                              {UploadLoader === 1 ? (
                                <div className="flex justify-center items-center">
                                  <Spin indicator={antIcon} className="text-white" />
                                </div>
                              ) : (
                                "Upload File"
                              )}
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="pancard" className="block text-gray-700 font-semibold">
                          Aggrement
                        </label>
                        <div className="flex justify-center flex-row">
                          <input
                            type="file"
                            name="agreement"
                            placeholder="upload image"
                            onChange={(e) =>
                              setImgPaths({ ...ImgPaths, [e.target.name]: e.target.files[0] })
                            }
                            className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {ImgPaths.agreement ? (
                            <button
                              className="px-4 rounded-r-xl bg-black text-white"
                              onClick={() => HandleUploadImage(2)}
                            >
                              {UploadLoader === 2 ? (
                                <div className="flex justify-center items-center">
                                  <Spin indicator={antIcon} className="text-white" />
                                </div>
                              ) : (
                                "Upload File"
                              )}
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>

                    <div className=" grid grid-cols-2  items-center gap-5">
                      <div>
                        <label htmlFor="pancard" className="block text-gray-700 font-semibold">
                          Pan Card
                        </label>
                        <div className="flex justify-center flex-row">
                          <input
                            type="file"
                            name="pan_card"
                            placeholder="upload image"
                            onChange={(e) =>
                              setImgPaths({ ...ImgPaths, [e.target.name]: e.target.files[0] })
                            }
                            className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {ImgPaths.pan_card ? (
                            <button
                              className="px-4 rounded-r-xl bg-black text-white"
                              onClick={() => HandleUploadImage(3)}
                            >
                              {UploadLoader === 3 ? (
                                <div className="flex justify-center items-center">
                                  <Spin indicator={antIcon} className="text-white" />
                                </div>
                              ) : (
                                "Upload File"
                              )}
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-5">
                    <button
                      onClick={adddesigner}
                      className="bg-black text-white px-3 rounded-md py-1"
                    >
                      Add Designer
                    </button>
                  </div>
                </div>
              </Modal>

              {/* Deleted Designer Modal */}
              <Modal
                title="Deleted Designer "
                open={isDeletedDesignerModalOpen}
                onCancel={closeDeletedDesignerModal}
                footer={""}
                width={1000}
              >
                <div className="relative bg-white overflow-hidden ">
                  <div>
                    {/* {console.log(currentPage)} */}
                    <div className="ml-4 mb-5">
                      <h3 className="font-bold text-lg ">Total Deleted Designer</h3>
                    </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-center">
                              Sr No
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Designer Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Designer Id
                            </th>

                            <th scope="col" className="px-6 py-3 text-center">
                              Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {DesignerDeletedList.map((el, index) => (
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
                                <a>{el.employee_id}</a>
                              </td>

                              <td className="px-6 py-4 text-center">
                                {/* <a>{el.offer_title}</a> */}
                                product
                              </td>
                              <td className="px-6 py-4 flex justify-center gap-6 ">
                                {/* <button
                                  // onClick={() =>
                                  //   Navigate({
                                  //     pathname: "/update-offer",
                                  //     search: createSearchParams({
                                  //       slug: el.id,
                                  //     }).toString(),
                                  //   })
                                  // }
                                  className="AiFillEdit"
                                >
                                  <AiFillEdit />
                                </button> */}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Modal>

              {/* Edit Designer  */}
              <Modal
                title="Update Designer"
                open={EditDesignerModalOpen}
                onCancel={closeupdateDesignerModal}
                className="modal-wrapper"
                footer={""}
                width={1000}
              >
                <div className="relative bg-white overflow-hidden" />

                <div className="modal-content mt-5">
                  <div className=" grid grid-cols-2  items-center gap-5">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-semibold">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter name"
                        defaultValue={
                          DesignerList[UpdateIndex] ? DesignerList[UpdateIndex].name : "--"
                        }
                        onChange={(e) =>
                          setUpdateFormData({ ...UpdateFormData, ["name"]: e.target.value })
                        }
                        className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="ID" className="block text-gray-700 font-semibold">
                        ID
                      </label>
                      <input
                        type="text"
                        id="ID"
                        name="ID"
                        placeholder="Enter ID"
                        defaultValue={
                          DesignerList[UpdateIndex] ? DesignerList[UpdateIndex].employee_id : "--"
                        }
                        onChange={(e) =>
                          setUpdateFormData({
                            ...UpdateFormData,
                            ["employee_id"]: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="modal-column mt-5">
                    <div className=" grid grid-cols-2  items-center gap-5">
                      <div>
                        <label htmlFor="pancard" className="block text-gray-700 font-semibold">
                          Pan Number
                        </label>
                        <input
                          type="number"
                          id="pancard"
                          name="pancard"
                          placeholder="Enter pancard"
                          defaultValue={
                            DesignerList[UpdateIndex] ? DesignerList[UpdateIndex].pan_number : "--"
                          }
                          onChange={(e) =>
                            setUpdateFormData({
                              ...UpdateFormData,
                              ["pan_number"]: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="aadhar" className="block text-gray-700 font-semibold ">
                          Aadhar Number
                        </label>
                        <input
                          type="number"
                          id="adharnumber"
                          name="aadhar"
                          placeholder="Enter Aadhar number"
                          defaultValue={
                            DesignerList[UpdateIndex]
                              ? DesignerList[UpdateIndex].adhaar_number
                              : "--"
                          }
                          onChange={(e) =>
                            setUpdateFormData({
                              ...UpdateFormData,
                              ["adhaar_number"]: e.target.value,
                            })
                          }
                          className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className=" grid grid-cols-3  items-center gap-5">
                      <div>
                        {DesignerList[UpdateIndex] ? (
                          <img
                            src={
                              process.env.REACT_APP_HAPS_MAIN_BASE_URL +
                              DesignerList[UpdateIndex].adhaar_card
                            }
                          />
                        ) : (
                          ""
                        )}
                        <label htmlFor="pancard" className="block text-gray-700 font-semibold">
                          Adhaar Card
                        </label>
                        <div className="flex justify-center flex-row">
                          <input
                            type="file"
                            name="adhaar_card"
                            placeholder="upload image"
                            // onChange={(e) => HandleUploadImage(e.target)}
                            onChange={(e) => {
                              setImgPaths({ ...ImgPaths, [e.target.name]: e.target.files[0] });
                            }}
                            className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {ImgPaths.adhaar_card ? (
                            <button
                              className="px-4 rounded-r-xl bg-black text-white"
                              onClick={() => HandleUploadImage(1)}
                            >
                              {UploadLoader === 1 ? (
                                <div className="flex justify-center items-center">
                                  <Spin indicator={antIcon} className="text-white" />
                                </div>
                              ) : (
                                "Upload File"
                              )}
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div>
                        {DesignerList[UpdateIndex] ? (
                          <img
                            src={
                              process.env.REACT_APP_HAPS_MAIN_BASE_URL +
                              DesignerList[UpdateIndex].agreement
                            }
                          />
                        ) : (
                          ""
                        )}

                        <label htmlFor="pancard" className="block text-gray-700 font-semibold">
                          Aggrement
                        </label>
                        <div className="flex justify-center flex-row">
                          <input
                            type="file"
                            name="agreement"
                            placeholder="upload image"
                            onChange={(e) =>
                              setImgPaths({ ...ImgPaths, [e.target.name]: e.target.files[0] })
                            }
                            className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {ImgPaths.agreement ? (
                            <button
                              className="px-4 rounded-r-xl bg-black text-white"
                              onClick={() => HandleUploadImage(2)}
                            >
                              {UploadLoader === 2 ? (
                                <div className="flex justify-center items-center">
                                  <Spin indicator={antIcon} className="text-white" />
                                </div>
                              ) : (
                                "Upload File"
                              )}
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div>
                        {DesignerList[UpdateIndex] ? (
                          <img
                            src={
                              process.env.REACT_APP_HAPS_MAIN_BASE_URL +
                              DesignerList[UpdateIndex].pan_card
                            }
                          />
                        ) : (
                          ""
                        )}
                        <label htmlFor="pancard" className="block text-gray-700 font-semibold">
                          Pan Card
                        </label>
                        <div className="flex justify-center flex-row">
                          <input
                            type="file"
                            name="pan_card"
                            placeholder="upload image"
                            onChange={(e) =>
                              setImgPaths({ ...ImgPaths, [e.target.name]: e.target.files[0] })
                            }
                            className="border border-gray-300 rounded-md w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {ImgPaths.pan_card ? (
                            <button
                              className="px-4 rounded-r-xl bg-black text-white"
                              onClick={() => HandleUploadImage(3)}
                            >
                              {UploadLoader === 3 ? (
                                <div className="flex justify-center items-center">
                                  <Spin indicator={antIcon} className="text-white" />
                                </div>
                              ) : (
                                "Upload File"
                              )}
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-5">
                    <button
                      onClick={() =>
                        updatedesingner(
                          DesignerList[UpdateIndex] ? DesignerList[UpdateIndex].id : 0
                        )
                      }
                      className="bg-black text-white px-3 rounded-md py-1"
                    >
                      Update Designer
                    </button>
                  </div>
                </div>
              </Modal>

              {/* product list by catagories */}

              <Modal
                title="Total Product"
                open={DesignerCatogorieslist}
                onCancel={closeproductcatagoriesModal}
                footer={""}
                width={1000}
              >
                <div className="relative bg-white overflow-hidden ">
                  <div>
                    {/* {console.log(currentPage)} */}
                    <div className="ml-4 mb-5">
                      <h3 className="font-bold text-lg ">Total Product </h3>
                    </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-center">
                              Sr No
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Catogory
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Total
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {DesignerListbyCategory.map((el, index) => (
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
                                <a>{el.Category}</a>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <a>{el.TotalCount}</a>
                              </td>

                              <td className="px-6 py-4 flex justify-center gap-6 ">
                                <td className="text-centre ">
                                  <button
                                    onClick={() => opentotalproductModal(el.Products)}
                                    className="bg-white text-black px-2 rounded-md border-2 border-black"
                                  >
                                    View
                                  </button>
                                </td>
                                {/* <button
                                  // onClick={() =>
                                  //   Navigate({
                                  //     pathname: "/update-offer",
                                  //     search: createSearchParams({
                                  //       slug: el.id,
                                  //     }).toString(),
                                  //   })
                                  // }
                                  className="AiFillEdit"
                                >
                                  <AiFillEdit />
                                </button> */}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Modal>

              {/* Total product list for a specific designer  */}
              <Modal
                title="Total Product"
                open={DesignerTotalProductlist}
                onCancel={closetotalproductModal}
                footer={""}
                width={1000}
              >
                {/* {console.log(currentPage)} */}
                <div className="ml-4 flex gap-2">
                  <h3 className="font-bold text-lg ">Listing Total Product </h3>
                  <span className="font-bold text-lg">:-</span>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-center">
                          Sr No
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Product Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Product Id
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Date / Time
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Product Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Preview
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    {DesignerProductData.length > 0 ? (
                      <tbody>
                        {DesignerProductData.map((products, index) => (
                          <tr
                            key={products.id}
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
                              <a>{products.name}</a>
                              {/* name */}
                            </td>
                            {/* <td className="px-6 py-4 text-center">
                            name
                          </td> */}
                            <td className="px-6 py-4 text-center">
                              {/* <a>{el.products_count !== null ? el.products_count : 0}</a> */}
                              <a>{products.id}</a>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <a>{products.created_at}</a>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <a>{products.ProductType}</a>
                            </td>
                            <td className="px-6 py-4 flex justify-center">
                              <img
                                alt={products.path_128x128}
                                src={`${
                                  process.env.REACT_APP_HAPS_MAIN_BASE_URL + products.path_128x128
                                }`}
                                className="w-[50px] h-[50px] rounded-full"
                              />
                            </td>
                            <td className="text-centre ">
                              <button
                                // onClick={() => {
                                //   const newTab = window.open(
                                //     `/product-update?${createSearchParams({
                                //       id: products.id,
                                //     }).toString()}`,
                                //     "_blank"
                                //   );
                                //   newTab.focus();
                                // }}
                                className="bg-black text-white px-2 rounded-md "
                              >
                                View
                              </button>
                            </td>
                            <td className=" text-centre ">
                              {/* {products.AssignTo === null ? (
                              <button
                                onClick={() => openAllDesignerModal(products.id)}
                                className="bg-blue-500 text-white px-2 rounded-md"
                              >
                                Assigned To
                              </button>
                            ) : (
                              <button
                                onClick={() => openSpecificDesignerOpen(products.id)}
                                className="bg-blue-500 text-white px-2 rounded-md"
                              >
                                Already Assigned
                              </button>
                            )} */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <p className="">
                        <Empty />
                      </p>
                    )}
                  </table>
                </div>
              </Modal>
            </div>
          )}
          <ToastContainer />
          {/* <Footer /> */}
        </>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default TotalDesigner;
