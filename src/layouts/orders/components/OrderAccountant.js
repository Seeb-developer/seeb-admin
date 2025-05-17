import React from "react";
// @mui material components
import Card from "@mui/material/Card";
import { Divider } from "antd";

const OrderAccountant = () => {
  return (
    <div>
      <div className="flex gap-4 justify-center">
        {/* first main div */}
        <div className="grid grid-cols-2 gap-3 w-4/6">
          <div className="my-4">
            <Card
              //   key={orderDetails.customer_address_id}
              title="Delivery Details"
              bordered={false}
              // style={{ width: 480, height: 220 }}
              className="w-full h-[220px]"
            >
              <div className="">
                <h3 className="font-bold capitalize ml-2">Total Revenue</h3>
                <h5 className="font-semibold capitalize ml-2">₹ 7,00,000</h5>
                <Divider className="mt-2" />
                {/* <p>{orderDetails.customer_address}</p> */}
              </div>
            </Card>
          </div>

          <div className="my-4">
            <Card
              //   key={orderDetails.customer_address_id}
              title="Delivery Details"
              bordered={false}
              // style={{ width: 480, height: 220 }}
              className="w-full h-[220px]"
            >
              <div className="">
                <h3 className="font-bold capitalize ml-2">Total Revenue</h3>
                <h5 className="font-semibold capitalize ml-2">₹ 7,00,000</h5>
                <Divider className="mt-2" />
                {/* <p>{orderDetails.customer_address}</p> */}
              </div>
            </Card>
          </div>

          <div className="my-4">
            <Card
              //   key={orderDetails.customer_address_id}
              title="Delivery Details"
              bordered={false}
              // style={{ width: 480, height: 220 }}
              className="w-full h-[220px]"
            >
              <div className="">
                <h3 className="font-bold capitalize ml-2">Total Revenue</h3>
                <h5 className="font-semibold capitalize ml-2">₹ 7,00,000</h5>
                <Divider className="mt-2" />
                {/* <p>{orderDetails.customer_address}</p> */}
              </div>
            </Card>
          </div>

          <div className="my-4">
            <Card
              //   key={orderDetails.customer_address_id}
              title="Delivery Details"
              bordered={false}
              // style={{ width: 480, height: 220 }}
              className="w-full h-[220px]"
            >
              <div className="">
                <h3 className="font-bold capitalize ml-2">Total Revenue</h3>
                <h5 className="font-semibold capitalize ml-2">₹ 7,00,000</h5>
                <Divider className="mt-2" />
                {/* <p>{orderDetails.customer_address}</p> */}
              </div>
            </Card>
          </div>
        </div>

        {/* second main div */}
        <div className="mx-2">
          <div className="my-4">
            <Card
              // key={orderDetails.customer_address_id}
              title="Delivery Details"
              bordered={false}
              style={{ width: 400, height: 500 }}
            >
              <div className="">
                <h3 className="font-bold capitalize text-center items-center mt-2">Notification</h3>
                <Divider />
                {/* <p>{orderDetails.customer_address}</p> */}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAccountant;
