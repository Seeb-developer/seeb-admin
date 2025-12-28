import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { apiCall } from "utils/apiClient";

const Filterorder = (props) => {
  const { children, totalCount, setSelectedCategory } = props;
  const [isActive, setIsActive] = useState(true);

  Filterorder.propTypes = {
    children: PropTypes.object.isRequired,
    totalCount: PropTypes.number.isRequired,
    setSelectedCategory: PropTypes.func.isRequired,
  };

  const [categories, setCategories] = useState([]);
  //
  // Get Categories API
  //
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await apiCall({ endpoint: "admin/getHomeZoneAppliancesWithOrderCount", method: "GET" });
        setCategories(result.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex-row align-middle">
          {console.log(categories)}
          <div className="flex gap-2 justify-center">
            {categories.map((category, i) => (
              <div className="flex flex-row" key={i}>
                <button
                  // value={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={` border p-1.5 rounded-full px-4 text-sm font-semibold ${
                    isActive ? "bg-black text-white" : "bg-white text-black"
                  }`}
                >
                  {category.title}({ category.product_count})
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default Filterorder;
