// @mui material components
import Card from "@mui/material/Card";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
// import Footer from "examples/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsFilter } from "react-icons/bs";
import { Modal, Select } from "antd";
import NontAuthorized401 from "NontAuthorized401";
import ComplainList from "./components/ComplainList";

const { Option } = Select;

function Complain() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const [pageCount, setPageCount] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [productBrand, setProductBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [ComplaintsData, setComplaintsData] = useState([]);

  const handleCategoryChange = async (event) => {
    setSelectedCategory(event);
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        process.env.REACT_APP_HAPS_MAIN_BASE_URL + `admin/getHomeZoneCateroryByid/${event}`,
        requestOptions
      );
      const result = await response.json();
      setSubCategories(result.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }

    setSelectedSubCategory(null); // Reset sub-category when category changes
  };

  const handleSubCategoryChange = (event) => {
    setSelectedSubCategory(event);
  };

  // get brands
  useEffect(() => {
    const getBrandData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        const response = await fetch(
          process.env.REACT_APP_HAPS_MAIN_BASE_URL + "brand/getAllBrand",
          requestOptions
        );
        const result = await response.json();
        setProductBrand(result.Brand);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    getBrandData();
  }, []);

  const handleBrandChange = (event) => {
    setSelectedBrand(event);
  };

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  // Event handler to close the modal
  const handleModalClose = () => {
    setModalVisible(false);
  };

  //
  // Get Categories API
  //
  useEffect(() => {
    const getData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        const response = await fetch(
          process.env.REACT_APP_HAPS_MAIN_BASE_URL + "admin/getHomeZoneAppliances",
          requestOptions
        );
        const result = await response.json();
        setCategories(result.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  //
  // Get All Products API
  //
  const getAllProduct = async (
    page,
    latest,
    home_zone_appliances_id,
    home_zone_category_id,
    brand_id
  ) => {
    setLoading(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      [];
      const response = await fetch(
        process.env.REACT_APP_HAPS_MAIN_BASE_URL +
          `product/getProducts?page=${page}&latest=${latest}&home_zone_appliances_id=${home_zone_appliances_id}&home_zone_category_id=${home_zone_category_id}&brand_id=${brand_id}`,
        requestOptions
      );
      const result = await response.json();
      // console.log("Updated data", result.data.products);
      setProducts(result.data.products);
      setPageCount(result.data.page_count);
      if (result.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pageCount) {
      setCurrentPage(pageNumber);
      getAllProduct(pageNumber, 1, null, null, null);
    }
  };

  const onLatest = (pageNumber) => {
    // if (pageNumber <= pageCount || pageCount === null) {
    if (pageNumber >= 1 && pageNumber <= pageCount) {
      setCurrentPage(pageNumber);
      getAllProduct(currentPage, 1, null, null, null);
      setIsActive(!isActive);
    }
  };

  const GetAllComplaints = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `Complaints/GetAll?searchAll=${search}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.Status === 200) {
          setLoading(false);
          setComplaintsData(result.Data);
        }
      })
      .catch((error) => console.log("error", error));
  };
const searchQuery=()=>{
  GetAllComplaints(1,1)
}
  useEffect(() => {
    GetAllComplaints();
  }, []);

  //
  // search api
  //
  const searchApi = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      search: search,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "/product/getSearchAll", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setSearch("");
        setProducts(result.products);
        // setPageCount(result.data.page_count);
      })
      .catch((error) => console.log("error", error));
  };

  //
  // Get Product By ID
  //
  const getProductById = async (productId) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    return fetch(
      process.env.REACT_APP_HAPS_MAIN_BASE_URL + `product/getProductById/${productId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        return result.data;
      })
      .catch((error) => console.log("error", error));
  };

  //
  // Delete Product
  //
  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };
  const handleDeleteProduct = async (index, productId) => {
    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    await fetch(
      process.env.REACT_APP_HAPS_MAIN_BASE_URL + `product/deleteProduct/${productId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        removeProduct(index);
        if (result.status === 200) {
          setLoading(false);
          toast.success("Product deleted successfully", {
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

  //
  // PRODUCT STATUS API
  //
  const onChange = async (product) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      status: parseInt(product.status) === 1 ? 0 : 1,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(
      process.env.REACT_APP_HAPS_MAIN_BASE_URL + `product/updateProductStatus/${product.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === "success") {
          toast.success(
            `${product.name} ${parseInt(product.status) === 1 ? "Disabled" : "Enabled"}`,
            {
              theme: "light",
              autoClose: 1000,
            }
          );
        }
      })
      .catch((error) => console.log("error", error));

    getAllProduct(currentPage, 1, null, null, null);
  };

  const handleSearchByCategory = () => {
    setModalVisible(true);
    getAllProduct(1, 1, selectedCategory, selectedSubCategory, selectedBrand);
    setModalVisible(false);
  };

  const handleGetAllProduct = () => {
    setModalVisible(true);
    getAllProduct(currentPage, 1, null, null, null);
    setSelectedCategory("");
    setSelectedSubCategory("");
    setSelectedBrand("");
    setModalVisible(false);
  };

  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <div className="sticky top-0 z-10">
            <DashboardNavbar />
            <div className="bg-slate-50 flex flex-col-reverse md:flex-col-reverse lg:flex-row-reverse xl:flex-row-reverse justify-between items-center px-2 md:px-2 lg:px-14 xl:px-20 gap-5">
              <div className=" dark:bg-gray-800 mt-[12px] drop-shadow-lg w-[99%] md:w-[99%] lg:w-[70%] xl:w-[70%]">
                <label
                  htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search By Product name, Product Code"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    onClick={searchQuery}
                    className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 drop-shadow-lg">
                <button
                  onClick={() => onLatest(currentPage)}
                  className={` border p-1.5 rounded-full px-4 text-sm font-semibold ${
                    isActive ? "bg-black text-white" : "bg-white text-black"
                  }`}
                >
                  latest{" "}
                </button>
                <button className="bg-white text-black border p-1.5 rounded-full px-3 text-sm font-semibold">
                  {" "}
                  popular{" "}
                </button>
              </div>

              {/* <div className="flex items-center gap-3 mt-2 drop-shadow-lg">
                <button
                  className={`border p-2 rounded-full px-4 text-xl font-semibold`}
                  onClick={handleButtonClick} // Add the click event handler
                >
                  <BsFilter />
                </button>
                <Modal
                  title="Filter" // Replace with your desired title
                  open={modalVisible}
                  onCancel={handleModalClose} // Add the cancel event handler
                  footer={null} // Set to null if you don't want a footer in the modal
                  style={{ maxHeight: "80vh" }}
                >
                  <Select
                    // mode="multiple"
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

                  {selectedCategory && (
                    <Select
                      id="subcategory"
                      value={selectedSubCategory}
                      onChange={handleSubCategoryChange}
                      className="w-full mt-4"
                      placeholder="Select Sub-Category"
                    >
                      {!selectedSubCategory && (
                        <Option value="" disabled>
                          Select Sub-Category
                        </Option>
                      )}
                      {subCategories.map((subcategory) => (
                        <Option key={subcategory.id} value={subcategory.id}>
                          {subcategory.title}
                        </Option>
                      ))}
                    </Select>
                  )}

                  <div className="mt-4">
                    <Select
                      id="productBrand"
                      value={selectedBrand}
                      onChange={handleBrandChange}
                      className="w-full"
                    >
                      {!selectedBrand && (
                        <Option value="" disabled>
                          Select Brand
                        </Option>
                      )}
                      {productBrand.map((productBrand) => (
                        <Option key={productBrand.id} value={productBrand.id}>
                          {productBrand.name}
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <button
                    className="border p-1.5 rounded-full px-4 text-sm font-semibold mt-6 left-0 "
                    onClick={handleSearchByCategory}
                  >
                    search
                  </button>

                  <button
                    className="border p-1.5 rounded-full px-4 text-sm font-semibold mt-6 ml-4 "
                    onClick={handleGetAllProduct}
                  >
                    clear filter
                  </button>
                </Modal>
              </div> */}
            </div>
          </div>

          <div className="mt-8">
            <ComplainList
              products={ComplaintsData}
              currentPage={currentPage}
              pageCount={pageCount}
              currentItems={currentItems}
              search={search}
              itemsPerPage={itemsPerPage}
              paginate={paginate}
              onChange={onChange}
              handleDeleteProduct={handleDeleteProduct}
              loading={loading}
            />
          </div>
          <ToastContainer />
          {/* <Footer /> */}
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default Complain;
