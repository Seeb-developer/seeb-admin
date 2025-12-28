import React, { useState, useEffect } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Loader from "layouts/loader/Loader";
import { AiOutlineDelete } from "react-icons/ai";
import { toast, Toaster } from "react-hot-toast";
import { apiCall } from "utils/apiClient"; // Add this import

const CustomerListing = (props) => {
  let Navigate = useNavigate();
  const {
    customer,
    loading,
    getAllCustomer,
  } = props;

  CustomerListing.propTypes = {
    customer: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        mobile_no: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
      })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
    getAllCustomer: PropTypes.func.isRequired,
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
           <Toaster position="top-center" reverseOrder={false} />
          {/* {console.log(currentPage)} */}
          {/* <div className="flex justify-between mb-4">
            <div>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                <ReactHTMLTableToExcel
                  id="test-table-xls-button"
                  table="table-to-export"
                  filename="Customer_List_Sheet"
                  sheet="tablexls"
                />
              </button>
            </div>
          </div> */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
            <table
              id="table-to-export"
              className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Sr No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Mobile No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {customer.map((el, index) => (
                  <tr
                    key={el.id}
                    className={`border-b dark:bg-gray-800 dark:border-gray-700 ${index % 2 === 0
                      ? "odd:bg-white even:bg-gray-50"
                      : "odd:dark:bg-gray-800 even:dark:bg-gray-700"
                      }`}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                    >
                      {index + 1}
                    </th>
                    <td className="px-6 py-4">
                      <a>{el.name}</a>
                    </td>
                    <td className="px-6 py-4 ">{el.email}</td>
                    <td className="px-6 py-4 ">{el.mobile_no}</td>
                    <td className="px-6 py-4 ">{el.created_at}</td>

                    <td className="px-6 py-4 text-right flex gap-2">
                      <button
                        onClick={() =>
                          Navigate({
                            pathname: "/customer-details",
                            search: createSearchParams({
                              id: el.id,
                            }).toString(),
                          })
                        }
                        className="bg-black text-white px-2 py-1 ml-1 rounded-sm text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to delete this customer?")) {
                            try {
                              const result = await apiCall({ endpoint: `customer/delete/${el.id}`, method: "DELETE" });
                              if (result.Status === 200 || result.status === 200) {
                                toast.success("Customer deleted");
                                getAllCustomer();
                              } else {
                                toast.error(result.message || "Failed to delete customer");
                              }
                            } catch (error) {
                              toast.error("Error deleting customer");
                            }
                          }
                        }}
                        className="text-red-600"
                        title="Delete"
                      >
                        <AiOutlineDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </>
  );
};

export default CustomerListing;
