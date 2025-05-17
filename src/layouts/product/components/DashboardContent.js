import React, { useState } from "react";
import { Card, Modal, Tabs } from "antd";
import { createSearchParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import Loader from "layouts/loader/Loader";
import ListingProduct from "../content-dashboard/ListingProduct";
import RawProduct from "../content-dashboard/RawProduct";
import ReadyProduct from "../content-dashboard/ReadyProduct";
import Editing from "../content-dashboard/Editing";
import TotalDesigner from "../content-dashboard/TotalDesigner";
import TotalVendors from "../content-dashboard/TotalVendors";
import ListProductByCategory from "../content-dashboard/ListProductByCategory";
import LiveProduct from "../content-dashboard/LiveProduct";
import PhotoShootDone from "../content-dashboard/PhotoShootDone";
import RawProductList from "../content-dashboard/RawProductList";
import ReadyProductList from "../content-dashboard/ReadyProductList";
import EditingProductList from "../content-dashboard/EditingProductList";
import LiveProductList from "../content-dashboard/LiveProductList";
import PhotoDoneList from "../content-dashboard/PhotoDoneList";

const { TabPane } = Tabs;

const onChange = (key) => {
  console.log(key);
};

const DashboardContent = () => {
  let [searchParam] = useSearchParams();
  let Navigate = useNavigate();

  const [allDetails, setAllDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTabKey, setActiveTabKey] = useState("2");

  const handleCardClick = (tabKey) => {
    setActiveTabKey(tabKey);
  };

  const getDetails = async () => {
    setLoading(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `dashboard/get-statics`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.warn(result)
        setAllDetails(result.data);
        if (result.status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getDetails();
  }, []);

  const [selectedCard, setSelectedCard] = useState("Total Product");
  const [MainList, setMainList] = useState("");
  const [Titles, setTitles] = useState("");
  const [ListingRawProduct, setListingRawProduct] = useState("");
  const [ListingReadyProduct, setListingReadyProduct] = useState("");
  const [ListingEdit, setListingEdit] = useState("");
  const [ListingLive, setListingLive] = useState("");
  const [ListingPhotos, setListingPhotos] = useState("");

  const handleClick = (id, title) => {
    setActiveTabKey("8");
    setMainList(id);
    setTitles(title);
  };

  const handleClickRawProduct = (id, title) => {
    setActiveTabKey("11");
    setListingRawProduct(id);
    setTitles(title);
  };

  const handleClickReadyProduct = (id, title) => {
    setActiveTabKey("12");
    setListingReadyProduct(id);
    setTitles(title);
  };

  const handleClickEditProduct = (id, title) => {
    setActiveTabKey("13");
    setListingEdit(id);
    setTitles(title);
  };

  const handleClickLivedProduct = (id, title) => {
    setActiveTabKey("14");
    setListingLive(id);
    setTitles(title);
  };

  const handleClickPhotoDone = (id, title) => {
    setActiveTabKey("15");
    setListingPhotos(id);
    setTitles(title);
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
          <Tabs defaultActiveKey="1" onChange={onChange}>
            <TabPane tab="Vendor Details" key="1">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {/* Table content for Tab 1 */}
                {/* <div className="flex gap-6 ml-4 sm:flex-col-1 md:flex-row lg:flex-row xl:flex-row "> */}
                <div className="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 px-2">
                  {/* total product */}
                  <div
                    onClick={() => {
                      handleCardClick("2");
                      setSelectedCard("Total Product");
                    }}
                  >
                    <Card
                      key={allDetails.data}
                      title=""
                      bordered={false}
                      //   style={{ width: 375, height: 100 }}
                      className={`${
                        selectedCard === "Total Product" ? "bg-black text-white" : ""
                      } my-4 border border-gray-800 rounded-lg`}
                    >
                      <div className="flex flex-col ">
                        <h3 className="font-semibold capitalize ml-2 text-lg">
                          Total Product
                        </h3>
                        <h5 className="font-bold capitalize ml-2 mt-1 text-xl">
                          {allDetails.total_counts}
                        </h5>
                      </div>
                    </Card>
                  </div>

                  {/* raw product */}
                  <div
                    // className="my-4 border border-gray-800 rounded-lg"
                    onClick={() => {
                      handleCardClick("3");
                      setSelectedCard("Raw Product");
                    }}
                  >
                    <Card
                      //   key={orderDetails.customer_address_id}
                      title=""
                      bordered={false}
                      //   style={{ width: 375, height: 100 }}
                      className={`${
                        selectedCard === "Raw Product" ? "bg-black text-white" : ""
                      } my-4 border border-gray-800 rounded-lg`}
                    >
                      <div className="flex flex-col ">
                        <h3 className="font-semibold capitalize ml-2 text-lg">Raw Product</h3>
                        <h5 className="font-bold capitalize ml-2 mt-1 text-xl">
                          {allDetails.raw_products}
                        </h5>
                      </div>
                    </Card>
                  </div>

                  {/* ready product */}
                  <div
                    onClick={() => {
                      handleCardClick("4")
                      setSelectedCard("Ready Product");
                    }}
                  >
                    <Card
                      //   key={orderDetails.customer_address_id}
                      title=""
                      bordered={false}
                      //   style={{ width: 375, height: 100 }}
                      className={`${
                        selectedCard === "Ready Product" ? "bg-black text-white" : ""
                      } my-4 border border-gray-800 rounded-lg`}
                    >
                      <div className="flex flex-col ">
                        <h3 className="font-semibold capitalize ml-2 text-lg">
                          Ready Product
                        </h3>
                        <h5 className="font-bold capitalize ml-2 mt-1 text-xl">
                          {allDetails.ready}
                        </h5>
                      </div>
                    </Card>
                  </div>

                  {/* editing product */}
                  <div
                    onClick={() => {
                      handleCardClick("5")
                      setSelectedCard("Editing");
                    }}
                  >
                    <Card
                      //   key={orderDetails.customer_address_id}
                      title=""
                      bordered={false}
                      //   style={{ width: 375, height: 100 }}
                      className={`${
                        selectedCard === "Editing" ? "bg-black text-white" : ""
                      } my-4 border border-gray-800 rounded-lg`}
                    >
                      <div className="flex flex-col ">
                        <h3 className="font-semibold capitalize ml-2 text-lg">
                          Editing
                        </h3>
                        <h5 className="font-bold capitalize ml-2 mt-1 text-xl">
                          {allDetails.editing_started}
                        </h5>
                      </div>
                    </Card>
                  </div>

                  {/* total designer */}
                  <div
                    onClick={() => {
                      handleCardClick("6")
                      setSelectedCard("Total designer");
                    }}
                  >
                    <Card
                      //   key={orderDetails.customer_address_id}
                      title=""
                      bordered={false}
                      //   style={{ width: 375, height: 100 }}
                      className={`${
                        selectedCard === "Total designer" ? "bg-black text-white" : ""
                      } my-4 border border-gray-800 rounded-lg`}
                    >
                      <div className="flex flex-col ">
                        <h3 className="font-semibold capitalize ml-2 text-lg">
                          Total designer
                        </h3>
                        <h5 className="font-bold capitalize ml-2 mt-1 text-xl">
                          {allDetails.designers_count}
                        </h5>
                      </div>
                    </Card>
                  </div>

                  {/* number of vendor */}
                  <div
                    onClick={() => {
                      handleCardClick("7")
                      setSelectedCard("Number of Vendor");
                    }}
                  >
                    <Card
                      //   key={orderDetails.customer_address_id}
                      title=""
                      bordered={false}
                      //   style={{ width: 375, height: 100 }}
                      className={`${
                        selectedCard === "Number of Vendor" ? "bg-black text-white" : ""
                      } my-4 border border-gray-800 rounded-lg`}
                    >
                      <div className="flex flex-col ">
                        <h3 className="font-semibold capitalize ml-2 text-lg">
                          Number of Vendor
                        </h3>
                        <h5 className="font-bold capitalize ml-2 mt-1 text-xl">
                          {allDetails.vendors_count}
                        </h5>
                      </div>
                    </Card>
                  </div>

                  {/* live product */}
                  <div
                    onClick={() =>{
                       handleCardClick("9")
                       setSelectedCard("Live Product");
                      }}
                  >
                    <Card
                      //   key={orderDetails.customer_address_id}
                      title=""
                      bordered={false}
                      //   style={{ width: 375, height: 100 }}
                      className={`${
                        selectedCard === "Live Product" ? "bg-black text-white" : ""
                      } my-4 border border-gray-800 rounded-lg`}
                    >
                      <div className="flex flex-col ">
                        <h3 className="font-semibold capitalize ml-2 text-lg">
                          Live Product
                        </h3>
                        <h5 className="font-bold capitalize ml-2 mt-1 text-xl">
                          {allDetails.live}
                        </h5>
                      </div>
                    </Card>
                  </div>

                  {/* photoshoot */}
                  <div
                    onClick={() =>{
                       handleCardClick("10")
                       setSelectedCard("PhotoShoot Done");
                      }}
                  >
                    <Card
                      //   key={orderDetails.customer_address_id}
                      title=""
                      bordered={false}
                      //   style={{ width: 375, height: 100 }}
                      className={`${
                        selectedCard === "PhotoShoot Done" ? "bg-black text-white" : ""
                      } my-4 border border-gray-800 rounded-lg`}
                    >
                      <div className="flex flex-col ">
                        <h3 className="font-semibold capitalize ml-2 text-lg">
                          PhotoShoot Done
                        </h3>
                        <h5 className="font-bold capitalize ml-2 mt-1 text-xl">
                          {allDetails.photoshoot_done}
                        </h5>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>

          {/* Second Tab */}
          <div className="mt-4">
            <Tabs activeKey={activeTabKey}>
              {/*  */}
              <TabPane tab="" key="2">
                <ListingProduct handleClick={handleClick} />
              </TabPane>
              <TabPane tab="" key="8">
                <ListProductByCategory MainList={MainList} Titles={Titles} />
              </TabPane>

              {/*  */}
              <TabPane tab="" key="3">
                <RawProduct handleClickRawProduct={handleClickRawProduct} />
              </TabPane>
              <TabPane tab="" key="11">
                <RawProductList ListingRawProduct={ListingRawProduct} Titles={Titles} />
              </TabPane>

              {/*  */}
              <TabPane tab="" key="4">
                <ReadyProduct handleClickReadyProduct={handleClickReadyProduct} />
              </TabPane>
              <TabPane tab="" key="12">
                <ReadyProductList ListingReadyProduct={ListingReadyProduct} Titles={Titles} />
              </TabPane>

              {/*  */}
              <TabPane tab="" key="5">
                <Editing handleClickEditProduct={handleClickEditProduct} />
              </TabPane>
              <TabPane tab="" key="13">
                <EditingProductList ListingEdit={ListingEdit} Titles={Titles} />
              </TabPane>

              {/*  */}
              <TabPane tab="" key="6">
                <TotalDesigner  getDetails={getDetails} />
              </TabPane>

              {/*  */}
              <TabPane tab="" key="7">
                <TotalVendors />
              </TabPane>

              {/*  */}
              <TabPane tab="" key="9">
                <LiveProduct handleClickLivedProduct={handleClickLivedProduct} />
              </TabPane>
              <TabPane tab="" key="14">
                <LiveProductList ListingLive={ListingLive} Titles={Titles} />
              </TabPane>

              {/*  */}
              <TabPane tab="" key="10">
                <PhotoShootDone handleClickPhotoDone={handleClickPhotoDone} />
              </TabPane>
              <TabPane tab="" key="15">
                <PhotoDoneList ListingPhotos={ListingPhotos} Titles={Titles}/>
              </TabPane>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardContent;
