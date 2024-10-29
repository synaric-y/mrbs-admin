<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main" style="background-color: white;padding: 20px;">
      <div class="sub-title-wrapper">
        <div class="sub-title">{{ $t("base.areaManagement") }}</div>
        <el-button style="margin-top: 20px;" type="primary" size="default" @click="pendingAddArea">{{ $t("base.add") }}</el-button>
      </div>
      <el-table :data="tableData"
                style="margin-top: 30px;"
                header-cell-class-name="tb-header"
                header-align="center"
                table-layout="auto"
                max-height="600">
        <el-table-column fixed prop="area_name" :label="$t('area.tableArea.name')" width="350">
        </el-table-column>
        <el-table-column prop="disabled" :label="$t('area.tableArea.state')" width="150">
          <template #default="scope">
            <div :class="['tb-state', scope.row.disabled == 1 ? 'tb-state-disable' : '']"></div>
          </template>
        </el-table-column>
        <el-table-column prop="id" :label="$t('area.tableArea.id')" width="150">
        </el-table-column>
        <el-table-column prop="timezone" :label="$t('area.tableArea.timezone')" width="250">
        </el-table-column>
        <el-table-column prop="id" :label="$t('area.tableArea.operate')" width="300">
          <template #default="scope">
            <div class="operate-wrapper">
              <span class="operate-item" @click="toAreaDetail(scope.row.id)">编辑</span>
              <span class="operate-item" @click="pendingDeleteArea(scope.row.id)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="showAddAreaDialog" :title="$t('area.addArea')" width="500">
        <el-form :model="form" ref="areaForm" :rules="rules">
          <el-form-item prop="name" :label="$t('area.formArea.name')">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showAddAreaDialog = false">{{ $t('base.cancel') }}</el-button>
            <el-button type="primary" @click="addArea">
              {{ $t('base.confirm') }}
            </el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog v-model="showDeleteAreaDialog" title="Tips" width="500">
        <span>{{ $t('area.deleteAreaHint') }}</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showDeleteAreaDialog = false">{{ $t('base.cancel') }}</el-button>
            <el-button type="primary" @click="deleteArea">
              {{ $t('base.confirm') }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>


<script>
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import router from "@/router/index.js";
import { ElMessage } from "element-plus";
export default {
  mixins: [PageMixin],
  data() {
    return {
      tableData: [
      ],
      showAddAreaDialog: false,
      showDeleteAreaDialog: false,
      form: {
        name: ''
      },
      rules: {
        name: [
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
        name: ''
      }
      this.showAddAreaDialog = true
    },
    addArea() {
      this.$refs.areaForm.validate((pass) => {
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

.el-table {
}

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