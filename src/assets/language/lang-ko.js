export const langKo = {
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
        add2: '추가',
        plzSelect: '선택하세요',
        submit: '제출하다',
        confirm: '확신하는',
        cancel: '취소',
        logout: '로그아웃',
        search: '질문',
        new: '새로운',
        edit: '편집',
        detail: '세부',
        delete: '삭제',
        close: '폐쇄',
        generate: '생성하다',
        copy: '복사',
        bind: '묶다',
        unbind: '바인딩 해제',
        resetPassword: '비밀번호 재설정',
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
        getMeetRoomError: '회의정보 입수 예외',
        deleteSuccess: '회의가 삭제되었습니다.',
        deleteError: '회의를 삭제하지 못했습니다.',
        all: '모든',
        roomDisabled: '방이 비활성화됨',
        roomAbled: '회의 예약 가능',
        normalUser: '일반 사용자',
        passTime: '구식',
        passTimeError: '과거 시간은 선택할 수 없습니다.',
        loginoutUser: '로그인되지 않은 상태',
        minMinuteTitle: '(15분)',
        userSync: '사용자 동기화',
        tableBottomCount: '총 {count}개 항목',
        enabled: '활성화됨',
        disabled: '장애가 있는',
        copiedToClipboard: '클립보드에 복사됨',
        none: '없음',
        viewMore: '자세히 보기',
        singleMeet: '단일 회의',
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
        editMeet: '편집회의',
        tips: '힌트',
        deleteTips: '현재 회의 삭제 확인',
        search_create_by: '약속을 잡는 사람을 입력하세요.',
        meet_title: '역사 회의',
        not_started_meet: '시작하지 않음',
        in_progress_meet: '진행 중',
        ended_meet: '종료됨',
        yes: '예',
        no: '아니요',
        table: {
            id: '번호',
            area: '지역',
            room: '회의실',
            room_title: '회의 제목',
            start_meet: '예약 시작 시간',
            end_meet: '예약 종료 시간',
            is_repeat: '주기적인 회의 여부',
            meet_status: '회의 상태',
            creat_by: '예약자',
        },

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
            timeDuration: '간격 시간',
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
            capacity: '객실 수용 인원',
            battery: '힘',
            operate: '작동하다',
        },
        formRoom: {
            name: '회의실 이름',
            area: '영역',
            status: '활성화 여부',
            description: '설명하다',
            capacity: '용량',
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
            id: 'ID',
            name: '로그인 이름',
            displayName: '표시 이름',
            level: '권한',
            email: '이메일 주소',
            updateTime: '최신 업데이트',
            loginTime: '최근 로그인됨',
            createTime: '생성 시간',
            status: '상태',
            operate: '작동하다',
            remark: '주목',
            source: '원천',
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
        deleteUser: '사용자 삭제',
        viewUser: '사용자 보기',
        userList: '사용자 목록',
        deleteUserHint: '현재 사용자를 삭제하시겠습니까?',
        password1Hint: '두 번 입력한 비밀번호가 일치하지 않습니다.',
        plzEnterUsernameHint: '사용자 이름을 입력하세요',
        plzSelectLevel: '계정 권한을 선택하세요',
    },
    userGroup: {
        userGroup: '사용자 그룹',
        userGroupSettings: '사용자 그룹 설정',
        local: '로컬',
        fromAD: 'Active Directory 에서',
        groupMy: '나의 분리',
        groupAD: 'AD분할',
        editMember: '회원 편집',
        viewMember: '회원 보기',
        confirmDeleteUserGroup: '현재 선택된 사용자/사용자 그룹을 삭제하시겠습니까?',
        editUserGroup: '사용자 그룹 편집',
        lastSyncTime: '마지막 동기화 시간：',
        tableUserGroup: {
            name: '이름',
            syncFromAD: 'Active Directory 와 동기화',
            source: '원천',
        }
    },
    terminal: {
        terminalManage: '터미널 장치 관리',
        plzInputDeviceId: '장치 ID를 입력하세요',
        confirmUnbindHint: '현재 장치의 바인딩을 해제하시겠습니까?',
        unbindDevice: '장치 바인딩 해제',
        tableTerminal: {
            id: 'ID',
            deviceId: '장치 ID',
            version: '현재 버전',
            deviceInfo: '장치 정보',
            resolution: '화면 해상도',
            battery: '남은 배터리',
            status: '기기 실시간 상태',
            bindStatus: '바인딩 상태',
            room: '회의실 바인딩',
            setTime: '접근 시간',
        },
        bind: {
            offline: '오프라인',
            online: '온라인',
            all: '모두',
        }
    },
    setting: {
        title: 'System Setting',
        meeting_rule_setting: {
            title: 'Meeting Rule Setting'
        },
        application_setting: {
            title: 'Application Setting'
        },
        user_synchronize_setting: {
            title: 'User Synchronize'
        },
        calendar_synchronize_setting: {
            title: 'Calendar Synchronize'
        },
    }
}