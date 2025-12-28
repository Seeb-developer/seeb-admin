// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// import Footer from "examples/Footer";
import React, { useState } from "react";
import { Tabs } from "antd";
import { Card } from "antd";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { apiCall } from "utils/apiClient";

const { TabPane } = Tabs;

const onChange = (key) => {};

function DetailsOfCustomer() {
  let [searchParam] = useSearchParams();

  const [customerDetails, setCustomerDetails] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);

  const getCustomerData = async () => {
    try {
      const result = await apiCall({ endpoint: `admin/getCustomer/${searchParam.get("customer_id")}`, method: "GET" });
      setCustomerDetails(result.data);
      console.log(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getCustomerData();
  }, []);

  const getOrderData = async () => {
    try {
      const result = await apiCall({ endpoint: `product/getOrder/${searchParam.get("id")}`, method: "GET" });
      console.log(result);
      setOrderDetails(result.order);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getOrderData();
  }, []);

  return (
    <>
      {/* {console.log("hii", orderDetails )} */}
      <div className="flex gap-6 justify-center sm:flex-col-2 md:flex-row lg:flex-row xl:flex-row ">
        <div className="my-4">
          {customerDetails ? (
            customerDetails.map((el, index) => (
              <Card
                key={el.id}
                title="Customer Details"
                bordered={false}
                style={{ width: 350, height: 195 }}
              >
                <div className="flex gap-2">
                  <h3 className="font-bold capitalize">Customer Name</h3>
                  <span className="font-bold">:</span>
                  <p>{el.name}</p>
                </div>
                <div className="flex gap-2">
                  <h3 className="font-bold capitalize">Email</h3>
                  <span className="font-bold">:</span>
                  <p>{el.email}</p>
                </div>
                <div className="flex gap-2">
                  <h3 className="font-bold capitalize">Mobile Number</h3>
                  <span className="font-bold">:</span>
                  <p>{el.mobile_no}</p>
                </div>
              </Card>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No order details found.
              </td>
            </tr>
          )}
        </div>

        {/* for Delivery */}
        <div className="my-4">
          <Card
            key={orderDetails.customer_address_id}
            title="Delivery Details"
            bordered={false}
            style={{ width: 350, height: 195 }}
          >
            <div className="flex gap-2">
              <h3 className="font-bold capitalize">Delivery Address</h3>
              <span className="font-bold">:</span>
              <p>{orderDetails.customer_address}</p>
            </div>
          </Card>
        </div>

        {/* for Billing */}
        <div className="my-4">
          <Card
            title="Billing Details"
            key={orderDetails.customer_address}
            bordered={false}
            style={{ width: 350, height: 195 }}
          >
            <div className="flex gap-2">
              <h3 className="font-bold capitalize">Billing Address</h3>
              <span className="font-bold">:</span>
              <p>{orderDetails.customer_address}</p>
            </div>
          </Card>
        </div>

        {/* for payment */}
        <div className="my-4">
          <Card
            title="Payment Details"
            key={orderDetails.is_cod}
            bordered={false}
            style={{ width: 350, height: 195 }}
          >
            <div className="">
              <div className="flex gap-2">
                <h3 className="font-bold capitalize">Payment Method</h3>
                <span className="font-bold">:</span>
                <p>{orderDetails.is_cod == 1 ? "COD" : "UPI"}</p>
              </div>
              <div className="flex gap-2">
                <h3 className="font-bold capitalize">Payment Status</h3>
                <span className="font-bold">:</span>
                <p>
                  {orderDetails.status == 0
                    ? "Pending"
                    : orderDetails.status == 1
                    ? "In Progress"
                    : "Paid"}
                </p>
              </div>
              <div className="flex gap-2">
                <h3 className="font-bold capitalize">SubTotal</h3>
                <span className="font-bold">:</span>
                <p>₹{orderDetails.subtotal}/-</p>
              </div>
              <div className="flex gap-2">
                <h3 className="font-bold capitalize">Discount</h3>
                <span className="font-bold">:</span>
                <p>₹{orderDetails.subtotal - orderDetails.total}/-</p>
              </div>
              <div className="flex gap-2">
                <h3 className="font-bold capitalize">Total</h3>
                <span className="font-bold">:</span>
                <p>₹{orderDetails.subtotal - orderDetails.total}/-</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default DetailsOfCustomer;
