<template>
    <el-container class="container-sub-page">
        <el-main class="container-sub-page-main">
            <div class="sub-title-wrapper">
                <!-- <div class="sub-title">{{ mode === "add" ? $t("area.addArea") : $t("area.editArea") }}</div> -->
                <div class="sub-title">{{ $t("meet.title") }}</div>
            </div>

            <el-form :model="form" :rules="rules" label-width="auto" ref="meetForm" style="max-width: 530px">

                <el-form-item prop="creat_by" :label="$t('meet.admin')">
                    <el-select v-model="form.creat_by" />
                </el-form-item>

                <el-form-item prop="book_by" :label="$t('meet.booker')">
                    <el-input v-model="form.book_by" />
                </el-form-item>

                <el-form-item prop="short_desc" :label="$t('meet.short_desc')">
                    <el-input v-model="form.short_desc" />
                </el-form-item>

                <el-form-item prop="remark_desc" :label="$t('meet.all_desc')">
                    <el-input style="width: 240px" type="textarea" maxlength="100" show-word-limit
                        v-model="form.remark_desc" />
                </el-form-item>

                <el-form-item prop="start_date" :label="$t('meet.start_meet')">
                    <div class="picker-date-container">
                        <el-date-picker v-model="form.start_date" type="date" placeholder="Pick a day" />
                        <el-time-select v-model="form.start_hour" style="width: 240px;margin-left: 20px" start="06:00"
                            step="00:30" end="21:30" :placeholder="$t('base.plzSelect')" />
                    </div>
                </el-form-item>

                <el-form-item prop="end_date" :label="$t('meet.end_meet')">
                    <div class="picker-date-container">
                        <el-date-picker v-model="form.end_date" type="date" placeholder="Pick a day" />
                        <el-time-select v-model="form.end_hour" style="width: 240px;margin-left: 20px" start="06:00"
                            step="00:30" end="21:30" :placeholder="$t('base.plzSelect')" />
                    </div>
                </el-form-item>

                <el-form-item prop="room_number" :label="$t('meet.room')">
                    <el-select v-model="form.room_number" style="width: 240px" :placeholder="$t('base.plzSelect')" />
                </el-form-item>

                <el-form-item prop="type" :label="$t('meet.type')">
                    <el-select v-model="form.room_type" style="width: 240px" :placeholder="$t('base.plzSelect')">
                        <el-option v-for="item in form.meet_types" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>

                <el-form-item style="margin-top: 60px">
                    <el-button type="info" size="default" @click="cancle">{{ $t("base.cancel") }}</el-button>
                    <el-button type="danger" size="default" @click="deleteMeet">{{ $t("meet.delete_meet") }}</el-button>
                    <el-button type="primary" size="default" @click="submit">{{ $t("base.confirm") }}</el-button>
                </el-form-item>

            </el-form>
        </el-main>
    </el-container>
</template>

<script>
import moment from "moment";
import { TIMEZONE_LIST } from "@/assets/timezone.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import { ElMessage } from "element-plus";
import router from "@/router/index.js";

export default {
    mixins: [PageMixin],
    data() {
        return {
            mode: 'update',
            form: {

                creat_by: "",
                admins: [],
                book_by: "",
                short_desc: "",
                remark_desc: "",
                room_number: "",
                room_type: "",

                start_date: "",
                start_hour: "",

                end_date: "",
                end_hour: "",

                meet_types: ["I", "E"],

                area_name: "",
                sort_key: "",
                area_disabled: 0,
                area_timezone: "",
                area_start_first_slot: "",
                area_start_last_slot: "",
                area_def_duration_mins: 60,
                area_res_mins: 30,
                area_default_type: "I",
                area_periods: ["Period 1", "Period 2"],

            },
            rules: {
                creat_by: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }],
                book_by: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }],
                short_desc: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }],
                remark_desc: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }],
                room_number: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }],
                room_type: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }],
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
                area_exchange_server: [
                    {
                        validator: (rule, value, callback, source, options) => {
                            const errors = [];
                            if (this.form["area_use_exchange"] && !value) {
                                errors.push(new Error(this.$t('base.noDataHint')))
                            }
                            return errors;
                        },
                    },
                ],
            },
            collapse: ["1", "2"]
        }
    },
    methods: {

        submit() {

            console.log('submit meetForm',this.form)
            this.$refs.meetForm.validate((pass) => {
                if (!pass) {
                    return
                }
                // this.form["sort_key"] = this.form["area_name"]
                // 编辑或者新增会议
                Api.editRoom(this.form).then(data => {
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
            Api.deleteMeet({entry_id: Number(id)}).then(data => {
                ElMessage({
                    message: this.$t('base.editSuccess'),
                    type: 'success',
                })
                this.back()
            }).catch(() => {
                ElMessage.error(this.$t('editFailed'))
            })
        },
        formatTime(hours, minutes) {
            let date = new Date(0, 0, 0, hours, minutes, 0);
            return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        }
    },
    mounted() {
        let { id } = this.$route.params
        console.log('meetDetail mounted id',id)
        Api.getMeetDetail({id: Number(id)}).then(data => {
            if (!data) {
                return
            }
            data = data[0]
            console.log('getMeetDetail data', data)
        })

        Api.getAdmins().then(data => {
            if (!data) {
                return
            }
            data = data[0]
            console.log('getAdmins data', data)
            this.admins = data['admins']
            // this.form["area_disabled"] = Number(data["disabled"])
            // this.form["area_timezone"] = data["timezone"]
            // this.form["area_start_first_slot"] = this.formatTime(data["morningstarts"], data["morningstarts_minutes"])
            // this.form["area_start_last_slot"] = this.formatTime(data["eveningends"], data["eveningends_minutes"])
        })
    }
}
</script>

<style scoped>
.picker-date-container {
    display: flex;
    flex-direction: row;
}
</style>