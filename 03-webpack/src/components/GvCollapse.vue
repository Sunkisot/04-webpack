<template>
  <el-collapse
    ref="gv-collapse"
    class="gv-collapse"
    v-bind="$attrs"
    v-model="code"
    @change="handleChange"
  >
    <slot></slot>
  </el-collapse>
</template>

<script>
/**
 * 折叠面板组件
 * @author 计昕奇
 * @time 2020/11/08
 */
import $ from "jquery";
export default {
  name: "GvCollapse",
  provide: function provide() {
    return {
      gvCollapse: this,
    };
  },
  props: {
    value: {
      type: Array,
      default: () => ["1", "2", "3", "4", "5", "6"],
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      code: [],
    };
  },
  methods: {
    handleChange() {
      this.$emit("input", this.code);
      this.$emit("change", this.code);
    },
    handleOpenAll() {
      let child_nodes = this.$refs["gv-collapse"].$slots.default || [];
      if (child_nodes) {
        this.code = child_nodes.reduce((t, e) => {
          t.push(e.data.attrs.name);
          return t;
        }, []);
      }
    },
  },
  watch: {
    value: {
      handler: function value(val, old) {
        this.code = val;
      },
      immediate: true,
    },
  },
  mounted() {
    let ele = $(".gv-collapse-item .el-collapse-item__wrap");
    ele[ele.length - 1].style.border = "none";
    // console.log();
    // this.openAll && this.handleOpenAll()
  },
};
</script>

<style lang='less' scoped>
.el-collapse {
  border: none;
}
.el-collapse-item__wrap {
  &:last-child {
    border-bottom: none;
  }
}
</style>