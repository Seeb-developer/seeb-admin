import React, { useState, useEffect } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Loader from "layouts/loader/Loader";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Table } from "antd";

const OrderListing = (props) => {
  let Navigate = useNavigate();
  const { order, currentItems, currentPage, pageCount, itemsPerPage, search, paginate, loading } =
    props;
  const [emailSearch, setEmailSearch] = useState("");
  const [orderIdSearch, setOrderIdSearch] = useState("");

  OrderListing.propTypes = {
    order: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        mobile_no: PropTypes.string.isRequired,
      })
    ).isRequired,
    search: PropTypes.string.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageCount: PropTypes.number,
    currentItems: PropTypes.array.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    paginate: PropTypes.func.isRequired,
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

  // const dataSourceWithSerialNumbers = order
  //   .filter((el) => {
  //     const searchQuery = search.toLowerCase();

  //     const razorpay_order_id = el.razorpay_order_id.toLowerCase();
  //     const email = el.email.toLowerCase();
  //     const subtotal = el.subtotal.toLowerCase();
  //     const created_at = el.created_at.toLowerCase();

  //     if (searchQuery === "") {
  //       return true;
  //     }

  //     return (
  //       razorpay_order_id.includes(searchQuery) ||
  //       email.includes(searchQuery) ||
  //       subtotal.includes(searchQuery) ||
  //       created_at.includes(searchQuery)
  //     );
  //   })
  //   .map((item, index) => ({
  //     ...item,
  //     serialNumber: index + 1, // Calculate the serial number
  //   }));

  // const columns = [
  //   {
  //     title: <div className="text-center">Sr No</div>,
  //     dataIndex: "serialNumber",
  //     key: "serialNumber",
  //     render: (text) => <div className="text-center">{text}</div>,
  //     defaultSortOrder: "ascend",
  //     sorter: (a, b) => a.serialNumber - b.serialNumber,
  //   },
  //   {
  //     title: <div className="text-center">Order id</div>,
  //     dataIndex: "razorpay_order_id",
  //     key: "razorpay_order_id",
  //     render: (text) => <div className="text-center">{text}</div>,
  //   },
  //   {
  //     title: <div className="text-center">Vender Name</div>,
  //     dataIndex: "vender_name",
  //     key: "vender_name",
  //     render: (text) => <div className="text-center">{text ? text : "--"}</div>,
  //   },
  //   {
  //     title: <div className="text-center">Email</div>,
  //     dataIndex: "email",
  //     key: "email",
  //     render: (text) => <div className="text-center">{text}</div>,
  //   },
  //   {
  //     title: <div className="text-center">Subtotal</div>,
  //     dataIndex: "subtotal",
  //     key: "subtotal",
  //     render: (text) => <div className="text-center">{text}</div>,
  //   },
  //   {
  //     title: <div className="text-center">Payment Method</div>,
  //     dataIndex: "is_cod",
  //     key: "is_cod",
  //     render: (text) => <div className="text-center">{text == 1 ? "COD" : "UPI"}</div>,
  //   },
  //   {
  //     title: <div className="text-center">Order Status</div>,
  //     dataIndex: "status",
  //     key: "status",
  //     render: (text) => (
  //       <div className="text-center">
  //         {text == -1
  //           ? "Order Canceled"
  //           : text == 1
  //           ? "Ordered"
  //           : text == 2
  //           ? "Dispatched"
  //           : text == 3
  //           ? "Out for Delivery"
  //           : text == 4
  //           ? "Delivered"
  //           : "Pending"}
  //       </div>
  //     ),
  //   },
  //   {
  //     title: <div className="text-center">Order Date</div>,
  //     dataIndex: "created_at",
  //     key: "created_at",
  //     render: (text) => <div className="text-center">{text}</div>,
  //   },
  //   {
  //     title: <div className="text-center">Action</div>,
  //     dataIndex: "name",
  //     key: "name",
  //     render: (text, record) => (
  //       <span
  //         onClick={() =>
  //           Navigate({
  //             pathname: "/order-details",
  //             search: createSearchParams({
  //               id: record.id,
  //               customer_id: record.customer_id,
  //             }).toString(),
  //           })
  //         }
  //         className="bg-black cursor-pointer text-white px-2 py-1 ml-1 rounded-sm text-xs"
  //       >
  //         View
  //       </span>
  //     ),
  //   },
  // ];
  // const paginationConfig = {
  //   pageSize: 50,
  // };
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
        // <Table
        //   dataSource={dataSourceWithSerialNumbers}
        //   columns={columns}
        //   pagination={paginationConfig}
        // />

        <div>
          <div className="relative mt-2 overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center">
                    Sr No
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Order id
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Vender Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Order Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Order Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {order
                  // .filter((el) => {
                  //   return (
                  //     (search.toLowerCase() === "" ||
                  //       el.email.toLowerCase().includes(search) ||
                  //       el.razorpay_order_id.includes(search)) &&
                  //     (emailSearch.toLowerCase() === "" ||
                  //       el.email.toLowerCase().includes(emailSearch)) &&
                  //     (orderIdSearch.toLowerCase() === "" ||
                  //       el.razorpay_order_id.includes(orderIdSearch))
                  //   );
                  // })
                  .map((el, index) => (
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
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </th>
                      <td className="px-6 py-4 text-center">{el.razorpay_order_id}</td>
                      <td className="px-6 py-4 text-center">{el.vender_name}</td>
                      <td className="px-6 py-4 text-center">{el.email}</td>
                      <td className="px-6 py-4 text-center">{el.total}</td>
                      <td className="px-6 py-4 text-center">{el.is_cod == 1 ? "COD" : "UPI"}</td>
                      <td className="px-6 py-4 text-center">
                        {el.status == -1
                          ? "Order Cancelled"
                          : el.status == 1
                          ? "Ordered"
                          : el.status == 2
                          ? "Dispatched"
                          : el.status == 3
                          ? "Out for Delivery"
                          : el.status == 4
                          ? "Delivered"
                          : "Pending"}
                      </td>
                      <td className="px-6 py-4 text-center">{el.created_at}</td>

                      <td className="px-6 py-4 text-right flex gap-2">
                        <button
                          onClick={() =>
                            Navigate({
                              pathname: "/order-details",
                              search: createSearchParams({
                                id: el.id,
                                customer_id: el.customer_id,
                              }).toString(),
                            })
                          }
                          className="bg-black text-white px-2 py-1 ml-1 rounded-sm text-xs"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
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
        </div>
      )}
    </>
  );
};

export default OrderListing;
