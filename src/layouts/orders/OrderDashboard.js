// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import NontAuthorized401 from "NontAuthorized401";
import OrderAccountant from "./components/OrderAccountant";
import { Navigation } from "@mui/icons-material";
import { Tabs } from "antd";
import InvoiceBilling from "./components/InvoiceBilling";
// import Notification from "Notification";

const { TabPane } = Tabs;
const onChange = (key) => {
};

function OrderDashboard() {
  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />
          <div>
            {/* <Notification /> */}
            <Tabs defaultActiveKey="1" onChange={onChange}>
              <TabPane tab="Order Accounting" key="1">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  {/* Table content for Tab 1 */}
                  <OrderAccountant />
                </div>
              </TabPane>
            </Tabs>

            {/* for invoice */}
            <Tabs defaultActiveKey="2" onChange={onChange}>
              <TabPane tab="Invoice Billing" key="2">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  {/* Table content for Tab 1 */}
                  <InvoiceBilling />
                </div>
              </TabPane>
            </Tabs>
          </div>
          {/* <Footer /> */}
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default OrderDashboard;
