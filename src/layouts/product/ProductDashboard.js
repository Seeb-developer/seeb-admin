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
import DashboardContent from "./components/DashboardContent";



function ProductDashboard() {

  return (
    <>
      {localStorage.getItem("Token") ? (
    <DashboardLayout>
      <DashboardNavbar />
      <DashboardContent />
      {/* <Footer /> */}
    </DashboardLayout>
     ) : (
      <NontAuthorized401 />
    )}
  </>
  );
}

export default ProductDashboard;
