// @mui material components
import Card from "@mui/material/Card";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import CustomerListing from "./components/CustomerListing";
import { useEffect, useState } from "react";
import OrderListing from "./components/OrderListing";
import NontAuthorized401 from "NontAuthorized401";
import { BsFilter } from "react-icons/bs";
import { Modal, Select } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Footer from "examples/Footer";

const { Option } = Select;

function OrderList() {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = order.slice(indexOfFirstItem, indexOfLastItem);
  const [pageCount, setPageCount] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [productBrand, setProductBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [CalanderValues, setCalanderValues] = useState({});
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
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
        setSelectedCategory(result.data[0].id);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  const [SelectedCategory, setSelectedCategory] = useState("");
  // Get All order API
  const getAllOrder = async (page, latest, startDate, endDate) => {
    setLoading(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      [];
      const response = await fetch(
        process.env.REACT_APP_HAPS_MAIN_BASE_URL +
          `product/getAllOrder?page=${page}&latest=${latest}&search=${search}&start_date=${
            startDate ? startDate : null
          }&end_date=${endDate ? endDate : null}`,
        requestOptions
      );

      const result = await response.json();

      if (result.status === 200) {
        setOrder(result.order);
        setPageCount(result.page_count);
        setTotalCount(result.total_products_count);
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const getOrderData = async (page, latest) => {
    setLoading(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    await fetch(
      `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}product/getAllOrderByDate?${page}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setOrder(result.order);
        setPageCount(result.page_count);
        setTotalCount(result.total_order_count);
        if (result.status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };
  const paginate = (pageNumber) => {
    if (pageNumber <= pageCount || pageCount === null) {
      // Check if page count is reached or unknown
      setCurrentPage(pageNumber);
      getAllOrder(pageNumber, 1, StartDate, EndDate);
    }
  };

  const onLatestOrder = (pageNumber) => {
    if (pageNumber <= pageCount || pageCount === null) {
      // Check if page count is reached or unknown
      setCurrentPage(pageNumber);
      getAllOrder(pageNumber, 1);
      setIsActive(!isActive);
    }
  };

  useEffect(() => {
    getAllOrder(currentPage, 1, null, null);
    // getOrderData(currentPage);
  }, [currentPage, SelectedCategory]);

  // Search Function
  const getSearchQuery = () => {
    getAllOrder(1, 1, StartDate, EndDate);
  };
  // get brands
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
  useEffect(() => {
    getBrandData();
  }, []);
  const handleBrandChange = (event) => {
    setSelectedBrand(event);
  };

  const handleButtonClick = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSearchByCategory = () => {
    setModalVisible(true);
    getAllOrder(1, 1, selectedBrand);
    setModalVisible(false);
  };

  const handleGetAllProduct = () => {
    setModalVisible(true);
    getAllOrder(currentPage, 1, null);
    setSelectedBrand("");
    setModalVisible(false);
  };
  const getDataByFromandToDate = () => {
    setLoading(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `${process.env.REACT_APP_HAPS_MAIN_BASE_URL}product/getAllOrderByDate?${currentPage}=&start_date=${CalanderValues.From}&end_date=${CalanderValues.To}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setOrder(result.order);
        setPageCount(result.page_count);
        setTotalCount(result.total_order_count);

        if (result.status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };
  const HandleChangeToDate = async (value) => {
    if (StartDate) {
      await getAllOrder(1, 1, StartDate, value);
    } else {
      toast.error("Please Select From Date First");
    }
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
                    placeholder="Search using ORDER ID and EMAIL"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    onClick={getSearchQuery}
                    className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 drop-shadow-lg">
                {/* <button
                  onClick={() => onLatestOrder(currentPage)}
                  className={` border p-1.5 rounded-full px-4 text-sm font-semibold ${
                    isActive ? "bg-black text-white" : "bg-white text-black"
                  }`}
                >
                  Latest
                </button>
                <button className="bg-white text-black border p-1.5 rounded-full px-3 text-sm font-semibold ">
                  Popular
                </button> */}

                {/* for filter */}
                {/* <
                  className={`border p-2 rounded-full px-4 text-xl font-semibold`}
                  onClick={handleButtonClick} // Add the click event handler
                >
                <BsFilter />
              </> */}

                <div>
                  <p className="justify-start">({totalCount} Orders)</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-start gap-3">
                    <span className="text-lg font-semibold text-black">From:</span>
                    <input
                      type="date"
                      className="px-3 text-[14px]"
                      onChange={
                        (e) => setStartDate(e.target.value)
                        // setCalanderValues({ ...CalanderValues, ["From"]: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex justify-start gap-3">
                    <span className="text-lg font-semibold text-black">To:</span>
                    <input
                      type="date"
                      className="px-3 text-[14px]"
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        HandleChangeToDate(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <Modal
                  title="Filter" // Replace with your desired title
                  open={modalVisible}
                  onCancel={handleModalClose} // Add the cancel event handler
                  footer={null} // Set to null if you don't want a footer in the modal
                  style={{ maxHeight: "80vh" }}
                >
                  {/* for vendor */}
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
                    Search
                  </button>

                  <button
                    className="border p-1.5 rounded-full px-4 text-sm font-semibold mt-6 ml-4 "
                    onClick={handleGetAllProduct}
                  >
                    Clear Filter
                  </button>
                </Modal>
              </div>
            </div>
          </div>
          <div className="mt-8 ">
            <OrderListing
              order={order}
              currentPage={currentPage}
              pageCount={pageCount}
              currentItems={currentItems}
              search={search}
              itemsPerPage={itemsPerPage}
              paginate={paginate}
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

export default OrderList;
