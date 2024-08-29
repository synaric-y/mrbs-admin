import {HOST} from "@/config.js";
import axios from "@/network/axios.js";

export class Request {

    static async post(path, params) {
        return axios({
            url: `${HOST}/${path}`,
            method: 'POST',
            data: params,
        })
    }

    static async get(path, params) {
        return axios({
            url: `${HOST}/${path}`,
            params: params
        })
    }
}