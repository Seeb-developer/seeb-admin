// @mui material components
import Card from "@mui/material/Card";

// Decorajee React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Decorajee React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";

import React, { useState, useEffect } from "react";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import Loader from "layouts/loader/Loader";
import ReactStars from "react-stars";
import NontAuthorized401 from "NontAuthorized401";

function ReviewList() {
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
  const [modalVisible, setModalVisible] = useState(false);
  const [fullMessage, setFullMessage] = useState("");
  const [reviewId, setReviewId] = useState("");
  const handleViewClick = (id, message) => {
    setFullMessage(message);
    setReviewId(id);
    setModalVisible(true);
  };

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approve, setApprove] = useState("");
  const [reject, setReject] = useState("");

  // list leads
  const listReviews = async () => {
    setLoading(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    await fetch(
      process.env.REACT_APP_HAPS_MAIN_BASE_URL + "product/getAllRatingReview",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setReviews(result.data);
        if (result.status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    listReviews();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        status: status,
      });

      const requestOptions = {
        method: "POST", // Use POST instead of GET for updating the status
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        process.env.REACT_APP_HAPS_MAIN_BASE_URL + `product/update-review-status/${id}`,
        requestOptions
      );
      const result = await response.json();
      if (response.ok && result.status === 200) {
        setReviews((prevReviews) =>
          prevReviews.map((review) => (review.id === id ? { ...review, status: status } : review))
        );
        listReviews();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getStatusText = (status) => {
    if (status === "1") {
      return "Approved";
    } else if (status === "2") {
      return "Rejected";
    } else {
      return "Pending";
    }
  };

  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />
          {loading ? (
            <>
              <div className="relative bg-white h-screen overflow-hidden" />
              {console.log(reviews)}
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
                        Customer Id
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Product Id
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Rating
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Review
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((el, index) => (
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
                          <a>{el.customer_id}</a>
                        </td>
                        <td className="px-6 py-4 text-center">{el.product_id}</td>
                        <td className="px-6 py-4 text-center flex justify-center">
                          <ReactStars
                            count={5}
                            value={parseInt(el.rating)}
                            edit={false}
                            size={24}
                            color2={"#ffd700"}
                          />
                        </td>
                        <td
                          className="px-6 py-4 text-center"
                          style={{ wordWrap: "break-word", maxWidth: "200px" }}
                        >
                          {el.review.split(" ").slice(0, 5).join(" ")}
                          {el.review.split(" ").length > 5 && (
                            <button
                              className="text-blue-500 underline ml-2"
                              onClick={() => handleViewClick(el.review)}
                            >
                              View
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">{getStatusText(el.status)}</td>
                        <td className="px-6 py-4 text-center">
                          {el.review.split(" ").length > 0 && (
                            <button
                              className="bg-black text-white p-1 px-2 underline rounded-md"
                              onClick={() => handleViewClick(el.id, el.review)}
                            >
                              View
                            </button>
                          )}
                        </td>
                        {modalVisible && (
                          <Modal
                            title="Message"
                            open={modalVisible}
                            onCancel={() => setModalVisible(false)}
                            footer={null}
                            maskStyle={{ backgroundColor: "transparent" }}
                          >
                            <p>{fullMessage}</p>
                            <div className="flex justify-center gap-4 mt-2">
                              <button
                                className="bg-green-700 text-white p-1 text-sm py-1 rounded-md px-2"
                                onClick={() => {
                                  handleAction(reviewId, "1");
                                  setModalVisible(false);
                                }}
                              >
                                Approve
                              </button>
                              <button
                                className="bg-red-600 text-white p-1 text-sm py-1 rounded-md px-4"
                                onClick={() => {
                                  handleAction(reviewId, "2");
                                  setModalVisible(false);
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          </Modal>
                        )}
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
          {/* <Footer /> */}
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default ReviewList;
