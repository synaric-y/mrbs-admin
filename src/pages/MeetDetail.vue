<template>
    <el-container class="container-sub-page">
        <el-scrollbar class="scroll-table-view" always>
            <el-main class="container-sub-page-main">
                <div class="sub-title-wrapper" style="height: 20 + 'px';">
                    <!-- <div class="sub-title">{{ mode === "add" ? $t("area.addArea") : $t("area.editArea") }}</div> -->
                    <div class="sub-title">{{ $t("meet.title") }}</div>
                </div>
                <el-form :model="form" :rules="rules" label-width="auto" ref="meetForm" style="min-width: 430px">
                    <el-form-item prop="create_by" :label="$t('meet.admin')"  style="width: 400px">
                        <el-select v-model="form.create_by">
                            <el-option v-for="(admin, index) in admins" :label="admin" :value="admin"
                                :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="book_by" :label="$t('meet.booker')" style="width: 400px">
                        <el-input v-model="form.book_by" />
                    </el-form-item>
                    <el-form-item prop="name" :label="$t('meet.short_desc')"  style="width: 400px">
                        <el-input v-model="form.name" />
                    </el-form-item>
                    <el-form-item prop="description" :label="$t('meet.all_desc')"  style="width: 400px">
                        <el-input type="textarea" maxlength="100" show-word-limit
                            v-model="form.description" />
                    </el-form-item>
                    <el-form-item prop="start_date" :label="$t('meet.start_meet')">
                        <div class="picker-date-container">
                            <el-date-picker v-model="form.start_date" type="date" placeholder="Pick start day"
                                @change="choseDate(0, $event)" />
                            <el-time-select v-model="form.start_hour" style="width: 240px;margin-left: 20px"
                                start="06:00" step="00:30" end="21:30" :placeholder="$t('base.plzSelect')"
                                @change="choseHour(0, form.start_hour, $event)" />
                        </div>
                    </el-form-item>
                    <el-form-item prop="end_date" :label="$t('meet.end_meet')">
                        <div class="picker-date-container">
                            <el-date-picker v-model="form.end_date" type="date" placeholder="Pick end day"
                                @change="choseDate(1, $event)" />
                            <el-time-select v-model="form.end_hour" style="width: 240px;margin-left: 20px" start="06:00"
                                step="00:30" end="21:30" :placeholder="$t('base.plzSelect')"
                                @change="choseHour(1, form.end_hour, $event)" />
                        </div>
                    </el-form-item>
                    <el-form-item prop="room_number" :label="$t('meet.room')">
                        <el-select v-model="form.room_number" style="width: 240px" :placeholder="$t('base.plzSelect')"
                            @change="choseRoom">
                            <el-option v-for="(room, index) in rooms" :label="room.room_name" :value="room.room_id"
                                :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="type" :label="$t('meet.type')">
                        <el-select v-model="form.type" style="width: 240px" :placeholder="$t('base.plzSelect')">
                            <el-option v-for="item in meet_types" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-top: 20px">
                        <el-button type="info" size="default" @click="cancle">{{ $t("base.cancel") }}</el-button>
                        <el-button type="danger" size="default" @click="deleteMeet">{{ $t("meet.delete_meet")
                            }}</el-button>
                        <el-button type="primary" size="default" @click="submit">{{ $t("base.confirm") }}</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-scrollbar>
    </el-container>
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

