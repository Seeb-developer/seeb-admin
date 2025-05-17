import React from "react";
import RingLoader from "react-spinners/RingLoader";

const override = {
  display: "flex",
  justifyContent: "center",
  margin: "0 auto",
  borderColor: "red",
};

const Loader = () => {
  let loading = true;

  return (
    <RingLoader
      color={"#000"}
      loading={loading}
      cssOverride={override}
      size={100}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Loader;
