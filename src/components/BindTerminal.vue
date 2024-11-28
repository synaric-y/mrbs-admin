<template>
  <div class="mask">
    <div class="content">
      <div class="title">{{ $t('meet.bind_terminal') }}</div>
      <el-form ref="terminalForm" :model="terminalForm" :rules="terminal_rules">
        <el-form-item :label="$t('meet.terminal')" prop="device_id" required>
          <el-select style="min-width: 120px" v-model="terminalForm.device_id" :placeholder="$t('meet.terminal')">
            <el-option v-for="item in avaliableDevices" style="min-width: 120px;z-index: 99999" :key="item.device_id"
              :label="item.device_name" :value="item.device_id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="sureBindTerminal">{{ $t('base.confirm') }}</el-button>
        <el-button @click="$emit('close')">{{ $t('base.cancle') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { ElMessage } from "element-plus";

export default {
  computed: {
  },
  mixins: [PageMixin],
  props: ['room_id'],
  emits: ['close'],
  name: 'BindTerminal',
  data() {
    return {
      terminalForm: {
        device_id: '',
      },
      avaliableDevices: [],
      rules: {
        device_id: [
          { required: true, message: this.$t('meet.select_device'), trigger: 'blur' }
        ],
      },
    }
  },
  methods: {
    getAvaliableDevices() {
      Api.getAvailableDevices().then(({ data, code, msg }) => {
        if (code == 0 && data) {
          this.avaliableDevices = data
        }
      })
    },
    sureBindTerminal() {
      this.$refs.terminalForm.validate((pass) => {
        if (!pass) {
          return
        }
        Api.bindDevice({ device_id: this.terminalForm.device_id, room_id: this.room_id }).then(({ data, code, msg }) => {
          if (code == 0) {
            this.$emit('close')
          } else {
            ElMessage.error(msg)
          }
        })
      })
    },

  },
  created() {
    this.getAvaliableDevices()
  },

  mounted() {
    console.log('BindTerminal mounted room_id:', this.room_id)
  },

  unmounted() {

  }
}
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  background-color: rgba(0, 0, 0, .3);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);

  .content {
    width: 30%;
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