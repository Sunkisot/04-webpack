<template>
  <div>
    <gv-form :model="form" :rules="rules" ref="addForm" :col="3">
      <gv-form-item keyName="币别" prop="currency">
        <gv-select
          optionsSet="0"
          codeType="Currency"
          v-model="form.currency"
        ></gv-select>
      </gv-form-item>
    </gv-form>
    <el-button @click="handle">校验</el-button>
  </div>
</template>

<script>
export default {
  name: "useGvForm",
  data() {
    return {
      form: {},
      rules: {
        currency: [{ required: true, message: "必填项", trigger: "blur" }],
      },
    };
  },
  methods: {
    handle() {
      this.$refs.addForm.validate(isok => {})
    }
  }
};
</script>

<style>
</style>