import NontAuthorized401 from "NontAuthorized401";
import Loader from "layouts/loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { apiCall } from "utils/apiClient";

function Editing(props) {
  const { handleClickEditProduct } = props;

  Editing.propTypes = {
    handleClickEditProduct: PropTypes.func.isRequired,
  };


  let Navigate = useNavigate();
  const [listProduct, setListProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  // list raw product total count
  const getAllList = async () => {
    setLoading(true);
    await apiCall({ endpoint: "dashboard/products-statics", method: "GET", params: { status: 3 } })
      .then((result) => {
        console.log(result);
        setListProduct(result.data);
        if (result.status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getAllList();
  }, []);


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
                <h3 className="font-bold text-lg ">Editing </h3>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-center">
                        Sr No
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listProduct.map((el, index) => (
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
                        <a>{el.title}</a>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <a>{el.products_count !== null ? el.products_count : 0}</a>
                      </td>
                      <td className="px-6 py-4 flex justify-center gap-6 ">
                        <button
                          onClick={() => handleClickEditProduct(el.id, el.title)}
                          // onClick={() =>
                          //   Navigate({
                          //     pathname: "/update-offer",
                          //     // search: createSearchParams({
                          //     //   slug: el.id,
                          //     // }).toString(),
                          //   })
                          // }
                          className="bg-black text-white px-2 rounded-md"
                        >
                          View
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

export default Editing;

