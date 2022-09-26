<template>
  <div class="wrapper pd10">
    <div class="content">
      <div class="c_left">
        <div class="cl_head">
          <div>全部角色</div>
          <el-button
            :disabled="type == 'add'"
            icon="el-icon-plus"
            type="primary"
            @click="handleAdd"
            >添加角色</el-button
          >
        </div>
        <div class="cl_body">
          <div
            :class="['roleItem', 'm-p', { 'is-active': activeIndex == i }]"
            v-for="(item, i) in roles"
            :key="item.id"
            @click="handleSwitchRole(i, item)"
          >
            <div>
              <div class="mb8">{{ item.roleName }}</div>
              <span class="f-12 c-7F7F7F t-one">{{ item.mechanismName }}</span>
            </div>
            <el-tooltip
              v-if="item.id"
              effect="dark"
              content="删除"
              placement="bottom"
              :open-delay="500"
            >
              <i
                class="el-icon-delete f-18 c-7F7F7F"
                @click="handleDel(item)"
              ></i>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="c_right">
        <div class="cr_body">
          <div class="crb_form">
            <role-form
              ref="roleForm"
              :formData="formData"
              :treeData="treeData"
            ></role-form>
          </div>
          <div v-show="type != 'detail'" class="crb_btn">
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getRoleDetail,
  getMenuTree,
  postAddRole,
  putAddRole,
  delRole,
} from "@/api/paasDeploy";
import roleForm from "./componets/role-form";
export default {
  name: "role-index",
  components: {
    roleForm,
  },
  data() {
    return {
      type: "edit", // 页面类型 edit 编辑 add  添加
      activeIndex: 0, // 当前选中的角色
      oldInfo: {
        // 旧表单对象与索引
        key: null,
        form: {},
      },
      formData: {},
      treeData: [
        {
          id: "",
          menuName: "全部权限",
          children: [],
        },
      ],
      roles: [{}],
    };
  },
  methods: {
    // 删除
    handleDel(e) {
      this.$confirm("确定要删除这个角色吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "danger",
      }).then(async () => {
        let res = await delRole({
          roleId: e.id,
        });
        if (res && res.code == "00000") {
          this.gvUtil.success();
          this.refreshPage();
        } else {
          this.$alert(res.message, "无法删除", {
            confirmButtonText: "知道了",
            type: "info",
          });
        }
      });
    },
    // 保存
    async handleSave() {
      let form = await this.$refs.roleForm.getFormData();
      if (!form) return;
      this.postSave(form);
    },
    // 保存接口
    async postSave(form) {
      let res =
        this.type == "add" ? await postAddRole(form) : await putAddRole(form);
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.refreshPage();
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 添加角色
    async handleAdd() {
      this.type = "add";
      this.roles.push({
        id: "",
        roleName: "新建岗位",
        mechanismName: "",
      });
      this.activeIndex = this.roles.length - 1;
      this.treeData[0].children = await this.getMenuTree();
      this.$set(this, "formData", { childOrgIsUsable: 1 });
      this.oldInfo.key = this.roles.length - 1;
      this.oldInfo.form = {};
    },
    // 切换角色
    handleSwitchRole(i, e) {
      if (!e.id) return;
      let nowForm = this.$refs.roleForm.getForm();
      if (
        !this.gvUtil.compare(nowForm, this.oldInfo.form) ||
        this.type == "add"
      ) {
        // 改变了
        this.$confirm("您编辑的内容还未保存, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            if (this.type == "add") {
              this.roles.splice(this.roles.length - 1, 1);
            }
            this.type = "edit";
            this.activeIndex = i;
            this.proFormData(i, e);
          })
          .catch(() => {
            this.activeIndex = this.oldInfo.key;
          });
      } else {
        // 未做改变
        this.type = "edit";
        this.activeIndex = i;
        this.proFormData(i, e);
      }
    },
    // 获取表单详情数据
    async proFormData(i, e) {
      try {
        this.treeData[0].children = await this.getMenuTree(e.id);
        let res = await getRoleDetail({
          roleId: e.id,
        });
        if (res && res.code == "00000") {
          this.formData = Object.assign({}, res.data || {});
          this.oldInfo.key = i;
          this.oldInfo.form = JSON.parse(JSON.stringify(this.formData));
        }
      } catch (err) {
        this.gvUtil.error(err);
      }
    },
    // 刷新页面
    refreshPage() {
      this.$router.push({
        path: "/redirect/paas-deploy/roles-index",
      });
    },
    // 获取权限树
    getMenuTree(id) {
      return new Promise(async (resolve, reject) => {
        let res = await getMenuTree({
          roleId: id,
        });
        if (res && res.code == "00000") {
          resolve(res.data || []);
        } else {
          reject(res.message);
        }
      });
    },
    // 获取角色列表
    async getRoleList() {
      let res = await getRoleList({});
      if (res && res.code == "00000") {
        this.roles = res.data || [];
        if (this.roles && this.roles.length) {
          this.proFormData(0, this.roles[0]);
        }
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 初始化页面
    initPage() {
      this.getRoleList();
    },
  },
  computed: {},
  mounted() {
    this.initPage();
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/variables.scss";
.content {
  display: flex;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  overflow: auto;
  flex: 1;
  .c_left {
    flex: 30%;
    display: flex;
    flex-direction: column;
    .cl_head {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #f4f6f8;
      border-bottom: 1px solid rgba(217, 217, 217, 1);
      padding: 0 15px;
    }
    .cl_body {
      flex: 1;
      background-color: #f4f6f8;
      overflow: auto;
      .roleItem {
        font-size: 15px;
        height: 70px;
        padding: 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e9e9e9;
        &:last-child {
          border-bottom: none;
        }
      }
      .roleItem.is-active {
        background: #fff;
        color: $primary;
      }
    }
  }
  .c_right {
    flex: 70%;
    display: flex;
    flex-direction: column;
    .cr_head {
      height: 50px;
      border-bottom: 1px solid rgba(217, 217, 217, 1);
      line-height: 50px;
      text-indent: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .crh_left {
        display: flex;
        align-items: center;
      }
      .crh_right .el-button {
        margin: 0 15px;
        position: relative;
        &::after {
          content: "|";
          position: absolute;
          color: rgba(217, 217, 217, 1);
          right: -15px;
        }
        &:last-child::after {
          content: "";
        }
      }
    }
    .cr_body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;
      .crb_form {
        flex: 1;
        overflow: auto;
      }
      .crb_btn {
        height: 50px;
        text-align: center;
        line-height: 50px;
        border-top: 1px solid rgba(217, 217, 217, 1);
      }
    }
  }
}
.status_box {
  font-size: 14px;
  color: #fff;
  background: $red;
  width: 70px;
  height: 20px;
  text-align: center;
  text-indent: initial;
  line-height: 20px;
  border-radius: 3px;
}
</style>