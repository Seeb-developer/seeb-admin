import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const CouponApply = () => {

    const [discount, setDiscount] = useState('');

    const handleDiscount = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "discounted_percent": discount
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch(process.env.REACT_APP_HAPS_MAIN_BASE_URL + "product/applyDiscount", requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log(result);
                if (result.status === 200) {
                    toast.success("Discount applied successfully", {
                        theme: "light",
                        autoClose: "2000",
                    });
                }

            })
            .catch(error => console.log('error', error));
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
