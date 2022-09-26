<template>
  <!--  -->
  <el-time-picker
    v-bind="$attrs"
    v-model="date"
    :format="format"
    :clearable='false'
    :value-format="valueFormat"
    :picker-options="pickerOptions"
    @change="changeDate($event)"
    placeholder="请选择时间"
    class="during"
  >
  </el-time-picker>
</template>

<script>
/**
 * 单个时间选择框
 * @author 计昕奇
 * @time 2017/11/08
 */
export default {
  name: "GvdatePicker",
  props: {
    value: null,
    timeLimit: null,
    rangeType: {
      type: String,
      default: "start",
    },
    format: {
      type: String,
      default: "HH:mm",
    },
    'value-format': {
      type: String,
      default: "HH:mm:ss",
    }
  },
  data: function (vm) {
    return {
      isReadonly: false,
      date: "",
      pickerOptions: {
        selectableRange: null,
      },
    };
  },
  methods: {
    test() {
      console.log(this.rangeType)
    },
    // 日期change
    changeDate(val) {
      this.$emit("input", val);
      this.$emit("change", val);
    },
    changeLimit() {
      this.pickerOptions = {
        selectableRange:
          this.rangeType == "end"
            ? `${this.timeLimit} - 23:59:59`
            : `00:00:00 - ${this.timeLimit}`,
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
    this.timeLimit&&this.changeLimit();
  },
};
</script>

<style>
</style>