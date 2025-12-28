// @mui material components
import Card from "@mui/material/Card";
import { Divider, Spin, Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
// import Loader from "components/Loader/Loader";
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
import { useLayoutEffect } from "react";
import NontAuthorized401 from "NontAuthorized401";
import { apiCall } from "utils/apiClient";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function UpdateCategory() {
  let Navigate = useNavigate();

  const [searchParam] = useSearchParams();
  const [id, setId] = useState(searchParam.get("id"));
  const [slug, setSlug] = useState(searchParam.get("slug"));
  const [name, setName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [descriptionInputFields, setDescriptionInputFields] = useState([]);
  const [featuresInputFields, setFeaturesInputFields] = useState([]);
  const [newlyUploadedImage, setNewlyUploadedImage] = useState(null); // New state for newly uploaded image
  const [path, setPath] = useState("");
  const inputFileRef = useRef(null);
  const [desktopSelectedImage, setDesktopSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imagesArray, setImagesArray] = useState([]);
  const [mobileImagesArray, setMobileImagesArray] = useState([]);
  const [imageSources, setImageSources] = useState([]);
  const [mobileImageSources, setMobileImageSources] = useState([]);
  const [mobileSelectedImage, setMobileSelectedImage] = useState(null);
  const [mobileSelectedFile, setMobileSelectedFile] = useState([]);

  const appendDesktopImage = (image) => {
    image.image_index = imagesArray.length;
    image.path = image.banner_image;
    image.device = 1;
    image.id = null;
    delete image.banner_image;
    imagesArray.push(image);
    var imagePath = image.path;
    const newImageSource = imagePath; // Replace "image.jpg" with the actual source of the new image
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
    const newMobileImageSource = imagePath; // Replace "image.jpg" with the actual source of the new image
    setMobileImageSources([...mobileImageSources, newMobileImageSource]);
  };
  // console.log("mob", mobileImagesArray);

  // console.log('desc' , descriptionInputFields);
  // Prefilled data
  const preFillData = async (result) => {
    let data = result.Data;
    setName(data.title);
    setDescriptionInputFields(JSON.parse(data.description));
    setFeaturesInputFields(JSON.parse(data.features));
    setSelectedImage(data.image);
    setImageUrl(data.image);

    // Banner rendering
    let banners = result.Banners;
    let webBanners = [];
    let newImagesArray = [];
    let newMobileImagesArray = [];
    let mobileBanners = [];
    banners.map((banner) => {
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
    // setPath(data.image);
  };

  //
  // get by id
  //
  const [getData, setGetData] = useState([]);
  const getById = async () => {
    try {
      const result = await apiCall({ endpoint: `admin/getHomeZoneAppliancesById/${searchParam.get("slug")}`, method: "GET" });
      console.log(result);
      setId(result.Data.id);
      preFillData(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getById();
  }, []);

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

  const closeModal = () => {
    setModalVisible(false);
  };

  const openDesktopModal = (image) => {
    setDesktopSelectedImage(image);
    setModalVisible(true);
  };
  const openMobileModal = (image) => {
    setMobileSelectedImage(image);
    setModalVisible(true);
  };

  const closeDesktopModal = () => {
    setModalVisible(false);
  };
  const closeMobileModal = () => {
    setModalVisible(false);
  };

  const handleAddDescriptionFields = (e) => {
    e.preventDefault();
    setDescriptionInputFields([...descriptionInputFields, ""]);
  };

  const handleRemoveDescriptionFields = (index) => {
    const updatedFields = [...descriptionInputFields];
    updatedFields.splice(index, 1);
    setDescriptionInputFields(updatedFields);
  };

  const handleChangeDescriptionInput = (index, event) => {
    const updatedFields = [...descriptionInputFields];
    updatedFields[index] = event.target.value;
    setDescriptionInputFields(updatedFields);
  };

  const handleAddFeaturesFields = (e) => {
    e.preventDefault();
    setFeaturesInputFields([...featuresInputFields, ""]);
  };

  const handleRemoveFeaturesFields = (index) => {
    const updatedFields = [...featuresInputFields];
    updatedFields.splice(index, 1);
    setFeaturesInputFields(updatedFields);
  };

  const handleChangeFeaturesInput = (index, event) => {
    const updatedFields = [...featuresInputFields];
    updatedFields[index] = event.target.value;
    setFeaturesInputFields(updatedFields);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  // image upload api
  const imageUpload = async (e) => {
    e.preventDefault();
    var formdata = new FormData();
    formdata.append("image", selectedImage);

    try {
      const result = await apiCall({ endpoint: "admin/updateHomeZoneCategoryImage", method: "POST", data: formdata });
      setImageUrl(result.image_path);
      setSelectedImage("");
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleImageDelete = async (e) => {
    e.target.value = null;
    try {
      const result = await apiCall({ endpoint: `/admin/deleteHomeZoneImage`, method: "DELETE", data: { path_128x128: imageUrl } });
      console.log(result);
      setSelectedImage(null);
      setImageUrl(null);
    } catch (error) {
      console.log("error", error);
    }
  };

  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");
  const [descriptionError, setDescriptionError] = useState(undefined);
  const [featureError, setFeatureError] = useState(undefined);

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
      appendDesktopImage(result.data);
      setDesktopSelectedImage("");
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
  const deleteImage = (index) => {
    const imageId = imagesArray[index].id;
    apiCall({ endpoint: `/banner/deleteBanner/${imageId}`, method: "DELETE" })
      .then((result) => {
        removeItem(index);
      })
      .catch((error) => console.log("Error deleting image:", error));
  };

  //
  // Delete Mobile Image Api
  //
  const deleteMobileImage = (index) => {
    const imageId = mobileImagesArray[index].id;
    apiCall({ endpoint: `/banner/deleteBanner/${imageId}`, method: "DELETE" })
      .then((result) => {
        removeItemMobile(index);
      })
      .catch((error) => console.log("Error deleting image:", error));
  };

  //
  // update categories api
  //
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setNameError("");
    setImageError("");
    if (name === "") {
      setNameError("please enter category name");
    } else if (selectedImage === null) {
      setImageError("please set image for category");
    } else if (featuresInputFields[0] === undefined) {
      setFeatureError("please enter some features for this category");
    } else if (descriptionInputFields[0] === undefined) {
      setDescriptionError("please enter little description for this category");
    } else {
      setLoading(true);
      var formdata = new FormData();
      formdata.append("title", name);
      formdata.append("features", JSON.stringify(featuresInputFields));
      formdata.append("description", JSON.stringify(descriptionInputFields));
      formdata.append("image", imageUrl);
      let allBanners = imagesArray.concat(mobileImagesArray);
      formdata.append("banner_image", JSON.stringify(allBanners));

      // console.log("name=>", name);
      // console.log("featuresInputFields=>", featuresInputFields);
      // console.log("descriptionInputFields=>", descriptionInputFields);
      // console.log("path=>", path);
      var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      try {
        const result = await apiCall({ endpoint: `admin/updateHomeZoneAppliances/${id}`, method: "POST", data: formdata });
        if (result.success) {
          setName("");
          setDescriptionInputFields([]);
          setFeaturesInputFields([]);
          setSelectedImage("");
          setImageUrl("");
          setNewlyUploadedImage(null);
          setPath("");
          setImageSources([]);
          setMobileImageSources([]);
          setImagesArray([]);
          setMobileImagesArray([]);
        }
        if (result.status === 200) {
          setLoading(false);
          toast.success("Category Updated Successfully", {
            theme: "light",
            autoClose: 3000,
          });
          Navigate("/list-category");
        } else {
          toast.error("Something Went Wrong", {
            theme: "light",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  // drag n drop
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const dragStart = (e, position) => {
    dragItem.current = position;
    // console.log(e.target.innerHTML);
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    // console.log(e.target.innerHTML);
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
    // console.log(e.target.innerHTML);
  };

  const dragEnterMobile = (e, position) => {
    dragOverItemMobile.current = position;
    // console.log(e.target.innerHTML);
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
          {/* {console.log(searchParam.get("slug"))} */}
          <DashboardNavbar />
          <div className="bg-white rounded-lg">
            <form className="p-4 md:p-5 lg:p-5 xl:p-5">
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                  Enter Category Name
                </label>
                <input
                  type="text"
                  id="email"
                  className={`${nameError
                      ? "border border-red-500 placeholder:text-red-500"
                      : "border border-gray-300"
                    } bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                  placeholder="category name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
                {nameError && (
                  <div className="error-message text-xs text-red-500 p-1">{nameError}</div>
                )}
              </div>
              <div className="mt-4">
                <div className="mb-3 relative">
                  <label
                    htmlFor="formFile"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Upload Category Images
                  </label>
                  <input
                    ref={inputFileRef}
                    className="relative m-0 block w-full min-w-0 flex-auto rounded-full border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                    type="file"
                    id="formFile"
                    onChange={(e) => handleImageUpload(e)}
                  />

                  <div
                    className={`absolute top-7 right-0 ${selectedImage === null ? "hidden" : "block"
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
                        onClick={imageUpload}
                        disabled={loading}
                        style={{ display: selectedImage === null ? "none" : "block" }}
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-3" id="preview">
                  {/* Render existing images */}
                  {imageUrl && (
                    <div className="relative">
                      {console.log(imageUrl)}
                      <img
                        src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + imageUrl}
                        alt={`Preview`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => openModal(imageUrl)}
                      />
                      <button
                        type="button"
                        name="deleteButton"
                        className="absolute top-0 right-0 p-1 text-xs bg-red-500 text-white"
                        onClick={(e) => handleImageDelete(e)}
                      >
                        X
                      </button>
                    </div>
                  )}
                </div>

                <Modal open={modalVisible} onCancel={closeModal} footer={null}>
                  <img
                    src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + selectedImage}
                    alt="Preview"
                    style={{ width: "100%", height: "auto" }}
                  />
                </Modal>
              </div>
              <div>
                <button
                  onClick={handleAddDescriptionFields}
                  className="bg-gray-50 text-sm p-2 rounded-lg border-2 w-full border-dotted my-4 flex justify-center gap-2 items-center"
                >
                  Add Description
                  <span>
                    <AiOutlinePlus className="text-black" />
                  </span>
                </button>
                {/* {descriptionError && <div className="text-xs text-red-500 p-1">{descriptionError}</div>} */}
                {descriptionInputFields && descriptionInputFields.length > 0
                  ? descriptionInputFields.map((input, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <textarea
                        type="text"
                        className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        rows={3}
                        value={descriptionInputFields}
                        placeholder="write Descriptions..."
                        onChange={(event) => handleChangeDescriptionInput(index, event)}
                      />
                      <RxCross2
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleRemoveDescriptionFields(index)}
                      />
                    </div>
                  ))
                  : null}
              </div>
              <Divider />
              <div>
                <button
                  onClick={handleAddFeaturesFields}
                  className="bg-gray-50 text-sm p-2 rounded-lg border-2 w-full border-dotted my-4 flex justify-center gap-2 items-center"
                >
                  Add Features
                  <span>
                    <AiOutlinePlus className="text-black" />
                  </span>
                </button>
                {featuresInputFields && featuresInputFields.length > 0
                  ? featuresInputFields.map((input, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        value={input.name}
                        placeholder="write Features..."
                        onChange={(event) => handleChangeFeaturesInput(index, event)}
                      />
                      <RxCross2
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleRemoveFeaturesFields(index)}
                      />
                    </div>
                  ))
                  : null}
              </div>
              <Divider />

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
                    className={`absolute top-7 right-0 ${selectedFiles[0] === undefined ? "hidden" : "block"
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
                  {imageSources.map((source, index) => (
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
                        onClick={() => openDesktopModal(source)}
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

                <Modal open={modalVisible} onCancel={closeDesktopModal} footer={null}>
                  <img
                    src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + desktopSelectedImage}
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
                    className={`absolute top-7 right-0 ${mobileSelectedFile[0] === undefined ? "hidden" : "block"
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
                  {mobileImageSources.map((source, index) => (
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

              <button
                type="submit"
                className="text-white bg-black transition-all hover:scale-110 ease-in-out duration-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-4"
                onClick={handleUpdateCategory}
                disabled={loading}
              >
                {loading ? <Spin indicator={antIcon} className="text-white" /> : "Update Category"}
              </button>
              {/* {console.log(handleUpdateCategory)} */}
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

export default UpdateCategory;
