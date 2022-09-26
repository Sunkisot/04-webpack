<template>
  <div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="开始时间" prop="startDate">
        <gv-date-picker v-model="ruleForm.startDate" rangeType='start' placeholder="选择日期" :timeLimit='ruleForm.endDate'>
        </gv-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endDate">
        <gv-date-picker v-model="ruleForm.endDate" rangeType='end' placeholder="选择日期" :timeLimit='ruleForm.startDate'>
        </gv-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "useGvDatePicker",
  data() {
    return {
      ruleForm: {
        startDate: '2021-11-12',
        endDate: ''
      },
      rules: {}
    };
  },
  methods: {
    change(val) {
      console.log(val)
      console.log(this.ruleForm.startDate)
    }
  }
};
</script>

<style>
</style>