import { BASE_URL } from '../../helpers/Constants';
import axios from "axios";
// Setting up BaseURL and stuff
export const axiosClient = axios.create({
    baseURL:BASE_URL,
    timeout:10000,
});
