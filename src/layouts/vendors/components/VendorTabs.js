import React, { useState } from "react";
import { Card, Modal, Tabs } from "antd";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import Loader from "layouts/loader/Loader";
import VendorProductList from "../VendorProductList";

const { TabPane } = Tabs;

const onChange = (key) => {
  console.log(key);
};

const VendorTabs = () => {
  let [searchParam] = useSearchParams();
  let Navigate = useNavigate();

  const [vendorList, setVendorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewClick = () => {
    setModalVisible(true);
  };

  const closeModalAadhar = () => {
    setModalVisible(false);
  };
  const handleViewClickPan = () => {
    setModalVisible(true);
  };

  const closeModalPan = () => {
    setModalVisible(false);
  };
  const handleViewClickShopAct = () => {
    setModalVisible(true);
  };

  const closeModalShopAct = () => {
    setModalVisible(false);
  };

  // const getDetails = async () => {
  //     setLoading(true);
  //     var requestOptions = {
  //         method: 'GET',
  //         redirect: 'follow'
  //     };

  //     await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `product/orders/getbycustomer/${searchParam.get("id")}`, requestOptions)
  //         .then(response => response.json())
  //         .then(result => {
  //             // console.warn(result)
  //             setVendorList(result.orders)
  //             if (result.status === 200) {
  //                 setLoading(false);
  //             }
  //         })
  //         .catch(error => console.log('error', error));
  // }

  // useEffect(() => {
  //     getDetails();
  // }, [])

  return (
    <>
      {/* {loading ? (
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
          ) : ( */}
      <div>
        <Tabs defaultActiveKey="1" onChange={onChange}>
          <TabPane tab="Vendor Details" key="1">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              {/* Table content for Tab 1 */}
              <div className="flex gap-6 ml-4 sm:flex-col-1 md:flex-row lg:flex-row xl:flex-row ">
                {/* raw product */}
                <div className="my-4 border border-gray-800 rounded-lg">
                  <Card
                    //   key={orderDetails.customer_address_id}
                    title=""
                    bordered={false}
                    style={{ width: 350, height: 100 }}
                  >
                    <div className="flex flex-col ">
                      <h3 className="font-semibold capitalize ml-2 text-lg text-gray-600">
                        Total Product
                      </h3>
                      <h5 className="font-bold capitalize ml-2 mt-1 text-xl">614</h5>
                      {/* <p>{orderDetails.customer_address}</p> */}
                    </div>
                  </Card>
                </div>

                {/* raw product */}
                <div className="my-4 border border-gray-800 rounded-lg">
                  <Card
                    //   key={orderDetails.customer_address_id}
                    title=""
                    bordered={false}
                    style={{ width: 350, height: 100 }}
                  >
                    <div className="flex flex-col ">
                      <h3 className="font-semibold capitalize ml-2 text-lg text-gray-600">
                        Raw Product
                      </h3>
                      <h5 className="font-bold capitalize ml-2 mt-1 text-xl">124</h5>
                      {/* <p>{orderDetails.customer_address}</p> */}
                    </div>
                  </Card>
                </div>

                {/* ready product */}
                <div className="my-4 border border-gray-800 rounded-lg">
                  <Card
                    //   key={orderDetails.customer_address_id}
                    title=""
                    bordered={false}
                    style={{ width: 350, height: 100 }}
                  >
                    <div className="flex flex-col ">
                      <h3 className="font-semibold capitalize ml-2 text-lg text-gray-600">
                        Ready Product
                      </h3>
                      <h5 className="font-bold capitalize ml-2 mt-1 text-xl">614</h5>
                      {/* <p>{orderDetails.customer_address}</p> */}
                    </div>
                  </Card>
                </div>
              </div>

              {/* next/details card */}
              <div className="w-full my-8 px-8 ">
                <Card
                  // key={el.id}
                  title=""
                  bordered={false}
                  // style={{ width: 350, height: 195 }}
                  className="w-full h-80 shadow-lg"
                >
                  <div className="flex">
                    <div>
                      <div className="flex gap-2 my-4">
                        <h3 className="font-bold capitalize text-xl">Vendor Name</h3>
                        <span className="font-bold">:</span>
                        {/* <p>{el.name}</p> */}
                        <p className="font-semibold capitalize text-lg">name</p>
                      </div>
                      <div className="flex gap-2 my-4">
                        <h3 className="font-bold capitalize text-xl">Email</h3>
                        <span className="font-bold">:</span>
                        {/* <p>{el.email}</p> */}
                        <p className="font-semibold capitalize text-lg">email</p>
                      </div>
                      <div className="flex gap-2 my-4">
                        <h3 className="font-bold capitalize text-xl">Mobile Number</h3>
                        <span className="font-bold">:</span>
                        {/* <p>{el.mobile_no}</p> */}
                        <p className="font-semibold capitalize text-lg">9834845723</p>
                      </div>
                      <div className="flex gap-2 my-4">
                        <h3 className="font-bold capitalize text-xl">Address</h3>
                        <span className="font-bold">:</span>
                        {/* <p>{el.mobile_no}</p> */}
                        <p className="font-semibold capitalize text-lg w-1/3">
                          address 123 Main Street, apt 4B San Diego CA, 91911, 123 Main Street, apt
                          4B would be considered address line 1.
                        </p>
                      </div>
                    </div>
                    {/*  */}
                    <div className="">
                      <div className="">
                        <button
                          className="bg-black text-white right-0 px-3 py-1 text-sm rounded-md"
                          onClick={() =>
                            Navigate({
                              pathname: "/vendor-add",
                            //   search: createSearchParams({
                            //     id: Brand.id,
                            //   }).toString(),
                            })
                          }
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex justify-center mt-8 gap-6">
                        {/* aadhar */}
                      <div className="">
                        <button
                          className="bg-black text-white right-0 px-3 py-2 text-sm rounded-md"
                          onClick={() => handleViewClick()}
                        >
                          Aadhar Card
                        </button>
                        <Modal open={modalVisible} onCancel={closeModalAadhar} footer={null}>
                          {/* {selectedImageAadhar && ( */}
                            <img
                              src=""
                              alt="Preview"
                              style={{ width: "100%", height: "auto" }}
                            />
                          {/* )} */}
                        </Modal>
                      </div>
                      {/* pan */}
                      <div className="">
                        <button
                          className="bg-black text-white right-0 px-4 py-2 text-sm rounded-md"
                          onClick={() => handleViewClickPan()}
                        >
                          Pan Card
                        </button>
                        <Modal open={modalVisible} onCancel={closeModalPan} footer={null}>
                          {/* {selectedImageAadhar && ( */}
                            <img
                              src=""
                              alt="Preview"
                              style={{ width: "100%", height: "auto" }}
                            />
                          {/* )} */}
                        </Modal>
                      </div>
                      </div>
                      {/* shop act */}
                      <div className="mt-8">
                        <button
                          className="bg-black text-white right-0 px-4 py-2 text-sm rounded-md w-full"
                          onClick={() => handleViewClickShopAct()}
                        >
                          Shop Act License
                        </button>
                        <Modal open={modalVisible} onCancel={closeModalShopAct} footer={null}>
                          {/* {selectedImageAadhar && ( */}
                            <img
                              src=""
                              alt="Preview"
                              style={{ width: "100%", height: "auto" }}
                            />
                          {/* )} */}
                        </Modal>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <h3 className="font-bold capitalize text-xl">GST</h3>
                        <span className="font-bold">:</span>
                        {/* <p>{el.name}</p> */}
                        <p className="font-semibold capitalize text-lg">XXXXX16114</p>
                      </div>

                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabPane>
          </Tabs>


          {/* Second Tab */}
          <Tabs>
          <TabPane tab="Vendor Product Details" key="2">
            <VendorProductList />
          </TabPane>
        </Tabs>
      </div>
      {/* )} */}
    </>
  );
};

export default VendorTabs;
