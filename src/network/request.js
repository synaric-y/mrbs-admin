import {HOST} from "@/config.js";
import axios from "@/network/axios.js";
import router from "@/router/index.js";

export class Request {

    static async post(path, params) {
        let res = await axios({
            url: `${HOST}/web/call.php?act=${path}`,
            method: 'POST',
            data: params,
        })

        let rep = res.data;
        if (rep.code == -99) {
            await router.replace('/login')
            return {}
        }
        if (rep.code != 0) {
            throw Error('message')
        }
        return rep.data
    }
}