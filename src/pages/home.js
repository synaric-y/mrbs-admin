
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
        "min_time": "08:00 AM",
        "max_time": "09:00 PM",
        "time": "02:55 PM September 02, 2024",
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
                                "start_time": 1725249600,
                                "end_time": 1725253200,
                                "entry_name": "entry1",
                                "book_by": "zhang",
                                "status": 0, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "09",
                                "day": "03",
                                "week": "Thursday",
                                "duration": "12:00 PM-01:00 PM"                               
                            },
                            {
                                "entry_id": 2,
                                "start_time": 1725271200,
                                "end_time": 1725276600,
                                "entry_name": "entry1",
                                "book_by": "zhang",
                                "status": 0, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "09",
                                "day": "03",
                                "week": "Thursday",
                                "duration": "18:00 PM-19:30 PM"           
                            }
                        ]
                    },

                    {
                        "room_id": 2,
                        "room_name": "room B",
                        "entries": [
                            {
                                "entry_id": 1,
                                "start_time": 1725258600,
                                "end_time": 1725262200,
                                "entry_name": "entry1",
                                "book_by": "zhang",
                                "status": 0, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "09",
                                "day": "12",
                                "week": "Monday",
                                "duration": "02:30 PM-03:30 PM"                               
                            },
                            {
                                "entry_id": 2,
                                "start_time": 1725264000,
                                "end_time": 1725265800,
                                "entry_name": "entry1",
                                "book_by": "zhang",
                                "status": 0, //0表示未开始，1表示进行中，2表示已结束
                                "year": "2024",
                                "month": "09",
                                "day": "02",
                                "week": "Monday",
                                "duration": "04:00 PM-04:30 PM"           
                            }
                        ]
                    }
                ]
            }
        ]
    }
}