<template>
  <div class="wrapper">
    <org-form ref="orgForm" class="form_body pd20" :formData="form"></org-form>
    <div class="bottom_btn_row">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="toAddSonOrg" v-if="type == 'add'"
        >保存并添加子机构</el-button
      >
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { postAddOrg, putAddOrg, getOrgDetail } from "@/api/orgManage";
import orgForm from "./conponents/org-form";
export default {
  name: "org-index",
  components: {
    orgForm,
  },
  props: {
    type: "",
  },
  data() {
    return {
      isReadOnly: false,
      form: {
        isShowQrCode: 1,
        isOpenRegistry: 1,
      },
    };
  },
  methods: {
    async handleSave() {
      this.postAddOrg(() => {
        this.$router.replace({
          path: "/org-manage/org-list/",
        });
      });
    },
    // 保存接口
    async postAddOrg(callBack) {
      let form = await this.$refs.orgForm.getFormData();
      if (!form) {
        this.$message.warning("请完善信息！");
        return;
      }
      if (this.type == "add") {
        form.topId = "0";
        form.parentId = "0";
        form.parentIds = ["0"];
      }
      let res =
        this.type == "edit" ? await putAddOrg(form) : await postAddOrg(form);
      if (res && res.code == "00000") {
        this.gvUtil.success();
        typeof callBack == "function" && callBack(res, form);
      } else {
        this.gvUtil.error(res.message);
      }
    },
    // 跳转添加子机构
    toAddSonOrg() {
      this.postAddOrg((res, form) => {
        this.$router.replace({
          path: "/org-manage/org-son-add/add",
          query: {
            topId: res.data,
            topName: form.name,
            parentId: res.data,
            parentIds: JSON.stringify([res.data]),
          },
        });
      });
    },
    // 获取机构详情
    async initDetail() {
      let res = await getOrgDetail(this.querys.id);
      if (res && res.code == "00000") {
        this.form = res.data;
      }
    },
  },
  created() {
    this.type == "edit" && this.initDetail();
  },
};
</script>

<style lang='less' scoped>
.content {
  padding: 0 10px;
  min-height: 100vh;
  position: relative;
}
</style>