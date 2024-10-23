<template>
  <div class="mask">
    <div class="content">
      <div class="title">查看组成员</div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item><el-input v-model="keyword" placeholder="请输入用户名称" /></el-form-item>
        <!--        <el-form-item><el-select style="min-width: 120px" v-model="sourceVal" placeholder="来源">-->
        <!--          <el-option v-for="item in sourceOptions" style="min-width: 120px;z-index: 99999" :key="item.value" :label="item.label"-->
        <!--                     :value="item.value" />-->
        <!--        </el-select></el-form-item>-->
        <el-form-item>
          <el-button type="primary" :color="'#591bb7'" :dark="true" :icon="Search"
            @click="searchGroupMember">搜索</el-button>
        </el-form-item>
      </el-form>

      <div class="group-member-wrapper">
        <el-table :data="groupMembers" max-height="250"
          style="--el-table-tr-bg-color:#fff!important;width: 100%;height: auto; margin-bottom: 20px;" row-key="id"
          default-expand-all>
          <template v-if="isEdit">
            <el-table-column prop="id" label="序号" label-width="100px" />
            <el-table-column prop="display_name" label="用户名" label-width="120px" />
            <el-table-column prop="source" label="来源" label-width="100px" />
            <el-table-column prop="disabled" label="状态" width="100">
              <template #default="scope">
                <el-switch v-model="scope.row.disabled"
                  style="--el-switch-on-color: #591BB7; --el-switch-off-color: #A8ABB2" active-value="1"
                  inactive-value="0" @change="handleSwitchChange(scope.row)" />
              </template>
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column prop="id" label="序号" label-width="100px" />
            <el-table-column prop="group" label="组名" label-width="100px">
              {{ groupName }}
            </el-table-column>
            <el-table-column prop="display_name" label="用户名" label-width="120px" />
            <el-table-column prop="source" label="来源" label-width="100px" />
          </template>
        </el-table>
        <div class="table-pagination-block">
          <div class="table-demonstration">共{{ total_num }}条</div>
          <el-pagination :current-page="pageNumber" background @current-change="handleCurrentChange"
            layout="prev, pager, next" :default-page-size="20" :total="total_num" />
        </div>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="$emit('close')">关闭</el-button>
      </div>
    </div>
  </div>
</template>



<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";
import { Search } from '@element-plus/icons-vue'

export default {
  computed: {
    Search() {
      return Search
    }
  },
  mixins: [PageMixin],
  props: ['groupId', 'groupName', 'isEdit'],
  emits: ['close'],
  name: 'GroupDetail',
  data() {
    return {
      groupMembers: [],

      keyword: '',
      pageNumber: 1,
      total_num: 0,

      sourceVal: 'ad',
      sourceOptions: [
        {
          value: 'system',
          label: '系统创建',
        }, {
          value: 'ad',
          label: 'AD绑定',
        }],



    }
  },
  methods: {
    handleCurrentChange(num) {
      console.log('UserList handleCurrentChange num:', num)
      this.pageNumber = num

      this.getGroupMember() // 查询新页
    },
    getGroupMember() {
      Api.getGroupMember({
        group_id: this.isEdit?-1:parseInt(this.groupId),
        search: this.keyword || '',
        page: this.pageNumber,
        source: this.sourceVal
      }).then(({ data }) => {
        if (data) {
          this.groupMembers = data.users
          this.total_num = data.total_num
        }
      })
    },
    searchGroupMember() {
      this.pageNumber = 1 // 复位页码

      this.getGroupMember()
    }
  },
  created() {
    console.log(this.groupId)
    this.getGroupMember()
  },
  unmounted() {

  }
}
</script>



<style lang="scss" scoped>
.logo {
  width: 207px;
  height: 51px;
  margin-top: 80px;
  margin-bottom: 50px;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(0, 0, 0, .3);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);

  .content {
    width: 60%;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 6px 2px rgba(0, 0, 0, .1);
    padding: 20px 30px;

    .title {
      line-height: 2;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .demo-form-inline {
      margin-bottom: 10px;
    }

    .el-table {
      min-height: 300px;
    }

    .table-pagination-block {
      display: flex;
      justify-content: center;
      gap: 10px;
      align-items: center;
      margin-bottom: 20px;

      .table-demonstration {
        font-size: 16px;
        color: #333;
      }
    }

    .dialog-footer {
      display: flex;
      justify-content: center;
    }
  }
}

.el-table {
  --el-table-header-bg-color: #f5f6f7;
  --el-table-border: 1px solid #E1E1E1;
  --el-table-tr-bg-color: #fff;
}
</style>