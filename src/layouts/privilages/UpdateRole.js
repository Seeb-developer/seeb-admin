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
import { Select, Spin } from "antd";
import { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { Option } = Select;

function UpdateRole() {
  const [searchParam] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [roleName, setRoleName] = useState("");
  const [pageList, setPageList] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const onChangeCheckbox = (id) => {
    if (id === null) return;
    setSelectedPages((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((pageId) => pageId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleRoleTitleChange = (event) => {
    console.log("event", event);
    setSelectedRoleId(event);
    getDataById(event);
  };

  // api to get role titles
  useEffect(() => {
    const getData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };

        const response = await fetch(
          process.env.REACT_APP_HAPS_MAIN_BASE_URL + "privileges/get-all-roles",
          requestOptions
        );
        const result = await response.json();
        setRoles(result.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    getData();
  }, []);

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

  // api to get data by id
  const getDataById = (id) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `/privileges/get-role/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // console.log('type',  JSON.parse(result.data.section_access));

        setSelectedPages(JSON.parse(result.data.section_access));
      })
      .catch((error) => console.log("error", error));
  };

  // useEffect(() => {
  //   getDataById();
  // }, []);

  // api for updating role
  const handleSubmit = async (e) => {
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      role_id: selectedRoleId,
      // role_title:  JSON.stringify(selectedRoleId),
      sections_id: JSON.stringify(selectedPages),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + `privileges/update-role`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.status === 200) {
          setLoading(false);
          toast.success("Role Updated successfully", {
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

  // delete api
  const handleDelete = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      role_id: selectedRoleId,
    });

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "privileges/delete-role", requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  return (
    <>
      {console.log(selectedRoleId)}
      {localStorage.getItem("Token") ? (
        <DashboardLayout>
          <DashboardNavbar />
          <div>
            <div>
              <div className="flex gap-10 ">
                <div className="w-1/2">
                  <label htmlFor="createRole" className="block text-gray-700 font-semibold ">
                    Update Role
                  </label>
                  <Select
                    id="role"
                    value={selectedRoleId}
                    onChange={handleRoleTitleChange}
                    className="w-full"
                  >
                    {!selectedRoleId && (
                      <Option value="" disabled>
                        Select Role
                      </Option>
                    )}
                    {roles.map((roles) => (
                      <Option key={roles.id} value={roles.id}>
                        {roles.title}
                      </Option>
                    ))}
                  </Select>
                </div>

                {/* delete button */}
                <div className="mt-8 ">
                  <button
                    onClick={handleDelete}
                    className="bg-black text-white text-sm p-1.5 rounded-md"
                  >
                    Delete Role
                  </button>
                </div>
              </div>

              {/* list */}
              <div className="relative text-centre mt-6 overflow-x-auto shadow-md sm:rounded-lg sm:w-full md:w-full lg:w-1/2 xl:w-1/2">
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
              className="w-1/2 py-0.5 mt-6 text-white bg-black rounded-md hover:bg-gray-900"
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

export default UpdateRole;
