<template>
  <Layout :title="mode === 'add' ? $t('area.addArea') : $t('area.editArea')" :section-left-padding="40">
    <template #section>
      <el-form :model="form" :rules="rules" label-width="auto" ref="areaForm" style="max-width: 530px">
        <el-form-item prop="area_name" :label="$t('area.formArea.name')">
          <el-input v-model="form.area_name" show-word-limit maxlength="32" />
        </el-form-item>
        <el-form-item prop="area_timezone" :label="$t('area.formArea.timezone')">
          <el-select v-model="form.area_timezone" :placeholder="$t('base.plzSelect')">
            <el-option :label="tz" :value="tz" v-for="(tz, index) in timezoneList" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item prop="area_disabled" :label="$t('area.formArea.status')">
          <el-switch :active-value="0" :inactive-value="1" v-model="form.area_disabled" />
        </el-form-item>
        <el-form-item prop="area_start_first_slot" :label="$t('area.formArea.startOfFirstSlot')">
          <el-time-select v-model="form.area_start_first_slot" style="width: 240px" start="06:00" step="00:30"
            end="18:30" :placeholder="$t('base.plzSelect')" />
        </el-form-item>
        <el-form-item prop="area_start_last_slot" :label="$t('area.formArea.startOfLastSlot')">
          <el-time-select v-model="form.area_start_last_slot" style="width: 240px" start="06:00" step="00:30"
            end="18:30" :placeholder="$t('base.plzSelect')" />
        </el-form-item>
        <el-form-item :label="$t('area.formArea.user_group')" prop="group_ids">
          <el-tree-select ref="multipleTree" multiple lazy clearable v-model="form.group_ids" :load="loadGroup"
            :props="groupProps" @change="handleTreeSelect" show-checkbox node-key="id" highlight-current
            :default-checked-keys="cacheGroupsData" :cache-data="cacheGroupsData"/>
        </el-form-item>
      </el-form>
    </template>
    <template #btns>
      <el-button type="primary" size="default" @click="submit">{{ $t("base.confirm") }}</el-button>
      <el-button size="default" @click="back">{{ $t("base.cancel") }}</el-button>
    </template>
  </Layout>
</template>

<style lang="scss" scoped></style>

<script>
import moment from "moment";
import { TIMEZONE_LIST } from "@/assets/timezone.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import { ElMessage } from "element-plus";
import router from "@/router/index.js";
import Layout from "@/components/Layout.vue";

