// @mui material components
import Card from "@mui/material/Card";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import UpdatedForm from "./components/UpdatedForm";
import NontAuthorized401 from "NontAuthorized401";

function ProductUpdate() {
  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />
          <UpdatedForm />
          {/* <Footer /> */}
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default ProductUpdate;
