import React, { useState, useEffect } from "react";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { Empty, Switch } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import Loader from "layouts/loader/Loader";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const ProductListing = (props) => {
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

  ProductListing.propTypes = {
    products: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        thumbnail: PropTypes.string,
        name: PropTypes.string.isRequired,
        product_code: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        // ... other properties
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
            currentPage === i ? "bg-black text-white" : "bg-white text-black "
          } mt-2 border border-black text-black rounded-full w-8 h-8 text-center text-xs relative`}
          onClick={() => paginate(i)}
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
                  <th scope="col" className="px-6 py-3 text-center">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Vender Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Product Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Product Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Availability Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="h-[300px] relative">
                {props.products.length > 0 ? (
                  props.products.map((product, index) => (
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
                      <td className="px-6 py-4 flex justify-center">
                        <img
                          alt={product.thumbnail}
                          src={process.env.REACT_APP_HAPS_MAIN_BASE_URL + `${product.thumbnail}`}
                          className="w-[50px] h-[50px] rounded-full"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a>{product.vendor_name ? product.vendor_name : "--"}</a>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a>{product.name}</a>
                      </td>
                      <td className="px-6 py-4 text-center">{product.product_code}</td>

                      <td className="px-6 py-4 text-center">{product.quantity}</td>

                      <td className="px-6 py-4 text-center">
                        <Switch
                          checked={parseInt(product.status) === 1 ? true : false}
                          onChange={() => onChange(product)}
                          className="bg-gray-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-right flex justify-center gap-2">
                        <button
                          onClick={() => {
                            const newTab = window.open(
                              `/product-update?${createSearchParams({
                                id: product.id,
                              }).toString()}`,
                              "_blank"
                            );
                            newTab.focus();
                          }}
                          className="text-xl text-purple-700"
                        >
                          <Link to="" target="_blank">
                            <AiFillEdit />
                          </Link>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(index, product.id)}
                          className="text-xl text-red-700"
                        >
                          <AiOutlineDelete />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <div className="absolute right-[47%] top-20">
                    <Empty />
                  </div>
                )}
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

export default ProductListing;
