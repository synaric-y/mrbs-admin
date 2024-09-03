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

        area_use_exchange: 0,
        area_exchange_server: "",
        area_use_wxwork: 0,
        area_wxwork_corpid: "",
        area_wxwork_server: "",
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
        area_wxwork_corpid: [
          {
            validator: (rule, value, callback, source, options) => {
              const errors = [];
              if (this.form["area_use_wxwork"] && !value) {
                errors.push(new Error(this.$t('base.noDataHint')))
              }
              return errors;
            },
          },
        ],
        area_wxwork_secret: [
          {
            validator: (rule, value, callback, source, options) => {
              const errors = [];
              if (this.form["area_use_wxwork"] && !value) {
                errors.push(new Error(this.$t('base.noDataHint')))
              }
              return errors;
            },
          },
        ]
      },
      timezoneList: [],
      collapse: ["1", "2"]
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
          ElMessage.error(this.$t('base.editFailed'))
        })
      })
    },
    formatTime(hours, minutes) {
      let date = new Date(0, 0, 0, hours, minutes, 0);
      return date.toLocaleTimeString('it-IT', {hour: '2-digit', minute: '2-digit'});
    }
  },
  mounted() {
    let {id} = this.$route.params
    Api.getArea({id: Number(id)}).then(data => {
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
      this.form["area_use_exchange"] = data["use_exchange"]
      this.form["area_exchange_server"] = data["exchange_server"]
      this.form["area_use_wxwork"] = data["use_wxwork"]
      this.form["area_wxwork_corpid"] = data["wxwork_corpid"]
      this.form["area_wxwork_secret"] = data["wxwork_secret"]
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

        <el-collapse v-model="collapse">
          <el-collapse-item :title="$t('base.exchange')" name="1">
            <el-form-item prop="use_exchange" :label="$t('area.formArea.useExchange')">
              <el-switch active-value="1" inactive-value="0" v-model="form.area_use_exchange"/>
            </el-form-item>

            <el-form-item prop="exchange_server" :label="$t('area.formArea.exchangeServer')">
              <el-input v-model="form.area_exchange_server"/>
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item :title="$t('base.wxwork')" name="2">
            <el-form-item prop="use_wxwork" :label="$t('area.formArea.useWxwork')">
              <el-switch active-value="1" inactive-value="0" v-model="form.area_use_wxwork"/>
            </el-form-item>

            <el-form-item prop="wxwork_corpid" :label="$t('area.formArea.wxworkCorpId')">
              <el-input v-model="form.area_wxwork_corpid"/>
            </el-form-item>

            <el-form-item prop="wxwork_secret" :label="$t('area.formArea.wxworkSecret')">
              <el-input v-model="form.area_wxwork_secret"/>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

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