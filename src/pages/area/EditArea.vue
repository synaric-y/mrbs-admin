<template>
  <Layout :title="$t('base.areaManagement')">
    <template #filter>
      <el-button type="primary" @click="pendingAddArea">{{ $t("base.add") }}</el-button>
    </template>
    <template #table>
      <div class="table-wrapper" style="height: auto">
        <el-table :data="tableData" header-cell-class-name="tb-header" header-align="center" table-layout="auto"
          max-height="600" fit>
          <el-table-column fixed prop="area_name" :label="$t('area.tableArea.name')">
          </el-table-column>
          <el-table-column prop="disabled" :label="$t('area.tableArea.state')">
            <template #default="scope">
              <el-switch disabled v-model="scope.row.disabled" :active-value="0" :inactive-value="1"
                @change="handleSwitchChange(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="id" :label="$t('area.tableArea.id')">
          </el-table-column>
          <el-table-column prop="timezone" :label="$t('area.tableArea.timezone')">
          </el-table-column>
          <el-table-column prop="id" :label="$t('area.tableArea.operate')">
            <template #default="scope">
              <div class="operate-wrapper">
                <span class="operate-item" @click="toAreaDetail(scope.row.id)">{{$t('base.edit')}}</span>
                <span class="operate-item" @click="pendingDeleteArea(scope.row.id)">{{$t('base.delete')}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template #btns>

    </template>
  </Layout>
  <el-dialog v-model="showAddAreaDialog" :title="$t('area.addArea')" width="500">
    <el-form :model="form" ref="form" :rules="rules">
      <el-form-item prop="name" :label="$t('area.formArea.name')">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="timezone" :label="$t('area.formArea.timezone')" style="margin-left: 27px;">
        <el-select v-model="form.timezone" :placeholder="$t('base.plzSelect')">
          <el-option :label="tz" :value="tz" v-for="(tz, index) in timezoneList" :key="index" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="addArea">
          {{ $t('base.confirm') }}
        </el-button>
        <el-button @click="showAddAreaDialog = false">{{ $t('base.cancel') }}</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="showDeleteAreaDialog" title="Tips" width="500">
    <span>{{ $t('area.deleteAreaHint') }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="deleteArea">
          {{ $t('base.confirm') }}
        </el-button>
        <el-button @click="showDeleteAreaDialog = false">{{ $t('base.cancel') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script>
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import router from "@/router/index.js";
import { ElMessage } from "element-plus";
import Layout from "@/components/Layout.vue";
import { TIMEZONE_LIST } from "@/assets/timezone";
export default {
  components: { Layout },
  mixins: [PageMixin],
  data() {
    return {
      tableData: [
      ],
      showAddAreaDialog: false,
      showDeleteAreaDialog: false,
      form: {
        name: '',
        timezone: '',
        group_ids: [-1],
      },
      timezoneList: [],
      rules: {
        name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        timezone: [
         { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ]
      },
      pendingDeleteId: null
    }
  },
  methods: {
    toAreaDetail(id) {
      this.push(`/area_detail/${id}`)
    },
    pendingDeleteArea(id) {
      this.showDeleteAreaDialog = true
      this.pendingDeleteId = id
    },
    deleteArea() {
      this.showDeleteAreaDialog = false
      Api.deleteArea({ area: this.pendingDeleteId }).then(({ data, code }) => {
        if (code == 0) {
          this.getAreaList()
        } else if (code == -1) {
          ElMessage.error(this.$t('area.deniedDeleteAreaHint'))
        } else {
          ElMessage.error(this.$t('area.deniedDeleteAreaHint'))
        }
      })
    },
    getAreaList() {
      Api.getAreaList({}).then(({ data }) => {
        if (data) {
          this.tableData = data
        }
      })
    },
    pendingAddArea() {
      this.form = {
        name: '',
        group_ids: [-1]
      }
      this.showAddAreaDialog = true
    },
    addArea() {
      this.$refs.form.validate((pass) => {
        if (!pass) {
          return
        }
        this.showAddAreaDialog = false
        Api.addArea(this.form).then(({ data, code, msg }) => {
          if (code == 0) {
            this.getAreaList()
          } else {
            ElMessage.error(msg)
          }
        })
      })

    }
  },
  mounted() {
    this.setTab('/area')
    this.getAreaList()
    this.timezoneList = TIMEZONE_LIST
  }
}
</script>

<style lang="scss" scoped>
.container-sub-page-main {
  background-color: white;
  margin-left: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.el-table {}

.tb-op-icon {
  width: 25px;
  height: 25px;
}

.tb-op-icon-span {
  margin-right: 10px;
}

.tb-state {
  width: 18px;
  height: 18px;
  border-radius: 20px;
  background: #08D50A;
  //margin-left: 15px;
}

.tb-state-disable {
  background: red;
}
</style>