export default {
  components: { Layout },
  mixins: [PageMixin],
  data() {
    return {
      mode: 'update',
      form: {
        area: 1,
        area_name: "",
        sort_key: "",
        area_disabled: false,
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
        group_ids: [],
        group_names: [],

        area_use_exchange: 0,
        area_exchange_server: "",
        area_use_wxwork: 0,
        area_wxwork_corpid: "",
        area_wxwork_server: "",
      },
      cacheGroupsData: [],
      rules: {
        area_name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        area_start_first_slot: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        area_start_last_slot: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        area_timezone: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        area_res_mins: [
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
      collapse: ["1", "2"],
      groupVal: this.$t('base.plzSelect'),
      groupProps:
      {
        value: 'id',
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf',
        disabled: 'disabled',
      },
    }
  },
  methods: {

    loadGroup(node, resolve) {
      console.log('AreaDetailPage loadGroup sync node', node)
      if (node.level === 0) {
        resolve([
          { name: this.$t('userGroup.groupAD'), id: '-1', source: 'ad', group_source: 'ad', isLeaf: false, third_id: 0, disabled: false, user_count: 0, sync_state: 0, has_child: 1 },
          { name: this.$t('userGroup.system_group'), id: '-1', isLeaf: false, source: 'system', group_source: 'system', third_id: 0, disabled: false, user_count: 0, sync_state: 0, has_child: 1 },
        ]);
      } else if (node.level === 1) {
        console.log('AreaDetailPage loadGroup sync level1', node.data.group_source)
        if (node && node.data && node.data.group_source == 'system') {
          this.getSystemTreeWithId(-1).then(childrenData => {
            childrenData.map(item => {
              if (item.disabled) {
                item.disabled = true
              } else {
                item.disabled = false
              }
              item.checked = true
            })
            console.log('AreaDetailPage getAdTreeWithId 1 groups', childrenData)
            resolve(childrenData)
          }).catch(() => {
            resolve([])
          });
        } else {
          this.getAdTreeWithId(-1).then(childrenData => {
            resolve(childrenData)
          }).catch(() => {
            resolve([])
          });
        }
      } else {
        console.log('AreaDetailPage loadGroup sync level2', node.data.group_source)
        if (node && node.data && node.data.group_source == 'system') {
          this.getSystemTreeWithId(node.data.id).then(childrenData => {
            resolve(childrenData)
          }).catch(() => {
            resolve([])
          });
        } else {
          this.getAdTreeWithId(node.data.id).then(childrenData => {
            resolve(childrenData)
          }).catch(() => {
            resolve([])
          });
        }
      }
    },
    getAdTreeWithId(group_id) {
      return new Promise((resolve, reject) => {
        Api.getAdGroupTree({
          "group_id": group_id,
          "page": 1,
        }).then(({ data, code, msg }) => {
          if (code == 0) {
            let groups = data.group.child_groups
            groups.forEach(item => {
              item['group_source'] = 'ad'
              item['isLeaf'] = item['has_child'] == 1 ? false : true
              item['lable'] = item['name']
              item['children'] = []
            })
            resolve(groups)
          } else {
            ElMessage.error(msg)
            reject(msg)
          }
        })
      })
    },
    getSystemTreeWithId(group_id) {
      return new Promise((resolve, reject) => {
        Api.getSystemGroupTree({
          "group_id": group_id,
          "page": 1,
        }).then(({ data, code, msg }) => {
          if (code == 0) {
            let groups = data.group.child_groups
            groups.forEach(item => {
              item['group_source'] = 'system'
              item['isLeaf'] = item['has_child'] == 1 ? false : true
              item['lable'] = item['name']
              item['children'] = []
            })
            resolve(groups)
          } else {
            ElMessage.error(msg)
            reject(msg)
          }
        })
      })
    },
    handleTreeSelect(id) {
      console.log('AreaDetailPage handleTreeSelect', id)
    },
    findNodeById(nodes, id) {
      for (let node of nodes) {
        if (node.id === id) {
          return node
        }
        if (node.third_id === id) {
          return node
        }
        if (node.children && node.children.length > 0) {
          const found = this.findNodeById(node.children, id)
          if (found) return found
        }
      }
      return null;
    },
    submit() {
      this.$refs.areaForm.validate((pass) => {
        if (!pass) {
          return
        }
        this.form["sort_key"] = this.form["area_name"]
        Api.editArea(this.form).then(({ data, code, msg }) => {
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
    formatTime(hours, minutes) {
      let date = new Date(0, 0, 0, hours, minutes, 0);
      return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    }
  },
  mounted() {
    let { id } = this.$route.params

    Api.getVariables({
      "logo_dir": 1,
      "company_name": 1,
      "server_address": 1,
      "init_status": 1,
      "use_wxwork": 1,
      "use_exchange": 1,
      "exchange_server": 1,
    }).then(({ code, data, msg }) => {
      console.log('getVariables data',data)
      this.form.area_use_exchange = data.use_exchange
    })

    Api.getArea({ id: Number(id) }).then(({ data }) => {
      if (!data) {
        return
      }
      data = data[0]
      this.form["area"] = data["id"]
      this.form["area_name"] = data["area_name"]
      this.form["sort_key"] = data["sort_key"]
      this.form["area_disabled"] = data["disabled"]
      this.form["area_timezone"] = data["timezone"]
      this.form["area_start_first_slot"] = this.formatTime(data["morningstarts"], data["morningstarts_minutes"])
      this.form["area_start_last_slot"] = this.formatTime(data["eveningends"], data["eveningends_minutes"])
      this.form["area_use_exchange"] = data["use_exchange"]
      this.form["area_exchange_server"] = data["exchange_server"]
      this.form["area_use_wxwork"] = data["use_wxwork"]
      this.form["area_wxwork_corpid"] = data["wxwork_corpid"]
      this.form["area_wxwork_secret"] = data["wxwork_secret"]
      this.form['area_res_mins'] = data['resolution'] / 60
      if (data['groups'] && data['groups'].length > 0) {
        this.cacheGroupsData = data['groups']
        const group_ids = []
        const group_names = []
        for (let index = 0; index < data['groups'].length; index++) {
          const ele = data['groups'][index]
          group_ids.push(ele.id)
          group_names.push(ele.name)
        }
        this.form['group_ids'] = group_ids
        this.form['group_names'] = group_names
        console.log('AreaDetailPage getArea group_ids', this.form['group_ids'])
        console.log('AreaDetailPage getArea group_names', this.form['group_names'])
      } else {
        this.form['group_ids'] = []
        this.form['group_names'] = []
      }
    })
    this.timezoneList = TIMEZONE_LIST
  }
}
</script>

<style scoped>
.section-title {
  color: var(--el-color-primary);
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 700;
  line-height: 2;
  margin-bottom: 20px;
}
</style>
