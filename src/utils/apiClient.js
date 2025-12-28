import { decryptCBCResponse } from "./decryptApi";

const BASE_URL = process.env.REACT_APP_HAPS_MAIN_BASE_URL || "http://localhost:8080/";

/**
 * Global API caller
 */
export const apiCall = async ({
    endpoint,
    method = "GET",
    data = null,
    headers = {},
    params = null,
}) => {
    let url = `${BASE_URL}${endpoint}`;

    if (params) {
        url += `?${new URLSearchParams(params).toString()}`;
    }

    const token = localStorage.getItem("Token");

    // 🔍 Detect FormData
    const isFormData = data instanceof FormData;

    const config = {
        method,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...headers,
        },
    };

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (data && method !== "GET") {
        config.body = isFormData ? data : JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);
        const json = await response.json();
        // const result = json;
        const result = decryptCBCResponse(json);
        // console.log("API Response:", result);
        // if (!response.ok) {
        //   throw new Error(result?.message || "API request failed");
        // }

        return result;
    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
};
