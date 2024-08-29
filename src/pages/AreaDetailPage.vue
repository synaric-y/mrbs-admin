<script>
import moment from "moment";
import {TIMEZONE_LIST} from "@/assets/timezone.js";
export default {

  data() {
    return {
      mode: 'add',
      form: {
        name: '',
        timezone: '',
        disabled: 0,
        area_start_first_slot: '08:00',
        area_res_mins: 30,
        area_def_duration_mins: 60,
        area_start_last_slot: '21:00'
      },
      timezoneList: [],
    }
  },
  mounted() {
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

      <el-form :model="form" label-width="auto" style="max-width: 530px">

        <el-form-item :label="$t('area.formArea.name')">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item :label="$t('area.formArea.timezone')">
          <el-select v-model="form.timezone" :placeholder="$t('base.plzSelect')">
            <el-option :label="tz" :value="tz" v-for="(tz, index) in timezoneList" :key="index" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('area.formArea.status')">
          <el-switch :active-value="0" :inactive-value="1" v-model="form.disabled" />
        </el-form-item>

        <el-form-item :label="$t('area.formArea.startOfFirstSlot')">
          <el-time-select
              v-model="form.area_start_first_slot"
              style="width: 240px"
              start="06:00"
              step="00:30"
              end="18:30"
              :placeholder="$t('base.plzSelect')"
          />
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<style scoped>

  .form-left {
    width: 120px;
    color: #333333;
    font-size: 16px;
  }
</style>