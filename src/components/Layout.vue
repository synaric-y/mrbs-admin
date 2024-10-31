<script setup>
// 子路由公共样式
// 插槽：section（中间内容）
//      btns（底部按钮）
// 属性：title（String）

defineProps({
  title:{
    type: String,
  },
  sectionLeftPadding:{
    type: Number,
    default: 0
  },
  sectionCenter:{
    type: Boolean,
    default: false,
  }
})
</script>

<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="title">{{title}}</div>

        <div class="section" :style="`padding-left:${sectionLeftPadding}px;`+(sectionCenter?'justify-content:center':'')">
          <slot name="section">

          </slot>

          <div class="filter-wrapper">
            <slot name="filter"></slot>
          </div>

          <slot name="table"></slot>

          <div class="table-pagination-block">
            <slot name="pagination"></slot>
          </div>

        </div>




        <div class="btns">
          <slot name="btns"></slot>
        </div>
      </div>
    </el-main>
  </el-container>

</template>

<style lang="scss">
/* 全局样式！ */
/* 容器 */
.sub-page-content {
  width: 100%;
  height: auto;
  padding: 20px;
  box-sizing: border-box;
  margin: 0;
  position: relative;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background-color: #fff;
}

/* 标题 */
.title{
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
}

/* 内容 */
.section{
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}


/* 表单 */
.form-item {
  display: flex;
  flex-direction: row;
  height: 50px;
  //align-items: center;
  gap: 10px;
}
.form-ad {
  display: flex;
  flex-direction: row;
  height: 50px;
  align-items: center;
}

.form-item-tip {
  font-family: PingFang SC;
  font-size: 13px;
  color: #4E5969;
}

.form-item-img {
  height: 53px;
}
.form-item-input {
  width: 400px;
  height: 33px;
}
.form-item-btn {
  border-radius: 2px;
  opacity: 1;
  background: #591BB7;
  box-sizing: border-box;
  padding: 0 15px;
  border: 1px solid #000000;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  height: 33px;
  line-height: 33px;
  text-align: right;
  display: flex;
  align-items: center;
  letter-spacing: 0px;
  font-variation-settings: "opsz" auto;
  color: #FFFFFF;
  margin-left: 20px;
}

/*列表过滤*/
.filter-wrapper {
  display: flex;
  gap: 10px;
}

/*按钮*/
.btns{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
  padding-bottom: 15px;
}

.btn {
  padding: 0 15px;
  height: 36px;
  line-height: 36px;
  margin: 0;
}

/*表格*/
.el-table thead th{
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal!important;
  color:#737980;
}

.el-table thead th .cell{
  line-height: 2;
}

.el-table {
  --el-table-header-bg-color: #f5f6f7;
  --el-table-border: 1px solid #E1E1E1;
  --el-table-tr-bg-color: #fff;
}

/*分页*/
.table-pagination-block {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>