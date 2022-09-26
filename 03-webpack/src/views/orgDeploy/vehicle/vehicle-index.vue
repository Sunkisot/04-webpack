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
            default-expand-all
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
        <div v-if="!isTopOrg" class="cr_head">
          <div class="crh_left">
            <span class="ml20 mr10">同步到上级机构配置</span>
            <gv-switch v-model="formData.isAsync" @change="switchChange"> </gv-switch>
          </div>
        </div>
        <div class="cr_body">
          <div class="crb_form">
            <VehicleForm
              ref="orgForm"
              :formData="formData"
              :isReadOnly="isReadOnly"
            ></VehicleForm>
          </div>
          <div v-if="formData.isAsync == 0" class="crb_btn">
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getVehicleDetail,
  postVehicleAdd,
  getVehicleOpenSync,
} from "@/api/orgDeploy";
import { getOrgSonTree } from "@/api/orgManage";
import VehicleForm from "./components/vehicle-form.vue";
export default {
  name: "vehicle-index",
  components: {
    VehicleForm,
  },
  data() {
    return {
      isTopOrg: true, // 是否是顶级机构
      filterText: "", // 筛选字短
      type: "detail", // 页面类型 detail 详情 edit 编辑 add 添加
      oldkey: "",
      oldNode: null, // 上一级节点
      formData: {},
      oldFormData: {},
      initFormData: {
        isAsync: 0,
        isSupportNonbus: 0,
        vehicleFields: [
          {
            name: "车辆品牌型号",
            localNeed: 0,
            otherNeed: 0,
          },
          {
            name: "车辆识别代号",
            localNeed: 0,
            otherNeed: 0,
          },
          {
            name: "发动机号",
            localNeed: 0,
            otherNeed: 0,
          },
          {
            name: "初登日期",
            localNeed: 0,
            otherNeed: 0,
          },
          {
            name: "核定载客",
            localNeed: 0,
            otherNeed: 0,
          },
          {
            name: "整备质量",
            localNeed: 0,
            otherNeed: 0,
          },
          {
            name: "车主",
            localNeed: 0,
            otherNeed: 0,
          },
          {
            name: "选择车型",
            localNeed: 0,
            otherNeed: 0,
          },
        ],
      },
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  methods: {
    // 状态改变
    async switchChange(e) {
      if (e == 1) {
        // 开启
        this.postOpenSync();
      }
    },
    // 开启同步上级配置接口
    async postOpenSync() {
      let node = this.$refs.tree.getCurrentNode();
      let res = await getVehicleOpenSync({
        mechanismId: this.$refs.tree.getCurrentKey(),
        parentMechanismId: node.parentId,
      });
      if (res && res.code == "00000") {
        let res = await getVehicleDetail(node.parentId);
        if (res && res.code == "00000") {
          this.formData = Object.assign({}, res.data, { isAsync: 1 });
          this.oldFormData = JSON.parse(JSON.stringify(this.formData));
        } else {
          this.gvUtil.error(res.message);
        }
      } else {
        this.gvUtil.error(res.message);
        this.formData.isAsync = 0;
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 处理是否是顶级机构
    proIsTopOrg() {
      let node = this.$refs.tree.getCurrentNode() || {};
      this.isTopOrg = node.parentId == "0";
    },
    // 保存
    async handleSave() {
      let form = this.$refs.orgForm.getFormData()
      let res = await postVehicleAdd({
        ...form,
        mechanismId: this.$refs.tree.getCurrentKey(),
      })
      if(res && res.code == '00000') {
        this.gvUtil.success();
        this.refreshPage();
      }else {
        this.gvUtil.error(res.message)
      }
    },
    // 切换节点
    handleCurChange(e) {
      if (!e.id) return;
      if (this.gvUtil.compare(this.formData, this.oldFormData)) {
        this.oldkey = e.id;
        this.proFormData(e);
      } else {
        // 改变了
        this.$confirm("您编辑的内容还未保存, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.oldkey = e.id;
            this.proFormData(e);
          })
          .catch(() => {
            this.$refs.tree.setCurrentKey(this.oldkey);
          });
      }
    },
    // 获取表单数据
    async proFormData(e) {
      this.proIsTopOrg();
      let res = await getVehicleDetail(e.id);
      this.formData = res.data || this.initFormData;
      if (res && res.code == "00000") {
        if (res.data) {
          this.formData = Object.assign({}, this.initFormData, res.data);
          this.oldFormData = JSON.parse(JSON.stringify(this.formData));
        } else {
          this.formData = Object.assign({}, this.initFormData);
          this.oldFormData = JSON.parse(JSON.stringify(this.formData));
        }
      } else {
        this.gvUtil.error(res.message);
      }
    },
    async getTreeData() {
      let res = await getOrgSonTree();
      if (res && res.code == "00000") {
        this.treeData = res.data || [];
        await this.$nextTick();
        this.$refs.tree.setCurrentKey(this.treeData[0].id);
        this.proFormData(this.treeData[0]);
        this.oldkey = this.treeData[0].id;
      }
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {
    isReadOnly() {
      return this.formData.isAsync == 1;
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