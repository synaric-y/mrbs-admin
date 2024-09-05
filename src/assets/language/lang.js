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
            userManagement: '用户管理',
            add: '+ 添加',
            plzSelect: '请选择',
            confirm: '确定',
            cancel: '取消',
            logout: '登出',

            exchange: 'Exchange',
            wxwork: '企业微信',

            editSuccess: '编辑成功',
            editFailed: '编辑失败',
            noDataHint: '该设置不能为空',
            mustNumberHint: '该设置必须为数字',
            getAreaError: '获取区域房间异常，请检查相关配置',
            selectDateError: '选择时间跨度不能超过一个月',
            loginError: '账号或密码不正确',
            editError: '编辑失败'
        },
        meet: {
            title: '编辑会议',
            admin: '创建人',
            booker: '预约人',
            short_desc: '简要说明',
            all_desc: '完整说明',
            start_meet: '起始',
            end_meet: '结束',
            room: '房间',
            type: '类型',
            delete_meet: '删除',
            addMeet: '添加会议',
            editMeet: '编辑会议'
        },
        login: {
            account: '账号',
            password: '密码',
            accountPH: '用户名 / 邮箱',
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
                useExchange: '是否启用Exchange',
                exchangeServer: 'Exchange服务地址',
                useWxwork: '是否启用企业微信',
                wxworkCorpId: '企业微信CorpId',
                wxworkSecret: '企业微信Secret',
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
                useExchange: '当前区域是否启用Exchange',
                exchangeUsername: 'Exchange账号',
                exchangePassword: 'Exchange密码',
                useWxwork: '当前区域是否启用企业微信',
                wxworkMRiD: '企业微信会议室ID',
            },
            addRoom: '添加会议室',
            editRoom: '编辑会议室',
            deleteRoomHint: '确定删除该会议室吗',
            invalidCapacity: '必须为大于0的整数',
        },
        user: {
            tableUser: {
                name: '登录名',
                displayName: '展示名',
                level: '权限',
                email: 'Email地址',
                updateTime: '最近更新',
                loginTime: '最近登录',
                operate: '操作',
            },
            formUser: {
                name: 'Name',
                displayName: 'Display Name',
                level: 'Level',
                email: 'Email',
                password0: 'Password',
                password1: 'Confirm Password'
            },
            role: {
                level0: '无',
                level1: '用户',
                level2: '管理员'
            },
            addUser: '新增用户',
            editUser: '编辑用户',
            deleteUserHint: '确定要删除当前用户吗',
            password1Hint: '两次输入的密码不一致',
        }
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
            userManagement: 'User Management',
            add: '+ Add',
            plzSelect: 'Select',
            confirm: 'Confirm',
            cancel: 'Cancel',
            logout: 'Logout',

            exchange: 'Exchange',
            wxwork: 'Wxwork',

            editSuccess: 'Edited successfully',
            editFailed: 'Edit failed',
            noDataHint: 'Cannot be empty',
            mustNumberHint: 'Must be a number',
            getAreaError: 'The regional room is abnormal, please check the relevant configuration',
            selectDateError: 'The selected time span cannot exceed one month',
            loginError: 'The username or password is incorrect',
            editError: 'Edit error'
        },
        meet: {
            title: 'Editing Meetings',
            admin: 'Creator',
            booker: 'Booker',
            short_desc: 'Brief Description',
            all_desc: 'Full description',
            start_meet: 'Start',
            end_meet: 'End',
            room: 'Room',
            type: 'Type',
            delete_meet: 'Delete',
            addMeet: 'New Meet',
            editMeet: 'Edit Meet'
        },
        login: {
            account: 'Account',
            password: 'Password',
            accountPH: 'Username / E-Mail',
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
                useExchange: 'Enable Exchange',
                exchangeServer: 'Exchange Server',
                useWxwork: 'Enable Wxwork',
                wxworkCorpId: 'Wxwork CorpId',
                wxworkSecret: 'Wxwork Secret',
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
                useExchange: 'Enabled In This Area',
                exchangeUsername: 'Exchange Account',
                exchangePassword: 'Exchange Password',
                useWxwork: 'Enabled In This Area',
                wxworkMRiD: 'Wxwork Meeting Room ID',
            },
            addRoom: 'New Room',
            editRoom: 'Edit Room',
            deleteRoomHint: 'Are you sure you want to delete this room?',
            invalidCapacity: '必须为大于0的整数',
        },
        user: {
            tableUser: {
                name: 'Name',
                displayName: 'Display Name',
                level: 'Level',
                email: 'Email',
                updateTime: 'Update Time',
                loginTime: 'Login Time',
                operate: 'Operate',
            },
            formUser: {
                name: 'Name',
                displayName: 'Display Name',
                level: 'Level',
                email: 'Email',
                password0: 'Password',
                password1: 'Confirm Password'
            },
            role: {
                level0: 'None',
                level1: 'User',
                level2: 'Admin'
            },
            addUser: 'New User',
            editUser: 'Edit User',
            deleteUserHint: 'Are you sure you want to delete this user?',
            password1Hint: 'The passwords are inconsistent',
        }
    }
}
