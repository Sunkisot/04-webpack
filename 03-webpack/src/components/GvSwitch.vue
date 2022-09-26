<template>
  <div class="gv-switch">
    <el-switch
      v-bind="$attrs"
      v-model="code"
      @change="onChange"
      :active-value="activeValue"
      :inactive-value="inactiveValue"
    ></el-switch>
    <div v-if="tip_txt" class="tip">{{ tip_txt }}</div>
  </div>
</template>

<script>
/**
 * switch开关
 * @author 计欣奇
 * @time 2020/11/08
 */
export default {
  name: "GvSwitch",
  props: {
    value: null,
    tip_txt: {
      type: String,
      default: "",
    },
    "active-value": {
      type: [String, Boolean, Number],
      default: 1,
    },
    "inactive-value": {
      type: [String, Boolean, Number],
      default: 0,
    },
  },
  data() {
    return {
      code: null,
    };
  },
  methods: {
    onChange(e) {
      this.$emit("input", e);
      this.$emit("change", e);
    },
  },
  watch: {
    value: {
      handler(val) {
        this.code = val;
      },
      deep: true,
    },
  },
  created() {
    this.code = this.value;
  }
};
</script>

<style lang='less' scoped>
.gv-switch /deep/.tip {
  font-size: 12px;
  line-height: 1.5;
  color: #aaaaaa;
}
</style>