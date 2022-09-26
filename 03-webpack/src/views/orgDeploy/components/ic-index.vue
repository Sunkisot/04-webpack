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
        <div class="cr_head" v-if="!isTopOrg">
          <div class="crh_left">
            <span class="ml20 mr10">同步到上级机构配置</span>
            <gv-switch v-model="isAsync" @change="switchChange"> </gv-switch>
          </div>
        </div>
        <div class="cr_body">
          <div class="crb_form">
            <div class="ic_class">
              <div class="label">保险公司</div>
              <gv-tree-tag
                class="icsTreeTag"
                ref="icsTreeTag"
                v-model="formData.ics"
                urlType="IcOption"
                btn_txt="添加"
                node-key="code"
                tag-click
                @tag-change="tagChange"
                @curkey-change="curkeyChange"
                @save="handleIcSave"
                :disabled="isReadOnly"
              ></gv-tree-tag>
            </div>
            <transition name="el-fade-in-linear">
              <div v-if="formData.ics && formData.ics.length">
                <QuotaForm
                  v-if="type == 'quota'"
                  ref="quota"
                  :form="formData"
                  :areaDeploy="areaDeploy"
                  :isReadOnly="isReadOnly"
                ></QuotaForm>
                <VideoForm
                  v-if="type == 'video'"
                  ref="video"
                  :form="formData"
                  :isReadOnly="isReadOnly"
                >
                </VideoForm>
                <PayForm
                  v-if="type == 'pay'"
                  ref="pay"
                  :form="formData"
                  :isReadOnly="isReadOnly"
                >
                </PayForm>
              </div>
              <div v-else class="noData">
                <div class="img"></div>
                <p>请先添加保险公司</p>
              </div>
            </transition>
          </div>
          <div
            v-if="formData.ics && formData.ics.length && isAsync == 0"
            class="crb_btn"
          >
            <el-button type="primary" @click="handleSave">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getOrgIcs,
  getOrgIcDetail,
  postOrgIcAdd,
  postOrgIcsAdd,
  getOrgIcOpenSync,
} from "@/api/orgDeploy";
import { getAreaDetail } from "@/api/insDeploy";
import { getOrgSonTree } from "@/api/orgManage";
import QuotaForm from "./quota-form.vue";
import VideoForm from "./video-form.vue";
import PayForm from "./pay-form.vue";
export default {
  name: "ic-index",
  components: {
    QuotaForm,
    VideoForm,
    PayForm,
  },
  props: {
    type: {
      type: String,
      default: "quota",
    },
  },
  data() {
    return {
      isTopOrg: true, // 是否是顶级机构
      filterText: "", // 筛选字短
      oldkey: "", // 上一次的机构id
      oldIcCode: "", // 上一次的保险公司code
      oldFormData: null, // 上一次FormData
      isAsync: 1, // 同步状态
      firstCloseAsync: false,
      formData: {},
      initFormData: {
        // 报价初始化数据
        quotaPolicyInfo: [],
        isShowSpecialProvide: 0,
        isEpolicyDelivery: 1,
        deliveryFieldsFlag: ["P", "E", "D"],
        defaultDeliveryFieldsFlag: "P",
        isSendIdCode: 0,
        isClientSupportEproposal: 0,
        isAdminSupportEproposal: 0,
        isClientSupportValidateCar: 0,
        isH5SupportValidateCar: 0,
        qrcodeRemark: "二维码两小时之内有效",
        isSupportQrcodeRefresh: 1,
        vehicleService: "US",
        isShowRefreshButton: 0,

        // 影像初始化数据
        isAutoReview: 0,
        isRequirePhoto: 0,
        clientRequirePhoto: "US",
        isOpenRequirePhoto: 0,
        // 影像初始化数据
        isDirectPay: 0,
        isSupportOfflinePay: 0,
      },
      areaDeploy: {
        invoiceDeliverType: [],
        tciDeliverType: [],
        vciDeliverType: [],
      }, // 区域化配置数据
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 状态改变
    async switchChange(e) {
      if (e == 1) {
        // 开启
        this.postOpenSync();
      } else {
        this.firstCloseAsync = true;
        this.formData = Object.assign({}, this.initFormData, {
          isAsync: 0,
          ics: null,
          icCode: null,
        });
      }
    },
    // 开启同步上级配置接口
    async postOpenSync() {
      let node = this.$refs.tree.getCurrentNode();
      let res = await getOrgIcOpenSync(
        {
          mechanismId: this.$refs.tree.getCurrentKey(),
          parentMechanismId: node.parentId,
        },
        this.type
      );
      if (res && res.code == "00000") {
        this.getOrgIcs(this.$refs.tree.getCurrentKey());
      } else {
        this.gvUtil.error(res.message);
        this.formData.syncStatus = 0;
      }
    },
    // 处理是否是顶级机构
    proIsTopOrg() {
      let node = this.$refs.tree.getCurrentNode() || {};
      this.isTopOrg = node.parentId == "0";
    },
    // 保险公司保存
    async handleIcSave(ics) {
      let curkey = this.$refs.icsTreeTag.getCurrentKey();
      try {
        let res = await postOrgIcsAdd({
          ics,
          mechanismId: this.$refs.tree.getCurrentKey(),
        }, this.type);
        if (res && res.code == "00000") {
          this.gvUtil.success();
          console.log('第一次关闭同步',this.firstCloseAsync);
          this.proFormData(curkey);
        } else {
          this.gvUtil.error(res.message);
        }
      } catch (err) {
        this.refreshPage();
      }
    },
    // 保存
    async handleSave() {
      let isok = await this.$refs[this.type].validate();
      if (!isok) {
        this.$message.warning("请完善信息！");
        return;
      }
      this.postSave();
    },
    // 保存接口
    async postSave() {
      let data = {
        ...this.formData,
        mechanismId: this.$refs.tree.getCurrentKey(),
        icCode: this.$refs.icsTreeTag.getCurrentKey(),
        isAsync: this.isAsync,
      };
      let res = await postOrgIcAdd(data, this.type);
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.refreshPage();
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 保险公司code变动
    curkeyChange(e) {
      if (!e) return;
      this.oldIcCode = e.oldVal;
      this.$set(this.formData, "icCode", e.val);
    },
    // 切换保险公司
    tagChange(e) {
      let newObj = Object.assign({}, this.formData, {
        ics: null,
        icCode: null,
        isAsync: null,
      });
      let oldObj = Object.assign({}, this.oldFormData, {
        ics: null,
        icCode: null,
        isAsync: null,
      });
      console.log(newObj, oldObj);
      if (this.isAsync == 1 || this.gvUtil.compare(newObj, oldObj)) {
        this.proFormData(e);
      } else {
        // 改变了
        this.$confirm("您编辑的内容还未保存, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.proFormData(e);
          })
          .catch(() => {
            this.$refs.icsTreeTag.setCurrentKey(this.oldIcCode);
          });
      }
    },
    // 切换机构
    handleCurChange(e) {
      if (!e.id) return;
      let newObj = Object.assign({}, this.formData, {
        ics: null,
        icCode: null,
        isAsync: null,
      });
      let oldObj = Object.assign({}, this.oldFormData, {
        ics: null,
        icCode: null,
        isAsync: null,
      });
      if (this.isAsync == 1 || this.gvUtil.compare(newObj, oldObj)) {
        this.oldkey = e.id;
        this.getOrgIcs(e.id);
      } else {
        // 改变了
        this.$confirm("您编辑的内容还未保存, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.oldkey = e.id;
            this.getOrgIcs(e.id);
          })
          .catch(() => {
            this.$refs.tree.setCurrentKey(this.oldkey);
          });
      }
    },
    // 获取表单数据
    async proFormData(code) {
      await this.getAreaDeploy(code); // 获取区域化配置
      await this.$nextTick();
      // 第一次关闭同步 全都是初始化数据
      if(this.firstCloseAsync) { 
        // 初始化数据
        this.formData = Object.assign({}, this.initFormData, {
          ics: this.formData.ics,
          icCode: this.formData.icCode,
        });
        this.oldFormData = JSON.parse(JSON.stringify(this.formData));
        return
      }
      // 
      let res = await getOrgIcDetail(
        {
          mechanismId: this.$refs.tree.getCurrentKey(),
          icCode: code,
        },
        this.type
      );
      if (res && res.code == "00000") {
        // 有数据时 展示数据
        this.formData = Object.assign(
          {},
          {
            ...this.initFormData,
            ics: this.formData.ics,
            icCode: this.formData.icCode,
          },
          res.data
        );
        this.oldFormData = JSON.parse(JSON.stringify(this.formData));
        console.log(
          JSON.stringify(this.formData) == JSON.stringify(this.oldFormData)
        );
      } else {
        // 没数据 初始化数据
        this.formData = Object.assign({}, this.initFormData, {
          ics: this.formData.ics,
          icCode: this.formData.icCode,
        });
        this.oldFormData = JSON.parse(JSON.stringify(this.formData));
        this.gvUtil.error(res.message);
      }
    },
    // 获取区域化配置数据
    getAreaDeploy(icCode) {
      return new Promise(async (resolve) => {
        let node = this.$refs.tree.getCurrentNode() || {};
        let res = await getAreaDetail({
          cityCode: node.cityCode,
          icCode,
        });
        if (res && res.code == "00000") {
          this.areaDeploy = Object.assign({}, this.areaDeploy, res.data || {});
          resolve();
        } else {
          this.gvUtil.error(res.message);
        }
      });
    },
    // 获取机构下保险公司
    async getOrgIcs(id) {
      this.firstCloseAsync = false;
      this.proIsTopOrg();
      let res = await getOrgIcs({
        mechanismId: id,
      }, this.type);
      if (res && res.code == "00000") {
        this.formData = Object.assign({}, this.initFormData);
        this.$set(this.formData, "ics", res.data.ics || []);
        this.isAsync = res.data.isAsync;
        if (this.formData.ics.length) {
          this.proFormData(this.formData.ics[0]);
          this.$refs.icsTreeTag.setCurrentKey(this.formData.ics[0]);
        } else {
          this.oldFormData = JSON.parse(JSON.stringify(this.formData));
        }
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 获取机构树
    async getTreeData() {
      let res = await getOrgSonTree();
      if (res && res.code == "00000") {
        this.treeData = res.data || [];
        await this.$nextTick();
        this.$refs.tree.setCurrentKey(this.treeData[0].id);
        this.getOrgIcs(this.treeData[0].id);
        this.oldkey = this.treeData[0].id;
      } else {
        this.gvUtil.error(res.message);
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
      return this.isAsync == 1;
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
        .ic_class {
          margin-top: 20px;
          min-height: 100px;
          display: flex;
          padding-bottom: 20px;
          .label {
            width: 100px;
            margin-top: 8px;
            padding-left: 20px;
            color: #303133;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          }
          .icsTreeTag {
            flex: 1;
          }
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
.noData {
  text-align: center;
  margin-top: 100px;
  width: 100%;
  .img {
    display: inline-block;
    width: 300px;
    height: 170px;
    background: url("../../../assets/images/noData.svg");
  }
}
</style>