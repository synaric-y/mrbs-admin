import {HOST} from "@/config.js";
import axios from "@/network/axios.js";

export class Request {

    static async post(path, params) {
        return axios({
            url: `${HOST}/web/call.php?act=${path}`,
            method: 'POST',
            data: params,
        })
    }
}