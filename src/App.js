import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import { IconButton } from "@mui/material";
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import CloseRoundedIcon from "@mui/icons-material/CloseRounded"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Arrange Free React components
import SoftBox from "components/SoftBox";

// Arrange Free React examples
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Arrange Free React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Arrange Free React routes
import routes from "routes";

// Arrange Free React contexts
import { useSoftUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brand from "assets/images/faviconlogo2.png";
import ProductUpdate from "layouts/product/ProductUpdate";
import CustomerDetails from "layouts/Customer/CustomerDetails";
import UpdateCoupon from "layouts/coupn/UpdateCoupon";
import UpdateCategory from "layouts/category/UpdateCategory";
import OrderDetails from "layouts/orders/OrderDetails";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import UpdateSubCategory from "layouts/category/UpdateSubCategory";
import Dashboard from "layouts/dashboard";
import UpdateVendors from "layouts/vendors/UpdateVendors";
import VendorDetails from "layouts/vendors/VendorDetails";
import AddCategory from "layouts/category/AddCategory";
import Product from "layouts/product/Product";
import ProductList from "layouts/product/ProductList";
import Discount from "layouts/product/Discount";
import PromoCode from "layouts/coupn/PromoCode";
import CouponList from "layouts/coupn/CouponList";
import ListCategory from "layouts/category/ListCategory";
import SubCategory from "layouts/category/SubCategory";
import ListSubCategory from "layouts/category/ListSubCategory";
import MainBannerImages from "layouts/bannerImages/MainBannerImages";
import CustomerList from "layouts/Customer/CustomerList";
import ReviewList from "layouts/reviews/ReviewList";
import OrderList from "layouts/orders/OrderList";
import AddVendors from "layouts/vendors/AddVendors";
import VendorList from "layouts/vendors/VendorList";
import ContactLeads from "layouts/contact-leds/ContactLeads";
import Offer from "layouts/offer/Offer";
import OfferList from "layouts/offer/OfferList";
import UpdateOffer from "layouts/offer/UpdateOffer";
import CreateRole from "layouts/privilages/CreateRole";
import UpdateRole from "layouts/privilages/UpdateRole";
import Loader from "layouts/loader/Loader";
import Forbidden403 from "Forbidden403";
import NontAuthorized401 from "NontAuthorized401";
import AdminRegistration from "layouts/admin/AdminRegistration";
import UpdateAdminRegistration from "layouts/admin/UpdateAdminRegistration";
import AdminList from "layouts/admin/AdminList";
// import OrderDashboard from "layouts/orders/OrderDashboard";
// firebase
import Notification from "./Notification";
import { onMessageListener } from "./firebaseConfig";
import { Modal } from "antd";
import { Alert, Space } from "antd";
import IndependanceCampaign from "layouts/campaign/IndependanceCampaign";
// import VendorAdd from "layouts/vendors/VendorAdd";
import ProductDashboard from "layouts/product/ProductDashboard";
import CreateNotification from "layouts/notification/CreateNotification";
// import { getToken } from "firebase/messaging";
// complain
import Complain from "layouts/complain/Complain";
import Transactions from "layouts/transactions/Transactions";
import GetNotification from "layouts/notification/GetNotification";
import InteriorLeads from "layouts/interior-leads/InteriorLeads";
import CustomerQuotation from "layouts/quotation/CustomerQuotation";
import ListQuotation from "layouts/quotation/ListQuotation";
import QuotationForm from "layouts/quotation/Quotationform";
import CustomerEditQuotation from "layouts/quotation/CustomerEditQuotation";
import Staff from "layouts/staff/Staff";
import ListStaff from "layouts/staff/Liststaff";
import Blog from "layouts/blog/Blog";
import ListBlog from "layouts/blog/ListBlog";
import AddBlogSection from "layouts/blog/AddBlogSection";
import ListBlogSection from "layouts/blog/ListBlogSection";
import UpdateBlogSection from "layouts/blog/UpdateBlogSection";
import ViewSingleBlog from "layouts/blog/ViewSingleBlog";
import UpdateBlog from "layouts/blog/UpdateBlog";
import ListMasterCategory from "layouts/quotation/ListMasterCategory ";
import ListSubcategories from "layouts/quotation/ListSubcategories";
import ListExpense from "layouts/quotation/ListExpense";
import BalanceSheet from "layouts/quotation/BalanceSheet";
import OfficeExpense from "layouts/quotation/OfficeExpense";
import StaffUpdate from "layouts/staff/StaffUpdate";
import QuotationDetails from "layouts/quotation/QuotationDetails";

import ListApiHistory from "layouts/freepik/ListApiHistory";
import ApiUsageDetails from "layouts/freepik/ApiUsageDetails";
import ListRooms from "layouts/seeb/ListRooms";

import ListServicesType from "layouts/seeb/ListServicesType";
import ListServices from "layouts/seeb/ListServices";
import AddService from "layouts/seeb/AddService";
import ListBookings from "layouts/seeb/booking/ListBookings";
import BookingDetails from "layouts/seeb/booking/BookingDetails";
import CartPage from "layouts/seeb/cart/CartPage";
import UserCartDetails from "layouts/seeb/cart/UserCartDetails";
import AIAPIHistory from "layouts/openAi/AIAPIHistory";
import UserAPIUsageDetails from "layouts/openAi/UserAPIUsageDetails";
import GuideImages from "layouts/seeb/GuideImages";
import GuideVideos from "layouts/seeb/GuideVideos";
import ListTicket from "layouts/seeb/ListTicket";
import TicketDetails from "layouts/seeb/TicketDetails";
import StyleManagement from "layouts/seeb/StyleManagement";
import AddAsset from "layouts/seeb/AddAsset";
import ListAssets from "layouts/seeb/ListAssets";
import RoomElementsManagement from "layouts/seeb/RoomElementsManagement";
import SeebDashboard from "layouts/seeb/SeebDashboard";
import ListPartner from "layouts/team/ListPartner";
import AddPartner from "layouts/team/AddPartner";
import PartnerVerification from "layouts/team/PartnerDetailVerification";
import ListPrompts from "layouts/seeb/Prompt/ListPrompts";
import AddPrompts from "layouts/seeb/Prompt/AddPrompts";
import EditPrompt from "layouts/seeb/Prompt/EditPrompt";
import Styles from "layouts/seeb/Styles";
import FaqsCategory from "layouts/seeb/faq/FaqsCategory";
import Faqs from "layouts/seeb/faq/Faqs";
import AddBlogCTA from "layouts/blog/AddBlogCTA";
import { Update } from "@mui/icons-material";
import UpdateBlogCTA from "layouts/blog/UpdateBlogCTA";
import SavedFloorPlans from "layouts/seeb/savedFloorplans/floorplanList";
import SavedFloorPlansDetails from "layouts/seeb/savedFloorplans/floorplanDetail";
import FloorplanSummary from "layouts/seeb/savedFloorplans/floorplanSummary";
import AssignWorker from "layouts/seeb/booking/AssignWorker";
import WorkerDetail from "layouts/seeb/booking/WorkerDetail";
import { requestForToken } from "./firebaseConfig";
import PartnerTicketList from "layouts/partner/TicketList";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "firebaseConfig"; // Import the auth object from firebaseConfig

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const [newRoutes, setNewRoutes] = useState([]);
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [accessKeys, setAccessKeys] = useState([]);
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [isTokenFound, setTokenFound] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
const user_id = localStorage.getItem("id");


  useEffect(() => {
    requestForToken();
  }, []);

  // useEffect(() => {
  //   onMessageListener()
  //     .then((payload) => {
  //       setNotification({
  //         title: payload.notification.title,
  //         body: payload.notification.body,
  //       });
  //       // setModalVisible(true);
  //       console.log("📩 Notification received:", payload);
  //     })
  //     .catch((err) => console.log("failed: ", err));
  // }, []);

  // Cache for the rtl
  useMemo(() => {
    // console.log(localStorage.getItem('id'));
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  useEffect(() => {
    setLoading(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };


    fetch(
      process.env.REACT_APP_HAPS_MAIN_BASE_URL +
      `privileges/get-admin-privileges?admin_id=${localStorage.getItem("id")}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setAccessKeys(result.data);
        let rou = routes.filter((o1) => result.data.some((o2) => o1.accessKey === o2));        
        setNewRoutes(rou);
        setLoading(false);
      })
      .catch((error) => console.log("error", error));
    setLoading(false);
  }, [pathname]);


  useEffect(() => {
    const email = `admin_${user_id}@seeb.in`;
    const password = "seeb@chat123";

    const authenticate = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("✅ Firebase user registered");
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("✅ Firebase user logged in",);
          } catch (loginErr) {
            console.error("❌ Firebase login failed:", loginErr.code, loginErr.message);
            return;
          }
        } else {
          console.error("❌ Firebase registration failed:", err.code, err.message);
          return;
        }
      }

      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("✅ Firebase UID:", user.uid);
          localStorage.setItem("firebase_uid", user.uid);
          // navigate("/dashboard");
        }
      });
    };

    authenticate();
  }, [user_id]);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        if (route.key === "product-update") {
          return <Route path={route.route} element={route.component} key={route.key} />;
        }
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      if (route.route && route.key !== "customer-details") {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      if (route.route && route.key !== "update-coupon") {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      if (route.route && route.key !== "update-category") {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      if (route.route && route.key !== "order-details") {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      if (route.route && route.key !== "sign-in") {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      if (route.route && route.key !== "sign-up") {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      if (route.route && route.key !== "update-sub-category") {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      if (route.route && route.key !== "update-vendors") {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      if (route.route && route.key !== "vendor-details") {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      if (route.route && route.key !== "update-offer") {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }
      if (route.route && route.key !== "update-admin-registration") {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <SoftBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </SoftBox>
  );

  return direction === "rtl" ? (
    <>
      {loading ? (
        <>
          <div className="relative bg-white h-screen overflow-hidden" />
          {loading && (
            <div className="flex justify-center">
              <div className="absolute top-[30%]">
                <Loader />
              </div>
            </div>
          )}
        </>
      ) : (
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={themeRTL}>
            <CssBaseline />
            {layout === "dashboard" && (
              <>
                <Sidenav
                  color={sidenavColor}
                  brand={brand}
                  brandName="Seeb"
                  routes={newRoutes}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />
                <Configurator />
                {configsButton}
              </>
            )}
            {layout === "vr" && <Configurator />}
            <Routes>
              {getRoutes(newRoutes)}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </ThemeProvider>
        </CacheProvider>
      )}
    </>
  ) : (
    <>
      {loading ? (
        <>
          <div className="relative bg-white h-screen overflow-hidden" />
          {loading && (
            <div className="flex justify-center">
              <div className="absolute top-[30%]">
                <Loader />
              </div>
            </div>
          )}
        </>
      ) : (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={brand}
                brandName="Seeb"
                routes={newRoutes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              {/* <Configurator />
              {configsButton} */}
            </>
          )}
          {layout === "vr" && <Configurator />}
          <Routes>
            {getRoutes(routes)}
            {/* {console.log("asdf", newRoutes)} */}
            <Route path="*" element={<Forbidden403 />} />
            <Route path="/dashboard" element={<Navigate to="/dashboard" />} />
            {/* <Route path={el.route} element={el.component} /> */}
            {/* product routes */}
            {accessKeys &&
              accessKeys.includes(
                "36c596f0cb5516dc4dd83d4656f755b246e5f7ae1a1d758e71d584a216ff7340"
              ) && (
                <>
                  {/* {console.log("No routes found")} */}
                  <Route path="/product-dashboard" element={<ProductDashboard />} />
                  <Route path="/product" element={<Product />} />
                  <Route path="/product-update" element={<ProductUpdate />} />
                  <Route path="/product-list" element={<ProductList />} />
                </>
              )}

            {/* coupon routes */}
            {accessKeys &&
              accessKeys.includes(
                "a01588708acbbb71b230b0cfae9919066d1ff6d9e349b86b74c53e69bb76f45c"
              ) && (
                <>
                  <Route path="/promo-code" element={<PromoCode />} />
                  <Route path="/promo-code" element={<PromoCode />} />
                  <Route path="/update-coupon" element={<UpdateCoupon />} />
                  <Route path="/coupon-list" element={<CouponList />} />
                  <Route path="/discount" element={<Discount />} />
                </>
              )}
            {/* category routes */}
            {accessKeys &&
              accessKeys.includes(
                "5e38265f731baf75d2d8bcb118f79cd324ebb58ddc816afc34d67ee53bad098b"
              ) && (
                <>
                  <Route path="/add-category" element={<AddCategory />} />
                  <Route path="/list-category" element={<ListCategory />} />
                  <Route path="/update-category" element={<UpdateCategory />} />
                  <Route path="/sub-category" element={<SubCategory />} />
                  <Route path="/list-sub-category" element={<ListSubCategory />} />
                </>
              )}
            {/* banner routes */}
            {accessKeys &&
              accessKeys.includes(
                "7fa921d1fddcc31bc4361475e3a89781f22d9f10dc08d609332f87eff985c21b"
              ) && (
                <>
                  <Route path="/banner-image" element={<MainBannerImages />} />
                </>
              )}
            {/* offer routes */}
            {accessKeys &&
              accessKeys.includes(
                "f24bb522dcb5ddcd282e198629367552bcdcbcbddda7352ad5ade667c0980f9b"
              ) && (
                <>
                  <Route path="/offer" element={<Offer />} />
                  <Route path="/list-offer" element={<OfferList />} />
                  <Route path="/update-offer" element={<UpdateOffer />} />
                </>
              )}
            {/* customer routes */}
            {accessKeys &&
              accessKeys.includes(
                "d0145f5223d409e0a8e891fccbe821babc0be79872284f02b8b9597e62d81824"
              ) && (
                <>
                  <Route path="/customer-list" element={<CustomerList />} />
                  <Route path="/review-list" element={<ReviewList />} />
                </>
              )}
            {/* orders routes */}
            {accessKeys &&
              accessKeys.includes(
                "8e213582f50fe730ad9fc6ac69b3e28b71b26f0113ae1c358c3ffc4bb96acca5"
              ) && (
                <>
                  <Route path="/order-list" element={<OrderList />} />
                  <Route path="/customer-details" element={<CustomerDetails />} />
                  {/* <Route path="/order-dashboard" element={<OrderDashboard />} /> */}
                </>
              )}
            {/* vendor routes */}
            {accessKeys &&
              accessKeys.includes(
                "a14bc83bb7c780880386323d892b836df8802ae94f98ec127165e6a5739e3333"
              ) && (
                <>
                  <Route path="/add-vendors" element={<AddVendors />} />
                  <Route path="/list-vendors" element={<VendorList />} />
                  <Route path="/vendor-details" element={<VendorDetails />} />
                  <Route path="/order-details" element={<OrderDetails />} />
                  <Route path="/update-vendors" element={<UpdateVendors />} />
                  {/* <Route path="/vendor-add" element={<VendorAdd />} /> */}
                </>
              )}
            {/* leads route */}
            {accessKeys &&
              accessKeys.includes(
                "6b0c41c07e9953fe59e773eedb07f82e0ead50142403621167af66d33465fe28"
              ) && (
                <>
                  <Route path="/contact-leads" element={<ContactLeads />} />
                  <Route path="/interior-leads" element={<InteriorLeads />} />
                  <Route path="/update-sub-category" element={<UpdateSubCategory />} />
                </>
              )}
            {/* privilages */}
            {accessKeys &&
              accessKeys.includes(
                "85a41e2eb300c96513867d238faabd7f1c438bca9fb7edafc09b7286700da02c"
              ) && (
                <>
                  <Route path="/create-role" element={<CreateRole />} />
                  <Route path="/update-role" element={<UpdateRole />} />
                </>
              )}
            {/* campaign */}
            {accessKeys &&
              accessKeys.includes(
                "9cf96edd33553cfbf06542087140e0430be572b4f2ba418bf8e608749dae58d0"
              ) && (
                <>
                  <Route path="/independance-campaign" element={<IndependanceCampaign />} />
                </>
              )}
            {/* complain */}
            {accessKeys &&
              accessKeys.includes(
                "9cf96edd33553cfbf06542087140e0430be572b4f2ba418bf8e608749dae58d0"
              ) && (
                <>
                  <Route path="/complain" element={<Complain />} />
                </>
              )}

            {/* transactions */}
            {accessKeys &&
              accessKeys.includes(
                "9cf96edd33553cfbf06542087140e0430be572b4f2ba418bf8e608749dae58d0"
              ) && (
                <>
                  <Route path="/transactions" element={<Transactions />} />
                </>
              )}

            {/*Interior Quotation  */}
            {accessKeys &&
              accessKeys.includes(
                "24aca47201d0153b25d26ab322e0579082163a20e60688f03048e441f02e5f46"
              ) && (
                <>
                  <Route path="/customerquotation" element={<CustomerQuotation />} />
                  <Route path="/quotation-details" element={<QuotationDetails />} />
                  <Route path="/listquotation" element={<ListQuotation />} />
                  <Route path="/quotationform/:id" element={<QuotationForm />} />
                  <Route path="/quotationform" element={<QuotationForm />} />
                  {/* <Route path="/salesinvoices" element={<SalesInvoices />} /> */}

                  <Route path="/customereditquotation" element={<CustomerEditQuotation />} />
                  <Route path="/mastercategory" element={<ListMasterCategory />} />
                  <Route path="/subcategories/:categoryId" element={<ListSubcategories />} />
                  <Route path="/expenses" element={<ListExpense />} />
                  <Route path="/balance-sheet" element={<BalanceSheet />} />
                  <Route path="/office-expense" element={<OfficeExpense />} />

                </>
              )}

            {/* Account */}
            {accessKeys &&
              accessKeys.includes(
                "617977b944da12c4428169cf3a16d7b3a6e2a0f2c0c397585e40e6016a401e3a"
              ) && (
                <>
                  <Route path="/office-expense" element={<OfficeExpense />} />
                  <Route path="/addstaff" element={<Staff />} />
                  <Route path="/liststaff" element={<ListStaff />} />
                  <Route path="/update-staff" element={<StaffUpdate />} />
                </>
              )}
            {/* Guide Images and Videos */}
            {accessKeys &&
              accessKeys.includes(
                "24aca47201d0153b25d26ab322e0579082163a20e60688f03048e441f02e5f46"
              ) && (
                <>
                  <Route path="/guide-images" element={<GuideImages />} />
                  <Route path="/guide-videos" element={<GuideVideos />} />
                </>
              )}


            {accessKeys &&
              accessKeys.includes(
                "cbe8ff27e5d5d13fcc3069b741f7f98df1240f35180298326061533791fdf79b"
              ) && (
                <>
                  <Route path="/ticket" element={<ListTicket />} />
                  <Route path="/ticket-details" element={<TicketDetails />} />
                </>
              )}

            {accessKeys &&
              accessKeys.includes(
                "5d1b303766542ff04f8a0768ff96546b1fc65f342fb0a5f7c6145ffe1957deb5"
              ) && (
                <>
                  <Route path="/styles" element={<StyleManagement />} />
                  <Route path="/add-asset" element={<AddAsset />} />
                  <Route path="/list-asset" element={<ListAssets />} />
                  <Route path="/room-elements" element={<RoomElementsManagement />} />
                </>
              )}

            {/* Seeb Dashboard */}

            {accessKeys &&
              accessKeys.includes(
                "36c596f0cb5516dc4dd83d4656f755b246e5f7ae1a1d758e71d584a216ff7340"
              ) && (
                <>
                  <Route path="/seeb-dashboard" element={<SeebDashboard />} />
                  <Route path="/services-type" element={<ListServicesType />} />
                  <Route path="/rooms" element={<ListRooms />} />
                  <Route path="/services" element={<ListServices />} />
                  <Route path="/services/create" element={<AddService />} />
                  <Route path="/bookings" element={<ListBookings />} />
                  <Route path="/booking-details" element={<BookingDetails />} />
                  <Route path="/assign-worker" element={<AssignWorker />} />
                  <Route path="/worker/:id" element={<WorkerDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/cart-details" element={<UserCartDetails />} />
                  <Route path="/saved-floorplans" element={<SavedFloorPlans />} />
                  <Route path="/saved-floorplans-details" element={<SavedFloorPlansDetails />} />
                  <Route path="/saved-floorplans-summary" element={<FloorplanSummary />} />

                  <Route path="/prompts" element={<ListPrompts />} />
                  <Route path="/add-prompt" element={<AddPrompts />} />
                  <Route path="/edit-prompt" element={<EditPrompt />} />

                  <Route path="/styles" element={<Styles />} />
                  <Route path="/faqs-category" element={<FaqsCategory />} />
                  <Route path="/faqs" element={<Faqs />} />

                </>
              )}
            {accessKeys &&
              accessKeys.includes(
                "cbe8ff27e5d5d13fcc3069b741f7f98df1240f35180298326061533791fdf79b"
              ) && (
                <>
                  <Route path="/customerquotation" element={<CustomerQuotation />} />
                  <Route path="/listquotation" element={<ListQuotation />} />
                  <Route path="/quotationform/:id" element={<QuotationForm />} />
                  <Route path="/quotationform" element={<QuotationForm />} />
                  {/* <Route path="/salesinvoices" element={<SalesInvoices />} /> */}

                  <Route path="/customereditquotation" element={<CustomerEditQuotation />} />
                  <Route path="/mastercategory" element={<ListMasterCategory />} />
                  <Route path="/subcategories/:categoryId" element={<ListSubcategories />} />



                </>
              )}
            {/* Product Quotation */}
            {accessKeys &&
              accessKeys.includes(
                "25f9463b7527052259e3d4cfa754d32fadd818c71fc379e2e6efe0bba9295b66"
              ) && (
                <>
                  <Route path="/product-add-quotation" element={<CustomerQuotation />} />
                  <Route path="/product-list-quotation" element={<ListQuotation />} />
                  <Route path="/quotationform/:id" element={<QuotationForm />} />
                  <Route path="/quotationform" element={<QuotationForm />} />
                  <Route path="/quotation-details" element={<QuotationDetails />} />
                  {/* <Route path="/salesinvoices" element={<SalesInvoices />} /> */}

                  <Route path="/product-edit-quotation" element={<CustomerEditQuotation />} />
                  <Route path="/mastercategory/product" element={<ListMasterCategory />} />
                  <Route path="/subcategories/:categoryId" element={<ListSubcategories />} />
                  <Route path="/expenses" element={<ListExpense />} />
                  <Route path="/product-balance-sheet" element={<BalanceSheet />} />
                  <Route path="/product-office-expense" element={<OfficeExpense />} />


                </>
              )}
            {/* Staff  */}
            {accessKeys &&
              accessKeys.includes(
                "617977b944da12c4428169cf3a16d7b3a6e2a0f2c0c397585e40e6016a401e3a"
              ) && (
                <>
                  <Route path="/addstaff" element={<Staff />} />
                  <Route path="/liststaff" element={<ListStaff />} />
                  <Route path="/update-staff" element={<StaffUpdate />} />
                </>
              )}
            {accessKeys &&
              accessKeys.includes(
                "4ca2b25bb41fb4afb8f3b1de2a7f7bdf9902267b08a7342b1729ced7b669d493"
              ) && (
                <>
                  <Route path="/list-partner" element={<ListPartner />} />
                  <Route path="/add-partner" element={<AddPartner />} />
                  <Route path="/partner-details" element={<PartnerVerification />} />
                  <Route path="/partner-ticket-list" element={<PartnerTicketList />} />
                </>
              )}
            {accessKeys &&
              accessKeys.includes(
                "33e26e2aac9ffe7442b91197f2cf4932e95686975370612c1290e3e6e4da02ba"
              ) && (
                <>
                  <Route path="/AddBlog" element={<Blog />} />
                  <Route path="/ListBlog" element={<ListBlog />} />
                  <Route path="/blog-sections/add" element={<AddBlogSection />} />
                  <Route path="/blog-sections" element={<ListBlogSection />} />
                  <Route path="/UpdateBlogSection/:id" element={<UpdateBlogSection />} />
                  <Route path="/viewblog/:id" element={<ViewSingleBlog />} />
                  <Route path="/UpdateBlog/:id" element={<UpdateBlog />} />
                  <Route path="/blog-cta/add" element={<AddBlogCTA />} />
                  <Route path="/update-cta/:id" element={<UpdateBlogCTA />} />
                </>
              )}
            {/* notification */}
            {accessKeys &&
              accessKeys.includes(
                "ba63b41f4bf1ad592249a77dc88da7443ebd69c950cdf2b0c002c5efa85640c1"
              ) && (
                <>
                  <Route path="/create-notification" element={<CreateNotification />} />
                  <Route path="/get-notification" element={<GetNotification />} />

                </>
              )}
            {/* admin */}
            {accessKeys &&
              accessKeys.includes(
                "21c895af98e472d757bdbad206d58ff3f45355c0a83af9e56d160d837e76e839"
              ) && (
                <>
                  <Route path="/admin-registration" element={<AdminRegistration />} />
                  <Route path="/update-admin-registration" element={<UpdateAdminRegistration />} />
                  <Route path="/admin-list" element={<AdminList />} />
                </>
              )}

            {/* Freepik AI Image Generator */}
            {accessKeys &&
              accessKeys.includes(
                "9cf96edd33553cfbf06542087140e0430be572b4f2ba418bf8e608749dae58d0"
              ) && (
                <>
                  <Route path="/open-ai" element={<AIAPIHistory />} />
                  <Route path="/open-ai/by-user" element={<UserAPIUsageDetails />} />
                  <Route path="/list-api-history" element={<ListApiHistory />} />
                  <Route path="/api-uses" element={<ApiUsageDetails />} />
                </>
              )}
            {/* All access */}

            <Route path="/403-non-authorized" element={<NontAuthorized401 />} />
            {localStorage.getItem("Token") ? (
              <Route path="/" element={<Dashboard />} />
            ) : (
              <Route path="/" element={<SignIn />} />
            )}
            <Route path="/authentication/sign-up" element={<SignUp />} />
          </Routes>

          <Notification />

          {/* Push Notification */}
          {/* <Modal
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            closable={false}
            mask={false}
            style={{
              position: "absolute",
              bottom: 0,
              right: 16,
              padding: 0,
              zIndex: 1800,
            }}
          >
            <div className="flex gap-3 items-start">
              <NotificationsNoneRoundedIcon
                className="text-blue-600"
                fontSize="medium"
                style={{ marginTop: 4 }}
              />

              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-800">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600">{notification.body}</p>
              </div>

              <IconButton
                size="small"
                onClick={() => setModalVisible(false)}
                className="mt-1"
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </div>
          </Modal> */}

        </ThemeProvider>
      )}
    </>
  );
}
