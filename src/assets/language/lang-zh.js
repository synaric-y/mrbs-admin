export const langZh = {
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
        add2: '添加',
        plzSelect: '请选择',
        submit: '提交',
        confirm: '确定',
        cancel: '取消',
        logout: '登出',
        search: '查询',
        detail: '查看',
        delete: '删除',
        generate: '生成',
        copy: '复制',
        resetPassword: '重置密码',
        exchange: 'Exchange',
        wxwork: '企业微信',
        editSuccess: '编辑成功',
        editFailed: '编辑失败',
        noDataHint: '该设置不能为空',
        mustNumberHint: '该设置必须为数字',
        getAreaError: '获取区域房间异常，请检查相关配置',
        selectDateError: '选择时间跨度不能超过一个月',
        loginError: '账号或密码不正确',
        editError: '编辑失败',
        today: '今天',
        threeDays: '三天',
        week: '周',
        startDate: '开始',
        endDate: '结束',
        to: '-',
        allAreas: '所有区域',
        getMeetRoomError:'获取会议信息异常',
        deleteSuccess: '删除会议成功',
        deleteError: '删除会议失败',
        all: '所有',
        roomDisabled: '房间禁用',
        roomAbled: '可预约会议',
        normalUser: '普通用户',
        passTime:'已过时',
        passTimeError: '不能选择已过去的时间',
        loginoutUser: '未登录状态',
        minMinuteTitle: '(15分钟)',
        userSync: '用户同步',
        tableBottomCount: '共{count}条',
        enabled: '正常',
        disabled: '禁用',
        copiedToClipboard: '已复制到剪贴板',
        none: '无',
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
        editMeet: '编辑会议',
        tips: '提示',
        deleteTips: '确认要删除当前会议！',

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
            timeDuration: '间隔时间',
        },
        addArea: '添加区域',
        editArea: '编辑区域',
        deleteAreaHint: '确定删除该区域吗',
        allArea: '全部区域',
        deniedDeleteAreaHint: '无法删除该区域，区域下仍有房间',
        deleteAreaFailed: '删除区域失败',
    },
    room: {
        tableRoom: {
            name: '名称',
            area: '区域',
            state: '状态',
            id: 'ID',
            capacity: '容纳人数',
            battery: '电量',
            operate: '操作',
        },
        formRoom: {
            name: '会议室名称',
            status: '是否启用',
            area: '区域',
            description: '说明',
            capacity: '容纳人数',
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
            id: 'ID',
            name: '账号',
            displayName: '展示名',
            level: '权限',
            email: 'Email地址',
            updateTime: '最近更新',
            loginTime: '最近登录',
            createTime: '创建时间',
            status: '状态',
            operate: '操作',
            remark: '备注',
        },
        formUser: {
            name: '账号',
            displayName: '展示名',
            level: '权限',
            email: 'Email地址',
            password0: '密码',
            password1: '确认密码'
        },
        role: {
            level0: '无',
            level1: '普通用户',
            level2: '管理员'
        },
        addUser: '新增用户',
        editUser: '编辑用户',
        deleteUser: '删除用户',
        viewUser: '查看用户',
        userList: '用户列表',
        deleteUserHint: '确定要删除当前用户吗',
        password1Hint: '两次输入的密码不一致',
        plzEnterUsernameHint: '请输入用户名称',
        plzSelectLevel: '请选择账号权限',
    }
}