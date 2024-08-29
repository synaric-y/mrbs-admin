import {Request} from "@/network/request.js";

export class Api {

    static async login(params) {
        return Request.post('web/login.php', params)
    }
}