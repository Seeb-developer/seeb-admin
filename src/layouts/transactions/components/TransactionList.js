import React, { useState, useEffect } from "react";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { createSearchParams, useNavigate } from "react-router-dom";
import { Switch } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import Loader from "layouts/loader/Loader";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const TransactionList = (props) => {
  let Navigate = useNavigate();
  const {
    products,
    currentItems,
    currentPage,
    pageCount,
    itemsPerPage,
    search,
    paginate,
    onChange,
    handleDeleteProduct,
    loading,
  } = props;

  TransactionList.propTypes = {
    products: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        thumbnail: PropTypes.string,
        name: PropTypes.string.isRequired,
        product_code: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
      })
    ).isRequired,
    search: PropTypes.string.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    currentItems: PropTypes.array.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    paginate: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    handleDeleteProduct: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  const renderPagination = () => {
    const { pageCount, currentPage } = props;
    const visiblePageCount = 5;
    const pages = [];

    let startPage = 1;
    let endPage = Math.min(startPage + visiblePageCount - 1, pageCount);

    if (currentPage > Math.floor(visiblePageCount / 2)) {
      startPage = currentPage - Math.floor(visiblePageCount / 2);
      endPage = Math.min(currentPage + Math.floor(visiblePageCount / 2), pageCount);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""} ${
            currentPage === i ? "bg-black text-white" : "bg-white text-black"
          } mt-2 border border-black text-black rounded-full w-8 h-8 text-center text-xs relative`}
        >
          <a
            className="page-link absolute right-3 top-2"
            href="javascript:;"
            onClick={() => paginate(i)}
          >
            {i}
          </a>
        </li>
      );
    }
    return pages;
  };

  return (
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
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center">
                    Sr No
                  </th>
                  {/* <th scope="col" className="px-6 py-3 text-center">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Product Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Product Code
                  </th> */}
                  <th scope="col" className="px-6 py-3 text-center">
                    Customer Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Transaction Id
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Status
                  </th>
                </tr>
              </thead>
              {console.log("props.products", props.products)}
              <tbody>
                {props.products.map((product, index) => (
                  <tr
                    key={product.id}
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
                      {(props.currentPage - 1) * props.itemsPerPage + index + 1}
                    </th>
                    {/* <td className="px-6 py-4 flex justify-center">
                          <img
                            alt={product.ProductImage}
                            src={
                              process.env.REACT_APP_HAPS_MAIN_BASE_URL + `${product.ProductImage}`
                            }
                            className="w-[50px] h-[50px] rounded-full"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <a>{product.ProductName}</a>
                        </td>
                        <td className="px-6 py-4 text-center">{product.ProductCode}</td> */}
                    <td className="px-6 py-4 text-center">{product.CustomerName}</td>
                    <td className="px-6 py-4 text-center">{product.TransactionId}</td>
                    <td className="px-6 py-4 text-center">{product.Amount}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={
                          product.Transaction_Status == "PAYMENT_SUCCESS"
                            ? "bg-green-300 text-green-700 py-1 px-4 rounded-lg"
                            : "bg-red-300 text-red-700 py-1 px-4 rounded-lg"
                        }
                      >
                        {product.Transaction_Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <div className="flex justify-center mt-4">
            <div className="flex"> */}
          <ul className="pagination flex justify-center items-center gap-2">
            <li className={`page-item ${props.currentPage === 1 ? "disabled" : ""} mt-2 `}>
              <a
                className="page-link"
                href="javascript:;"
                onClick={() => paginate(props.currentPage - 1)}
              >
                <LeftOutlined />
                <span className="sr-only">Previous</span>
              </a>
            </li>
            <div className="my-5 flex gap-3">{renderPagination()}</div>
            <li
              className={`page-item ${
                props.currentPage === props.pageCount ? "disabled" : ""
              } mt-2`}
            >
              <a
                className="page-link"
                href="javascript:;"
                onClick={() => paginate(props.currentPage + 1)}
              >
                <RightOutlined />
                <span className="sr-only">Next</span>
              </a>
            </li>
          </ul>
          {/* </div>
          </div> */}
          <ToastContainer />
        </div>
      )}
    </>
  );
};

export default TransactionList;
