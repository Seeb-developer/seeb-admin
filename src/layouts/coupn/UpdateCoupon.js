// @mui material components
import Card from "@mui/material/Card";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import ApplyPromoCode from "./components/ApplyPromoCode";
import UpdatePromoCode from "./components/UpdatePromoCode";
import NontAuthorized401 from "NontAuthorized401";
// import Footer from "examples/Footer";

function UpdateCoupon() {
  return (
    <>
    {localStorage.getItem("Token") ? (
    <DashboardLayout>
      <DashboardNavbar />
      <UpdatePromoCode />
      {/* <Footer /> */}
    </DashboardLayout>
    ) : (
      <NontAuthorized401 />
    )}
  </>
  );
}

export default UpdateCoupon;
