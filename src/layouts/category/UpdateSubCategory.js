// @mui material components
import Card from "@mui/material/Card";
import { Divider, Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
// import Loader from "components/Loader/Loader";
// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import NontAuthorized401 from "NontAuthorized401";
import { apiCall } from "utils/apiClient";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Option } = Select;

function UpdateSubCategory() {
  let Navigate = useNavigate();
  const [searchParam] = useSearchParams();

  let data = JSON.parse(searchParam.get("data"));

  useEffect(() => {
    if (data) {
      setSelectedCategory(data.home_zone_appliances_id);
      setName(data.title);
      setImageUrl(data.image);
      setSelectedImage(data.image)
      setPath(data.image);
    }
  }, []);

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(imageUrl);
  const [newlyUploadedImage, setNewlyUploadedImage] = useState(null); // New state for newly uploaded image
  const [path, setPath] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryChange = (event) => {
    setSelectedCategory(event);
  };

  // Get Categories API
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
      const result = await apiCall({ endpoint: "admin/updateHomeZoneSubCategoryImage", method: "POST", data: formdata });
      setPath(result.image_path);
      setImageUrl(result.image_path);
      setSelectedImage("");
    } catch (error) {
      console.log("error", error);
    }
  };


  const handleImageDelete = (e) => {
    e.target.value = null;
    setSelectedImage(null);
    setNewlyUploadedImage(null);
    setImageUrl(null);
  };

  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");

  // update categories api
  const handleUpdateSubCategory = async (e) => {
    e.preventDefault();
    setNameError("");
    setImageError("");
    if (name === "") {
      setNameError("please enter category name");
    } else if (selectedImage === null) {
      setImageError("please set image for category");
    } else {
      setLoading(true);
      var formdata = new FormData();
      formdata.append("title", name);
      formdata.append("home_zone_appliances_id", selectedCategory);
      formdata.append("image", path);
      // console.log("name=>", name);
      // console.log("path=>", path);
      // console.log("selectedImage=>", selectedImage);
      // console.log("newlyUploadedImage=>", newlyUploadedImage);
      var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      try {
        const result = await apiCall({ endpoint: `admin/updateHomeZoneCaterory/${data.id}`, method: "POST", data: formdata });
        if (result.success) {
          setName("");
          setSelectedImage("");
          setImageUrl("");
          setNewlyUploadedImage(null);
          setPath("");
        }
        if (result.status === 200) {
          setLoading(false);
          toast.success("Category Updated Successfully", {
            theme: "light",
            autoClose: 3000,
          });
          Navigate("/list-sub-category");
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

  return (
    <>
    {localStorage.getItem("Token") ? (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="bg-white rounded-lg">
        <form className="p-4 md:p-5 lg:p-5 xl:p-5">
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
              Product Category
            </label>
            <Select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full"
            >
              {!selectedCategory && (
                <Option value="" disabled>
                  Select Category
                </Option>
              )}
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.title}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              Enter Category Name
            </label>
            <input
              type="text"
              id="email"
              className={`${
                nameError
                  ? "border border-red-500 placeholder:text-red-500"
                  : "border border-gray-300"
              } bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
              placeholder="category name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            {nameError && <div className="error-message text-xs text-red-500 p-1">{nameError}</div>}
          </div>
          <div className="mb-6">
            <label htmlFor="formFile" className="block mb-2 text-sm font-medium text-gray-900">
              Upload Category Images
            </label>
            <div className="relative">
              <input
                className="relative m-0 block w-full min-w-0 flex-auto rounded-full border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                id="formFile"
                onChange={(e) => handleImageUpload(e)}
              />
              {selectedImage ? (
                <button
                  className="text-sm bg-black font-semibold text-white p-[8px] rounded-r-full absolute top-0 right-0"
                  onClick={imageUpload}
                >
                  Upload
                </button>
              ) : (
                false
              )}
            </div>
            {/* {console.log(selectedImage?.name)} */}
            {imageError && <div className="text-xs text-red-500 p-1">{imageError}</div>}
            {
              <div className="relative">
                <img
                  src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + imageUrl}
                  alt="Preview"
                  className="my-4 w-40 h-40 object-cover"
                />
                {/* {console.log(process.env.REACT_APP_HAPS_MAIN_BASE_URL)} */}
                <div className="bg-white p-0.5 m-1 rounded-md absolute top-0 left-32">
                  <RxCross2
                    className="text-red-500 cursor-pointer"
                    onClick={(e) => handleImageDelete(e)}
                  />
                </div>
              </div>
            }
          </div>
          <Divider />
          <button
            type="submit"
            className="text-white bg-black transition-all hover:scale-110 ease-in-out duration-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={handleUpdateSubCategory}
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

export default UpdateSubCategory;
