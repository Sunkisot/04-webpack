<template>
  <div class="wrapper pd10">
    <div class="content">
      <div class="c_left">
        <div class="cl_head">选择城市</div>
        <div class="cl_body">
          <el-tree
            ref="city_tree"
            class="tree"
            :data="areaTreeData"
            node-key="code"
            highlight-current
            default-expand-all
            :props="defaultProps"
            @current-change="handleCurChange($event, 'area')"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <span :title="node.label" class="em-tree-text">{{
                node.label
              }}</span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="c_mid">
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
            ref="ic_tree"
            class="tree"
            :data="icTreeData"
            node-key="code"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @current-change="handleCurChange($event, 'ic')"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <span :title="node.label" class="em-tree-text">{{
                node.label
              }}</span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="c_right">
        <div v-show="type == 'detail'" class="cr_head">
          <div class="crh_left">
            <span class="ml20 mr10">配置信息</span>
          </div>
          <div class="crh_right">
            <el-button type="primary" plain @click="handleInit"
              >初始化配置</el-button
            >
          </div>
        </div>
        <div class="cr_body">
          <div class="crb_form">
            <area-form ref="areaForm" :formData="formData"></area-form>
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
import { getAreaDetail, putAreaDetail, getAreaInit } from "@/api/insDeploy";
import { getInsList, getRegionTree } from "@/api/sys";
import areaForm from "./components/area-form.vue";
export default {
  name: "area-index",
  components: {
    areaForm,
  },
  data() {
    return {
      filterText: "", // 筛选字短
      type: "detail", // 页面类型 detail 详情 edit 编辑 add 添加
      oldkey: "",
      oldNode: null, // 上一级节点
      formData: {},
      areaTreeData: [],
      icTreeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  methods: {
    // 筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 刷新页面
    refreshPage() {
      this.$router.push({
        path: "/redirect" + this.$route.fullPath,
      });
    },
    // 初始化配置
    async handleInit() {
      let res = await getAreaInit();
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.refreshPage();
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 保存
    async handleSave() {
      let form = await this.$refs.areaForm.getFormData();
      if (!form) return;
      let res = await putAreaDetail(form);
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.refreshPage();
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 切换节点
    async handleCurChange(e, type) {
      if (type == "area" && e.parentId == 0) {
        this.$refs.city_tree.setCurrentKey(e.children[0].code);
      }
      await this.$nextTick();
      this.proFormData();
    },
    // 获取表单数据
    async proFormData() {
      let res = await getAreaDetail({
        cityCode: this.$refs.city_tree.getCurrentKey(),
        icCode: this.$refs.ic_tree.getCurrentKey(),
      });
      if (res && res.code == "00000") {
        this.formData = res.data || {};
      } else {
        this.$message.error(res.message);
      }
    },
    // 获取地区
    getAreaTreeData() {
      return new Promise(async (resolve) => {
        let res = await getRegionTree({
          type: 1,
        });
        if (res && res.code == "00000") {
          this.areaTreeData = res.data || [];
          await this.$nextTick();
          this.$refs.city_tree.setCurrentKey(
            this.areaTreeData[0].children[0].code
          );
          resolve();
        }
      });
    },
    // 获取保险公司
    getICTreeData() {
      return new Promise(async (resolve) => {
        let res = await getInsList();
        if (res && res.code == "00000") {
          this.icTreeData = res.data || [];
          await this.$nextTick();
          this.$refs.ic_tree.setCurrentKey(this.icTreeData[0].code);
          resolve();
        }
      });
    },
  },
  watch: {
    filterText(val) {
      this.$refs.ic_tree.filter(val);
    },
  },
  computed: {},
  mounted() {
    Promise.all([this.getAreaTreeData(), this.getICTreeData()]).then(() => {
      this.proFormData();
    });
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/variables.scss";
.content {
  display: flex;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  flex: 1;
  overflow: hidden;
  .c_left {
    flex: 15%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
  .c_mid {
    flex: 18%;
    display: flex;
    flex-direction: column;
    border-left: 1px solid rgba(217, 217, 217, 1);
    border-right: 1px solid rgba(217, 217, 217, 1);
    overflow: hidden;
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
    flex: 67%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
        margin: 0 10px;
        position: relative;
        // &::after {
        //   content: "|";
        //   position: absolute;
        //   color: rgba(217, 217, 217, 1);
        //   right: -15px;
        // }
        // &:last-child::after {
        //   content: "";
        // }
      }
    }
    .cr_body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: auto;
      .crb_form {
        flex: 1;
        padding: 10px;
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
.custom-tree-node {
  flex: 1;
  display: flex; //这里的display属性不用修改（使树节点末尾的按钮右对齐）
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding-right: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%; //宽度必须是这个，不能使用px或者min-width或者min-width等，因为外层使用了el-card包裹是可以拉动的，换言之树节点的宽度随时可变
  & span.em-tree-text {
    display: inline-block; //block一样
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
    text-overflow: ellipsis;
  }
}
</style>