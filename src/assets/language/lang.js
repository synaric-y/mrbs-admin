export const messages = {

    zh: {
        base: {
            home: '日程',
            area: '区域',
            room: '会议室',
            user: '用户',
            login: '登录',
            areaManagement: '区域管理',
            roomManagement: '会议室管理',
            add: '+ 添加',
            plzSelect: '请选择',
            confirm: '确定',
            cancel: '取消',

            exchange: 'Exchange',
            wxwork: '企业微信',

            editSuccess: '编辑成功',
            editFailed: '编辑失败',
            noDataHint: '该设置不能为空',
            mustNumberHint: '该设置必须为数字'
        },
        login: {
            account: '账号',
            password: '密码',
            accountPH: '用户名/邮箱',
        },
        area: {
            tableArea: {
                name: '名称',
                state: '状态',
                id: 'ID',
                timezone: '时区',
                admin: '管理员',
                operate: '操作',
            },
            formArea: {
                name: '区域名称',
                notificationEmails: '管理员邮箱',
                timezone: '时区',
                status: '是否启用',
                startOfFirstSlot: '预定起始时间（上班时间）',
                startOfLastSlot: '预定终止时间（下班时间）',
                resolution: '最小时段时长 (分钟)',
                defaultDuration: '默认会议时长 (分钟)',
            },
            addArea: '添加区域',
            editArea: '编辑区域',
            deleteAreaHint: '确定删除该区域吗',
            allArea: '全部区域',
        },
        room: {
            tableRoom: {
                name: '名称',
                area: '区域',
                state: '状态',
                id: 'ID',
                galleryful: '房间容量',
                battery: '电量',
                operate: '操作',
            },
            formRoom: {
                name: '会议室名称',
                status: '是否启用',
                description: '说明',
                galleryful: '容纳人数',
                useExchange: '是否启用Exchange',
                exchangeUsername: 'Exchange账号',
                exchangePassword: 'Exchange密码',
                useWxwork: '是否启用企业微信',
                wxworkMRiD: '企业微信会议室ID',
            },
            addRoom: '添加会议室',
            editRoom: '编辑会议室',
            deleteRoomHint: '确定删除该会议室吗',
            invalidCapacity: '必须为大于0的整数',
        },
    },

    en: {
        base: {
            home: 'Agenda',
            area: 'Area',
            room: 'Room',
            user: 'User',
            login: 'Login',
            areaManagement: 'Area Management',
            roomManagement: 'Room Management',
            add: '+ Add',
            plzSelect: 'Select',
            confirm: 'Confirm',
            cancel: 'Cancel',

            exchange: 'Exchange',
            wxwork: 'Wxwork',

            editSuccess: 'Edited successfully',
            editFailed: 'Edit failed',
            noDataHint: 'Cannot be empty',
            mustNumberHint: 'Must be a number'
        },
        login: {
            account: 'Account',
            password: 'Password',
            accountPH: 'Username/E-Mail',
        },
        area: {
            tableArea: {
                name: 'Name',
                state: 'Enable',
                id: 'ID',
                timezone: 'Timezone',
                admin: 'Admin',
                operate: 'Operate',
            },
            formArea: {
                name: 'Name',
                notificationEmails: 'Notification emails',
                timezone: 'Timezone',
                status: 'Enable',
                startOfFirstSlot: 'Start of first slot',
                startOfLastSlot: 'Start of last slot',
                resolution: 'Resolution (minutes)',
                defaultDuration: 'Default duration (minutes)',
            },
            addArea: 'New Area',
            editArea: 'Edit Area',
            deleteAreaHint: 'Are you sure you want to delete this area?',
            allArea: '全部区域',
        },
        room: {
            tableRoom: {
                name: 'Name',
                state: 'Enable',
                id: 'ID',
                galleryful: 'Galleryful',
                battery: 'Battery',
                operate: 'Operate',
            },
            formRoom: {
                name: 'Name',
                area: 'Area',
                status: 'Enable',
                description: 'Description',
                galleryful: 'Galleryful',
                useExchange: 'Enable Exchange',
                exchangeUsername: 'Exchange Account',
                exchangePassword: 'Exchange Password',
                useWxwork: 'Enable Wxwork',
                wxworkMRiD: 'Wxwork Meeting Room ID',
            },
            addRoom: 'New Room',
            editRoom: 'Edit Room',
            deleteRoomHint: 'Are you sure you want to delete this room?',
            invalidCapacity: '必须为大于0的整数',
        },
    }
}
