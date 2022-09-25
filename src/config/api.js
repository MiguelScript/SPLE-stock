import Axios from "axios";

export const backendUrl = process.env.REACT_APP_BACKEND_URL;

const api = Axios.create({
    baseURL: backendUrl,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

export default api;