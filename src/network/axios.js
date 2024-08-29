import axios from 'axios';
import {HOST} from "@/config.js";

const instance = axios.create({
    baseURL: HOST, // 设置后端 API 的基本 URL
    timeout: 30000, // 设置请求超时时间
})

instance.interceptors.request.use(
    config => {
        // config.headers['Access-Control-Allow-Origin'] = '*'
        config.headers['Content-Type'] = 'application/json'
        return config
    }
)

instance.interceptors.response.use(
    response => response,
    error => {
        console.error('API error:', error);
        return Promise.reject(error);
    }
)

export default instance;
