// @mui material components
import Card from "@mui/material/Card";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import NontAuthorized401 from "NontAuthorized401";
import { useEffect, useState } from "react";
import React from "react";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Select, Input, Space } from "antd";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiCall } from "utils/apiClient";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Option } = Select;

function UpdateAdminRegistration() {
  const [searchParam] = useSearchParams();
  let Navigate = useNavigate();
  const [id, setId] = useState(searchParam.get("id"));
  const [slug, setSlug] = useState(searchParam.get("slug"));
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const handleRoleTitleChange = (event) => {
    setSelectedRoleId(event);
  };

  // api to get role titles
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await apiCall({ endpoint: "privileges/get-all-roles", method: "GET" });
        setRoles(result.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  const getAdminData = (result) => {
    let Data = result.data;
    console.log("numaan", result);
    setName(Data.name);
    setEmail(Data.email);
    setMobileNumber(Data.mobile_no);
    setPassword(Data.password);
    setSelectedRoleId(Data.role_id);
  };

  // get by id
  const getDatabyId = async () => {
    try {
      const result = await apiCall({ endpoint: `admin/getAdminByID/${searchParam.get("slug")}`, method: "GET" });
      setId(result.data.id);
      getAdminData(result);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getDatabyId();
  }, []);

  useEffect(() => {
    getDatabyId();
  }, [searchParam.get("slug")]);

  // api to update admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await apiCall({
        endpoint: `admin/updateAdmin/${id}`,
        method: "PUT",
        data: {
          name,
          email,
          mobile_no: mobileNumber,
          password,
          is_logged_in: "1",
          otp: "",
          role_id: selectedRoleId,
          status: "1",
        },
      });
      if (result.status === 200) {
        toast.success("Admin Updated Successfully", { theme: "light", autoClose: 3000 });
        Navigate("/admin-list");
      } else {
        toast.error("Something Went Wrong", { theme: "light", autoClose: 3000 });
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Something Went Wrong", { theme: "light", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />
          <div>
            <div className="grid grid-cols-2">
              {/* name */}
              <div className="w-4/5 py-0.50 my-4">
                <label htmlFor="name" className="block text-gray-700 font-semibold ">
                  Enter name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                />
              </div>
              {/* email */}
              <div className="w-4/5 py-0.5 my-4">
                <label htmlFor="email" className="block text-gray-700 font-semibold ">
                  Enter Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                />
              </div>
              {/* mobile number */}
              <div className="w-4/5 py-0.5 my-4">
                <label htmlFor="number" className="block text-gray-700 font-semibold ">
                  Enter mobile Number
                </label>
                <input
                  type="number"
                  id="mobileNumber"
                  name="number"
                  placeholder="Enter Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-4 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                />
              </div>
              {/* password */}
              <div className="w-4/5 py-0.5 my-4">
                <label htmlFor="password" className="block text-gray-700 font-semibold ">
                  Enter Password
                </label>
                <Space
                  direction="vertical"
                  className="w-full px-0 py-0 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                >
                  <Input.Password
                    placeholder="input password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                  />
                </Space>
              </div>
              {/* role */}
              <div className="w-4/5 py-0.5 my-4">
                <label htmlFor="createRole" className="block text-gray-700 font-semibold ">
                  Assign Role
                </label>
                <Select
                  id="role"
                  value={selectedRoleId}
                  onChange={handleRoleTitleChange}
                  className="w-full"
                >
                  {!selectedRoleId && (
                    <Option value="" disabled>
                      Select Role
                    </Option>
                  )}
                  {roles.map((roles) => (
                    <Option key={roles.id} value={roles.id}>
                      {roles.title}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-0.5 mt-6 text-white bg-black rounded-md hover:bg-gray-900"
              onClick={handleSubmit}
              disabled={loading === true}
            >
              {loading ? <Spin indicator={antIcon} className="text-white" /> : "Submit"}
            </button>
          </div>
          <ToastContainer />
          {/* <Footer /> */}
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default UpdateAdminRegistration;
