import React, { useState } from "react";
import { Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { RxCross2 } from "react-icons/rx";
import { AiOutlinePlus } from "react-icons/ai";
import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import moment from "moment/moment";
import dayjs from "dayjs";
let index = 0;

const { Option } = Select;

const UpdatePromoCode = () => {
  let Navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const [items, setItems] = useState(["Percent", "Amount", "Services"]);
  const [selectedItem, setSelectedItem] = useState("");
  const [CouponType, setCouponType] = useState([
    "Shopkeeper",
    "Channel Partner",
    "Area",
    "Universal",
  ]);
  const [selectedType, setSelectedType] = useState("");
  const [percentValue, setPercentValue] = useState("");
  const [amountValue, setAmountValue] = useState("");
  const [servicesValue, setServicesValue] = useState("");
  const [shopkeeperValue, setShopkeeperValue] = useState("");
  const [channelPartnerValue, setChannelPartnerValue] = useState("");
  const [areaValue, setAreaValue] = useState("");
  const [universalValue, setUniversalValue] = useState("");
  const [couponName, setCouponName] = useState("");
  const [description, setDescription] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponExpiry, setCouponExpiry] = useState("");
  const [cartMinAmount, setCartMinAmount] = useState("");
  const [couponUseLimit, setCouponUseLimit] = useState("");
  const [perUsageLimit, setPerUsageLimit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleItemSelection = (selectedItem) => {
    setSelectedItem(selectedItem);
  };

  const handleTypeSelection = (selectedType) => {
    setSelectedType(selectedType);
  };

  const [couponData, setCouponData] = useState([]);

  const handleAddTerms = (e) => {
    e.preventDefault();
    setCouponData([...couponData, ""]);
  };

  const handleRemoveterms = (index) => {
    const updatedFields = [...couponData];
    updatedFields.splice(index, 1);
    setCouponData(updatedFields);
  };

  const handleChangeTerms = (index, event) => {
    const updatedFields = [...couponData];
    updatedFields[index] = event.target.value;
    setCouponData(updatedFields);
  };

  // Get Coupon by id
  const [couponCodeData, setCouponCodeData] = useState(null);

  const fetchCoupon = async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    await fetch(
      process.env.REACT_APP_HAPS_MAIN_BASE_URL + `coupon/getById/${searchParam.get("id")}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setCouponCodeData(result.coupon);
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    fetchCoupon();
  }, [searchParam]);

  useEffect(() => {
    if (couponCodeData) {
      setSelectedType(JSON.parse(couponCodeData.coupon_category));
      setSelectedItem(JSON.parse(couponCodeData.coupon_type));
      setPercentValue(couponCodeData.coupon_type_name);
      setAmountValue(couponCodeData.coupon_type_name);
      setServicesValue(couponCodeData.coupon_type_name);
      setShopkeeperValue(couponCodeData.shop_keeper);
      setChannelPartnerValue(couponCodeData.channel_partner);
      setAreaValue(couponCodeData.area);
      setUniversalValue(couponCodeData.universal);
      setCouponName(couponCodeData.coupon_name);
      setDescription(couponCodeData.description);
      setCouponCode(couponCodeData.coupon_code);
      setCouponExpiry(couponCodeData.coupon_expiry);
      setCartMinAmount(couponCodeData.cart_minimum_amount);
      setCouponUseLimit(couponCodeData.coupon_use_limit);
      setPerUsageLimit(couponCodeData.coupon_per_user_limit);
      setCouponData(JSON.parse(JSON.parse(couponCodeData.terms_and_conditions)));
    }
  }, [couponCodeData]);

  useEffect(() => {
    setStartDate(dayjs(couponExpiry[0]));
    setEndDate(dayjs(couponExpiry[1]));
  }, [couponExpiry]);


  // update coupon code
  const handleUpdateCouponCode = async () => {
    var myHeaders = new Headers();
    setLoading(true);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      coupon_category: JSON.stringify(selectedType),
      shop_keeper: shopkeeperValue,
      channel_partner: channelPartnerValue,
      area: areaValue,
      universal: universalValue,
      coupon_type: selectedItem,
      coupon_type_name:
        selectedItem === 1 ? percentValue : selectedItem === 2 ? amountValue : servicesValue,
      coupon_name: couponName,
      description: description,
      coupon_expiry: JSON.stringify([startDate, endDate]),
      cart_minimum_amount: cartMinAmount,
      coupon_use_limit: couponUseLimit,
      coupon_per_user_limit: perUsageLimit,
      coupon_code: couponCode,
      terms_and_conditions: JSON.stringify(couponData),
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(
      process.env.REACT_APP_HAPS_MAIN_BASE_URL + `coupon/couponupdate/${searchParam.get("id")}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          // setCouponType('');
          setShopkeeperValue("");
          setChannelPartnerValue("");
          setAreaValue("");
          setUniversalValue("");
          setCouponName("");
          setDescription("");
          setCouponExpiry("");
          setCartMinAmount("");
          setCouponUseLimit("");
          setPerUsageLimit("");
          setCouponCode("");
          setCouponData([]);
        }
        if (result.status === 200) {
          toast.success("Coupon Updated successfully", {
            theme: "light",
            autoClose: "2000",
          });
          Navigate("/coupon-list");
        } else {
          // message.error('Failed to create product');
        }
      })
      .catch((error) => console.log("error", error))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full  mx-auto p-4 bg-white rounded-md shadow-md text-sm">

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
            Coupon Category
          </label>
          <Select
            className="w-full "
            placeholder="Select Coupon Type"
            dropdownRender={(menu) => <>{menu}</>}
            options={CouponType.map((item, i) => ({
              label: item,
              value: i + 1,
            }))}
            value={selectedType}
            onChange={(selectedValue) => handleTypeSelection(selectedValue)}
            mode="multiple"
          />
        </div>

        {selectedType === "" && (
          <div className="mb-4">
            <label htmlFor="percentage" className="block text-gray-700 font-semibold mb-2">
              Coupon Category Name
            </label>
            <input
              type=""
              value=""
              // onClick={(e) => e.preventDefault()}
              // disabled={selectedType === ''}
              placeholder=""
              className="w-full mt-0 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
            />
          </div>
        )}

        {selectedType.includes(1) && (
          <div className="mb-4">
            <label htmlFor="shopkeeper" className="block text-gray-700 font-semibold mb-2">
              Shopkeeper
            </label>
            <input
              type="text"
              value={shopkeeperValue}
              onChange={(e) => setShopkeeperValue(e.target.value)}
              placeholder="Enter shopkeeper"
              className="w-full mt-0 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
            />
          </div>
        )}

        {selectedType.includes(2) && (
          <div className="mb-4">
            <label htmlFor="channelPartner" className="block text-gray-700 font-semibold mb-2">
              Channel Partner
            </label>
            <input
              type="text"
              value={channelPartnerValue}
              onChange={(e) => setChannelPartnerValue(e.target.value)}
              placeholder="Enter channel partner"
              className="w-full mt-0 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
            />
          </div>
        )}

        {selectedType.includes(3) && (
          <div className="mb-4">
            <label htmlFor="channelPartner" className="block text-gray-700 font-semibold mb-2">
              Area
            </label>
            <input
              type="text"
              value={areaValue}
              onChange={(e) => setAreaValue(e.target.value)}
              placeholder="Enter area pincode"
              className="w-full mt-0 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
            />
          </div>
        )}

        {/* {selectedType.includes(4) && (
          <div className="mb-4">
            <label htmlFor="channelPartner" className="block text-gray-700 font-semibold mb-2">
              Universal
            </label>
            <input
              type="text"
              value={universalValue}
              onChange={(e) => setUniversalValue(e.target.value)}
              placeholder="Enter channel partner"
              className="w-full mt-0 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
            />
          </div>
        )} */}

        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
            Coupon Type
          </label>
          <Select
            className="w-full "
            placeholder="Select Coupon Type"
            dropdownRender={(menu) => <>{menu}</>}
            options={items.map((item, i) => ({
              label: item,
              value: i + 1,
            }))}
            value={selectedItem}
            onChange={(selectedValue) => handleItemSelection(selectedValue)}
          />
        </div>
        {selectedItem === "" && (
          <div className="mb-4">
            <label htmlFor="percentage" className="block text-gray-700 font-semibold mb-2">
              Coupon Type Name
            </label>
            <input
              type=""
              value=""
              onClick={(e) => e.preventDefault()}
              disabled={selectedItem === ""}
              placeholder=""
              className="w-full mt-0 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
            />
          </div>
        )}

        {selectedItem === 1 && (
          <div className="mb-4">
            <label htmlFor="percentage" className="block text-gray-700 font-semibold mb-2">
              Percentage
            </label>
            <div className="relative">
              <input
                type="number"
                value={percentValue}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  if (inputValue <= 100) {
                    setPercentValue(inputValue);
                  } else {
                    setPercentValue("");
                  }
                }}
                placeholder="Enter percentage"
                className="nothing w-full mt-0 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs appearance-none"
              />
              <span className="absolute right-3 top-2 text-gray-500">%</span>
            </div>
          </div>
        )}

        {selectedItem === 2 && (
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-semibold mb-2">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={amountValue}
                onChange={(e) => setAmountValue(e.target.value)}
                placeholder="Enter amount"
                className="nothing w-full mt-0 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs appearance-none"
              />
              <span className="absolute right-3 top-2 text-gray-500">₹</span>
            </div>
          </div>
        )}

        {selectedItem === 3 && (
          <div className="mb-4">
            <label htmlFor="services" className="block text-gray-700 font-semibold mb-2">
              Services
            </label>
            <input
              type="text"
              value={servicesValue}
              onChange={(e) => setServicesValue(e.target.value)}
              placeholder="Enter services"
              className="w-full mt-0 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
            />
          </div>
        )}

        <div className="mt-4">
          <label htmlFor="productName" className="block text-gray-700 font-semibold ">
            Coupon Name
          </label>
          <input
            type="text"
            id=""
            name=""
            placeholder="Enter Coupon name"
            value={couponName}
            onChange={(e) => setCouponName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="productName" className="block text-gray-700 font-semibold ">
            Coupon Code
          </label>
          <input
            type="text"
            id=""
            name=""
            placeholder="Enter Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="productName" className="block text-gray-700 font-semibold ">
            Description
          </label>
          <textarea
            type="textarea"
            id=""
            name=""
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
          />
        </div>

        <div className="my-4">
          <label htmlFor="productName" className="block text-gray-700 font-semibold ">
            Coupon Expiry
          </label>
          <RangePicker
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
            value={[startDate, endDate]}
            onChange={(value) => {
              setStartDate(value[0]);
              setEndDate(value[1]);
            }}
          />
        </div>

        <div className="my-4">
          <label htmlFor="productName" className="block text-gray-700 font-semibold ">
            Cart Minimun Amount
          </label>
          <input
            type="text"
            id=""
            name=""
            placeholder="Enter minimum amount"
            value={cartMinAmount}
            onChange={(e) => setCartMinAmount(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
          />
        </div>

        <div className="my-4">
          <label htmlFor="productName" className="block text-gray-700 font-semibold ">
            Usage Limit
          </label>
          <input
            type="text"
            id=""
            name=""
            placeholder="Enter Usage limit"
            value={couponUseLimit}
            onChange={(e) => setCouponUseLimit(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
          />
        </div>

        <div className="my-4">
          <label htmlFor="productName" className="block text-gray-700 font-semibold ">
            Per User Limit
          </label>
          <input
            type="text"
            id=""
            name=""
            placeholder="Enter per user limit"
            value={perUsageLimit}
            onChange={(e) => setPerUsageLimit(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-xs"
          />
        </div>
      </div>

      {/* Add Field Section */}
      <div className="mt-8">
        <div className="">
          <button
            onClick={handleAddTerms}
            className="bg-gray-50 text-sm p-2 rounded-lg border-2 w-full border-dotted my-4 flex justify-center gap-2 items-center"
          >
            Add Terms And Condition
            <span>
              <AiOutlinePlus className="text-black" />
            </span>
          </button>
          {/* {console.log(JSON.parse(couponData))}  */}
          {couponData.length > 0 &&
            couponData?.map((input, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  className="bg-gray-50 my-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={input}
                  placeholder="write terms and condition..."
                  onChange={(event) => handleChangeTerms(index, event)}
                />
                <RxCross2
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleRemoveterms(index)}
                />
              </div>
            ))}
        </div>
      </div>

      <div>
        {loading ? (
          <div className="relative w-full py-2 mt-4 text-white">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              className="w-full py-2 mt-4 text-white bg-black hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ) : (
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-black hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleUpdateCouponCode}
          >
            Update Coupon
          </button>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default UpdatePromoCode;
