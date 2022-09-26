<template>
  <div class="wrapper pd10">
    <div class="content">
      <div class="c_left">
        <div class="cl_head">
          <el-input
            placeholder="输入机构名称查找"
            clearable
            v-model="filterText"
          >
          </el-input>
        </div>
        <div class="cl_body">
          <el-tree
            ref="tree"
            class="tree"
            :data="treeData"
            node-key="id"
            highlight-current
            :expand-on-click-node="false"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @current-change="handleCurChange"
          >
            <template #default="scope">
              <div>{{ scope.node.label }}</div>
            </template>
          </el-tree>
        </div>
      </div>
      <div class="c_right">
        <div class="cr_head">
          <div class="crh_left">
            <span class="ml20 mr10">操作权限</span>
          </div>
          <div class="crh_right">
            <el-button
              v-if="!isTopOrg"
              type="primary"
              plain
              @click="handleCopyTop"
              >同步上级</el-button
            >
          </div>
        </div>
        <div class="cr_body">
          <div class="crb_form">
            <el-tree
              ref="premTree"
              class="premTree"
              :data="premTreeData"
              show-checkbox
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              :props="premDefaultProps"
            >
            </el-tree>
          </div>
          <div class="crb_btn">
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPremMenu, putPremMenu, getPremMenuCopy } from "@/api/orgDeploy";
import { getOrgSonTree } from "@/api/orgManage";
export default {
  name: "perm-index",
  components: {},
  data() {
    return {
      filterText: "", // 筛选字短
      oldkey: "",
      oldPremIds: [], // 上一级节点
      isTopOrg: true,
      premTreeData: [
        {
          id: "",
          menuName: "全部权限",
          children: [],
        },
      ],
      premDefaultProps: {
        children: "children",
        label: "menuName",
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  methods: {
    // tree筛选函数
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 同步上级
    async handleCopyTop() {
      
      let res = await getPremMenuCopy({
        mechanismId: this.$refs.tree.getCurrentKey()
      });
      if (res && res.code == "00000") {
        this.gvUtil.success()
        this.refreshPage()
      }else {
        this.gvUtil.error(res.message)
      }
    },
    // 刷新页面
    refreshPage() {
      this.$router.push({
        path: "/redirect" + this.$route.fullPath,
      });
    },
    // 处理是否是顶级机构
    proIsTopOrg() {
      let node = this.$refs.tree.getCurrentNode() || {};
      this.isTopOrg = node.parentId == "0";
    },
    // 保存
    async handleSave() {
      let keys = this.$refs.premTree.getCheckedKeys() || [];
      if (!keys[0]) {
        keys.splice(0, 1); // 删除全部节点
      }
      if (!keys.length) {
        this.$message.warning("机构权限不能为空!");
        return;
      }
      let id = this.$refs.tree.getCurrentKey();
      let res = await putPremMenu({
        mechanismId: id,
        menuIdList: keys,
      });
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.refreshPage();
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 切换节点
    handleCurChange(e) {
      if (!e.id) return;
      let keys = this.$refs.premTree.getCheckedKeys() || [];
      if (!keys[0]) {
        keys.splice(0, 1); // 删除全部节点
      }
      if (JSON.stringify(keys) == JSON.stringify(this.oldPremIds)) {
        this.oldkey = e.id;
        this.proPremData(e);
        this.proIsTopOrg();
      } else {
        this.$confirm("您编辑的内容还未保存, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.oldkey = e.id;
            this.proPremData(e);
            this.proIsTopOrg();
          })
          .catch(() => {
            this.$refs.tree.setCurrentKey(this.oldkey);
            this.proIsTopOrg();
          });
      }
    },
    // 获取表单数据
    async proPremData(e) {
      let res = await getPremMenu(e.id);
      if (res && res.code == "00000") {
        let { menuIdList, permList } = res.data || {};
        this.premTreeData[0].children = permList;
        await this.$nextTick();
        this.$refs.premTree.setCheckedKeys(menuIdList || []);
        this.oldPremIds = menuIdList || [];
      }
    },
    async getTreeData() {
      let res = await getOrgSonTree();
      if (res && res.code == "00000") {
        this.treeData = res.data || [];
        await this.$nextTick();
        this.$refs.tree.setCurrentKey(this.treeData[0].id);
        this.proPremData(this.treeData[0]);
      }
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.getTreeData();
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/variables.scss";
.content {
  display: flex;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  flex: 1;
  overflow: auto;
  .c_left {
    flex: 30%;
    display: flex;
    flex-direction: column;
    .cl_head {
      height: 50px;
      background-color: #f4f6f8;
      border-bottom: 1px solid rgba(217, 217, 217, 1);
      line-height: 50px;
      padding: 0 10px;
    }
    .cl_body {
      flex: 1;
      background-color: #f4f6f8;
      overflow: auto;
      .tree {
        background: #f4f6f8;
        /deep/ .el-tree-node__content {
          height: 36px;
        }
        /deep/ .el-tree-node.is-current > .el-tree-node__content {
          background: $primary;
          color: #fff;
        }
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
        .premTree {
          padding: 20px 15px;
        }
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
.success {
  background: $primary;
}
</style>