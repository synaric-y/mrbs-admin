import {HOST} from "@/config.js";
import axios from "@/network/axios.js";

export class Request {

    static async post(path, params) {
        let res =  axios({
            url: `${HOST}/web/call.php?act=${path}`,
            method: 'POST',
            data: params,
        })

        return res.data;
    }
}