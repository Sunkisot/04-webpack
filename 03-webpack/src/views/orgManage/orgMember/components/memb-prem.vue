<template>
  <div class="connect-box">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="roleName" label="成员角色" width="180">
      </el-table-column>
      <el-table-column prop="insurerCount" label="保险公司" width="180">
        <template #default="{ row }">{{
          row.insurerCount + "家保险公司"
        }}</template>
      </el-table-column>
      <el-table-column prop="mechanismCount" label="机构">
        <template #default="{ row }">{{
          row.mechanismCount + "家机构"
        }}</template>
      </el-table-column>
      <el-table-column prop="operation" label="操作">
        <template #default="{ row, $index }">
          <el-button class="mr10" type="text" @click="handleEdit(row, $index)"
            >编辑</el-button
          >
          <el-button
            class="mr10 txt-red-btn"
            type="text"
            @click="handleDel($index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-button
      class="mt10"
      type="primary"
      icon="el-icon-plus"
      @click="handleAdd"
      >添加一条成员权限</el-button
    >
    <el-drawer
      class="drawer"
      :visible.sync="drawerVisible"
      direction="rtl"
      :before-close="handleClose"
      size="700px"
    >
      <template #title>
        <span class="f-14 f-500 c-000">成员权限配置</span>
      </template>
      <drawer-content ref="drawerContent" :formData='formData'></drawer-content>
      <div class="bottom_btn">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import drawerContent from "./drawer-content";
export default {
  name: "memb-prem",
  components: {
    drawerContent,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    formData: {
      type: Object,
    },
  },
  data() {
    return {
      type: "add",
      editIndex: 0,
      drawerVisible: false, // 抽屉是否展开
      tableData: [],
    };
  },
  methods: {
    getTableData() {
      return this.tableData;
    },
    // 保存
    handleSave() {
      let form = this.$refs.drawerContent.getForm();
      form.mechanismCount = form.mechanismIdList.length;
      form.insurerCount = form.insurerList.length;
      if (!form.roleId) {
        this.$message.warning("请选择成员角色！");
        return;
      }
      if (!form.insurerCount) {
        this.$message.warning("请选择至少一个保险公司！");
        return;
      }
      if (!form.mechanismCount) {
        this.$message.warning("请选择至少一个子机构！");
        return;
      }
      if (this.type == "add") {
        this.tableData.push(form);
      } else {
        this.$set(this.tableData, this.editIndex, form);
      }
      this.drawerVisible = false;
    },
    // 抽屉关闭回掉
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 添加
    async handleAdd() {
      if (!this.formData.mechanismId) {
        this.$message.warning("请先选择归属机构");
        return;
      }
      this.type = "add";
      this.drawerVisible = true;
      await this.$nextTick();
      this.$refs.drawerContent.initComponent(
        {
          roleId: "",
          insurerList: [],
          mechanismIdList: [],
        },
        this.formData
      );
    },
    // 编辑
    async handleEdit(row, i) {
      this.type = "edit";
      this.editIndex = i;
      this.drawerVisible = true;
      await this.$nextTick();
      this.$refs.drawerContent.initComponent(row, this.formData);
    },
    // 删除
    handleDel(i) {
      this.tableData.splice(i, 1);
    },
  },
  watch: {
    data: {
      handler(val) {
        this.tableData = JSON.parse(JSON.stringify(val));
      },
      deep: true,
    },
  },
  mounted() {},
};
</script>

<style lang='less' scoped>
.connect-box {
  padding-left: 20px;
}
.drawer /deep/.el-drawer__body {
  overflow-y: auto;
}
.bottom_btn {
  width: 100%;
  margin: 0 auto;
  height: 50px;
  z-index: 1000;
  overflow: hidden;
  bottom: 0px;
  left: 0px;
  text-align: center;
  background-color: #f2f2f4;
  border: 1px solid #dfe6ec;
  padding: 5px;
  position: absolute;
}
</style>