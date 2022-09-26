<template>
  <div class="wrapper pd20">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="开始时间" prop="startTime">
        <gv-time-picker v-model="ruleForm.startTime" rangeType='start' placeholder="选择日期" :timeLimit='ruleForm.endTime'>
        </gv-time-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <gv-time-picker v-model="ruleForm.endTime" rangeType='end' placeholder="选择日期" :timeLimit='ruleForm.startTime'>
        </gv-time-picker>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: "useGvdatePicker",
  data() {
    return {
      ruleForm: {
        startTime: "09:00:00",
        endTime: "09:00:00",
      },
      rules: {},
      value1: "",
    };
  },
  methods: {
    change(val) {
      console.log(val);
      console.log(this.ruleForm.startTime);
    },
  },
};
</script>

<style>
</style>