<script>
import router from "@/router/index.js"
export default {

  data() {
    return {
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-08',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-06',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-07',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }]
    }
  },
  methods: {
    toAreaDetail() {
      router.push('/area_detail/add/0')
    }
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
            prop="date"
            :label="$t('area.tableArea.name')"
            width="150">
        </el-table-column>
        <el-table-column
            prop="name"
            :label="$t('area.tableArea.state')"
            width="120">
          <template #default="scope">
            <div class="tb-state"></div>
          </template>
        </el-table-column>
        <el-table-column
            prop="province"
            :label="$t('area.tableArea.id')"
            width="120">
        </el-table-column>
        <el-table-column
            prop="city"
            :label="$t('area.tableArea.galleryful')"
            width="120">
        </el-table-column>
        <el-table-column
            prop="address"
            :label="$t('area.tableArea.admin')"
            width="300">
        </el-table-column>
        <el-table-column
            prop="zip"
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