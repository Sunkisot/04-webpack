<template>
  <div class="wrapper pd10">
    <gv-search-table ref="table" :table="table" @on-list-btn="onListBtn">
      <template v-slot:search="scope">
        <el-row>
          <gv-form-item keyName="角色名称" prop="roleName">
            <el-input
              v-model="scope.search.roleName"
              placeholder="输入角色名称查找"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="归属机构" prop="mechanismId">
            <gv-tree-select
              v-model="scope.search.mechanismId"
              urlType="OrgTree"
              placeholder="选择归属机构名称查找"
            ></gv-tree-select>
          </gv-form-item>
        </el-row>
      </template>
      <!--工具条-->
      <template v-slot:toolbar>
        <el-button type="primary" @click="onHandleAdd()" v-hasPermi="['system:mechanism:role:save']">添加角色</el-button>
      </template>
    </gv-search-table>
  </div>
</template>

<script>
import { delRole } from "@/api/orgManage";
export default {
  name: "role-index",
  data(vm) {
    return {
      table: {
        basic: {
          path: "/system/mechanism/role/list", //分页列表请求api
          vo: "list", //分页列表返回的vo
          singleElection: false, //是否支持单选  获取选中数据 this.$refs.table.getSingleSelectData()
          multipleElection: true, //是否支持多选  获取选中数据 this.$refs.table.getSelectData()
          autoSearch: false, // 是否开启默认查询
          pageSizes: [10, 20, 50, 100], // 默认尺码
          showSequenceNum: true, // 是否展示序号
          execl: {
            isShow: true,
            fileName: "testExecl",
            exclude: ["Operation"],
          }, //导出按钮控制，不需要可以删除此属性
          // execlAll: {
          //   isShow: true,
          //   fileName: "testExecl",
          //   exclude: ["operation"],
          // },
        },
        search: {
          //查询域元数据
          roleName: "",
          mechanismId: null,
        },
        fields: [
          //结果列表配置，一个对象一列
          {
            labelKey: "角色名称", //国际化key
            showTip: true,
            btns: [
              {
                prop: "roleName",
                flag: "edit",
                type: "a",
                perms: ['system:mechanism:role:detail']
              },
            ],
          },
          {
            prop: "mechanismName",
            labelKey: "归属机构",
            showTip: true,
          },
          {
            prop: "childOrgIsUsable",
            labelKey: "子机构是否可用",
          },
          {
            prop: "remark",
            labelKey: "备注", //保险起期
            showTip: true,
          },
          {
            //配置最后列按钮
            prop: "Operation",
            labelKey: "操作",
            fixed: "right",
            width: "200px",
            btns: [
              {
                btnKey: "编辑",
                flag: "edit",
                type: "a",
                perms: ['system:mechanism:role:update']
              },
              {
                btnKey: "删除",
                flag: "del",
                type: "a",
                perms: ['system:mechanism:role:delete']
              },
            ],
          },
        ],
      },
      options: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 2,
              label: "二级 1-1",
              children: [
                {
                  id: 3,
                  label: "三级 1-1-1",
                },
              ],
            },
          ],
        },
        {
          id: 4,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
              children: [
                {
                  id: 6,
                  label: "三级 2-1-1",
                },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    onHandleAdd() {
      this.$router.push({
        path: "/org-manage/add-role/add",
      });
    },
    // 跳转编辑
    toEdit(row) {
      this.$router.push({
        path: "/org-manage/add-role/edit",
        query: {
          roleId: row.id,
        },
      });
    },
    // 删除
    handleDel(row) {
      this.$confirm("确定要删除这个角色吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "danger",
      })
        .then(() => {
          this.delRole(row);
        })
        .catch(() => {});
    },
    // 删除角色
    async delRole(row) {
      let res = await delRole({
        roleId: row.id,
      });
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.$refs.table.onGetList();
      } else {
        this.$alert(res.message, "无法删除", {
          confirmButtonText: "知道了",
          type: "info",
        });
      }
    },
    onListBtn(row, type) {
      switch (type) {
        case "edit":
          this.toEdit(row);
          break;
        case "del":
          this.handleDel(row);
          break;
      }
    },
  },
  mounted() {
    this.$refs.table.onGetList();
  },
};
</script>

<style>
</style>