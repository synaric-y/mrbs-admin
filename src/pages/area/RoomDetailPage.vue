<template>
  <Layout :title="mode === 'add' ? $t('room.addRoom') : $t('room.editRoom')" :section-left-padding="40">
    <template #section>
      <div>
        <div class="section-title">{{ $t('system.terminal_meet_title') }}</div>
        <div class="section-content">
          <div class="switches">
            <div class="switch-row">
              <div class="label">{{ $t('system.show_booker') }}</div>
              <el-switch :active-value="1" :inactive-value="0" v-model="form.show_book" style="--el-switch-on-color: #591bb7;" />
              <el-text v-if="form.show_book" class="mx-1" type="primary">{{ $t('system.show_booker_tip')
                }}</el-text>
              <el-text v-else class="mx-1">{{ $t('system.show_booker_text') }}</el-text>
            </div>
            <div class="switch-row">
              <div class="label">{{ $t('system.show_title') }}</div>
              <el-switch :active-value="1" :inactive-value="0" v-model="form.show_meeting_name" style="--el-switch-on-color: #591bb7;" />
              <el-text v-if="form.show_meeting_name" class="mx-1" type="primary">{{ $t('system.show_title_tip')
                }}</el-text>
              <el-text v-else class="mx-1">{{ $t('system.show_title_text') }}</el-text>
            </div>
            <div class="switch-row">
              <div class="label">{{ $t('system.show_temp_meet') }}</div>
              <el-select style="max-width: 170px" v-model="form.temporary_meeting"
                :placeholder="$t('base.plzSelect')">
                <el-option :label="$t('system.temp_meet_no')" :value="0" key="0" />
                <el-option :label="$t('system.temp_meet_no_verify')" :value="1" key="1" />
                <el-option :label="$t('system.temp_meet_verify')" :value="2" key="2" />
              </el-select>
              <el-text v-if="form.temporary_meeting != 0" class="mx-1" type="primary">{{ $t('system.show_temp_tip1')
                }}</el-text>
              <el-text v-else class="mx-1">{{ $t('system.show_temp_tip2') }}</el-text>
            </div>
          </div>
          <div class="preview">
            <div class="left">
              <div class="times">
                <div class="time" v-for="item in timeline">{{ item }}</div>
              </div>
              <div class="btn" v-if="form.temporary_meeting != 0">{{ $t('system.temp_meet') }}</div>
            </div>
            <div class="right">
              <div class="room">{{ $t('system.room_name') }}
                <span class="room-name">A</span>
              </div>
              <div class="time">10:35AM 2024/7/19</div>
              <div class="title">{{ $t('system.meet_status') }}</div>
              <div class="info">
                <div class="title">{{ $t('system.in_meet_info') }}</div>
                <div class="info-row">
                  <el-icon>
                    <Monitor />
                  </el-icon>
                  <div class="value">{{ form.show_meeting_name ? $t('system.temp_meet_name') :
                    $t('system.hide_meet_name') }}</div>
                </div>
                <div class="info-row">
                  <el-icon>
                    <Clock />
                  </el-icon>
                  <div class="value">09:00AM - 11:00AM</div>
                </div>
                <div class="info-row">
                  <el-icon>
                    <User />
                  </el-icon>
                  <div class="value">{{ form.show_book ? $t('system.temp_meet_booker') :
                    $t('system.hide_meet_booker') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-title">{{ $t('room.section_title') }}</div>
      <div class="section-content">
        <el-form :model="form" :rules="rules" label-width="auto" ref="roomForm" style="max-width: 530px">
          <el-form-item prop="room_name" :label="$t('room.formRoom.name')">
            <el-input v-model="form.room_name" show-word-limit maxlength="32" />
          </el-form-item>
          <el-form-item prop="disabled" :label="$t('room.formRoom.status')">
            <el-switch :active-value="0" :inactive-value="1" v-model="form.disabled" />
          </el-form-item>
          <el-form-item prop="area" :label="$t('room.formRoom.area')" label-position="right">
            <el-select v-model="form.area" :empty-values="[null, undefined]" @change="onAreaChange">
              <el-option v-for="item in areaList" :key="item.id" :label="item.area_name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item prop="capacity" :label="$t('room.formRoom.capacity')">
            <el-input v-model="form.capacity" />
          </el-form-item>
          <el-form-item prop="description" :label="$t('room.formRoom.description')">
            <el-input v-model="form.description" show-word-limit maxlength="255" />
          </el-form-item>
          <el-collapse v-model="collapse" style="background-color: white;">
            <el-collapse-item :title="$t('base.exchange')" name="1">
              <el-form-item prop="use_exchange" :label="$t('room.formRoom.useExchange')">
                <el-switch active-value="1" inactive-value="0" v-model="area.use_exchange" disabled />
              </el-form-item>
              <el-form-item prop="exchange_username" :label="$t('room.formRoom.exchangeUsername')">
                <el-input v-model="form.exchange_username" show-word-limit maxlength="255" />
              </el-form-item>
              <el-form-item prop="exchange_password" :label="$t('room.formRoom.exchangePassword')">
                <el-input v-model="form.exchange_password" show-word-limit maxlength="64" />
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
          <el-form-item style="margin-top: 60px">
            <el-button type="primary" size="default" @click="submit">{{ $t("base.confirm") }}</el-button>
            <el-button type="info" size="default" @click="back">{{ $t("base.cancel") }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </Layout>
</template>

<script>
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import { ElMessage } from "element-plus";
import Layout from "@/components/Layout.vue";

export default {
  components: { Layout },
  mixins: [PageMixin],
  data() {
    return {
      mode: 'update',
      timeline: [
        '10:00am', '10:30am', '11:00am', '11:30am', '12:00am', '12:30am', '01:00pm', '01:30pm',
      ],
      form: {
        room: '',
        area: '',
        new_area: '',
        old_area: '',
        room_name: '',
        old_room_name: '',
        sort_key: '',
        disabled: '',
        description: '',
        capacity: '',
        room_admin_email: '',
        exchange_username: '',
        exchange_password: '',
        wxwork_mr_id: '',
        invalid_types: [],
        show_book: 0,
        show_meeting_name: 0,
        temporary_meeting: 0,
      },
      rules: {
        area: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' },
        ],
        room_name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' },
          {
            validator: (rule, value, callback, source, options) => {
              const errors = [];
              if (isNaN(value) || !/^(([1-9]\d+)|([1-9]))$/.test(value)) {
                errors.push(new Error(this.$t('room.invalidCapacity')))
              }
              return errors;
            },
          },
        ],
      },
      area: {},
      areaList: [],
      collapse: ['1', '2']
    }
  },
  methods: {
    submit() {
      this.$refs.roomForm.validate((pass) => {
        if (!pass) {
          return
        }
        let req = JSON.parse(JSON.stringify(this.form))
        req["sort_key"] = req["room_name"]
        if (!req["new_area"]) {
          req["new_area"] = req["area"]
        }
        req["area"] = Number(req["area"])
        Api.editRoom(req).then(({ data, code, msg }) => {
          if (code == 0) {
            ElMessage({
              message: this.$t('base.editSuccess'),
              type: 'success',
            })
            this.back()
          } else {
            ElMessage.error(msg)
          }
        }).catch(() => {
          ElMessage.error(this.$t('base.editFailed'))
        })
      })
    },
    async getData() {
      let areaListRep = await Api.getAreaList({})
      this.areaList = areaListRep.data
      let { id } = this.$route.params
      let roomRep = await Api.getRoom({ id: Number(id) })
      let data = roomRep.data
      if (!data) {
        return
      }
      data = data[0]
      this.form["room"] = Number(data["id"])
      this.form["area"] = data["area_id"]
      this.form["old_area"] = Number(data["area_id"])
      this.form["room_name"] = data["room_name"]
      this.form["old_room_name"] = data["room_name"]
      this.form["sort_key"] = data["sort_key"]
      this.form["disabled"] = Number(data["disabled"])
      this.form["description"] = data["description"]
      this.form["capacity"] = Number(data["capacity"])
      this.form["room_admin_email"] = data["room_admin_email"] || ''
      this.form["exchange_username"] = data["exchange_username"]
      this.form["exchange_password"] = data["exchange_password"]
      this.form["wxwork_mr_id"] = data["wxwork_mr_id"]
      this.form.show_book = Number(data["show_book"])
      this.form.show_meeting_name = Number(data["show_meeting_name"])
      this.form.temporary_meeting = Number(data["temporary_meeting"])
      let areaRep = await Api.getArea({ id: this.form.area })
      this.area = areaRep.data[0]
    },
    onAreaChange(e) {
      this.form["new_area"] = e
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.el-collapse {
  --el-collapse-header-bg-color: white;
  --el-collapse-content-bg-color: white;
}

.section-title {
  color: var(--el-color-primary);
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 700;
  line-height: 2;
  margin-bottom: 20px;
}

.section-content {
  display: flex;
  align-items: center;
  gap: 50px;
  margin-left: 100px;
}

.switches {
  .switch-row {
    display: flex;
    gap: 20px;
    align-items: center;
    font-size: 14px;
    line-height: 3;
    color: #666;
    width: 500px;
    .label {
      min-width: 120px;
      text-align: right;
      color: #4e5969;
    }
  }
}

.preview {
  display: flex;
  height: 300px;
  width: 480px;
  .left {
    width: 40%;
    background-color: #333333;
    padding: 5px;
    position: relative;
    .times {
      width: 100%;
      height: 260px;
      overflow: hidden;
      .time {
        color: #ccc;
        text-align: left;
        font-size: 12px;
        line-height: 3;
      }
    }
    .btn {
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #d8d8d8;
      height: 30px;
      line-height: 30px;
      width: 70%;
      border-radius: 2px;
      text-align: center;
    }
  }

  .right {
    width: 100%;
    background-color: #bd3124;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #fff;
    padding: 5px 10px;
    .room {
      border-bottom: 1px solid rgba(255, 255, 255, .3);
      .room-name {
        font-size: 22px;
      }
    }
    .title {
      font-size: 36px;
      line-height: 2;
    }
    .info {
      .title {
        font-size: 14px;
        line-height: 2;
        font-weight: normal;
      }
      .info-row {
        display: flex;
        gap: 5px;
        line-height: 2;
        align-items: center;
        .label {
          min-width: 60px;
        }
      }
    }
  }
}
</style>