import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Divider, Skeleton, Steps, Button, theme, message, Modal } from "antd";
import { ToastContainer, toast } from "react-toastify";
import { apiCall } from "utils/apiClient";

const OrderTracking = () => {
  let { slug } = useParams();
  const [searchParam] = useSearchParams();
  const { token } = theme.useToken();
  const [OrderDetails, setOrderDetails] = useState();
  const [CustomerInvoiceLink, setCustomerInvoiceLink] = useState();
  const [SkeletonLoad, setSkeletonLoad] = useState(true);
  const [current, setCurrent] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderTimeline, setOrderTimeline] = useState([]);

  const [isCancelModalVisible, setisCancelModalVisible] = useState(false);

  const skeletonArray = Array.from({ length: 5 }, (_, index) => index);

  const getAllOrderDetails = async () => {
    setSkeletonLoad(true);
    try {
      const result = await apiCall({ endpoint: `product/getOrder/${searchParam.get("id")}`, method: "GET" });
      if (result.status === 200) {
        setOrderDetails(result);
        setOrderTimeline(result?.order?.timeline);
        setCurrent(result.order.status);
        setCustomerInvoiceLink(result.order.invoice_path);
        setSkeletonLoad(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getAllOrderDetails();
  }, []);

  const downloadFile = () => {
    if (CustomerInvoiceLink) {
      const link = document.createElement("a");
      link.href = process.env.REACT_APP_HAPS_MAIN_BASE_URL + CustomerInvoiceLink;
      link.download = CustomerInvoiceLink.split("/"); // Specify the desired filename for the downloaded file
      link.target = "_blank"; // To open in a new tab for browsers that don't support download attribute
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log("No Invoice");
    }
  };

  const emailAddress = "sales@hapspro.com";

  const steps = [
    {
      title: "Order Confirmed",
    },
    {
      title: "Dispatched",
    },
    {
      title: "Out for Delivery",
    },
    {
      title: "Delivered",
    },
  ];

  /* const steps = {
    "1" : "Order Confirmed",
    "2" : "Waiting for Dispatch",
    "3" : "Out for Delivery",
    "4" : "Delivered",
  } */
  const showModal = () => {
    setIsModalVisible(true);
  };
  const showCancelModal = () => {
    setisCancelModalVisible(true);
  };

  // Update order status

  const updateOrderStatus = async () => {
    try {
      const result = await apiCall({
        endpoint: "admin/update-order-status",
        method: "POST",
        data: {
          order_id: OrderDetails.order.id,
          status: parseInt(current) + 1,
          remark: "",
        },
      });
      if (result.status == 200) {
        setOrderTimeline(result.timeline);
        setCurrent(current + 1);
        getAllOrderDetails();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const cancelOrderStatus = async () => {
    try {
      const result = await apiCall({
        endpoint: "customer/cancel-order",
        method: "POST",
        data: {
          order_id: OrderDetails.order.id,
          remark: "cancelled",
        },
      });
      if (result.status === 200) {
        toast.success(`${result.msg}`);
        getAllOrderDetails();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleYesClick = () => {
    if (current < steps.length) {
      updateOrderStatus();
      setCurrent(current);
    }
    setIsModalVisible(false);
  };

  const handleNoClick = () => {
    setIsModalVisible(false);
  };

  const handleCancelYesClick = () => {
    cancelOrderStatus();
    setisCancelModalVisible(false);
  };

  const handleCancelNoClick = () => {
    setisCancelModalVisible(false);
  };

  // console.log(OrderDetails.order.id)
  // const prev = () => {
  //   setCurrent(current - 1);
  // };

  return (
    <>
      {SkeletonLoad ? (
        <div className="">
          {skeletonArray.map((index) => (
            <div key={index} className="mx-5">
              <Skeleton active={true} className="mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="px-8">
          <div className="flex justify-between items-center">
            <ToastContainer />
            <div>
              <h1 className="text-gray-800 text-base tracking-wide font-bold">
                Order ID:&nbsp;{OrderDetails && OrderDetails.order.razorpay_order_id}
              </h1>
              <h1 className="text-gray-800 text-base tracking-wide font-bold">
                Order Date :
                <span className="font-medium">{OrderDetails && OrderDetails.order.order_date}</span>
              </h1>
            </div>
            <button
              onClick={() => downloadFile(OrderDetails && OrderDetails.order.invoice_path)}
              className="text-white p-1.5 bg-black text-sm tracking-wider font-semibold"
            >
              View Invoice
            </button>
          </div>
          <Divider />

          {/* Tracking Bar */}
          <div>
            <li className="text-gray-800 text-lg tracking-wide font-bold list-disc">
              Track your Order!
            </li>
            <Steps
              progressDot
              current={current - 1}
              className="my-8"
              items={steps.map((step, index) => ({
                key: index,
                title: step.title,
                description: index < current ? orderTimeline[index].timeline : "",
              }))}
            />
            <div
              style={{
                lineHeight: "120px",
                textAlign: "center",
                color: token.colorTextTertiary,
                backgroundColor: token.colorFillAlter,
                borderRadius: token.borderRadiusLG,
                marginTop: 16,
              }}
            >
              {/* {steps[current].description} */}
            </div>
            <div style={{ marginTop: 24 }} className="flex justify-between my-4 items-center">
              {/* <div className="flex justify-between items-center"> */}
              {current < steps.length && (
                <Button onClick={showModal} className="bg-green-300 text-green-700 ">
                  Next
                </Button>
              )}
              {current < 4 ? (
                <Button
                  onClick={showCancelModal}
                  className="bg-red-300 text-red-700 hover:border-red-900"
                >
                  Cancle Order
                </Button>
              ) : (
                ""
              )}
              {/* {current >= steps.length - 1 && (
                <Button
                  onClick={() => message.success("Processing complete!")}
                  className="bg-gray-500 text-black"
                >
                  Done
                </Button>
              )} */}
              {/* {current > 0 && (
                  <Button
                    style={{ margin: "0 8px" }}
                    onClick={() => prev()}
                    className="bg-gray-500 text-black"
                  >
                    Previous
                  </Button>
                )} */}
              {/* </div> */}
            </div>
            {}
            <Modal
              title="Confirmation"
              open={isModalVisible}
              onCancel={handleNoClick}
              // maskStyle={{ backgroundColor: "transparent" }}
              footer={[
                <Button key="yes" onClick={handleYesClick} className="text-black bg-green-700">
                  Yes
                </Button>,
                <Button key="no" onClick={handleNoClick} className="text-black bg-red-600">
                  No
                </Button>,
              ]}
            >
              Are you sure you want to proceed to the next step?
            </Modal>

            <Modal
              title="Confirmation to Cancel"
              open={isCancelModalVisible}
              onCancel={handleNoClick}
              // maskStyle={{ backgroundColor: "transparent" }}
              footer={[
                <Button
                  key="yes"
                  onClick={handleCancelYesClick}
                  className="text-black bg-green-700"
                >
                  Yes
                </Button>,
                <Button key="no" onClick={handleCancelNoClick} className="text-black bg-red-600">
                  No
                </Button>,
              ]}
            >
              Are you sure you want to proceed to the next step?
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderTracking;
