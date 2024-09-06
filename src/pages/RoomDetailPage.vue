<script>
import {PageMixin} from "@/pages/PageMixin.js";
import {Api} from "@/network/api.js";
import {ElMessage} from "element-plus";

export default {
  mixins: [PageMixin],
  data() {
    return {
      mode: 'update',
      form: {
        room: '',
        area: '',
        new_area: '',
        old_area: '',
        room_name: '',
        old_room_name: '',
        sort_key: '',
        room_disabled: '',
        description: '',
        capacity: '',
        room_admin_email: '',
        exchange_username: '',
        exchange_password: '',
        wxwork_mr_id: '',
        invalid_types: []
      },
      rules: {
        area: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'},
        ],
        room_name: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
        ],
        capacity: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'},
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
        Api.editRoom(req).then(({data, code, message}) => {
          if (code == 0) {
            ElMessage({
              message: this.$t('base.editSuccess'),
              type: 'success',
            })
            this.back()
          } else {
            ElMessage.error(message)
          }
        }).catch(() => {
          ElMessage.error(this.$t('base.editFailed'))
        })
      })
    },
    async getData() {
      let areaListRep = await Api.getAreaList({})
      this.areaList = areaListRep.data
      let {id} = this.$route.params
      let roomRep = await Api.getRoom({id: Number(id)})
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
      this.form["room_disabled"] = Number(data["disabled"])
      this.form["description"] = data["description"]
      this.form["capacity"] = Number(data["capacity"])
      this.form["room_admin_email"] = data["room_admin_email"]
      this.form["exchange_username"] = data["exchange_username"]
      this.form["exchange_password"] = data["exchange_password"]
      this.form["wxwork_mr_id"] = data["wxwork_mr_id"]

      let areaRep =  await Api.getArea({id: this.form.area})
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

<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-title-wrapper">
        <div class="sub-title">{{ mode === "add" ? $t("room.addRoom") : $t("room.editRoom") }}</div>
      </div>

      <el-form :model="form" :rules="rules" label-width="auto" ref="roomForm" style="max-width: 530px">

        <el-form-item prop="room_name" :label="$t('room.formRoom.name')">
          <el-input v-model="form.room_name" maxlength="32" />
        </el-form-item>

        <el-form-item prop="room_disabled" :label="$t('room.formRoom.status')">
          <el-switch :active-value="0" :inactive-value="1" v-model="form.room_disabled"/>
        </el-form-item>

        <el-form-item prop="area" :label="$t('room.formRoom.area')" label-position="right">
          <el-select
              v-model="form.area"
              :empty-values="[null, undefined]"
              @change="onAreaChange"
          >
            <el-option
                v-for="item in areaList"
                :key="item.id"
                :label="item.area_name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="capacity" :label="$t('room.formRoom.galleryful')">
          <el-input v-model="form.capacity"/>
        </el-form-item>

        <el-form-item prop="description" :label="$t('room.formRoom.description')">
          <el-input v-model="form.description" maxlength="255" />
        </el-form-item>

        <el-collapse v-model="collapse">
          <el-collapse-item :title="$t('base.exchange')" name="1">
            <el-form-item prop="use_exchange" :label="$t('room.formRoom.useExchange')">
              <el-switch active-value="1" inactive-value="0" v-model="area.use_exchange" disabled />
            </el-form-item>

            <el-form-item prop="exchange_username" :label="$t('room.formRoom.exchangeUsername')">
              <el-input v-model="form.exchange_username" maxlength="255" />
            </el-form-item>

            <el-form-item prop="exchange_password" :label="$t('room.formRoom.exchangePassword')">
              <el-input v-model="form.exchange_password" maxlength="64" />
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item :title="$t('base.wxwork')" name="2">
            <el-form-item prop="use_wxwork" :label="$t('room.formRoom.useWxwork')">
              <el-switch active-value="1" inactive-value="0" v-model="area.use_wxwork" disabled />
            </el-form-item>

            <el-form-item prop="wxwork_mr_id" :label="$t('room.formRoom.wxworkMRiD')">
              <el-input v-model="form.wxwork_mr_id" maxlength="20" />
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