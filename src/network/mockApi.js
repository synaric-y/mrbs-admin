import {Request} from "@/network/request.js";

export class MockApi {

    static async login(params) {
        return Request.post('login', params)
    }

    static async logout(params) {
        return Request.post('logout', params)
    }

    static async getAreaList(params) {
        params["type"] = "area"
        // return Request.post('area_room/admin', params)
        return Request.post('get_info%2Fadmin', params)
        // return Request.post('area_room%2Fadmin', params)
    }

    static async addArea(params) {
        params["type"] = "area"
        return Request.post('area_room%2Fadd', params)
    }

    static async deleteArea(params) {
        params["type"] = "area"
        return Request.post('area_room%2Fdel', params)
    }

    static async editArea(params) {
        return Request.post('area_room%2Fedit_area_handler', params)
    }

    static async getArea(params) {
        params["type"] = "area"
        return Request.post('get_info%2Fdetail', params)
    }

    static async getRoomList(params) {
        params["type"] = "room"
        return Request.post('get_info%2Fadmin', params)
    }

    static async addRoom(params) {
        params["type"] = "room"
        return Request.post('area_room%2Fadd', params)
    }

    static async deleteRoom(params) {
        params["type"] = "room"
        return Request.post('area_room%2Fdel', params)
    }

    static async getAreaRooms(params) {
        params["type"] = "all"
        if(params.id > 0) {
            params["type"] = "area"
        }
        return Request.post('get_all_rooms',params)
    }

    static async getMeetRooms(params) {
        params["type"] = "all"
        if(params.id > 0) {
            params["type"] = "area"
        }
        return Request.post('index', params)
    }

    static async getRoom(params) {
        params["type"] = "room"
        return Request.post('get_info%2Fdetail', params)
    }

    static async editRoom(params) {
        return Request.post('area_room%2Fedit_room_handler', params)
    }

    static async getAdmins(params) {
        return Request.post('get_admin',params)
    }

    static async getMeetDetail(params) {
        return Request.post('get_entry_by_id',params)
    }

    static async editMeet(params) {
        return Request.post('edit_entry_handler',params)
    }

    static async deleteMeet(params) {
        return Request.post('del_entry',params)
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

    // 2024-10-16 预约会议2.0开发
    static async getAllUsers(params) {
        return Request.post('get_info%2Fget_all_users',params)
    }

    static async updateAccount(params) {
        return Request.post('user%2Fdisable_user',params)
    }

    static async editUser(params) {
        return Request.post('user%2Fedit_users',params)
    }

    // 用户组
    static async getAdGroupTree(){
        return new Promise((resolve,reject)=>{
            const res = {
                "code": 0,
                "msg": "success",
                "data": {
                    "group": {
                        "child_groups": [
                            {
                                "id": "1",
                                "name": "Admin",
                                "third_id": "05446878-CB80-45FB-86AA-37F49E25263A",
                                "disabled": "0",
                                "user_count": "3"
                            },
                            {
                                "id": "2",
                                "name": "testgroup",
                                "third_id": "8B77CF4B-1D1B-42C9-A315-D8DDED1583DF",
                                "disabled": "0",
                                "user_count": "0"
                            },
                            {
                                "id": "6",
                                "name": "BCC-Dev-System",
                                "third_id": "03130C9F-51A1-450F-A429-F302E4A7B4BA",
                                "disabled": "0",
                                "user_count": "3"
                            },
                            {
                                "id": "9",
                                "name": "Expert Researcher",
                                "third_id": "AFB1B7AB-F515-46A2-8E00-F71B4E465A46",
                                "disabled": "0",
                                "user_count": "1"
                            },
                            {
                                "id": "11",
                                "name": "BCC-GES Group",
                                "third_id": "23EF8C5A-9BF1-4B59-A635-A9AF5503F493",
                                "disabled": "0",
                                "user_count": "2"
                            },
                            {
                                "id": "14",
                                "name": "bcc-hr-bj",
                                "third_id": "CC756E96-040F-413D-B9FA-3958395E7A0F",
                                "disabled": "0",
                                "user_count": "0"
                            },
                            {
                                "id": "15",
                                "name": "BCC-Overseas-Payment",
                                "third_id": "9C403602-77AE-45EF-A2B9-8AE8C9B04C6D",
                                "disabled": "0",
                                "user_count": "4"
                            },
                            {
                                "id": "16",
                                "name": "expert-confirm",
                                "third_id": "CA6CEEBF-8494-477B-95B4-457D3ACB224D",
                                "disabled": "0",
                                "user_count": "1"
                            },
                            {
                                "id": "17",
                                "name": "FAB Group",
                                "third_id": "037F6F7A-6689-4059-9CD0-C916CA16D0F5",
                                "disabled": "0",
                                "user_count": "0"
                            },
                            {
                                "id": "21",
                                "name": "alliancebernstein",
                                "third_id": "3B305708-5757-40C4-953B-B0CCA8EF7AC0",
                                "disabled": "0",
                                "user_count": "0"
                            }
                        ]
                    }
                }
            }

            resolve(res)
        })
    }

    static async getSystemGroupTree(){
        return new Promise((resolve,reject)=>{
            const res = {
                "code": 0,
                "msg": "success",
                "data": {
                    "group": {
                        "child_groups": [
                            {
                                "id": "2331",
                                "name": "My Group",
                                "third_id": "05446878-CB80-45FB-86AA-37F49E25263A",
                                "disabled": "0",
                                "user_count": "0"
                            }
                        ]
                    }
                }
            }

            resolve(res)
        })
    }
}