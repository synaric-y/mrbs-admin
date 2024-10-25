<script setup>
defineProps(['activeIndex'])

const steps = [
  {
    id: 1,
    title: '用户同步配置',
    tip: '此配置允许您正在使用的第三方服务同步用户数据到本系统，您可以自定义同步行为与同步的范围。'
  },
  {
    id: 2,
    title: '日历同步配置',
    tip: '此配置允许您正在使用的第三方服务同步用户数据到本系统，您可以自定义同步行为与同步的范围。'
  },
  {
    id: 3,
    title: '添加会议室',
    tip:'添加您的第一个会议室'
  },
  {
    id: 4,
    title: '完成',
  }
]
</script>

<template>
  <div class="guide-progress">
    <div class="guide-item" v-for="item in steps" :key="item.id">

      <span v-if="item.id<activeIndex" class="guide-number guide-number-previous">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1" width="12" height="12" viewBox="0 0 12 12"><g><g></g><g><path d="M10.428003926753998,2.026165065261841C10.230443926753997,1.8286115652618409,9.909333926753998,1.8312712652618408,9.715083926753998,2.032071065261841L4.494803926753997,7.428258065261841L2.5054939267539975,5.438938065261841C2.3102339267539977,5.243678065261841,1.9936539267539979,5.243678065261841,1.7983889267539976,5.438938065261841L1.0912819267539977,6.146048065261841C0.8960200267539978,6.341308065261841,0.8960200267539978,6.657898065261841,1.0912819267539977,6.853158065261841L3.9197039267539977,9.68157806526184C3.9323139267539977,9.69418806526184,3.945433926753998,9.705988065261842,3.958983926753998,9.716968065261842L4.160693926753998,9.91867806526184C4.3582539267539975,10.116228065261842,4.679333926753998,10.11358806526184,4.873593926753998,9.91279806526184L11.140803926753998,3.434378065261841C11.330603926753998,3.2382280652618407,11.328003926753997,2.926158065261841,11.135003926753997,2.733178065261841L10.428003926753998,2.026165065261841Z" fill-rule="evenodd" fill="#591BB7" fill-opacity="1"/></g></g></svg>
      </span>
      <span v-else :class="activeIndex==item.id?'guide-number guide-number-active':'guide-number'">
        {{item.id}}
      </span>
      <span :class="activeIndex==item.id?'guide-title guide-title-active':'guide-title'">{{item.title}}</span>
    </div>
  </div>
  <div v-if="steps[activeIndex-1].tip" class="guide-tips">{{steps[activeIndex-1].tip}}</div>
</template>

<style scoped>
.guide-progress {
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 72px;
}

.guide-item {
  display: flex;
  gap: 12px;
}

.guide-number {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 14px;
  opacity: 1;
  background: #F2F3F5;
  color: #4E5969;
}

.guide-number-active {
  background: #591BB7;
  color: #FFFFFF;
}

.guide-number-previous{
  background-color: #cdbae9;
  color: #5a1db7;
}

.guide-title {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: 0px;
  color: #4E5969;
}

.guide-title-active {
  color: #591BB7;
}

.guide-tips {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0px;
  font-variation-settings: "opsz" auto;
  color: #3D3D3D;
  margin-top: 40px;
  align-self: center;
}
</style>