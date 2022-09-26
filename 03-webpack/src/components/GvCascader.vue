<template>
  <transition name="fade">
    <el-cascader
      v-bind="$attrs"
      v-model="code"
      :placeholder="placeholder"
      @change="change"
      filterable
      collapse-tags
    ></el-cascader>
  </transition>
</template>

<script>
/**
 * 多级联动选择框
 * @author 计欣奇
 * @time 2020/10/18
 */
export default {
  name: "gvCascader",
  props: {
    value: null,
    placeholder: {
      type: String,
      default: () => '请选择'
    }
  },
  data: function data() {
    return {
      code: null,
      
    };
  },
  methods: {
    change() {
      this.$emit('input', this.code)
      this.$emit('change', this.code)
    },
  },
  watch: {
    value: {
      handler: function value(val, old) {
        this.code = val;
      },
      immediate: true
    }
     
  },
  mounted: function mounted() {},
  created: function created() {},
};
</script>

<style>
</style>
