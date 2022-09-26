<template>
  <transition name="fade">
    <el-checkbox
      v-bind="$attrs"
      v-model="code"
      :disabled="disabled"
      @change="updateValue()"
      :true-label='trueLabel'
      :false-label='falseLabel'
    >
      <slot></slot>
    </el-checkbox>
  </transition>
</template>

<script>
/**
 * check复选框
 * @author 计昕奇
 * @time 2019/05/05
 */
export default {
  name: "gvCheckbox",
  props: {
    value: [String, Boolean, Number],
    disabled: {
      type: Boolean,
      default: false,
    },
    'true-label': {
      type: [String, Boolean, Number],
      default: 1
    },
    'false-label': {
      type: [String, Boolean, Number],
      default: 0
    }
  },
  data: function data() {
    return {
      code: null,
    };
  },
  methods: {
    updateValue: function updateValue() {
      this.$emit("input", this.code);
      this.$emit("change", this.code);
      this.$emit("select", this.code);
    },
  },
  watch: {
    value: function value(val) {
      this.code = val;
    },
  },
  created: function created() {
    this.code = this.value
  },
};
</script>

<style lang='less' scoped>
.gv-checkbox-group.col {
  display: flex;
  flex-direction: column;
}
</style>