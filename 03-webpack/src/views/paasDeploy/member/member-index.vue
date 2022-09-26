<template>
  <div class="wrapper pd10">
    <gv-search-table ref="table" :table="table" @on-list-btn="onListBtn">
      <template v-slot:search="scope">
        <el-row>
          <gv-form-item keyName="人员姓名" prop="name">
            <el-input
              v-model="scope.search.name"
              placeholder="输入人员姓名"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="登录账号" prop="username">
            <el-input
              v-model="scope.search.username"
              placeholder="输入登录账号"
            ></el-input>
          </gv-form-item>
          <gv-form-item keyName="人员角色" prop="roleId">
            <gv-select
              class="pl20"
              urlType="RoleOption"
              codeName="id"
              labelName="roleName"
              v-model="scope.search.roleId"
              placeholder="选择人员角色"
            ></gv-select>
          </gv-form-item>
        </el-row>
        <el-row>
          <gv-form-item keyName="状态" prop="isEnable">
            <gv-select
              optionsSet="1"
              optionType="DisabledState"
              v-model="scope.search.isEnable"
            ></gv-select>
          </gv-form-item>
        </el-row>
      </template>
      <!--工具条-->
      <template v-slot:toolbar>
        <el-button type="primary" @click="onHandleAdd()">添加成员</el-button>
      </template>
    </gv-search-table>
  </div>
</template>

<script>
import { getUserStatus, delUser } from "@/api/paasDeploy";
export default {
  name: "member-index",
  data(vm) {
    return {
      table: {
        basic: {
          path: "/system/operation/user/list", //分页列表请求api
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
          name: "",
          username: "",
          roleId: "",
          isEnable: "",
        },
        fields: [
          //结果列表配置，一个对象一列
          {
            labelKey: "人员姓名", //国际化key
            btns: [
              {
                prop: "name",
                flag: "edit",
                type: "a",
              },
            ],
          },
          {
            prop: "username",
            labelKey: "登录账号",
          },
          {
            prop: "isEnable",
            labelKey: "状态",
            format: {
              type: "optionType",
              optionType: "DisabledState",
              success: "1",
            },
          },
          {
            prop: "roleNameList",
            labelKey: "人员角色", //保险起期
            showTip: true,
            format: {
              type: "custom",
              formatFn: (val) => val && val.length && val.join("、"),
            },
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
              },
              {
                btnKey: "更多", //任务列表
                flag: "dropdown",
                type: "dropdown",
                dropdownRule: vm.dropdownValid,
                ddItems: [
                  {
                    command: "start",
                    name: "启用",
                  },
                  {
                    command: "stop",
                    name: "禁用",
                  },
                  {
                    command: "del",
                    name: "删除",
                  },
                ],
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    // 机构改变
    orgChange(e) {
      this.$refs.table.setSearchVal({
        roleId: "",
      });
    },
    onHandleAdd() {
      this.$router.push({
        path: "/paas-deploy/member-detail/add",
      });
    },
    dropdownValid(row, command) {
      if (row.isEnable == 1 && command == "start") {
        return false;
      } else if (row.isEnable == 0 && command == "stop") {
        return false;
      } else {
        return true;
      }
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({
        path: "/paas-deploy/member-detail/edit",
        query: {
          id: row.id,
        },
      });
    },
    // 删除
    handleDel(row) {
      this.$confirm("确定要删除这个成员吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "danger",
      }).then(async () => {
        let res = await delUser({
          userId: row.id,
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
      });
    },
    // 启用/禁用
    handleStatus(row, status) {
      if (status == 0) {
        this.$confirm("确定要禁用这个机构吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {
          this.putEditStatus(row, status);
        });
      } else {
        this.putEditStatus(row, status);
      }
    },
    // 启用/禁用接口
    async putEditStatus(row, status) {
      let res = await getUserStatus({
        status,
        userId: row.id,
      });
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.$refs.table.onGetList();
        // this.$router.replace({ path: "/redirect" + this.$route.fullPath });
      }
    },
    onListBtn(row, type) {
      switch (type) {
        case "edit":
          this.handleEdit(row);
          break;
        case "del":
          this.handleDel(row);
          break;
        case "start":
          this.handleStatus(row, 1);
          break;
        case "stop":
          this.handleStatus(row, 0);
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