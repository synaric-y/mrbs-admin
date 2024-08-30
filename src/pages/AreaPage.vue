<script>
import {PageMixin} from "@/pages/PageMixin.js";
import {Api} from "@/network/api.js";
export default {
  mixins: [PageMixin],
  data() {
    return {
      tableData: [{
        area_name: '办公室',
        id: 1,
        disabled: 0,
        timezone: 'Asia/Shanghai',
      }
      ]
    }
  },
  methods: {
    toAreaDetail() {
      this.push('/area_detail/add/0')
    },
    getAreaList() {
      Api.getAreaList({}).then(data => {
        if (data) {
          this.tableData = data
        }
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
        <el-button type="primary" size="default" @click="toAreaDetail">{{ $t("base.add") }}</el-button>
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
            <div class="tb-state"></div>
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
            prop="area_name"
            :label="$t('area.tableArea.operate')"
            width="120">
          <template #default="scope">
            <img class="tb-op-icon tb-op-icon-span" src="/edit.png">
            <img class="tb-op-icon" src="/delete.png">
          </template>
        </el-table-column>
      </el-table>
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