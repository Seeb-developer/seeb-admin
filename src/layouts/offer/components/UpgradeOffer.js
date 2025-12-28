// @mui material components
import Card from "@mui/material/Card";
import { apiCall } from "utils/apiClient";
import { Divider, Modal, Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import NontAuthorized401 from "NontAuthorized401";
import { DatePicker } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
let index = 0;

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Option } = Select;

function UpgradeOffer() {
  let Navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const inputFileRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imagesArray, setImagesArray] = useState([]);
  const [mobileImagesArray, setMobileImagesArray] = useState([]);
  const [imageSources, setImageSources] = useState([]);
  const [mobileImageSources, setMobileImageSources] = useState([]);
  const [mobileSelectedImage, setMobileSelectedImage] = useState(null);
  const [mobileSelectedFile, setMobileSelectedFile] = useState([]);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [indexing, setIndexing] = useState("");
  const [couponExpiry, setCouponExpiry] = useState("");
  const [upperSection, setUpperSection] = useState("");
  const [lowerSection, setLowerSection] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [offerStartDate, setOfferStartDate] = useState(null);
  const [offerEndDate, setOfferEndDate] = useState(null);
  const [mobileBanner, setMobileBanner] = useState(null);
  const [webBanner, setWebBanner] = useState(null);
  const [offerId, setOfferId] = useState(searchParam.get("slug"));

  const handleSectionChange = (value) => {
    // if (value === "upper") {
    //   setUpperSection("Upper Section");
    //   setLowerSection("");
    // } else if (value === "lower") {
    //   setLowerSection("Lower Section");
    //   setUpperSection("");
    // }
    setSelectedSection(value);
  };

  const getData = (result) => {
    let data = result.offers;
    setName(data.offer_title);
    setLink(data.offer_link);
    setIndexing(data.offer_index);
    setOfferStartDate(dayjs(data.offer_start_date));
    setOfferEndDate(dayjs(data.offer_end_date));
    setMobileBanner(data.offer_mobile_path);
    setWebBanner(data.offer_web_path);
    if (data.offer_group == "1") {
      setSelectedSection("upper");
    } else {
      setSelectedSection("lower");
    }
  };

  // get by id
  const getDatabyId = async () => {
    try {
      const result = await apiCall({ endpoint: `Offers/getOffersById/${searchParam.get("slug")}`, method: "GET" });
      getData(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getDatabyId();
  }, []);

  useEffect(() => {
    getDatabyId();
  }, [searchParam.get("slug")]);

  //
  // for banner image
  //
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  //
  // for mobile image
  //
  const handleFileChangeMobile = (e) => {
    const file = e.target.files[0];
    setMobileSelectedImage(file);
  };

  const removeItem = (index) => {
    const updatedImageSources = imageSources.filter((_, i) => i !== index);
    setImageSources(updatedImageSources);
    const updatedImagesArray = imagesArray.filter((_, i) => i !== index);
    setImagesArray(updatedImagesArray);
  };

  const removeItemMobile = (index) => {
    const updatedMobileImageSources = mobileImageSources.filter((_, i) => i !== index);
    setMobileImageSources(updatedMobileImageSources);
    const updatedMobileImagesArray = mobileImagesArray.filter((_, i) => i !== index);
    setMobileImagesArray(updatedMobileImagesArray);
  };

  const openModal = () => {
    setModalVisible(true);
  };
  const openMobileModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const closeMobileModal = () => {
    setModalVisible(false);
  };

  //
  //
  // api for OFFER image
  const desktopOfferImage = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedImage) {
      // Handle the case where no image is selected
      setLoading(false);
      return;
    }

    var formdata = new FormData();
    formdata.append("image_banner", selectedImage);
    formdata.append("device", "1");

    try {
      const result = await apiCall({ endpoint: 'Offers/createOffersImage', method: 'POST', data: formdata });
      setWebBanner(result?.data?.Offers_image);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  //
  //
  // api for mobile banner image
  const mobileBannerImage = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!mobileSelectedImage) {
      // Handle the case where no image is selected
      setLoading(false);
      return;
    }

    var formdata = new FormData();
    formdata.append("image_banner", mobileSelectedImage);
    formdata.append("device", "2");

    try {
      const result = await apiCall({ endpoint: 'Offers/createOffersImage', method: 'POST', data: formdata });
      setMobileBanner(result?.data?.Offers_image);
    } catch (error) {
      console.log("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  //
  // Delete Image Api
  //
  const deleteImage = async (id, webBanner) => {
    try {
      const result = await apiCall({ endpoint: 'Offers/deleteOfferImage', method: 'DELETE', data: { image_banner: webBanner, id: searchParam.get("slug"), device: 1 } });
      setWebBanner(null);
    } catch (error) {
      console.log("error", error);
    }
  };

  //
  // Delete Mobile Image Api
  //
  const deleteMobileImage = async(id, mobileBanner) => {
    try {
      const result = await apiCall({ endpoint: 'Offers/deleteOfferImage', method: 'DELETE', data: { image_banner: mobileBanner, id: searchParam.get("slug"), device: 2 } });
      setMobileBanner(null);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAddOffer = async(e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        offer_group: selectedSection === "upper" ? "1" : "2",
        offer_title: name,
        offer_link: link,
        offer_index: indexing,
        offer_start_date: offerStartDate ? offerStartDate.toISOString() : "",
        offer_end_date: offerEndDate ? offerEndDate.toISOString() : "",
        offer_web_path: webBanner,
        offer_mobile_path: mobileBanner,
      };
      const result = await apiCall({ endpoint: `Offers/updateOffers/${searchParam.get("slug")}`, method: 'PUT', data: payload });
      if (result.status === 200) {
        setLoading(false);
        toast.success("Offer updated successfully", {
          theme: "light",
          autoClose: "2000",
        });
        Navigate("/list-offer");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {localStorage.getItem("Token") ? (
        <>
          <div className="bg-white rounded-lg">
            <form className="p-4 md:p-5 lg:p-5 xl:p-5">
              <div className="">
                <label htmlFor="productName" className="block text-gray-700 font-semibold ">
                  Offer Title
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter offer title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-2 py-0.5 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                />
              </div>
              <div className="my-4">
                <label htmlFor="coupnExpiry" className="block text-gray-700 font-semibold ">
                  Coupon Expiry
                </label>
                <RangePicker
                  className="w-full mt-1 px-4 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
                  value={[offerStartDate, offerEndDate]}
                  onChange={(dates) => {
                    setOfferStartDate(dates[0]);
                    setOfferEndDate(dates[1]);
                  }}
                />
                {/* {console.log('date',couponExpiry)} */}
              </div>

              {/* for desktop */}
              <div className="my-10">
                <div key={index} className="flex flex-col gap-4 items-center">
                  {/* desktop image */}
                  <div className="w-full">
                    <div className="mb-3 relative">
                      <label
                        htmlFor="formFile"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Upload Offer Image For Desktop
                      </label>
                      <input
                        ref={inputFileRef}
                        className="relative m-0 block w-full min-w-0 flex-auto rounded-full border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                        type="file"
                        id="formFile"
                        onChange={handleFileChange}
                      />

                      <div
                        className={`absolute top-7 right-0 ${selectedImage ? "block" : "hidden"}`}
                      >
                        {loading ? (
                          <Spin
                            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                            className="p-2 px-4 bg-black text-white font-semibold rounded-r-full"
                          />
                        ) : (
                          <button
                            className="p-2 px-4 bg-black text-white font-semibold rounded-r-full"
                            onClick={desktopOfferImage}
                            disabled={loading}
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3" id="preview">
                      {webBanner && (
                        <div style={{ position: "relative" }}>
                          <img
                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + webBanner}
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
                            onClick={() => deleteImage(webBanner)}
                          >
                            X
                          </button>
                        </div>
                      )}
                    </div>

                    <Modal open={modalVisible} onCancel={closeModal} footer={null}>
                      {selectedImage && (
                        <img
                          src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + webBanner}
                          alt="Preview"
                          style={{ width: "100%", height: "auto" }}
                        />
                      )}
                    </Modal>
                  </div>

                  {/* mobile image */}
                  <div className="w-full">
                    <div className="mb-3 relative">
                      <label
                        htmlFor="formFile"
                        className="block mb-2 text-sm font-medium text-gray-900"
                      >
                        Upload Offer Images For Mobile
                      </label>
                      <input
                        ref={inputFileRef}
                        className="relative m-0 block w-full min-w-0 flex-auto rounded-full border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                        type="file"
                        id="formFile"
                        onChange={handleFileChangeMobile}
                      />

                      <div
                        className={`absolute top-7 right-0 ${
                          mobileSelectedImage ? "block" : "hidden"
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
                            onClick={mobileBannerImage}
                            disabled={loading}
                            //   style={{
                            //     display: mobileSelectedFile[0] === undefined ? "none" : "block",
                            //   }}
                          >
                            Upload
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3" id="preview">
                      {/* Render existing images */}
                      {mobileBanner && (
                        <div style={{ position: "relative" }}>
                          <img
                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + mobileBanner}
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
                            onClick={() => deleteMobileImage(mobileBanner)}
                          >
                            X
                          </button>
                        </div>
                      )}
                    </div>

                    <Modal open={modalVisible} onCancel={closeMobileModal} footer={null}>
                      {mobileSelectedImage && (
                        <img
                          src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + mobileBanner}
                          alt="Preview"
                          style={{ width: "100%", height: "auto" }}
                        />
                      )}
                    </Modal>
                  </div>

                  {/* for link of web img */}
                  <div className="w-full ">
                    <label htmlFor="link" className="block mb-2 text-sm font-medium text-gray-900 ">
                      Link
                    </label>
                    <input
                      type="text"
                      id="link"
                      name="link"
                      placeholder="Enter link"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full px-4 py-1 border rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                    />
                  </div>

                  {/* index for images */}
                  <div className="w-full ">
                    <label
                      htmlFor="index"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Index
                    </label>
                    <input
                      type="text"
                      id="indexing"
                      name="indexing"
                      placeholder="Enter Index"
                      value={indexing}
                      onChange={(e) => setIndexing(e.target.value)}
                      className="w-full px-4 py-1 border rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="category"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Offer Section
                    </label>
                    <Select
                      id="section"
                      className="w-full"
                      value={selectedSection}
                      onChange={handleSectionChange}
                    >
                      <Option value="upper">Upper Section</Option>
                      <Option value="lower">Lower Section</Option>
                    </Select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="text-white mt-4 bg-black transition-all hover:scale-110 ease-in-out duration-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                onClick={handleAddOffer}
                disabled={loading}
              >
                {loading ? <Spin indicator={antIcon} className="text-white" /> : "Update Offer"}
              </button>
              {/* {loading && } */}
            </form>
          </div>
          <ToastContainer />
        </>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default UpgradeOffer;
