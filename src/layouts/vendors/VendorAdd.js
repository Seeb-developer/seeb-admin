import React, { useRef } from "react";

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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import { Select } from "antd";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Option } = Select;
const { TabPane } = Tabs;

function VendorAdd() {
  let Navigate = useNavigate();
  const inputFileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [selectedImagePan, setSelectedImagePan] = useState(null);
  const [panImage, setPanImage] = useState(null);
  const [selectedImageAadhar, setSelectedImageAadhar] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [selectedImageShopAct, setSelectedImageShopAct] = useState(null);
  const [shopActImage, setShopActImage] = useState(null);

  // states for validation
  const [nameError, setNameError] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [gstError, setGstError] = useState("");

  //
  // for pan image
  //
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImagePan(file);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  //
  // for aadhar image
  //
  const handleAadharFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImageAadhar(file);
  };

  const openModalAadhar = () => {
    setModalVisible(true);
  };

  const closeModalAadhar = () => {
    setModalVisible(false);
  };

  //
  // for aadhar image
  //
  const handleShopActFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImageShopAct(file);
  };

  const openModalShopAct = () => {
    setModalVisible(true);
  };

  const closeModalShopAct = () => {
    setModalVisible(false);
  };

  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />
          <div className="w-full mx-auto p-4 bg-white rounded-md shadow-md text-sm">
            <form className="p-4 md:p-5 lg:p-5 xl:p-5">
              <div className="grid grid-cols-2 gap-4">
                {/* vendor name */}
                <div className="">
                  <label htmlFor="vendorName" className="block text-gray-700 font-semibold ">
                    Vendor Name
                  </label>
                  <input
                    type="text"
                    id="vendorName"
                    name="vendorName"
                    placeholder="Enter name *"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className={`${
                      nameError
                        ? "border border-red-500 placeholder:text-red-500"
                        : "border border-gray-300"
                    }
              w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs`}
                  />
                  {nameError && (
                    <div className="error-message text-xs text-red-500 p-1">{nameError}</div>
                  )}
                </div>

                {/*company name */}
                <div className="">
                  <label htmlFor="companyName" className="block text-gray-700 font-semibold ">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Enter company name*"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={`${
                      companyNameError
                        ? "border border-red-500 placeholder:text-red-500"
                        : "border border-gray-300"
                    }
              w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs`}
                  />
                  {companyNameError && (
                    <div className="error-message text-xs text-red-500 p-1">{companyNameError}</div>
                  )}
                </div>

                {/* address */}
                <div className="">
                  <label htmlFor="address" className="block text-gray-700 font-semibold ">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter Address*"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`${
                      addressError
                        ? "border border-red-500 placeholder:text-red-500"
                        : "border border-gray-300"
                    }
              w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs`}
                  />
                  {addressError && (
                    <div className="error-message text-xs text-red-500 p-1">{addressError}</div>
                  )}
                </div>

                {/* email */}
                <div className="">
                  <label htmlFor="email" className="block text-gray-700 font-semibold ">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${
                      emailError
                        ? "border border-red-500 placeholder:text-red-500"
                        : "border border-gray-300"
                    }
              w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs`}
                  />
                  {emailError && (
                    <div className="error-message text-xs text-red-500 p-1">{emailError}</div>
                  )}
                </div>

                {/* mobile number */}
                <div className="">
                  <label htmlFor="mobileNumber" className="block text-gray-700 font-semibold">
                    Mobile Number
                  </label>
                  <input
                    type="number"
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder="Enter mobile Number*"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className={`${
                      mobileError
                        ? "border border-red-500 placeholder:text-red-500"
                        : "border border-gray-300"
                    }
                    nothing w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs`}
                  />
                  {mobileError && (
                    <div className="error-message text-xs text-red-500 p-1">{mobileError}</div>
                  )}
                </div>

                {/* gst */}
                <div className="">
                  <label htmlFor="gstNumber" className="block text-gray-700 font-semibold">
                    Gst Number
                  </label>
                  <input
                    type="text"
                    id="gstNumber"
                    name="gstNumber"
                    placeholder="Enter GST number*"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    className={`${
                      gstError
                        ? "border border-red-500 placeholder:text-red-500"
                        : "border border-gray-300"
                    }
                w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs`}
                  />
                  {gstError && (
                    <div className="error-message text-xs text-red-500 p-1">{gstError}</div>
                  )}
                </div>
              </div>
                    
              <div className="mt-12">
                <div className="my-4">
                  <h2 className="font-bold text-xl text-black">Document</h2>
                </div>

                <div className="flex flex-col gap-4 items-center">
                  {/* pan image */}
                  <div className="w-full">
                    <div className="my-2 relative">
                      <label
                        htmlFor="formFile"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Upload Image For Pan
                      </label>
                      <input
                        ref={inputFileRef}
                        className="relative m-0 block w-full min-w-0 flex-auto rounded-full border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                        type="file"
                        id="formFile"
                        onChange={handleFileChange}
                      />

                      <div
                        className={`absolute top-7 right-0 ${
                          selectedImagePan ? "block" : "hidden"
                        }`}
                      >
                        {loading ? (
                          <Spin
                            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                            className="p-2 px-4 bg-black text-white font-semibold rounded-r-full"
                          />
                        ) : (
                          <button
                            className="p-2 px-4 bg-black text-white font-semibold rounded-r-full"
                            // onClick={desktopOfferImage}
                            disabled={loading}
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3" id="preview">
                      {panImage && (
                        <div style={{ position: "relative" }}>
                          <img
                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + panImage}
                            alt="Preview"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            onClick={openModal}
                          />
                          <button
                            type="button"
                            name="deleteButton"
                            className="absolute top-0 right-0 p-1 text-xs bg-red-500 text-white"
                            // onClick={() => deleteImage(panImage)}
                          >
                            X
                          </button>
                        </div>
                      )}
                    </div>

                    <Modal open={modalVisible} onCancel={closeModal} footer={null}>
                      {selectedImagePan && (
                        <img
                          src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + panImage}
                          alt="Preview"
                          style={{ width: "100%", height: "auto" }}
                        />
                      )}
                    </Modal>
                  </div>

                  {/* Aadhar image */}
                  <div className="w-full">
                    <div className="my-2 relative">
                      <label
                        htmlFor="formFile"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Upload Image For Aadhar
                      </label>
                      <input
                        ref={inputFileRef}
                        className="relative m-0 block w-full min-w-0 flex-auto rounded-full border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                        type="file"
                        id="formFile"
                        onChange={handleAadharFileChange}
                      />

                      <div
                        className={`absolute top-7 right-0 ${
                          selectedImageAadhar ? "block" : "hidden"
                        }`}
                      >
                        {loading ? (
                          <Spin
                            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                            className="p-2 px-4 bg-black text-white font-semibold rounded-r-full"
                          />
                        ) : (
                          <button
                            className="p-2 px-4 bg-black text-white font-semibold rounded-r-full"
                            // onClick={desktopOfferImage}
                            disabled={loading}
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3" id="preview">
                      {aadharImage && (
                        <div style={{ position: "relative" }}>
                          <img
                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + aadharImage}
                            alt="Preview"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            onClick={openModalAadhar}
                          />
                          <button
                            type="button"
                            name="deleteButton"
                            className="absolute top-0 right-0 p-1 text-xs bg-red-500 text-white"
                            // onClick={() => deleteImage(aadharImage)}
                          >
                            X
                          </button>
                        </div>
                      )}
                    </div>

                    <Modal open={modalVisible} onCancel={closeModalAadhar} footer={null}>
                      {selectedImageAadhar && (
                        <img
                          src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + aadharImage}
                          alt="Preview"
                          style={{ width: "100%", height: "auto" }}
                        />
                      )}
                    </Modal>
                  </div>

                  {/* Shop act image */}
                  <div className="w-full">
                    <div className="my-2 relative">
                      <label
                        htmlFor="formFile"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Upload Image For Shop Act
                      </label>
                      <input
                        ref={inputFileRef}
                        className="relative m-0 block w-full min-w-0 flex-auto rounded-full border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                        type="file"
                        id="formFile"
                        onChange={handleShopActFileChange}
                      />

                      <div
                        className={`absolute top-7 right-0 ${
                          selectedImageShopAct ? "block" : "hidden"
                        }`}
                      >
                        {loading ? (
                          <Spin
                            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                            className="p-2 px-4 bg-black text-white font-semibold rounded-r-full"
                          />
                        ) : (
                          <button
                            className="p-2 px-4 bg-black text-white font-semibold rounded-r-full"
                            // onClick={desktopOfferImage}
                            disabled={loading}
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3" id="preview">
                      {shopActImage && (
                        <div style={{ position: "relative" }}>
                          <img
                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + shopActImage}
                            alt="Preview"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            onClick={openModalShopAct}
                          />
                          <button
                            type="button"
                            name="deleteButton"
                            className="absolute top-0 right-0 p-1 text-xs bg-red-500 text-white"
                            // onClick={() => deleteImage(shopActImage)}
                          >
                            X
                          </button>
                        </div>
                      )}
                    </div>

                    <Modal open={modalVisible} onCancel={closeModalShopAct} footer={null}>
                      {selectedImageShopAct && (
                        <img
                          src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + shopActImage}
                          alt="Preview"
                          style={{ width: "100%", height: "auto" }}
                        />
                      )}
                    </Modal>
                  </div>
                </div>
              </div>

              {/* submit button */}
              <button
                type="submit"
                className="w-full py-1 mt-6 text-white bg-black hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                // onClick={handleSubmit}
                disabled={loading === true}
              >
                {loading ? <Spin indicator={antIcon} className="text-white" /> : "Submit"}
              </button>
            </form>
            <ToastContainer />
          </div>
          {/* <Footer /> */}
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default VendorAdd;
