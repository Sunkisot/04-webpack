<template>
  <el-collapse-item
    v-bind="$attrs"
    class="gv-collapse-item"
    :disabled="disabled"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <slot></slot>
  </el-collapse-item>
</template>

<script>
/**
 * 折叠面板组件Item
 * @author 计昕奇
 * @time 2020/11/08
 */

export default {
  name: "GvCollapseItem",
  inject: ["gvCollapse"],
  data() {
    return {
      disabled: false,
    };
  },
  mounted() {
    this.disabled = this.gvCollapse.disabled;
  },
};
</script>

<style lang='less' scoped>
.gv-collapse-item /deep/.el-collapse-item__arrow {
  display: none;
}
.gv-collapse-item /deep/.el-collapse-item__header {
  font-size: 14px;
  // &:last-child {
  //   border-bottom: none;
  // }
}

.gv-collapse-item.is-disabled /deep/.el-collapse-item__header {
  color: #303133;
  cursor: pointer;
  padding-left: 20px;
}
</style>