<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-title-wrapper">
        <div class="sub-title">{{ mode === "add" ? $t("area.addArea") : $t("area.editArea") }}</div>
      </div>
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
        <el-form-item label="同步用户组" prop="group_ids" label-width="140px" style="margin-left: 50px;">
          <el-tree-select ref="multipleTree" multiple lazy clearable v-model="form.group_ids" :load="loadGroup" :props="groupProps"
             @change="handleTreeSelect" :render-after-expand="false" node-key="id" :default-checked-keys="form.group_ids"
             />
        </el-form-item>
        <el-form-item :label="$t('area.formArea.timeDuration')" prop="area_res_mins">
          <el-select style="min-width: 400px" v-model="form.area_res_mins" :placeholder="$t('base.plzSelect')">
            <el-option v-for="(item, index) in resolutionOptions" :key="index" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-collapse v-model="collapse">
          <el-collapse-item :title="$t('base.exchange')" name="1">
            <el-form-item prop="use_exchange" :label="$t('area.formArea.useExchange')">
              <el-switch active-value="1" inactive-value="0" v-model="form.area_use_exchange" />
            </el-form-item>

            <el-form-item prop="exchange_server" :label="$t('area.formArea.exchangeServer')">
              <el-input v-model="form.area_exchange_server" show-word-limit maxlength="255" />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-form-item style="margin-top: 60px">
          <el-button type="primary" size="default" @click="submit">{{ $t("base.confirm") }}</el-button>
          <el-button type="info" size="default" @click="back">{{ $t("base.cancel") }}</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>

</style>

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
        group_ids: [1,3892,3930],
        group_names: ['Admin', '测试组2',  'iOS-group1'],

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
        area_res_mins: [
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
      collapse: ["1", "2"],
      resolutionOptions:[
        {
          label: '15分钟',
          value: 15
        },
        {
          label: '30分钟',
          value: 30
        }
      ],

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
        // console.log('loadGroup sync level0', node.level)
        resolve([
          { name: this.$t('userGroup.groupAD'), id: '-1',source: 'ad',group_source:'ad', isLeaf: false, third_id: 0, disabled: false, user_count: 0, sync_state: 0, has_child: 1 },
          { name: '系统分组', id: '-1', isLeaf: false,source: 'system',group_source:'system', third_id: 0, disabled: false, user_count: 0, sync_state: 0, has_child: 1 },
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
              // this.$refs.multipleTree.setCurrentKey(item.id)
            })
            console.log('AreaDetailPage getAdTreeWithId 1 groups', childrenData)
            resolve(childrenData);
          }).catch(() => {
            resolve([]);
          });
        } else {
          this.getAdTreeWithId(-1).then(childrenData => {
            // console.log('AreaDetailPage getAdTreeWithId 1 groups', childrenData)
            resolve(childrenData);
          }).catch(() => {
            resolve([]);
          });
        }
      } else {
        console.log('AreaDetailPage loadGroup sync level2', node.data.group_source)
        if (node && node.data && node.data.group_source == 'system') {
          this.getSystemTreeWithId(node.data.id).then(childrenData => {
            // console.log('AreaDetailPage getAdTreeWithId 3 childrenData', childrenData)
            resolve(childrenData);
          }).catch(() => {
            resolve([]);
          });
        } else {
          this.getAdTreeWithId(node.data.id).then(childrenData => {
            // console.log('AreaDetailPage getAdTreeWithId 3 childrenData', childrenData)
            resolve(childrenData);
          }).catch(() => {
            resolve([]);
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
            // console.log('AreaDetailPage getAdTreeWithId groups', groups)
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
            // console.log('AreaDetailPage getAdTreeWithId groups', groups)
          } else {
            ElMessage.error(msg)
            reject(msg)
          }
        })
      })
    },
    handleTreeSelect(id) {
      console.log('AreaDetailPage handleTreeSelect', id)
      this.form['group_ids'] = id
      // const selectedItem = this.findNodeById(this.treeData, id);
      // console.log('选中的 item 数据:', selectedItem);
      // this.selectedItem = selectedItem
    },
    findNodeById(nodes, id) {
      for (let node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.third_id === id) {
          return node
        }
        if (node.children && node.children.length > 0) {
          const found = this.findNodeById(node.children, id);
          if (found) return found;
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
        Api.editArea(this.form).then(({data, code, msg}) => {
          if (code == 0) {
            ElMessage({
              message: this.$t('base.editSuccess'),
              type: 'success',
            })
            this.back()
          }  else {
            ElMessage.error(msg)
          }
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
    Api.getArea({id: Number(id)}).then(({data}) => {
      if (!data) {
        return
      }
      data = data[0]
      this.form["area"] = data["id"]
      this.form["area_name"] = data["area_name"]
      this.form["sort_key"] = data["sort_key"]
      this.form["area_disabled"] = Boolean(data["disabled"])
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
        const group_ids = []
        const group_names = []
        for (let index = 0; index < data['groups'].length; index++) {
          const ele = data['groups'][index];
          group_ids.push(ele.id)
          group_names.push(ele.name)
        }
        this.form['group_ids'] = group_ids
        this.form['group_names'] = group_names
        console.log('AreaDetailPage getArea group_ids',this.form['group_ids'])
        console.log('AreaDetailPage getArea group_names',this.form['group_names'])
      } else {
        this.form['group_ids'] = []
        this.form['group_names'] = []
      }
    })
    this.timezoneList = TIMEZONE_LIST
  }
}
</script>

