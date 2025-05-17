import CoverLayout from "layouts/authentication/components/CoverLayout";
import React from "react";
import { useNavigate } from "react-router-dom";

// Images
// import curved8 from "assets/images/curved-images/curved15.jpg";

const Forbidden403 = () => {
  let Navigate = useNavigate();
  return (
    <CoverLayout>
      <div className="absolute top-[15%] left-[35%]">
        <section className="flex items-center h-full p-16 dark:bg-gray-900 dark:text-gray-100">
          <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
            <div className="max-w-md text-center">
              <h2 className="mb-8 font-extrabold text-7xl text-red-600 font-serif">
                <span className="sr-only"></span>Forbidden
              </h2>
              <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
                <span className="sr-only">Forbidden</span>403
              </h2>
              <p className="text-2xl font-semibold md:text-3xl">Sorry, we could not let you in.</p>
              <p className="mt-4 mb-8 dark:text-gray-400">
                But dont worry, we can serve you as soon as you logged in.
              </p>
              <button
                onClick={() => Navigate(-1)}
                className="px-8 py-3 font-semibold rounded bg-red-600 text-white"
              >
                Go Back
              </button>
            </div>
          </div>
        </section>
      </div>
    </CoverLayout>
  );
};

export default Forbidden403;