export default {
    mixins: [PageMixin],
    data() {
        return {
            mode: 'update',
            rooms: [],
            admins: [],
            meet_types: ["I", "E"],
            oneMeet: {},
            form: {
                create_by: "",
                admins: [],
                book_by: "",
                name: "",
                description: "",
                room_number: "",
                type: "",
                start_date: "",
                start_hour: "",
                start_seconds: 0,
                end_seconds: 0,
                end_date: "",
                end_hour: "",
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
            console.log('submit meetForm', this.form)
            this.$refs.meetForm.validate((pass) => {
                if (!pass) {
                    return
                }
                // this.form["sort_key"] = this.form["area_name"]
                // 编辑或者新增会议
                Api.editMeet(this.form).then(data => {
                    ElMessage({
                        message: this.$t('base.editSuccess'),
                        type: 'success',
                    })
                    this.back()
                }).catch(() => {
                    ElMessage.error(this.$t('editFailed'))
                })
            })
        },
        cancle() {
            console.log('cancle')
            this.back()
        },
        deleteMeet() {
            console.log('deleteMeet')
            Api.deleteMeet({ entry_id: Number(id) }).then(data => {
                ElMessage({
                    message: this.$t('base.editSuccess'),
                    type: 'success',
                })
                this.back()
            }).catch(() => {
                ElMessage.error(this.$t('editFailed'))
            })
        },

        choseDate(mode, e) {
            console.log('choseDate e', e)
            if (mode == 0) {
                this.form.start_date = moment(e[0]).format('YYYY-MM-DD');
                return
            }
            this.form.end_date = moment(e[0]).format('YYYY-MM-DD');
        },

        choseHour(mode, str, e) {
            if (mode == 0) {
                this.form.start_seconds = Common.getTimestampForTodayWithTime(str);
                return
            }
            this.form.end_seconds = Common.getTimestampForTodayWithTime(str);
        },

        choseRoom(room) {
            console.log('choseRoom room', room)
            this.form.rooms = []
            this.form.rooms.push(room)
        },

        formatTime(hours, minutes) {
            let date = new Date(0, 0, 0, hours, minutes, 0);
            return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        }
    },
    mounted() {
        let { id, room_id, room_name, timestamp, area_id } = this.$route.params
        // room_name = decodeURIComponent(room_name)
        // timestamp = decodeURIComponent(timestamp)
        console.log('meetDetail mounted id room_id  area_id ', id, room_id, area_id)
        Api.getAdmins().then(data => {
            if (!data) {
                return
            }
            console.log('getAdmins data', data)
            this.admins = data
        })

        if (area_id) {
            Api.getAreaRooms({ id: Number(area_id) }).then(data => {
                if (!data) {
                    return
                }
                console.log('mounted getAreaRooms data', data)
                this.form.rooms = data.areas[0].rooms
                this.rooms = data.areas[0].rooms
                const roomName = data.areas[0].rooms.filter(room => room.room_id == room_id)
                this.form.room_number = roomName.room_name
                console.log('get roomName', roomName)
            })
        }

        if (!id || id == 0) {
            return
        }
        Api.getMeetDetail({ id: Number(id) }).then(data => {
            if (!data) {
                return
            }
            this.form.create_by = data.create_by
            this.form.book_by = data.book_by
            this.form.name = data.name
            this.form.description = data.description
            this.form.type = data.type
            const start_time = data.start_time
            const end_time = data.end_time
            this.form.start_date = moment(start_time).format('YYYY-MM-DD')
            this.form.end_date = moment(end_time).format('YYYY-MM-DD')
            this.form.start_seconds = moment(start_time).format("hh:mm")
            this.form.end_seconds = moment(end_time).format("hh:mm")
            this.form.start_hour = moment(start_time).format("hh:mm")
            this.form.end_hour = moment(end_time).format("hh:mm")
            this.form.rooms = []
            this.form.rooms.push(data.room_id)
            this.form.room_number = data.room_name
            console.log('start_time y-m-d', start_time, moment(start_time).format('YYYY-MM-DD'))
            console.log('end_time y-m-d', end_time, moment(end_time).format('YYYY-MM-DD'))
            console.log('this.form', this.form)
            console.log('getMeetDetail data', data)
        })

    }
}
</script>

<style scoped>

/*内容页容器*/
.container-sub-page {
  width: 100vw;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
}

/*内容页main部分*/
.container-sub-page-main {
  min-width: 930px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
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