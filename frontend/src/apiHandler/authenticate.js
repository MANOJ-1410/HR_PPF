import { backendUrl } from "../backendUrl";
import client from "../utils/client";

const commonEndpoint = `${backendUrl}/api/auth`;

export const LoginAdmin = async (formData) => {
    try {
        const response = await client.post(`${commonEndpoint}/login`, formData);
        return response.data; // Return the data directly
    } catch (error) {
        console.error("Login Error:", error.message);
        return { hasError: true, message: error.response?.data?.message || "Login failed" };
    }
}

export const GetMe = async () => {
    try {
        const response = await client.get(`${commonEndpoint}/me`);
        return response.data;
    } catch (error) {
        return { hasError: true, message: "Not authenticated" };
    }
}

export const LogoutAdmin = async () => {
    try {
        const response = await client.post(`${commonEndpoint}/logout`);
        return response.data;
    } catch (error) {
        return { hasError: true };
    }
}
