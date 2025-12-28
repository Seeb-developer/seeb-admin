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
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { apiCall } from "utils/apiClient";

function IndependanceCampaign() {
  let Navigate = useNavigate();
  const [campaignData, setCampaignData] = useState([]);
  const [loading, setLoading] = useState(true);

  // list categories
  const getAllOffer = async () => {
    setLoading(true);
    try {
      const result = await apiCall({ endpoint: "Campaign/getIndependenceCampaign", method: "GET" });
      console.log(result);
      setCampaignData(result.data);
      if (result.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOffer();
  }, []);

  // delete Offer
//   const removeOffer = (index) => {
//     const updateOffer = campaignData.filter((_, i) => i !== index);
//     setCampaignData(updateOffer);
//   };
//   const handleOfferDelete = async (index, id) => {
//     var requestOptions = {
//       method: "DELETE",
//       redirect: "follow",
//     };

//     await fetch(
//       process.env.REACT_APP_HAPS_MAIN_BASE_URL + `Offers/deleteOffers/${id}`,
//       requestOptions
//     )
//       .then((response) => response.json())
//       .then((result) => {
//         // console.log(result);
//         removeOffer(index);
//         if (result.status === 200) {
//           setLoading(false);
//           toast.success("Offer deleted successfully", {
//             theme: "light",
//             autoClose: "2000",
//           });
//         }
//       })
//       .catch((error) => console.log("error", error));
//       setTimeout(() => {
//         setLoading(false);
//       }, 3000);
//   };

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
                  <th scope="col" className="px-6 py-3 text-center">
                    Sr No
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    email
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    phone number
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    address
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    image
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaignData.map((el, index) => (
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
                      <a>{el.email}</a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <a>{el.mobile_no}</a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <a>{el.address}</a>
                    </td>
                    <td className="px-6 py-4 flex justify-center">
                      <img
                        alt={el.image}
                        src={`${el.image}`}
                        className="w-[50px] h-[50px]"
                      />
                    </td>
                    {/* <td className="px-6 py-4 ">{product.product_code}</td> */}
                    <td className="px-6 py-4 text-center">
                      <button
                    //    onClick={() => handleOfferDelete(index, el.id)}
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
    </DashboardLayout>
    ) : (
      <NontAuthorized401 />
    )}
  </>
  );
}

export default IndependanceCampaign;
