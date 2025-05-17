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

function CouponList() {
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

  const [couponList, setCouponList] = useState([]);
  const [loading, setLoading] = useState(true);

  // list coupon categories
  const listCoupon = async () => {
    setLoading(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "coupon/getAllCoupon", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setCouponList(result.coupons);
        if (result.status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    listCoupon();
  }, []);

  // delete category
  const removeCoupon = (index) => {
    const updatedCoupon = couponList.filter((_, i) => i !== index);
    setCouponList(updatedCoupon);
  };
  const handleDeleteCoupon = async (index, id) => {
    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    await fetch(
      process.env.REACT_APP_HAPS_MAIN_BASE_URL + `coupon/coupondelete/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        removeCoupon(index);
        if (result.status === 200) {
          setLoading(false);
          toast.success("Coupon deleted successfully", {
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

  //   get coupon by id
  const getCoupon = async (id) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `coupon/getById/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        return result.coupon;
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getCoupon();
  }, []);

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
                  {/* <th scope="col" className="px-6 py-3">
                                    Image
                                </th> */}
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Coupon Code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {couponList.map((coupons, index) => (
                  <tr
                    key={coupons.id}
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
                    {/* <td className="px-6 py-4">
                                        <img
                                            alt={el.image}
                                            src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + `${el.image}`}
                                            className="w-[50px] h-[50px] rounded-full"
                                        />
                                    </td> */}
                    <td className="px-6 py-4">
                      <a>{coupons.coupon_name}</a>
                    </td>
                    <td className="px-6 py-4 ">{coupons.coupon_code}</td>
                    <td className="px-6 py-4 text-right flex gap-6">
                      <button
                      onClick={() => {
                        const newTab = window.open(
                          `/update-coupon?${createSearchParams({ id: coupons.id }).toString()}`,
                          '_blank'
                        );
                        newTab.focus();
                      }}
                        className="AiFillEdit"
                      >
                        <AiFillEdit />
                      </button>
                      <button onClick={() => handleDeleteCoupon(index, coupons.id)}>
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

export default CouponList;
