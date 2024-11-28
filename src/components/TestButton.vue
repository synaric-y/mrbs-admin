<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  status: {
    type: String,
    default: "untested",
  },
  untestedText: String,
  testingText: String,
  testedText: String,
});

const UNTESTED = "untested";
const TESTING = "testing";
const TESTED = "tested";

const btnText = computed(() => {
  switch (props.status) {
    case UNTESTED:
      return props.untestedText || t("base.untested");
    case TESTING:
      return props.testingText || t("base.testing");
    case TESTED:
      return props.testedText || t("base.tested");
  }
  return "";
});
</script>

<template>
  <el-button
    :disabled="status !== 'untested'"
    :loading="status === 'testing'"
    type="primary"
    style="margin-left: 10px"
    @click="$emit('test')"
  >
    {{ btnText }}
  </el-button>
</template>
