<script>
import {PageMixin} from "@/pages/PageMixin.js";
import {Api} from "@/network/api.js";
import router from "@/router/index.js";
import {ElMessage} from "element-plus";
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
      Api.deleteArea({area: this.pendingDeleteId}).then(({data, code}) => {
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
      Api.getAreaList({}).then(({data}) => {
        if (data) {
          this.tableData = data
        }
      })
    },
    addArea() {
      this.showAddAreaDialog = false
      Api.addArea(this.form).then(({data}) => {
        this.getAreaList()
      })
    }
  },
  mounted() {
    this.getAreaList()
  }
}
</script>

<template>

  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-title-wrapper">
        <div class="sub-title">{{ $t("base.areaManagement") }}</div>
        <el-button type="primary" size="default" @click="showAddAreaDialog = true">{{ $t("base.add") }}</el-button>
      </div>
      <el-table
          :data="tableData"
          style="width: 100%"
          header-cell-class-name="tb-header"
          header-align="center"
          max-height="600">
        <el-table-column
            fixed
            prop="area_name"
            :label="$t('area.tableArea.name')"
            width="350">
        </el-table-column>
        <el-table-column
            prop="disabled"
            :label="$t('area.tableArea.state')"
            width="120">
          <template #default="scope">
            <div :class="['tb-state', scope.row.disabled == 1 ? 'tb-state-disable' : '']"></div>
          </template>
        </el-table-column>
        <el-table-column
            prop="id"
            :label="$t('area.tableArea.id')"
            width="120">
        </el-table-column>
        <el-table-column
            prop="timezone"
            :label="$t('area.tableArea.timezone')"
            width="220">
        </el-table-column>
<!--        <el-table-column-->
<!--            prop="address"-->
<!--            :label="$t('area.tableArea.admin')"-->
<!--            width="300">-->
<!--        </el-table-column>-->
        <el-table-column
            prop="id"
            :label="$t('area.tableArea.operate')"
            width="120">
          <template #default="scope">
            <img class="tb-op-icon tb-op-icon-span" src="/imgs/edit.png" @click="toAreaDetail(scope.row.id)">
            <img class="tb-op-icon" src="/imgs/delete.png" @click="pendingDeleteArea(scope.row.id)">

          </template>
        </el-table-column>
      </el-table>



      <el-dialog v-model="showAddAreaDialog" :title="$t('area.addArea')" width="500">
        <el-form :model="form">
          <el-form-item :label="$t('area.formArea.name')">
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
      <el-dialog
          v-model="showDeleteAreaDialog"
          title="Tips"
          width="500">
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

<style lang="scss" scoped>

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
    margin-left: 15px;
  }

  .tb-state-disable {
    background: red;
  }
</style>