<template>
  <div>
    <el-button type="text" icon="el-icon-plus" @click="toAddSonOrg(null)"
      >添加子机构</el-button
    >
    <el-table
      ref="listPage"
      :data="tableData"
      border
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column label="机构名称">
        <template #default="{ row }">
          <el-button type="text" @click="toDetail(row)">{{
            row.name
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="statusStr"> </el-table-column>
      <el-table-column label="所在地区" prop="region"> </el-table-column>
      <el-table-column label="操作" prop="name" fixed="right">
        <template #default="{ row }">
          <el-button class="mr10" type="text" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-dropdown @command="handleCommand($event, row)" trigger="click">
            <el-button type="text">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="addSonOrg">添加下级</el-dropdown-item>
              <el-dropdown-item command="del">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getOrgSonTree, delOrg } from "@/api/orgManage";
export default {
  name: "org-son-list",
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    // 跳转机构详情
    toDetail(row) {
      this.$router.replace({
        path: "/redirect/org-manage/org-detail",
        query: {
          id: row.id,
        },
      });
    },
    // 添加子机构
    toAddSonOrg(row) {
      let curOrg = row ? row : this.formData;
      let { topId, topMechanismName } = curOrg;
      let flag = curOrg.parentId == "0"; //是否是顶级机构
      this.$router.push({
        path: "/org-manage/org-son-add/add",
        query: {
          topId: flag ? curOrg.id : topId,
          topName: flag ? curOrg.name : topMechanismName,
          parentId: curOrg.id,
          parentIds: JSON.stringify(flag ? [curOrg.id] : [...curOrg.parentIds, curOrg.id]),
        },
      });
    },
    // dropDown点击
    handleCommand(e, row) {
      switch (e) {
        case "del":
          this.handleDel(row);
          break;
        case "addSonOrg":
          this.toAddSonOrg(row);
      }
    },
    // 删除
    handleDel(row) {
      this.$confirm("确定要删除这个机构吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "danger",
      }).then(async () => {
        let res = await delOrg(row.id);
        if (res && res.code == "00000") {
          this.gvUtil.success();
          this.getTreeData();
        } else {
          this.$alert(res.message, "无法删除", {
            confirmButtonText: "知道了",
            type: "info",
          });
        }
      });
    },
    // 编辑
    handleEdit(row) {
      let flag = row.parentId == "0"; //是否是顶级机构
      this.$router.push({
        path: flag
          ? "/org-manage/org-add/edit"
          : "/org-manage/org-son-add/edit",
        query: {
          id: row.id,
        },
      });
    },
    async getTreeData() {
      let res = await getOrgSonTree({
        parentId: this.querys.id,
      });
      if (res && res.code == "00000") {
        this.tableData = res.data || [];
      }
    },
  },
  mounted() {},
  created() {
    this.getTreeData();
  },
};
</script>

<style>
</style>