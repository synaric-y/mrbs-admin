
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
            deniedDeleteAreaHint: '无法删除该区域，区域下仍有房间',
            deleteAreaFailed: '删除区域失败',
        },
        room: {
            tableRoom: {
                name: '名称',
                area: '区域',
                state: '状态',
                id: 'ID',
                galleryful: '容纳人数',
                battery: '电量',
                operate: '操作',
            },
            formRoom: {
                name: '会议室名称',
                status: '是否启用',
                area: '区域',
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
                name: '账号',
                displayName: '展示名',
                level: '权限',
                email: 'Email地址',
                updateTime: '最近更新',
                loginTime: '最近登录',
                operate: '操作',
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
                level1: '用户',
                level2: '管理员'
            },
            addUser: '新增用户',
            editUser: '编辑用户',
            deleteUserHint: '确定要删除当前用户吗',
            password1Hint: '两次输入的密码不一致',
        }
    },


    ko: {
        base: {
            home: '일정',
            area: '영역',
            room: '회의실',
            user: '사용자',
            login: '로그인',
            areaManagement: '지역관리',
            roomManagement: '회의실 관리',
            userManagement: '사용자 관리',
            add: '+ 추가',
            plzSelect: '선택하세요',
            confirm: '확신하는',
            cancel: '취소',
            logout: '로그아웃',
            exchange: 'Exchange',
            wxwork: '엔터프라이즈 위챗',
            editSuccess: '수정되었습니다.',
            editFailed: '수정 실패',
            noDataHint: '이 설정은 비워둘 수 없습니다.',
            mustNumberHint: '설정은 숫자여야 합니다.',
            getAreaError: '지역실 예외를 받으려면 관련 구성을 확인하세요.',
            selectDateError: '선택한 기간은 1개월을 초과할 수 없습니다.',
            loginError: '계정이나 비밀번호가 올바르지 않습니다.',
            editError: '수정 실패',
            today: '오늘',
            threeDays: '사흘',
            week: '주',
            startDate: '시작',
            endDate: '마치다',
            to: '-',
            allAreas: '모든 지역',
            getMeetRoomError:'회의정보 입수 예외',
            deleteSuccess: '회의가 삭제되었습니다.',
            deleteError: '회의를 삭제하지 못했습니다.',
            all: '모든',
            roomDisabled: '방이 비활성화됨',
            roomAbled: '회의 예약 가능',
            normalUser: '일반 사용자',
            passTime:'구식',
            passTimeError: '과거 시간은 선택할 수 없습니다.',
        },
        meet: {
            title: '편집회의',
            admin: '창조자',
            booker: '부커',
            short_desc: '간략한 설명',
            all_desc: '전체 설명',
            start_meet: '시작',
            end_meet: '마치다',
            room: '방',
            type: '유형',
            delete_meet: '삭제',
            addMeet: '회의 추가',
            editMeet: '편집회의'
        },
        login: {
            account: '계정',
            password: '비밀번호',
            accountPH: '사용자 이름/이메일',
        },
        area: {
            tableArea: {
                name: '이름',
                state: '상태',
                id: 'ID',
                timezone: '시간대',
                admin: '관리자',
                operate: '작동하다',
            },
            formArea: {
                name: '지역 이름',
                notificationEmails: '관리자 이메일',
                timezone: '시간대',
                status: '활성화 여부',
                startOfFirstSlot: '시작 예정 시간(근무 시간)',
                startOfLastSlot: '종료 예정 시간(비근무 시간)）',
                resolution: '최소 세션 길이(분)',
                defaultDuration: '기본 회의 길이(분)',
                useExchange: 'Exchange 활성화 여부',
                exchangeServer: '교환 서비스 주소',
                useWxwork: '기업 WeChat 활성화 여부',
                wxworkCorpId: '엔터프라이즈 WeChatCorpId',
                wxworkSecret: '기업 WeChat 비밀',
            },
            addArea: '지역 추가',
            editArea: '편집 영역',
            deleteAreaHint: '이 지역을 삭제하시겠습니까?',
            allArea: '모든 지역',
            deniedDeleteAreaHint: '이 영역을 삭제할 수 없습니다. 영역 아래에 방이 있습니다',
            deleteAreaFailed: '영역 삭제 실패',
        },
        room: {
            tableRoom: {
                name: '이름',
                area: '영역',
                state: '상태',
                id: 'ID',
                galleryful: '객실 수용 인원',
                battery: '힘',
                operate: '작동하다',
            },
            formRoom: {
                name: '회의실 이름',
                area: '영역',
                status: '활성화 여부',
                description: '설명하다',
                galleryful: '용량',
                useExchange: '현재 지역에서 Exchange가 활성화되어 있는지 여부',
                exchangeUsername: '거래소 계좌',
                exchangePassword: '비밀번호 교환',
                useWxwork: '현재 지역에서 기업 WeChat이 활성화되어 있는지 여부',
                wxworkMRiD: '기업 WeChat 회의실 ID',
            },
            addRoom: '회의실 추가',
            editRoom: '회의실 편집',
            deleteRoomHint: '정말로 이 회의실을 삭제하시겠습니까?',
            invalidCapacity: '0보다 큰 정수여야 합니다.',
        },
        user: {
            tableUser: {
                name: '로그인 이름',
                displayName: '표시 이름',
                level: '권한',
                email: '이메일 주소',
                updateTime: '최신 업데이트',
                loginTime: '최근 로그인됨',
                operate: '작동하다',
            },
            formUser: {
                name: '이름',
                displayName: '표시 이름',
                level: '수준',
                email: '이메일',
                password0: '비밀번호',
                password1: '비밀번호 확인'
            },
            role: {
                level0: '없음',
                level1: '사용자',
                level2: '관리자'
            },
            addUser: '새 사용자 추가',
            editUser: '사용자 편집',
            deleteUserHint: '현재 사용자를 삭제하시겠습니까?',
            password1Hint: '두 번 입력한 비밀번호가 일치하지 않습니다.',
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
            editError: 'Edit error',
            today: 'Today',
            threeDays: '3 Days',
            week: 'Week',
            startDate: 'Start date',
            endDate: 'End date',
            to: '-',
            allAreas: 'All Areas',
            getMeetRoomError:'Obtaining conference information is abnormal',
            deleteSuccess: 'Delete meeting successfully',
            deleteError: 'Failed to delete meeting',
            all: 'All',
            roomDisabled: 'Room disabled',
            roomAbled: 'Meetings can be scheduled',
            normalUser: 'Normal User',
            passTime:'Obsolete',
            passTimeError: 'Cannot select a time that has passed',
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
            allArea: 'All Areas',
            deniedDeleteAreaHint: 'Cannot delete this area, there are still rooms under the area.',
            deleteAreaFailed: 'Failed to delete the area',
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
            invalidCapacity: 'Must be an integer greater than 0',
        },
        user: {
            tableUser: {
                name: 'Account',
                displayName: 'Display Name',
                level: 'Level',
                email: 'Email',
                updateTime: 'Update Time',
                loginTime: 'Login Time',
                operate: 'Operate',
            },
            formUser: {
                name: 'Account',
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
