// @mui material components
import Card from "@mui/material/Card";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import CustomerListing from "./components/CustomerListing";
// import CustomerTabs from "./components/CustomerTabs";

// import Footer from "examples/Footer";
import React, { useState } from "react";
import { Tabs } from "antd";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import NontAuthorized401 from "NontAuthorized401";
import OrderTracking from "./components/OrderTracking";
import DetailsOfCustomer from "./components/DetailsOfCustomer";

const { TabPane } = Tabs;

const onChange = (key) => {};

function OrderDetails() {
  let [searchParam] = useSearchParams();

  const [data, setData] = useState([]);
  const [orderDetails, setOrederDetails] = useState([]);

  const getOrderDetails = async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    await fetch(
      process.env.REACT_APP_HAPS_MAIN_BASE_URL + `product/getOrder/${searchParam.get("id")}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result.order);
        setOrederDetails(result.product);
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />

          <div className="bg-slate-50">
            <Tabs defaultActiveKey="1" onChange={onChange}>
              <TabPane tab="Customer Details" key="1">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  {/* Table content for Tab 1 */}
                  <DetailsOfCustomer />
                </div>
              </TabPane>
            </Tabs>

            <Tabs defaultActiveKey="2" onChange={onChange}>
              <TabPane tab="Order Tracking" key="2">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  {/* Table content for Tab 2 */}
                  <OrderTracking />
                </div>
              </TabPane>
            </Tabs>

            <Tabs defaultActiveKey="3" onChange={onChange}>
              <TabPane tab="Order Detail" key="3">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  {/* Table content for Tab 3 */}
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
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Actual Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Discounted Percent
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Total Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                          Payment Method
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails ? (
                        orderDetails.map((order, index) => (
                          <tr
                            key={data.id}
                            className={`border-b dark:bg-gray-800 dark:border-gray-700 `}
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap text-center"
                            >
                              {index + 1}
                            </th>
                            <td className="px-6 py-4 text-center">{order.name}</td>
                            <td className="px-6 py-4 text-center">{order.quantity}</td>
                            <td className="px-6 py-4 text-center">{order.actual_price}</td>
                            <td className="px-6 py-4 text-center">{order.discounted_percent}</td>
                            <td className="px-6 py-4 text-center">
                              {data.discount * order.quantity}
                            </td>
                            <td className="px-6 py-4 text-center">{data.razorpay_order_id}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No order details found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabPane>
            </Tabs>
          </div>

          {/* <Footer /> */}
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default OrderDetails;
