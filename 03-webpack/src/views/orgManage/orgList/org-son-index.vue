<template>
  <div class="wrapper">
    <org-son-form
      ref="orgSonForm"
      class="form_body pd20"
      :formData="form"
    ></org-son-form>
    <div class="bottom_btn_row">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="toAddSonOrg" v-if="type == 'add'"
        >保存并添加子机构</el-button
      >
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>

    <ChargeDialog ref="ChargeDialog" v-model="rechargeVisible"></ChargeDialog>
  </div>
</template>

<script>
import ChargeDialog from "./conponents/charge-dialog.vue";
import { postAddOrg, putAddOrg, getOrgDetail } from "@/api/orgManage";
import orgSonForm from "./conponents/org-son-form";
export default {
  name: "org-son-index",
  components: {
    orgSonForm,
    ChargeDialog,
  },
  props: {
    type: "",
  },
  data() {
    return {
      isReadOnly: false,
      form: {},
      rechargeVisible: false,
    };
  },
  methods: {
    // 保存
    async handleSave() {
      this.postAddOrg(() => {
        this.$router.replace({
          path: "/org-manage/org-detail",
          query: {
            id: this.querys.topId,
            type: "subCount",
          },
        });
      });
    },
    // 跳转添加子机构
    toAddSonOrg() {
      this.postAddOrg((res) => {
        this.$router.replace({
          path: "/redirect/org-manage/org-son-add/add",
          query: {
            topId: this.querys.topId,
            topName: this.querys.topName,
            parentId: res.data,
            parentIds: JSON.stringify(
              JSON.parse(this.querys.parentIds).concat(res.data)
            ),
          },
        });
      });
    },
    // 保存接口
    async postAddOrg(callBack) {
      let form = await this.$refs.orgSonForm.getFormData();
      if (!form) {
        this.$message.warning("请完善信息！");
        return;
      }
      if (this.type == "add") {
        form.topId = this.querys.topId;
        form.parentId = this.querys.parentId;
        form.parentIds = JSON.parse(this.querys.parentIds);
      }
      let res =
        this.type == "add" ? await postAddOrg(form) : await putAddOrg(form);
      if (res && res.code == "00000") {
        this.gvUtil.success();
        typeof callBack == "function" && callBack(res);
      } else if (res && res.code == "B0301") {
        this.toPolicy(); // 跳转计费政策
      } else if (res && res.code == "B0302") {
        this.openCharge(); // 打开充值弹窗
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 打开充值弹窗
    openCharge() {
      this.$confirm(`机构余额不足，请充值。`, "添加失败", {
        confirmButtonText: "前往充值",
        showCancelButton: true,
        type: "error",
      }).then(() => {
        this.rechargeVisible = true;
        this.$refs.ChargeDialog.initComponent(this.querys.topId);
      });
    },
    // 跳转计费政策
    toPolicy() {
      this.$confirm(
        `${this.querys.topName}未设置计费政策，请先设置计费政策。`,
        "添加失败",
        {
          confirmButtonText: "前往设置",
          showCancelButton: true,
          type: "error",
        }
      ).then(() => {
        this.$router.push({
          path: "/org-manage/charge-policy",
          query: {
            id: this.querys.topId,
            type: "noTip",
          },
        });
      });
    },
    // 初始化详情数据
    async initDetail() {
      let res = await getOrgDetail(this.querys.id);
      if (res && res.code == "00000") {
        this.form = res.data;
        this.$set(this.form, "topName", this.form.topMechanismName);
      }
    },
  },
  created() {
    this.form.topName = this.querys.topName;
    this.type == "edit" && this.initDetail();
    console.log(this.type);
  },
};
</script>

<style lang='less' scoped>
.collapse-content {
  max-width: 800px;
}
</style>