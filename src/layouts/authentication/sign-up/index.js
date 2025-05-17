import { useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import Socials from "layouts/authentication/components/Socials";
import Separator from "layouts/authentication/components/Separator";

// Images
import curved6 from "assets/images/curved-images/curved-6.jpg";




function SignUp() {
  let Navigate = useNavigate();

  const [agreement, setAgremment] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");

  // for error
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSetAgremment = () => setAgremment(!agreement);

  // alert for password

  // Register User API
  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setNameError("");
    setEmailError("");
    setMobileNumberError("");
    setPasswordError("");
    if (name === "") {
      setNameError("please enter category name");
    } else if (email === "") {
      setEmailError("please enter email");
    } else if (password === "") {
      setPasswordError("please enter password");
    } else if (mobileNumber === "") {
      setMobileNumberError("please enter mobile number");
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "ci_session=4fo510e337vfs125h3th7q8mm0jtlgas");

    var raw = JSON.stringify({
      role_id: "1",
      name: name,
      email: email,
      mobile_no: mobileNumber,
      password: password,
      is_logged_in: "1",
      otp: "",
      status: "1",
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "admin/register", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.sucess) {
          setName("");
          setEmail("");
          setMobileNumber("");
          setPassword("");
        }
        if (result.status === 200) {
          Navigate("/");
        } else {
          // message.error('Failed to create product');
        }
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <BasicLayout
      // title="Welcome!"
      image={curved6}
    >
      <Card>
        <SoftBox p={3} mb={1} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Register with
          </SoftTypography>
        </SoftBox>
        <SoftBox mb={2}>
          <Socials />
        </SoftBox>
        <Separator />
        <SoftBox pt={2} pb={3} px={3}>
          <SoftBox component="form" role="form">
            <SoftBox mb={2}>
              <SoftInput
                className={`${
                  nameError
                    ? "border border-red-500 placeholder:text-red-500"
                    : "border border-gray-300"
                }`}
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && (
                <div className="error-message text-xs text-red-500 p-1">{nameError}</div>
              )}
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                className={`${
                  emailError
                    ? "border border-red-500 placeholder:text-red-500"
                    : "border border-gray-300"
                }`}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <div className="error-message text-xs text-red-500 p-1">{emailError}</div>
              )}
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                className={`${
                  mobileNumberError
                    ? "border border-red-500 placeholder:text-red-500"
                    : "border border-gray-300"
                }`}
                type="number"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              {mobileNumberError && (
                <div className="error-message text-xs text-red-500 p-1">{mobileNumberError}</div>
              )}
            </SoftBox>
            <SoftBox mb={2}>
              <SoftInput
                className={`${
                  passwordError
                    ? "border border-red-500 placeholder:text-red-500"
                    : "border border-gray-300"
                }`}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <div className="error-message text-xs text-red-500 p-1">{passwordError}</div>
              )}
            </SoftBox>
            <SoftBox display="flex" alignItems="center">
              <Checkbox checked={agreement} onChange={handleSetAgremment} />
              <SoftTypography
                variant="button"
                fontWeight="regular"
                onClick={handleSetAgremment}
                sx={{ cursor: "poiner", userSelect: "none" }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </SoftTypography>
              <SoftTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                textGradient
              >
                Terms and Conditions
              </SoftTypography>
            </SoftBox>
            <SoftBox mt={4} mb={1}>
              <SoftButton variant="gradient" color="dark" fullWidth onClick={handleRegisterUser}>
                sign up
              </SoftButton>
            </SoftBox>
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Already have an account?&nbsp;
                <SoftTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  Sign in
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
    </BasicLayout>
  );
}

export default SignUp;
