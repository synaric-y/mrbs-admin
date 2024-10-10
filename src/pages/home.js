
export const adminData = {
    "code": 0,
    "message": "success",
    "data": [
        "admin"
    ]
}

export const meetData = {
    "code": 0,
    "message": "success",
    "data": {
        "id": "1101",
        "start_time": 1725249600,
        "end_time": 1725253200,
        "entry_type": "1",
        "repeat_id": "20",
        "room_id": "3",
        "room_name": "Room A",
        "timestamp": "2024-08-30 12:23:41",
        "create_by": "admin",
        "modified_by": "",
        "name": "short remark",
        "type": "I",
        "description": "all remark",
        "status": "4",
        "reminded": null,
        "info_time": null,
        "info_user": null,
        "info_text": null,
        "ical_uid": "1123123",
        "ical_sequence": "1",
        "ical_recur_id": "20241103T160320Z",
        "allow_registration": "0",
        "registrant_limit": "10",
        "registrant_limit_enabled": "1",
        "registration_opens": "1209600",
        "registration_opens_enabled": "0",
        "registration_closes": "1",
        "registration_closes_enabled": "0",
        "book_by": "joy book",
        "exchange_id": "AQMkADNjOWVjNWJkLWU3ZjMtNDhmOC04OTBkLWFkYzAyNTNmYzEyZQBGAAADGnORf1pex0qMUmK6PBXz5wcAZNcQvx0R/EWHphHpbd/SRQAAAgENAAAAZNcQvx0R/EWHphHpbd/SRQAAAgWgAAAA",
        "exchange_key": "DwAAABYAAABk1xC/HRH8RYemEelt39JFAAAAAAU6",
        "wxwork_bid": null,
        "wxwork_sid": null,
        "create_source": null
    }
}


export const testAreas = {
    "code": 0, "msg": "success", "data":
    {
        "areas":
            [
                {
                    "area_id": "20", "area_name": "shanghai", "resolution": "900", "disabled": 0, "start_time": "06:00 AM", "end_time": "09:30 PM",
                    "rooms": []
                },
                {
                    "area_id": "2", "area_name": "area2", "resolution": "1800", "disabled": 0, "start_time": "06:30 AM", "end_time": "10:30 PM",
                    "rooms": []
                },
            ]
        }
}



export const areaData = {
    "code": 0, "msg": "success", "data":
    {
        "areas":
            [
                {
                    "area_id": "20", "area_name": "shanghai", "resolution": "900", "disabled": 0, "start_time": "08:00 AM", "end_time": "09:30 PM",
                    "rooms": [{ "room_id": "1", "room_name": "room A", "description": "", "status": "\u53ef\u9884\u7ea6", "disabled": "0" },
                    { "room_id": "2", "room_name": "room B", "description": "", "status": "\u53ef\u9884\u7ea6", "disabled": "0" },
                    { "room_id": "3", "room_name": "room C", "description": "", "status": "\u53ef\u9884\u7ea6", "disabled": "0" },
                    { "room_id": "4", "room_name": "room D", "description": "", "status": "\u53ef\u9884\u7ea6", "disabled": "0" }]
                }]
    }
}

export const homeData = {
    "code": 0,
    "message": "success",
    "data": {
        "min_time": "08:00 AM",
        "max_time": "09:00 PM",
        "time": "01:55 PM October 08, 2024",
        "timestamp": 1727085600,
        "areas": [
            {
                "area_id": 20,
                "area_name": "shanghai",
                "disabled": 1,
                "resolution": 900,
                "rooms": [
                    {
                        "room_id": 1,
                        "room_name": "room A",
                        "disabled": 1,
                        "entries": [
                            {
                                "entry_id": 1,
                                "room_name": "room A",
                                "start_time": 1728349200,
                                "end_time": 1728352800,
                                "entry_name": "IT需求",
                                "book_by": "张三",
                                "status": 2, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "10",
                                "day": "08",
                                "week": "星期二",
                                "duration": "09:00AM-10:00AM"
                            },

                            {
                                "entry_id": 1,
                                "room_name": "room A",
                                "start_time": 1728363600,
                                "end_time": 1728367200,
                                "entry_name": "IT需求",
                                "book_by": "张三",
                                "status": 1, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "10",
                                "day": "08",
                                "week": "星期二",
                                "duration": "01:00PM-02:00PM"
                            },

                            {
                                "entry_id": 1,
                                "room_name": "room A",
                                "start_time": 1728367200,
                                "end_time": 1728370800,
                                "entry_name": "IT需求",
                                "book_by": "张三",
                                "status": 0, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "10",
                                "day": "08",
                                "week": "星期二",
                                "duration": "02:00PM-03:00PM"
                            },
                            {
                                "entry_id": 1,
                                "room_name": "room A",
                                "start_time": 1728353700,
                                "end_time": 1728357300,
                                "entry_name": "测试15分钟需求",
                                "book_by": "张小三",
                                "status": 2, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "10",
                                "day": "08",
                                "week": "Tuesday",
                                "duration": "10:15AM-11:15AM"
                            },
                            {
                                "entry_id": 2,
                                "room_name": "room A",
                                "start_time": 1728360000,
                                "end_time": 1728363600,
                                "entry_name": "it需求",
                                "book_by": "张小三",
                                "status": 2, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "10",
                                "day": "08",
                                "week": "Tuesday",
                                "duration": "12:00PM-01:00PM"
                            },
                            {
                                "entry_id": 3,
                                "room_name": "room A",
                                "start_time": 1728381600,
                                "end_time": 1728387000,
                                "entry_name": "销售会议",
                                "book_by": "李四",
                                "status": 0, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "10",
                                "day": "08",
                                "week": "Tuesday",
                                "duration": "06:00PM-07:30PM"
                            }
                        ]
                    },

                    {
                        "room_id": 2,
                        "room_name": "room B",
                        "disabled": 1,
                        "entries": [
                            {
                                "entry_id": 1,
                                "room_name": "room B",
                                "start_time": 1728354600,
                                "end_time": 1728358200,
                                "entry_name": "测试30分钟需求",
                                "book_by": "张测试",
                                "status": 2, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "10",
                                "day": "08",
                                "week": "Tuesday",
                                "duration": "10:30AM-11:30AM"
                            },
                            {
                                "entry_id": 10,
                                "room_name": "room B",
                                "start_time": 1728369000,
                                "end_time": 1728372600,
                                "entry_name": "季度会议",
                                "book_by": "王四",
                                "status": 0, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "10",
                                "day": "08",
                                "week": "Tuesday",
                                "duration": "02:30PM-03:30PM"
                            },
                            {
                                "entry_id": 11,
                                "room_name": "room B",
                                "start_time": 1728374400,
                                "end_time": 1728376200,
                                "entry_name": "张三",
                                "book_by": "张小儿",
                                "status": 0, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "10",
                                "day": "08",
                                "week": "Tuesday",
                                "duration": "04:00PM-04:30PM"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}