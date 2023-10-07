import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import ENVVALUES from "@/config/env"

const API_URL = ENVVALUES.GATEWAY_API_URL;
const newAxios = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const responseHandler = (response: AxiosResponse) => {
    return response.data;
}
newAxios.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => {
        return Promise.reject(error);
    }
);
/**
 * API Service
 * @param serviceUrl
 */
export default class APISERVICE {
    readonly serviceUrl: string;
    public readonly API_URL = API_URL;
    readonly newAxios = newAxios;
    constructor(serviceUrl: string = "") {
        this.serviceUrl = serviceUrl;
        this.API_URL = `${API_URL}/v1${serviceUrl}`
        this.init();
    }

    init = () => {
        // You can use this method to initialize your API class
    }

    public Get = async <Config extends AxiosRequestConfig, Response>(url: string, config?: Config): Promise<Response> => {
        return await this.newAxios.get(`${this.API_URL}${url}`, config);
    }


    public Post = async <Config extends AxiosRequestConfig, Response>(url: string, data: any, config?: Config): Promise<Response> => {
        return await this.newAxios.post(`${this.API_URL}${url}`, data, config);
    }

    public Put = async <Config extends AxiosRequestConfig, Response>(url: string, data: any, config?: Config): Promise<Response> => {
        return await this.newAxios.put(`${this.API_URL}${url}`, data, config);
    }

    public Delete = async <Config extends AxiosRequestConfig, Response>(url: string, config?: Config): Promise<Response> => {
        return await this.newAxios.delete(`${this.API_URL}${url}`, config);
    }
}

