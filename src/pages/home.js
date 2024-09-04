
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
        "room_name" : "Room A",
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


export const areaData = {
    "code": 0,
    "message": "success",
    "data": {
        "areas": [
            {
                "area_id": "2",
                "area_name": "Shanghai",
                "rooms": [
                    {
                        "room_id": "1",
                        "room_name": "Room A"
                    },
                    {
                        "room_id": "2",
                        "room_name": "Room B"
                    }
                ]
            },
            {
                "area_id": "3",
                "area_name": "Beijing",
                "rooms": [
                    {
                        "room_id": "3",
                        "room_name": "Room C"
                    },
                    {
                        "room_id": "4",
                        "room_name": "Room D"
                    }
                ]
            }
        ]
    }
}

export const homeData = {
    "code": 0,
    "message": "success",
    "data": {
        "min_time": "08:00 AM",
        "max_time": "09:00 PM",
        "time": "02:55 PM September 02, 2024",
        "area_room": [
            {
                "area_id": 1,
                "area_name": "area1",
                "rooms": [
                    {
                        "room_id": 1,
                        "room_name": "room A",
                        "entries": [
                            {
                                "entry_id": 1,
                                "room_name": "room A",
                                "start_time": 1725249600,
                                "end_time": 1725253200,
                                "entry_name": "entry1",
                                "book_by": "zhang",
                                "status": 0, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "09",
                                "day": "03",
                                "week": "Thursday",
                                "duration": "12:00 PM-01:00 PM"
                            },
                            {
                                "entry_id": 2,
                                "room_name": "room A",
                                "start_time": 1725271200,
                                "end_time": 1725276600,
                                "entry_name": "entry1",
                                "book_by": "zhang",
                                "status": 0, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "09",
                                "day": "03",
                                "week": "Thursday",
                                "duration": "18:00 PM-19:30 PM"
                            }
                        ]
                    },

                    {
                        "room_id": 2,
                        "room_name": "room B",
                        "entries": [
                            {
                                "entry_id": 1,
                                "room_name": "room B",
                                "start_time": 1725258600,
                                "end_time": 1725262200,
                                "entry_name": "entry1",
                                "book_by": "zhang",
                                "status": 0, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "09",
                                "day": "12",
                                "week": "Monday",
                                "duration": "02:30 PM-03:30 PM"
                            },
                            {
                                "entry_id": 2,
                                "room_name": "room B",
                                "start_time": 1725264000,
                                "end_time": 1725265800,
                                "entry_name": "entry1",
                                "book_by": "zhang",
                                "status": 0, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "09",
                                "day": "02",
                                "week": "Monday",
                                "duration": "04:00 PM-04:30 PM"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}