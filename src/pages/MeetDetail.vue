<template>
    <el-container class="container-sub-page">
        <el-scrollbar class="scroll-table-view" always>
            <el-main class="container-sub-page-main">
                <div class="sub-title-wrapper" style="height: 20 + 'px';">
                    <div class="sub-title">{{ mode == 'update' ? $t("meet.editMeet") : $t("meet.addMeet") }}</div>
                </div>
                <el-form :model="form" :rules="rules" label-width="auto" ref="meetForm" style="min-width: 430px">
                    <el-form-item prop="create_by" :label="$t('meet.admin')" style="width: 400px">
                        <el-select v-model.trim="form.create_by" :disabled="true">
                            <el-option v-for="(admin, index) in admins" :label="admin" :value="admin"
                                :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="book_by" :label="$t('meet.booker')" style="width: 400px">
                        <el-input v-model.trim="form.book_by" maxlength="50" show-word-limit />
                    </el-form-item>
                    <el-form-item prop="name" :label="$t('meet.short_desc')" style="width: 400px">
                        <el-input v-model.trim="form.name" maxlength="50" show-word-limit />
                    </el-form-item>
                    <el-form-item prop="description" :label="$t('meet.all_desc')" style="width: 400px">
                        <el-input type="textarea" maxlength="100" show-word-limit v-model.trim="form.description" />
                    </el-form-item>
                    <el-form-item prop="start_date" :label="$t('meet.start_meet')">
                        <div class="picker-date-container">
                            <el-date-picker v-model="form.start_date" type="date" placeholder="Pick start day"
                                @change="choseDate(0, $event)" :disabled-date="disabledDate" />
                            <el-time-select v-model="start_hour" style="width: 240px;margin-left: 20px" :start="minStartTime"
                                :step="minStep" :end="maxEndTime" :placeholder="$t('base.plzSelect')"
                                @change="choseHour(0, start_hour, $event)" :min-time="currentHourMinute"/>
                        </div>
                    </el-form-item>
                    <el-form-item prop="end_date" :label="$t('meet.end_meet')">
                        <div class="picker-date-container">
                            <el-date-picker v-model="form.end_date" type="date" placeholder="Pick end day"
                                @change="choseDate(1, $event)" :disabled-date="disabledDate" />
                            <el-time-select v-model="end_hour" style="width: 240px;margin-left: 20px" :start="minStartTime"
                                :step="minStep" :end="maxEndTime" :placeholder="$t('base.plzSelect')"
                                @change="choseHour(1, end_hour, $event)" :min-time="currentHourMinute" />
                        </div>
                    </el-form-item>
                    <el-form-item prop="room_number" :label="$t('meet.room')">
                        <el-select v-model="form.room_number" style="width: 240px" :placeholder="$t('base.plzSelect')"
                            @change="choseRoom">
                            <el-option v-for="(room, index) in rooms" :label="room.room_name" :value="room.room_id"
                                :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-top: 30px;margin-left: 75px">
                        <el-button type="info" size="default" @click="cancle">{{ $t("base.cancel") }}</el-button>
                        <template v-if="mode == 'update'">
                            <el-button type="danger" size="default" @click="deleteMeet">{{ $t("meet.delete_meet")
                                }}</el-button>
                        </template>
                        <el-button type="primary" size="default" @click="submit">{{ $t("base.confirm") }}</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-scrollbar>
    </el-container>

    <el-dialog v-model="centerDialogVisible" title="Warning" width="500" center>
        <span>
            {{ $t('base.deleteTips') }}
        </span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="centerDialogVisible = false">{{ $t('base.cancel') }}</el-button>
                <el-button type="primary" @click="confirmDelete">{{ $t('base.confirm') }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script>
import moment from "moment";
import { TIMEZONE_LIST } from "@/assets/timezone.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import { ElMessage } from "element-plus";
import router from "@/router/index.js";
import { adminData, areaData, meetData } from "./home";
import { Common } from "@/common/common";
import { STORAGE } from "@/const";

export default {
    mixins: [PageMixin],
    data() {
        return {
            mode: 'add',
            rooms: [],
            admins: [],
            meetTypes: [],
            currenType: '',
            oneMeet: {},
            entry_id: 0,
            start_hour: "",
            end_hour: "",
            currentTimeZone: 'Asia/Shanghai',
            currentHourMinute: '',
            currentMinute: '',
            centerDialogVisible: false,
            currentHourM: '21:00',
            minStartTime: '06:00',
            maxEndTime: '21:00',
            minStep: '00:30',
            form: {
                id: 0,
                create_by: "",
                admins: [],
                book_by: "",
                name: "",
                description: "",
                room_number: "",
                type: "",
                start_date: "",
                start_seconds: 0,
                end_seconds: 0,
                end_date: "",
                type: 'I',
                rooms: [],
                edit_series: 0,
                rep_type: 0,
                // 不可知参数
                all_day: "",
                original_room_id: null,
                ical_uid: "",
                ical_sequence: 1,
                ical_recur_id: "",
                allow_registration: "",
                registrant_limit: 10,
                registrant_limit_enabled: "1",
                registration_opens_value: 1,
                registration_open_units: "",
                registration_open_enabled: "",
                registration_closes_value: 1,
                registration_closes_units: "",
                registration_closes_enabled: "",
                rep_id: null,
                edit_series: 0,
                rep_type: 0,
                rep_end_date: "",
                rep_day: [],
                rep_interval: 1,
                month_type: 0,
                month_absolute: 2,
                month_relative_ord: "",
                month_relative_day: "",
                skip: 1,
                no_mail: 1,
                private: ""
            },
            rules: {
                create_by: [
                    { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
                ],
                book_by: [
                    { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
                ],
                name: [
                    { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
                ],
                description: [
                    { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
                ],
                room_number: [
                    { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
                ],
                type: [
                    { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
                ],
                start_date: [
                    { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
                ],
                start_hour: [
                    { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
                ],
                end_date: [
                    { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
                ],
                end_hour: [
                    { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        submit() {
            console.log('Meet Detail submit meetForm', this.form)
            this.$refs.meetForm.validate((pass) => {
                if (!pass) {
                    return
                }
                Api.editMeet(this.form).then(({ data, code, msg }) => {
                    if (code == 0) {
                        ElMessage({
                            message: this.$t('base.editSuccess'),
                            type: 'success',
                        })
                        this.back()
                    } else {
                        ElMessage({
                            message: msg,
                            type: 'error',
                        })
                    }
                }).catch(() => {
                    ElMessage.error(this.$t('editFailed'))
                })
            })
        },

        getNearestHalfHour() {
            const now = new Date();
            let currentHour = now.getHours();
            let currentMinute = now.getMinutes();
            if (currentMinute < 15) {
                currentMinute = '00';
            } else if (currentMinute < 30) {
                currentMinute = '15';
            } else if (currentMinute <= 45) {
                currentMinute = '30';
            } else if (currentMinute <= 59) {
                currentMinute = '45';
            } else {
                currentMinute = '00';
            }
            const formattedHour = String(currentHour).padStart(2, '0');
            const formattedMinute = currentMinute;
            return `${formattedHour}:${formattedMinute}`;
        },

        disabledDate(time) {
            return time.getTime() < Date.now() - 86400000;
        },
        cancle() {
            console.log('Meet Detail cancle')
            this.back()
        },

        deleteMeet() {
            this.centerDialogVisible = true
        },

        confirmDelete() {
            Api.deleteMeet({ entry_id: Number(this.entry_id) }).then(({ data, code, msg }) => {
                if (code == 0) {
                    ElMessage({
                        message: this.$t('base.deleteSuccess'),
                        type: 'success',
                    })
                    this.back()
                } else {
                    ElMessage.error(message)
                }

            }).catch(() => {
                ElMessage.error(this.$t('deleteError'))
            })
        },

        choseDate(mode, e) {
            console.log('Meet Detail choseDate e', e)
            const date = moment.tz(e, this.currentTimeZone).format('YYYY-MM-DD')
            const newDate = moment.tz(this.form.start_date, this.currentTimeZone).format('YYYY-MM-DD')
            console.log('Meet Detail choseDate date', date,newDate )
            if (date != newDate) {
                this.currentHourMinute = '03:00'
            } else {
                this.currentHourMinute = this.getNearestHalfHour()
            }
            if (mode == 0) {
                this.form.start_date = date
                this.form.end_date = date
                return
            }
            this.form.start_date = date
            this.form.end_date = date
        },

        choseHour(mode, str, e) {
            console.log('Meet Detail choseHour str e', str, e)
            const ymd = this.form.start_date
            const lang = Common.getLocalLang()
            const appeedStr = ymd + ' ' + str
            const formatStr = Common.getAssignFormat(appeedStr, lang)
            console.log('Meet choseHour this.currentTimeZone lang appeedStr', this.currentTimeZone, lang, appeedStr)
            const nextTimeStamp = moment.tz(formatStr, this.currentTimeZone).unix();
            console.log('Meet choseHour formatStr nextTimeStamp ', formatStr, nextTimeStamp)
            if (mode == 0) {
                const currenDay = Common.getYearToDay()
                const currenStamp = Common.getCurrenTimeZoneStamp(this.currentTimeZone)
                if (currenDay == ymd && currenStamp > nextTimeStamp) {
                    ElMessage({
                        message: this.$t('base.passTimeError'),
                        type: 'warning',
                    })
                    this.form.start_seconds = 0
                    this.start_hour = ''
                    return
                }
                this.form.start_seconds = nextTimeStamp;
                return
            }
            this.form.end_seconds = nextTimeStamp;
        },

        choseRoom(room) {
            console.log('Meet Detail choseRoom room', room)
            this.form.rooms = []
            this.form.rooms.push(Number(room))
        },

        formatTime(hours, minutes) {
            let date = new Date(0, 0, 0, hours, minutes, 0);
            return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        },

        editData(data) {
            this.form.create_by = data.create_by
            this.form.book_by = data.book_by
            this.form.name = data.name
            this.form.description = data.description
            this.form.type = data.type
            const start_time = data.start_time * 1000
            const end_time = data.end_time * 1000
            this.form.start_date = moment.tz(start_time, this.currentTimeZone).format('YYYY-MM-DD')
            this.form.end_date = moment.tz(end_time, this.currentTimeZone).format('YYYY-MM-DD')
            this.form.start_seconds = data.start_time
            this.form.end_seconds = data.end_time
            this.start_hour = moment.tz(start_time, this.currentTimeZone).format("HH:mm")
            this.end_hour = moment.tz(end_time, this.currentTimeZone).format("HH:mm")
            console.log('Meet editData start_hour', this.start_hour)
            console.log('Meet editData end_hour', this.end_hour)
            this.form.rooms = []
            this.form.rooms.push(Number(data.room_id))
            this.form.id = data.id
            this.form.room_number = data.room_name
        },

        editTime(timestamp) {
            console.log('Meet Detail editTime timestamp', timestamp)
            if (timestamp > 0) {
                console.log('Meet Detail mounted timestamp begin', timestamp)
                const starttimestamp = moment.tz(timestamp * 1000, this.currentTimeZone).format('HH:mm')
                this.start_hour = starttimestamp
                this.form.start_seconds = timestamp
                const endstamp = Number(timestamp) + 30 * 60
                console.log('Meet Detail mounted timestamp endstamp', endstamp)
                this.end_hour = moment.tz(endstamp * 1000, this.currentTimeZone).format('HH:mm')
                this.form.end_seconds = endstamp
                console.log('Meet Detail mounted timestamp end', timestamp)
                this.form.start_date = moment.tz(timestamp * 1000, this.currentTimeZone).format('YYYY-MM-DD')
                this.form.end_date = moment.tz(timestamp * 1000, this.currentTimeZone).format('YYYY-MM-DD')
            }
        },

        configMeetTypes(type) {
            const lang = Common.getLocalLang()
            if (lang == 'en') {
                this.meetTypes = {
                    I: 'Internal meeting',
                    E: 'External meeting'
                }
            } else if (lang == 'ko') {
                this.meetTypes = {
                    I: '내부 회의',
                    E: '외부 회의'
                }
            } else {
                this.meetTypes = {
                    I: '内部会议',
                    E: '外部会议'
                }
            }
            this.form.type = this.meetTypes[type];
        },
    },
    mounted() {
        const userinfo = JSON.parse(localStorage.getItem(STORAGE.USER_INFO))
        if (userinfo) {
            console.log('Meet Detail mounted  userinfo', userinfo)
            this.form.create_by = userinfo.username
        }
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        this.currentTimeZone = timeZone
        let { id, room_id, timestamp, area_id, entry_id } = this.$route.params
        this.editTime(timestamp)
        if (room_id != 0) {
            this.form.rooms.push(Number(room_id))
        }
        this.configMeetTypes()
        if (id != 0) {
            this.entry_id = id
            this.form.id = id
            this.mode = 'update'
        }
        Api.getAdmins().then(({ data, code }) => {
            if (!data) {
                return
            }
            this.admins = data
        })

        if (area_id) {
            Api.getAreaRooms({ id: Number(area_id) }).then(({ data, code }) => {
                if (!data) {
                    return
                }
                console.log('Meet Detail getAreaRooms data',data)
                this.rooms = data.areas.rooms
                const roomName = data.areas.rooms.filter(room => room.room_id == room_id)
                this.form.room_number = roomName[0].room_name
                if (data.areas.resolution == '900') {
                    this.minStep = '00:15'
                }

                if (data.areas.end_time) {
                    const result = Common.formatAMPMTo24(data.areas.end_time)
                    console.log('Meet Detail formatAMPMTo24 result',result)
                    this.maxEndTime = result
                }

                if (data.areas.start_time) {
                    const startTime = data.areas.start_time
                    const [hourstr, amstr] = startTime.split(' ')
                    console.log('Meet Detail formatAMPMTo24 startTime hourstr amstr',startTime,hourstr,amstr)
                    this.minStartTime = hourstr
                }
            })
        }

        this.currentHourMinute = this.getNearestHalfHour()
        console.log('Meet Detail currentHourMinute',this.currentHourMinute)
        if (!id || id == 0) {
            return
        }
        Api.getMeetDetail({ id: Number(this.entry_id) }).then(({ data, code }) => {
            if (!data) {
                return
            }
            console.log('Meet Detail getMeetDetail data', data)
            this.editData(data)
        })
    }
}
</script>

<style scoped>
.container-sub-page {
    width: 100vw;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    align-items: center;
}

.container-sub-page-main {
    margin-left: 30px;
    min-width: 930px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.sub-title-wrapper {
    margin-left: 30px;
}

.picker-date-container {
    display: flex;
    flex-direction: row;
}

.scroll-table-view {
    width: 100%;
    height: 800px;
}
</style>