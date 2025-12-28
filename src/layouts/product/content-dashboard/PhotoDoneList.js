import NontAuthorized401 from "NontAuthorized401";
import Loader from "layouts/loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { apiCall } from "utils/apiClient";
import { useNavigate, createSearchParams} from "react-router-dom";
import { Empty } from "antd";

function PhotoDoneList(props) {
  const { ListingPhotos, Titles } = props;

  PhotoDoneList.propTypes = {
    ListingPhotos: PropTypes.func.isRequired,
    Titles: PropTypes.func.isRequired,
  };

  let Navigate = useNavigate();
  const [listProductCategory, setListProductCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  // list product total count
  const getAllList = async (id) => {
    setLoading(true);
    await apiCall({
      endpoint: "product/getProducts",
      method: "GET",
      params: { home_zone_appliances_id: ListingPhotos, status: 1 },
    })
      .then((result) => {
        console.log(result);
        setListProductCategory(result.data.products);
        if (result.status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getAllList();
  }, [ListingPhotos]);

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
              <div className="ml-4 flex gap-2">
                <h3 className="font-bold text-lg ">Photo Done Product</h3>
                <span className="font-bold text-lg">:-</span>
                <p className="font-bold text-lg">{Titles}</p>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-center">
                        Sr No
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Product Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Vendor Id
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Assign To
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Product Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Preview
                      </th>
                      <th scope="col" className="px-6 py-3 flex">
                        Action
                      </th>
                    </tr>
                  </thead>
                  {listProductCategory.length > 0 ? (
                    <tbody>
                      {listProductCategory.map((products, index) => (
                        <tr
                          key={products.id}
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
                            <a>{products.name}</a>
                            {/* name */}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {/* <a>{el.products_count !== null ? el.products_count : 0}</a> */}
                            name
                          </td>
                          <td className="px-6 py-4 text-center">
                            {/* <a>{el.products_count !== null ? el.products_count : 0}</a> */}
                            name
                          </td>
                          <td className="px-6 py-4 text-center">
                            {/* <a>{el.products_count !== null ? el.products_count : 0}</a> */}
                            name
                          </td>
                          <td className="px-6 py-4 flex justify-center">
                            <img
                              alt={products.thumbnail}
                              src={`${
                                process.env.REACT_APP_HAPS_MAIN_BASE_URL + products.thumbnail
                              }`}
                              className="w-[50px] h-[50px] rounded-full"
                            />
                          </td>
                          <td className="px-6 py-4 text-centre ">
                            <button
                              onClick={() => {
                                const newTab = window.open(
                                  `/product-update?${createSearchParams({ id: products.id }).toString()}`,
                                  '_blank'
                                );
                                newTab.focus();
                              }}
                              className="bg-black text-white px-2 rounded-md"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <p className="">
                      <Empty />
                    </p>
                  )}
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

export default PhotoDoneList;
