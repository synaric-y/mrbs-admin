import {Request} from "@/network/request.js";

export class Api {

    static async login(params) {
        return Request.post('login', params)
    }

    static async getAreaList(params) {
        params["type"] = "area"
        return Request.post('admin', params)
    }

    static async addArea(params) {
        params["type"] = "area"
        return Request.post('add', params)
    }

    static async deleteArea(params) {
        params["type"] = "area"
        return Request.post('del', params)
    }

    static async editArea(params) {
        return Request.post('edit_area_handler', params)
    }

    static async getArea(params) {
        params["type"] = "area"
        return Request.post('detail', params)
    }

    static async getRoomList(params) {
        params["type"] = "room"
        return Request.post('admin', params)
    }

    static async addRoom(params) {
        params["type"] = "room"
        return Request.post('add', params)
    }

    static async deleteRoom(params) {
        params["type"] = "room"
        return Request.post('del', params)
    }

    static async getRooms(params) {
        params["type"] = "area"
        return Request.post('index', params)
    }

    static async getMeetRooms(params) {
        params["type"] = "room"
        return Request.post('index', params)
    }

    static async getRoom(params) {
        params["type"] = "room"
        return Request.post('detail', params)
    }

    static async editRoom(params) {
        return Request.post('edit_room_handler', params)
    }

    static async getUserList(params) {
        return Request.post('get_all_users', params)
    }

    static async addUser(params) {
        params["action"] = "add"
        return Request.post('edit_users', params)
    }

    static async deleteUser(params) {
        params["action"] = "delete"
        return Request.post('edit_users', params)
    }

    static async updateUser(params) {
        params["action"] = "edit"
        return Request.post('edit_users', params)
    }

    static async getUserById(params) {
        return Request.post('get_user_by_id', params)
    }
}