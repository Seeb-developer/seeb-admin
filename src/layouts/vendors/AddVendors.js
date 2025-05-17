import React from "react";

// @mui material components
import Card from "@mui/material/Card";
import { Spin } from "antd";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import NontAuthorized401 from "NontAuthorized401";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// import Footer from "examples/Footer";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function AddVendors() {
  let Navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState("");

  //   add vendor api
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "ci_session=9d1aaubqaqsgicacrka5l9o95oodfqn1");

    var raw = JSON.stringify({
      name: name,
      description: description,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "brand/createBrand", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === 200) {
          setLoading(false);
          toast.success("Vendor Added Successfully", {
            theme: "light",
            autoClose: "2000",
          });
          navigate('/list-vendors');
        }
      })
      .catch((error) => console.log("error", error))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />
          <div className="bg-white rounded-lg">
            <form className="p-4 md:p-5 lg:p-5 xl:p-5">
              <div className="">
                <label htmlFor="brandName" className="block text-gray-700 font-semibold ">
                  Brand Name
                </label>
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                />
              </div>

              {/* for description */}
              <div className="mt-4">
                <label htmlFor="brandName" className="block text-gray-700 font-semibold ">
                  Brand Description
                </label>
                <input
                  type="text"
                  id="brandDescription"
                  name="brandDescription"
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                />
              </div>

              {/* submit button */}
              <button
                type="submit"
                className="w-full py-1 mt-6 text-white bg-black hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleSubmit}
                disabled={loading === true}
              >
                {loading ? <Spin indicator={antIcon} className="text-white" /> : "Submit"}
              </button>
            </form>
            <ToastContainer />
          </div>
          {/* <Footer /> */}
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default AddVendors;
