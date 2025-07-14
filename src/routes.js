// Arrange Free React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// Arrange Free React icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Cube from "examples/Icons/Cube";
import Product from "layouts/product/Product";
import ProductList from "layouts/product/ProductList";
import ProductUpdate from "layouts/product/ProductUpdate";
import CustomerList from "layouts/Customer/CustomerList";
import Discount from "layouts/product/Discount";
import CustomerDetails from "layouts/Customer/CustomerDetails";
import AddCategory from "layouts/category/AddCategory";
import ListCategory from "layouts/category/ListCategory";
import PromoCode from "layouts/coupn/PromoCode";
import CouponList from "layouts/coupn/CouponList";
import OrderList from "layouts/orders/OrderList";
import ContactLeads from "layouts/contact-leds/ContactLeads";
import SubCategory from "layouts/category/SubCategory";
import ListSubCategory from "layouts/category/ListSubCategory";
import MainBannerImages from "layouts/bannerImages/MainBannerImages";
import AddVendors from "layouts/vendors/AddVendors";
import VendorList from "layouts/vendors/VendorList";
import ReviewList from "layouts/reviews/ReviewList";
import Offer from "layouts/offer/Offer";
import OfferList from "layouts/offer/OfferList";
import CreateRole from "layouts/privilages/CreateRole";
import UpdateRole from "layouts/privilages/UpdateRole";
import AdminRegistration from "layouts/admin/AdminRegistration";
import UpdateAdminRegistration from "layouts/admin/UpdateAdminRegistration";
import AdminList from "layouts/admin/AdminList";
import IndependanceCampaign from "layouts/campaign/IndependanceCampaign";
// import OrderDashboard from "layouts/orders/OrderDashboard";
// import VendorAdd from "layouts/vendors/VendorAdd";
import ProductDashboard from "layouts/product/ProductDashboard";
import Complain from "layouts/complain/Complain";
import Transactions from "layouts/transactions/Transactions";
import CreateNotification from "layouts/notification/CreateNotification";
import {
  FaBalanceScale,
  FaBell,
  FaBlog,
  FaCircleNotch,
  FaFileInvoice,
  FaKey,
  FaList,
  FaListAlt,
  FaMapMarkerAlt,
  FaMoneyBill,
  FaMoneyBillAlt,
  FaPhone,
  FaPhoneAlt,
  FaPlusSquare,
  FaRegImages,
  FaTachometerAlt,
  FaThLarge,
  FaTicketAlt,
  FaTv,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { AiFillShop, AiOutlineExclamation, AiTwotoneShop } from "react-icons/ai";
import { BiCategoryAlt, BiSolidOffer } from "react-icons/bi";
import GetNotification from "layouts/notification/GetNotification";
import InteriorLeads from "layouts/interior-leads/InteriorLeads";
import { BsFillCalendarEventFill } from "react-icons/bs";
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
import ListMasterCategory from "layouts/quotation/ListMasterCategory ";

import BalanceSheet from "layouts/quotation/BalanceSheet";
import OfficeExpense from "layouts/quotation/OfficeExpense";
import ListApiHistory from "layouts/freepik/ListApiHistory";
import ListRooms from "layouts/seeb/ListRooms";

import ListServicesType from "layouts/seeb/ListServicesType";
import ListServices from "layouts/seeb/ListServices";
import ListBookings from "layouts/seeb/booking/ListBookings";
import CartPage from "layouts/seeb/cart/CartPage";
import AIAPIHistory from "layouts/openAi/AIAPIHistory";
import GuideImages from "layouts/seeb/GuideImages";
import GuideVideos from "layouts/seeb/GuideVideos";
import ListTicket from "layouts/seeb/ListTicket";
import AddAsset from "layouts/seeb/AddAsset";
import StyleManagement from "layouts/seeb/StyleManagement";
import ListAssets from "layouts/seeb/ListAssets";
import RoomElementsManagement from "layouts/seeb/RoomElementsManagement";
import SeebDashboard from "layouts/seeb/SeebDashboard";
import ListPartner from "layouts/team/ListPartner";
import ListPrompts from "layouts/seeb/Prompt/ListPrompts";
import Styles from "layouts/seeb/Styles";
import FaqsCategory from "layouts/seeb/faq/FaqsCategory";
import Faqs from "layouts/seeb/faq/Faqs";
import SavedFloorPlans from "layouts/seeb/savedFloorplans/floorplanList";
import PartnerTicketList from "layouts/partner/TicketList";


const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    accessKey: "36c596f0cb5516dc4dd83d4656f755b246e5f7ae1a1d758e71d584a216ff7340",
    route: "/dashboard",
    icon: <FaTv size="17px" />,
    component_name: "Dashboard",
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    route: "/billing",
    icon: <FaMoneyBill size="17px" />,
    component_name: "Billing",
    component: <Billing />,
    noCollapse: true,
  },

  {
    type: "title",
    title: "Seeb Dashboard",
    key: "seeb-dashboard",
    accessKey: "36c596f0cb5516dc4dd83d4656f755b246e5f7ae1a1d758e71d584a216ff7340",
    icon: <FaTachometerAlt size="12px" />, // Dashboard icon
    children: [
      {
        type: "collapse",
        name: "Dashboard",
        key: "seeb-dashboard",
        route: "/seeb-dashboard",
        icon: <FaPlusSquare size="12px" />, // Add Box icon
        component_name: "Seeb Dashboard",

        component: <SeebDashboard />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      {
        type: "collapse",
        name: "Bookings",
        key: "bookings",
        route: "/bookings",
        icon: <FaPlusSquare size="12px" />, // Add Box icon
        component_name: "bookings",
        component: <ListBookings />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      {
        type: "collapse",
        name: "Cart",
        key: "cart",
        route: "/cart",
        icon: <FaPlusSquare size="12px" />, // Add Box icon
        component_name: "cart",
        component: <CartPage />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      {
        type: "collapse",
        name: "Saved Floorplans",
        key: "saved-floorplans",
        route: "/saved-floorplans",
        icon: <FaPlusSquare size="12px" />, // Add Box icon
        component_name: "saved-floorplans",
        component: <SavedFloorPlans />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      {
        type: "collapse",
        name: "Services",
        key: "services",
        route: "/services",
        icon: <FaPlusSquare size="12px" />, // Add Box icon
        component_name: "services",
        component: <ListServices />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      {
        type: "collapse",
        name: "Rooms",
        key: "rooms",
        route: "/rooms",
        icon: <FaPlusSquare size="12px" />, // Add Box icon
        component_name: "rooms",
        component: <ListRooms />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      {
        type: "collapse",
        name: "Services Type",
        key: "services-type",
        route: "/services-type",
        icon: <FaFileInvoice size="12px" />, // Receipt icon
        component_name: "Services Type",
        component: <ListServicesType />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      {
        type: "collapse",
        name: "Styles",
        key: "styles",
        route: "/styles",
        icon: <FaFileInvoice size="12px" />, // Receipt icon
        component_name: "Styles",
        component: <Styles />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      {
        type: "collapse",
        name: "Prompts",
        key: "prompts",
        route: "/prompts",
        icon: <FaFileInvoice size="12px" />, // Receipt icon
        component_name: "Prompts",
        component: <ListPrompts />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      {
        type: "collapse",
        name: "FAQs Category",
        key: "faqs-category",
        route: "/faqs-category",
        icon: <FaFileInvoice size="12px" />, // Receipt icon
        component_name: "FAQs Category",
        component: <FaqsCategory />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      {
        type: "collapse",
        name: "FAQs",
        key: "faqs",
        route: "/faqs",
        icon: <FaFileInvoice size="12px" />, // Receipt icon
        component_name: "FAQs",
        component: <Faqs />,
        noCollapse: true,
        state: { type: "Interior" }
      },

    ],
  },

  // {
  //   type: "title",
  //   title: "Product Pages",
  //   key: "product-pages",
  //   accessKey: "36c596f0cb5516dc4dd83d4656f755b246e5f7ae1a1d758e71d584a216ff7340",
  //   icon: <AiTwotoneShop size="17px" />,
  //   children: [
  //     {
  //       type: "collapse",
  //       name: "Product Dashboard",
  //       key: "product-dashboard",
  //       route: "/product-dashboard",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "ProductDashboard",
  //       component: <ProductDashboard />,
  //       noCollapse: true,
  //     },
  //     {
  //       type: "collapse",
  //       name: "Add Product",
  //       key: "product",
  //       route: "/product",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "Product",
  //       component: <Product />,
  //       noCollapse: true,
  //     },
  //     {
  //       type: "collapse",
  //       name: "Product List",
  //       key: "product-list",
  //       route: "/product-list",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "ProductList",
  //       component: <ProductList />,
  //       noCollapse: true,
  //     },
  //   ],
  // },

  {
    type: "title",
    title: "Coupons And Offers",
    key: "coupon-pages",
    accessKey: "a01588708acbbb71b230b0cfae9919066d1ff6d9e349b86b74c53e69bb76f45c",
    icon: <FaTicketAlt size="17px" />,
    children: [
      {
        type: "collapse",
        name: "Create Coupon",
        key: "promo-code",
        route: "/promo-code",
        icon: <FaCircleNotch size="12px" />,
        component_name: "PromoCode",
        component: <PromoCode />,
        noCollapse: true,
      },
      {
        type: "collapse",
        name: "Coupon List",
        key: "coupon-list",
        route: "/coupon-list",
        icon: <FaCircleNotch size="12px" />,
        component_name: "CouponList",
        component: <CouponList />,
        noCollapse: true,
      },
      // {
      //   type: "collapse",
      //   name: "Discount",
      //   key: "discount",
      //   route: "/discount",
      //   icon: <FaCircleNotch size="12px" />,
      //   component_name: "Discount",
      //   component: <Discount />,
      //   noCollapse: true,
      // },
      {
        type: "collapse",
        name: "Offers",
        key: "offer",
        route: "/offer",
        icon: <FaCircleNotch size="12px" />,
        component_name: "Offer",
        component: <Offer />,
        noCollapse: true,
      },
      {
        type: "collapse",
        name: "Offers List",
        key: "offer-list",
        route: "/list-offer",
        icon: <FaCircleNotch size="12px" />,
        component_name: "OfferList",
        component: <OfferList />,
        noCollapse: true,
      },
    ],
  },

  // {
  //   type: "title",
  //   title: "Category",
  //   key: "category-pages",
  //   accessKey: "5e38265f731baf75d2d8bcb118f79cd324ebb58ddc816afc34d67ee53bad098b",
  //   icon: <BiCategoryAlt size="17px" />,
  //   children: [
  //     {
  //       type: "collapse",
  //       name: "Add Category",
  //       key: "add-category",
  //       route: "/add-category",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "AddCategory",
  //       component: <AddCategory />,
  //       noCollapse: true,
  //     },
  //     {
  //       type: "collapse",
  //       name: "List Category",
  //       key: "list-category",
  //       route: "/list-category",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "ListCategory",
  //       component: <ListCategory />,
  //       noCollapse: true,
  //     },
  //     {
  //       type: "collapse",
  //       name: "Sub Category",
  //       key: "sub-category",
  //       route: "/sub-category",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "SubCategory",
  //       component: <SubCategory />,
  //       noCollapse: true,
  //     },
  //     {
  //       type: "collapse",
  //       name: "List Sub Category",
  //       key: "lis-sub-category",
  //       route: "/list-sub-category",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "ListSubCategory",
  //       component: <ListSubCategory />,
  //       noCollapse: true,
  //     },
  //   ],
  // },

  {
    type: "title",
    title: "Banner Image",
    key: "banner-image",
    accessKey: "7fa921d1fddcc31bc4361475e3a89781f22d9f10dc08d609332f87eff985c21b",
    icon: <FaRegImages size="17px" />,
    children: [
      {
        type: "collapse",
        name: "Banner Image",
        key: "main-banner-image",
        route: "/banner-image",
        icon: <FaCircleNotch size="12px" />,
        component_name: "MainBannerImages",
        component: <MainBannerImages />,
        noCollapse: true,
      },
    ],
  },

  // {
  //   type: "title",
  //   title: "Offres",
  //   key: "offer-page",
  //   accessKey: "f24bb522dcb5ddcd282e198629367552bcdcbcbddda7352ad5ade667c0980f9b",
  //   icon: <BiSolidOffer size="17px" />,
  //   children: [
  //     {
  //       type: "collapse",
  //       name: "Offers",
  //       key: "offer",
  //       route: "/offer",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "Offer",
  //       component: <Offer />,
  //       noCollapse: true,
  //     },
  //     {
  //       type: "collapse",
  //       name: "Offers List",
  //       key: "offer-list",
  //       route: "/list-offer",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "OfferList",
  //       component: <OfferList />,
  //       noCollapse: true,
  //     },
  //   ],
  // },

  {
    type: "title",
    title: "Customer",
    key: "customer-pages",
    accessKey: "d0145f5223d409e0a8e891fccbe821babc0be79872284f02b8b9597e62d81824",
    icon: <FaUsers size="12px" />,
    children: [
      {
        type: "collapse",
        name: "Customer List",
        key: "customer-list",
        route: "/customer-list",
        icon: <FaCircleNotch size="12px" />,
        component_name: "CustomerList",
        component: <CustomerList />,
        noCollapse: true,
      },
      {
        type: "collapse",
        name: "Review List",
        key: "review-list",
        route: "/review-list",
        icon: <FaCircleNotch size="12px" />,
        component_name: "ReviewList",
        component: <ReviewList />,
        noCollapse: true,
      },
    ],
  },

  // {
  //   type: "title",
  //   title: "Orders",
  //   key: "order-pages",
  //   accessKey: "8e213582f50fe730ad9fc6ac69b3e28b71b26f0113ae1c358c3ffc4bb96acca5",
  //   icon: <FaList size="12px" />,
  //   children: [
  //     {
  //       type: "collapse",
  //       name: "Order List",
  //       key: "order-list",
  //       route: "/order-list",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "OrderList",
  //       component: <OrderList />,
  //       noCollapse: true,
  //     },
  //     // {
  //     //   type: "collapse",
  //     //   name: "Dashboard",
  //     //   key: "order-dashboard",
  //     //   route: "/order-dashboard",
  //     //   icon: <CreditCard size="12px" />,
  //     //   component_name: "OrderDashboard",
  //     //   component: <OrderDashboard />,
  //     //   noCollapse: true,
  //     // },
  //   ],
  // },

  // {
  //   type: "title",
  //   title: "Vendors",
  //   key: "vendors-pages",
  //   accessKey: "a14bc83bb7c780880386323d892b836df8802ae94f98ec127165e6a5739e3333",
  //   icon: <AiFillShop size="12px" />,
  //   children: [
  //     {
  //       type: "collapse",
  //       name: "Add Vendors",
  //       key: "add-vendors",
  //       route: "/add-vendors",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "AddVendors",
  //       component: <AddVendors />,
  //       noCollapse: true,
  //     },
  //     {
  //       type: "collapse",
  //       name: "List Vendors",
  //       key: "list-vendors",
  //       route: "/list-vendors",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "VendorList",
  //       component: <VendorList />,
  //       noCollapse: true,
  //     },
  //     // {
  //     //   type: "collapse",
  //     //   name: "Vendors",
  //     //   key: "vendor-add",
  //     //   route: "/vendor-add",
  //     //   icon: <CreditCard size="12px" />,
  //     //   component_name: "VendorAdd",
  //     //   component: <VendorAdd />,
  //     //   noCollapse: true,
  //     // },
  //   ],
  // },

  {
    type: "title",
    title: "Leads",
    key: "leads-page",
    accessKey: "6b0c41c07e9953fe59e773eedb07f82e0ead50142403621167af66d33465fe28",
    icon: <FaPhoneAlt size="12px" />,
    children: [
      {
        type: "collapse",
        name: "Contact Leads",
        key: "contact-leads",
        route: "/contact-leads",
        icon: <FaCircleNotch size="12px" />,
        component_name: "ContactLeads",
        component: <ContactLeads />,
        noCollapse: true,
      },
      // {
      //   type: "collapse",
      //   name: "Interior Leads",
      //   key: "interior-leads",
      //   route: "/interior-leads",
      //   icon: <FaCircleNotch size="12px" />,
      //   component_name: "InteriorLeads",
      //   component: <InteriorLeads />,
      //   noCollapse: true,
      // },
    ],
  },

  // {
  //   type: "title",
  //   title: "Privilages",
  //   key: "Privilage-page",
  //   accessKey: "85a41e2eb300c96513867d238faabd7f1c438bca9fb7edafc09b7286700da02c",
  //   icon: <FaUser size="12px" />,
  //   children: [
  //     {
  //       type: "collapse",
  //       name: "Create Role",
  //       key: "create-role",
  //       route: "/create-role",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "CreateRole",
  //       component: <CreateRole />,
  //       noCollapse: true,
  //     },
  //     {
  //       type: "collapse",
  //       name: "Update Role",
  //       key: "update-role",
  //       route: "/update-role",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "UpdateRole",
  //       component: <UpdateRole />,
  //       noCollapse: true,
  //     },
  //   ],
  // },

  {
    type: "title",
    title: "Admin",
    key: "admin-page",
    accessKey: "21c895af98e472d757bdbad206d58ff3f45355c0a83af9e56d160d837e76e839",
    icon: <FaKey size="12px" />,
    children: [
      {
        type: "collapse",
        name: "Admin Registration",
        key: "admin-registration",
        route: "/admin-registration",
        icon: <FaCircleNotch size="12px" />,
        component_name: "AdminRegistration",
        component: <AdminRegistration />,
        noCollapse: true,
      },
      {
        type: "collapse",
        name: "Admin List",
        key: "admin-list",
        route: "/admin-list",
        icon: <FaCircleNotch size="12px" />,
        component_name: "AdminList",
        component: <AdminList />,
        noCollapse: true,
      },
      {
        type: "collapse",
        name: "Create Role",
        key: "create-role",
        route: "/create-role",
        icon: <FaCircleNotch size="12px" />,
        component_name: "CreateRole",
        component: <CreateRole />,
        noCollapse: true,
      },
      {
        type: "collapse",
        name: "Update Role",
        key: "update-role",
        route: "/update-role",
        icon: <FaCircleNotch size="12px" />,
        component_name: "UpdateRole",
        component: <UpdateRole />,
        noCollapse: true,
      },
    ],
  },

  // {
  //   type: "title",
  //   title: "Campaign",
  //   key: "campaign",
  //   accessKey: "9cf96edd33553cfbf06542087140e0430be572b4f2ba418bf8e608749dae58d0",
  //   icon: <BsFillCalendarEventFill size="12px" />,
  //   children: [
  //     {
  //       type: "collapse",
  //       name: "Independance Campaign",
  //       key: "independance-campaign",
  //       route: "/independance-campaign",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "IndependanceCampaign",
  //       component: <IndependanceCampaign />,
  //       noCollapse: true,
  //     },
  //   ],
  // },

  {
    type: "title",
    title: "Notifications",
    key: "notifications",
    accessKey: "ba63b41f4bf1ad592249a77dc88da7443ebd69c950cdf2b0c002c5efa85640c1",
    icon: <FaBell size="12px" />,
    children: [
      {
        type: "collapse",
        name: "Create Notification",
        key: "create-notification",
        route: "/create-notification",
        icon: <FaCircleNotch size="12px" />,
        component_name: "CreateNotification",
        component: <CreateNotification />,
        noCollapse: true,
      },
      {
        type: "collapse",
        name: "Get Notification",
        key: "get notification",
        route: "/get-notification",
        icon: <FaCircleNotch size="12px" />,
        component_name: "GetNotification",
        component: <GetNotification />,
        noCollapse: true,
      },
    ],
  },
  // {
  //   type: "title",
  //   title: "complain",
  //   key: "complain",
  //   accessKey: "7fa921d1fddcc31bc4361475e3a89781f22d9f10dc08d609332f87eff985c21b",
  //   icon: <AiOutlineExclamation size="12px" />,
  //   children: [
  //     {
  //       type: "collapse",
  //       name: "complains",
  //       key: "main-complain-image",
  //       route: "/complain",
  //       icon: <FaCircleNotch size="12px" />,
  //       component_name: "complain",
  //       component: <Complain />,
  //       noCollapse: true,
  //     },
  //   ],
  // },
  // {
  //   type: "title",
  //   title: "Transactions",
  //   key: "Transactions",
  //   accessKey: "7fa921d1fddcc31bc4361475e3a89781f22d9f10dc08d609332f87eff985c21b",
  //   icon: <CreditCard size="12px" />,
  //   children: [
  //     {
  //       type: "collapse",
  //       name: "transactions",
  //       key: "main-transactions",
  //       route: "/transactions",
  //       icon: <CreditCard size="12px" />,
  //       component_name: "transactions",
  //       component: <Transactions />,
  //       noCollapse: true,
  //     },

  //   ],
  // },
  {
    type: "title",
    title: "Office Account",
    key: "Quotation",
    accessKey: "733a3225a334aa67d15a5a8efc9238a46d93805b1a9b14c1236214d7ad2e3220",
    icon: <FaTachometerAlt size="12px" />, // Dashboard icon
    children: [
      // {
      //   type: "collapse",
      //   name: "Quotations",
      //   key: "listquotation",
      //   route: "/listquotation",
      //   icon: <FaFileInvoice size="12px" />, // Receipt icon
      //   component_name: "Listquotation",
      //   component: <ListQuotation />,
      //   noCollapse: true,
      //   state: { type: "Interior" }
      // },
      // {
      //   type: "collapse",
      //   name: "Add New Quotation",
      //   key: "customerquotation",
      //   route: "/customerquotation",
      //   icon: <FaPlusSquare size="12px" />, // Add Box icon
      //   component_name: "quotation",
      //   component: <CustomerQuotation />,
      //   noCollapse: true,
      //   state: { type: "Interior" }
      // },
      // {
      //   type: "collapse",
      //   name: "Balance Sheet",
      //   key: "balance-sheet",
      //   route: "/balance-sheet",
      //   icon: <FaBalanceScale size="12px" />, // Assessment icon
      //   component_name: "balance-sheet",
      //   component: <BalanceSheet />,
      //   noCollapse: true,
      //   state: { type: "Interior" }
      // },
      {
        type: "collapse",
        name: "Office Expense",
        key: "office-expense",
        route: "/office-expense",
        icon: <FaMoneyBillAlt size="12px" />, // Attach Money icon
        component_name: "office-expense",
        component: <OfficeExpense />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      // {
      //   type: "collapse",
      //   name: "Master Category",
      //   key: "mastercategory",
      //   route: "/mastercategory",
      //   icon: <FaThLarge size="12px" />, // Category icon
      //   component_name: "mastercategory",
      //   component: <ListMasterCategory />,
      //   noCollapse: true,
      //   state: { type: "Interior" }
      // },
    ],
  },
  {
    type: "title",
    title: "Account",
    key: "Account",
    accessKey: "617977b944da12c4428169cf3a16d7b3a6e2a0f2c0c397585e40e6016a401e3a",
    icon: <FaTachometerAlt size="12px" />, // Dashboard icon
    children: [
      {
        type: "collapse",
        name: "Office Expense",
        key: "office-expense",
        route: "/office-expense",
        icon: <FaMoneyBillAlt size="12px" />, // Attach Money icon
        component_name: "office-expense",
        component: <OfficeExpense />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      {
        type: "collapse",
        name: "Employee",
        key: "listStaff",
        accessKey: "617977b944da12c4428169cf3a16d7b3a6e2a0f2c0c397585e40e6016a401e3a",
        icon: <FaUsers size="12px" />,  // Team Icon
        route: "/listStaff",
        component_name: "listStaff",
        noCollapse: true,
        component: <ListStaff />,
      },
    ],
  },
  // {
  //   type: "title",
  //   title: "Interior Dashboard",
  //   key: "Quotation",
  //   accessKey: "cbe8ff27e5d5d13fcc3069b741f7f98df1240f35180298326061533791fdf79b",
  //   icon: <FaTachometerAlt size="12px" />, // Dashboard icon
  //   children: [
  //     {
  //       type: "collapse",
  //       name: "Quotations",
  //       key: "listquotation",
  //       route: "/listquotation",
  //       icon: <FaFileInvoice size="12px" />, // Receipt icon
  //       component_name: "Listquotation",
  //       component: <ListQuotation />,
  //       noCollapse: true,
  //       state: { type: "Interior" }
  //     },
  //     {
  //       type: "collapse",
  //       name: "Add New Quotation",
  //       key: "customerquotation",
  //       route: "/customerquotation",
  //       icon: <FaPlusSquare size="12px" />, // Add Box icon
  //       component_name: "quotation",
  //       component: <CustomerQuotation />,
  //       noCollapse: true,
  //       state: { type: "Interior" }
  //     },
  //     {
  //       type: "collapse",
  //       name: "Master Category",
  //       key: "mastercategory",
  //       route: "/mastercategory",
  //       icon: <FaThLarge size="12px" />, // Category icon
  //       component_name: "mastercategory",
  //       component: <ListMasterCategory />,
  //       noCollapse: true,
  //       state: { type: "Interior" }
  //     }
  //   ],
  // },
  // {
  //   type: "title",
  //   title: "Product Dashboard",
  //   key: "Quotation",
  //   accessKey: "25f9463b7527052259e3d4cfa754d32fadd818c71fc379e2e6efe0bba9295b66",
  //   icon: <FaTachometerAlt size="12px" />,  // Dashboard Icon
  //   children: [
  //     {
  //       type: "collapse",
  //       name: "Quotations",
  //       key: "product-list-quotation",
  //       route: "/product-list-quotation",
  //       icon: <FaFileInvoice size="12px" />,  // Receipt Icon for Quotations
  //       component_name: "Listquotation",
  //       component: <ListQuotation />,
  //       noCollapse: true,
  //       state: { type: "Product" }
  //     },
  //     {
  //       type: "collapse",
  //       name: "Add New Quotation",
  //       key: "product-add-quotation",
  //       route: "/product-add-quotation",
  //       icon: <FaPlusSquare size="12px" />,  // Add Box Icon for adding a new quotation
  //       component_name: "quotation",
  //       component: <CustomerQuotation />,
  //       noCollapse: true,
  //       state: { type: "Product" }
  //     },
  //     {
  //       type: "collapse",
  //       name: "Balance Sheet",
  //       key: "product-balance-sheet",
  //       route: "/product-balance-sheet",
  //       icon: <FaBalanceScale size="12px" />,  // Assessment Icon for Balance Sheet
  //       component_name: "balance-sheet",
  //       component: <BalanceSheet />,
  //       noCollapse: true,
  //       state: { type: "Product" }
  //     },
  //     {
  //       type: "collapse",
  //       name: "Office Expense",
  //       key: "product-office-expense",
  //       route: "/product-office-expense",
  //       icon: <FaMoneyBillAlt size="12px" />,  // Attach Money Icon for Office Expense
  //       component_name: "office-expense",
  //       component: <OfficeExpense />,
  //       noCollapse: true,
  //       state: { type: "Product" }
  //     },
  //     {
  //       type: "collapse",
  //       name: "Master Category",
  //       key: "mastercategory",
  //       route: "/mastercategory",
  //       icon: <FaThLarge size="12px" />,  // Category Icon for Master Category
  //       component_name: "mastercategory",
  //       component: <ListMasterCategory />,
  //       noCollapse: true,
  //       state: { type: "Product" }
  //     },
  //   ],
  // },

  {
    type: "title",
    title: "Blog",
    key: "Blog",
    accessKey: "33e26e2aac9ffe7442b91197f2cf4932e95686975370612c1290e3e6e4da02ba",
    icon: <FaTachometerAlt size="12px" />, // Dashboard icon
    children: [
      {
        type: "collapse",
        name: "Blog",
        key: "ListBlog",
        accessKey: "33e26e2aac9ffe7442b91197f2cf4932e95686975370612c1290e3e6e4da02ba",
        icon: <FaBlog size="12px" />,  // Blog Icon
        route: "/ListBlog",
        component: <ListBlog />,
        component_name: "ListBlog",
        noCollapse: true,
      },
    ]
  },
  {
    type: "title",
    title: "APi History",
    key: "ApiHistory",
    accessKey: "9cf96edd33553cfbf06542087140e0430be572b4f2ba418bf8e608749dae58d0",
    icon: <FaTachometerAlt size="12px" />, // Dashboard icon
    children: [
      {
        type: "collapse",
        name: "Free Api History",
        key: "list-api-history",
        accessKey: "9cf96edd33553cfbf06542087140e0430be572b4f2ba418bf8e608749dae58d0",
        icon: <FaBlog size="12px" />,  // Blog Icon
        route: "/list-api-history",
        component: <ListApiHistory />,
        component_name: "ListBlog",
        noCollapse: true,
      },
      {
        type: "collapse",
        name: "Open AI History",
        key: "open-ai",
        accessKey: "9cf96edd33553cfbf06542087140e0430be572b4f2ba418bf8e608749dae58d0",
        icon: <FaBlog size="12px" />,  // Blog Icon
        route: "/open-ai",
        component: <AIAPIHistory />,
        component_name: "ListBlog",
        noCollapse: true,
      },
    ]
  },

  {
    type: "title",
    title: "Guide Video & Images",
    key: "Guide",
    accessKey: "24aca47201d0153b25d26ab322e0579082163a20e60688f03048e441f02e5f46",
    icon: <FaTachometerAlt size="12px" />, // Dashboard icon
    children: [
      {
        type: "collapse",
        name: "Guide Images",
        key: "guide-images",
        route: "/guide-images",
        icon: <FaPlusSquare size="12px" />, // Add Box icon
        component_name: "guide-images",
        component: <GuideImages />,
        noCollapse: true,
        state: { type: "Interior" }
      },
      {
        type: "collapse",
        name: "Guide Videos",
        key: "guide-videos",
        route: "/guide-videos",
        icon: <FaPlusSquare size="12px" />, // Add Box icon
        component_name: "guide-videos",
        component: <GuideVideos />,
        noCollapse: true,
        state: { type: "Interior" }
      },
    ],
  },
  {
    type: "title",
    title: "Ticket",
    key: "ticket",
    accessKey: "cbe8ff27e5d5d13fcc3069b741f7f98df1240f35180298326061533791fdf79b",
    icon: <FaUsers size="12px" />,  // Team Icon
    route: "/ticket",
    component_name: "ListTicket",
    noCollapse: true,
    component: <ListTicket />,
    children: [
      {
        type: "collapse",
        name: "Ticket",
        key: "ticket",
        route: "/ticket",
        icon: <FaUsers size="12px" />,  // Team Icon
        component_name: "ListTicket",
        noCollapse: true,
        component: <ListTicket />,
      },
    ]
  },
  {
    type: "title",
    title: "Assets",
    key: "assets",
    accessKey: "5d1b303766542ff04f8a0768ff96546b1fc65f342fb0a5f7c6145ffe1957deb5",
    icon: <FaUsers size="12px" />,  // Team Icon
    noCollapse: true,
    children: [
      {

        type: "collapse",
        name: "Add Assets",
        key: "add-asset",
        // accessKey: "4ca2b25bb41fb4afb8f3b1de2a7f7bdf9902267b08a7342b1729ced7b669d493",
        icon: <FaUsers size="12px" />,  // Team Icon
        route: "/add-asset",
        component_name: "AddAsset",
        noCollapse: true,
        component: <AddAsset />,
      },
      {
        type: "collapse",
        name: "List Assets",
        key: "list-asset",
        // accessKey: "4ca2b25bb41fb4afb8f3b1de2a7f7bdf9902267b08a7342b1729ced7b669d493",
        icon: <FaUsers size="12px" />,  // Team Icon
        route: "/list-asset",
        component_name: "ListAsset",
        noCollapse: true,
        component: <ListAssets />,
      },
      {
        type: "collapse",
        name: "Styles",
        key: "styles",
        // accessKey: "4ca2b25bb41fb4afb8f3b1de2a7f7bdf9902267b08a7342b1729ced7b669d493",
        icon: <FaUsers size="12px" />,  // Team Icon
        route: "/styles",
        component_name: "Styles",
        noCollapse: true,
        component: <StyleManagement />,
      },
      {
        type: "collapse",
        name: "Room Modal & Element",
        key: "room-elements",
        // accessKey: "4ca2b25bb41fb4afb8f3b1de2a7f7bdf9902267b08a7342b1729ced7b669d493",
        icon: <FaUsers size="12px" />,  // Team Icon
        route: "/room-elements",
        component_name: "RoomElementsManagement",
        noCollapse: true,
        component: <RoomElementsManagement />,
      },
    ]
  },
  {
    type: "title",
    title: "Partner Management",
    key: "team",
    accessKey: "24aca47201d0153b25d26ab322e0579082163a20e60688f03048e441f02e5f46",
    icon: <FaUsers size="12px" />,  // Team Icon
    noCollapse: true,
    children: [
      {

        type: "collapse",
        name: "Partner",
        key: "team",
        // accessKey: "4ca2b25bb41fb4afb8f3b1de2a7f7bdf9902267b08a7342b1729ced7b669d493",
        icon: <FaUsers size="12px" />,  // Team Icon
        route: "/list-partner",
        component_name: "ListPartner",
        noCollapse: true,
        component: <ListPartner />,
      },
      {

        type: "collapse",
        name: "Ticket",
        key: "team",
        // accessKey: "4ca2b25bb41fb4afb8f3b1de2a7f7bdf9902267b08a7342b1729ced7b669d493",
        icon: <FaUsers size="12px" />,  // Team Icon
        route: "/partner-ticket-list",
        component_name: "PartnerTicketList",
        noCollapse: true,
        component: <PartnerTicketList />,
      },
    ]
  }
];

export default routes;
