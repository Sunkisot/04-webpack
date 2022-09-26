<template>
  <transition name="fade">
    <el-radio-group
      :class="['gv-radio-group', { col: mode == 'col' }]"
      :disabled="disabled"
      size="mini"
      @change="onChange"
      v-model="code"
    >
      <el-radio v-for="item in list" :key="item[codeName]" :label="item[codeName]">{{
        item[labelName]
      }}</el-radio>
    </el-radio-group>
  </transition>
</template>

<script>
/**
 * Radio单选框
 * @author 计昕奇
 * @time 2019/05/05
 */
export default {
  name: "gvRadioGroup",
  props: {
    value: [String, Number],
    codeType: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: [String, Number],
      default: "",
    },
    isCache: {
      type: Boolean,
      default: true,
    },
    optionType: {
      type: String,
      default: "",
    },
    options: {
      type: Array,
      default: null,
    },
    codeName: {
      // code绑定字段
      type: String,
      default: "code",
    },
    labelName: {
      // label绑定字段
      type: String,
      default: "name",
    },
    mode: {
      type: String,
      default: "row",
    },
  },
  data: function data() {
    return {
      code: 1,
      list: [],
    };
  },
  watch: {
    value: function value(val) {
      this.code = val;
    },
    codeType: function codeType(val) {
      if (val) {
        this.initData();
      }
    },
    options: {
      handler(val, old) {
        this.initData();
      },
      deep: true,
    },
  },
  created: function created() {
    this.code = this.value;
    this.initData();
  },
  methods: {
    updateValue: function updateValue() {
      this.$emit("input", this.code);
      this.$emit("change", this.code);
    },
    onChange() {
      this.$emit("input", this.code);
      this.$emit("select", this.code);
    },
    initData: function initData() {
      if (this.optionType) {
        var list = this.gvUtil.options[this.optionType] || [];
      } else if (this.options) {
        var list = this.options;
      }
      this.list = this.formatData(list);
    },
    formatData: function formatData(data) {
      for (var t in data) {
        if (data[t][this.codeName] === (this.value || this.defaultValue)) {
          this.code = data[t][this.codeName];
          this.updateValue();
        }
      }
      return data;
    },
  },
};
</script>

<style lang='scss' scoped>
.gv-radio-group.col {
  display: flex;
  flex-direction: column;
  label {
    margin: 10px 0;
  }
}
</style>