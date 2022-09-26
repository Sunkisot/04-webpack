<template>
  <section style="margin-top: 20px">
    <gv-column-table
      ref="table"
      :table="table"
      :rules="rules"
      isSerial
      paging
      isSelection
      rowKey="id"
      border
      :isReadonly="isReadonly"
    >
      <el-table-column>
        <template #default="{ row }">
          <el-button
            type="danger"
            icon="el-icon-minus"
            @click="handleDel(row.key)"
          ></el-button>
        </template>
      </el-table-column>
      <template #toolBtn>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
        ></el-button>
      </template>
    </gv-column-table>
    <el-row type="flex" justify="center">
      <el-button type="warning" @click="handleSave">保存</el-button>
    </el-row>
  </section>
</template>

<script>
export default {
  name: "useGvColumnTable",
  data() {
    return {
      isReadonly: false,
      table: {
        page: {
          currentPage: 1,
          pageSize: 10,
        },
        tableData: [],
        head: [
          {
            dataEname: "inspectionContent", // 检验内容
            infoCode: "inspectionDetail",
            readonly: "1", // 只读
            config: {
              textarea: "true",
              type: "input",
              maxlength: "2000",
            },
          },
          {
            dataEname: "remark", // 备注
            infoCode: "remark",
            readonly: "1", // 只读
            config: {
              textarea: "true",
              type: "input",
              maxlength: "2000",
            },
          },
        ],
      },
      rules: {
        inspectionContent: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleAdd() {
      var len = this.table.tableData.length;
      this.table.tableData.push({
        id: new Date().getTime(),
        key: len,
      });
    },
    handleDel(key) {
      var i = this.table.tableData.findIndex(e => e.key == key)
      this.table.tableData.splice(i, 1)
    },
    handleSave() {
      this.$refs.table.validForm()
    },
  },
};
</script>

<style>
</style>