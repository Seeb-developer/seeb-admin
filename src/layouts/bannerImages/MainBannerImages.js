// @mui material components
import Card from "@mui/material/Card";
import { Divider, Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState, useRef } from "react";
import { apiCall } from "utils/apiClient";
import { AiOutlinePlus } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import NontAuthorized401 from "NontAuthorized401";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function MainBannerImages() {
  let Navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [descriptionInputFields, setDescriptionInputFields] = useState([]);
  const [featuresInputFields, setFeaturesInputFields] = useState([]);
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
  const [data, setData] = useState("");

  const renderBanners = async (result) => {
    // Banner rendering
    let banners = result.data;
    let webBanners = [];
    let newImagesArray = [];
    let newMobileImagesArray = [];
    let mobileBanners = [];
    banners?.map((banner) => {
      let newBanner = {
        id: banner.id,
        device: banner.device,
        image_index: banner.image_index,
        path: banner.path,
      };
      if (banner.device == 1) {
        webBanners.push(banner.path);
        newImagesArray.push(newBanner);
      } else {
        mobileBanners.push(banner.path);
        newMobileImagesArray.push(newBanner);
      }
    });
    setImageSources(webBanners);
    setMobileImageSources(mobileBanners);
    setImagesArray(newImagesArray);
    setMobileImagesArray(newMobileImagesArray);
  };
  const getData = async () => {
    try {
      const result = await apiCall({ endpoint: "banner/getMainBanner", method: "GET" });
      renderBanners(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const appendImage = (image) => {
    image.image_index = imagesArray.length;
    image.path = image.banner_image;
    image.device = 1;
    image.id = null;
    delete image.banner_image;
    imagesArray.push(image);
    var imagePath = image.path;
    const newImageSource = imagePath;
    setImageSources([...imageSources, newImageSource]);
  };

  const appendMobileImage = (image) => {
    image.image_index = mobileImagesArray.length;
    image.path = image.banner_image;
    image.device = 2;
    image.id = null;
    delete image.banner_image;
    mobileImagesArray.push(image);
    var imagePath = image.path;
    const newMobileImageSource = imagePath;
    setMobileImageSources([...mobileImageSources, newMobileImageSource]);
  };

  const [enableButton, setEnablebutton] = useState(false);
  //
  // for banner image
  //
  const handleFileChange = (e) => {
    const files = e.target.files;
    const selectedFiles = Array.from(files);
    setSelectedFiles(selectedFiles);

    const deleteFile = (index) => {
      const updatedFiles = [...selectedFiles];
      updatedFiles.splice(index, 1);
      setSelectedFiles(updatedFiles);

      const updatedPreviewImages = [...previewImages];
      updatedPreviewImages.splice(index, 1);
      setPreviewImages(updatedPreviewImages);
    };

    const previewImages = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const reader = new FileReader();

      reader.onloadend = () => {
        previewImages.push(reader.result);
        if (previewImages.length === selectedFiles.length) {
          setPreviewImages(previewImages);
        }
      };

      reader.readAsDataURL(file);
    }
    setEnablebutton(true);
  };

  //
  // for mobile image
  //
  const handleFileChangeMobile = (e) => {
    const files = e.target.files;
    const mobileSelectedFile = Array.from(files);
    setMobileSelectedFile(mobileSelectedFile);

    const deleteFile = (index) => {
      const updatedFiles = [...mobileSelectedFile];
      updatedFiles.splice(index, 1);
      setMobileSelectedFile(updatedFiles);

      const updatedPreviewImages = [...previewImages];
      updatedPreviewImages.splice(index, 1);
      setPreviewImages(updatedPreviewImages);
    };

    const previewImages = [];
    for (let i = 0; i < mobileSelectedFile.length; i++) {
      const file = mobileSelectedFile[i];
      const reader = new FileReader();

      reader.onloadend = () => {
        previewImages.push(reader.result);
        if (previewImages.length === mobileSelectedFile.length) {
          setPreviewImages(previewImages);
        }
      };

      reader.readAsDataURL(file);
    }
    setEnablebutton(true);
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

  const openModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };
  const openMobileModal = (image) => {
    setMobileSelectedImage(image);
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
  // api for banner image
  const desktopBannerImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    var formdata = new FormData();
    formdata.append("path", selectedFiles[0]);
    try {
      const result = await apiCall({ endpoint: "/banner/createBannerImage", method: "POST", data: formdata });
      appendImage(result.data);
      setSelectedImage("");
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
    var formdata = new FormData();
    formdata.append("path", mobileSelectedFile[0]);
    try {
      const result = await apiCall({ endpoint: "/banner/createBannerImage", method: "POST", data: formdata });
      appendMobileImage(result.data);
      setMobileSelectedImage("");
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  //
  // Delete Image Api
  //
  const deleteImage = async (index) => {
    const imageId = imagesArray[index].id;
    try {
      const result = await apiCall({ endpoint: `/banner/deleteBanner/${imageId}`, method: "DELETE" });
      console.log("Image deleted successfully:", result);
      removeItem(index);
    } catch (error) {
      console.log("Error deleting image:", error);
    }
  };

  //
  // Delete Mobile Image Api
  //
  const deleteMobileImage = async (index) => {
    const imageId = mobileImagesArray[index].id;
    try {
      const result = await apiCall({ endpoint: `/banner/deleteBanner/${imageId}`, method: "DELETE" });
      console.log("Image deleted successfully:", result);
      removeItemMobile(index);
    } catch (error) {
      console.log("Error deleting image:", error);
    }
  };

  //
  // add banner api
  //
  const addBanner = async (e) => {
    e.preventDefault();
    var formdata = new FormData();
    let allBanners = imagesArray.concat(mobileImagesArray);
    formdata.append("banner_image", JSON.stringify(allBanners));

    try {
      const result = await apiCall({ endpoint: "banner/createMainBanner", method: "POST", data: formdata });
      console.log(result);
      if (result.status === 200) {
        getData();
        setLoading(false);
        setSelectedFiles([]);
        setMobileSelectedFile([]);
        setPreviewImages([]);
        setImageSources([]);
        setMobileImageSources([]);
        setImagesArray([]);
        setMobileImagesArray([]);
        toast.success("Banners Added Successfully", {
            theme: "light",
            autoClose: 3000,
          });
          // Navigate("/list-category");
        } else {
          toast.error("Something Went Wrong", {
            theme: "light",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.log("error", error);
      }
  };
  setTimeout(() => {
    setLoading(false);
  }, 3000);

  // drag n drop
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const dragStart = (e, position) => {
    dragItem.current = position;
    console.log(e.target.innerHTML);
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    console.log(e.target.innerHTML);
  };

  const drop = () => {
    const copyImageSources = [...imageSources];
    const dragItemContent = copyImageSources[dragItem.current];
    copyImageSources.splice(dragItem.current, 1);
    copyImageSources.splice(dragOverItem.current, 0, dragItemContent);
    var currentIndex = dragItem.current;
    var dropIndex = dragOverItem.current;
    setImageSources(copyImageSources);
    imagesArray[currentIndex].image_index = dropIndex;
    if (dropIndex < currentIndex) {
      while (dropIndex != currentIndex) {
        imagesArray[dropIndex].image_index = ++dropIndex;
      }
    } else {
      while (dropIndex != currentIndex) {
        imagesArray[dropIndex].image_index = --dropIndex;
      }
    }

    const copyImageArray = [...imagesArray];
    const dragImageContent = copyImageArray[dragItem.current];
    copyImageArray.splice(dragItem.current, 1);
    copyImageArray.splice(dragOverItem.current, 0, dragImageContent);
    setImagesArray(copyImageArray);

    currentIndex = dropIndex = 0;

    dragItem.current = null;
    dragOverItem.current = null;

    // Update imagesarray
    // const copyImagesArray = [...imagesArray];
  };

  //
  //
  // drag n drop for mobile devices
  const dragItemMobile = useRef(null);
  const dragOverItemMobile = useRef(null);
  const dragStartMobile = (e, position) => {
    dragItemMobile.current = position;
    console.log(e.target.innerHTML);
  };

  const dragEnterMobile = (e, position) => {
    dragOverItemMobile.current = position;
    console.log(e.target.innerHTML);
  };

  const dropMobile = () => {
    const copyMobileImageSources = [...mobileImageSources];
    const dragItemMobileContent = copyMobileImageSources[dragItemMobile.current];
    copyMobileImageSources.splice(dragItemMobile.current, 1);
    copyMobileImageSources.splice(dragOverItemMobile.current, 0, dragItemMobileContent);
    var currentIndex = dragItemMobile.current;
    var dropIndex = dragOverItemMobile.current;
    setMobileImageSources(copyMobileImageSources);
    mobileImagesArray[currentIndex].image_index = dropIndex;
    if (dropIndex < currentIndex) {
      while (dropIndex != currentIndex) {
        mobileImagesArray[dropIndex].image_index = ++dropIndex;
      }
    } else {
      while (dropIndex != currentIndex) {
        mobileImagesArray[dropIndex].image_index = --dropIndex;
      }
    }

    const copyImageArray = [...mobileImagesArray];
    const dragImageContent = copyImageArray[dragItemMobile.current];
    copyImageArray.splice(dragItemMobile.current, 1);
    copyImageArray.splice(dragOverItemMobile.current, 0, dragImageContent);
    setMobileImagesArray(copyImageArray);

    currentIndex = dropIndex = 0;

    dragItemMobile.current = null;
    dragOverItemMobile.current = null;

    // Update imagesarray
    // const copyImagesArray = [...imagesArray];
  };

  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />
          {console.log(descriptionInputFields)}
          <div className="bg-white rounded-lg">
            <form className="p-4 md:p-5 lg:p-5 xl:p-5">
              {/* banner image */}
              <div className="mt-4">
                <div className="mb-3 relative">
                  <label
                    htmlFor="formFile"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Upload Banner Images
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
                      selectedFiles[0] === undefined ? "hidden" : "block"
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
                        onClick={desktopBannerImage}
                        disabled={loading}
                        style={{ display: selectedFiles[0] === undefined ? "none" : "block" }}
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-3" id="preview">
                  {/* Render existing images */}
                  {imageSources?.map((source, index) => (
                    <div
                      key={index}
                      style={{ position: "relative" }}
                      draggable
                      onDragStart={(e) => dragStart(e, index)}
                      onDragEnter={(e) => dragEnter(e, index)}
                      onDragEnd={drop}
                    >
                      <img
                        src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + source}
                        alt={`Preview ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => openModal(source)}
                      />
                      <button
                        type="button"
                        name="deleteButton"
                        className="absolute top-0 right-0 p-1 text-xs bg-red-500 text-white"
                        onClick={() => deleteImage(index)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>

                <Modal open={modalVisible} onCancel={closeModal} footer={null}>
                  <img
                    src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + selectedImage}
                    alt="Preview"
                    style={{ width: "100%", height: "auto" }}
                  />
                </Modal>
              </div>

              {/* for mobile */}
              <div className="mt-4">
                <div className="mb-3 relative">
                  <label
                    htmlFor="formFile"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Upload Banner Images for mobile
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
                      mobileSelectedFile[0] === undefined ? "hidden" : "block"
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
                        style={{ display: mobileSelectedFile[0] === undefined ? "none" : "block" }}
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-3" id="preview">
                  {/* Render existing images */}
                  {mobileImageSources?.map((source, index) => (
                    <div
                      key={index}
                      style={{ position: "relative" }}
                      draggable
                      onDragStart={(e) => dragStartMobile(e, index)}
                      onDragEnter={(e) => dragEnterMobile(e, index)}
                      onDragEnd={dropMobile}
                    >
                      <img
                        src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + source}
                        alt={`Preview ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => openMobileModal(source)}
                      />
                      <button
                        type="button"
                        name="deleteButton"
                        className="absolute top-0 right-0 p-1 text-xs bg-red-500 text-white"
                        onClick={() => deleteMobileImage(index)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>

                <Modal open={modalVisible} onCancel={closeMobileModal} footer={null}>
                  <img
                    src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + mobileSelectedImage}
                    alt="Preview"
                    style={{ width: "100%", height: "auto" }}
                  />
                </Modal>
              </div>
              {enableButton && (
                <button
                  type="submit"
                  className="text-white mt-4 bg-black transition-all hover:scale-110 ease-in-out duration-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                  onClick={addBanner}
                  disabled={loading}
                >
                  {loading ? <Spin indicator={antIcon} className="text-white" /> : "Update Banners"}
                </button>
              )}
              {/* {loading && } */}
            </form>
          </div>
          <ToastContainer />
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default MainBannerImages;
