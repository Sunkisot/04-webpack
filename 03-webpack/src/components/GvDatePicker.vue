<template>
  <el-date-picker
    class="date-picker"
    v-bind="$attrs"
    format="yyyy-MM-dd"
    value-format="yyyy-MM-dd"
    :picker-options="pickerOptions"
    @change="changeDate($event)"
    v-model="date"
    clearable
  ></el-date-picker>
</template>

<script>
/**
 * 单个日期选择框
 * @author 计昕奇
 * @time 2017/11/08
 */
export default {
  name: "GvDatePicker",
  props: {
    value: null,
    timeLimit: null,
    rangeType: {
      type: String,
      default: "start",
    },
    "desabled-before": {
      type: Boolean,
      default: false,
    },
  },
  data: function (vm) {
    return {
      isReadonly: false,
      date: "",
      pickerOptions: {},
    };
  },
  methods: {
    test() {
      // this.$refs.table.validate()
    },
    // 日期change
    changeDate(val) {
      this.$emit("input", val);
      this.$emit("change", val);
    },
    changeLimit() {
      this.pickerOptions = {
        disabledDate: (time) => {
          if (this.timeLimit) {
            return (() => {
              if(this.rangeType == "end") {
                if(!this.desabledBefore) {
                  return time.getTime() < new Date(this.timeLimit)
                }else {
                  return new Date() < new Date(this.timeLimit) ? time.getTime() < new Date(this.timeLimit) : time.getTime() < new Date()
                }
              }else {
                if(!this.desabledBefore) {
                  return time.getTime() > new Date(this.timeLimit);
                }else {
                  return time.getTime() > new Date(this.timeLimit) || time.getTime() < new Date()
                }
              }
            })()
          } else if (this.desabledBefore) {
            return time.getTime() < new Date();
          }
        },
      };
    },
  },
  watch: {
    timeLimit(val) {
      this.changeLimit();
    },
    value(val) {
      this.date = val;
    },
  },
  created() {
    this.date = this.value;
    if (this.timeLimit) {
      this.changeLimit();
    } else if (this.desabledBefore) {
      this.changeLimit();
    }
  },
};
</script>

<style lang='less' scoped>
.date-picker /deep/ .el-input__inner{
  padding: 0 26px;
}
.date-picker /deep/ .el-input__prefix{
  left: 3px;
}
.date-picker /deep/ .el-input__suffix{
  right: 3px;;
}
</style>