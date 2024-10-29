import {Request} from "@/network/request.js";
import axios from 'axios';
import {HOST} from "@/config.js";

export class Api {

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
        if (!params) {
            params = {}
            params["type"] = "all"
        } else {
            if(params.id > 0) {
                params["type"] = "area"
            }
        }
        return Request.post('get_info%2Fget_all_rooms',params)
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
        return Request.post('get_info%2Fget_entry_by_id',params)
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
    static async getAdGroupTree(params){
        return Request.post('user_group%2Fget_ad_group_tree',params)
    }

    static async getSystemGroupTree(params){
        return Request.post('user_group%2Fget_group_tree',params)
    }

    static async getGroupMember(params){
        return Request.post('user_group%2Fget_group_member',params)
    }

    
    static async getADSyncStatus(params){
        return Request.post('user_group/get_sync_ad_state',params)
    }
    
    static async deleteGroup(params){
        return Request.post('user_group/del_group',params)
    }

    static async bindUserToGoup(params){
        return Request.post('user_group/bind_user_to_group',params)
    }

    static async unbindUserToGoup(params){
        return Request.post('user_group/unbind_user_to_group',params)
    }

    static async addGroup(params){
        return Request.post('user_group/add_group',params)
    }

    static async editGroup(params){
        return Request.post('user_group/edit_group',params)
    }

    static async getTerminalList(params){
        return Request.post('device%2Fdevice_info',params)
    }

    static async getAvaliableDevices(params){
        return Request.post('device%2Fget_avaliable_device',params)
    }

    static async bindDevice(params){
        return Request.post('device%2Fbind',params)
    }

    static async getMeetList(params){
        return Request.post('entry%2Fget_entry',params)
    }

    static async unbindDevice(params){
        return Request.post('device%2Funbind',params)
    }

    // 引导页&系统设置
    static async getVariables(params){
        return Request.post('system_setting%2Fget_variables',params)
    }

    static async setVariables(params){
        return Request.post('system_setting%2Fset_variables',params)
    }


    static async uploadAppLogo(formData){
        return axios.post(`${HOST}/web/call.php?act=upload%2Fapp_logo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    static async uploadWebLogo(formData){
        return axios.post(`${HOST}/web/call.php?act=upload%2Fweb_logo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}