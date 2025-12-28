import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { apiCall } from "utils/apiClient";

function GetNotification() {
  const [NotificationData, setNotificationData] = useState([]);

  const GetNotification = async () => {
    try {
      const result = await apiCall({ endpoint: "product/getProductById/168", method: "GET" });
      setNotificationData(result.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    GetNotification();
  }, []);

  return (
    <div>
      <DashboardLayout>
        <div className="sticky top-0 z-10">
          <DashboardNavbar />
          <div>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center">
                    Sr No
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Body
                  </th>
                  {/* <th scope="col" className="px-6 py-3 text-center">
                    Action
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {/* Dummy data */}
                <tr className="border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap text-center"
                  >
                    1
                  </th>
                  <td className="px-6 py-4 text-center">
                    <a>title 1</a>
                  </td>
                  <td className="px-6 py-4 flex justify-center">
                    <img
                      alt="Image 1"
                      src="https://dummyimage.com/50x50/000/fff"
                      className="w-[50px] h-[50px] rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <a>body</a>
                  </td>
                  {/* <td className="px-6 py-4 flex justify-center gap-6">
                    <button className="AiFillEdit">
                      <AiFillEdit />
                    </button>
                    <button>
                      <AiOutlineDelete />
                    </button>
                  </td> */}
                </tr>
                {/* Add more rows with dummy data as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
}

export default GetNotification;
