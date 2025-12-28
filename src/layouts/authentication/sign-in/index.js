import { useEffect, useRef, useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import curved8 from "assets/images/curved-images/curved15.jpg";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { apiCall } from "utils/apiClient";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function SignIn() {
  let Navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNoError, setmobileNoError] = useState("");
  const [otp, setOtp] = useState("");
  const [OtpError, setOtpError] = useState("");
  const [LoginError, setLoginError] = useState();
  const [showOtpField, setShowOtpField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setOtpError();
  }, []);
  const handleSignIn = async (value) => {
    if (otp === "") {
      setOtpError("please enter otp");
    } else {
      setIsLoading(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Cookie", "ci_session=g3u6o22uru8nefqg2iu50u2tven7mgr9");

      var raw = JSON.stringify({
        mobile_no: mobileNumber,
        otp: value,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      // fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "admin/adminLogin", requestOptions)
      //   .then((response) => response.json())
      //   .then((result) => {
      //     if (result.status === 200) {
      //       localStorage.setItem("Token", result.token);
      //       localStorage.setItem("id", result.admin.id);
      //       Navigate("/dashboard");
      //     } else if (result.status === 401) {
      //       setIsLoading(false);
      //       setOtp("");
      //       toast("Invalid Otp");
      //     } else {
      //       setIsLoading(false);
      //       setOtp("");
      //       toast("Admin Not Found");
      //     }
      //   })
      //   .catch((error) => console.log("error", error));
      const res = await apiCall({
        endpoint: "admin/adminLogin",
        method: "POST",
        data: {
          mobile_no: mobileNumber,
          otp: value,
        },
        headers: {
          "Content-Type": "application/json",
          "Cookie": "ci_session=g3u6o22uru8nefqg2iu50u2tven7mgr9",
        },
      });
      if (res.status === 200) {
        localStorage.setItem("Token", res.token);
        localStorage.setItem("id", res.admin.id);
        Navigate("/dashboard");
      } else if (res.status === 401) {
        setIsLoading(false);
        setOtp("");
        toast("Invalid Otp");
      } else {
        setIsLoading(false);
        setOtp("");
        toast("Admin Not Found");
      }
    }
  };
  const sendOtp = async(e) => {
    e.preventDefault();
    if (mobileNumber === "") {
      setmobileNoError("Please Enter Your Mobile Number");
    } else if (mobileNumber < 10) {
      setmobileNoError("Please Enter Valid Mobile Number");
    } else {
     
      const result = await apiCall({
        endpoint: "admin/adminSendOTP",
        method: "POST", 
        data: {
          mobile_no: mobileNumber,
        },
      });
      if (result.status === 200) {
        toast.success("Otp Send Successfully");
        setShowOtpField(true);
      } else {
        toast.error("User Not Found");    
      }
    }
  };
  const handleMobileNumberChange = () => {
    setShowOtpField(false);
    setOtp("");
  };
  const HandleOtpChange = (e) => {
    const value = e.target.value;
    setOtp(value);
    if (value.length >= 4) {
      handleSignIn(value);
    }
  };

  return (
    <CoverLayout title="Welcome back" image={curved8}>
      <SoftBox>
        {showOtpField ? (
          <form>
            <div className="flex items-center gap-2 hover:underline mb-4">
              <button
                className="font-medium text-sm text-gray-700 hover:text-black"
                onClick={handleMobileNumberChange}
              >
                Change Mobile No:
              </button>
              <p className="font-medium text-sm text-black cursor-pointer">{mobileNumber}</p>
            </div>
            <SoftBox mb={2}>
              <SoftBox mb={1} ml={0.5}>
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  OTP
                </SoftTypography>
              </SoftBox>
              <SoftInput
                className={`${
                  OtpError
                    ? "border border-red-500 placeholder:text-red-500"
                    : "border border-gray-300"
                } appearance-none`}
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => HandleOtpChange(e)}
              />
              {OtpError && <div className="error-message text-xs text-red-500 p-1">{OtpError}</div>}
            </SoftBox>
            {LoginError && (
              <div className="text-xs font-semibold error-message text-red-500">{LoginError}</div>
            )}
            <SoftBox mt={4} mb={1}>
              <button type="submit">
                <SoftButton variant="gradient" color="info" fullWidth>
                  {isLoading ? <Spin indicator={antIcon} className="text-white" /> : "Login"}
                </SoftButton>
              </button>
            </SoftBox>
          </form>
        ) : (
          <form onSubmit={sendOtp}>
            <SoftBox mb={2}>
              <SoftBox mb={1} ml={0.5}>
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Mobile Number
                </SoftTypography>
              </SoftBox>
              <SoftInput
                type="number"
                placeholder="Enter Mobile Number"
                className="nothing appearance-none"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              {mobileNoError && (
                <div className="text-xs text-red-500 my-0.5 error-message">{mobileNoError}</div>
              )}
            </SoftBox>

            <SoftBox mt={4} mb={1}>
              <button type="submit">
                <SoftButton variant="gradient" color="info" fullWidth>
                  Send OTP
                </SoftButton>
              </button>
            </SoftBox>
          </form>
        )}
        {/* {showOtpField && (
         
        )} */}
        <SoftBox mt={3} textAlign="center">
          <SoftTypography variant="button" color="text" fontWeight="regular">
            Don&apos;t have an account?{" "}
            <SoftTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Sign up
            </SoftTypography>
          </SoftTypography>
        </SoftBox>
      </SoftBox>
      <ToastContainer />
    </CoverLayout>
  );
}

export default SignIn;
