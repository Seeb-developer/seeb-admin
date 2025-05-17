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
import { useState } from "react";
import { Spin } from "antd";
import { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function CreateRole() {
  const [loading, setLoading] = useState(true);
  const [roleName, setRoleName] = useState("");
  const [pageList, setPageList] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  const onChangeCheckbox = (id = null) => {
    if (id === null) return;
    setSelectedPages((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((pageId) => pageId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // list pages for privilages
  const listPages = async () => {
    setLoading(true);
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    await fetch(
      process.env.REACT_APP_HAPS_MAIN_BASE_URL + "privileges/get-all-sections",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setPageList(result.data);
        if (result.status === 200) {
          setLoading(false);
        }
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    listPages();
  }, []);

  // api for creating role
  const handleSubmit = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      role_title: roleName,
      sections_id: JSON.stringify(selectedPages),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(
      process.env.REACT_APP_HAPS_MAIN_BASE_URL + "/privileges/create-role",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === 200) {
          setLoading(false);
          toast.success("Role Created successfully", {
            theme: "light",
            autoClose: "2000",
          });
        }
      })
      .catch((error) => console.log("error", error));
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <>
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />
          <div>
            <div>
              <div className="">
                <label htmlFor="createRole" className="block text-gray-700 font-semibold ">
                  Create Role
                </label>
                <input
                  type="text"
                  id="createRole"
                  name="createRole"
                  placeholder="Enter role name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                />
              </div>

              {/* list */}
              <div className="relative text-centre mt-6 overflow-x-auto shadow-md sm:rounded-lg sm:w-full md:w-full lg:w-2/6 xl:w-2/6">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-center">
                        Pages
                      </th>
                      <th scope="col" className="px-6 py-3 text-center">
                        Checkbox
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageList.map((el, index) => (
                      <tr
                        key={el.id}
                        className={`border-b dark:bg-gray-800 dark:border-gray-700 ${
                          index % 2 === 0
                            ? "odd:bg-white even:bg-gray-50"
                            : "odd:dark:bg-gray-800 even:dark:bg-gray-700"
                        }`}
                      >
                        <td className="px-6 py-4 text-center">
                          <a>{el.section_title}</a>
                        </td>
                        <td className="px-6 py-4 flex justify-center">
                          <input
                            type="checkbox"
                            onChange={() => onChangeCheckbox(el.id)}
                            checked={selectedPages.includes(el.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-0.5 mt-6 text-white bg-black rounded-md hover:bg-gray-900"
              onClick={handleSubmit}
              disabled={loading === true}
            >
              {loading ? <Spin indicator={antIcon} className="text-white" /> : "Submit"}
            </button>
            <ToastContainer />
          </div>
          {/* <Footer /> */}
        </DashboardLayout>
      ) : (
        <NontAuthorized401 />
      )}
    </>
  );
}

export default CreateRole;
