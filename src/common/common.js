import moment from "moment";

export class Common {

    static getTodayTimestamps() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
        return {
            start: Math.floor(startOfDay / 1000),
            end: Math.floor(endOfDay / 1000)
        };
    }

    static getThreeDaysTimestamps() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfThreeDays = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 23, 59, 59, 999).getTime();
        return {
            start: Math.floor(startOfDay / 1000),
            end: Math.floor(endOfThreeDays / 1000)
        };
    }

    static getThisWeekTimestamps() {
        const now = new Date();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1).getTime();
        const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7, 23, 59, 59, 999).getTime();
        return {
            start: Math.floor(startOfWeek / 1000),
            end: Math.floor(endOfWeek / 1000)
        };
    }
} 