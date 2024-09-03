<template>
    <el-container class="container-sub-page">
        <el-main class="container-sub-page-main">
            <div class="sub-title-wrapper">
                <!-- <div class="sub-title">{{ mode === "add" ? $t("area.addArea") : $t("area.editArea") }}</div> -->
                <div class="sub-title">编辑会议</div>
            </div>

            <el-form :model="form" :rules="rules" label-width="auto" ref="meetForm" style="max-width: 530px">

                <el-form-item prop="creat_name" label="创建人">
                    <el-select v-model="form.creat_name" />
                </el-form-item>

                <el-form-item prop="booked_by" label="预约人">
                    <el-input v-model="form.booked_by" />
                </el-form-item>

                <el-form-item prop="short_desc" label="简要说明">
                    <el-input v-model="form.short_desc" />
                </el-form-item>

                <el-form-item prop="remark_desc" label="完整说明">
                    <el-input style="width: 240px" type="textarea" maxlength="100" show-word-limit
                        v-model="form.remark_desc" />
                </el-form-item>


                <!-- :label="$t('area.formArea.startOfFirstSlot')" -->
                <el-form-item prop="start_day" label="起始">
                    <div class="picker-date-container">
                        <el-date-picker v-model="form.start_day" type="date" placeholder="Pick a day" />
                        <el-time-select v-model="form.start_hour" style="width: 240px;margin-left: 20px"
                            start="06:00" step="00:30" end="21:30" :placeholder="$t('base.plzSelect')" />
                    </div>
                </el-form-item>

                <!-- :label="$t('area.formArea.startOfLastSlot')" -->
                <el-form-item prop="end_day" label="结束">
                    <div class="picker-date-container">
                        <el-date-picker v-model="form.end_day" type="date" placeholder="Pick a day" />
                        <el-time-select v-model="form.end_hour" style="width: 240px;margin-left: 20px"
                            start="06:00" step="00:30" end="21:30" :placeholder="$t('base.plzSelect')" />
                    </div>
                </el-form-item>

                <el-form-item prop="room_number" label="房间">
                    <el-select v-model="form.room_number" style="width: 240px" placeholder="请选择" />
                </el-form-item>

                <el-form-item prop="room_type" label="类型">
                    <el-select v-model="form.room_type" style="width: 240px" placeholder="请选择">
                        <el-option v-for="item in form.meet_types" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>

                <el-form-item style="margin-top: 60px">
                    <el-button type="info" size="default" @click="cancle">{{ $t("base.cancel") }}</el-button>
                    <el-button type="danger" size="default" @click="deleteMeet">删除</el-button>
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

                creat_name: "",
                admins: [],
                booked_by: "",
                short_desc: "",
                remark_desc: "",
                room_number: "",
                room_type: "",

                start_day: "",
                start_hour: "",

                end_day: "",
                end_hour: "",

                meet_types: ["内部类型","外部类型"],

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
                creat_name: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }],
                booked_by: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }],
                short_desc: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }],
                remark_desc: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }],
                room_number: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }],
                room_type: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }],
                start_day: [
                    { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
                ],
                start_hour: [
                    { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
                ],
                end_day: [
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
            Api.deleteMeet(this.form).then(data => {
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
        Api.getAdmins().then(data => {
            if (!data) {
                return
            }
            data = data[0]
            console.log('getAdmins data',data)
            // this.form["area"] = data["id"]
            // this.form["area_name"] = data["area_name"]
            // this.form["sort_key"] = data["sort_key"]
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