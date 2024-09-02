<script>
import moment from "moment";
import {TIMEZONE_LIST} from "@/assets/timezone.js";
import {PageMixin} from "@/pages/PageMixin.js";
import {Api} from "@/network/api.js";
import {ElMessage} from "element-plus";
import router from "@/router/index.js";

export default {
  mixins: [PageMixin],
  data() {
    return {
      mode: 'update',
      form: {
        area: 1,
        area_name: "",
        sort_key: "",
        area_disabled: 0,
        area_timezone: "",
        area_start_first_slot: "",
        area_start_last_slot: "",
        area_def_duration_mins: 60,
        area_res_mins: 30,
        area_admin_email: "",
        area_default_type: "I",
        area_enable_periods: 0,
        area_periods: ["Period 1", "Period 2"],
        area_confirmation_enabled: "on",
        area_confirmed_default: 1,
        area_reminders_enabled: "on",
        area_private_default: 0,
        area_private_override: "none",
      },
      rules: {
        area_name: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
        ],
        area_start_first_slot: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
        ],
        area_start_last_slot: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
        ],
        area_timezone: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
        ]
      },
      timezoneList: [],
    }
  },
  methods: {
    submit() {
      this.$refs.areaForm.validate((pass) => {
        if (!pass) {
          return
        }
        this.form["sort_key"] = this.form["area_name"]
        Api.editArea(this.form).then(data => {
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
    formatTime(hours, minutes) {
      let date = new Date(0, 0, 0, hours, minutes, 0);
      return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    }
  },
  mounted() {
    let {id} = this.$route.params
    Api.getArea({id: 1}).then(data => {
      if (!data) {
        return
      }
      data = data[0]
      this.form["area"] = data["id"]
      this.form["area_name"] = data["area_name"]
      this.form["sort_key"] = data["sort_key"]
      this.form["area_disabled"] = Number(data["disabled"])
      this.form["area_timezone"] = data["timezone"]
      this.form["area_start_first_slot"] = this.formatTime(data["morningstarts"], data["morningstarts_minutes"])
      this.form["area_start_last_slot"] = this.formatTime(data["eveningends"], data["eveningends_minutes"])
    })
    this.timezoneList = TIMEZONE_LIST
  }
}
</script>

<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-title-wrapper">
        <div class="sub-title">{{ mode === "add" ? $t("area.addArea") : $t("area.editArea") }}</div>
      </div>

      <el-form :model="form" :rules="rules" label-width="auto" ref="areaForm" style="max-width: 530px">

        <el-form-item prop="area_name" :label="$t('area.formArea.name')">
          <el-input v-model="form.area_name"/>
        </el-form-item>

        <el-form-item prop="area_timezone" :label="$t('area.formArea.timezone')">
          <el-select v-model="form.area_timezone" :placeholder="$t('base.plzSelect')">
            <el-option :label="tz" :value="tz" v-for="(tz, index) in timezoneList" :key="index"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="area_disabled" :label="$t('area.formArea.status')">
          <el-switch :active-value="0" :inactive-value="1" v-model="form.area_disabled"/>
        </el-form-item>

        <el-form-item prop="area_start_first_slot" :label="$t('area.formArea.startOfFirstSlot')">
          <el-time-select
              v-model="form.area_start_first_slot"
              style="width: 240px"
              start="06:00"
              step="00:30"
              end="18:30"
              :placeholder="$t('base.plzSelect')"
          />
        </el-form-item>
        <el-form-item prop="area_start_last_slot" :label="$t('area.formArea.startOfLastSlot')">
          <el-time-select
              v-model="form.area_start_last_slot"
              style="width: 240px"
              start="06:00"
              step="00:30"
              end="18:30"
              :placeholder="$t('base.plzSelect')"
          />
        </el-form-item>

        <el-form-item style="margin-top: 60px">
          <el-button type="info" size="default" @click="back">{{ $t("base.cancel") }}</el-button>
          <el-button type="primary" size="default" @click="submit">{{ $t("base.confirm") }}</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>