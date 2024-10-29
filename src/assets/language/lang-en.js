export const langEn = {
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
        add2: 'Add',
        plzSelect: 'Select',
        submit: 'Submit',
        confirm: 'Confirm',
        cancel: 'Cancel',
        logout: 'Logout',
        search: 'Search',
        new: 'New',
        edit: 'Edit',
        detail: 'Detail',
        delete: 'Delete',
        generate: 'Generate',
        copy: 'Copy',
        resetPassword: 'Reset Password',
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
        loginoutUser: 'Not logged in',
        minMinuteTitle: '(15 minutes)',
        userSync: 'Sync Users',
        tableBottomCount: '{count} items in total',
        enabled: 'Enabled',
        disabled: 'Disabled',
        copiedToClipboard: 'Copied to clipboard',
        none: 'None',
        viewMore: 'More',
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
        editMeet: 'Edit Meet',
        tips: 'Tips',
        deleteTips: 'Confirm that you want to delete the current meeting',
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
            timeDuration: 'Interval Time',
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
            capacity: 'Capacity',
            battery: 'Battery',
            operate: 'Operate',
        },
        formRoom: {
            name: 'Name',
            area: 'Area',
            status: 'Enable',
            description: 'Description',
            capacity: 'Capacity',
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
            id: 'ID',
            name: 'Account',
            displayName: 'Display Name',
            level: 'Level',
            email: 'Email',
            updateTime: 'Update Time',
            loginTime: 'Login Time',
            createTime: 'Create Time',
            status: 'Status',
            operate: 'Operate',
            remark: 'Remark',
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
        deleteUser: 'Delete User',
        viewUser: 'View User',
        userList: 'Users',
        deleteUserHint: 'Are you sure you want to delete this user?',
        password1Hint: 'The passwords are inconsistent',
        plzEnterUsernameHint: 'Enter username',
        plzSelectLevel: 'Select account level',
    },
    userGroup: {
        userGroup: 'User Group',
        userGroupSettings: 'User Group Settings',
        local: 'Local',
        fromAD: 'From Active Directory',
        editMember: 'Edit Member',
        confirmDeleteUserGroup: 'Delete the currently selected user/user group?',
        editUserGroup: 'Edit User Group',
        lastSyncTime: 'Last sync time：',
        tableUserGroup: {
            name: 'Name',
            syncFromAD: 'Sync from Active Directory',
            source: 'Source',
        }
    }
}