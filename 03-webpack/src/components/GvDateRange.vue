<template>
  <div class="gv-date-range">
    <el-form-item :prop="startProp">
      <gv-date-picker
        v-model="startDate"
        type="date"
        rangeType="start"
        placeholder="开始时间"
        @change="handleChange"
        value-format="yyyy-MM-dd"
        :timeLimit="endDate"
        :clearable="false"
        prefix-icon=""
      >
      </gv-date-picker>
    </el-form-item>
    <span style="position: relative; top: 0px; right: 0px; padding: 0 5px"
      >-</span
    >
    <el-form-item :prop="endProp">
      <gv-date-picker
        v-model="endDate"
        type="date"
        rangeType="end"
        @change="handleChange"
        placeholder="结束时间"
        value-format="yyyy-MM-dd"
        :timeLimit="startDate"
        :clearable="false"
        prefix-icon=""
      >
      </gv-date-picker>
    </el-form-item>
  </div>
</template>

<script>
/**
 * 日期区间
 * @author 计欣奇
 * @time 2020/11/08
 */
export default {
  name: "GvDateRange",
  props: {
    start: {},
    end: {},
    startProp: {
      type: String,
    },
    endProp: {
      type: String,
    },
  },
  data: function (vm) {
    return {
      startDate: "",
      endDate: "",
    };
  },
  methods: {
    handleChange() {
      this.$emit("update:start", this.startDate);
      this.$emit("update:end", this.endDate);
    },
  },
  watch: {
    start: {
      handler(val) {
        this.startDate = val;
      },
      immediate: true,
    },
    end: {
      handler(val) {
        this.endDate = val;
      },
      immediate: true,
    },
  },
  created() {},
};
</script>

<style lang='less' scoped>
.gv-date-range {
  display: flex;
  .el-form-item {
    margin-right: 0;
  }
}
</style>