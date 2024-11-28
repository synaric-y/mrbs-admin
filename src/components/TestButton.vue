<script setup>
// el-button二次封装，有三种状态：未测试，测试中，已测试

import {computed} from "vue";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const props = defineProps({
  status:{
    type: String,
    default: "untested",
  },
  untestedText:{
    type: String,
    default: t('base.untested'),
  },
  testingText:{
    type: String,
    default: t('base.testing'),
  },
  testedText:{
    type: String,
    default: t('base.tested'),
  }
})
defineEmits(['test'])

const UNTESTED = 'untested'
const TESTING = 'testing'
const TESTED = 'tested'

const btnText = computed(() => {
  switch (props.status){
    case UNTESTED: return props.untestedText
    case TESTING: return props.testingText
    case TESTED: return props.testedText
  }
  return ''
})

</script>

<template>
  <el-button
      :disabled="status!==UNTESTED"
      :loading="status===TESTING"
      type="primary"
      style="margin-left: 10px"
      @click="$emit('test')"
  >
    {{btnText}}
  </el-button>
</template>

<style scoped lang="scss">

</style>