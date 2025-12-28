import NontAuthorized401 from "NontAuthorized401";
import Loader from "layouts/loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";

import React, { useState, useEffect } from "react";
import { apiCall } from "utils/apiClient";
import { useNavigate, createSearchParams } from "react-router-dom";
import { Empty } from "antd";
import { Button, Modal } from "antd";

function RawProductList(props) {
  const { ListingRawProduct, Titles } = props;
  const [DesignerList, setDesignerList] = useState([]);

  RawProductList.propTypes = {
    ListingRawProduct: PropTypes.func.isRequired,
    Titles: PropTypes.func.isRequired,
  };

  let Navigate = useNavigate();
  const [listProductCategory, setListProductCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  // designer list modal
  const [GetDesignerModalOpen, setGetDesignerModalOpen] = useState(false);
  const [ProductId, setProductiId] = useState("");
  const [GetSpecificDesignerOpen, setGetSpecificDesignerOpen] = useState(false);
  const [SpecificDesignerData, setSpecificDesignerData] = useState([]);
  
  // assign to other 
  const [AssigntoOther, setAssigntoOther] = useState(false);


  // list product total count
  const getAllList = async (id) => {
    setLoading(true);
    await apiCall({
      endpoint: `product/rawProductsList`,
      method: "GET",
      params: { home_zone_appliances_id: ListingRawProduct, status: 0 },
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

  //  assign to other modal
  const assigntootherDesigner = (productid) => {
    setAssigntoOther(true);
    setProductiId(productid);
  };

  const closeassigntootherDesigner = () => {
    setGetDesignerModalOpen(false);
  };
  // all designer list modal

  const openSpecificDesignerOpen = (productid) => {
    setGetSpecificDesignerOpen(true);
    setProductiId(productid);
  };

  const closeSpecificDesignerOpen = () => {
    setGetSpecificDesignerOpen(false);
  };

  // all designer list modal

  const openAllDesignerModal = (productid) => {
    setGetDesignerModalOpen(true);
    setProductiId(productid);
  };

  const closeAllDesignerModal = () => {
    setGetDesignerModalOpen(false);
  };

  // all designer list modal

  const getAllDesigner = () => {
    apiCall({ endpoint: "Designer/GetAll", method: "GET" })
      .then((result) => {
        console.log(result);
        if (result.status === 200) {
          setDesignerList(result.data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const handleassigned = (id) => {
    const data = { designer_id: id, product_id: ProductId };
    apiCall({ endpoint: "Designer/AssignProduct", method: "POST", data })
      .then((result) => {
        if (result.Status === 201) {
          setGetDesignerModalOpen(false);
          getAllList();
          toast("Designer Assigned Successfully");
        }
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };

  //  get specific designer list

  const getspecificdesigner = () => {
    apiCall({ endpoint: "Designer/GetProductsByDesignerId/2", method: "GET" })
      .then((result) => {
        if (result.Status === 200) {
          setSpecificDesignerData(result.Data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const assigntoother = (id) => {
    const specificUpdateDesigner = () => {
      const data = { id, designer_id: "2", product_id: "109" };
      apiCall({ endpoint: "Designer/UpdateAssignProduct", method: "PUT", data })
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    };
    setGetDesignerModalOpen(true);
    setGetSpecificDesignerOpen(false);
  };
  useEffect(() => {
    getAllDesigner();
    getAllList();
    getspecificdesigner();
  }, [ListingRawProduct]);

  return (
    <>
      {localStorage.getItem("Token") ? (
        <>
          {console.log("checkdesigner", DesignerList)}
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
                <h3 className="font-bold text-lg ">Listing Raw Product</h3>
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
                      {/* <th scope="col" className="px-6 py-3 text-center">
                        Vendor Id
                      </th> */}
                      <th scope="col" className="px-6 py-3 text-center">
                        Assign To
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Product Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Preview
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
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
                            {index + 1}
                          </th>
                          <td className="px-6 py-4 text-center">
                            <a>{products.name}</a>
                            {/* name */}
                          </td>
                          {/* <td className="px-6 py-4 text-center">
                            name
                          </td> */}
                          <td className="px-6 py-4 text-center">
                            {/* <a>{el.products_count !== null ? el.products_count : 0}</a> */}
                            <a>{products.AssignTo}</a>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {/* <a>{el.products_count !== null ? el.products_count : 0}</a> */}
                            {products.ProductType == null ? "--" : <a>{products.ProductType}</a>}
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
                          <td className="text-centre ">
                            <button
                              onClick={() => {
                                const newTab = window.open(
                                  `/product-update?${createSearchParams({
                                    id: products.id,
                                  }).toString()}`,
                                  "_blank"
                                );
                                newTab.focus();
                              }}
                              className="bg-black text-white px-2 rounded-md"
                            >
                              View
                            </button>
                          </td>
                          <td className=" text-centre ">
                            {products.AssignTo === null ? (
                              <button
                                onClick={() => openAllDesignerModal(products.id)}
                                className="bg-blue-500 text-white px-2 rounded-md"
                              >
                                Assigned To
                              </button>
                            ) : (
                              <button
                                onClick={() => openSpecificDesignerOpen(products.id)}
                                className="bg-blue-500 text-white px-2 rounded-md"
                              >
                                Already Assigned
                              </button>
                            )}
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

              {/* list of designer  */}

              <Modal
                title="Designer List"
                open={GetDesignerModalOpen}
                onCancel={closeAllDesignerModal}
                footer={""}
                width={1000}
              >
                <div className="relative bg-white overflow-hidden ">
                  <div>
                    {/* {console.log(currentPage)} */}
                    <div className="ml-4 mb-5">
                      <h3 className="font-bold text-lg ">Total Designer List</h3>
                    </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-center">
                              Sr No
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Designer Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Designer Id
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {DesignerList.map((el, index) => (
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
                                <a>{el.employee_id}</a>
                              </td>

                              <td className="px-6 py-4 flex justify-center gap-6 ">
                                { }
                                <input
                                  type="radio"
                                  value={el.id}
                                  onClick={(e) => handleassigned(e.target.value)}
                                />
                                {/* <button
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
                                </button> */}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Modal>

              {/* specific assigned designer */}

              <Modal
                title="Raw Product :- "
                open={GetSpecificDesignerOpen}
                onCancel={closeSpecificDesignerOpen}
                footer={""}
                width={1000}
              >
                <div className="relative bg-white overflow-hidden ">
                  <div>
                    {/* {console.log(currentPage)} */}
                    <div className="ml-4 mb-5">
                      <h3 className="font-bold text-lg ">Assign To </h3>
                    </div>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-center">
                              Work Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Product Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              vendor Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Assign Date/Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Product Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Preview
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {SpecificDesignerData.map((el, index) => (
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
                                <a> {el.status}</a>
                              </th>
                              <td className="px-6 py-4 text-center">
                                <a>{el.name}</a>
                              </td>
                              <td className="px-6 py-4 text-center">
                                {el.vendor_name === null ? "--" : <a>{el.vendor_name}</a>}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <a>{el.created_at}</a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <p onClick={()=>assigntoother()}>
                      Assign to other
                    </p>

                  </div>
                </div>
              </Modal>
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

export default RawProductList;
