<template>
  <el-dialog class="gv-Dialog" :visible.sync="dialogVisible" v-bind="$attrs">
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #default>
      <slot></slot>
    </template>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script>
/**
 * dialog弹窗
 * @author 计欣奇
 * @time 2020/11/08
 */
export default {
  name: "GvDialog",
  props: {
    visible: {
      type: [Boolean],
      default: false,
    },
  },
  data: function data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {},
  watch: {
    visible: {
      handler(val) {
        this.dialogVisible = val;
      },
      immediate: true,
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
  },
  mounted: function mounted() {},
  created: function created() {},
};
</script>

<style lang='less' scoped>
.gv-Dialog /deep/.el-dialog__header {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  padding-left: 20px;
}
.gv-Dialog /deep/.el-dialog__body {
  padding: 5px;
}
.gv-Dialog /deep/.el-dialog__footer {
  padding: 10px;
}
</style>