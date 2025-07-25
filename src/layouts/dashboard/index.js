// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Arrange Free React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Arrange Free React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import GradientLineChart from "examples/Charts/LineCharts/GradientLineChart";

// Arrange Free React base styles
import typography from "assets/theme/base/typography";

// Dashboard layout components
// import BuildByDevelopers from "layouts/dashboard/components/BuildByDevelopers";
import WorkWithTheRockets from "layouts/dashboard/components/WorkWithTheRockets";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import gradientLineChartData from "layouts/dashboard/data/gradientLineChartData";
import NontAuthorized401 from "NontAuthorized401";

function Dashboard() {
  const { size } = typography;
  const { chart, items } = reportsBarChartData;

  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />
          <SoftBox py={3}>
            <SoftBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "today's Quotation" }}
                    count="$53,000"
                    percentage={{ color: "success", text: "+55%" }}
                    icon={{ color: "info", component: "paid" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "today's Sales Site" }}
                    count="2,300"
                    percentage={{ color: "success", text: "+3%" }}
                    icon={{ color: "info", component: "public" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "Cancelled Quotation" }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "No. Of quotation" }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "No. of Site" }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "No. of Handover Site" }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "No. of Team" }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "No. of Vender" }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "No. of Leads" }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "Total Expenses" }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "Total Profit" }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "Total Revenue" }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "Pending Amount" }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "Pending Sites " }}
                    count="+3,462"
                    percentage={{ color: "error", text: "-2%" }}
                    icon={{ color: "info", component: "emoji_events" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} xl={3}>
                  <MiniStatisticsCard
                    title={{ text: "sales" }}
                    count="$103,430"
                    percentage={{ color: "success", text: "+5%" }}
                    icon={{
                      color: "info",
                      component: "shopping_cart",
                    }}
                  />
                </Grid>
              </Grid>
            </SoftBox>
            {/* <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={7}>
              <BuildByDevelopers />
            </Grid>
            <Grid item xs={12} lg={5}>
              <WorkWithTheRockets />
            </Grid>
          </Grid>
        </SoftBox> */}
            {/* <SoftBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={5}>
                  <ReportsBarChart
                    title="active users"
                    description={
                      <>
                        (<strong>+23%</strong>) than last week
                      </>
                    }
                    chart={chart}
                    items={items}
                  />
                </Grid>
                <Grid item xs={12} lg={7}>
                  <GradientLineChart
                    title="Sales Overview"
                    description={
                      <SoftBox display="flex" alignItems="center">
                        <SoftBox
                          fontSize={size.lg}
                          color="success"
                          mb={0.3}
                          mr={0.5}
                          lineHeight={0}
                        >
                          <Icon className="font-bold">arrow_upward</Icon>
                        </SoftBox>
                        <SoftTypography variant="button" color="text" fontWeight="medium">
                          4% more{" "}
                          <SoftTypography variant="button" color="text" fontWeight="regular">
                            in 2021
                          </SoftTypography>
                        </SoftTypography>
                      </SoftBox>
                    }
                    height="20.25rem"
                    chart={gradientLineChartData}
                  />
                </Grid>
              </Grid>
            </SoftBox> */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={8}>
                <Projects />
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <OrderOverview />
              </Grid>
            </Grid>
          </SoftBox>
          {/* <Footer /> */}
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default Dashboard;
