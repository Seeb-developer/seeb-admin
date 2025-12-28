import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiCall } from 'utils/apiClient';



const CouponApply = () => {

    const [discount, setDiscount] = useState('');

    const handleDiscount = async () => {
        try {
            const result = await apiCall({ endpoint: "product/applyDiscount", method: "PUT", data: { discounted_percent: discount } });
            if (result.status === 200) {
                toast.success("Discount applied successfully", {
                    theme: "light",
                    autoClose: "2000",
                });
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    return (
        <div>
            <div className="w-1/2">
                <label htmlFor="Discount" className="block text-gray-700 font-semibold ">
                    Discount
                </label>
                <input
                    type="text"
                    id="discount"
                    name="discount"
                    placeholder='Enter discount'
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-xs"
                />
            </div>
            <button
                type="submit"
                className="w-1/2 py-1 mt-4 text-white bg-black hover:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleDiscount}
            >
                Submit
            </button>
            <ToastContainer />
        </div>
    )
}

export default CouponApply;
