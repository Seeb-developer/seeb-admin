import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import VerticalBarChart from "examples/Charts/BarCharts/VerticalBarChart";
import { Toaster } from "react-hot-toast";
import SoftBox from "components/SoftBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftTypography from "components/SoftTypography";

const SeebDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
    totalTeams: 0,
  });

  const [monthlySales, setMonthlySales] = useState({ labels: [], values: [] });
  const [yearlySales, setYearlySales] = useState({ labels: [], values: [] });

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}dashboard/overview`);
      const result = await response.json();
      if (result.status === true) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error("Dashboard data fetch error", error);
    }
  };

  const fetchMonthlySales = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}dashboard/monthly-sales`);
      const result = await response.json();
      if (result.status === true) {
        setMonthlySales({labels: result.labels, values: result.values});
      }
    } catch (error) {
      console.error("Monthly sales fetch error", error);
    }
  }

  const fetchYearlySales = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_HAPS_MAIN_BASE_URL}dashboard/yearly-sales`);
      const result = await response.json();
      if (result.status === true) {
        setYearlySales({labels: result.labels, values: result.values});
      }
    } catch (error) {
      console.error("Yearly sales fetch error", error);
    }
  }

  useEffect(() => {
    fetchDashboardData();
    fetchMonthlySales();
    fetchYearlySales();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Toaster position="top-center" reverseOrder={false} />

      {/* Metrics Cards */}
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <SoftBox p={2}>
                <SoftTypography variant="h6">Total Sales</SoftTypography>
                <SoftTypography variant="h4" color="info">{dashboardData.totalSales}</SoftTypography>
              </SoftBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <SoftBox p={2}>
                <SoftTypography variant="h6">Total Revenue</SoftTypography>
                <SoftTypography variant="h4" color="success">₹{dashboardData.totalRevenue}</SoftTypography>
              </SoftBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <SoftBox p={2}>
                <SoftTypography variant="h6">Total Bookings</SoftTypography>
                <SoftTypography variant="h4" color="success">{dashboardData.totalProjects}</SoftTypography>
              </SoftBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <SoftBox p={2}>
                <SoftTypography variant="h6">Completed Projects</SoftTypography>
                <SoftTypography variant="h4" color="success">{dashboardData.completedProjects}</SoftTypography>
              </SoftBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <SoftBox p={2}>
                <SoftTypography variant="h6">In Progress Projects</SoftTypography>
                <SoftTypography variant="h4" color="warning">{dashboardData.inProgressProjects}</SoftTypography>
              </SoftBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <SoftBox p={2}>
                <SoftTypography variant="h6">Teams</SoftTypography>
                <SoftTypography variant="h4" color="warning">{dashboardData.totalTeams}</SoftTypography>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      {/* Charts Section */}
      <SoftBox px={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <VerticalBarChart
              title="Project Progress"
              description="Completed vs In Progress"
              chart={{
                labels: ["Completed", "In Progress"],
                datasets: [
                  {
                    label: "Projects",
                    color: "info",
                    data: [dashboardData?.completedProjects, dashboardData?.inProgressProjects],
                  },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <VerticalBarChart
              title="Team & Sales"
              description="Sales and Team strength"
              chart={{
                labels: ["Total Sales", "Total Teams"],
                datasets: [
                  {
                    label: "Data",
                    color: "dark",
                    data: [dashboardData.totalSales, dashboardData.totalTeams],
                  },
                ],
              }}
            />
          </Grid>
        </Grid>
      </SoftBox>
      <SoftBox px={3} mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <VerticalBarChart
              title="Monthly Sales"
              description="This Year Sales per Month"
              chart={{
                labels: monthlySales.labels,
                datasets: [
                  {
                    label: "Sales",
                    color: "info",
                    data: monthlySales.values,
                  },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <VerticalBarChart
              title="Yearly Sales"
              description="Last 5 Year Sales Comparison"
              chart={{
                labels: yearlySales.labels,
                datasets: [
                  {
                    label: "Sales",
                    color: "dark",
                    data: yearlySales.values,
                  },
                ],
              }}
            />
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
};

export default SeebDashboard;
