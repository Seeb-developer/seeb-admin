import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { apiCall } from "utils/apiClient";


const AdminServiceBookingModal = ({
  isOpen,
  onClose,
  selectedService,
  roomId,
  bookingId,
  setData,
  data,
}) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [openGroup, setOpenGroup] = useState(null);

  /* ---------------- AUTO CALCULATE ADDONS (SAME AS USER) ---------------- */
  useEffect(() => {
    if (selectedService?.addons?.length > 0 && width && height) {
      const area = width * height;
      const updatedAddons = {};

      selectedService.addons.forEach((addon) => {
        const isRequired = addon.is_required === "1";
        const baseQty = addon.qty ? Number(addon.qty) : 1;

        const calculatedQty =
          addon.price_type === "square_feet"
            ? Math.max(1, Math.ceil((baseQty / 100) * area))
            : baseQty;

        if (isRequired || selectedAddons.hasOwnProperty(addon.id)) {
          updatedAddons[addon.id] = calculatedQty;
        }
      });

      setSelectedAddons(updatedAddons);
    }
  }, [selectedService, width, height, selectedAddons]);

  // if (!isOpen || !selectedService) return null;

  /* ---------------- IMAGE HANDLING ---------------- */
  const handleFiles = (files) => {
    const imgs = files
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ id: URL.createObjectURL(f), file: f }));

    setImages((prev) => [...prev, ...imgs]);
  };

  const handleFileChange = (e) => handleFiles(Array.from(e.target.files));
  const removeImage = (id) =>
    setImages((prev) => prev.filter((img) => img.id !== id));

  /* ---------------- ADDON TOGGLE ---------------- */
  const handleAddonChange = (addonId, isRequired, qty) => {
    setSelectedAddons((prev) => {
      if (prev[addonId]) {
        const copy = { ...prev };
        if (!isRequired) delete copy[addonId];
        return copy;
      }
      return { ...prev, [addonId]: Math.max(1, qty) };
    });
  };

  const updateAddonQty = (addonId, delta) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: Math.max(1, (prev[addonId] || 1) + delta),
    }));
  };

  /* ---------------- PRICE CALC ---------------- */
  const baseTotal =
    selectedService.rate_type === "square_feet"
      ? width * height * selectedService.rate
      : quantity * selectedService.rate;

  const addonTotal = Object.entries(selectedAddons).reduce(
    (sum, [addonId, qty]) => {
      const addon = selectedService.addons.find(
        (a) => a.id === addonId
      );
      if (!addon) return sum;
      return sum + qty * addon.price;
    },
    0
  );

  const total = baseTotal + addonTotal;

  /* ---------------- SUBMIT (ADMIN) ---------------- */
  const handleSubmit = async () => {
    try {
      if (
        selectedService.rate_type === "square_feet" &&
        (!width || !height)
      ) {
        toast.error("Enter valid width & height");
        return;
      }

      setLoading(true);

      let referenceImagesJson = null;
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images[]", img.file));

        const uploadRes = await apiCall({
          endpoint: "booking/upload-images",
          method: "POST",
          data: formData,
        });

        referenceImagesJson = JSON.stringify(uploadRes.data.images);
      }

      const value =
        selectedService.rate_type === "square_feet"
          ? `${width}X${height}`
          : quantity;

      const addonsPayload = selectedService.addons
        .filter(
          (a) =>
            a.is_required === "1" ||
            selectedAddons.hasOwnProperty(a.id)
        )
        .map((a) => ({
          id: a.id,
          name: a.name,
          price: a.price,
          price_type: a.price_type,
          qty: selectedAddons[a.id],
          total: (selectedAddons[a.id] * a.price).toFixed(2),
          description: a.description,
          is_required: a.is_required,
          group_name: a.group_name,
        }));

      // const payload = {
      //   booking_id: bookingId,
      //   service_id: selectedService.id,
      //   service_type_id: selectedService.service_type_id,
      //   room_id: roomId,
      //   rate_type: selectedService.rate_type,
      //   value,
      //   rate: selectedService.rate,
      //   addons: addonsPayload,
      //   ...(referenceImagesJson && {
      //     reference_image: referenceImagesJson,
      //   }),
      //   amount: total.toFixed(2),
      //   user_id: selectedService.user_id,
      // };

      const payload = {
        booking_id: bookingId,
        service_id: selectedService.id,
        service_type_id: selectedService.service_type_id,
        room_id: roomId,
        rate_type: selectedService.rate_type,
        value,
        rate: selectedService.rate,
        addons: addonsPayload,
        ...(referenceImagesJson && {
          reference_image: referenceImagesJson,
        }),
        amount: total.toFixed(2),
        user_id: selectedService.user_id,
      };

      // Add to data list
      const newService = {
        id: selectedService.id,
        name: selectedService.name,
        value,
        rate: selectedService.rate,
        baseTotal: baseTotal.toFixed(2),
        addonTotal: addonTotal.toFixed(2),
        total: total.toFixed(2),
        addons: addonsPayload,
        ...(referenceImagesJson && {
          reference_image: referenceImagesJson,
        }),
        timestamp: new Date().toISOString(),
      };

      setData((prevData) => {
        const updatedData = Array.isArray(prevData) ? [...prevData, newService] : [newService];
        return updatedData;
      });

      // const res = await apiCall({
      //   endpoint: "booking-service/add",
      //   method: "POST",
      //   data: payload,
      // });

      // if (res.status === 200 || res.status === 201) {
      //   toast.success("Service added to booking");
      //   onClose(true);
      // } else {
      //   toast.error(res.message || "Failed to add service");
      // }

      toast.success("Service added to list");
      onClose(true);
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-[95%] max-w-lg max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">
            {selectedService.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        <div
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4 overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {selectedService.rate_type === "square_feet" ? (
            <>
              <label className="block mb-2 text-sm font-medium">SQUARE FEET:</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="number"
                  placeholder="Width (ft)"
                  className="border border-gray-300 rounded-md px-3 py-2 w-1/2 text-sm"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Height (ft)"
                  className="border border-gray-300 rounded-md px-3 py-2 w-1/2 text-sm"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>
            </>
          ) : (
            <>
              <label className="block mb-2 text-sm font-medium">
                {selectedService.rate_type.replace("_", " ").toUpperCase()}:
              </label>
              <input
                type="number"
                placeholder={`Enter ${selectedService.rate_type.replace("_", " ")}`}
                className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm mb-4"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </>
          )}

          {/* Value & Amount Preview */}
          <div className="text-sm mb-2">
            Total {selectedService.rate_type.replace("_", " ")}:{" "}
            {selectedService.rate_type === "square_feet"
              ? width && height
                ? `${width * height}`
                : "-"
              : quantity}
          </div>
          <div className="text-sm mb-2">Rate: ₹{selectedService.rate}</div>

          {selectedService?.addons.length > 0 && (
            <>
              <h3 className="font-semibold mb-2">Select Addons</h3>



              {selectedService.addons.reduce((acc, addon) => {
                const group = acc.find(g => g.name === addon.group_name);
                if (group) {
                  group.addons.push(addon);
                } else {
                  acc.push({ name: addon.group_name, addons: [addon] });
                }
                return acc;
              }, []).map((group, index) => {
                const isOpen = openGroup === index;
                return (
                  <div key={group.name} className="mb-3 border border-gray-300 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setOpenGroup(isOpen ? null : index)}
                      className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold flex justify-between items-center"
                    >
                      <span className="text-blue-600">{group.name}</span>
                      {/* <ChevronDown
                                                className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                    }`}
                                            /> */}
                    </button>

                    {/* {isOpen && ( */}
                    <div className="bg-white overflow-hidden transition-all duration-500 ease-in-out">
                      {group.addons.map((addon) => {
                        const isRequired = addon.is_required === "1";
                        const isChecked = selectedAddons.hasOwnProperty(addon.id);
                        const baseQty = addon.qty ? Number(addon.qty) : 1;
                        const calculatedQty = addon.price_type === "square_feet"
                          ? Math.max(1, Math.ceil((parseFloat(baseQty || 0) / 100) * (width * height)))
                          : baseQty;

                        const addonQty = isChecked ? selectedAddons[addon.id] : calculatedQty;

                        // console.log( "addonQty", addonQty, "area", width * height, "selectedAddon", selectedAddons[addon.id]);

                        return (
                          <label
                            key={addon.id}
                            className="flex justify-between items-start mb-3  rounded-md p-3 cursor-pointer hover:bg-gray-50"
                          >
                            <div className="flex items-start">
                              <input
                                type="checkbox"
                                className="mt-1 mr-3"
                                checked={isRequired || isChecked}
                                onChange={() => handleAddonChange(addon.id, isRequired, addonQty)}
                                disabled={isRequired}
                              />
                              <div className="text-sm">
                                <div className="font-semibold">{addon.name}</div>
                                <div className="text-gray-600">{addon.description}</div>
                                <div className="text-xs mt-1 flex items-center gap-2 flex-wrap">
                                  {(addon.price_type === "unit" && isChecked) ? (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => updateAddonQty(addon.id, -1)}
                                        className="bg-gray-200 px-2 rounded cursor-pointer"
                                      >
                                        −
                                      </button>
                                      <span>{addonQty}</span>
                                      <button
                                        type="button"
                                        onClick={() => updateAddonQty(addon.id, 1)}
                                        className="bg-gray-200 px-2 rounded cursor-pointer"
                                      >
                                        +
                                      </button>
                                      <span className="ml-2">
                                        | ₹{addon.price} per {addon.price_type.replace("_", " ")}
                                      </span>
                                    </>
                                  ) : (
                                    <span>
                                      {addon.price_type.replace("_", " ").replace(/^./, c => c.toUpperCase())}: {addonQty} | Rate: ₹{addon.price}
                                    </span>
                                  )}
                                  {isRequired && (
                                    <span className="ml-2 text-red-500 font-medium">(Required)</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="text-sm font-semibold text-right text-gray-700 whitespace-nowrap ml-4">
                              ₹{(addonQty * addon.price).toFixed(2)}
                            </div>

                          </label>
                        );
                      })}
                    </div>
                    {/* )} */}
                  </div>
                );
              })}

            </>
          )}

          <div className="text-sm text-gray-600 mb-1">
            Base: ₹{baseTotal.toFixed(2)}
          </div>

          {(selectedService?.addons.length > 0) && (<div className="text-sm text-gray-600 mb-2">
            Addons: ₹{addonTotal.toFixed(2)}
          </div>)}

          <div className="text-lg font-semibold text-red-600 mb-4">
            Total: ₹{total.toFixed(2)}
          </div>

          {/* <div
                    className="border-2 border-dashed border-blue-400 rounded-xl p-6 text-center text-blue-600 cursor-pointer mb-4"
                    onClick={() => fileInputRef.current.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                > */}
          {/* <div className="flex justify-center mb-2">
                        <ImagePlus className="w-6 h-6 text-blue-600" />
                    </div> */}
          {/* <span className="text-sm">Tap or Drag & Drop to Upload Reference Images</span> */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition flex justify-center cursor-pointer"
            >
              {/* <ImagePlus className="w-6 h-6 mr-2" /> */}
              Upload Reference Images
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* </div> */}

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <img src={img.url || img.id} alt="Uploaded" className="w-full h-24 object-cover rounded-lg" />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 h-6 w-6 bg-red-600 text-white p-1 rounded-full text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center p-4 gap-3">
          <button
            onClick={() => onClose(false)}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            {loading ? "Adding..." : "Add Service"}
          </button>
        </div>



        {/* <button
          className="btn-secondary btn w-full !font-bold cursor-pointer"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add To Cart"}
        </button> */}

      </div>
    </div >
  );
};




AdminServiceBookingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedService: PropTypes.object.isRequired,
  roomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  bookingId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setData: PropTypes.func.isRequired,
  data: PropTypes.any,
};

export default AdminServiceBookingModal;

