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

    static getTimestampForTodayWithTime(timeString) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const [hours, minutes] = timeString.split(':').map(Number);
        const timeInMs = (hours * 60 * 60) + (minutes * 60);
        return timeInMs;
    }

    static getTimestampFromDateAndTime(dateString, timeString) {
        const [year, month, day] = dateString.split('-').map(Number);
        let [time, modifier] = timeString.split(/(AM|PM)/);
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === "PM" && hours < 12) {
            hours += 12;
        }
        if (modifier === "AM" && hours === 12) {
            hours = 0;
        }
        const date = new Date(year, month - 1, day, hours, minutes);
        return Math.floor(date.getTime() / 1000);
    }

    static getTimestampForDateAndTime(dateString, timeString) {
        const [year, month, day] = dateString.split('-').map(Number);
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date(year, month - 1, day, hours, minutes);
        return Math.floor(date.getTime() / 1000);
    }

    static getTimestampForTodayWithTime(timeString) {
        const now = moment();
        const time = moment(timeString, 'hh:mmA');
        const combined = now.set({
            hour: time.get('hour'),
            minute: time.get('minute'),
            second: 0,
            millisecond: 0
        });
        return Math.floor(combined.valueOf() / 1000);
    }
} 