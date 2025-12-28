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
// import Footer from "examples/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useState, useEffect } from "react";
import { apiCall } from "utils/apiClient";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { Link, createSearchParams, useNavigate } from "react-router-dom";

function TotalVendors() {
  let Navigate = useNavigate();
  const [listProduct, setListProduct] = useState([]);
  const [ListVender, setListVender] = useState([]);

  const [loading, setLoading] = useState(true);

  // list categories
  const getAllOffer = async () => {
    setLoading(true);
    await apiCall({ endpoint: "Offers/getAllOffers", method: "GET" })
      .then((result) => {
        console.log(result);
        setListProduct(result.data);
        if (result.status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };
  const getAllVender = async () => {
    setLoading(true);
    await apiCall({ endpoint: "vendor/getAllvendors", method: "GET" })
      .then((result) => {
        console.log(result);
        setListVender(result.vendor_data);
        if (result.status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  

  useEffect(() => {
    getAllOffer();
    getAllVender();
  }, []);

  // delete Offer
  // const removeOffer = (index) => {
  //   const updateOffer = listProduct.filter((_, i) => i !== index);
  //   setListProduct(updateOffer);
  // };
  // const handleOfferDelete = async (index, id) => {
  //   var requestOptions = {
  //     method: "DELETE",
  //     redirect: "follow",
  //   };

  //   await fetch(
  //     process.env.REACT_APP_HAPS_MAIN_BASE_URL + `Offers/deleteOffers/${id}`,
  //     requestOptions
  //   )
  //     .then((response) => response.json())
  //     .then((result) => {
  //       // console.log(result);
  //       removeOffer(index);
  //       if (result.status === 200) {
  //         setLoading(false);
  //         toast.success("Offer deleted successfully", {
  //           theme: "light",
  //           autoClose: "2000",
  //         });
  //       }
  //     })
  //     .catch((error) => console.log("error", error));
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 3000);
  // };

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
              {/* {console.log(currentPage)} */}
              <div className="ml-4">
                <h3 className="font-bold text-lg ">Total Vendors</h3>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-center">
                        Sr No
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Shop Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Shop Id
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Location
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
                    {ListVender.map((el, index) => (
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
                          {/* {index + 1} */}1
                        </th>
                        <td className="px-6 py-4 text-center">
                          <a>{el.company_name}</a>
                          
                        </td>
                        <td className="px-6 py-4 text-center">
                          <a>{el.vendor_code}</a>
                          
                        </td>
                        <td className="px-6 py-4 text-center">
                          <a>{el.vendor_address}</a>
                          
                        </td>
                        <td className="px-6 py-4 text-center">
                          {/* <a>{el.offer_title}</a> */}
                          product
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-6 ">
                          <button
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
                          </button>
                          <button
                          // onClick={() => handleOfferDelete(index, el.id)}
                          >
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
        </>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default TotalVendors;



