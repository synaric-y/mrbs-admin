import {Request} from "@/network/request.js";

export class Api {

    static async login(params) {
        return Request.post('login', params)
    }

    static async getAreaList(params) {
        params["type"] = "area"
        return Request.post('admin', params)
    }
}