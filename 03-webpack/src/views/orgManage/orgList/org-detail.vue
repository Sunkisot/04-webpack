<template>
  <div class="wrapper">
    <div class="header basic-flex">
      <div class="hd-left">
        <div class="flex-align-center">
          <h3 class="mr20">{{ form.name }}</h3>
          <div :class="['status_box', { success: form.status == 'NORMAL' }]">
            {{ gvUtil.translateData("OrgStatus", form.status) }}
          </div>
        </div>
        <p class="f-14">
          <span v-if="isTopOrg"
            >余额：{{ form.balance || 0 | money(true, 2) }} 元</span
          ><span v-if="form.periodOfUse" class="ml20"
            >使用期限：<span v-html="form.periodOfUse"></span
          ></span>
        </p>
      </div>
      <div class="hd-right">
        <el-button class="mr10" type="primary" plain @click="handleEdit"
          >编辑</el-button
        >
        <el-dropdown @command="handleCommand" trigger="click">
          <el-button type="primary" plain>
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="addSonOrg">添加子机构</el-dropdown-item>
            <el-dropdown-item command="recharge">充值</el-dropdown-item>
            <el-dropdown-item command="stop" v-if="form.status == 'NORMAL'"
              >禁用</el-dropdown-item
            >
            <el-dropdown-item command="start" v-if="form.status != 'NORMAL'"
              >启用</el-dropdown-item
            >
            <el-dropdown-item command="del">删除</el-dropdown-item>
            <el-dropdown-item command="charge">计费政策配置</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="body">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="机构详情信息" name="first">
          <org-form
            v-if="form.parentId == '0'"
            :formData="form"
            isReadOnly
          ></org-form>
          <org-son-form v-else :formData="form" isReadOnly></org-son-form>
        </el-tab-pane>
        <el-tab-pane :label="'子机构 ' + form.subCount" name="second">
          <org-son-list class="mt10" :formData="form"></org-son-list>
        </el-tab-pane>
      </el-tabs>
    </div>

    <ChargeDialog ref="ChargeDialog" v-model="rechargeVisible" :saveBack='refreshPage'></ChargeDialog>
  </div>
</template>

<script>
import ChargeDialog from "./conponents/charge-dialog.vue";
import { getOrgDetail, delOrg, editStatusOrg } from "@/api/orgManage";
import orgForm from "./conponents/org-form";
import orgSonForm from "./conponents/org-son-form";
import orgSonList from "./conponents/org-son-list";
export default {
  name: "org-detail",
  components: {
    orgForm,
    orgSonForm,
    orgSonList,
    ChargeDialog,
  },
  data() {
    return {
      rechargeVisible: false,
      activeName: "first",
      form: {},
    };
  },
  methods: {
    // 添加子机构
    toAddSonOrg() {
      let { topId, topMechanismName, parentIds } = this.form;
      this.$router.push({
        path: "/org-manage/org-son-add/add",
        query: {
          topId: this.isTopOrg ? this.form.id : topId,
          topName: this.isTopOrg ? this.form.name : topMechanismName,
          parentId: this.form.id,
          parentIds: JSON.stringify(
            this.isTopOrg ? [this.form.id] : [...parentIds, this.form.id]
          ),
        },
      });
    },
    // 编辑
    handleEdit() {
      this.$router.push({
        path: this.isTopOrg
          ? "/org-manage/org-add/edit"
          : "/org-manage/org-son-add/edit",
        query: {
          id: this.querys.id,
        },
      });
    },
    // 删除
    handleDel() {
      this.$confirm("确定要删除这个机构吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "danger",
      }).then(async () => {
        let res = await delOrg(this.querys.id);
        if (res && res.code == "00000") {
          this.gvUtil.success();
          this.$router.replace({ path: "/redirect" + this.$route.fullPath });
        } else {
          this.$alert(res.message, "无法删除", {
            confirmButtonText: "知道了",
            type: "warning",
          });
        }
      });
    },
    // 启用/禁用
    handleStatus(status) {
      if (status == "DISABLE") {
        this.$confirm("确定要禁用这个机构吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {
          this.putEditStatus(status);
        });
      } else {
        this.putEditStatus(status);
      }
    },
    // 启用/禁用接口
    async putEditStatus(status) {
      let res = await editStatusOrg(this.querys.id, status);
      if (res && res.code == "00000") {
        this.gvUtil.success();
        this.$router.replace({ path: "/redirect" + this.$route.fullPath });
      }
    },
    // 前往计费政策
    toCharge() {
      this.$router.push({
        path: "/org-manage/charge-policy",
        query: {
          id: this.isTopOrg ? this.form.id : this.form.topId,
        },
      });
    },
    // 充值弹窗
    openRecharge() {
      this.rechargeVisible = true;
      this.$refs.ChargeDialog.initComponent(
        this.isTopOrg ? this.form.id : this.form.topId
      );
    },
    // dropdown下拉
    handleCommand(e) {
      switch (e) {
        case "addSonOrg":
          this.toAddSonOrg();
          break;
        case "del":
          this.handleDel();
          break;
        case "stop":
          this.handleStatus("DISABLE");
          break;
        case "start":
          this.handleStatus("NORMAL");
          break;
        case "charge":
          this.toCharge();
          break;
        case "recharge":
          this.openRecharge();
          break;
      }
    },
    // tab切换
    handleTabClick() {},
    // 获取机构详情
    async getOrgDetail() {
      let res = await getOrgDetail(this.querys.id);
      if (res && res.code == "00000") {
        this.form = res.data;
        this.$set(this.form, "topName", this.form.topMechanismName);
      }
    },
  },
  computed: {
    isTopOrg() {
      return this.form.parentId == "0";
    },
  },
  created() {
    this.gvUtil.initTranslate(["OrgStatus"], () => {
      this.getOrgDetail();
      if (this.querys.type == "subCount") {
        this.activeName = "second";
      }
    });
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/variables.scss";
.wrapper {
  padding: 0 20px;
  .header {
    border-bottom: 2px solid #e7e8eb;
    .status_box {
      font-size: 14px;
      color: #fff;
      background: $red;
      width: 70px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 3px;
    }
    .success {
      background: $primary;
    }
  }
  .body {
    padding: 0 10px;
    margin-top: 10px;
    .el-tabs /deep/.el-tabs__header {
      margin-bottom: 0;
      .el-tabs__nav {
        transform: translateX(10px) !important;
      }
    }
  }
}
</style>