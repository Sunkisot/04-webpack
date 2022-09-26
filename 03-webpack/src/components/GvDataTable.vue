<template>
  <section>
    <el-form :model="table" ref="table" class="gvDataTable">
      <el-table
        id="table"
        ref="tTable"
        class="formTable"
        v-bind="$attrs"
        :border="border"
        :data="
          paging
            ? table.tableData.slice(
                (table.page.currentPage - 1) * table.page.pageSize,
                table.page.currentPage * table.page.pageSize
              )
            : table.tableData
        "
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        @select="selectChange"
        :row-key="getRowKey"
        
      >
        <el-table-column
          v-if="isSelection"
          type="selection"
          :reserve-selection="true"
          width="55"
        >
        </el-table-column>
        <el-table-column
          v-if="isSerial"
          type="index"
          :label="'gNumber' | translate('SequenceNo')"
          :index="indexMethod"
          width="55"
        >
        </el-table-column>
        <slot></slot>
      </el-table>
    </el-form>
    <el-row style="padding: 10px 2px; overflow: hidden">
      <slot name="toolBtn"></slot>
      <el-pagination
        v-if="paging"
        style="float: right"
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="table.page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="table.tableData.length"
        :current-page.sync="table.page.currentPage"
      >
      </el-pagination>
    </el-row>
  </section>
</template>

<script>
/**
 * gvDataTable
 * @author 计昕奇
 * @time 2020/11/08
 */
export default {
  name: "GvDataTable",
  props: {
    table: {
      // 表格数据
      type: Object,
      required: true,
    },
    rules: {
      // 校验规则
      type: Object,
    },
    required: {
      // 是否开启默认校验
      type: Boolean,
      default: false,
    },
    paging: {
      // 是否分页
      type: Boolean,
      default: false,
    },
    isSerial: {
      // 是否有序号
      type: Boolean,
      default: false,
    },
    isSelection: {
      // 是否可复选
      type: Boolean,
      default: false,
    },
    rowKey: {
      // 复选的rowKey
      type: Array,
      default: () => [],
    },
    border: {
      // 是否开启table边框 可拖拽
      type: Boolean,
      default: false,
    },
  },
  datas: function () {
    // 双向绑定页面显示数据
    return {
      list: [],
      isReadonly: false,
      multipleSelection: [], // 多选数据
    };
  },
  methods: {
    // rowKey
    getRowKey(row) {
      return this.rowKey.reduce((str, v) => {
        return str + row[v];
      }, "");
    },
    // 模版下载
    downTemp() {
      this.gvUtil.exportExcel(
        this.$refs.tTable,
        "table",
        null,
        "excel",
        ["operation"],
        (val) => {
          val.datas[0].sheetData = [{}];
        }
      );
    },
    // 清单导出
    exportList() {
      this.gvUtil.exportExcel(this.$refs.tTable, "table", null, "excel", [
        "operation",
      ]);
    },
    // 勾选全部方法
    toggleAllSelection() {
      this.$refs.tTable.toggleAllSelection();
    },
    //获取选择项
    getSelection() {
      return this.multipleSelection;
    },
    // 获取表格数据
    getData() {
      return this.table.tableData;
    },
    // 获取勾选数据并清空
    selectedList() {
      let a = JSON.parse(JSON.stringify(this.multipleSelection));
      this.$refs.tTable.clearSelection();
      this.multipleSelection = [];
      return a;
    },
    // 勾选change
    selectChange(selection, row) {
      this.$emit("select", { selection, row });
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("selection-change", val);
    },
    // 勾选
    toggleRowSelect(rows) {
      return new Promise((resolve, reject) => {
        const _this = this;
        if (rows.length > 0) {
          this.$nextTick(() => {
            rows.forEach((row) => {
              _this.$refs.tTable.toggleRowSelection(row, true);
            });
            resolve()
          });
        } else {
          this.$refs.tTable.clearSelection();
          resolve()
        }
        this.$forceUpdate();
      });
    },
    // 序号
    indexMethod(index) {
      index =
        index +
        1 +
        (this.table.page.currentPage - 1) * this.table.page.pageSize;
      return index;
    },

    // 每页多少条
    onHandleSizeChange(val) {
      this.table.page.pageSize = val;
      this.$refs.table.clearValidate();
    },
    // 当前页
    onHandleCurrentChange(val) {
      this.$refs.table.clearValidate();
    },
    // 清除校验
    clearValid() {
      this.$refs.table.clearValidate();
    },
    // 表格校验
    validForm() {
      var flag = false;
      var flagForm = false;
      var type = false;
      console.log(this.$refs);
      this.$refs.table.validate((valid, model) => {
        flag = valid;
      });
      var columns = this.$refs.tTable.columns,
        columnsRules = [];
      if (this.required) {
        columns.forEach((e) => {
          if (e.property && e.property != "operation") {
            columnsRules.push(e.property);
          }
        });
        // debugger
        columnsRules;
        flagForm = this.table.tableData.find((e, i) => {
          for (v of columnsRules) {
            if (e[v] !== 0 && !e[v]) {
              // debugger
              type = true;
              break;
            }
          }
          return type;
        })
          ? false
          : true;
        // debugger
        return flag && flagForm;
      } else {
        return flag;
      }
    },
    // 初始化方法
    initData(list, multiData, clear) {
      this.$refs.tTable.clearSelection();
      setTimeout(() => {
        this.toggleRowSelect(multiData, true);
      }, 0);
    },
  },
  watch: {},
  created() {},
};
</script>

<style scoped>
/* 表单验证错误提示 */
.el-form-item__content {
  position: relative;
}
.gvDataTable /deep/ .el-form-item__error {
  position: absolute !important;
  padding-top: 2px;
}
.gvDataTable /deep/ .el-table__body-wrapper .cell {
  padding: 15px 5px;
}
.gvDataTable /deep/ td {
  padding: 0;
}
.gvDataTable /deep/ .el-table-column--selection .cell {
  padding-left: 10px;
}
.gvDataTable /deep/ .el-form-item {
  margin-bottom: 0;
}
.gvDataTable /deep/.holdDust {
    background: #F5F7FA;
  }

</style>