import axios from "axios";
import { backendUrl } from "../backendUrl";

const client = axios.create({
    baseURL: backendUrl, 
    responseType: "json",
    withCredentials: true,
    headers: { Accept: "application/json" }
});

export default client;