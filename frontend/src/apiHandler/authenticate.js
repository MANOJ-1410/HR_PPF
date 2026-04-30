import { backendUrl } from "../backendUrl";
import client from "../utils/client";

const commonEndpoint = `${backendUrl}/api/v1/auth`;

export const LoginAdmin = async (formData) => {
    try {
        const response = await client.post(`${commonEndpoint}/login`, formData);
        return response;
    } catch (error) {
        console.error("Error:", error.message);

        // Handle error responses
        if (error.response) {
            console.error("Response Data:", error.response.data);
            console.error("Response Status:", error.response.status);
            console.error("Response Headers:", error.response.headers);

            // Handle specific 403 error or other status codes
            if (error.response.status === 403) {
                console.log("Login failed: Email or password is incorrect.");
            }
        } else if (error.request) {
            console.error("No Response Received:", error.request);
        } else {
            console.error("Error Config:", error.config);
        }
    }
}
