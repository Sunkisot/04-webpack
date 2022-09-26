<template>
  <section>
    <gv-data-table
      ref="table"
      v-bind="$attrs"
      v-on="$listeners"
      :table="table"
      :required="required"
      :paging="paging"
      :isSerial="isSerial"
      :isSelection="isSelection"
      :rowKey="rowKey"
      :border="border"
    >
      <gv-data-column
        v-for="(v, index) in table.head"
        :key="index"
        :prop="v"
        :paging="paging"
        :isReadonly="isReadonly"
        :rules="rules"
        :validReadonly='validReadonly'
      >
      </gv-data-column>
      <slot></slot>
      <template #toolBtn>
        <slot name="toolBtn"></slot>
      </template>
    </gv-data-table>
  </section>
</template>

<script>
/**
 * 复合gvDataColumn和gvDataTable的组件
 * @author 计昕奇
 * @time 2020/11/08
 */
import GvDataTable from './GvDataTable.vue'
import GvDataColumn from './GvDataColumn.vue'
export default {
  name: 'GvColumnTable',
    components: {
      GvDataTable,
      GvDataColumn
    },
    props: {
      table: { // 表格数据
        type: Object,
        required: true
      },
      rules: { // 校验规则
        type: Object
      },
      isReadonly: {  // 整个表格只读
        type: Boolean,
        default: () => false
      },
      required: { // 是否开启默认校验
        type: Boolean,
        default: () => false
      },
      paging: { // 是否分页
        type: Boolean,
        default: () => false
      },
      isSerial: { // 是否有序号
        type: Boolean,
        default: () => false
      },
      isSelection: { // 是否可复选
        type: Boolean,
        default: () => false
      },
      rowKey: { // 复选的rowKey
        type: Array,
      },
      border: { // 是否开启table边框 可拖拽
        type: Boolean,
        default: () => false
      },
      validReadonly: Function,
    },
    data: function () { // 双向绑定页面显示数据
      return {
        list: [],
        multipleSelection: [], // 多选数据
      }
    },
    methods: {
      // 清除校验
      clearValid() {
        this.$refs.table.clearValid()
      },
      // 模版下载
      downTemp() {
        this.$refs.table.downTemp()
      },
      // 清单导出
      exportList() {
        this.$refs.table.exportList()
      },
      // 获取勾选数据
      getSelection() {
        return this.$refs.table.getSelection()
      },
      // 获取表格数据
      getData() {
        return this.$refs.table.getData()
      },
      selectedList() {
        return this.$refs.table.selectedList()
      },
      // 表格校验
      validForm() {
        return this.$refs.table.validForm()
      },
      toggleAllSelection() {
        return this.$refs.table.toggleAllSelection()
      },
      toggleRowSelect(rows) {
        return this.$refs.table.toggleRowSelect(rows)
      }
    },
    watch: {
    },
    created() {
    }
};
</script>

<style>
</style>