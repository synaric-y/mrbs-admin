<script>
import {PageMixin} from "@/pages/PageMixin.js";
import {Api} from "@/network/api.js";
import {ElMessage} from "element-plus";

export default {
  mixins: [PageMixin],
  data() {
    return {
      mode: 'update',
      form: {
        name: '',
        display_name: '',
        level: 1,
        email: '',
        password0: '',
        password1: ''
      },
      rules: {
        name: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
        ],
        display_name: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
        ],
      },
      rules2: {
        name: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
        ],
        display_name: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
        ],
        password0: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
        ],
        password1: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'},
          {
            validator: (rule, value, callback, source, options) => {
              const errors = [];
              if (this.form["password0"] != value) {
                errors.push(new Error(this.$t('user.password1Hint')))
              }
              return errors;
            },
          },
        ],
      },
      role: [
        // {
        //   name: this.$t('user.role.level0'),
        //   value: 0,
        // },
        {
          name: this.$t('user.role.level1'),
          value: 1,
        },
        {
          name: this.$t('user.role.level2'),
          value: 2,
        }
      ]
    }
  },
  methods: {
    submit() {
      this.$refs.userForm.validate((pass) => {
        if (!pass) {
          return
        }
        if (this.form.password0 && this.form.password0 != this.form.password1) {
          ElMessage.error(this.$t('user.password1Hint'))
          return;
        }
        let callAPi = this.mode == 'add' ? Api.addUser : Api.updateUser
        callAPi(this.form).then(({data, code, message}) => {
          if (code == 0) {
            ElMessage({
              message: this.$t('base.editSuccess'),
              type: 'success',
            })
            this.back()
          } else {
            ElMessage.error(message)
          }
        }).catch(() => {
          ElMessage.error(this.$t('base.editFailed'))
        })
      })
    }
  },
  mounted() {
    let {id, mode} = this.$route.params
    this.mode = mode
    if (mode == 'update') {
      Api.getUserById({id: Number(id)}).then(({data}) => {
        if (!data) {
          return
        }
        data["level"] = Number(data["level"])
        this.form = data
      })
    }
  }
}
</script>

<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-title-wrapper">
        <div class="sub-title">{{ mode === "add" ? $t("user.addUser") : $t("user.editUser") }}</div>
      </div>

      <el-form :model="form" :rules="mode == 'add' ? rules2 : rules" :validate-on-rule-change="false" label-width="auto" ref="userForm" style="max-width: 530px">

        <el-form-item prop="name" :label="$t('user.formUser.name')" >
          <el-input v-model="form.name" show-word-limit maxlength="16" :disabled="mode == 'update'" />
        </el-form-item>

        <el-form-item prop="display_name" :label="$t('user.formUser.displayName')">
          <el-input v-model="form.display_name" show-word-limit maxlength="16" />
        </el-form-item>

        <el-form-item prop="level" :label="$t('user.formUser.level')">
          <el-select v-model="form.level" :placeholder="$t('base.plzSelect')" :disabled="mode == 'update'">
            <el-option :label="item.name" :value="item.value" v-for="(item, index) in role" :key="index"/>
          </el-select>
        </el-form-item>

        <el-form-item prop="email" :label="$t('user.formUser.email')">
          <el-input v-model="form.email" show-word-limit maxlength="64" />
        </el-form-item>

        <el-form-item prop="password0" :label="$t('user.formUser.password0')">
          <el-input v-model="form.password0" show-word-limit maxlength="32" />
        </el-form-item>

        <el-form-item prop="password1" :label="$t('user.formUser.password1')">
          <el-input v-model="form.password1" show-word-limit maxlength="32" />
        </el-form-item>

        <el-form-item style="margin-top: 60px">
          <el-button type="info" size="default" @click="back">{{ $t("base.cancel") }}</el-button>
          <el-button type="primary" size="default" @click="submit">{{ $t("base.confirm") }}</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>