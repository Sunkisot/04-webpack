<template>
  <transition name="fade">
    <el-checkbox-group
      :class="['gv-checkbox-group', { col: mode == 'col' }]"
      v-model="code"
      :disabled="disabled"
      size="mini"
      @change="updateValue()"
    >
      <el-checkbox
        v-for="item in options"
        :key="item.code"
        :label="item.code"
        >{{ item.name }}</el-checkbox
      >
    </el-checkbox-group>
  </transition>
</template>

<script>
/**
 * check-group复选框
 * @author 计昕奇
 * @time 2019/05/05
 */
import { getSelectList } from "@/api/system/gvSelect";
export default {
  name: "gvCheckboxGroup",
  props: {
    value: Array,
    codeType: String,
    mode: {
      type: String,
      default: "row",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: Array,
      default: () => [],
    },
    isCache: {
      type: Boolean,
      default: true,
    },
    optionType: {
      type: String,
      default: "",
    },
  },
  data: function data() {
    return {
      code: [],
      options: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        this.code = val || [];
      },
      deep: true,
    },
    codeType: function codeType(val) {
      if (val) {
        this.initData();
      }
    },
  },
  created: function created() {
    this.code = this.value || [];
    this.initData();
  },
  methods: {
    updateValue: function updateValue() {
      this.$emit("input", this.code);
      this.$emit("change", this.code);
    },
    initData: function initData() {
      var list = this.gvUtil.options[this.optionType] || [];
      this.options = this.formatData(list);
    },
    formatData: function formatData(data) {
      for (var t in data) {
        if (data[t]["code"] === (this.value || this.defaultValue)) {
          this.code = data[t]["code"];
          this.updateValue();
        }
      }
      return data;
    },
  },
};
</script>

<style lang='less' scoped>
.gv-checkbox-group.col {
  display: flex;
  flex-direction: column;
}
</style>