import React from 'react'
import { Spin } from "antd";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Create = () => {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState("");


  return (
    <>
      <div className="bg-white rounded-lg">
            <form className="p-4 md:p-5 lg:p-5 xl:p-5">
              <div className="">
                <label htmlFor="notificationTitle" className="block text-gray-700 font-semibold ">
                  Notification Title
                </label>
                <input
                  type="text"
                  id="notificationTitle"
                  name="notificationTitle"
                  placeholder="Enter notification title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                />
              </div>

              {/* for description */}
              <div className="mt-4">
                <label htmlFor="notificationDesc" className="block text-gray-700 font-semibold ">
                  Notification Body
                </label>
                <input
                  type="text"
                  id="notificationBody"
                  name="notificationBody"
                  placeholder="Enter notification body"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                />
              </div>

              {/* image */}


              {/*  */}
              

              {/* submit button */}
              <button
                type="submit"
                className="w-full py-1 mt-6 text-white bg-black hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                // onClick={handleSubmit}
                // disabled={loading === true}
              >
                Submit
                {/* {loading ? <Spin indicator={antIcon} className="text-white" /> : "Submit"} */}
              </button>
            </form>
          </div>
    </>
  )
}

export default Create
