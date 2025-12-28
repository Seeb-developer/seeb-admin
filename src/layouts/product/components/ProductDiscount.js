import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiCall } from "utils/apiClient";

const ProductDiscount = () => {
  const [discount, setDiscount] = useState("");
  const [increasePrice, setIncreasePrice] = useState("");

  const handleDiscount = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      discounted_percent: discount,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await apiCall({ endpoint: "product/applyDiscount", method: "PUT", data: { discounted_percent: discount } })
      .then((result) => {
        // console.log(result);
        if (result.status === 200) {
          toast.success("Discount applied successfully", {
            theme: "light",
            autoClose: "2000",
          });
        }
      })
      .catch((error) => console.log("error", error));
  };

  const getDiscount = async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    await apiCall({ endpoint: "product/getDiscount", method: "GET" })
      .then((result) => {
        console.log(result);
        setDiscount(result.discounted_percent);
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getDiscount()
}, [])


const handleIncreasePrice = async () => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    increment: increasePrice,
  });

  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  await apiCall({ endpoint: "product/increase-price", method: "PUT", data: { increment: increasePrice } })
    .then((result) => {
      // console.log(result);
      if (result.status === 200) {
        toast.success("Price Incresed Successfully successfully", {
          theme: "light",
          autoClose: "2000",
        });
      }
    })
    .catch((error) => console.log("error", error));
};

const getIncreasedPrice = async () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  await apiCall({ endpoint: "product/get-increment", method: "GET" })
    .then((result) => {
      console.log(result);
      setIncreasePrice(result.increment_percent);
    })
    .catch((error) => console.log("error", error));
};

useEffect(() => {
  getIncreasedPrice()
}, [])


  return (
    <div>
      <div className="w-1/2">
        <label htmlFor="Discount" className="block text-gray-700 font-semibold ">
          Discount
        </label>
        <input
          type="text"
          id="discount"
          name="discount"
          placeholder="Enter discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
        />
      </div>
      <button
        type="submit"
        className="w-1/2 py-1 mt-4 text-white bg-black hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleDiscount}
      >
        Apply Discount
      </button>

      {/* increased price   */}
      <div className="w-1/2 mt-4">
        <label htmlFor="Discount" className="block text-gray-700 font-semibold ">
          Increase Price
        </label>
        <input
          type="text"
          id="increasePrice"
          name="increasePrice"
          placeholder="increase price"
          value={increasePrice}
          onChange={(e) => setIncreasePrice(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
        />
      </div>
      <button
        type="submit"
        className="w-1/2 py-1 mt-4 text-white bg-black hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={handleIncreasePrice}
      >
        Increase Price
      </button>
      <ToastContainer />
    </div>
  );
};

export default ProductDiscount;
